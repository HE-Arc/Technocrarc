from channels.generic.websocket import AsyncWebsocketConsumer
from .tasks import split_sound
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import AudioFile
import json

class BackgroundTaskConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()
        self.user = self.scope['user']

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        # TODO : validate data, check user is owner
        json_data = json.loads(text_data)

        song_id = json_data['song_id']
        stems = json_data['stems']

        split_sound.delay(self.channel_name, song_id, stems, self.user.id)

    async def file_processed(self, event):
        if 'file_url' in event:
            await self.send(event['file_url'])
        else:
            await self.send(event['error'])
