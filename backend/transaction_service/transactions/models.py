from django.db import models
from decimal import Decimal

# Create your models here.
class Transactions(models.Model):
    sender = models.CharField(max_length=120)
    receiver = models.CharField(max_length=120)    
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.0'))
    time = models.DateTimeField(auto_now_add=True)

class Logs(models.Model):
    transaction_id = models.IntegerField()
    time = models.TimeField(auto_now_add=True)
