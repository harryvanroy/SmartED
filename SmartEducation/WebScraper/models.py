from django.db import models

class Course(models.Model):
    name = models.CharField(max_length=50)

class Assessment(models.Model):
    name = models.CharField(max_length=50)
    date = models.CharField(max_length=50)
    weight = models.CharField(max_length=50)
    course = models.ForeignKey(Course, related_name='assessment', on_delete=models.CASCADE)