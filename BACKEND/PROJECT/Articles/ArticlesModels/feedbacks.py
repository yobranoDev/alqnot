from django.db import models
from django.contrib import admin
from ckeditor.fields import RichTextField

from Articles.models import Article
from Accounts.models import Member
from django.core.validators import MinValueValidator, MaxValueValidator


class Feedback(models.Model):

    member = models.ForeignKey(
        Member, on_delete=models.SET_NULL, null=True, blank=False)
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    is_pinned = models.BooleanField(default=False)

    # 0 no response, 1 least statisfied, ---, 5 most statisfied
    satisfaction = models.IntegerField(
        default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
    parent = models.ForeignKey(
        "self", on_delete=models.SET_NULL, null=True, blank=True,)
    comment = RichTextField(null=True, blank=True, config_name="simple")

    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.id} | {self.article} | {self.member}"


class FeedbackAdminView(admin.ModelAdmin):
    # TODO: add a filter by article, is_active, member and dates
    list_display = ["id", "article", "member",  "date_created", "date_updated"]
    list_filter = [
        "is_active",
        "is_pinned",
        ("member", admin.RelatedOnlyFieldListFilter),
        ("article", admin.RelatedOnlyFieldListFilter),
    ]
    fieldsets = (
        ("Credentials",
            {"fields": [("member", "article"), "is_active", "is_pinned"]},
         ),
        ("Feedback",
            {"fields": ("satisfaction", "parent", "comment")},
         )
    )


BASIS_CHOICES = [
    ("SPAM_ADVERTISEMENT", "a lot of spam advertisements."),
    ("MISINFORMATION", "misleading or misinformed information."),
    ("HATE_SPEECH", "hate speech and incites violence towards some social group."),
    ("PORNOGRAPHIC", "pornographic and sexual content."),
    ("BULLY", "bullying."),
    ("TERRORISM", "terroristic advocacy."),
    ("SELF_INJURY", "suicidal and self-harm content."),
    ("HUMANITARIAN", "humanitarian (or animal) abuse such as child abuse"),
]


class ArticleFlag(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    member = models.ForeignKey(Member, on_delete=models.SET_NULL, null=True)
    basis = models.CharField(
        max_length=20, choices=BASIS_CHOICES,)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.id} | {self.member} | {self.article}"


class ArticleFlagAdminView(admin.ModelAdmin):
    list_display = [
        "article",
        "member",
        "basis",
        "date_created",
    ]

    list_filter = [
        "basis",
        ("article", admin.RelatedOnlyFieldListFilter),
        ("member", admin.RelatedOnlyFieldListFilter),
    ]

    fieldsets = (
        ("Components",
            {"fields": ["member", "article"]}),
        ("Attributes",
            {"fields": ["basis", ]})
    )


class FeedbackFlag(models.Model):
    member = models.ForeignKey(Member, on_delete=models.SET_NULL, null=True)
    feedback = models.ForeignKey(
        Feedback, on_delete=models.SET_NULL, null=True,)
    basis = models.CharField(
        max_length=20, choices=BASIS_CHOICES,)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.id} | {self.member} | {self.feedback.id}"


class FeedbackFlagAdminView(admin.ModelAdmin):
    list_display = [
        "feedback",
        "member",
        "basis",
        "date_created",
    ]

    list_filter = [
        "basis",
        ("feedback", admin.RelatedOnlyFieldListFilter),
        ("member", admin.RelatedOnlyFieldListFilter),
    ]

    fieldsets = (
        ("Components",
            {"fields": ["member", "feedback"]}),
        ("Attributes",
            {"fields": ["basis", ]})
    )
