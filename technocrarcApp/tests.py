from django.test import TestCase
from django.contrib.auth.models import User

# Create your tests here.

class UserExampleTest(TestCase):
    '''
    No need to test the user model, because it comes from the Django Auth package.
    This test is just an example of how tests work with Django.

    The TestCase class implies the use of a test database ; do not
    inherit from this class if you do not need a database to test something.
    '''
    def setUp(self):
        user = User.objects.create(username="test", first_name="Techno", last_name="Crarc", email="test@technocrarc.ch", password="foo")

    def test_example(self):
        user = User.objects.get(username="test")
        self.assertEqual(user.first_name, 'Techno')
        self.assertEqual(user.last_name, 'Crarc')
        self.assertEqual(user.email, 'test@technocrarc.ch')
        self.assertEqual(user.password, 'foo')
