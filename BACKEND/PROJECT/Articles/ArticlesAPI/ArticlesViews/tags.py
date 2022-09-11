from django.urls import path

from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework import generics

from Articles.models import Tag
from Articles.ArticlesAPI.serializers import TagSerializer
from Articles.ArticlesAPI.permissions import IsOwnerMember


class TagList(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class TagDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_url_kwarg = "tag_name"
    lookup_field = "name"


generic_urls = format_suffix_patterns([
    path("tags/list/", TagList.as_view(), name="tag_list"),
    path("tags/detail/<tag_name>/", TagDetail.as_view(), name="tag"),
])
