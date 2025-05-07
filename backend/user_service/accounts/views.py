from django.http import JsonResponse
from .models import User
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.
def home(request):        
    return JsonResponse({"message": "Welcome to the homepage"})

def mockUsers():
    User.objects.create(
        username="hassan", 
        password="hassan", 
        balance=3000
    )
    
def getAllUsers(request):    
    if request.method == 'GET':       
        try:            
            users = User.objects.all()
            user_list = [
                {
                    'username': user.username,
                    'balance': user.balance
                }
                for user in users
            ]
            return JsonResponse(user_list, safe=False)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
    
    return JsonResponse({"error": "GET method required"}, status=400)
    
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
        try:
            user = User.objects.get(username=username)
            return JsonResponse({
                "username": user.username,
                "password": user.password,
                "balance": str(user.balance)
            })
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        
    return JsonResponse({"error": "GET method required"}, status=400)

@csrf_exempt
def updateUser(request):
    if request.method != 'POST':
        return JsonResponse({"error": "POST method required"}, status=405)
    try:
        data = json.loads(request.body)
        
        username = data.get('username')    
        balance = data.get('balance')

        user = User.objects.get(username=username)

        user.balance = balance
        user.save()
        
        return JsonResponse({'message':'user updated successfully'}, status=200)
    except Exception as e:
        return JsonResponse({'message':f'{str(e)}'}, status=400)
