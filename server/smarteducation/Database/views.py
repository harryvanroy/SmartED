from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from .ecp_scrape import get_course_assessment
from .models import Course, Institution, Assessment, StudentCourse
from .serializers import AssessmentSerializer
from django.core import serializers
import json
import random

user_keys = []


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

    saved_assessment = Assessment.objects.filter(course=id)

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
            ass_item = Assessment(name=assignment.get('name'), description="",
                                  date=assignment.get('date'),
                                  weight=assignment.get('weight'),
                                  course=course)
            ass_item.save()
        print("saved assessment to database...")

        saved_assessment = Assessment.objects.filter(course=id)
        json_assessment = [x["fields"] for x
                           in json.loads(serializers.serialize('json', saved_assessment))]
        print("loaded course assessment from database")
        return HttpResponse(json.dumps(json_assessment))


def course_assessment_old(request):
    json_body = json.loads(request.body)

    # todo: might change this to just get course ID code instead... it depends on implementation
    course = json_body.get("name")
    sem = json_body.get("sem")
    year = json_body.get("year")
    mode = json_body.get("mode")
    print(sem)
    # validate json
    if course is None or sem is None or year is None or mode is None:
        return HttpResponse("failed query... "
                            "check your json format (need name, sem, year, mode)")

    # search database for course
    for saved_course in Course.objects.all():
        if saved_course.name == course:  # check sem, year, mode too!
            database_course_obj = saved_course

            saved_assessment = [saved_ass for saved_ass in Assessment.objects.all()
                                if saved_ass.course == database_course_obj]

            json_assessment = [x["fields"] for x in json.loads(serializers.serialize('json', saved_assessment))]
            print("loaded course assessment from database")
            return HttpResponse(json.dumps(json_assessment))

    UQ = [institution for institution in Institution.objects.all()
          if institution.name == 'University of Queensland'][0]

    database_course_obj = Course(name=course, semester=sem, year=year, mode=mode, institution=UQ)
    database_course_obj.save()
    print('saved course to database')

    # mode and year too and put into function
    assessment = get_course_assessment(course)

    if assessment is False:
        return HttpResponse('epic fail')

    for assignment in assessment:
        ass_item = Assessment(name=assignment.get('name'), description="",
                              date=assignment.get('date'), weight=assignment.get('weight'),
                              course=database_course_obj)
        ass_item.save()
    print('saved assessment to database')

    for saved_course in Course.objects.all():
        if saved_course.name == course:  # check sem, year, mode too!
            database_course_obj = saved_course

            saved_assessment = [saved_ass for saved_ass
                                in Assessment.objects.all()
                                if saved_ass.course == database_course_obj]

            json_assessment = \
                [x["fields"] for x
                 in json.loads(serializers.serialize('json', saved_assessment))]

            return HttpResponse(json.dumps(json_assessment))


@csrf_exempt  # warning: might be bad practice?
def log_in(request):
    if request.method == 'POST':

        # extract json from post method
        # todo: subject to change depending on how we decide to format
        json_post = json.loads(request.body)
        username = json_post.get("username")
        pword = json_post.get("password")

        if username is not None and pword is not None:
            # todo: this is where the login scrape is called
            # the scrape should check if their data is in the database already
            # else it will login and add all relevant data to database.
            # it should return something that indicates if the log in
            # was successful

            successful_login = True  # todo: changes with scrape
            if successful_login:
                # todo: the following is VERY poor practice, temporary only...
                random.seed(pword)
                key = random.randint(0, 1000000)
                # save username with key such that the session continues
                user_keys.append({"username": username, "key": key})

                jsons_response = "{" + \
                                 f'"key": {key}' + "}"
                return HttpResponse(jsons_response)

        return HttpResponse('err')


def get_student_courses(request):
    json_body = json.loads(request.body)
    username = json_body.get("username")
    key = json_body.get("key")

    if username is None or key is None:
        return HttpResponse('err')

    # checks auth
    if len([user for user in user_keys
            if user["username"] == username and user["key"] == key]):
        print("auth success for " + username + " " + str(key))

        # auth successful - now get courses here
        course_list = [student_course.course for student_course in StudentCourse.objects.all()
                       if student_course.student.username == username]

        json_courses = [{"id": x.id, "name": x.name, "mode": x.mode,
                         "semester": x.semester, "year": x.year}
                        for x in course_list]

        return HttpResponse(json.dumps(json_courses))

    else:
        return HttpResponse("failed auth")

    pass  # todo: finish
