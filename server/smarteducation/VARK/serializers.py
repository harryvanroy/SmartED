from rest_framework import serializers
from .models import VarkResult

class VarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = VarkResult
        fields = '__all__'