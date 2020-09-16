from rest_framework import routers
from django.urls import path
from . import views
from .api import UserViewSet, ResourceViewSet, FileViewSet, InstitutionViewSet, CourseViewSet, AssessmentViewSet, \
    StaffCourseViewSet, StudentCourseViewSet, StudentViewSet, StaffViewSet

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
urlpatterns = router.urls

urlpatterns += [
    path('course-assessment/', views.course_assessment, name='course-assessment'),
    path('login-post/', views.log_in, name='login'),
    path('student-courses/', views.get_student_courses, name='student-courses')
]
