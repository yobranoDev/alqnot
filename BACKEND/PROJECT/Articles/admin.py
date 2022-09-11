from django.contrib import admin

from Articles.ArticlesModels import articles, feedbacks, tags

# Custom admin site for contents


class ContentAdmin(admin.AdminSite):
    site_header = "Content Admin"
    site_title = "content-admin"


content_admin_site = ContentAdmin(name="ContentAdmin")


# Register your models here.
content_models = [
    (articles.Article, articles.ArticleAdminView),
    (feedbacks.Feedback, feedbacks.FeedbackAdminView),
    (feedbacks.ArticleFlag, feedbacks.ArticleFlagAdminView),
    (feedbacks.FeedbackFlag, feedbacks.FeedbackFlagAdminView),
    (tags.Tag, tags.TagAdminView),

]

for model, model_view in content_models:
    content_admin_site.register(model, model_view)
    admin.site.register(model, model_view)
