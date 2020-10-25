import json
import random

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.exceptions import ValidationError, ParseError
from .scrape.ecp_scrape import get_course_assessment
from .scrape.scrape import *
from .models import *
from . import views
import re

# if enabled, overrides student/teacher check
FORCE_TEACHER = views.FORCE_TEACHER
# used if student/teacher check is overridden
DEFAULT_TEACHER_USER = views.DEFAULT_TEACHER_USER

# returns a boolean for success/fail and the teachers username


def authorize_teacher(header):

    # check if request's csrf has an exemption for teacher checks
    CSRF_EXEMPT = False
    try:
        csrf_token = header.get('Cookie').split('csrftoken=')[1].split(';')[0]
        CSRF_EXEMPT = True if len(
            exemptCSRF.objects.filter(csrf=csrf_token)) else False
    except:
        pass

    try:
        # there might be edge cases for this...
        if header['X-Uq-User-Type'] == 'Student':
            if not FORCE_TEACHER and not CSRF_EXEMPT:
                # no teacher overwrite and not a real teacher
                return False, "error"
        else:
            # this is a legit teacher
            username = json.loads(header['X-Kvd-Payload'])['user']
            return True, username
    except:
        pass

    # either on live server and FORCE_TEACHER, or on local...
    # ...and therefore FORCE_TEACHER
    return True, DEFAULT_TEACHER_USER


def initialize_teacher_courses(header, staff):
    sem = 2
    year = 2020
    mode = 'EXTERNAL'

    # Initialize UQ if needed
    if len(Institution.objects.filter(name="University of Queensland")) == 0:
        UQ = Institution(name="University of Queensland")
        UQ.save()

    # initializes with these default courses, feel free to add more
    courses = ["DECO3801"]

    for course in courses:
        if len(Course.objects.filter(name=course, mode=mode,
                                     semester=sem, year=year)) == 0:
            # course not already in database
            print("saving course...")
            UQ = Institution.objects.get(name="University of Queensland")
            course_obj = Course(name=course, mode=mode, semester=sem,
                                year=year, institution=UQ)
            course_obj.save()

        course_obj = Course.objects.filter(name=course, mode=mode,
                                           semester=sem, year=year)[0]
        print(course_obj)

        # SAVE STAFF COURSES

        if len(StaffCourse.objects
               .filter(staff=staff, course=course_obj)) == 0:
            print("saving studentCourse...")
            staff_course = StaffCourse(staff=staff, course=course_obj)
            staff_course.save()


def get_teacher_courses(request):
    json_header = request.headers

    auth, username = authorize_teacher(json_header)

    if not auth:
        return HttpResponse("failed teacher auth...")

    staff = Staff.objects.get(user=User.objects.get(username=username))

    course_list = [staff_course.course for staff_course
                   in StaffCourse.objects.filter(staff=staff)]

    json_courses = [{"id": x.id, "name": x.name, "mode": x.mode,
                     "semester": x.semester, "year": x.year}
                    for x in course_list]

    return HttpResponse(json.dumps(json_courses))


@csrf_exempt
def remove_teacher_course(request):
    json_header = request.headers

    auth, username = authorize_teacher(json_header)

    if not auth:
        return HttpResponse("failed teacher auth...")

    if request.method != "DELETE":
        raise ParseError

    staff = Staff.objects.get(user=User.objects.get(username=username))

    courseID = request.GET.get('id')
    try:
        course = Course.objects.get(id=courseID)
    except:
        raise ParseError

    if len(StaffCourse.objects.filter(staff=staff, course=course)) == 0:
        raise ParseError
    else:
        StaffCourse.objects.get(staff=staff, course=course).delete()

    return HttpResponse("")


@csrf_exempt
def add_teacher_course(request):
    json_header = request.headers
    json_body = json.loads(request.body)

    auth, username = authorize_teacher(json_header)

    if not auth:
        return HttpResponse("failed teacher auth...")

    staff = Staff.objects.get(user=User.objects.get(username=username))

    try:
        course = json_body.get("course")
        mode = "EXTERNAL"
        sem = 2
        year = 2020
    except:
        raise ParseError

    if len(Course.objects.filter(name=course, mode=mode,
                                 semester=sem, year=year)) == 0:
        # course not already in database
        UQ = Institution.objects.get(name="University of Queensland")
        course_obj = Course(name=course, mode=mode, semester=sem,
                            year=year, institution=UQ)
        course_obj.save()

    course_obj = Course.objects.get(name=course, mode=mode,
                                    semester=sem, year=year)

    # scrape assessment, if successful, yeehaw, else parseError
    if "error" in str(views.course_assessment(request=None,
                                              courseID=course_obj.id).content):
        raise ParseError

    # add teacher
    course_obj.save()

    if len(StaffCourse.objects
           .filter(staff=staff, course=course_obj)) == 0:
        print("saving studentCourse...")
        staff_course = StaffCourse(staff=staff, course=course_obj)
        staff_course.save()

    return HttpResponse("ok")


def students_in_course(request):
    json_header = request.headers

    auth, username = authorize_teacher(json_header)

    if not auth:
        return HttpResponse("failed teacher auth...")

    id = request.GET.get('id')
    try:
        id = int(id)
    except:
        return HttpResponse("failed query... specify the course ID...")

    # todo: check staff has access to course here

    course = Course.objects.get(id=id)

    students = [stu_course.student for stu_course in
                StudentCourse.objects.filter(course=course)]

    json_students = [{"username": student.user.username,
                      "firstname": student.user.firstName,
                      "lastname": student.user.lastName}
                     for student in students]

    return HttpResponse(json.dumps(json_students))


@csrf_exempt
def student_assessment_grade(request):
    json_body = json.loads(request.body)
    json_header = request.headers

    auth, username = authorize_teacher(json_header)

    if not auth:
        return HttpResponse("failed teacher auth...")

    # todo: check staff has access to course here

    ass_item = AssessmentItem.objects.get(id=json_body.get("assID"))
    stu_user = User.objects.get(username=json_body.get("studentID"))
    student = Student.objects.get(user=stu_user)

    grade = json_body.get("grade")
    # pass_fail = json_body.get("passed")

    # check if grade already exists
    if len(StudentAssessment.objects
           .filter(student=student, assessment=ass_item)) == 0:
        student_ass = StudentAssessment(student=student, assessment=ass_item,
                                        value=grade)
    else:
        student_ass = StudentAssessment.objects.get(student=student,
                                                    assessment=ass_item)
        student_ass.value = grade

    student_ass.save()

    return HttpResponse("")


def students_at_risk(request):
    json_header = request.headers

    auth, username = authorize_teacher(json_header)

    if not auth:
        return HttpResponse("failed teacher auth...")

    id = request.GET.get('id')
    try:
        id = int(id)
    except:
        return HttpResponse("failed query... specify the course ID...")

    # todo: check staff has access to course here

    course = Course.objects.get(id=id)

    students_in_course = [stu_course.student for stu_course in
                          StudentCourse.objects.filter(course=course)]

    students_at_risk = []

    for student in students_in_course:

        grades = [grade for grade
                  in StudentAssessment.objects.filter(student=student)
                  if grade.assessment is not None
                  and grade.assessment.course == course]

        total_weight = sum([float(grade.assessment.weight)
                            for grade in grades])
        total_earnt = sum([(float(grade.value) / 100)
                           * float(grade.assessment.weight)
                           for grade in grades])

        if total_weight > 0:
            current_grade = 100 * (total_earnt / total_weight)
        else:
            current_grade = 100

        if current_grade < 50:
            students_at_risk.append({"student":
                                     {"username": student.user.username,
                                      "firstname": student.user.firstName,
                                      "lastname": student.user.lastName},
                                     "grade": current_grade})

    students_at_risk = sorted(students_at_risk, key=lambda i: i['grade'])

    return HttpResponse(json.dumps(students_at_risk))


def get_course_feedback(request):
    json_header = request.headers

    auth, username = authorize_teacher(json_header)

    if not auth:
        return HttpResponse("failed teacher auth...")

    id = request.GET.get('id')

    try:
        course = Course.objects.get(id=id)
    except:
        return HttpResponse("failed query.. specify the correct course ID...")

    # todo: check teacher in course

    json_feedback = [{"user": ({"username": x.user.username,
                                "name": f"{x.user.firstName} {x.user.lastName}"}
                               if not x.anonymous else {"username": "anon",
                                                        "name": "Anonymous"}),
                      "feedback": x.feedback}
                     for x in CourseFeedback.objects.filter(course=course)]
    return HttpResponse(json.dumps(json_feedback))


def get_average_vark(request):
    json_header = request.headers

    auth, username = authorize_teacher(json_header)

    if not auth:
        return HttpResponse("failed teacher auth...")

    id = request.GET.get('id')

    try:
        course = Course.objects.get(id=id)
    except:
        return HttpResponse("failed query.. specify the correct course ID...")

    # todo: check teacher in course

    students = [
        stu.student for stu in StudentCourse.objects.filter(course=course)]

    V, A, R, K = [float(x.V) for x in students if x.V is not None], \
        [float(x.A) for x in students if x.A is not None], \
        [float(x.R) for x in students if x.R is not None], \
        [float(x.K) for x in students if x.K is not None]

    def avg(arr):
        if len(arr) == 0:
            return None

        return sum(arr) / float(len(arr))

    vark = {"V": avg(V), "A": avg(A), "R": avg(R), "K": avg(K)}

    return HttpResponse(json.dumps(vark))


def get_student_vark(request):
    json_header = request.headers

    auth, username = authorize_teacher(json_header)

    if not auth:
        return HttpResponse("failed teacher auth...")

    username = request.GET.get('username')

    try:
        student = Student.objects.get(user=User.objects.get(username=username))
    except:
        return HttpResponse("failed query.. specify the correct student id...")

    # todo: check student in teachers course

    json_vark = {"V": str(student.V), "A": str(student.A),
                 "R": str(student.R), "K": str(student.K)}

    return HttpResponse(json.dumps(json_vark))


def students_course_grade(request):
    json_header = request.headers

    auth, username = authorize_teacher(json_header)

    if not auth:
        return HttpResponse("failed teacher auth...")

    id = request.GET.get('id')

    try:
        course = Course.objects.get(id=id)
    except:
        return HttpResponse("failed query.. specify the correct course ID...")

    students = [
        stu.student for stu in StudentCourse.objects.filter(course=course)]

    student_grades = [{"student": {"username": stu.user.username,
                                   "firstname": stu.user.firstName,
                                   "lastname": stu.user.lastName},
                       "grades": views.construct_student_grades(stu.user.username, True, int(id))}
                      for stu in students]

    return HttpResponse(json.dumps(student_grades))


@csrf_exempt
def assign_resource_vark(request):
    json_body = json.loads(request.body)
    json_header = request.headers

    auth, username = authorize_teacher(json_header)

    if not auth:
        return HttpResponse("failed teacher auth...")

    # todo: check staff has access to course here

    resource = Resource.objects.get(blackboardLink=json_body.get("link"))

    resource.V, resource.A, resource.R, resource.K = json_body.get("V"), \
        json_body.get("A"), json_body.get("R"), json_body.get("K")

    resource.save()

    return HttpResponse("")
