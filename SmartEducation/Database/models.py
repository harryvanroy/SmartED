from django.db import models

# Create your models here.

from django.db import models

class User(models.Model):
    id = models.AutoField(primary_key=True)
    firstName = models.CharField(max_length=255)
    lastName = models.CharField(max_length=255)

class Resource(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    isBlackboardGenerated = models.BooleanField()
    blackboardLink = models.URLField()
    dateAdded = models.DateTimeField('date published')
    week = models.IntegerField()

class File(models.Model):
    id = models.AutoField(primary_key=True)
    path = models.FileField(upload_to='uploads/')
    name = models.CharField(max_length=255)
    size = models.IntegerField()
    course = models.ForeignKey(Resource, on_delete=models.SET_NULL, blank=True, null=True)

class Institution(models.Model):
	name = models.CharField(max_length=200)

class Course(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=200)
    semester = models.CharField(max_length=255, null=True)
    institution = models.ForeignKey(Institution, on_delete=models.SET_NULL, blank=True, null=True)




