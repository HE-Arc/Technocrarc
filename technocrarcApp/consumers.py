from channels.generic.websocket import WebsocketConsumer
from .tasks import split_sound

class BackgroundTaskConsumer(WebsocketConsumer):

    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        self.send("Starting split")

        split_sound.delay(self.channel_name)

        self.send("Finished split")
