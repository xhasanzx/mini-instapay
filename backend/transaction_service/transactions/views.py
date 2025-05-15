from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import requests, json
from decimal import Decimal, InvalidOperation
from .models import Logs


@csrf_exempt
def send(request):
    if request.method != 'POST':
        return JsonResponse({"error": "POST method required"}, status=405)

    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    amount = data.get('amount')
    receiver_name = data.get('receiverName')          
    
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
    'http://127.0.0.1:8000/user/profile/',
    params={'username': username, 'password': password}
    )
    if user_response.status_code != 200:
        return JsonResponse({'error': 'Invalid sender credentials'}, status=404)
    
    # Get receiver from user service
    receiver_response = requests.get(
        'http://127.0.0.1:8000/user/profile/',
        params={'username': receiver_name}
    )
    if receiver_response.status_code != 200:
        return JsonResponse({'error': 'Receiver not found'}, status=404)    
        
    user_data = user_response.json()
    receiver_data = receiver_response.json()

    user_balance = Decimal(user_data['balance'])
    receiver_balance = Decimal(receiver_data['balance'])

    if user_balance < amount:
        return JsonResponse({"error": "Insufficent funds"}, status=401)       
    
    user_balance-=amount
    receiver_balance+=amount
    
    addBalance(username, user_balance)
    addBalance(receiver_name, receiver_balance)

    saveTransaction(sender=username, receiver=receiver_name, amount=amount)

    return JsonResponse({
        "message": "Transaction successful",
        "updated_balance": str(user_balance)
    })            


@csrf_exempt
def receive(request):
    if request.method != 'POST':
        return JsonResponse({"error": "POST method required"}, status=405)

    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    amount = data.get('amount')
    sender_name = data.get('senderName')          
    
    if not all([username, password, amount, sender_name]):
        return JsonResponse({"error": "Missing required fields"}, status=400)

    try:
        amount = Decimal(amount)
        if amount < 0:
            return JsonResponse({'error': 'wrong input'}, status=500)
    except (InvalidOperation, TypeError):
        return JsonResponse({"error": "Invalid amount"}, status=400)

    # Get sender from user service
    user_response = requests.get(
    'http://127.0.0.1:8000/user/profile/',
    params={'username': username, 'password': password}
    )
    if user_response.status_code != 200:
        return JsonResponse({'error': 'Invalid sender credentials'}, status=404)
    
    # Get receiver from user service
    sender_response = requests.get(
        'http://127.0.0.1:8000/user/profile/',
        params={'username': sender_name}
    )
    if sender_response.status_code != 200:
        return JsonResponse({'error': 'Receiver not found'}, status=404)    
        
    user_data = user_response.json()
    sender_data = sender_response.json()

    user_balance = Decimal(user_data['balance'])
    sender_balance = Decimal(sender_data['balance'])

    if sender_balance < amount:
        return JsonResponse({"error": "Insufficent funds"}, status=401)       
    
    user_balance+=amount
    sender_balance-=amount
    
    addBalance(username, user_balance)
    addBalance(sender_name, sender_balance)

    saveTransaction(sender=sender_name, receiver=username, amount=amount)

    return JsonResponse({
        "message": "Transaction successful",
        "updated_balance": str(user_balance)
    })     


@csrf_exempt
def addBalance(request):
    if request.method != 'POST':
        return JsonResponse({"error": "POST method required"}, status=405)

    data = json.loads(request.body)
    username = data.get('username')
    balance = data.get('balance')
    
    if not all([username, balance]):
        return JsonResponse({"error": "Missing required fields for update"}, status=400)

    try:
        balance = Decimal(balance)
        if balance <= 0:
            return JsonResponse({"error": "Balance cannot be negative or zero"}, status=400)
    except (InvalidOperation, TypeError):
        return JsonResponse({"error": "Invalid balance"}, status=400)

    get_user_response = requests.get(
        'http://127.0.0.1:8000/user/profile/',
        params={'username': username}
    )
    
    if get_user_response.status_code != 200:
        return JsonResponse({'error': "Couldn't get user balance"}, status=404)
    
    user_data = get_user_response.json()
    
    newBalance = Decimal(user_data['balance']) + balance
    
    user_update_response = requests.post(
        'http://127.0.0.1:8000/user/update/',
        json={'username': username, 'balance': str(newBalance)}
    )
    
    if user_update_response.status_code != 200:
        return JsonResponse({'error': "Couldn't update user balance"}, status=404) 
    
    return JsonResponse({
        'message': 'balance updated successfully',
        'username': username,
        'oldBalance': str(user_data['balance']),
        'newBalance': str(newBalance)}, status=200)


@csrf_exempt
def saveTransaction(sender, receiver, amount):    
    if not all ([sender, receiver, amount]):
        return JsonResponse({'error saving transaction': 'missing required field'}, status=400)
    
    try:
        Logs.objects.create(sender=sender, receiver=receiver, amount=amount)
        return JsonResponse({'message': 'transaction was logged successfully'}, status=200)
    except Exception as e:
        return JsonResponse({'error saving transaction': str(e)}, status=500)    


@csrf_exempt
def getLogs(request):
    if request.method != "GET":
        return JsonResponse({'error':'get method required'})    

    username = request.GET.get('username')
    if username:
        sent_transactions = Logs.objects.filter(sender=username).values()
        received_transactions = Logs.objects.filter(receiver=username).values()

        return JsonResponse({
            "sent_transactions": list(sent_transactions),
            "received_transactions": list(received_transactions)
            }, status=200)
    
    allTransactions = list(Logs.objects.all().values())
    return JsonResponse({"allTransactions": allTransactions}, status=200)
