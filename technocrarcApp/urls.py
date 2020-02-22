from django.urls import path
from technocrarcApp.views import *

app_name = 'technocrarcApp'

urlpatterns = [
    path('upload', AudioFileUploadView.as_view()),
    path('editor', SplitAudioFileView.as_view()),
    path('download/<str:date>/<str:dir>/<str:audio_file>', SplitAudioFileViewDownload.as_view(), name='download'),
]
