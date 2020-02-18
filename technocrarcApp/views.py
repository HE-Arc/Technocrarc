from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .serializers import AudioFileSerializer

class AudioFileUploadView(APIView):
    parser_class = (FileUploadParser,)

    def post(self, request, *args, **kwargs):

      audio_file_serializer = AudioFileSerializer(data=request.data)

      if audio_file_serializer.is_valid():
          audio_file_serializer.save()
          return Response(audio_file_serializer.data, status=status.HTTP_201_CREATED)
      else:
          return Response(audio_file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AudioFileSplitView(APIView):

    def post(self, request, *args, **kwargs):
        pass
