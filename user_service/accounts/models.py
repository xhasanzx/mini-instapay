from django.db import models
from decimal import Decimal

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=150)
    password = models.CharField(max_length=128)    
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))


    def __str__(self):
        return self.username
