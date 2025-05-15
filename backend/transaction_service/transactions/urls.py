from django.urls import path
from . import views

urlpatterns = [    
    path('transaction/send', views.send, name='send'),    
    path('transaction/logs', views.getLogs, name='logs'),    
    path('transaction/addBalance', views.addBalance, name='addBalance'),
    # integration with notification service
    # path('transaction/receive', views.receive, name='receive'),
    
]
