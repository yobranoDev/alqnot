from django.db import models
from django.contrib.auth import models as auth_models
from django.contrib import admin

from Accounts.helpers.file_upload_config import avatar_img_config, default_bg, background_img_config
from Articles.ArticlesModels.tags import Tag
from Accounts.AccountsModels.socialMediaHandles import SocialMediaHandle


# Created my models here.

class Author(models.Model):
    user = models.OneToOneField(auth_models.User, on_delete=models.CASCADE,)
    biography = models.TextField(blank=True, null=True)
    interests = models.ManyToManyField(Tag, blank=True)
    social_media_handles = models.ManyToManyField(
        SocialMediaHandle, blank=True)
    avatar = models.ImageField(upload_to=avatar_img_config, blank= True, null= True)
    background = models.ImageField(upload_to=background_img_config, blank= True, null= True, default=default_bg)
     
    def __str__(self):
        return str(self.user.username)


class AuthorAdminView(admin.ModelAdmin):
    fieldsets = (
        ("Credentials",
            {"fields": ("user", "avatar", "background")}
         ),
        ("Biograpy",
            {"fields": ("biography", "interests", "social_media_handles")}
         ),
    )

# User.
# Social media handles
# autho-Bio
# recomendability (AI generated)
