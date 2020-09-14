from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from .ecp_scrape import get_course_assessment
from .models import Course, Institution, Assessment
from .serializers import AssessmentSerializer
from django.core import serializers
import json
import random

user_keys = []


def course_assessment(request):
    course = request.GET.get('code')
    sem = request.GET.get('sem')
    year = 2020  # todo: get
    mode = 'FLEXIBLE'  # todo: get

    # search database for course
    database_course_obj = None
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

            saved_assessment = [saved_ass for saved_ass in Assessment.objects.all()
                                if saved_ass.course == database_course_obj]

            json_assessment = [x["fields"] for x in json.loads(serializers.serialize('json', saved_assessment))]

            return HttpResponse(json.dumps(json_assessment))


@csrf_exempt  # warning: might be bad practice?
def log_in(request):
    if request.method == 'POST':

        # extract json from post method
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
    student = request.GET.get('student')
    key = request.GET.get('key')
    pass  # todo: finish
