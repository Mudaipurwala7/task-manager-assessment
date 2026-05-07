from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__' # This tells it to use all fields (id, title, description, status, date)

    # Custom Validation: Ensure the title isn't just empty spaces
    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError("Task title cannot be empty or just spaces.")
        if len(value) < 3:
            raise serializers.ValidationError("Task title must be at least 3 characters long.")
        return value
    