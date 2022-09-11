from rest_framework import serializers

from Accounts.AccountsModels.members import MemberArticle
from Accounts.models import Member

from Articles.ArticlesAPI.ArticlesSerializers.tags import TagSerializer
from .authors import AuthorSerializer, UserSerializer, ShortAuthorSerializer
from .users import UserSerializer


class MemberArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemberArticle 
        fields = ["member", "article", "id"]

class ShortMemberSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only= True)
    class Meta:
        model = Member
        fields = ["username", "id", "avatar"]

    def get_username(self, obj):
        return obj.user.username

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = "__all__"


class FullMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    interests = TagSerializer(many=True, read_only=True)
    authors_followed = ShortAuthorSerializer(many=True, read_only=True)
    favourite_articles = serializers.SerializerMethodField()
    history_articles = serializers.SerializerMethodField()

    class Meta:
        model = Member
        fields = "__all__"

    def get_favourite_articles(self, obj):
        from Articles.ArticlesAPI.ArticlesSerializers.articles import ShortArticleSerializer
        return ShortArticleSerializer(obj.favourite_articles, many= True).data
        
    def get_history_articles(self, obj):
        from Articles.ArticlesAPI.ArticlesSerializers.articles import ShortArticleSerializer
        articles= [history.article for history in MemberArticle.objects.filter(member= obj, is_active= True)]
        return ShortArticleSerializer(articles, many= True).data




        
          