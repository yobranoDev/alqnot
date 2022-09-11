from Accounts.models import SocialMediaHandle
from rest_framework import serializers

class SocialMediaHandleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialMediaHandle
        fields = "__all__"