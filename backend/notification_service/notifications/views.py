import requests, json
from django.http import JsonResponse
from .models import Notification, Request
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def get_notifications(request):
    username = request.GET.get('username')
    notifications = Notification.objects.filter(username=username)
    return JsonResponse({'notifications': list(notifications)})


@csrf_exempt
def sent_notification(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST method required'}, status=405)
    
    data = json.loads(request.body)
    username = data.get('username')
    sender = data.get('sender')
    amount = str(data.get('amount'))
    
    message = f"Transaction Successful! {amount}$ has been sent to {sender}."
    Notification.objects.create(username=username, message=message, type='sent')    
    return JsonResponse({'message': 'Notification created successfully'}, status=200)


@csrf_exempt
def request_notification(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST method required'}, status=405)
    
    data = json.loads(request.body)
    username = data.get('username')
    requester = data.get('requester')
    amount = str(data.get('amount'))
    request_id = data.get('request_id')
        
    message = f"{requester} requested {amount}$, request id: {request_id}"
    Notification.objects.create(username=username, message=message, type='requested')
    Request.objects.create(username=username, requester=requester, amount=amount)    
    return JsonResponse({'message': 'Notification created successfully'}, status=200)


@csrf_exempt
def received_notification(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST method required'}, status=405)
    
    data = json.loads(request.body)    
    username = data.get('username')    
    sender = data.get('sender')
    amount = str(data.get('amount'))
    
    message = f"{sender} sent you {amount}$"
    Notification.objects.create(username=username, message=message, type='received')
    return JsonResponse({'message': 'Notification created successfully'}, status=200)


@csrf_exempt
def get_requests(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'GET method required'}, status=405)

    username = request.GET.get('username')    
    requests = Request.objects.filter(username=username)
    notifications = Notification.objects.filter(username=username, type='requested')
    return JsonResponse({'requests': list(requests), 'notifications': list(notifications)})


@csrf_exempt
def getUser(username):
    user_response = requests.get(
        'http://127.0.0.1:8000/user/profile/',
        params={'username': username}
    )
    if user_response.status_code != 200:
        return JsonResponse({'error': 'Failed to fetch user'}, status=500)

    user_data = user_response.json()    
    return user_data


@csrf_exempt
def approve_request(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST method required'}, status=405)
    
    data = json.loads(request.body)
    request_id = data.get('request_id')
    request = Request.objects.get(id=request_id)
    request.status = 'approved'
    request.save()
    send_money(request)
    
    return JsonResponse({'message': 'Request approved successfully'}, status=200)

@csrf_exempt
def send_money(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST method required'}, status=405)
    
    data = json.loads(request.body)
    request_id = data.get('request_id')
    request = Request.objects.get(id=request_id)
    user = request.username
    sender = request.requester
    amount = request.amount
    
    send_money_response = requests.post(
        'http://127.0.0.1:8001/transaction/send-money/',
        data={
            'username': user,
            'sender': sender,
            'amount': amount
        }
    )
    if send_money_response.status_code != 200:
        return JsonResponse({'error': 'Failed to send money'}, status=500)
        
    
    return JsonResponse({'message': 'Money sent successfully'}, status=200)

@csrf_exempt
def reject_request(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST method required'}, status=405)
    
    data = json.loads(request.body)
    request_id = data.get('request_id')
    request = Request.objects.get(id=request_id)
    request.status = 'rejected'
    request.save()
    return JsonResponse({'message': 'Request rejected successfully'}, status=200)
