***Virtual Env***
```python
$ python3 -m venv myenv
$ source myenv/bin/activate
```
***Dependencies***
```python
$ pip install --upgrade pip
$ pip install -r requirements.txt
```
***Django Migrations && Server***
```python
$ python3 manage.py makemigrations userauth commit
$ python3 manage.py migrate
-- optionally -- 
$ python3 manage.py createsuperuser
$ python3 manage.py runserver
```

## Docker
```python
$ docker build -t django-server .
$ docker run -p 8000:8000 django-server
```
