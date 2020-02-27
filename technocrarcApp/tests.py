from django.test import TestCase
from django.test import Client
from django.test import tag

from django.contrib.auth.models import User

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
        user = User.objects.create(username="test", first_name="Techno", last_name="Crarc", email="test@technocrarc.ch", password="foo")

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
