from django.shortcuts import render
from django.http import JsonResponse
from http.client import HTTPResponse
from .models import User

# Create your views here.
def home(request):        
    return JsonResponse({"message": "Welcome to the homepage"})


def logIn(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        try:
            user = User.objects.get(username=username, password=password)
            return JsonResponse({"message": "Login successful", "username": user.username})
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid credentials"}, status=401)
    
    return JsonResponse({"error": "POST method required"}, status=400)


def register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already taken"}, status=400)
        
        User.objects.create(username=username, password=password)
        return JsonResponse({"message": "User registered successfully"})
    
    return JsonResponse({"error": "POST method required"}, status=400)


def viewAccount(request):
    if request.method == 'GET':
        username = request.GET.get('username')
        password = request.GET.get('password')
        
        try:
            user = User.objects.get(username=username, password=password)
            return JsonResponse({
                "username": user.username,
                "balance": str(user.balance)
            })
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
    
    return JsonResponse({"error": "GET method required"}, status=400)
