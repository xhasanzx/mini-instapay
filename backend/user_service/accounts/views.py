from django.http import JsonResponse
from .models import User
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from decimal import Decimal, InvalidOperation
import json


@csrf_exempt
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
    

@csrf_exempt
def logIn(request):    
    if request.method != 'POST':
        return JsonResponse({"error": "POST method required"}, status=405)
    
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return JsonResponse({"error": "Username and password are required"}, status=400)
        
        try:
            user = User.objects.get(username=username, password=password)
            return JsonResponse({
                "message": "Login successful",
                "username": user.username
            })
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid credentials"}, status=401)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
        

@csrf_exempt
def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            if not username or not password:
                return JsonResponse({"error": "Username and password are required"}, status=400)
            
            if User.objects.filter(username=username).exists():
                return JsonResponse({"error": "Username already taken"}, status=400)
            
            user = User.objects.create(username=username, password=password)
            return JsonResponse({
                "message": "User registered successfully",
                "username": user.username
            })
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    
    return JsonResponse({"error": "POST method required"}, status=400)


@csrf_exempt
def viewAccount(request):
    if request.method != 'GET':
        return JsonResponse({"error": "GET method required"}, status=405)
    
    username = request.GET.get('username')
    if not username:
        return JsonResponse({"error": "Username is required"}, status=400)
        
    try:
        user = User.objects.get(username=username)
            
        return JsonResponse({
            "username": user.username,
            "password": user.password,
            "balance": str(user.balance)
        })
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)


@csrf_exempt
def updateUser(request):
    if request.method != 'POST':
        return JsonResponse({"error": "POST method required"}, status=405)
    try:
        data = json.loads(request.body)
        username = data.get('username')    
        balance = data.get('balance')
        
        if not all([username, balance]):
            return JsonResponse({"error": "Missing required fields"}, status=400)
        
        try:        
            if Decimal(balance) < 0:
                return JsonResponse({"error": "Balance cannot be negative"}, status=400)
        except (InvalidOperation, TypeError):
            return JsonResponse({"error": "Invalid balance"}, status=400)
    
        user = User.objects.get(username=username)

        user.balance = balance
        user.save()
        
        return JsonResponse({'message':'user updated successfully'}, status=200)
    except Exception as e:
        return JsonResponse({'message':f'{str(e)}'}, status=400)
