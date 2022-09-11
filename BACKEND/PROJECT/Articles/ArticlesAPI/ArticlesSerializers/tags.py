from rest_framework import serializers
from Articles.models import Tag

# Model Serializer
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "label",]
