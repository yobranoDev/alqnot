from django.urls import path
from django.shortcuts import get_object_or_404, get_list_or_404

from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response as RestResponse

from Accounts.AccountsModels.members import MemberArticle, Member
from Accounts.AccountsAPI.AccountsSerializers.members import MemberSerializer, FullMemberSerializer, MemberArticleSerializer

class MemberList(generics.ListCreateAPIView):
    queryset = Member.objects.all()
    serializer_class  = MemberSerializer

class MemberDetail(generics.RetrieveAPIView):
    serializer_class  = FullMemberSerializer
    lookup_url_kwarg = "member_id"
    lookup_feilds = "id"

    def get_queryset(self):
        user = self.request.user
        return Member.objects.filter(user = user, id=self.kwargs.get(self.lookup_url_kwarg))

class MemberArticleList(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MemberArticleSerializer

    def get_queryset(self):
        user = self.request.user
        obj = MemberArticle.objects.filter(member= user.member, is_active= True)
        return obj


class MemberFavouriteArticle(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        selected_articles = request.data.get("selected_articles")
        print(request.data)
        request.user.member.favourite_articles.add(*selected_articles)
        return RestResponse({"message": "Added favourite articles successfully"})

    def delete(self, request):
        selected_articles = request.data.get("selected_articles")
        request.user.member.favourite_articles.remove(*selected_articles)
        return RestResponse({"message": "Removed favourite articles successfully"})
        

class MemberArticleDelete(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MemberArticleSerializer

    def delete(self, request):
        query = get_list_or_404(
            MemberArticle,
            member= request.user.member, 
            is_active= True, 
            article__in= request.data.get("selected_articles")
        )
        for article in query:
            article.is_active = False
            article.save()
        
        return RestResponse({"message": "deleted successfully."})


generic_urls = format_suffix_patterns([
    path("members/list/", MemberList.as_view(), name = "MemberList"),
    path("members/detail/<member_id>/", MemberDetail.as_view(), name = "MemberDetail"),
    path("members/history/", MemberArticleDelete.as_view(), name = "MemberArticleDelete"),
    path("members/favourite/", MemberFavouriteArticle.as_view(), name = "MemberFavouriteArticle"),
    path("members/history/list/", MemberArticleList.as_view(), name = "MemberArticleList"),
])