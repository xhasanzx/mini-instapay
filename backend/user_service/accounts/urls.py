from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('user/register/', views.register, name='register'),
    path('user/login/', views.logIn, name='login'),
    path('user/profile', views.viewAccount, name='profile'),
]
