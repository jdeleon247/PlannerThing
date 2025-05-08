// Task Manager JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const createTaskLink = document.querySelector('nav a[href="create"]');
    const taskListContainer = document.getElementById('task-list');
    const taskFormContainer = document.getElementById('task-form-container');
    
    // Task data structure
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Initialize the app
    renderTasks();
    
    // Event listeners
    createTaskLink.addEventListener('click', function(e) {
        e.preventDefault();
        showTaskForm();
    });
    
    // Functions
    function showTaskForm() {
        // Create and show the task form
        taskFormContainer.innerHTML = `
            <div class="form-overlay">
                <form id="new-task-form">
                    <h2>Create New Task</h2>
                    <div class="form-group">
                        <label for="task-name">Task Name:</label>
                        <input type="text" id="task-name" required>
                    </div>
                    <div class="form-group">
                        <label for="task-due">Due Date:</label>
                        <input type="datetime-local" id="task-due" required>
                    </div>
                    <div class="form-actions">
                        <button type="submit">Add Task</button>
                        <button type="button" id="cancel-task">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        
        taskFormContainer.style.display = 'block';
        
        // Add event listeners to form
        document.getElementById('new-task-form').addEventListener('submit', addNewTask);
        document.getElementById('cancel-task').addEventListener('click', hideTaskForm);
    }
    
    function hideTaskForm() {
        taskFormContainer.style.display = 'none';
    }
    
    function addNewTask(e) {
        e.preventDefault();
        
        const taskName = document.getElementById('task-name').value;
        const taskDue = document.getElementById('task-due').value;
        
        // Create new task object
        const newTask = {
            id: Date.now(), // Use timestamp as ID
            name: taskName,
            due: taskDue,
            completed: false
        };
        
        // Add to tasks array
        tasks.push(newTask);
        
        // Save to localStorage
        saveTasksToStorage();
        
        // Render tasks and hide form
        renderTasks();
        hideTaskForm();
    }
    
    function renderTasks() {
        // Sort tasks by due date
        tasks.sort((a, b) => new Date(a.due) - new Date(b.due));
        
        // Create HTML for task list
        let tasksHTML = `
            <h2>Tasks</h2>
            <div class="tasks">
        `;
        
        if (tasks.length === 0) {
            tasksHTML += `<p class="no-tasks">No tasks yet. Create a new task to get started!</p>`;
        } else {
            tasks.forEach(task => {
                const dueDate = new Date(task.due);
                const formattedDate = dueDate.toLocaleDateString();
                const formattedTime = dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                tasksHTML += `
                    <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                        <div class="task-content">
                            <h3>${task.name}</h3>
                            <p>Due: ${formattedDate} at ${formattedTime}</p>
                        </div>
                        <div class="task-actions">
                            <button class="toggle-task">${task.completed ? 'Mark Incomplete' : 'Mark Complete'}</button>
                            <button class="delete-task">Delete</button>
                        </div>
                    </div>
                `;
            });
        }
        
        tasksHTML += `</div>`;
        taskListContainer.innerHTML = tasksHTML;
        
        // Add event listeners to task items
        document.querySelectorAll('.toggle-task').forEach(button => {
            button.addEventListener('click', toggleTaskStatus);
        });
        
        document.querySelectorAll('.delete-task').forEach(button => {
            button.addEventListener('click', deleteTask);
        });
    }
    
    function toggleTaskStatus(e) {
        const taskItem = e.target.closest('.task-item');
        const taskId = parseInt(taskItem.dataset.id);
        
        // Find and update task
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            saveTasksToStorage();
            renderTasks();
        }
    }
    
    function deleteTask(e) {
        const taskItem = e.target.closest('.task-item');
        const taskId = parseInt(taskItem.dataset.id);
        
        // Remove task from array
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasksToStorage();
        renderTasks();
    }
    
    function saveTasksToStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});