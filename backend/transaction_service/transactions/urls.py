from django.urls import path
from . import views

urlpatterns = [    
    path('transaction/send', views.send, name='send'),
    path('transaction/receive', views.receive, name='receive'),
    path('transaction/updateBalance', views.updateBalance, name='updateBalance'),
    path('transaction/logs', views.Logs, name='logs'),
]
