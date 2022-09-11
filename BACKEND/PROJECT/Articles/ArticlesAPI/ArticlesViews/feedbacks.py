from django.urls import path
from django.shortcuts import get_object_or_404, get_list_or_404

import django_filters.rest_framework as drfFilter

from rest_framework import generics, serializers
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.response import Response as restResponse
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from Articles.models import Feedback, FeedbackFlag, ArticleFlag
from Articles.ArticlesAPI.serializers import FeedbackSerializer, FullFeedbackSerializer,FeedbackFlagSerializer, ArticleFlagSerializer
from Articles.ArticlesAPI.permissions import IsOwnerMember

from Accounts.AccountsModels.members import MemberInteraction

# --------------------------------------  Generic Views --------------------------------------


class FullFeedbackList(generics.ListAPIView):
    queryset = Feedback.objects.filter(is_active=True)
    serializer_class = FullFeedbackSerializer
    filter_backends = [drfFilter.DjangoFilterBackend]
    filterset_fields = {
        "article": ["exact"],
        "member": ["exact"],
        "parent": ["exact"],
        "satisfaction": ["exact", "gte", "lte"],
        "comment": ["icontains"],
        "date_updated": ["exact", "year__gt", "month__gt", "day__gt"],
    }

    def get(self, request, *args, **kwargs):
        if hasattr(request.user, "member"):
            MemberInteraction.objects.create(
                member=request.user.member,
                action="LIST",
                location="FEEDBACK",
            )
        return super().get(request, *args, **kwargs)

    


class FeedbackList(generics.ListCreateAPIView):
    queryset = get_list_or_404(Feedback, is_active=True)
    serializer_class = FeedbackSerializer
    filter_backends = [drfFilter.DjangoFilterBackend]
    filterset_fields = ["article", "member", "parent", "satisfaction"]

    def get_queryset(self):
        return  Feedback.objects.filter(is_active=True)

    def get(self, request, *args, **kwargs):
        if hasattr(request.user, "member"):
            MemberInteraction.objects.create(
                member=request.user.member,
                action="LIST",
                location="FEEDBACK",
            )
        return super().get(request, *args, **kwargs)


class FeedbackDetail(generics.RetrieveUpdateDestroyAPIView):
    
    serializer_class = FeedbackSerializer
    lookup_url_kwarg = "feedback_id"
    lookup_field = "id"
    permission_classes = [IsOwnerMember]
    
    def get_queryset(self):
        return Feedback.objects.filter(is_active= True)
    
    def delete(self, request, feedback_id, *args, **kwargs):
        if hasattr(request.user, "member"):
            MemberInteraction.objects.create(
                member=request.user.member,
                action="LIST",
                location="FEEDBACK",
                object_id= feedback_id
            )
        try:
            # instance in the feedback obj
            instance = self.get_object()
            children =  get_list_or_404(Feedback, is_active=True, parent= instance)

            if request.user.member == instance.member:
                instance.is_active = False
                instance.save()

                for child in children:
                    child.is_active = False
                    child.save()
                return restResponse({"message":"The feedback and its subsets were removed successfully."})
                
            else:
                raise serializers.ValidationError(
                {"member": "The authenticated user did not give this feedback. Loggin with correct account."})

        except:
            raise serializers.ValidationError(
                {"member": "The member is currently logged out. Loggin then try again."})



class FeedbackFlagCreate(generics.CreateAPIView):
    queryset = FeedbackFlag.objects.all()
    serializer_class = FeedbackFlagSerializer

class ArticleFlagCreate(generics.CreateAPIView):
    queryset = ArticleFlag.objects.all()
    serializer_class = ArticleFlagSerializer






generic_urls = format_suffix_patterns([
    path("full-feedbacks/list/", FullFeedbackList.as_view(),
         name="full_feedback_list"),
    path("feedbacks/list/", FeedbackList.as_view(), name="feedback_list"),
    path("feedbacks/detail/<feedback_id>/",
         FeedbackDetail.as_view(), name="feedback_detail"),
    path("feedbacks/flag/feedback/", FeedbackFlagCreate.as_view(), name="feedback_flag"),
    path("feedbacks/flag/article/", ArticleFlagCreate.as_view(), name="article_flag"),
])


# --------------------------------------  Function Views --------------------------------------
@api_view(["GET"])
def full_feedback_detail(request, feedback_id):
    query = get_object_or_404(Feedback, id=feedback_id, is_active=True)
    serializer = FullFeedbackSerializer(query)

    return restResponse(data=serializer.data)


fn_urls = [
    path("full-feedbacks/detail/<feedback_id>/",
         full_feedback_detail, name="full_feedback_detail"),
]
