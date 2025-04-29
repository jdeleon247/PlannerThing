from django.db import models


# How to implement subtasks?
#           - Recursive class
#           - De-couple tasks and content

class Task(models.Model):
    task_name = models.CharField(max_length=200)
    due_date = models.DateField()
    due_time = models.TimeField
    task_content = models.TextField()

    subtasks = []

    completion = models.BooleanField()

    def __str__(self):
        return self.headline