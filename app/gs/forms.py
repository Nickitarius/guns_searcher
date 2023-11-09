#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Oct 28 13:36:09 2023

@author: ivan
"""

from django import forms
from .models import Img

class ImgForm(forms.ModelForm):
    class Meta:
      model = Img
      fields = ('image',)