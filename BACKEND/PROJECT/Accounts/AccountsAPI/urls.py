from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import MemberGenericURLs, AuthorGenericURLs, SocialMediaHandleGenericURLs, JWTTokenGenericURLs, RegisrtaionFnURLs

app_name = "AccountAPI"

urlpatterns = []

# ----------------- Generic View Urls ----------------- 
urlpatterns += MemberGenericURLs
urlpatterns += AuthorGenericURLs
urlpatterns += SocialMediaHandleGenericURLs

# ----------------- Function View Urls ----------------- 
urlpatterns += RegisrtaionFnURLs
urlpatterns += JWTTokenGenericURLs

