# TODO: Helper for view authenication by user group.
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth.models import User, Group
from Accounts.models import Member, Author


@receiver(post_save, sender=User)
def create_member(sender, instance, created, *args, **kwargs):
    """
        For each user that is registered, a corresponding member is created.
        The user is the added in the member group
    """
    if created:
        member_group, is_created = Group.objects.get_or_create(name="Member")
        if is_created:
            # TODO: include member permissions
            pass
        instance.groups.add(member_group)
        Member.objects.get_or_create(user=instance)


@receiver(post_save, sender=Author)
def set_author(sender, instance, created, *args, **kwargs):
    """
        When an author object is created, 
        the corresponding user is added to the authors group.
    """
    if created:
        author_group, is_created = Group.objects.get_or_create(name="Author")
        if is_created:
            # TODO: include author permissions
            pass
        instance.user.groups.add(author_group)
        Author.objects.get_or_create(user=instance.user)
