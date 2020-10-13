import json
import random

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .scrape.ecp_scrape import get_course_assessment
from .models import *
import re

is_local = True
FORCE_TEACHER = False

DEFAUlT_TEACHER_USER = "uqTeacher1"
DEFAULT_TEACHER_FIRST_NAME = "Johnno"
DEFAULT_TEACHER_LAST_NAME = "Sri"

DEFAULT_USER = "s4532094"
DEFAULT_FIRST_NAME = "George"
DEFAULT_LAST_NAME = "Test"

from . import teacher_views  # down here to avoid circular import error

######################## INIT #########################################

# helper for initialize
def initialize_course(header, stu):
    sem = 2
    year = 2020
    mode = 'EXTERNAL'

    # Initialize UQ if needed
    if len(Institution.objects.filter(name="University of Queensland")) == 0:
        UQ = Institution(name="University of Queensland")
        UQ.save()

    courses = []
    try:
        groups = json.loads(header['X-Kvd-Payload'])['groups']
        for g in groups:
            match = re.search(r'uq:[a-zA-Z]{4}[0-9]{4}_*_*', g)
            if match:
                print(match.string.split("uq:")[1].split("_")[0])
                courses.append(match.string.split("uq:")[1].split("_")[0])
    except:
        courses = ['COMP3301', "DECO3801", "COMP3506", "COMS4200", "ECON3520"]

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

        # SAVE STUDENT COURSES

        if len(StudentCourse.objects
                       .filter(student=stu, course=course_obj)) == 0:
            print("saving studentCourse...")
            stu_course = StudentCourse(student=stu, course=course_obj)
            stu_course.save()
    #


# FIRST API CALL, INITIALIZES AND RETURNS KEY DETAILS FOR REACT TO USE
def initialize(request):
    json_header = request.headers

    # basic user info
    try:
        # extracts from header (works only on live site)
        is_student = json_header['X-Uq-User-Type'] == 'Student'
        first_name = json.loads(json_header['X-Kvd-Payload'])['firstname']
        last_name = json.loads(json_header['X-Kvd-Payload'])['lastname']
        username = json.loads(json_header['X-Kvd-Payload'])['user']
    except:
        # default student data if header fetch fails (i.e. not on live site)
        is_student = True
        first_name = DEFAULT_FIRST_NAME
        last_name = DEFAULT_LAST_NAME
        username = DEFAULT_USER

    # overwrites fetched data if force_teacher flag is set
    if FORCE_TEACHER:
        username = DEFAUlT_TEACHER_USER
        first_name = DEFAULT_TEACHER_FIRST_NAME
        last_name = DEFAULT_TEACHER_LAST_NAME
        is_student = False

    user = User(username=username, firstName=first_name, lastName=last_name)
    user.save()

    if is_student:
        if len(Student.objects.filter(user=user)) == 0:
            stu = Student(user=user)
            stu.save()
        else:
            stu = Student.objects.get(user=user)
        initialize_course(json_header, stu)
    else:
        if len(Staff.objects.filter(user=user)) == 0:
            teacher = Staff(user=user)
            teacher.save()
        else:
            teacher = Staff.objects.get(user=user)
        teacher_views.initialize_teacher_courses(json_header, teacher)

    return HttpResponse(json.dumps({"firstname": first_name,
                                    "lastname": last_name,
                                    "username": username,
                                    "is_student": int(is_student)}))

#########################################################

@csrf_exempt  # has to be csrf excempt for post request
def vark(request):
    json_header = request.headers
    try:
        username = json.loads(json_header['X-Kvd-Payload'])['user']
    except:
        username = DEFAULT_USER

    if request.method == "POST":
        # POST VARK
        print("post vark request received..")
        json_body = json.loads(request.body)

        V, A, R, K = json_body.get("V"), json_body.get("A"), json_body.get("R"), \
                     json_body.get("K")
        print(V, A, R, K)

        user = User.objects.get(username=username)
        stu = Student.objects.get(user=user)
        stu.V, stu.A, stu.R, stu.K = V, A, R, K
        stu.save()
        return HttpResponse("")
    else:
        print("get vark request received...")
        # GET VARK
        user = User.objects.get(username=username)
        stu = Student.objects.get(user=user)
        json_response = {"V": str(stu.V), "A": str(stu.A),
                         "R": str(stu.R), "K": str(stu.K)}
        return HttpResponse(json.dumps(json_response))


def course_assessment(request):
    id = request.GET.get('id')

    try:
        id = int(id)
    except:
        return HttpResponse("failed query... specify the course ID...")

    course = Course.objects.get(id=id)

    if course is None:
        return HttpResponse("load error... course ID not in database")

    name = course.name
    semester = course.semester
    mode = course.mode
    year = course.year

    saved_assessment = AssessmentItem.objects.filter(course=id)

    # check if assessment in database.. if so, return them.. else, scrape em
    if len(saved_assessment) != 0:

        json_assessment = [{"id": x.id, "name": x.name, "course": x.course.id,
                            "isDate": x.isDate, "date": x.date,
                            "dateDescription": x.dateDescription,
                            "isPassFail": x.isPassFail, "weight": x.weight}
                           for x in saved_assessment]

        print("loaded course assessment from database")
        return HttpResponse(json.dumps(json_assessment))
    else:
        scraped_assessment = get_course_assessment(course_code=name,
                                                   semester=semester, year=year, delivery_mode=mode)
        if scraped_assessment is False:
            return HttpResponse("error scraping assessment... contact george?")

        for assignment in scraped_assessment:
            # todo: fix description
            ass_item = AssessmentItem(name=assignment.get('name'),
                                      dateDescription=assignment.get('date'),
                                      weight=assignment.get('weight'),
                                      course=course,
                                      isPassFail=assignment.get('isPassFail'))
            ass_item.save()
        print("saved assessment to database...")

        saved_assessment = AssessmentItem.objects.filter(course=id)
        json_assessment = [{"id": x.id, "name": x.name, "course": x.course.id,
                            "isDate": x.isDate, "date": x.date,
                            "dateDescription": x.dateDescription,
                            "isPassFail": x.isPassFail, "weight": x.weight}
                           for x in saved_assessment]
        print("loaded course assessment from database")
        return HttpResponse(json.dumps(json_assessment))


def get_student_courses(request):
    json_header = request.headers

    try:
        username = json.loads(json_header['X-Kvd-Payload'])['user']
    except:
        username = DEFAULT_USER

    course_list = [student_course.course for student_course in StudentCourse.objects.all()
                   if student_course.student.user.username == username]

    json_courses = [{"id": x.id, "name": x.name, "mode": x.mode,
                     "semester": x.semester, "year": x.year}
                    for x in course_list]

    return HttpResponse(json.dumps(json_courses))


def get_student_grades(request):
    json_header = request.headers
    try:
        username = json.loads(json_header['X-Kvd-Payload'])['user']
    except:
        username = DEFAULT_USER

    courseID = request.GET.get('id')
    try:
        courseID = int(courseID)
        course_filter = True
    except:
        course_filter = False

    student = Student.objects.get(user=User.objects.get(username=username))

    if course_filter:
        print(courseID)
        grades = [grade for grade in StudentAssessment.objects.filter(student=student)
                  if grade.assessment.course.id == courseID]
    else:
        grades = [grade for grade in StudentAssessment.objects.filter(student=student)]

    json_grades = [{"assessment":
                        {"name": grade.assessment.name,
                         "courseName": grade.assessment.course.name,
                         "dateDescription": grade.assessment.dateDescription,
                         "weight": grade.assessment.weight},
                    "grade": str(grade.value)}
                   for grade in grades]

    # expected grade time
    if course_filter:
        total_weight = sum([float(grade.assessment.weight) for grade in grades])
        total_earnt = sum([(float(grade.value) / 100) * float(grade.assessment.weight)
                           for grade in grades])

        if total_weight > 0:
            current_grade = 100 * (total_earnt / total_weight)
        else:
            current_grade = 100

        print(total_weight, total_earnt)

        json_grades = {"items": json_grades, "total_completed": str(total_weight),
                       "total_earnt": str(total_earnt),
                       "current_grade": str(current_grade)}

    return HttpResponse(json.dumps(json_grades))
