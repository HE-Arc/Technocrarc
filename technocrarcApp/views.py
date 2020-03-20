from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseNotFound
from django.conf import settings
from django.core import serializers
from .serializers import AudioFileSerializer, EffectFileSerializer
from .forms import *
from .models import AudioFile, EffectFile, Project
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth import *
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.utils.decorators import method_decorator
import os
import logging

logger = logging.getLogger(__name__)

class Upload(LoginRequiredMixin, APIView):
    parser_class = (FileUploadParser,)
    login_url = '/log-in'
    redirect_field_name = 'redirect_to'

    @method_decorator(ensure_csrf_cookie)
    def post(self, request, *args, **kwargs):
        audio_file_serializer = AudioFileSerializer(data=request.data)
        request.data['user'] = request.user.id

        project = Project()
        project.user_id = request.user.id
        project.name = request.FILES['file'].name[:-4]
        project.save()
        request.data['project'] = project.id

        if audio_file_serializer.is_valid():
            audio_file_serializer.save(project=project)
            return Response(audio_file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(audio_file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AudioEffectView(APIView):

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, effect_id):
        user_id = request.user.id
        file = EffectFile.objects.filter(
            id=effect_id, user_id=user_id).values('file')

        if file.exists():
            path_to_file = os.path.join(settings.MEDIA_ROOT, file[0]['file'])
            with open(path_to_file, 'r') as json_file:
                response = HttpResponse(
                    json_file, content_type='application/json')
            return response
        else:
            return HttpResponseNotFound('No matching file found')

    @method_decorator(ensure_csrf_cookie)
    def post(self, request, *args, **kwargs):
        effect_file_serializer = EffectFileSerializer(data=request.data)
        request.data['user'] = request.user.id

        if effect_file_serializer.is_valid():
            effect_file_serializer.save()
            return Response(effect_file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(effect_file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# TODO : delete after test


class P5(APIView):

    def get(self, request, *args, **kwargs):
        return render(request, 'p5_test.html')


class UserProject(LoginRequiredMixin, APIView):
    login_url = '/log-in'
    redirect_field_name = 'redirect_to'

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        user_id = request.user.id
        users_project = Project.objects.filter(
            user_id=user_id).values('id', 'name')

        return JsonResponse(dict(users_project=list(users_project)))

class Projects(LoginRequiredMixin, APIView):
    login_url = '/log-in'
    redirect_field_name = 'redirect_to'

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, project_id):
        user_id = request.user.id
        audio_files = AudioFile.objects.filter(
            user_id=user_id, project_id=project_id).values('id')

        return JsonResponse(dict(audio_files=list(audio_files)))


class SplitAudioFileViewDownload(LoginRequiredMixin, APIView):
    login_url = '/log-in'
    redirect_field_name = 'redirect_to'

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, song_id):
        user_id = request.user.id
        file = AudioFile.objects.filter(
            id=song_id, user_id=user_id).values('file')

        if file.exists():
            path_to_file = os.path.join(settings.MEDIA_ROOT, file[0]['file'])
            with open(path_to_file, 'rb') as wav_file:
                response = HttpResponse(wav_file, content_type='audio/wav')
            return response
        else:
            return HttpResponseNotFound('No matching file found')


class Editor(LoginRequiredMixin, APIView):
    login_url = '/log-in'
    redirect_field_name = 'redirect_to'

    @method_decorator(ensure_csrf_cookie)   
    def get(self, request, *args, **kwargs):
        return render(request, 'editor.html')


class Home(APIView):
    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return HttpResponseRedirect('/editor')
        else:
            return render(request, 'home.html')


class LogIn(APIView):

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        form = LogInForm()
        return render(request, 'log-in.html', {'form': form})

    @method_decorator(ensure_csrf_cookie)
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
                return HttpResponseRedirect('/editor')
            else:
                form.add_error(
                    'password', 'Your credentials have not been found in our records.')

        if form.is_valid():
            return HttpResponseRedirect('/editor')
        else:
            return render(request, 'log-in.html', {'form': form})


class SignUp(APIView):

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        form = SignUpForm()
        return render(request, 'sign-up.html', {'form': form})

    @method_decorator(ensure_csrf_cookie)
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
                form.add_error('password_conf',
                               'Password confirmation does not match.')
                return render(request, 'sign-up.html', {'form': form})

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

            # Authenticate the user
            login(request, newUser)

            return HttpResponseRedirect('/editor')
        else:
            return render(request, 'sign-up.html', {'form': form})


class Logout(LoginRequiredMixin, APIView):
    login_url = '/log-in'
    redirect_field_name = 'redirect_to'

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        logout(request)
        return HttpResponseRedirect('/')
