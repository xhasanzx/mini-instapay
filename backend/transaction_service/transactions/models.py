from django.db import models
from user_service.accounts.models import User
from decimal import Decimal

# Create your models here.
class Transactions(models.Model):
    sender = models.ForeignKey(User, related_name='sent_transactions', on_delete=models.PROTECT)
    receiver = models.ForeignKey(User, related_name='received_transactions', on_delete=models.PROTECT)
    time = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.0'))

class Balance(models.Model):
    amount = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.0'))
    username = models.CharField(max_length=150)
