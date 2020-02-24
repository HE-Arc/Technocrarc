from django.urls import path
from technocrarcApp.views import *

urlpatterns = [
    path('upload', AudioFileUploadView.as_view()),
    path('editor', AudioFileSplitView.as_view()),
    path('', Home.as_view()),
    path('log-in', LogIn.as_view()),
    path('sign-up', SignUp.as_view())
]
