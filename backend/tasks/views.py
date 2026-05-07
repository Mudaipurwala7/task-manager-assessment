from rest_framework import viewsets, filters
from rest_framework.pagination import PageNumberPagination
from .models import Task
from .serializers import TaskSerializer

# Set up Pagination (e.g., 5 tasks per page)
class TaskPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 50

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-date') # Shows newest tasks first
    serializer_class = TaskSerializer
    pagination_class = TaskPagination
    
    # Add Search functionality
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'status'] # Allows user to search by task name or status