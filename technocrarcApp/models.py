from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
class AudioFile(models.Model):

    file = models.FileField(blank=False, null=False, upload_to='audio/%Y_%d_%m/')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    def __str__(self):
        return self.file.name

class EffectFile(models.Model):

    file = models.FileField(blank=False, null=False, upload_to='effects/%Y_%d_%m/')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    audio = models.ForeignKey(AudioFile, on_delete=models.CASCADE)

    def __str__(self):
        return self.file.name
