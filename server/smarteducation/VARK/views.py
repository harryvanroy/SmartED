from django.http import HttpResponse
from rest_framework import viewsets, permissions
from .models import VarkResult
from .serializers import VarkSerializer


class VarkView(viewsets.ModelViewSet):
    queryset = VarkResult.objects.all()
    permission_classes = {
        permissions.AllowAny
    }
    serializer_class = VarkSerializer
