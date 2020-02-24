from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
from .serializers import AudioFileSerializer
import os

from .forms import *
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth import *
from django.contrib.auth.mixins import LoginRequiredMixin

class Upload(LoginRequiredMixin, APIView):
    parser_class = (FileUploadParser,)
    login_url = '/log-in'
    redirect_field_name = 'redirect_to'

    def get(self, request, *args, **kwargs):
        return render(request, 'upload.html')

    def post(self, request, *args, **kwargs):
      # TODO : fk user on audio file

      audio_file_serializer = AudioFileSerializer(data=request.data)

      if audio_file_serializer.is_valid():
          audio_file_serializer.save()
          return Response(audio_file_serializer.data, status=status.HTTP_201_CREATED)
      else:
          return Response(audio_file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SplitAudioFileViewDownload(LoginRequiredMixin, APIView):
    login_url = '/log-in'
    redirect_field_name = 'redirect_to'
    
    def get(self, request, date, dir, audio_file):
        path_to_file = os.path.join(settings.MEDIA_ROOT, date, dir, audio_file)
        wav_file = open(path_to_file, 'rb')
        response = HttpResponse(wav_file, content_type='audio/wav')
        return response

class Editor(LoginRequiredMixin, APIView):
    login_url = '/log-in'
    redirect_field_name = 'redirect_to'

    def get(self, request, *args, **kwargs):
        return render(request, 'editor.html')

class Home(APIView):

    def get(self, request, *args, **kwargs):
        return render(request, 'home.html')

class LogIn(APIView):

    def get(self, request, *args, **kwargs):
        form = LogInForm()
        return render(request, 'log-in.html', {'form': form})

    def post(self, request, *args, **kwargs):
        form = LogInForm(request.POST)

        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']

            username = str(username)
            username = username.lower()

            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                return HttpResponseRedirect('/upload')
            else:
                form.add_error('password', 'Your credentials have not been found in our records.')

        if form.is_valid():
            return HttpResponseRedirect('/upload')
        else:
            return render(request, 'log-in.html', {'form': form})

class SignUp(APIView):

    def get(self, request, *args, **kwargs):
        form = SignUpForm()
        return render(request, 'sign-up.html', {'form': form})

    def post(self, request, *args, **kwargs):
        form = SignUpForm(request.POST)

        if form.is_valid():
            username = form.cleaned_data['username']
            first_name = form.cleaned_data['first_name']
            last_name = form.cleaned_data['last_name']
            password = form.cleaned_data['password']
            password_conf = form.cleaned_data['password_conf']
            email = form.cleaned_data['email']

            if password != password_conf:
                form.add_error('password_conf', 'Password confirmation does not match.')
                return render(request, 'sign-up.html', {'form': form })

            # Check if user already exists
            username = str(username)
            username = username.lower()

            if User.objects.filter(username=username).exists():
                form.add_error('username', 'This username is already taken')
            if User.objects.filter(email=email).exists():
                form.add_error('email', 'This email address is already taken')

        if form.is_valid():
            newUser = User.objects.create_user(username, email, password)
            newUser.first_name = first_name
            newUser.last_name = last_name
            newUser.save()

            #Authenticate the user
            login(request, newUser)

            return HttpResponseRedirect('/upload')
        else:
            return render(request, 'sign-up.html', {'form': form})

class Logout(LoginRequiredMixin, APIView):
    login_url = '/log-in'
    redirect_field_name = 'redirect_to'
    def get(self, request, *args, **kwargs):
        logout(request)
        return HttpResponseRedirect('/')
