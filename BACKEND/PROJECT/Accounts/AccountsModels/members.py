from django.db import models
from django.contrib.auth import models as auth_models
from django.contrib import admin
from django.core.validators import MinValueValidator

from rest_framework import serializers

from Accounts.helpers.file_upload_config import avatar_img_config, default_bg, background_img_config
from Accounts.AccountsModels.authors import Author
from Articles.ArticlesModels.tags import Tag
from Articles.ArticlesModels.articles import Article

# Created my models here.
class Member(models.Model):
    user = models.OneToOneField(auth_models.User, on_delete=models.CASCADE)
    avatar = models.ImageField(
        upload_to=avatar_img_config,
        blank=True, 
        null=True
    )

    interests = models.ManyToManyField(Tag, blank=True)
    authors_followed = models.ManyToManyField(Author, blank=True)
    favourite_articles = models.ManyToManyField(
        Article, 
        blank=True, 
        related_name="favourite_articles"
    )
    history_articles = models.ManyToManyField(
        Article, 
        blank=True, 
        related_name= "history_articles", 
        through="MemberArticle", 
        through_fields =("member", "article"),
    )

    background = models.ImageField(
        upload_to=background_img_config, 
        blank=True, 
        null=True, 
        default=default_bg
    )
    
    def __str__(self):
        return str(self.user.username)




class MemberArticle(models.Model):
    # TODO: let a new entry be created each time an article is viewed instead of updating this one ;) 
    # (This is not an entry. It's a model you @#!*& )
    INTERACTION_ACTION = (
        ("CREATE", "CREATE"),
        ("READ", "READ"),
        ("UPDATE", "UPDATE"),
        ("DELETE", "DELETE"),
        ("FOLLOW", "FOLLOW"),
    )
    INTERACTION_MODEL = (
        ("ARTICLE", "ARTICLE"),
        ("FEEDBACK", "FEEDBACK"),
        ("REPORT", "REPORT"),
        ("AUTHOR", "AUTHOR"),
    )
    member = models.ForeignKey(Member, on_delete= models.CASCADE)
    article = models.ForeignKey(Article, on_delete= models.CASCADE)
    date_updated = models.DateTimeField(auto_now=True)
    query_count = models.IntegerField(default= 0, validators=[MinValueValidator(0)])
    is_active = models.BooleanField(default= True)

    # ACTION field -> what was the interaction:  
    # viewed an article,
    # made a comment, 
    # made a reporting,
    #  
    # , 

    def __str__(self):
        return f"{self.member} | {self.article}"

    class Meta:
        unique_together=[
            ("member", "article")
        ]

class MemberInteraction(models.Model):
    INTERACTION_ACTION = (
        ("CREATE", "CREATE"),
        ("READ", "READ"),
        ("UPDATE", "UPDATE"),
        ("DELETE", "DELETE"),
        ("LIST", "LIST"),
        ("FOLLOW", "FOLLOW"),
        ("LOGIN", "LOGIN"),
        ("LOGOUT", "LOGOUT"),
        ("REGISTER", "REGISTER"),
        ("DEREGISTER", "DEREGISTER"),
    )
    INTERACTION_MODEL = (
        ("ARTICLE", "ARTICLE"),
        ("FEEDBACK", "FEEDBACK"),
        ("REPORT", "REPORT"),
        ("AUTHOR", "AUTHOR"),
        ("MEMBER", "MEMBER"),
    )
    member = models.ForeignKey(Member, on_delete= models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)
    action = models.CharField(max_length= 20, choices=INTERACTION_ACTION)
    location = models.CharField(max_length= 20, choices=INTERACTION_MODEL)
    object_id = models.CharField(max_length=20, blank= True, null= True)
    is_active = models.BooleanField(default= True)

    def __str__(self):
        return f"{self.member} | {self.location} | {self.action}"


class MemberAdminView(admin.ModelAdmin):
    fieldsets = (
        ("Credentials",
            {"fields": ("user", "avatar", "background")}
         ),
        ("Interests",
            {"fields": ("interests", "favourite_articles", "authors_followed")}
         ),
    )


class MemberArticleAdminView(admin.ModelAdmin):
    list_display=["member", "article", "date_updated", "query_count"]
    fields=("member", "article", "query_count", "is_active")
    list_filter = (
        "is_active", 
        ("member", admin.RelatedOnlyFieldListFilter),
        ("article", admin.RelatedOnlyFieldListFilter),
    )

class MemberInteractionAdminView(admin.ModelAdmin):
    list_display=["member", "location", "action", "date_created",]
    fields=("member", "action", "location", "object_id",  "is_active")
    list_filter = (
        "is_active", 
        "location",
        "action",
        ("member", admin.RelatedOnlyFieldListFilter),
    )

# User
# Member bio
# follow author
# feedbacks
# interest topics (AI generated)
