# Technocrarc

Web app, to edit music, namely use spleeter to get multiple channels from a single track

## Usage

Install Redis broker for long running proccess

```
sudo apt-get install redis-server
```

To test redis. The last command should return PONG.

```
redis-server &
redis-cli ping
```

Install ffmpeg for spleeter
```
sudo apt install ffmpeg
```

Activate your python virtual environment.

```
source ~/venv/bin/activate 
```

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

Start the redis server 

```
redis-server &
```

Run the celery worker

```
celery worker -A technocrarc -l info
```

Start the web server

```
python3 manage.py runserver
```
