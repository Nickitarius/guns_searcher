from django.db import models
#from rest_framework import serializers
# Create your models here.
class Img(models.Model):
    image = models.ImageField(upload_to='static/img')
