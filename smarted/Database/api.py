from .models import User, Student, Resource, File, Institution, Course, AssessmentItem, Staff, StudentCourse, \
    StaffCourse, StudentAssessment
from rest_framework import viewsets, permissions
from .serializers import UserSerializer, ResourceSerializer, FileSerializer, InstitutionSerializer, \
    CourseSerializer, AssessmentSerializer, StudentSerializer, StaffSerializer, StaffCourseSerializer, \
    StudentCourseSerializer, StudentAssessmentSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = {
        permissions.AllowAny
    }
    serializer_class = UserSerializer


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    permission_classes = {
        permissions.AllowAny
    }
    serializer_class = StudentSerializer


class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    permission_classes = {
        permissions.AllowAny
    }
    serializer_class = StaffSerializer


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    permission_classes = {
        permissions.AllowAny
    }
    serializer_class = ResourceSerializer


class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    permission_classes = {
        permissions.AllowAny
    }
    serializer_class = FileSerializer


class InstitutionViewSet(viewsets.ModelViewSet):
    queryset = Institution.objects.all()
    permission_classes = {
        permissions.AllowAny
    }
    serializer_class = InstitutionSerializer


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    permission_classes = {
        permissions.AllowAny
    }
    serializer_class = CourseSerializer


class StudentCourseViewSet(viewsets.ModelViewSet):
    queryset = StudentCourse.objects.all()
    permission_classes = {
        permissions.AllowAny
    }
    serializer_class = StudentCourseSerializer


class StaffCourseViewSet(viewsets.ModelViewSet):
    queryset = StaffCourse.objects.all()
    permission_classes = {
        permissions.AllowAny
    }
    serializer_class = StaffCourseSerializer


class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = AssessmentItem.objects.all()
    permission_classes = {
        permissions.AllowAny
    }
    serializer_class = AssessmentSerializer

class StudentAssessmentViewSet(viewsets.ModelViewSet):
    queryset = StudentAssessment.objects.all()
    permission_classes = {
        permissions.AllowAny
    }
    serializer_class = StudentAssessmentSerializer