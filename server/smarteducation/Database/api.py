from .models import User, Resource, File, Institution, Course, Assessment
from rest_framework import viewsets, permissions
from .serializers import UserSerializer, ResourceSerializer, FileSerializer, InstitutionSerializer, CourseSerializer, AssessmentSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = {
        permissions.AllowAny
    }
    serializer_class = UserSerializer


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


class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = Assessment.objects.all()
    permission_classes = {
        permissions.AllowAny
    }
    serializer_class = AssessmentSerializer
