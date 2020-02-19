from django.conf.urls import url
from technocrarcApp.consumers import BackgroundTaskConsumer

websocket_urlpatterns = [
    url(r'^ws/background-tasks/$', BackgroundTaskConsumer),
]
