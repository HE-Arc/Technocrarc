from channels.generic.websocket import AsyncWebsocketConsumer
from .tasks import split_sound
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json

class BackgroundTaskConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        json_data = json.loads(text_data)
        song_name = json_data['song_name']
        stems = json_data['stems']

        split_sound.delay(self.channel_name, song_name, stems)

    async def file_processed(self, event):
        await self.send(event['file_url'])
