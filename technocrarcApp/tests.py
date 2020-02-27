from django.test import TestCase
from django.test import Client
from django.test import tag

from django.contrib.auth.models import User
from .models import AudioFile

# Create your tests here.

class UserTest(TestCase):
    '''
    No need to test the user model, because it comes from the Django Auth package.
    This test is just an example of how tests work with Django.

    The TestCase class implies the use of a test database ; do not
    inherit from this class if you do not need a database to test something.
    '''
    def setUp(self):
        '''
        Inserts a user in the test database.
        '''
        User.objects.create(username="test", first_name="Techno", last_name="Crarc", email="test@technocrarc.ch", password="foo")

    @tag('example')
    def test_example(self):
        '''
        Example
        '''
        user = User.objects.get(username="test")
        self.assertEqual(user.first_name, 'Techno')
        self.assertEqual(user.last_name, 'Crarc')
        self.assertEqual(user.email, 'test@technocrarc.ch')
        self.assertEqual(user.password, 'foo')

    @tag('login')
    def test_login(self):
        '''
        Test the authenticated routes.
        '''
        user = User.objects.get(username="test")

        # TODO: test with authenticated routes (error when not logged in -> success then)

        # Valid login
        c = Client()
        response = c.post('/log-in', { 'username': user.username, 'password': user.password })
        self.assertEqual(200, response.status_code)

class AudioFileDBTest(TestCase):
    '''
    Tests the insertion of an audio file in the database.
    '''
    def setUp(self):
        self.user = User.objects.create(username="test")
        AudioFile.objects.create(file='2020_27_02/test.wav', user=self.user)

    @tag('audiofiledb')
    def test_audio(self):
        audioFile = AudioFile.objects.get(file="2020_27_02/test.wav")
        self.assertEqual(audioFile.file, '2020_27_02/test.wav')
        self.assertEqual(audioFile.user, self.user)

class AudioFileUpload(TestCase):
    '''
    Tests the upload of a file.
    '''
    def setUp(self):
        self.user = User.objects.create(username="test")
        self.client = Client()

    @tag('audiofileupload')
    def test_audiofile_upload(self):
        with open('./test/test.wav', 'rb') as f:
            self.client.post('/upload', { 'file': f })
            AudioFile.objects.create(file=f.name, user=self.user)

            audioFile = AudioFile.objects.get(file=f.name)
            self.assertEqual(audioFile.file, f.name)
            self.assertEqual(audioFile.user, self.user)
