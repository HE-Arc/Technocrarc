from django.db import models

class AudioFile(models.Model):

    file = models.FileField(blank=False, null=False, upload_to='%Y_%d_%m/')

    def __str__(self):
        return self.file.name
