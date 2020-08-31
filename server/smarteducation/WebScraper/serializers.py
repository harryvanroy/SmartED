from rest_framework import serializers
from .models import Course

class CourseSerializer(serializers.ModelSerializer):
    assessment = serializers.StringRelatedField(many=True)
    class Meta:
        model = Course 
        fields = ('id', 'name', 'assessment')