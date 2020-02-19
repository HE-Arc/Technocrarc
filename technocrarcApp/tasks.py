from __future__ import absolute_import, unicode_literals

from spleeter.separator import Separator
from .utils import zip_files
from django.conf import settings
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import os
import multiprocessing as mp
from celery.decorators import task

channel_layer = get_channel_layer()

@task(name='split_sound')
def split_sound(channel_name, file_name='file_example_MP3_700KB.mp3'):
    async_to_sync(channel_layer.send)(channel_name, {"type": "background-tasks.message", "start": "start"})
    # TODO get number of stems as parameter
    mp.current_process()._config['daemon'] = False

    separator = Separator('spleeter:2stems')

    separator.separate_to_file(os.path.join(settings.MEDIA_ROOT, file_name), settings.MEDIA_ROOT)

    zipped_file = zip_files(os.path.join(settings.MEDIA_ROOT, os.path.splitext(file_name)[0]))

    async_to_sync(channel_layer.send)(channel_name, {"type": "background-tasks.split", "zip_file": zipped_file})
