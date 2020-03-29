from rest_framework import serializers
from .models import AudioFile, EffectFile
from django.conf import settings


class AudioFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudioFile
        fields = '__all__'


class EffectFileSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        effect, created = EffectFile.objects.update_or_create(
            user=validated_data['user'],
            audio=validated_data['audio'],
            defaults={'user': validated_data['user'], 'file': validated_data['file']})
        return effect

    class Meta:
        model = EffectFile
        fields = '__all__'


class SpliterSerializer(serializers.Serializer):
    song_id = serializers.IntegerField(min_value=1)
    stems = serializers.ChoiceField(list(settings.STEMS_OPTION.keys()))

    class Meta:
        fields = ('song_id', 'stems')
