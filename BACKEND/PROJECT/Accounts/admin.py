from django.contrib import admin
from Accounts.AccountsModels import members, authors, socialMediaHandles
# Register your models here.

class AccountsAdmin(admin.AdminSite):
    site_header= "Accounts Admin"
    site_title = "accounts-admin"

accounts_admin_site = AccountsAdmin(name= "AccountsAdmin")

# Register your models here.
author_models = [
    (authors.Author, authors.AuthorAdminView), 
    (members.Member, members.MemberAdminView), 
    (socialMediaHandles.SocialMediaHandle, socialMediaHandles.SocialMediaHandleAdminView), 

]

for model, model_view in author_models:
    accounts_admin_site.register(model, model_view)
    admin.site.register(model, model_view)

admin.site.register(members.MemberArticle, members.MemberArticleAdminView)
admin.site.register(members.MemberInteraction, members.MemberInteractionAdminView)




