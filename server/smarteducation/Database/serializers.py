from rest_framework import serializers
from .models import User, Resource, File, Institution, Course, Assessment, StaffCourse, Student, StudentCourse, Staff



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'


class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = '__all__'


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = '__all__'


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = '__all__'


class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'


class StudentCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentCourse
        fields = '__all__'


class StaffCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffCourse
        fields = '__all__'


class AssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment
        fields = '__all__'
