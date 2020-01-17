# Technocrarc

Web app, to edit music, namely use spleeter to get multiple channels from a single track

## Usage

Activate your python virtual environment.

Install all the required python packages.

```
pip install -r requirements.txt
```

Create a database name technocrarc for the project.
Change username and password by your desired information.

```
mysql -u root -p
GRANT ALL PRIVILEGES ON *.* TO 'username'@'localhost' IDENTIFIED BY 'password';
exit;
mysql -u username -p;
CREATE DATABASE technocrarc
```

Change mysql user to your user in ./technocrarc/settings.py

```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'technocrarc',
		'USER': 'dev', # TODO change to your mysql user
		'PASSWORD': 'password',  # TODO change to your mysql password
    }
}
```

Run the migrations

```
python3 manage.py migrate
```

Start the server

```
python3 manage.py runserver
```
