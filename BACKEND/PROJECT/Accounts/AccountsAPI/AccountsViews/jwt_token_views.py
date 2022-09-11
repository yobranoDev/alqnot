from Accounts.AccountsAPI.AccountsSerializers.jwt_token_serializer import MyTokenObtainPairSerializer
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response as RestResponse
from rest_framework.views import APIView
from rest_framework import status
# ----------------------- Class Views -----------------------
# JWT-Token View
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class  = MyTokenObtainPairSerializer

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return RestResponse(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return RestResponse(status=status.HTTP_400_BAD_REQUEST)

generic_urls = [
    path("token/", MyTokenObtainPairView.as_view(), name= "MyTokenObtainPairView"),
    path("token/logout/", LogoutView.as_view(), name= "LogoutView"),
    path("token/refresh/", TokenRefreshView.as_view(), name= "TokenRefreshView"),
]