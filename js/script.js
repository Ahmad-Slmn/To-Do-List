// === مراجع العناصر ===
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

// === بيانات المهام ===
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
taskInput.focus();

// === حفظ المهام في التخزين المحلي ===
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// === تحديث عداد المهام ونسبة الإنجاز ===
function updateTaskCount() {
    if (!tasks.length) {
        taskCount.innerText = "";
        completionRate.innerText = "";
        document.querySelector(".Count > span:last-of-type").innerText = "قائمة المهام فارغة";
        return;
    }
    taskCount.innerText = tasks.length;
    document.querySelector(".Count > span:last-of-type").innerText = ":عدد المهام الحالية";
    const completedCount = tasks.filter(t => t.completed).length;
    const percent = ((completedCount / tasks.length) * 100).toFixed(0);
    completionRate.innerText = `نسبة الإنجاز: ${percent}% (${completedCount} / ${tasks.length})`;
}

// === عرض المهام ===
function displayTasks(filteredTasks = null) {
    const list = filteredTasks || tasks;
    list.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return new Date(b.date) - new Date(a.date);
    });

    taskList.innerHTML = list.length ? "" : `<p style="color:red; text-align:center; padding:30px;">لا توجد مهام</p>`;

    list.forEach((taskObj, i) => {
        const li = document.createElement("li");
        li.dataset.index = i;
        li.className = `${taskObj.completed ? "completed" : ""} priority-${taskObj.priority || "medium"}`;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = taskObj.completed;
        checkbox.addEventListener("click", () => toggleTaskCompletion(i));

        const taskName = document.createElement("span");
        taskName.className = "task-name";
        taskName.textContent = taskObj.task;

        const taskDeadline = document.createElement("span");
        taskDeadline.className = "task-deadline";
        if (taskObj.deadline) {
            const d = new Date(taskObj.deadline);
            taskDeadline.textContent = `${taskObj.date} → ${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        } else {
            taskDeadline.textContent = taskObj.date;
        }

        const actionContainer = document.createElement("div");
        actionContainer.className = "task-actions";

        const editBtn = document.createElement("button");
        editBtn.textContent = "تعديل";

        if (taskObj.completed) {
            // لا نمنع الزر بل نظهر رسالة عند النقر
            editBtn.style.opacity = "0.5";
            editBtn.title = "لا يمكن تعديل مهمة تم تنفيذها";
            editBtn.addEventListener("click", () => {
                showSuccessMessage("لا يمكن تعديل مهمة تم تنفيذها", "#f44336");
            });
        } else {
            editBtn.addEventListener("click", () => editTask(i, li));
        }

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "حذف";
        deleteBtn.addEventListener("click", () => deleteTask(i));

        actionContainer.append(deleteBtn, editBtn);
        li.append(taskName, taskDeadline, checkbox, actionContainer);
        taskList.appendChild(li);
    });
}


// === تبديل حالة الإتمام ===
function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    displayTasks();
    updateTaskCount();
}

// === إضافة مهمة ===
function addTask() {
    const task = taskInput.value.trim();
    const priority = priorityInput.value;
    const deadline = deadlineInput.value;

    if (task.length < 3 || !task.match(/[a-zA-Z\u0600-\u06FF]/)) {
        showSuccessMessage("خطأ: يجب إدخال مهمة صحيحة تحتوي على ثلاثة أحرف على الأقل", "#f44336");
        return;
    }
    if (tasks.some(t => t.task === task)) {
        showSuccessMessage("خطأ: المهمة موجودة بالفعل", "#f44336");
        return;
    }
    if (deadline && new Date(deadline) < new Date()) {
        showSuccessMessage("⚠️ لا يمكن تعيين موعد نهائي في الماضي", "#f44336");
        deadlineInput.focus();
        return;
    }

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

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
    const oldTask = tasks[index];
    const editContainer = document.createElement("div");
    editContainer.className = "edit-container";

    const inputTask = document.createElement("input");
    inputTask.type = "text";
    inputTask.value = oldTask.task;

    const selectPriority = document.createElement("select");
  ["high", "medium", "low"].forEach(p => {
        const option = document.createElement("option");
        option.value = p;
        option.textContent = p === "high" ? "عاجل" : p === "medium" ? "متوسط" : "منخفض";
        if (p === oldTask.priority) option.selected = true;
        selectPriority.appendChild(option);
    });

    const inputDeadline = document.createElement("input");
    inputDeadline.type = "datetime-local";
    if (oldTask.deadline) inputDeadline.value = oldTask.deadline;

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "حفظ التعديل";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "إلغاء التعديل";

    editContainer.append(inputTask, selectPriority, inputDeadline, saveBtn, cancelBtn);
    listItem.innerHTML = "";
    listItem.appendChild(editContainer);
    inputTask.focus();

    setTimeout(() => editContainer.classList.add("show"), 10);

    saveBtn.onclick = () => {
        const newTask = inputTask.value.trim();
        const newPriority = selectPriority.value;
        const newDeadline = inputDeadline.value || null;

        if (newTask.length < 3 || !newTask.match(/[a-zA-Z\u0600-\u06FF]/)) {
            showSuccessMessage("خطأ: المهمة يجب أن تحتوي على 3 أحرف على الأقل.", "#f44336");
            inputTask.focus();
            return;
        }
        if (tasks.some((t, i) => t.task === newTask && i !== index)) {
            showSuccessMessage("هذه المهمة موجودة مسبقاً.", "#f44336");
            inputTask.focus();
            return;
        }
        if (newDeadline && new Date(newDeadline) < new Date()) {
            showSuccessMessage("خطأ: لا يمكن تعيين موعد نهائي في الماضي.", "#f44336");
            inputDeadline.focus();
            return;
        }
        if (newTask === oldTask.task && newPriority === oldTask.priority && newDeadline === oldTask.deadline) {
            showSuccessMessage("لم تقم بتغيير المهمة.", "#f44336");
            inputTask.focus();
            return;
        }

        const now = new Date();
        const dateStr = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

        tasks[index] = {
            task: newTask,
            date: dateStr,
            completed: oldTask.completed,
            priority: newPriority,
            deadline: newDeadline,
        };
        tasks.sort((a, b) => new Date(b.date) - new Date(a.date));

        saveTasks();
        displayTasks();
        updateTaskCount();
        showSuccessMessage("!تم تعديل المهمة بنجاح");
    };

    cancelBtn.onclick = () => {
        editContainer.classList.remove("show");
        setTimeout(displayTasks, 300);
    };
}

// === حذف مهمة ===
function deleteTask(index) {
    showConfirmation("هل تريد حذف هذه المهمة؟", () => {
        tasks.splice(index, 1);
        saveTasks();
        displayTasks();
        updateTaskCount();
        showSuccessMessage("!تم حذف المهمة بنجاح", "red");
    });
}

// === رسالة مؤقتة ===
function showSuccessMessage(text, bgColor = "#74ef91") {
    const msg = document.createElement("div");
    msg.className = "success-message " + (["#f44336", "red"].includes(bgColor.toLowerCase()) ? "error" : "success");
    msg.innerText = text;
    msg.style.backgroundColor = bgColor;
    document.body.prepend(msg);

    const audio = new Audio();
    audio.src = ["#f44336", "red"].includes(bgColor.toLowerCase()) ?
        "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg" :
        "https://freesound.org/data/previews/171/171671_2437358-lq.mp3";

    audio.play().catch(() => {});

    setTimeout(() => msg.classList.add("show"), 30);
    setTimeout(() => {
        msg.classList.remove("show");
        setTimeout(() => msg.remove(), 500);
    }, 2000);
}

// === البحث ===
function removeDiacritics(text) {
    const arabicDiacritics = /[\u0617-\u061A\u064B-\u0652]/g;
    return text.normalize('NFD').replace(arabicDiacritics, '');
}

function updateMatchCount(count) {
    const matchCount = document.getElementById('matchCount');
    if (matchCount) matchCount.textContent = `عدد النتائج: ${count}`;
}

function searchTasks() {
    if (tasks.length < 3) {
        showSuccessMessage("لا يمكن البحث، يجب وجود 3 مهام على الأقل!", "#f44336");
        return;
    }

    // إظهار عناصر البحث فقط
    searchInput.style.display = "inline-block";
    statusFilter.style.display = "inline-block";
    clearSearchBtn.style.display = "none";
    cancelBtn.style.display = "inline-block";
    matchCount.style.display = "inline-block";

    // إخفاء العناصر الأخرى
    searchBtn.style.display = "none";
    clearAllBtn.style.display = "none";
    searchInput.focus();

    function filterAndDisplay() {
        const rawText = searchInput.value.trim();
        const text = removeDiacritics(rawText.toLowerCase());
        const status = statusFilter.value;

        if (!text && status === "all") {
            displayTasks(tasks);
            highlightSearchMatches('');
            updateMatchCount(0); // لا عرض افتراضي للعدد
            clearSearchBtn.style.display = 'none';
            return;
        }


        clearSearchBtn.style.display = rawText ? 'inline-block' : 'none';

        const filtered = tasks.filter(t => {
            const taskText = removeDiacritics(t.task.toLowerCase());

            if (status === 'completed' && !t.completed) return false;
            if (status === 'pending' && t.completed) return false;

            return taskText.includes(text);
        });

        if (filtered.length === 0) {
            taskList.innerHTML = `
    <div class="no-results-message">
      لا يوجد مهام تتطابق مع البحث
    </div>
  `;
            updateMatchCount(0);
        } else {
            displayTasks(filtered);
            highlightSearchMatches(rawText);
            updateMatchCount(filtered.length);
        }
    }

    searchInput.oninput = filterAndDisplay;
    statusFilter.onchange = filterAndDisplay;

    clearSearchBtn.onclick = () => {
        searchInput.value = '';
        filterAndDisplay();
        searchInput.focus();
    };

    // تنفيذ فوري عند بدء البحث
    filterAndDisplay();
}

function highlightSearchMatches(text) {
    if (!text) {
        taskList.querySelectorAll("li .task-name").forEach(span => {
            span.textContent = span.textContent;
            span.classList.remove("rtl");
        });
        updateMatchCount(0);
        return;
    }

    const cleanText = removeDiacritics(text.trim());
    const words = cleanText.split(/\s+/).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    taskList.querySelectorAll("li .task-name").forEach(span => {
        const originalText = span.textContent;
        let modifiedText = originalText;
        let matchFound = false;

        words.forEach(word => {
            if (!word) return;

            const cleanOriginal = removeDiacritics(originalText);
            const index = cleanOriginal.toLowerCase().indexOf(word.toLowerCase());

            if (index !== -1) {
                matchFound = true;
                modifiedText =
                    modifiedText.substring(0, index) +
                    `<span class="matched-text">` +
                    modifiedText.substring(index, index + word.length) +
                    `</span>` +
                    modifiedText.substring(index + word.length);
            }
        });

        if (matchFound) {
            span.innerHTML = modifiedText;
            span.classList.toggle("rtl", /\p{Script=Arabic}/u.test(text));
        } else {
            span.textContent = originalText;
            span.classList.remove("rtl");
        }
    });

    const totalMatches = taskList.querySelectorAll(".matched-text").length;
    updateMatchCount(totalMatches);
}

function cancelSearch() {
    // إخفاء عناصر البحث
    searchInput.style.display = "none";
    statusFilter.style.display = "none";
    clearSearchBtn.style.display = "none";
    cancelBtn.style.display = "none";
    matchCount.style.display = "none";

    // إظهار العناصر الأساسية
    searchBtn.style.display = "inline-block";
    clearAllBtn.style.display = "inline-block";

    searchInput.value = "";
    displayTasks();
    updateTaskCount();
}

// === حذف كل المهام ===
function clearAllTasks() {
    if (!tasks.length) {
        showSuccessMessage("لا يوجد مهام لحذفها", "orange");
        return;
    }
    showConfirmation("هل أنت متأكد أنك تريد حذف جميع المهام؟", () => {
        tasks = [];
        saveTasks();
        displayTasks();
        updateTaskCount();
        showSuccessMessage("تم حذف جميع المهام", "red");
    });
}

// === نافذة التأكيد ===
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
    </div>`;

    document.body.appendChild(confirmation);

    const content = confirmation.querySelector(".confirm-content");
    setTimeout(() => {
        content.classList.add("show");
        const noBtn = confirmation.querySelector(".confirm-no");
        noBtn.classList.add("attention");
        setTimeout(() => noBtn.classList.remove("attention"), 500);
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

// === تهيئة عند تحميل الصفحة ===
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

// === تبديل الثيم ===
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

// === تهيئة أولية ===
updateTaskCount();
displayTasks();