from channels.generic.websocket import AsyncWebsocketConsumer
from .tasks import split_sound
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import AudioFile
from .serializers import SpliterSerializer
import json

class BackgroundTaskConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()
        self.user = self.scope['user']

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        json_data = json.loads(text_data)

        splitter_serializer = SpliterSerializer(data=json_data)

        if splitter_serializer.is_valid():
            song_id = splitter_serializer.data['song_id']
            stems = splitter_serializer.data['stems']

            split_sound.delay(self.channel_name, song_id, stems, self.user.id)
        else:
            await self.send(json.dumps({
                'type': 'file.processed',
                'error': splitter_serializer.errors
                }
            ))

    async def file_processed(self, event):
        await self.send(json.dumps(event))

    async def file_error(self, event):
        await self.send(json.dumps(event))
