from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from .scrape.ecp_scrape import get_course_assessment
from .scrape.scrape import *
from .models import Course, Institution, AssessmentItem, StudentCourse, \
    User, Student, Staff, StaffCourse, StudentAssessment
from django.core import serializers
import json
import random

student_keys = []
teacher_keys = []


# ##### TEACHERS #########################################################

def teacher_auth(username, password):
    # note, this should be a real method, but i have no idea how
    # we'd verify teachers

    # could maybe just add to database manually and assume that smartEd
    # admins will manually verify/add teachers
    return True


@csrf_exempt
def teacher_login(request):
    json_body = json.loads(request.body)
    username = json_body.get("username")
    password = json_body.get("password")

    if username is not None and password is not None:

        successful_login = teacher_auth(username, password)

        if successful_login:
            # todo: the following is poor practice, temporary only...
            random.seed(password)
            key = random.randint(0, 1000000)
            # save username with key such that the session continues
            teacher_keys.append({"username": username, "key": key})

            jsons_response = "{" + \
                             f'"key": {key}' + "}"
            return HttpResponse(jsons_response)

    return HttpResponse('err')


@csrf_exempt
def students_in_course(request):
    json_body = json.loads(request.body)
    username = json_body.get("username")
    key = json_body.get("key")

    if len([user for user in teacher_keys
            if user["username"] == username and user["key"] == key]) == 0:
        return HttpResponse("auth failed..")

    course = Course.objects.get(id=json_body.get("courseID"))

    students = [stu_course.student for stu_course in
                StudentCourse.objects.filter(course=course)]

    json_students = [{"username": student.user.username for student in students}]

    return HttpResponse(json.dumps(json_students))


@csrf_exempt
def student_assessment_grade(request):
    json_body = json.loads(request.body)
    username = json_body.get("username")
    key = json_body.get("key")

    if len([user for user in teacher_keys
            if user["username"] == username and user["key"] == key]) == 0:
        return HttpResponse("auth failed..")

    ass_item = AssessmentItem.objects.get(id=json_body.get("assID"))

    # todo: check staff can actually modify course here (i.e. is in courseStaff)

    stu_user = User.objects.get(username=json_body.get("studentID"))
    student = Student.objects.get(user=stu_user)

    grade = json_body.get("grade")
    # pass_fail = json_body.get("passed")

    student_ass = StudentAssessment(student=student, assessment=ass_item,
                                    value=grade)
    student_ass.save()

    return HttpResponse("")


# ### END TEACHER ###################################################


# ##### VARK #########################################################
# todo: can probably condense these into 1 method, ngl

@csrf_exempt
def post_vark(request):
    json_body = json.loads(request.body)
    username = json_body.get("username")
    key = json_body.get("key")

    if len([user for user in student_keys
            if user["username"] == username and user["key"] == key]) == 0:
        return HttpResponse("auth failed..")

    V, A, R, K = json_body.get("V"), json_body.get("A"), json_body.get("R"), \
                 json_body.get("K")
    print(V,A,R,K)

    user = User.objects.get(username=username)
    stu = Student.objects.get(user=user)
    stu.V, stu.A, stu.R, stu.K = V, A, R, K
    stu.save()
    return HttpResponse("")


@csrf_exempt
def get_vark(request):
    json_body = json.loads(request.body)
    username = json_body.get("username")
    key = json_body.get("key")

    if len([user for user in student_keys
            if user["username"] == username and user["key"] == key]) == 0:
        return HttpResponse("auth failed..")
    user = User.objects.get(username=username)
    stu = Student.objects.get(user=user)
    json_response = {"V": str(stu.V), "A": str(stu.A),
                     "R": str(stu.R), "K": str(stu.K)}
    return HttpResponse(json.dumps(json_response))


# ##### END VARK ##############################################################


@csrf_exempt
def course_assessment(request):
    json_body = json.loads(request.body)

    id = json_body.get("id")
    if id is None:
        HttpResponse("failed query... specify the course ID pls..")

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
        json_assessment = [x["fields"] for x
                           in json.loads(serializers.serialize('json', saved_assessment))]
        print("loaded course assessment from database")
        return HttpResponse(json.dumps(json_assessment))
    else:
        scraped_assessment = get_course_assessment(course_code=name,
                                                   semester=semester,
                                                   year=year, delivery_mode=mode)
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
        json_assessment = [x["fields"] for x
                           in json.loads(serializers.serialize('json', saved_assessment))]
        print("loaded course assessment from database")
        return HttpResponse(json.dumps(json_assessment))


def blackboard_scrape(username, pword, chrome=False):
    print("logging in...")
    scraper = UQBlackboardScraper(username, pword, chrome=chrome)

    # todo: need to actual verify the scraper logged in correctly
    if len(User.objects.filter(username=username)) > 0:
        print("user already exists...")
        return True

    print("getting courses...")
    # get courses
    raw_dict = scraper.get_current_courses()

    if len(raw_dict) == 0:
        return False

    user = User(username=username, firstName="todo", lastName="todo")
    student = Student(user=user)

    user.save()
    student.save()

    if len(Institution.objects.filter(name="University of Queensland")) == 0:
        UQ = Institution(name="University of Queensland")
        UQ.save()
        print("made uq institution")

    raw_courses = [raw_dict.get(key) for key in raw_dict.keys()]

    print("debug: ", raw_courses)

    for course in raw_courses:
        code = course['code'].split('/')[0]
        mode = course['delivery']

        # note: below needs testing
        if 'internal' in mode:
            mode = 'INTERNAL'
        elif 'external' in mode:
            mode = 'EXTERNAL'

        sem = int(course['semester'].split()[1])
        year = int(course['year'])

        if len(Course.objects.filter(name=code, mode=mode,
                                     semester=sem, year=year)) == 0:
            # course not already in database
            print("saving course...")
            UQ = Institution.objects.get(name="University of Queensland")
            course_obj = Course(name=code, mode=mode, semester=sem,
                                year=year, institution=UQ)
            course_obj.save()

        course_obj = Course.objects.filter(name=code, mode=mode,
                                           semester=sem, year=year)[0]

        if len(StudentCourse.objects
                .filter(student=student, course=course_obj)) == 0:
            print("saving studentCourse...")
            stu_course = StudentCourse(student=student, course=course_obj)
            stu_course.save()

    # add resources to database and whatever else here

    return True


@csrf_exempt  # warning: might be bad practice?
def log_in(request):
    # extract json from post method
    # todo: subject to change depending on how we decide to format
    json_post = json.loads(request.body)
    username = json_post.get("username")
    pword = json_post.get("password")

    if username is not None and pword is not None:
        # this is where the login scrape is called
        # the scrape checks if their data is in the database already
        # else it will login and add all relevant data to database.
        # it should return something that indicates if the log in
        # was successful

        successful_login = blackboard_scrape(username, pword, chrome=True)
        if successful_login:
            # todo: the following is VERY poor practice, temporary only...
            random.seed(pword)
            key = random.randint(0, 1000000)
            # save username with key such that the session continues
            student_keys.append({"username": username, "key": key})

            jsons_response = "{" + \
                             f'"key": {key}' + "}"
            return HttpResponse(jsons_response)

    return HttpResponse('err')


@csrf_exempt
def get_student_courses(request):
    json_body = json.loads(request.body)
    username = json_body.get("username")
    key = json_body.get("key")

    if username is None or key is None:
        return HttpResponse('err')

    # checks auth
    if len([user for user in student_keys
            if user["username"] == username and user["key"] == key]):
        print("auth success for " + username + " " + str(key))

        # auth successful - now get courses here
        course_list = [student_course.course for student_course in StudentCourse.objects.all()
                       if student_course.student.user.username == username]

        json_courses = [{"id": x.id, "name": x.name, "mode": x.mode,
                         "semester": x.semester, "year": x.year}
                        for x in course_list]

        return HttpResponse(json.dumps(json_courses))

    else:
        return HttpResponse("failed auth")



@csrf_exempt
def get_student_grades(request):
    json_body = json.loads(request.body)
    username = json_body.get("username")
    key = json_body.get("key")
    course_filter = True
    try:
        course = Course.objects.get(id=json_body.get("courseID"))
    except:
        course_filter = False

    if username is None or key is None:
        return HttpResponse('err')

    # check auth
    if len([user for user in student_keys
            if user["username"] == username and user["key"] == key]) == 0:
        return HttpResponse("auth failed..")

    student = Student.objects.get(user=User.objects.get(username=username))

    if course_filter:
        grades = [grade for grade in StudentAssessment.objects.all()
                  if grade.student == student and grade.assessment.course == course]
    else:
        grades = [grade for grade in StudentAssessment.objects.filter(student=student)]

    json_grades = [{"assessment":
                        {"name": grade.assessment.name,
                         "courseName": grade.assessment.course.name,
                         "dateDescription": grade.assessment.dateDescription,
                         "weight": grade.assessment.weight},
                    "grade": str(grade.value)}
                   for grade in grades]

    return HttpResponse(json.dumps(json_grades))
