from django.urls import path
from django.shortcuts import get_object_or_404, get_list_or_404
from django_filters import rest_framework as drfFilter

from rest_framework import generics
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response as RestResponse
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from Articles.models import Article
from Articles.ArticlesAPI.serializers import ArticleSerializer, FullArticleSerializer, ShortArticleSerializer
from Articles.ArticlesAPI.filters import ArticlePaginate

from Accounts.AccountsModels.members import MemberArticle, MemberInteraction

# --------------------------------------  Generic Views --------------------------------------


class RecommendArticleList(generics.ListAPIView):
    queryset = Article.objects.filter(is_active=True, is_published=True)
    serializer_class = ShortArticleSerializer
    pagination_class = ArticlePaginate
    filter_backends = [drfFilter.DjangoFilterBackend]
    filterset_fields = {
        "title": ["icontains"],
        "slug": ["icontains"],
        "description": ["icontains"],
        "tags": ["exact"],
        "author": ["exact"],
        "date_updated": ["exact", "year__gt", "month__gt", "day__gt"],
        "date_created": ["exact", "year__gt", "month__gt", "day__gt"],
        "reading_duration": ["exact", "lte", "gte"]
    }

    def get(self, request,  *args, **kwargs):
        if hasattr(request.user, "member"):
            MemberInteraction.objects.create(
                member=request.user.member,
                action="LIST",
                location="ARTICLE",
            )
        return super().get(request, *args, **kwargs)

class ArticleList(generics.ListCreateAPIView):
    queryset = Article.objects.filter(is_active=True, is_published=True)
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request,  *args, **kwargs):
        if hasattr(request.user, "member"):
            MemberInteraction.objects.create(
                member=request.user.member,
                action="LIST",
                location="ARTICLE",
            )
        return super().get(request, *args, **kwargs)

    def create(self, request,  *args, **kwargs):
        if hasattr(request.user, "member"):
            MemberInteraction.objects.create(
                member=request.user.member,
                action="CREATE",
                location="ARTICLE",
                object_id=request.data.get("slug")

            )
        return super().create(request, *args, **kwargs)


class ArticleDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.filter(is_active=True, is_published=True)
    serializer_class = ArticleSerializer
    lookup_url_kwarg = "article_slug"
    lookup_field = "slug"
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request, article_slug,  *args, **kwargs):
        if hasattr(request.user, "member"):
            MemberInteraction.objects.create(
                member=request.user.member,
                action="READ",
                location="ARTICLE",
                object_id=Article.objects.get(slug=article_slug).id
            )
        return super().get(request, article_slug,  *args, **kwargs)

    def put(self, request, article_slug,  *args, **kwargs):
        if hasattr(request.user, "member"):
            MemberInteraction.objects.create(
                member=request.user.member,
                action="UPDATE",
                location="ARTICLE",
                object_id=Article.objects.get(slug=article_slug).id
            )
        return super().put(request, article_slug,  *args, **kwargs)

    def patch(self, request, article_slug,  *args, **kwargs):
        if hasattr(request.user, "member"):
            MemberInteraction.objects.create(
                member=request.user.member,
                action="UPDATE",
                location="ARTICLE",
                object_id=Article.objects.get(slug=article_slug).id
            )
        return super().patch(request, article_slug,  *args, **kwargs)

    def delete(self, request, article_slug,  *args, **kwargs):
        article_query = get_object_or_404(
            Article, is_active=True, is_published=True, slug=article_slug)
        article_query.is_active = False
        article_query.is_published = False
        article_query.slug = article_query.slug + "_ARCHIVED"
        article_query.title = article_query.title + "_ARCHIVED"
        article_query.save()

        if hasattr(request.user, "member"):
            MemberInteraction.objects.create(
                member=request.user.member,
                action="DELETE",
                location="ARTICLE",
                object_id=article_query.id
            )

        return RestResponse({"message": "Article Achived Successfully."})


generic_urls = format_suffix_patterns([
    path("articles/recommend/", RecommendArticleList.as_view(),
         name="RecommendArticleList"),
    path("articles/list/", ArticleList.as_view(), name="ArticleList"),
    path("articles/detail/<article_slug>/",
         ArticleDetail.as_view(), name="ArticleDetail"),
])


# --------------------------------------  Functional Veiws  --------------------------------------


@api_view(["GET"])
def full_article_detail(request, article_slug):
    article_query = get_object_or_404(
        Article, slug=article_slug,  is_active=True,  is_published=True)
    serializer = FullArticleSerializer(
        article_query, context={"request": request})

    if hasattr(request.user, "member"):
        member_article_query = MemberArticle.objects.get_or_create(
            member=request.user.member, article=article_query)[0]
        member_article_query.query_count += 1
        member_article_query.is_active = True
        member_article_query.save()

        MemberInteraction.objects.create(
            member=request.user.member,
            action="READ",
            location="ARTICLE",
            object_id=article_query.id
        )

    return RestResponse(data=serializer.data)


fn_urls = [
    path("full-articles/detail/<article_slug>/",
         full_article_detail, name="full_article_detail"),
]
