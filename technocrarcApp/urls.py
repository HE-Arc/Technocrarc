from django.urls import path
from technocrarcApp.views import *
from django.templatetags.static import static

app_name = 'technocrarcApp'

urlpatterns = [
    path('upload', Upload.as_view()),
    path('editor', Editor.as_view()),
    path('', Home.as_view()),
    path('log-in', LogIn.as_view()),
    path('sign-up', SignUp.as_view()),
    path('logout', Logout.as_view()),
    path('download/<int:song_id>', SplitAudioFileViewDownload.as_view(), name='download'),
    path('effect', AudioEffectView.as_view()),
    path('effect/<int:audio_id>', AudioEffectView.as_view()),
    path('projects', UserProject.as_view()),
    path('project/<int:project_id>', Projects.as_view())
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
