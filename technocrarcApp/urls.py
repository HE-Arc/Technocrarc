from django.urls import path
from technocrarcApp.views import *

app_name = 'technocrarcApp'

urlpatterns = [
    #path('upload', Upload.as_view()),
    path('editor', Editor.as_view()),
    path('', Home.as_view()),
    path('log-in', LogIn.as_view()),
    path('sign-up', SignUp.as_view()),
    path('logout', Logout.as_view()),
    path('download/<int:song_id>', SplitAudioFileViewDownload.as_view(), name='download'),
]
