from Accounts.AccountsAPI.AccountsSerializers import users
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response as restResponse


from django.urls import path


# ----------------------- Function Views -----------------------
@api_view(["POST"])
def register_user(request):
    context_data = {}

    if request.method == "POST":
        print(request.data)
        serializer = users.UserRegistrationSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            context_data["username"] = user.username
            context_data["email"] = user.email
        else:
            context_data = serializer.errors

        return restResponse(context_data)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_user(request):
    if request.method == "DELETE":
        user = request.user
        user.is_active = False
        user.save()
        return restResponse({"message": "deleted user"})

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user(request):
    if request.method == "PUT":
        serializer = users.UserSerializer(request.user, data = request.data)
        if serializer.is_valid():
            serializer.save()
            serializer = serializer.data 
            
        else:
            serializer = serializer.errors
        
        return restResponse(serializer)


fn_urls = [
    path("register/", register_user, name="register_user"),
    path("update/", update_user, name="update_user"),
    path("delete/", delete_user, name="delete_user"),
]
