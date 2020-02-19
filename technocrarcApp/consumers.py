from channels.generic.websocket import AsyncWebsocketConsumer
from .tasks import split_sound
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class BackgroundTaskConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        split_sound.delay(self.channel_name)

    async def file_processed(self, event):
        await self.send(event['file_url'])
