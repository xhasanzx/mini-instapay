from django.shortcuts import render
from django.http import JsonResponse
import requests
from user_service.accounts.models import User
from decimal import Decimal, InvalidOperation
from models import Transactions, Balance

# Create your views here.
def send(request):
    if request.method != 'POST':
        return JsonResponse({"error": "POST method required"}, status=405)

    username = request.POST.get('username')
    password = request.POST.get('password')
    amount = request.POST.get('amount')
    receiver_name = request.POST.get('receiverName')          
    
    if not all([username, password, amount, receiver_name]):
        return JsonResponse({"error": "Missing required fields"}, status=400)

    try:
        amount = Decimal(amount)
        if amount < 0:
            return JsonResponse({'error': 'wrong input'}, status=500)
    except (InvalidOperation, TypeError):
        return JsonResponse({"error": "Invalid amount"}, status=400)

    # Get sender from user service
    user_response = requests.get(
        'http://user/profile/',
        params={'username': username, 'password': password}
    )
    if user_response.status_code != 200:
        return JsonResponse({'error': 'Invalid sender credentials'}, status=404)
    user_data = user_response.json()

    # Get receiver from user service
    receiver_response = requests.get(
        'http://user/profile/',
        params={'username': receiver_name}
    )
    if receiver_response.status_code != 200:
        return JsonResponse({'error': 'Receiver not found'}, status=404)
    receiver_data = receiver_response.json()
    
    try:
        user_balance = Decimal(user_data['balance'])
        receiver_balance = Decimal(receiver_data['balance'])
    except (KeyError, InvalidOperation):
        return JsonResponse({'error': 'Invalid balance data'}, status=500)
    
    if user_balance < amount:
        return JsonResponse({"error": "Insufficent funds"}, status=401)
    
    try:
        sender_balance_obj = Balance.objects.get(username=username)
        receiver_balance_obj = Balance.objects.get(username=receiver_name)
    except Balance.DoesNotExist:
        return JsonResponse({'error': 'Balance record not found'}, status=404)
    
    sender_balance_obj.amount -= amount
    receiver_balance_obj.amount += amount

    sender_balance_obj.save()
    receiver_balance_obj.save()

    return JsonResponse({
        "message": "Transaction successful",
        "updated_balance": str(sender_balance_obj.amount)
    })            


def receive(request):    
    return JsonResponse({"error": "POST method required"}, status=405)


def updateBalance(request):
    return JsonResponse({"error" : "POST method required"}, status=400)


def logs(request):    
    return JsonResponse({'error': 'GET method required'}, status=405)

