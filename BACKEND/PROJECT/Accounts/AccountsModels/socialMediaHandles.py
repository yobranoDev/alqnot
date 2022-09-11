from django.db import models
from django.contrib import admin

from rest_framework import serializers


# Created my models here.
class SocialMediaHandle(models.Model):
    platform = models.CharField(max_length=100,)
    account = models.CharField(max_length=250)

    class Meta:
        unique_together = [
            ["platform", "account"]
        ]

    def __str__(self):
        return str(self.account)



class SocialMediaHandleAdminView(admin.ModelAdmin):
    list_display =["platform", "account"]
    fields = ["platform", "account"]


class SocialMediaHandleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialMediaHandle
        fields = "__all__"
    