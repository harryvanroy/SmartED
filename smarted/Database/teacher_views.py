import json
import random

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .scrape.ecp_scrape import get_course_assessment
from .scrape.scrape import *
from .models import *
import re

#### TEACHER METHODS ####

def students_in_course(request):
    json_body = json.loads(request.body)
    username = json_body.get("username")

    course = Course.objects.get(id=json_body.get("courseID"))

    students = [stu_course.student for stu_course in
                StudentCourse.objects.filter(course=course)]

    json_students = [{"username": student.user.username for student in students}]

    return HttpResponse(json.dumps(json_students))


def student_assessment_grade(request):
    json_body = json.loads(request.body)
    username = json_body.get("username")
    key = json_body.get("key")

    ass_item = AssessmentItem.objects.get(id=json_body.get("assID"))

    stu_user = User.objects.get(username=json_body.get("studentID"))
    student = Student.objects.get(user=stu_user)

    grade = json_body.get("grade")
    # pass_fail = json_body.get("passed")

    student_ass = StudentAssessment(student=student, assessment=ass_item,
                                    value=grade)
    student_ass.save()

    return HttpResponse("")

#### TEACHER METHODS ####