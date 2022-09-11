from django.db import models
from django.contrib import admin
from django.contrib.auth.models import User


class Tag(models.Model):
    label = models.CharField(max_length= 50, unique= True)
    date_created = models.DateTimeField(auto_now_add= True)
    date_updated = models.DateTimeField(auto_now= True)
    # icon = models.ImageField(null= True, blank= True)
    def __str__(self,):
        return str(self.label)

class TagAdminView(admin.ModelAdmin):
    list_display = ["label", "date_created", "date_updated"]
    fields = ("label",)