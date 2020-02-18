from django.urls import path
from technocrarcApp.views import *

urlpatterns = [
    path('upload', AudioFileUploadView.as_view()),
    path('editor', AudioFileSplitView.as_view())
]
