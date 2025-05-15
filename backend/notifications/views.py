from django.http import HttpResponse
import requests, json
from django.http import JsonResponse
from .models import Notification
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def get_notifications(request):
    username = request.GET.get('username')
    user_data = getUser(username)        
    
    notifications = Notification.objects.filter(user_id=user_data['id'])
    return JsonResponse({'notifications': list(notifications)})


@csrf_exempt
def sent_notification(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST method required'}, status=405)
    
    data = json.loads(request.body)
    username = data.get('username')
    sender = data.get('sender')
    amount = str(data.get('amount'))
    
    message = f"your {amount}$ has been sent to {sender}."
    Notification.objects.create(username=username, message=message)
    
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
    Notification.objects.create(username=username, message=message)
    
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
    Notification.objects.create(username=username, message=message)

    return JsonResponse({'message': 'Notification created successfully'}, status=200)


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
