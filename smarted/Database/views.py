import json
import re
import arrow
import pytz
import time
from threading import Thread
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .scrape.ecp_scrape import get_course_assessment
from .scrape.scrape import UQBlackboardScraper
from .models import *
from .serializers import ResourceSerializer, FileSerializer, AnnouncementSerializer

from rest_framework.exceptions import ValidationError, ParseError
from rest_framework.response import Response
from rest_framework.decorators import api_view

is_local = True
FORCE_TEACHER = False

DEFAULT_TEACHER_USER = "Uqjstuaa"
DEFAULT_TEACHER_FIRST_NAME = "Johnno"
DEFAULT_TEACHER_LAST_NAME = "Sri"

DEFAULT_USERS = ["s4532094", "s0000001", "s0000002", "s0000003"]
DEFAULT_FIRST_NAMES = ["Kyle", "Alex", "Steve", "Jess"]

INDEX = 3
DEFAULT_USER = DEFAULT_USERS[INDEX]
DEFAULT_FIRST_NAME = DEFAULT_FIRST_NAMES[INDEX]
DEFAULT_LAST_NAME = "Sanderlands"

from . import teacher_views  # must be down here to avoid circular import error

@csrf_exempt
def force_teacher(request):

    try:
        csrf_token = request.headers.get('Cookie').split('csrftoken=')[
            1].split(';')[0]
    except:
        return HttpResponse("no token found, using normal mode!")

    if request.method == "GET":
        if len(exemptCSRF.objects.filter(csrf=csrf_token)) == 0:
            exempt = exemptCSRF(csrf=csrf_token)
            exempt.save()

    elif request.method == "DELETE":
        if len(exemptCSRF.objects.filter(csrf=csrf_token)) == 1:
            exempt = exemptCSRF.objects.get(csrf=csrf_token)
            exempt.delete()

    return HttpResponse("")

######################## INIT #########################################


def initialize_course(header, stu):
    """
    Helper function for initialize. This function takes in the request header
    and uses either the UQ SSO header or default values to add the student
    and course pairing into the database.
    :param header: a Http Request received by the initialize view
    :param stu: an instance of the student to pair the courses with
    :return: Nothing
    """
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


# FIRST API CALL, INITIALIZES AND RETURNS KEY DETAILS FOR REACT TO USE
def initialize(request):
    """"
    This is the first API call that should be made by the webapp client.
    It uses either their UQ SSO header or default values defined at the top
    to determine the users: Username, Full Name, and Type (student or teacher).
    If this is called by a user not in the database already, they will be
    added in.
    :param request: The Http Request made to the view.
    :return: a json object of basic user details

    (see https://github.com/harryvanroy/SmartED/wiki)
    """
    json_header = request.headers

    # check if request's csrf has an exemption for teacher checks
    CSRF_EXEMPT = False
    try:
        csrf_token = request.headers.get('Cookie').split('csrftoken=')[
            1].split(';')[0]
        CSRF_EXEMPT = True if len(
            exemptCSRF.objects.filter(csrf=csrf_token)) else False
    except:
        pass

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
    if FORCE_TEACHER or CSRF_EXEMPT:
        username = DEFAULT_TEACHER_USER
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
    """
    A view to handle a vark post/get request.
    The user is authenticated with their UQ SSO header, or default values.
    :param request: The Http Request for the view
    :return:
        - If GET request: return a http response of a json object with the
        users VARK details
        - If POST request: the VARK json object in the request body will
        be used to update the VARK in the database for this user

    (see https://github.com/harryvanroy/SmartED/wiki)
    """
    json_header = request.headers
    try:
        username = json.loads(json_header['X-Kvd-Payload'])['user']
    except:
        username = DEFAULT_USER

    if request.method == "POST":
        # POST VARK
        print("post vark request received..")
        json_body = json.loads(request.body)

        V, A, R, K = json_body.get("V"), json_body.get("A"), \
            json_body.get("R"), json_body.get("K")
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


def course_assessment(request=None, courseID=None):
    """
    A view for handling a get request for a courses assessment.
    This function reads the GET request's URL to determine the requested
    course. If the course's assessment exists in the database, it is
    immediately returned, otherwise the ECP scraper is called to scrape
    the assessment info.
    :param request: HttpRequest for the view
    :return: a json list of assessment details for the requested course

    (see https://github.com/harryvanroy/SmartED/wiki)
    """
    if courseID is None:
        id = request.GET.get('id')
    else:
        id = courseID

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
                                                   semester=semester,
                                                   year=year,
                                                   delivery_mode=mode)
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
    """
    A view to handle a request from a student to get their list of courses.
    Uses the UQ SSO header or default values to authenticate the user and
    then fetches courses paired to that user in the database.
    :param request: Http Request for this view
    :return: A json object that lists the courses the user/student does.

    (see https://github.com/harryvanroy/SmartED/wiki)
    """
    json_header = request.headers

    try:
        username = json.loads(json_header['X-Kvd-Payload'])['user']
    except:
        username = DEFAULT_USER

    student = Student.objects.get(user=(User.objects.get(username=username)))

    course_list = [student_course.course for student_course
                   in StudentCourse.objects.filter(student=student)]

    json_courses = [{"id": x.id, "name": x.name, "mode": x.mode,
                     "semester": x.semester, "year": x.year}
                    for x in course_list]

    return HttpResponse(json.dumps(json_courses))


def construct_student_grades(username, course_filter, courseID):
    student = Student.objects.get(user=User.objects.get(username=username))
    course = Course.objects.get(id=courseID)
    if course_filter:

        # makes several null checks
        grades = [grade for grade
                  in StudentAssessment.objects.filter(student=student)
                  if grade.assessment is not None 
                  and grade.assessment.course == course]
    else:
        grades = [grade for grade
                  in StudentAssessment.objects.filter(student=student)]
    
    json_grades = [{"assessment":
                    {"name": grade.assessment.name,
                     "courseName": grade.assessment.course.name,
                     "dateDescription": grade.assessment.dateDescription,
                     "weight": grade.assessment.weight},
                    "grade": str(grade.value)}
                   for grade in grades]

    # expected grade time
    if course_filter:
        total_weight = sum([float(grade.assessment.weight)
                            for grade in grades])
        total_earnt = sum([(float(grade.value) / 100)
                           * float(grade.assessment.weight)
                           for grade in grades])

        if total_weight > 0:
            current_grade = 100 * (total_earnt / total_weight)
        else:
            current_grade = 100

        json_grades = {"items": json_grades,
                       "total_completed": str(total_weight),
                       "total_earnt": str(total_earnt),
                       "current_grade": str(current_grade)}
    return json_grades


def get_student_grades(request):
    """
    A view to handle a request for a student's grades.
    The user is authenticated by the UQ SSO header or default values and
    the assessment grades paired with that student/user are fetched from
    the database.
    :param request: http request for this view.
    :return: A http response of a json object containing a list of the
    students grades for assessment.

    (see https://github.com/harryvanroy/SmartED/wiki)
    """
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

    json_grades = construct_student_grades(username, course_filter, courseID)

    return HttpResponse(json.dumps(json_grades))


@csrf_exempt
def post_course_feedback(request):
    json_header = request.headers
    try:
        username = json.loads(json_header['X-Kvd-Payload'])['user']
    except:
        username = DEFAULT_USER

    json_body = json.loads(request.body)

    courseID = json_body.get('courseID')
    feedback = json_body.get('feedback')
    anonymous = json_body.get('anonymous')

    course = Course.objects.get(id=courseID)
    user = User.objects.get(username=username)

    if len(StudentCourse.objects.filter(course=course)) == 0:
        raise ValidationError

    if len([x for x in CourseFeedback.objects.filter(user=user, course=course)
            if (datetime.datetime.now(pytz.utc) - x.lastUpdated).days == 0]) >= 2:
        # user has already posted twice today!
        return HttpResponse("spam")  # react should use this res to alert

    course_feedback = CourseFeedback(user=user, course=course,
                                     anonymous=anonymous, feedback=feedback)

    course_feedback.save()

    return HttpResponse("")

################ GOALS #################
@csrf_exempt
def post_goals(request, username):
    json_body = json.loads(request.body)

    courseID = json_body.get('courseID')
    type = json_body.get('type')
    is_complete = json_body.get('is_complete') \
        if json_body.get('is_complete') is not None else False
    print("COMPLETE: ", is_complete)

    user = User.objects.get(username=username)
    course = Course.objects.get(id=courseID)

    if type == "COURSEGRADE":
        grade = json_body.get('grade')

        if len(LongTermGoals.objects.filter(user=user, course=course,
                                            type=1)) == 0:
            # new goal
            goal = LongTermGoals(user=user, course=course, type=1,
                                 courseGrade=grade, isComplete=is_complete)
        else:
            # existing goal
            goal = LongTermGoals.objects.get(user=user, course=course,
                                             type=1)
            goal.courseGrade, goal.isComplete = grade, is_complete
        goal.save()

    elif type == "ASSESSMENTGRADE":
        grade = json_body.get('grade')
        assID = json_body.get('assID')
        ass = AssessmentItem.objects.get(id=assID)

        if len(LongTermGoals.objects.filter(user=user, course=course,
                                            assessment=ass, type=2)) == 0:
            # new goal
            goal = LongTermGoals(user=user, course=course, type=2,
                                 assessment=ass, assessmentGrade=grade,
                                 isComplete=is_complete)
        else:
            # existing goal
            goal = LongTermGoals.objects.get(user=user, course=course,
                                             assessment=ass, type=2)
            goal.assessmentGrade, goal.isComplete = grade, is_complete
        goal.save()

    elif type == "STUDYWEEK":
        hours = json_body.get('hours')

        if len(LongTermGoals.objects.filter(user=user, course=course,
                                            type=3)) == 0:
            # new goal
            goal = LongTermGoals(user=user, course=course, type=3,
                                 hourGoal=hours, isComplete=is_complete)
        else:
            # existing goal
            goal = LongTermGoals.objects.get(user=user, course=course,
                                             type=3)
            goal.hourGoal, goal.isComplete = hours, is_complete
        goal.save()

    elif type == "CUSTOM":
        text = json_body.get('text')
        goal = LongTermGoals(user=user, course=course, type=4,
                             customGoal=text, isComplete=is_complete)
        goal.save()
    else:
        print("ruh roh, parse error")
        raise ParseError

    return HttpResponse("")


def get_goals(username):
    course_grades, ass_grades, weekly_study, custom = [], [], [], []

    user = User.objects.get(username=username)

    for goal in LongTermGoals.objects.filter(user=user):

        course_info = {"id": goal.course.id, "name": goal.course.name}

        if goal.type == 1:  # course grade goal
            course_grades.append({"id": goal.id, "course": course_info,
                                  "grade": goal.courseGrade,
                                  "is_complete": goal.isComplete})
        elif goal.type == 2:  # ass grade goal
            ass_info = {"id": goal.assessment.id,
                        "name": goal.assessment.name}
            ass_grades.append({"id": goal.id, "course": course_info,
                               "assessment": ass_info,
                               "grade": goal.assessmentGrade,
                               "is_complete": goal.isComplete})
        elif goal.type == 3:  # weekly study goal
            weekly_study.append({"id": goal.id, "course": course_info,
                                 "hours": goal.hourGoal,
                                 "is_complete": goal.isComplete})
        elif goal.type == 4:
            custom.append({"id": goal.id, "course": course_info,
                           "text": goal.customGoal,
                           "is_complete": goal.isComplete})

    all_goals = {"COURSEGRADE": course_grades,
                 "ASSESSMENTGRADE": ass_grades,
                 "STUDYWEEK": weekly_study,
                 "CUSTOM": custom}

    return HttpResponse(json.dumps(all_goals))


def delete_goal(request, username):
    goalID = request.GET.get('id')
    try:
        goalID = int(goalID)
    except:
        raise ParseError

    goal = LongTermGoals.objects.get(id=goalID)

    if goal.user.username != username:
        raise ValidationError
    else:
        goal.delete()

    return HttpResponse("")


@csrf_exempt
def goals(request):
    json_header = request.headers
    try:
        username = json.loads(json_header['X-Kvd-Payload'])['user']
    except:
        username = DEFAULT_USER

    if request.method == "POST":
        return post_goals(request, username)
    elif request.method == "GET":
        return get_goals(username)
    elif request.method == "DELETE":
        return delete_goal(request, username)
    else:
        raise ParseError


def refresh_content(username, password):
    scraper = UQBlackboardScraper(username, password, chrome=is_local)
    courses = scraper.get_current_courses()
    print(courses)
    for course in courses.keys():
        courses[course]['announcements'] = scraper.get_course_announcements(
            course)
        courses[course]['resources'] = scraper.get_learning_resources(course)
        courses[course]['assessment'] = scraper.get_course_assessment(course)

    scraper.driver.quit()
    return courses


def save_announcements(course, announcements):
    """
    Save course announcements to the database

    Args:
        course (Course) : Object representing a course from the database
        announcements (Dict<int : Dict<String : String(s)>>): bears the form
        id -> (
            "title" : "[TITLE]", 
            "content" : "[CONTENT]", 
            "date" : "DAY, DAY# MONTH YEAR hh:mm:ss [AM/PM] AEST"
        )
    """
    def format_date(date):
        FORMAT = "D MMMM YYYY"
        split_date = date.split(" ")
        cleaned_date = "{} {} {}".format(
            split_date[1], split_date[2], split_date[3])
        return arrow.get(cleaned_date, FORMAT).format('YYYY-MM-DD')

    for post in announcements.keys():
        announcement = Announcement(
            id=post,
            title=announcements[post]['title'],
            content=announcements[post]['content'],
            isBlackboardGenerated=True,
            dateAdded=format_date(announcements[post]['date']),
            course=course
        )
        announcement.save()


def save_resources(course, resources, assessed):
    """
    Save course announcements to the database

    Args:
        course (Course) : Object representing a course from the database
        resources (Dict<int : Dict<String : String(s)>>): bears the form
        id -> (
            "name" : "[NAME]", 
            "type" : "[TYPE]", 
            "links" : [l1, l2, ..., lN]
        )
    """
    for item_id in resources.keys():
        folder = File(
            id=item_id,
            name=resources[item_id]['name'],
            category=resources[item_id]['type'],
            isAssessment=assessed,
            course=course
        )
        folder.save()
        for link, title in resources[item_id]['links'].items():
            resource = Resource(
                title=title,  
                isBlackboardGenerated=True,
                blackboardLink=link,
                folder=folder
            )
            resource.save()

def asynchronous_refresh(username, password):
    """
    Refresh blackboard information for a given user

    Args:
        request (HttpRequest): post request sent from client side
    """
    start = time.time()
    courses = refresh_content(username, password)

    for course in courses.keys():
        subject = Course.objects.get(
            name=courses[course]['code'].split("/")[0])
        save_announcements(subject, courses[course]['announcements'])
        save_resources(subject, courses[course]['resources'], False)
        save_resources(subject, courses[course]['assessment'], True)
    print("Thread took ", time.time() - start)
    return # Thread dies here

@csrf_exempt
def refresh(request):
    """
    Refresh blackboard information for a given user

    Args:
        request (HttpRequest): post request sent from client side
    """
    BAD_REQUEST = HttpResponse('This aint it chief')
    if request.method != 'POST':
        return BAD_REQUEST    
    json_body = json.loads(request.body)

    username = json_body.get("username")
    password = json_body.get("password")
    if username is None or password is None:
        return BAD_REQUEST
        
    asynchronous_refresh(username, password)

    return HttpResponse("SUCCESS")

@api_view(['GET'])
def get_course_files(request, course_id):
    """
    View course directories using a course id

    Args:
        course_id (int): The given course identifier

    Returns:
        JSON: List of files and their fields
    """
    BAD_REQUEST = HttpResponse('This aint it chief')
    if request.method != 'GET':
        return BAD_REQUEST
    course = Course.objects.get(id=course_id)
    course_files = File.objects.filter(course=course)
    serializer = FileSerializer(course_files, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def get_course_resources(request, course_id, file_id=-1):
    """
    View course resources using a course id

    Args:
        course_id (int): The given course identifier
        file_id (int): The given file identifier (default=-1)

    Returns:
        JSON: List of courses and their fields
    """
    BAD_REQUEST = HttpResponse('This aint it chief')
    if request.method != 'GET':
        return BAD_REQUEST
    course = Course.objects.get(id=course_id)
    if file_id != -1:
        course_files = File.objects.filter(course=course, id=file_id)
    else:
        course_files = File.objects.filter(course=course)
    course_resources = Resource.objects.filter(folder__in=course_files.values('id'))
    serializer = ResourceSerializer(course_resources, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_course_announcements(request, course_id):
    """
    View course announcements using a course id

    Args:
        course_id (int): The given course identifier

    Returns:
        JSON: List of announcements and their fields
    """

    BAD_REQUEST = HttpResponse('This aint it chief')
    if request.method != 'GET':
        return BAD_REQUEST
    course = Course.objects.get(id=course_id)
    course_announcements = Announcement.objects.filter(course=course)
    serializer = AnnouncementSerializer(course_announcements, many=True)
    return Response(serializer.data)

##############################################
