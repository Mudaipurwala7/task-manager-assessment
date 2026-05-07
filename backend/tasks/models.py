from django.db import models

class Task(models.Model):
    # Define the allowed options for the status dropdown
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Pending')
    date = models.DateTimeField(auto_now_add=True) # Automatically saves the exact time it was created

    def __str__(self):
        return self.title