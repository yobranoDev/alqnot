from django.db import models
from django.contrib import admin
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from ckeditor_uploader.fields import RichTextUploadingField
from ckeditor.fields import RichTextField

from Accounts.AccountsModels.authors import Author
from .tags import Tag
from Articles.helpers.file_upload_config import thumbnail_config

# TODO: reading time estimate


class Article(models.Model):
    title = models.CharField(max_length=200, )
    slug = models.SlugField(unique=True)
    author = models.ForeignKey(Author, on_delete=models.SET_NULL, null=True)
    is_active = models.BooleanField(default=True)
    is_published = models.BooleanField(default=True)
    is_pinned = models.BooleanField(default=False)

    # TODO: Order by updated time
    reading_duration = models.IntegerField(validators=[MinValueValidator(0)])
    thumbnail = models.ImageField(
        upload_to=thumbnail_config, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    summary = RichTextField(blank=True, null=True, config_name="simple")
    content = RichTextUploadingField(blank=True, null=True)
    tags = models.ManyToManyField(Tag, blank=True)
    related_articles = models.ManyToManyField("Article", blank=True)

    date_created = models.DateTimeField(auto_now_add=True, )
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.title)


# Model View in Admin site
class ArticleAdminView(admin.ModelAdmin):
    list_display = ["title", "author", "date_updated", "date_created", ]
    list_filter = [
        "is_active",
        "is_pinned",
        "is_published",
        ("author", admin.RelatedOnlyFieldListFilter),
        ("tags", admin.RelatedOnlyFieldListFilter),
    ]

    fieldsets = (
        ("Credentials",
            {"fields": (
                "author",
                ("title", "slug"),
                ("is_active", "is_pinned",  "is_published",),
            )}
         ),
        ("Body",
            {"fields": (
                "reading_duration",
                "description",
                "summary",
                "thumbnail",
                "content",
                "tags",
                "related_articles",
            )}
         ),
    )
