from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework import serializers


class IsOwnerMember(BasePermission):
    
    def has_object_permission(self, request, view, obj):
        self.message = "Only the object's creator can perform the requested function. Loggin with the correct account then try again."
        
        try:
            if not (request.method in SAFE_METHODS):
                return request.user.member == obj.member

        except AttributeError:
            raise serializers.ValidationError({"member": self.message})        
        
        return True


class IsOwnerAuthor(BasePermission):

    def has_object_permission(self, request, view, obj):
        self.message = "Only the object's creator can perform the requested function. Loggin with the correct account then try again."
        
        try:
            if not (request.method in SAFE_METHODS):
                return request.user.author == obj.author

        except AttributeError :
            raise serializers.ValidationError({"author": self.message})        
        
        return True