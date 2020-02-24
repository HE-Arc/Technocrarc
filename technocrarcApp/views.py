from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import render
from django.http import HttpResponse
from .serializers import AudioFileSerializer

from .forms import SignUpForm
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User

class Upload(APIView):
    parser_class = (FileUploadParser,)

    def get(self, request, *args, **kwargs):
        return render(request, 'upload.html')

    def post(self, request, *args, **kwargs):
      audio_file_serializer = AudioFileSerializer(data=request.data)

      if audio_file_serializer.is_valid():
          audio_file_serializer.save()
          return Response(audio_file_serializer.data, status=status.HTTP_201_CREATED)
      else:
          return Response(audio_file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Editor(APIView):
    def get(self, request, *args, **kwargs):
        return render(request, 'editor.html')

class Home(APIView):
    def get(self, request, *args, **kwargs):
        return render(request, 'home.html')

class LogIn(APIView):
    def get(self, request, *args, **kwargs):
        return render(request, 'log-in.html')

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

            return render(request, 'home.html')
        else:
            return render(request, 'sign-up.html', {'form': form})



        # if form.is_valid():
        #     return HttpResponseRedirect('/thanks/')
