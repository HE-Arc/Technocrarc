from __future__ import absolute_import, unicode_literals

import os
from django.conf import settings as settings
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'technocrarc.settings')

app = Celery('technocrarc',
              broker=settings.BROKER_URL,
              backend=settings.RESULT_BACKEND_URL,
              include=['technocrarcApp.tasks'])

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))
