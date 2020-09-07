from django.db import models


class User(models.Model):
    id = models.CharField(primary_key=True, max_length=10)
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

    def __str__(self):
        return f"{self.name}"


class Course(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    semester = models.IntegerField(default=2)
    year = models.IntegerField(default=2020)
    mode = models.CharField(max_length=20, default='Internal')  # preferably only allow the 3 options
    institution = models.ForeignKey(Institution, on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return f"{self.name}. Semester {self.semester}, {self.year}. {self.mode}"


class Assessment(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=100)
    date = models.CharField(max_length=50)
    weight = models.CharField(max_length=50)
    course = models.ForeignKey(Course, related_name='assessment', on_delete=models.CASCADE)
