from django.urls import path
from .views import ArticleGenericURLs, ArticleFnURLs, FeedbackGenericURLs, FeedbackFnURLs, TagGenericURLs


app_name = "ArticlesAPI"
urlpatterns = []

# -------------- Generic URLs --------------

urlpatterns += ArticleGenericURLs
urlpatterns += FeedbackGenericURLs
urlpatterns += TagGenericURLs


# -------------- Function URLs --------------
urlpatterns += ArticleFnURLs