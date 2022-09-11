from django.urls import path, include

app_name = "Articles"
urlpatterns = [
    path("api/", include("Articles.ArticlesAPI.urls", namespace= "ArticlesAPI") ),
]