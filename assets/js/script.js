// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Set up variables to store references to the form elements
// const openButton = document.querySelector("#formModal");
const submitButton = document.querySelector("#submitButton");
// const taskTitleInput = document.querySelector("#taskTitle");
// const taskDueDateInput = document.querySelector("#taskDueDate");
// const taskDescriptionInput = document.querySelector("#taskDescription");

// Todo: create a function to generate a unique task id
function generateTaskId() {
  // When the page loads, return a random task id.
  return Date.now();
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  // Let today be the current date
  let today = new Date();
  // Let dueDate be the task due date
  let dueDate = new Date(task.taskDueDate);
  // Let daysRemaining be the difference between the due date and today
  let daysRemaining = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
  // Let colorClass be an empty string
  let colorClass = "";
  // If daysRemaining is less than 0, set colorClass to "bg-danger"
  if (daysRemaining < 0) {
    colorClass = "bg-danger";
    // If daysRemaining is less than 3, set colorClass to "bg-warning"
  } else if (daysRemaining < 3) {
    colorClass = "bg-warning";
    // If taskDueDate value is in the done-cards, set colorClass to "bg-light"
  }
  if (task.status === "done") {
    colorClass = "bg-light";
  }

  // Create the card
  const card = `
    <div class ="card draggable mb-3 ${colorClass}" id="${task.id}">
    <div class="card-body">
    <h5 class="card-title">${task.taskTitle}</h5>
    <p class ="card-text"><strong>Due Date:</strong> ${task.taskDueDate}</p>
    <p class="card-text">${task.taskDescription}</p>
    <button class="btn btn-danger btn-sm delete-task" data-task-id="${task.id}">Delete</button>
    </div>
    </div>
    `;
  // Return the card
  return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  // Empty the cards in each lane
  $("#todo-cards").empty();
  $("#in-progress-cards").empty();
  $("#done-cards").empty();
  // Iterate through the taskList array
  // For each task, create a card and append it to the appropriate lane
  taskList.forEach((task) => {
    const card = createTaskCard(task);
    $(`#${task.status}-cards`).append(card);
  });
  // If there are tasks in the taskList array
  if (taskList.length > 0) {
    // Then apply the event listener to the delete buttons.
    $(".delete-task").on("click", handleDeleteTask);
  }
  // Make the cards draggable
  $(".draggable").draggable({
    opacity: 0.7,
    zIndex: 100,
    // Create a helper function to clone the card when dragging
    helper: function (e) {
      const original = $(e.target).hasClass("ui-draggable")
        ? $(e.target)
        : $(e.target).closest(".ui-draggable");

      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  // Prevent the default behavior of the form
  event.preventDefault();
  // Declaring variables to store the values of the input fields
  const taskTitle = $("#taskTitle").val().trim();
  const taskDueDate = $("#taskDueDate").val();
  const taskDescription = $("#taskDescription").val().trim();
  // Creates a new task object
  const tasks = {
    id: generateTaskId(),
    status: "todo",
    taskTitle: taskTitle,
    taskDueDate: taskDueDate,
    taskDescription: taskDescription,
  };
  // Adds the new task object to the taskList array
  taskList.push(tasks);

  // Stores the taskList array in localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));
  // Renders the task list to the page from the taskList array in localStorage
  renderTaskList();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  // Variable for task id selected to delete task by id
  const taskId = $(this).attr("data-task-id");
  // Filter the taskList array to remove the task with the selected id
  taskList = taskList.filter((task) => task.id !== parseInt(taskId));
  // Remove the card from the page
  $(this).closest(".card").remove();
  // Store the updated taskList array in localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));
  // Render the updated task list to the page
  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  // Variable for task id selected to move task by id
  const taskId = ui.helper.attr("id");
  // Variable for new status of task
  let newStatus = $(this).attr("id");
  // Update the status of the task with the selected id
  if (newStatus === "to-do") {
    newStatus = "todo";
  }
  taskList = taskList.map((task) => {
    // If the task id is equal to the task id selected

    if (task.id === parseInt(taskId)) {
      // Set the task status to the new status
      task.status = newStatus;
    }
    // Return the task
    return task;
  });
  // Store the updated taskList array in localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));
  // Render the updated task list to the page
  renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
// Take a task and create a card from the task.
$(document).ready(function () {
  // Render the task list to the page
  renderTaskList();
  // When the submit button is clicked, handle adding a new task
  $(submitButton).on("click", handleAddTask);
  // Makes the lanes droppable for the cards
  $(".lane").droppable({
    accept: ".draggable",
    drop: handleDrop,
  });
  // Makes the due date field a date picker
  $("#taskDueDate").datepicker({
    changeMonth: true,
    changeYear: true,
  });
});
