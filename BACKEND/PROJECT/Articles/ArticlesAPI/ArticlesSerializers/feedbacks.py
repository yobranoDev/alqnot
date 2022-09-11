from rest_framework import serializers
from Articles.models import Feedback, FeedbackFlag, ArticleFlag

from Accounts.AccountsAPI.serializers import ShortMemberSerializer

# Model Serializers


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        exclude = ["is_active"]
        read_only_fields = ['member', "id", "date_created", "date_updated"]

    def create(self, validated_data):
        feedback = Feedback(
            article=validated_data["article"],
            parent=validated_data["parent"],
            satisfaction=validated_data["satisfaction"],
            comment=validated_data["comment"],
        )

        request = self.context.get("request")
        try:
            feedback.member = request.user.member
        except:
            raise serializers.ValidationError(
                {"member": "The attached member is currently logged out. Loggin then try again."})

        feedback.save()
        return feedback


class FullFeedbackSerializer(serializers.ModelSerializer):
    member = ShortMemberSerializer(read_only=True)
    is_writer = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Feedback
        exclude = ["is_active"]

    def get_is_writer(self, obj):
        request = self.context.get("request")
        try:
            return obj.member == request.user.member
        except AttributeError:
            return False


class FeedbackFlagSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackFlag
        fields = "__all__"
        read_only_fields = ["id", "date_created",]

    
    def create(self, validated_data):
        feedback_flag = FeedbackFlag(
            feedback=validated_data["feedback"],
            basis=validated_data["basis"],
        )

        request = self.context.get("request")
        try:
            feedback_flag.member = request.user.member
        except:
            raise serializers.ValidationError(
                {"member": "The attached member is currently logged out. Loggin then try again."})

        feedback_flag.save()
        return feedback_flag

class ArticleFlagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleFlag
        fields = "__all__"

    def create(self, validated_data):
        article_flag = ArticleFlag(
            article = validated_data["article"],
            basis = validated_data["basis"],
        )

        request = self.context.get("request")
        try:
            article_flag.member = request.user.member
        except:
            raise serializers.ValidationError(
                {"member": "The attached member is currently logged out. Loggin then try again."})

        article_flag.save()
        return article_flag