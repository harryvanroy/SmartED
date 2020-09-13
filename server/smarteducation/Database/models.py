from django.db import models

# Create your models here.

from django.db import models
import datetime
from django.core.validators import MaxValueValidator, MinValueValidator


################ VALIDATORS ################

def max_value_current_year(value):
    return MaxValueValidator(datetime.datetime.now().year)(value)


################ Models ################

class User(models.Model):
    username = models.CharField(max_length=8, primary_key=True)
    firstName = models.CharField(max_length=255, null=False)
    lastName = models.CharField(max_length=255, null=False)

    def __str__(self):
        return f"{self.username} {self.firstName} {self.lastName}"


class Student(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    varkV = models.DecimalField(max_digits=5, decimal_places=4)
    varkA = models.DecimalField(max_digits=5, decimal_places=4)
    varkR = models.DecimalField(max_digits=5, decimal_places=4)
    varkK = models.DecimalField(max_digits=5, decimal_places=4)

    def __str__(self):
        return f"{self.user} / V:{self.varkV} A:{self.varkA} R:{self.varkR} K:{self.varkK}"


class Staff(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return f"{self.user}"


class Resource(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    isBlackboardGenerated = models.BooleanField()
    blackboardLink = models.URLField()
    dateAdded = models.DateTimeField('date published')
    week = models.IntegerField()

    def __str__(self):
        return f"{self.id} {self.title} {self.description} {self.isBlackboardGenerated} {self.blackboardLink}" \
               f" {self.dateAdded} {self.week}"


class File(models.Model):
    id = models.AutoField(primary_key=True)
    path = models.FileField(upload_to='uploads/')
    name = models.CharField(max_length=255)
    size = models.IntegerField()
    course = models.ForeignKey(Resource, on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return f"{self.id} {self.path} {self.name} {self.size} {self.course}"


class Institution(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.name}"


class Course(models.Model):
    EXTERNAL = 'E'
    INTERNAL = 'I'
    FLEXIBLE = 'F'
    Course_Modes = [
        (EXTERNAL, 'EXTERNAL'),
        (INTERNAL, 'INTERNAL'),
        (FLEXIBLE, 'FLEXIBLE')
    ]

    # id = models.CharField(max_length=50, primary_key=True)  # todo: change back to this
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    mode = models.CharField(max_length=8, choices=Course_Modes, default=FLEXIBLE)
    semester = models.PositiveSmallIntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(2)])
    year = models.PositiveSmallIntegerField(default=datetime.date.today().year,
                                            validators=[MinValueValidator(1909), max_value_current_year])
    institution = models.ForeignKey(Institution, on_delete=models.SET_NULL, blank=True, null=True)

    class Meta:
        unique_together = ('name', 'mode', 'semester', 'year')

    def __str__(self):
        return f"{self.id} {self.name} {self.mode} {self.semester} {self.year} {self.institution}"


class StudentCourse(models.Model):
    # student = models.ForeignKey(Student, on_delete=models.SET_NULL, blank=True, null=True) # todo: change back

    student = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return f"{self.student} {self.course}"


class StaffCourse(models.Model):
    staff = models.ForeignKey(Staff, on_delete=models.SET_NULL, blank=True, null=True)
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return f"{self.staff} {self.course}"


class Assessment(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=100)
    date = models.CharField(max_length=50)
    weight = models.CharField(max_length=50)
    course = models.ForeignKey(Course, related_name='assessment', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.id} {self.name} {self.description} {self.date} {self.weight} {self.course}"
