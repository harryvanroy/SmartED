import json
import random

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .scrape.ecp_scrape import get_course_assessment
from .scrape.scrape import *
from .models import *
import re

DEFAULT_TEACHER = "uqGeorge"

#### TEACHER METHODS ####

def students_in_course(request):
    json_header = request.headers

    try:
        if json_header['X-Uq-User-Type'] == 'Student':  # there might be edge cases...
            return HttpResponse("failed.. you are not a teacher")
        username = json.loads(json_header['X-Kvd-Payload'])['user']
    except:
        username = DEFAULT_TEACHER

    id = request.GET.get('id')
    try:
        id = int(id)
    except:
        return HttpResponse("failed query... specify the course ID...")

    course = Course.objects.get(id=id)

    students = [stu_course.student for stu_course in
                StudentCourse.objects.filter(course=course)]

    json_students = [{"username": student.user.username for student in students}]

    return HttpResponse(json.dumps(json_students))

@csrf_exempt
def student_assessment_grade(request):
    json_body = json.loads(request.body)
    json_header = request.headers

    try:
        if json_header['X-Uq-User-Type'] == 'Student':  # there might be edge cases...
            return HttpResponse("failed.. you are not a teacher")
        username = json.loads(json_header['X-Kvd-Payload'])['user']
    except:
        username = DEFAULT_TEACHER

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

#### TEACHER METHODS ####