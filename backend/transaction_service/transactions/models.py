from django.db import models
from decimal import Decimal

# Create your models here.
class Logs(models.Model):    
    sender = models.CharField(max_length=120)
    receiver = models.CharField(max_length=120)    
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.0'))
    time = models.DateTimeField(auto_now_add=True)

class Requests(models.Model):
    username = models.CharField(max_length=120)
    requester = models.CharField(max_length=120)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.0'))
    time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=120, default='pending', choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')])
