from rest_framework import serializers

from Accounts.AccountsAPI.serializers import FullAuthorSerializer, ShortAuthorSerializer
from .tags import TagSerializer
from .feedbacks import FullFeedbackSerializer

from Articles.models import Article, Feedback

# Model Serializers


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        exclude = ["is_active"]


class FullArticleSerializer(serializers.ModelSerializer):
    author = FullAuthorSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    feedbacks = serializers.SerializerMethodField()
    reporting_basis = serializers.SerializerMethodField()
    is_favourite = serializers.SerializerMethodField()

    class Meta:
        model = Article
        exclude = ["is_active"]

    def get_is_favourite(self, obj):
        user = self.context.get("request").user
        if hasattr(user, "member"):
            return obj in user.member.favourite_articles.all()

        return False

    def get_feedbacks(self, obj):
        query = Feedback.objects.filter(article=obj,  is_active=True)
        request = self.context.get("request")
        serializer = FullFeedbackSerializer(
            query, many=True, context={"request": request})
        return serializer.data

    def get_reporting_basis(self, obj):
        from Articles.ArticlesModels.feedbacks import BASIS_CHOICES
        return BASIS_CHOICES


class ShortArticleSerializer(serializers.ModelSerializer):
    author = ShortAuthorSerializer(read_only=True)

    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "slug",
            "author",
            "thumbnail",
            "description",
            "reading_duration",
            "date_updated",
        ]
