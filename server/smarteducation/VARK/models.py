from django.db import models

# Create your models here.

class VarkResult(models.Model):
    username = models.CharField(max_length=100)  # this is bad, should use database User class...
    V = models.CharField(max_length=5)
    A = models.CharField(max_length=5)
    R = models.CharField(max_length=5)
    K = models.CharField(max_length=5)
