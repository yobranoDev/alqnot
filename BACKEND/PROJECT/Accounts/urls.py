from django.urls import path, include


app_name = "Account"
urlpatterns = [
    path("api/", include("Accounts.AccountsAPI.urls", namespace= "AccountsAPI")),
]