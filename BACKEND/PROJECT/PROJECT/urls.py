"""PROJECT URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

from Articles.admin import content_admin_site
from Accounts.admin import accounts_admin_site

urlpatterns = [
    path('admin/', admin.site.urls),
    path("content-admin/", content_admin_site.urls),
    path("accounts-admin/", accounts_admin_site.urls),
    path("articles/", include("Articles.urls")),
    path("accounts/", include("Accounts.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
    urlpatterns += [path('ckeditor/', include('ckeditor_uploader.urls')),]

