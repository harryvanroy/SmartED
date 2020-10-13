from rest_framework import routers
from django.urls import path
from . import views, teacher_views
from .api import UserViewSet, ResourceViewSet, FileViewSet, InstitutionViewSet, CourseViewSet, AssessmentViewSet, \
    StaffCourseViewSet, StudentCourseViewSet, StudentViewSet, StaffViewSet, StudentAssessmentViewSet

router = routers.DefaultRouter()
router.register('users', UserViewSet, 'users')
router.register('resources', ResourceViewSet, 'resources')
router.register('files', FileViewSet, 'files')
router.register('institutions', InstitutionViewSet, 'institutions')
router.register('courses', CourseViewSet, 'courses')
router.register('assessment', AssessmentViewSet, 'assessment')
router.register('staffCourse', StaffCourseViewSet, 'staffCourse')
router.register('studentCourse', StudentCourseViewSet, 'studentCourse')
router.register('student', StudentViewSet, 'student')
router.register('staff', StaffViewSet, 'staff')
router.register('studentAssessment', StudentAssessmentViewSet, 'studentAssessment')
urlpatterns = router.urls

urlpatterns += [
    path('course-assessment/', views.course_assessment, name='course-assessment'),
    path('student-courses/', views.get_student_courses, name='student-courses'),
    path('vark/', views.vark, name='vark'),
    path('get-grades/', views.get_student_grades, name='get-grades'),
    path('initialize/', views.initialize, name='initialize'),

    path('teacher-courses/', teacher_views.get_teacher_courses, name='teacher-courses'),
    path('students-in-course/', teacher_views.students_in_course, name='students-in-course'),
    path('student-assessment-grade/', teacher_views.student_assessment_grade, name='student-assessment-grade'),
]
