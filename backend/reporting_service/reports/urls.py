from . import views
from django.urls import path

urlpatterns = [
    path('reports/sent/', views.analyzeSent, name='analyzeSent'),
    path('reports/received/', views.analyzeReceived, name='analyzeReceived'),
]
