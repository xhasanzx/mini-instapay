from django.db import models

TYPE_CHOICES = [
    ('sent', 'Sent'),
    ('received', 'Received'),
    ('requested', 'Requested'),
]

STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('approved', 'Approved'),
    ('rejected', 'Rejected'),
]

class Notification(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=255, choices=TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.username} - {self.message}"

class Request(models.Model):    
    id = models.AutoField(primary_key=True)
    requester = models.CharField(max_length=255)
    username = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=255, choices=STATUS_CHOICES, default='pending')
    
    def __str__(self):
        return f"{self.requester} - {self.username} - {self.amount}"
