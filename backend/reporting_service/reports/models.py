from django.db import models


class Report(models.Model):
    report_id = models.AutoField(primary_key=True)
    report_name = models.CharField(max_length=255)
    report_description = models.TextField()
    report_data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
