from django.urls import path
from . import views
from user_service.accounts import views as accounts_views

urlpatterns = [
    path('', accounts_views.home, name='home'),
    path('transaction/send', views.send, name='send'),
    path('transaction/receive', views.receive, name='receive'),
    path('transaction/updateBalance', views.updateBalance, name='updateBalance'),
    path('transaction/logs', views.logs, name='logs'),
]
