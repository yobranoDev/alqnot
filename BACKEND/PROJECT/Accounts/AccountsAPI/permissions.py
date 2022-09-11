from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAnAuthor(BasePermission):
    message = 'Editing articles is restricted to the authors only.'

    def has_object_permission(self, request, view, obj):
        
        if request.method in SAFE_METHODS:
            return True
        # I need to filter who can only edit book in this part but
        # obj.authors when print is none
        try:
            if request.user.author == obj.author :
                return True
        except:
            return False

        return False


