from Accounts.AccountsAPI.AccountsViews.members import (
    MemberList,
    MemberDetail,
    generic_urls as MemberGenericURLs
)
from Accounts.AccountsAPI.AccountsViews.authors import (
    AuthorList,
    AuthorDetail,
    generic_urls as AuthorGenericURLs
)
from Accounts.AccountsAPI.AccountsViews.users import (
    register_user,
    fn_urls as RegisrtaionFnURLs
)

from Accounts.AccountsAPI.AccountsViews.socialMediaHandles import (
    SocialMediaHandleList,
    SocialMediaHandleDetail,
    generic_urls as SocialMediaHandleGenericURLs
)

from Accounts.AccountsAPI.AccountsViews.jwt_token_views import (
    MyTokenObtainPairView,
    TokenRefreshView,
    generic_urls as JWTTokenGenericURLs
)
