from .models import *
from rest_framework import viewsets, permissions
from rest_framework.permissions import *
from .serializers import *


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = UserSerializer


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = StudentSerializer


class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = StaffSerializer


class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = AnnouncementSerializer


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = ResourceSerializer


class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = FileSerializer


class InstitutionViewSet(viewsets.ModelViewSet):
    queryset = Institution.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = InstitutionSerializer


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = CourseSerializer


class StudentCourseViewSet(viewsets.ModelViewSet):
    queryset = StudentCourse.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = StudentCourseSerializer


class StaffCourseViewSet(viewsets.ModelViewSet):
    queryset = StaffCourse.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = StaffCourseSerializer


class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = AssessmentItem.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = AssessmentSerializer


class StudentAssessmentViewSet(viewsets.ModelViewSet):
    queryset = StudentAssessment.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = StudentAssessmentSerializer


class CourseFeedbackViewSet(viewsets.ModelViewSet):
    queryset = CourseFeedback.objects.all()
    permission_classes = [IsAdminUser]

    serializer_class = CourseFeedbackSerializer


class CourseGoalsViewSet(viewsets.ModelViewSet):
    queryset = LongTermGoals.objects.all()
    permission_classes = [IsAdminUser]

    serializer_class = CourseGoalsSerializer


class csrfExemptViewSet(viewsets.ModelViewSet):
    queryset = exemptCSRF.objects.all()
    permission_classes = [IsAdminUser]

    serializer_class = csrfExemptSerializer