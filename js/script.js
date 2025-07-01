// === المراجع للعناصر في الصفحة ===
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const deadlineInput = document.getElementById("deadlineInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearAllBtn = document.getElementById("clearAllBtn");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const cancelBtn = document.getElementById("cancelBtn");
const themeToggleBtn = document.getElementById("themeToggle");
const completionRate = document.getElementById("completionRate");

// === متغير لتخزين المهام ===
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
taskInput.focus();

// === تحديث عداد المهام ونسبة الإنجاز ===
function updateTaskCount() {
    if (tasks.length === 0) {
        taskCount.innerText = "";
        completionRate.innerText = "";
        document.querySelector(".Count > span:last-of-type").innerText = "قائمة المهام فارغة";
    } else {
        taskCount.innerText = tasks.length;
        document.querySelector(".Count > span:last-of-type").innerText = ":عدد المهام الحالية";
        const completedCount = tasks.filter(t => t.completed).length;
        const percent = ((completedCount / tasks.length) * 100).toFixed(0);
        completionRate.innerText = `نسبة الإنجاز: ${percent}% (${completedCount} / ${tasks.length})`;
    }
}

// === حفظ المهام ===
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// === عرض المهام ===
function displayTasks(filteredTasks = null) {
    const list = filteredTasks || tasks;

    list.sort((a, b) => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        return new Date(b.date) - new Date(a.date);
    });

    taskList.innerHTML = "";

    if (list.length === 0) {
        taskList.innerHTML = `<p style="color:red; text-align:center; padding:30px;">لا توجد مهام</p>`;
        return;
    }

    list.forEach((taskObj, index) => {
        const li = document.createElement("li");
        li.dataset.index = index;
        li.classList.toggle("completed", taskObj.completed);

        if (taskObj.priority) {
            li.classList.add(`priority-${taskObj.priority}`);
        }

        // إنشاء الـ checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = taskObj.completed;
        checkbox.addEventListener("click", () => toggleTaskCompletion(index));

        // اسم المهمة
        const taskName = document.createElement("span");
        taskName.className = "task-name";
        taskName.textContent = taskObj.task;

        // الموعد النهائي
        const taskDeadline = document.createElement("span");
        taskDeadline.className = "task-deadline";
        if (taskObj.deadline) {
            const d = new Date(taskObj.deadline);
            const formattedDeadline = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
            taskDeadline.textContent = `${taskObj.date} → ${formattedDeadline}`;
        } else {
            taskDeadline.textContent = taskObj.date;
        }

        // أزرار التحكم
        const actionContainer = document.createElement("div");
        actionContainer.className = "task-actions";

        const editBtn = document.createElement("button");
        editBtn.textContent = "تعديل";
        editBtn.addEventListener("click", () => editTask(index, li));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "حذف";
        deleteBtn.addEventListener("click", () => deleteTask(index));
actionContainer.appendChild(deleteBtn);
        actionContainer.appendChild(editBtn);
        
        li.appendChild(taskName);
        li.appendChild(taskDeadline);
        li.appendChild(checkbox);
        li.appendChild(actionContainer); 

        taskList.appendChild(li);
    });
}


// === تبديل إتمام المهمة ===
function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    displayTasks();
    updateTaskCount();
}

// === إضافة مهمة جديدة ===
function addTask() {
    const task = taskInput.value.trim();
    const priority = priorityInput.value;
    const deadline = deadlineInput.value;

    if (task.length < 3) {
        showSuccessMessage("خطأ: يجب إدخال مهمة تحتوي على ثلاثة أحرف على الأقل", "#f44336");
        return;
    }

    if (!task.match(/[a-zA-Z\u0600-\u06FF]/)) {
        showSuccessMessage("خطأ: يجب إدخال مهمة تحتوي على أحرف غير رموز", "#f44336");
        return;
    }

    if (tasks.some(t => t.task === task)) {
        showSuccessMessage("خطأ: المهمة موجودة بالفعل في القائمة", "#f44336");
        return;
    }

    // التحقق من أن التاريخ ليس في الماضي
    if (deadline) {
        const now = new Date();
        const selected = new Date(deadline);
        if (selected < now) {
            showSuccessMessage("⚠️ لا يمكن تعيين موعد نهائي في الماضي. اختر تاريخًا مستقبليًا.", "#f44336");
            deadlineInput.focus();
            return;
        }
    }

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    tasks.push({
        task,
        date: dateStr,
        completed: false,
        priority,
        deadline: deadline || null
    });

    tasks.sort((a, b) => new Date(b.date) - new Date(a.date));

    saveTasks();
    displayTasks();
    updateTaskCount();

    showSuccessMessage("تم إضافة المهمة بنجاح");

    taskInput.value = "";
    priorityInput.value = "medium";
    deadlineInput.value = "";
    taskInput.focus();
}


// === تعديل مهمة ===
function editTask(index, listItem) {
    const oldTaskObj = tasks[index];

    // إنشاء الحاوية الجديدة للتعديل
    const editContainer = document.createElement("div");
    editContainer.className = "edit-container";

    const inputTask = document.createElement("input");
    inputTask.type = "text";
    inputTask.value = oldTaskObj.task;

    const selectPriority = document.createElement("select");
    ["high", "medium", "low"].forEach(p => {
        const option = document.createElement("option");
        option.value = p;
        option.textContent = p === "high" ? "عاجل" : p === "medium" ? "متوسط" : "منخفض";
        if (p === oldTaskObj.priority) option.selected = true;
        selectPriority.appendChild(option);
    });

    const inputDeadline = document.createElement("input");
    inputDeadline.type = "datetime-local";
    if (oldTaskObj.deadline) {
        inputDeadline.value = oldTaskObj.deadline;
    }

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "حفظ التعديل";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "إلغاء التعديل";

    // تجميع كل العناصر داخل الحاوية
    editContainer.appendChild(inputTask);
    editContainer.appendChild(selectPriority);
    editContainer.appendChild(inputDeadline);
    editContainer.appendChild(saveBtn);
    editContainer.appendChild(cancelBtn);

    listItem.innerHTML = "";              // تفريغ المهمة القديمة
    listItem.appendChild(editContainer);  // إضافة الحاوية الجديدة
    inputTask.focus();

    // تفعيل التأثير بعد إدخال العنصر DOM
    setTimeout(() => editContainer.classList.add("show"), 10);

    saveBtn.onclick = () => {
        const newTask = inputTask.value.trim();
        const newPriority = selectPriority.value;
        const newDeadline = inputDeadline.value || null;

        if (newTask.length < 3) {
            showSuccessMessage("خطأ: يجب أن تحتوي المهمة على ثلاثة أحرف على الأقل.", "#f44336");
            inputTask.focus();
            return;
        }
        if (!newTask.match(/[a-zA-Z\u0600-\u06FF]/)) {
            showSuccessMessage("خطأ: يجب إدخال مهمة تحتوي على أحرف غير رموز", "#f44336");
            inputTask.focus();
            return;
        }
        if (tasks.some((t, i) => t.task === newTask && i !== index)) {
            showSuccessMessage("هذه المهمة موجودة بالفعل. الرجاء تحديث المهمة بمحتوى مختلف.", "#f44336");
            inputTask.focus();
            return;
        }
        if (
            newTask === oldTaskObj.task &&
            newPriority === oldTaskObj.priority &&
            newDeadline === oldTaskObj.deadline
        ) {
            showSuccessMessage("لم تقم بتغيير المهمة.", "#f44336");
            inputTask.focus();
            return;
        }

        const now = new Date();
        const dateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

        tasks[index] = {
            task: newTask,
            date: dateStr,
            completed: oldTaskObj.completed,
            priority: newPriority,
            deadline: newDeadline,
        };
        tasks.sort((a, b) => new Date(b.date) - new Date(a.date));

        saveTasks();
        displayTasks();
        updateTaskCount();
        showSuccessMessage("!تم تعديل المهمة بنجاح");
    };

    // ⬇️ تأثير عند الإلغاء
    cancelBtn.onclick = () => {
        editContainer.classList.remove("show");
        setTimeout(() => {
            displayTasks();
        }, 300); // تطابق مدة transition في CSS
    };
}



// === حذف مهمة ===
function deleteTask(index) {
    showConfirmation(
        "هل تريد حذف هذه المهمة؟",
        () => {
            tasks.splice(index, 1);
            saveTasks();
            displayTasks();
            updateTaskCount();
            showSuccessMessage("!تم حذف المهمة بنجاح", "red");
        }
    );
}

// === رسالة نجاح مؤقتة ===
function showSuccessMessage(text, bgColor = "#74ef91") {
    const msg = document.createElement("div");
    msg.className = "success-message";

    if (bgColor.toLowerCase() === "#f44336" || bgColor.toLowerCase() === "red") {
        msg.classList.add("error");
    } else {
        msg.classList.add("success");
    }

    msg.innerText = text;
    msg.style.backgroundColor = bgColor;
    document.body.prepend(msg);

    const audio = new Audio();

    if (bgColor.toLowerCase() === "#f44336" || bgColor.toLowerCase() === "red") {
        audio.src = "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg";
    } else {
        audio.src = "https://freesound.org/data/previews/171/171671_2437358-lq.mp3";
    }

    audio.play().catch(() => {});

    setTimeout(() => (msg.style.opacity = "1"), 30);
    setTimeout(() => {
        msg.style.opacity = "0";
        setTimeout(() => msg.remove(), 1000);
    }, 2000);
}

// === وظيفة البحث (معدلة لتعمل مع باقي الكود) ===
function searchTasks() {
    if (tasks.length < 3) {
        showSuccessMessage("لا يمكن البحث، يجب أن تكون هناك ثلاثة مهمات على الأقل في القائمة!", "#f44336");
        return;
    }
    cancelBtn.style.display = "inline-block";
    searchBtn.style.display = "none";
    searchInput.style.display = "inline-block";
    clearAllBtn.style.display = "none";

    searchInput.focus();

    searchInput.oninput = () => {
        const text = searchInput.value.trim().toLowerCase();

        const filtered = tasks.filter(t => t.task.toLowerCase().startsWith(text));

        if (filtered.length === 0) {
            taskList.innerHTML = `<p style="color:red; text-align:center; padding:30px;">لا يوجد مهام تتطابق مع البحث</p>`;
        } else {
            displayTasks(filtered);
            highlightSearchMatches(text);
        }
    };
}

// === تمييز النص المطابق في البحث ===
function highlightSearchMatches(text) {
    const items = taskList.querySelectorAll("li span:first-child"); // النص في العنصر الأول بعد checkbox
    items.forEach(span => {
        const taskName = span.textContent.toLowerCase();
        const index = taskName.indexOf(text);
        if (index !== -1 && text !== "") {
            const before = span.textContent.slice(0, index);
            const match = span.textContent.slice(index, index + text.length);
            const after = span.textContent.slice(index + text.length);
            span.innerHTML = `${before}<span class="matched-text">${match}</span>${after}`;

            if (text.match(/[\u0600-\u06FF]/)) {
                span.classList.add("rtl");
            } else {
                span.classList.remove("rtl");
            }
        } else {
            span.textContent = span.textContent;
            span.classList.remove("rtl");
        }
    });
}

// === إلغاء البحث ===
function cancelSearch() {
    searchInput.value = "";
    searchInput.style.display = "none";
    cancelBtn.style.display = "none";
    searchBtn.style.display = "inline-block";
    clearAllBtn.style.display = "inline-block";
    displayTasks();
    updateTaskCount();
}

// === حذف كل المهام مع تأكيد ===
function clearAllTasks() {
    if (tasks.length === 0) {
        showSuccessMessage("لا يوجد مهام لحذفها", "orange");
        return;
    }

    showConfirmation(
        "هل أنت متأكد أنك تريد حذف جميع المهام؟",
        () => {
            tasks = [];
            saveTasks();
            displayTasks();
            updateTaskCount();
            showSuccessMessage("تم حذف جميع المهام", "red");
        }
    );
}

// === نافذة تأكيد ===
function showConfirmation(message, onConfirm, onCancel) {
  const confirmation = document.createElement("div");
  confirmation.className = "custom-confirmation show";

  confirmation.innerHTML = `
    <div class="confirm-content">
      <p>${message}</p>
      <div class="confirm-buttons">
        <button class="confirm-yes">نعم</button>
        <button class="confirm-no">لا</button>
      </div>
    </div>
  `;

  document.body.appendChild(confirmation);

  const content = confirmation.querySelector(".confirm-content");

  // تأخير لإظهار النافذة بتدرج وتحريك
  setTimeout(() => {
    content.classList.add("show");

    // ✳️ تطبيق التأثير على زر "لا"
    const noBtn = confirmation.querySelector(".confirm-no");
    noBtn.classList.add("attention");

    // إزالة التأثير بعد نصف ثانية لتجنّب التكرار الدائم
    setTimeout(() => {
      noBtn.classList.remove("attention");
    }, 500);
  }, 10);

  confirmation.querySelector(".confirm-yes").onclick = () => {
    onConfirm();
    closeConfirmation();
  };

  confirmation.querySelector(".confirm-no").onclick = () => {
    if (onCancel) onCancel();
    closeConfirmation();
  };

  function closeConfirmation() {
    content.classList.remove("show");
    confirmation.classList.remove("show");
    setTimeout(() => confirmation.remove(), 300);
  }
}

// === تفعيل الثيم حسب الحالة المحفوظة ===
window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.documentElement.classList.add("dark-theme");
        themeToggleBtn.textContent = "🌞";
    } else {
        themeToggleBtn.textContent = "🌙";
    }

    updateTaskCount();
    displayTasks();
});

// === تبديل الثيم وحفظه ===
themeToggleBtn.onclick = () => {
    const isDark = document.documentElement.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggleBtn.textContent = isDark ? "🌞" : "🌙";
};

// === ربط الأحداث ===
addBtn.onclick = addTask;
searchBtn.onclick = searchTasks;
cancelBtn.onclick = cancelSearch;
clearAllBtn.onclick = clearAllTasks;

// === تهيئة عند تحميل الصفحة ===
updateTaskCount();
displayTasks();