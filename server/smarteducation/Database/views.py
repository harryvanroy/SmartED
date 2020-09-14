from django.http import HttpResponse
from .ecp_scrape import get_course_assessment
from .models import Course, Institution, Assessment
from .serializers import AssessmentSerializer
from django.core import serializers
import json


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
