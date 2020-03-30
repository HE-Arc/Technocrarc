from __future__ import absolute_import, unicode_literals

from spleeter.separator import Separator
from django.conf import settings
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.urls import reverse
from .models import AudioFile
import os
import multiprocessing as mp
from celery.decorators import task
import json


channel_layer = get_channel_layer()

@task(name='split_sound', time_limit=99999)
def split_sound(channel_name, song_id, stems, user_id):
    mp.current_process()._config['daemon'] = False

    separator = Separator(settings.STEMS_OPTION[stems])

    querySet = AudioFile.objects.filter(id=song_id, user_id=user_id).values('file', 'project_id')

    if querySet.exists():
        file_name = querySet[0]['file']
        project_id = querySet[0]['project_id']

        separator.separate_to_file(
            os.path.join(settings.MEDIA_ROOT, file_name),
            os.path.join(settings.MEDIA_ROOT, os.path.split(file_name)[0])
        )

        rel_path = os.path.splitext(file_name)[0]
        path = os.path.join(settings.MEDIA_ROOT, rel_path)

        for file in os.listdir(path):
            audio_file = AudioFile()
            audio_file.file = os.path.join(rel_path, file)
            audio_file.user_id = user_id
            audio_file.project_id = project_id
            audio_file.save()

            file_url = reverse(
                'technocrarcApp:download',
                kwargs={'song_id': audio_file.id}
            )

            async_to_sync(channel_layer.send)(channel_name, {'type': 'file.processed', 'file_url': file_url})
    else:
        async_to_sync(channel_layer.send)(channel_name,
            {
            'type': 'file.error',
            'error': 'No matching file found'
            })
