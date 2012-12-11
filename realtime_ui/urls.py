from django.conf.urls import patterns, include, url
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = patterns('',
    url(r'^', include('realtime_ui.realtime.urls')),
)

if settings.DEBUG:
    urlpatterns += staticfiles_urlpatterns()
