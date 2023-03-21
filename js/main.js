  // Get references to the HTML elements
  const taskInput = document.getElementById("taskInput");
  const addBtn = document.getElementById("addBtn");
  const taskList = document.getElementById("taskList");

  taskInput.focus();

  // Initialize an empty array to hold the tasks
  let tasks = [];

  // Check if tasks are stored in local storage
  if (localStorage.getItem("tasks")) {
      tasks = JSON.parse(localStorage.getItem("tasks"));
  }

  // Display tasks on page load
  displayTasks();

  // Add a click event listener to the add button
  addBtn.addEventListener("click", function () {
      // Get the task from the input field
      const task = taskInput.value.trim();

      // Check if the task is not empty
      if (task !== "") {

          // Check if the task already exists in the task list
          const taskExists = tasks.some(function (t) {
              return t.task === task;
          });

          if (taskExists) {
              alert("خطأ: المهمة موجودة بالفعل في القائمة");
              return;
          }

          // Add the task to the array with the current date and time
          const currentDate = new Date();
          const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
          tasks.push({
              task: task,
              date: dateStr
          });

          // Clear the input field
          taskInput.value = "";

          // Update the task list
          displayTasks();

          // Save the tasks to local storage
          saveTasks();
      } else {
          alert("خطأ: يجب إدخال قيمة في حقل إضافة المهمة لإضافة مهمة جديدة");
          taskInput.focus();
      }

      // Sort tasks by date (newest first)
      tasks.sort(function (a, b) {
          return new Date(b.date) - new Date(a.date);
      });

      // Display the sorted tasks
      displayTasks();

  });
  // Function to display the tasks
  function displayTasks(tasksToShow) {
      // If no tasks are provided, use the original tasks array
      if (!tasksToShow) {
          tasksToShow = tasks;
      }

      // Clear the task list
      taskList.innerHTML = "";

      // Loop through the tasks array and add each task to the task list
      tasksToShow.forEach(function (taskObj, index) {
          // Create a new list item
          const li = document.createElement("li");

          // Add the task text and date to the list item
          li.innerHTML = `<span>${taskObj.task}</span><span>${taskObj.date}</span>`;

          // Add a data attribute to the list item to store the task index
          li.dataset.index = index;

          // Create an edit button
          const editBtn = document.createElement("button");
          editBtn.innerText = "تعديل";
          editBtn.addEventListener("click", function () {
              // Get the task index from the data attribute
              const index = parseInt(li.dataset.index);

              // Create a new input field to edit the task
              const input = document.createElement("input");
              input.value = tasks[index].task

              // Create a save button to save the edited task
              const saveBtn = document.createElement("button");
              saveBtn.innerText = "حفظ التعديل";
              saveBtn.addEventListener("click", function () {
                  // Update the date for the task
                  const currentDate = new Date();
                  const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
                  tasks[index].date = dateStr;
                  tasks[index] = {
                      task: input.value,
                      date: dateStr
                  };

                  // Sort tasks by date (newest first)
                  tasks.sort(function (a, b) {
                      return new Date(b.date) - new Date(a.date);
                  });

                  // Display the sorted tasks
                  displayTasks();
                  saveTasks();
              });

              // Create a cancel button to cancel the edit
              const cancelBtn = document.createElement("button");
              cancelBtn.innerText = "إلغاء التعديل";
              cancelBtn.addEventListener("click", function () {
                  displayTasks();
              });

              // Replace the task text with the input field and buttons
              li.innerText = "";
              li.appendChild(input);
              li.appendChild(saveBtn);
              li.appendChild(cancelBtn);

              // Set the focus to the input field
              input.focus();
          });

          // Add the edit button to the list item
          li.appendChild(editBtn);
          // Create a delete button
          const deleteBtn = document.createElement("button");
          deleteBtn.innerText = "حذف";
          deleteBtn.addEventListener("click", function () {
              // Get the task index from the data attribute
              const index = parseInt(li.dataset.index);
              tasks.splice(index, 1);

              // Display the updated tasks
              displayTasks();

              // Save the tasks to local storage
              saveTasks();
          });

          // Add the delete button to the list item
          li.appendChild(deleteBtn);

          // Add the list item to the task list
          taskList.appendChild(li);

      });
  }
  // Call the displayTasks function to display the initial tasks
  displayTasks();
  // Sort tasks by date (newest first)
  tasks.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
  });

  // Display the sorted tasks
  displayTasks();


  // Get references to the search elements
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  // Add a click event listener to the search button
  searchBtn.addEventListener("click", function () {
      if (taskList.children.length <= 2) { // إذا كان هناك مهمة واحدة فقط
          alert("لا يمكن البحث، يجب أن تكون هناك ثلاثة مهمات على الأقل في القائمة!");
      } else if (taskList.innerHTML == "") {
          alert("قائمة المهام فارغة");
      } else {
          cancelBtn.style.display = "inline-block";
          this.style.display = "none";
          searchInput.style.display = "inline-block";
          searchInput.focus();
          document.getElementById("clearAllBtn").style.display = "none";
          searchInput.addEventListener("input", function () {
              const searchText = searchInput.value.trim().toLowerCase();
              const filteredTasks = tasks.filter(function (taskObj) {
                  return taskObj.task.toLowerCase().startsWith(searchText);
              });
              displayTasks(filteredTasks);
              if (filteredTasks.length === 0) {
                  const li = document.createElement("p");
                  li.innerText = "لا يوجد مهام تتطابق مع البحث";
                  taskList.appendChild(li);
                  return;
              }
          });
      }
  });


  cancelBtn.addEventListener("click", function () {
      // Clear the search input field
      searchInput.value = "";
      searchBtn.style.display = "inline-block";
      this.style.display = "none";
      searchInput.style.display = "none";
      document.getElementById("clearAllBtn").style.display = "inline-block";
      // Display all tasks
      displayTasks();
  });


  // Function to save tasks to local storage
  function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Get reference to the clear button
  const clearBtn = document.getElementById("clearAllBtn");

  // Add a click event listener to the clear button
  clearBtn.addEventListener("click", function () {
      // Check if tasks list is empty
      if (tasks.length === 0) {
          alert("لا يوجد مهام لحذفها");
          return;
      }

      // Create the confirmation element
      const confirmationElement = document.createElement("div");
      confirmationElement.classList.add("confirmation");

      // Create a message element
      const messageElement = document.createElement("p");
      messageElement.innerText = "هل أنت متأكد أنك تريد حذف جميع المهام؟";

      // Create a container element for the buttons
      const buttonsContainer = document.createElement("div");

      // Create a "Yes" button
      const yesButton = document.createElement("button");
      yesButton.innerText = "نعم";
      yesButton.classList.add("yes");
      yesButton.addEventListener("click", function () {
          // Clear the tasks array
          tasks = [];

          // Clear the task list
          taskList.innerHTML = "";

          // Clear the data from local storage
          localStorage.clear();

          // Hide the confirmation element
          document.body.removeChild(confirmationElement);
      });

      // Create a "No" button
      const noButton = document.createElement("button");
      noButton.innerText = "لا";
      noButton.classList.add("no");
      noButton.addEventListener("click", function () {
          // Hide the confirmation element
          document.body.removeChild(confirmationElement);
      });

      // Append the buttons to the container
      buttonsContainer.appendChild(yesButton);
      buttonsContainer.appendChild(noButton);

      // Append the message and buttons to the confirmation element
      confirmationElement.appendChild(messageElement);
      confirmationElement.appendChild(buttonsContainer);

      // Add the confirmation element to the page
      document.body.appendChild(confirmationElement);
  });
