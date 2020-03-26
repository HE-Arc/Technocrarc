from django.db import models
from django.contrib.auth.models import User
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import os

class OverwriteStorage(FileSystemStorage):

    def get_available_name(self, name, max_length=None):
        if self.exists(name):
            os.remove(os.path.join(settings.MEDIA_ROOT, name))
        return name


class Project(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.TextField()


class AudioFile(models.Model):

    file = models.FileField(blank=False, null=False,
                            upload_to='audio/%Y_%d_%m/')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    def __str__(self):
        return self.file.name


class EffectFile(models.Model):

    file = models.FileField(blank=False, null=False,
                            upload_to='effects/%Y_%d_%m/', storage=OverwriteStorage())
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    audio = models.ForeignKey(AudioFile, on_delete=models.CASCADE)

    def __str__(self):
        return self.file.name
