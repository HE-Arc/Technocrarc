from django.urls import path
from technocrarcApp.views import *

urlpatterns = [
    path('upload', AudioFileUploadView.as_view()),
    path('split_sound', AudioFileSplitView.as_view())
]
