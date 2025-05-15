from django.urls import path
from . import views

urlpatterns = [
    path('notifications/request/', views.request_notification, name='request_notification'),
]
