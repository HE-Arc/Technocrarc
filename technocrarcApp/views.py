from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
from .serializers import AudioFileSerializer
import os

class AudioFileUploadView(APIView):
    parser_class = (FileUploadParser,)

    def post(self, request, *args, **kwargs):

      audio_file_serializer = AudioFileSerializer(data=request.data)

      if audio_file_serializer.is_valid():
          audio_file_serializer.save()
          return Response(audio_file_serializer.data, status=status.HTTP_201_CREATED)
      else:
          return Response(audio_file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SplitAudioFileViewDownload(APIView):

    """def get(self, request, zip_file):
        path_to_file = os.path.join(settings.MEDIA_ROOT, zip_file)
        zip_file = open(path_to_file, 'rb')
        response = HttpResponse(zip_file, content_type='application/zip')
        response['Content-Disposition'] = f'attachment; filename="split_sound.zip"'
        return response"""

    def get(self, request, dir, audio_file):
        path_to_file = os.path.join(settings.MEDIA_ROOT, dir, audio_file)
        wav_file = open(path_to_file, 'rb')
        response = HttpResponse(wav_file, content_type='audio/wav')
        return response

class SplitAudioFileView(APIView):

    def get(self, request, *args, **kwargs):
        return render(request, 'editor.html')
