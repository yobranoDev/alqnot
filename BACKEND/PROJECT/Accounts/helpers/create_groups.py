# Add these functions to a migration file

def create_author_group(apps, schema_editor):
    # Initailize models
    Group = apps.get_model("auth.Group")
    Permission = apps.get_model("auth.Permission")
    ContentType = apps.get_model("contenttypes.ContentType")
    Article = apps.get_model("Articles.Article")
    Tag = apps.get_model("Articles.Tag")
    SocialMediaHandle = apps.get_model("Accounts.SocialMediaHandle")
    Author = apps.get_model("Accounts.Author")

    # Create Author Group
    author_grp = Group.objects.get_or_create(name="Author")[0]
    print("\nAuthor Group was successfully created...")

    # Add author permissions
    article_cont_type = ContentType.objects.get_for_model(Article)
    handle_cont_type = ContentType.objects.get_for_model(SocialMediaHandle)
    tag_cont_type = ContentType.objects.get_for_model(Tag)
    author_cont_type = ContentType.objects.get_for_model(Author)

    author_permissions = [
        *Permission.objects.filter(content_type=author_cont_type)[1:],
        *Permission.objects.filter(content_type=handle_cont_type),
        *Permission.objects.filter(content_type=article_cont_type),
        *Permission.objects.filter(content_type=tag_cont_type),
        Permission.objects.get(codename="view_member"),
        Permission.objects.get(codename="view_feedback"),
    ]

    [author_grp.permissions.add(perm) for perm in author_permissions]

    author_grp.save()
    print("Permissions on Author Group have been successfully assigned.")


def create_member_group(apps, schema_editor):
    # Obtain Models
    Permission = apps.get_model("auth.Permission")
    Group = apps.get_model("auth.Group")
    ContentType = apps.get_model("contenttypes.ContentType")
    Feedback = apps.get_model("Articles.Feedback")
    Member = apps.get_model("Accounts.Member")

    # Create Member Group
    member_grp = Group.objects.get_or_create(name="Member")[0]
    print("\nMember Group was successfully created...")

    # Add Permissions to Group
    feedback_cont_type = ContentType.objects.get_for_model(Feedback)
    member_cont_type = ContentType.objects.get_for_model(Member)

    member_permissions = [
        *Permission.objects.filter(content_type=member_cont_type)[1:],
        *Permission.objects.filter(content_type=feedback_cont_type),
        Permission.objects.get(codename="view_author"),
        Permission.objects.get(codename="view_article"),
        Permission.objects.get(codename="view_tag"),
    ]
    [member_grp.permissions.add(perm) for perm in member_permissions]

    member_grp.save()
    print("Permissions on the Member Group have been successfully assigned...")
