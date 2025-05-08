// Task Manager JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const taskListContainer = document.getElementById('task-list') || document.getElementById('archived-task-list');
    const taskFormContainer = document.getElementById('task-form-container');
    const createTaskBtn = document.getElementById('create-task-btn');
    
    // Task data structures
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let archivedTasks = JSON.parse(localStorage.getItem('archivedTasks')) || [];
    
    // Initialize the app
    if (document.getElementById('task-list')) {
      renderTasks();
    } else if (document.getElementById('archived-task-list')) {
      renderArchivedTasks();
    }
    
    // Event listeners
    if (createTaskBtn) {
      createTaskBtn.addEventListener('click', showTaskForm);
    }
    
    const archivedLink = document.querySelector('nav a[href="archive.html"]');
    if (archivedLink) {
      archivedLink.addEventListener('click', function(e) {
        // Let the default navigation happen
      });
    }
    
    // Functions
    function showTaskForm() {
        // Create and show the task form
        taskFormContainer.innerHTML = `
          <form id="new-task-form">
            <h2>Create New Task</h2>
            <input type="text" id="task-name" placeholder="Task name" required>
            <div class="date-field">
              <input type="datetime-local" id="task-due">
              <small>Due date (optional)</small>
            </div>
            <div class="form-buttons">
              <button type="submit">Create Task</button>
              <button type="button" id="cancel-task">Cancel</button>
            </div>
          </form>
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
        const form = e.target;
        const taskName = document.getElementById('task-name').value;
        let taskDue = document.getElementById('task-due').value;
        
        // If no due date is provided, set it to null
        if (!taskDue) {
          taskDue = null;
        }
        
        if (form.dataset.mode === 'edit') {
          // Update existing task
          const taskId = parseInt(form.dataset.taskId);
          const taskIndex = tasks.findIndex(t => t.id === taskId);
          
          if (taskIndex !== -1) {
            // Preserve completion status
            const completed = tasks[taskIndex].completed;
            
            // Update task
            tasks[taskIndex] = {
              id: taskId,
              name: taskName,
              due: taskDue,
              completed: completed
            };
          }
          
          // Reset form mode
          form.dataset.mode = 'create';
          document.querySelector('#new-task-form button[type="submit"]').textContent = 'Create Task';
        } else {
          // Create new task
          const newTask = {
            id: Date.now(), // Use timestamp as ID
            name: taskName,
            due: taskDue,
            completed: false
          };
          
          // Add to tasks array
          tasks.push(newTask);
        }
        
        // Save to localStorage
        saveTasksToStorage();
        
        // Render tasks and hide form
        renderTasks();
        hideTaskForm();
      }
      
    
      function renderTasks() {
        // Create HTML for task list
        let tasksHTML = '';
        
        if (tasks.length === 0) {
          tasksHTML = `<p class="no-tasks">No tasks yet. Create a new task to get started!</p>`;
        } else {
          // First, sort tasks with due dates by their due date
          const tasksWithDates = tasks.filter(task => task.due);
          const tasksWithoutDates = tasks.filter(task => !task.due);
          
          tasksWithDates.sort((a, b) => new Date(a.due) - new Date(b.due));
          
          // Combine the sorted arrays: tasks with dates first, then tasks without dates
          const sortedTasks = [...tasksWithDates, ...tasksWithoutDates];
          
          sortedTasks.forEach(task => {
            let dateTimeHTML = '';
            
            if (task.due) {
              const dueDate = new Date(task.due);
              const formattedDate = dueDate.toLocaleDateString();
              const formattedTime = dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              dateTimeHTML = `<p>Due: ${formattedDate} at ${formattedTime}</p>`;
            } else {
              dateTimeHTML = `<p class="no-date">No due date</p>`;
            }
            
            tasksHTML += `
              <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="task-content">
                  <h3>${task.name}</h3>
                  ${dateTimeHTML}
                </div>
                <div class="task-actions">
                  <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                  <button class="edit-task">Edit</button>
                  <button class="archive-task">Archive</button>
                </div>
              </div>
            `;
          });
        }
        
        taskListContainer.innerHTML = tasksHTML;
        
        // Add event listeners to checkboxes and buttons
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
          checkbox.addEventListener('change', toggleTaskCompletion);
        });
        
        document.querySelectorAll('.edit-task').forEach(button => {
          button.addEventListener('click', editTask);
        });
        
        document.querySelectorAll('.archive-task').forEach(button => {
          button.addEventListener('click', archiveTask);
        });
      }
      
    
      function renderArchivedTasks() {
        // Create HTML for archived task list
        let tasksHTML = '';
        
        if (archivedTasks.length === 0) {
          tasksHTML = `<p class="no-tasks">No archived tasks.</p>`;
        } else {
          // First, sort tasks with due dates by their due date
          const tasksWithDates = archivedTasks.filter(task => task.due);
          const tasksWithoutDates = archivedTasks.filter(task => !task.due);
          
          tasksWithDates.sort((a, b) => new Date(a.due) - new Date(b.due));
          
          // Combine the sorted arrays: tasks with dates first, then tasks without dates
          const sortedTasks = [...tasksWithDates, ...tasksWithoutDates];
          
          sortedTasks.forEach(task => {
            let dateTimeHTML = '';
            
            if (task.due) {
              const dueDate = new Date(task.due);
              const formattedDate = dueDate.toLocaleDateString();
              const formattedTime = dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              dateTimeHTML = `<p>Due: ${formattedDate} at ${formattedTime}</p>`;
            } else {
              dateTimeHTML = `<p class="no-date">No due date</p>`;
            }
            
            tasksHTML += `
              <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="task-content">
                  <h3>${task.name}</h3>
                  ${dateTimeHTML}
                </div>
                <div class="task-actions">
                  <button class="restore-task">Restore</button>
                  <button class="delete-task">Delete Permanently</button>
                </div>
              </div>
            `;
          });
        }
        
        taskListContainer.innerHTML = tasksHTML;
        
        // Add event listeners to buttons
        document.querySelectorAll('.restore-task').forEach(button => {
          button.addEventListener('click', restoreTask);
        });
        
        document.querySelectorAll('.delete-task').forEach(button => {
          button.addEventListener('click', deleteTaskPermanently);
        });
      }
      
    
    function toggleTaskCompletion(e) {
      const checkbox = e.target;
      const taskItem = checkbox.closest('.task-item');
      const taskId = parseInt(taskItem.dataset.id);
      
      // Find the task in our array
      const task = tasks.find(t => t.id === taskId);
      
      if (task) {
        // Toggle the completed status
        task.completed = checkbox.checked;
        
        // Update the visual appearance
        if (task.completed) {
          taskItem.classList.add('completed');
        } else {
          taskItem.classList.remove('completed');
        }
        
        // Save to localStorage
        saveTasksToStorage();
      }
    }
    
    function editTask(e) {
      const taskItem = e.target.closest('.task-item');
      const taskId = parseInt(taskItem.dataset.id);
      
      // Find the task in our array
      const task = tasks.find(t => t.id === taskId);
      
      if (task) {
        // Show the form and populate with task data
        showTaskForm();
        
        // Set form fields to current task values
        document.getElementById('task-name').value = task.name;
        document.getElementById('task-due').value = task.due;
        
        // Change form submit behavior to update instead of create
        const form = document.getElementById('new-task-form');
        form.dataset.mode = 'edit';
        form.dataset.taskId = taskId;
        
        // Change button text
        document.querySelector('#new-task-form button[type="submit"]').textContent = 'Update Task';
      }
    }
    
    function archiveTask(e) {
      const taskItem = e.target.closest('.task-item');
      const taskId = parseInt(taskItem.dataset.id);
      
      // Find the task in our array
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      
      if (taskIndex !== -1) {
        // Move the task to archived tasks
        const task = tasks[taskIndex];
        archivedTasks.push(task);
        
        // Remove from active tasks
        tasks.splice(taskIndex, 1);
        
        // Save both arrays to localStorage
        saveTasksToStorage();
        localStorage.setItem('archivedTasks', JSON.stringify(archivedTasks));
        
        // Re-render tasks
        renderTasks();
      }
    }
    
    function restoreTask(e) {
      const taskItem = e.target.closest('.task-item');
      const taskId = parseInt(taskItem.dataset.id);
      
      // Find the task in archived array
      const taskIndex = archivedTasks.findIndex(t => t.id === taskId);
      
      if (taskIndex !== -1) {
        // Move the task back to active tasks
        const task = archivedTasks[taskIndex];
        tasks.push(task);
        
        // Remove from archived tasks
        archivedTasks.splice(taskIndex, 1);
        
        // Save both arrays to localStorage
        saveTasksToStorage();
        localStorage.setItem('archivedTasks', JSON.stringify(archivedTasks));
        
        // Re-render archived tasks
        renderArchivedTasks();
      }
    }
    
    function deleteTaskPermanently(e) {
      const taskItem = e.target.closest('.task-item');
      const taskId = parseInt(taskItem.dataset.id);
      
      // Remove from archived tasks
      archivedTasks = archivedTasks.filter(task => task.id !== taskId);
      
      // Save to localStorage
      localStorage.setItem('archivedTasks', JSON.stringify(archivedTasks));
      
      // Re-render archived tasks
      renderArchivedTasks();
    }
    
    function saveTasksToStorage() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Add a mathematical operation to meet project requirements
    function calculateTaskStatistics() {
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.completed).length;
      const incompleteTasks = totalTasks - completedTasks;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      console.log(`Task Statistics: ${completedTasks} completed, ${incompleteTasks} incomplete (${completionRate}% completion rate)`);
      
      // This meets the mathematical operation requirement
      return completionRate;
    }
    
    // Call this function to display stats in console (meets output requirement)
    calculateTaskStatistics();
  });
  