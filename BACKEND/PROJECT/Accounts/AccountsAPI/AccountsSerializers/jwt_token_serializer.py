
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .members import FullMemberSerializer
from .authors import FullAuthorSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        group_serializer_pairs = {
            "Member": lambda: FullMemberSerializer(user.member),
            "Author": lambda: FullAuthorSerializer(user.author),
        }

        token = super().get_token(user)
        token["member_id"] = user.member.id
        token["profile"] = {grp.name.lower(): group_serializer_pairs[grp.name]().data
                            for grp in user.groups.all()}
        return token
