from django.urls import path
from technocrarcApp.views import *

urlpatterns = [
    path('upload', Upload.as_view()),
    path('editor', Editor.as_view()),
    path('', Home.as_view()),
    path('log-in', LogIn.as_view()),
    path('sign-up', SignUp.as_view())
]
