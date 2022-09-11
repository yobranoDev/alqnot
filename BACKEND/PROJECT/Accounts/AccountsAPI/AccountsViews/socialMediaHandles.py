from rest_framework import generics
from django.urls import path

from rest_framework.urlpatterns import format_suffix_patterns
from Accounts.models import SocialMediaHandle
from Accounts.AccountsAPI.AccountsSerializers.socialMediaHandles import SocialMediaHandleSerializer

class SocialMediaHandleList(generics.ListCreateAPIView):
    queryset = SocialMediaHandle.objects.all()
    serializer_class  = SocialMediaHandleSerializer

class SocialMediaHandleDetail(generics.RetrieveDestroyAPIView):
    queryset = SocialMediaHandle.objects.all()
    serializer_class  = SocialMediaHandleSerializer
    lookup_url_kwarg = "handle_id"
    lookup_feilds = "id"


generic_urls = format_suffix_patterns([
    path("handles/list/", SocialMediaHandleList.as_view(), name = "SocialMediaHandleList"),
    path("handles/detail/<handle_id>/", SocialMediaHandleDetail.as_view(), name = "SocialMediaHandleDetail"),
])  