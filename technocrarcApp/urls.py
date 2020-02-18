from django.urls import path
from technocrarcApp.views import *

urlpatterns = [
    path('', AudioFileUploadView.as_view())
]
