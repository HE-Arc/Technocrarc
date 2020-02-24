from django import forms

class SignUpForm(forms.Form):
    first_name = forms.CharField(label='First name', max_length=25)
    last_name = forms.CharField(label='Last name', max_length=25)
    password = forms.CharField(label='Password', widget=forms.PasswordInput)
    password_conf = forms.CharField(label='Password confirmation', max_length=100, widget=forms.PasswordInput)
    email = forms.EmailField(label='Email')
