from rest_framework import generics
from django.urls import path

from rest_framework.urlpatterns import format_suffix_patterns
from Accounts.models import Author
from Accounts.AccountsAPI.AccountsSerializers.authors import AuthorSerializer, FullAuthorSerializer


class FullAuthorDetail(generics.RetrieveAPIView):
    queryset = Author.objects.all()
    serializer_class = FullAuthorSerializer
    lookup_url_kwarg = "author_id"
    lookup_feilds = "id"

class AuthorList(generics.ListCreateAPIView):
    queryset = Author.objects.all()
    serializer_class  = AuthorSerializer

class AuthorDetail(generics.RetrieveDestroyAPIView):
    queryset = Author.objects.all()
    serializer_class  = AuthorSerializer
    lookup_url_kwarg = "author_id"
    lookup_feilds = "id"


generic_urls = format_suffix_patterns([
    path("authors/list/", AuthorList.as_view(), name = "AuthorList"),
    path("authors/detail/<author_id>/", AuthorDetail.as_view(), name = "AuthorDetail"),
    path("authors/full-detail/<author_id>/", FullAuthorDetail.as_view(), name = "FullAuthorDetail"),
])

