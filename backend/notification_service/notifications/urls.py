from django.urls import path
from . import views

urlpatterns = [
    path('notifications/request/', views.request_notification, name='request_notification'),
    path('notifications/all-requests/', views.get_requests, name='get_requests'),
    path('notifications/sent/', views.sent_notification, name='sent_notification'),
    path('notifications/received/', views.received_notification, name='received_notification'),
    path('notifications/all-notifications/', views.get_notifications, name='get_notifications'),
]
