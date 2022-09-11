import django_filters.rest_framework as drfFilter
from Articles.ArticlesModels.feedbacks import Feedback
from rest_framework.pagination import LimitOffsetPagination

class ArticlePaginate(LimitOffsetPagination):
    default_limit = 10
    max_limit =  50


class FeedbackFilter(drfFilter.FilterSet):
    class Meta:
        model = Feedback
        fields = {
            "member": ["exact"],
            "article": ["exact"],
            "date_created": ["exact", "year__gt"],
            "date_updated": ["exact", "year__gt"],
            "satisfaction": ["exact", "gte", "lte"]
        }
