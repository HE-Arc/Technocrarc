from rest_framework import serializers
from .models import AudioFile
from django.conf import settings

class AudioFileSerializer(serializers.ModelSerializer):

    class Meta:
        model = AudioFile
        fields = '__all__'

class SpliterSerializer(serializers.Serializer):
    song_id = serializers.IntegerField(min_value=1)
    stems = serializers.ChoiceField(list(settings.STEMS_OPTION.keys()))

    class Meta:
        fields = ('song_id', 'stems')
