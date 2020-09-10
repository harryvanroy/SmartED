from django.db import models

# Create your models here.

from django.db import models
import datetime
from django.core.validators import MaxValueValidator, MinValueValidator

################ VALIDATORS ################

def max_value_current_year(value):
    return MaxValueValidator(current_year())(value)


################ Models ################

class User(models.Model):
    username = models.CharField(max_length=8, primary_key=True)
    firstName = models.CharField(max_length=255, null=False)
    lastName = models.CharField(max_length=255, null=False)


class Student(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    varkV = models.DecimalField(max_digits=5, decimal_places=4)
    varkA = models.DecimalField(max_digits=5, decimal_places=4)
    varkR = models.DecimalField(max_digits=5, decimal_places=4)
    varkK = models.DecimalField(max_digits=5, decimal_places=4)


class Staff(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)


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
    EXTERNAL = 'E'
    INTERNAL = 'I'
    FLEXIBLE = 'F'
    Course_Modes = [
        (EXTERNAL, 'EXTERNAL'),
        (INTERNAL, 'INTERNAL'),
        (FLEXIBLE, 'FLEXIBLE')
    ]

    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=200)
    mode = models.CharField(max_length=8, choices=Course_Modes, default=FLEXIBLE)
    semester = models.PositiveSmallIntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(2)])
    year = models.PositiveSmallIntegerField(default=datetime.date.today().year, validators=[MinValueValidator(1909), max_value_current_year])
    institution = models.ForeignKey(Institution, on_delete=models.SET_NULL, blank=True, null=True)

    class Meta:
        unique_together = ('name', 'mode', 'semester', 'year')


class StudentCourse(models.Model):
    student = models.ForeignKey(Student, on_delete=models.SET_NULL, blank=True, null=True)
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, blank=True, null=True)


class StaffCourse(models.Model):
    student = models.ForeignKey(Staff, on_delete=models.SET_NULL, blank=True, null=True)
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, blank=True, null=True)
