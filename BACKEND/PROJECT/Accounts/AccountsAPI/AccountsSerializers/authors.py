from .users import UserSerializer
from .socialMediaHandles import SocialMediaHandleSerializer
from Accounts.models import Author
from rest_framework import serializers

from Articles.ArticlesAPI.ArticlesSerializers.tags import TagSerializer

class ShortAuthorSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only= True)
    class Meta:
        model = Author
        fields = [
            "id",
            "username",
            "avatar",
        ] 

    def get_username(self, obj):
        return obj.user.username


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = "__all__"


class FullAuthorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    interests = TagSerializer(many=True, read_only=True)
    social_media_handles = SocialMediaHandleSerializer(
        many=True, read_only=True)

    class Meta:
        model = Author
        fields = "__all__"
