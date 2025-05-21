import json, requests
from django.http import JsonResponse
from decimal import Decimal, InvalidOperation
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def analyzeSent(request): 
    if request.method != 'POST':
        return JsonResponse({'error': 'POST method required'}, status=405)

    try:
        data = json.loads(request.body)        
        username = data['username']
    except (KeyError, ValueError):
        return JsonResponse({'error': 'Invalid input'}, status=400)

    try:
        response = requests.get(
            'http://transaction-service:8001/transaction/logs/',
            params={'username': username}
        )
        if response.status_code != 200:
            return JsonResponse({'error': 'Failed to fetch transactions for'}, status=500)

        transactions_data = response.json()
        sent = transactions_data.get('sent_transactions', [])
    except Exception as e:
        return JsonResponse({'error': f'Error fetching transactions: {str(e)}'}, status=500)

    total_sent = Decimal('0')
    users = {}

    for transaction in sent:
        try:
            amount = Decimal(transaction['amount'])
            receiver = transaction['receiver']
        except (KeyError, InvalidOperation):
            continue

        total_sent += amount
        users[receiver] = users.get(receiver, 0) + 1

    return JsonResponse({
        'total_sent': str(total_sent),
        'receiver_frequencies': users
    })


@csrf_exempt
def analyzeReceived(request): 
    if request.method != 'POST':
        return JsonResponse({'error': 'POST method required'}, status=405)

    try:
        data = json.loads(request.body)
        username = data['username']
    except (KeyError, ValueError):
        return JsonResponse({'error': 'Invalid input'}, status=400)

    try:
        response = requests.get(
            'http://transaction-service:8001/transaction/logs/',
            params={'username': username}
        )
        if response.status_code != 200:
            return JsonResponse({'error': 'Failed to fetch transactions'}, status=500)

        transactions_data = response.json()
        received = transactions_data.get('received_transactions', [])
    except Exception as e:
        return JsonResponse({'error': f'Error fetching transactions: {str(e)}'}, status=500)

    total_received = Decimal('0')
    users = {}

    for transaction in received:
        try:
            amount = Decimal(transaction['amount'])
            sender = transaction['sender']
        except (KeyError, InvalidOperation):
            continue

        total_received += amount
        users[sender] = users.get(sender, 0) + 1

    return JsonResponse({
        'total_received': str(total_received),
        'sender_frequencies': users
    })
