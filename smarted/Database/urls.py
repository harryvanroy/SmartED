from rest_framework import routers
from django.urls import path
from . import views, teacher_views
from .api import *

# REST FRAMEWORK DATABASE VIEWS
router = routers.DefaultRouter()
router.register('users', UserViewSet, 'users')
router.register('announcements', AnnouncementViewSet, 'announcements')
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
router.register('CourseFeedback', CourseFeedbackViewSet, 'courseFeedback')
router.register('CourseGoals', CourseGoalsViewSet, 'courseGoals')
router.register('csrfEXEMPT', csrfExemptViewSet, 'csrfExempt')
urlpatterns = router.urls

# CUSTOM API VIEWS
urlpatterns += [
    path('force-teacher/', views.force_teacher, name='force-teacher'),

    path('course-assessment/', views.course_assessment, name='course-assessment'),
    path('initialize/', views.initialize, name='initialize'),

    path('student-courses/', views.get_student_courses, name='student-courses'),
    path('vark/', views.vark, name='vark'),
    path('get-grades/', views.get_student_grades, name='get-grades'),
    path('post-course-feedback/', views.post_course_feedback, name='course-feedback-post'),
    path('goals/', views.goals, name='goals'),
    path('refresh/', views.refresh, name='refresh'),

    path('teacher-courses/', teacher_views.get_teacher_courses, name='teacher-courses'),
    path('students-in-course/', teacher_views.students_in_course, name='students-in-course'),
    path('student-assessment-grade/', teacher_views.student_assessment_grade, name='student-assessment-grade'),
    path('get-course-feedback/', teacher_views.get_course_feedback, name='get-course-feedback'),
    path('students-at-risk/', teacher_views.students_at_risk, name='students-at-risk'),
    path('course-average-vark/', teacher_views.get_average_vark, name='course-average-vark'),
    path('student-course-grades/', teacher_views.students_course_grade, name='student-grades')
]
