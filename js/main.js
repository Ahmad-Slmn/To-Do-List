import {
    setLanguage,
    currentLang,
    t,
    getSortLabel
} from './translations.js';

export function formatDate(date) {
    return date.toLocaleString('en-EG', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).replace(',', '');
}

// === مراجع العناصر ===
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const deadlineInput = document.getElementById("deadlineInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const sortSelect = document.getElementById("sortTasksSelect");
const taskCount = document.getElementById("taskCount");
const clearAllBtn = document.getElementById("clearAllBtn");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const cancelBtn = document.getElementById("cancelBtn");
const themeToggleBtn = document.getElementById("themeToggle");
const completionRate = document.getElementById("completionRate");


// === بيانات المهام مع التصدير ===
export let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
taskInput.focus();

// === حفظ المهام في التخزين المحلي ===
export function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// دالة لتحديث المهام (اختياري)
export function setTasks(newTasks) {
    tasks = newTasks;
}

// === تحديث عداد المهام ونسبة الإنجاز ===
export function updateTaskCount(tasksData = null) {
    const taskCountSpan = document.getElementById("taskCount");
    const taskCountLabel = document.getElementById("taskCountLabel");
    const completionRate = document.getElementById("completionRate");

    const data = tasksData || tasks; // استخدم المهام الممررة أو المهام الحالية

    if (!data || data.length === 0) {
        taskCountSpan.innerText = "";
        taskCountLabel.innerText = t("emptyTaskList");
        if (completionRate) completionRate.innerText = "";
        return;
    }

    taskCountLabel.innerText = `${t("tasksCountLabel")}: `;
    taskCountSpan.innerText = data.length;

    const completedCount = data.filter(t => t.completed).length;
    const percent = ((completedCount / data.length) * 100).toFixed(0);

    if (completionRate) {
        completionRate.innerText = `${t("completionRateLabel")}: ${percent}% (${completedCount} / ${data.length})`;
    }
}

const cacheKeys = {
    urgent: "motivationalMsg_Global_Urgent",
    soon: "motivationalMsg_Global_Soon",
    plenty: "motivationalMsg_Global_Plenty"
};

function getCachedMotivation(type, nowTimestamp) {
    const keyMap = {
        urgent: "motivationalUrgent",
        soon: "motivationalSoon",
        plenty: "motivationalPlenty"
    };
    try {
        const messages = t(keyMap[type]);
        const langMessages = Array.isArray(messages) ? messages : (messages[currentLang] || messages.en || []);
        const last = JSON.parse(localStorage.getItem(cacheKeys[type])) || {};
        if (nowTimestamp - (last.updatedAt || 0) < 10000 && last.message) return last.message;
        const newMsg = Array.isArray(langMessages) ? langMessages[Math.floor(Math.random() * langMessages.length)] : langMessages;
        localStorage.setItem(cacheKeys[type], JSON.stringify({
            message: newMsg,
            updatedAt: nowTimestamp
        }));
        return newMsg;
    } catch {
        const fallback = t(keyMap[type]);
        const fallbackMessages = Array.isArray(fallback) ? fallback : (fallback[currentLang] || fallback.en || []);
        return Array.isArray(fallbackMessages) ? fallbackMessages[0] : fallbackMessages;
    }
}

function showNoDeadlineMessage(el) {
    const cacheKey = `noDeadlineMsg_Global_${currentLang || "en"}`;
    const now = Date.now();
    try {
        const stored = JSON.parse(localStorage.getItem(cacheKey)) || {};
        if (now - (stored.updatedAt || 0) < 10000 && stored.message) {
            el.textContent = stored.message;
        } else {
            const messages = t("noDeadlineSet");
            const langMessages = Array.isArray(messages) ? messages : (messages[currentLang] || messages.en || []);
            const randomMsg = Array.isArray(langMessages) ? langMessages[Math.floor(Math.random() * langMessages.length)] : langMessages;
            localStorage.setItem(cacheKey, JSON.stringify({
                message: randomMsg,
                updatedAt: now
            }));
            el.textContent = randomMsg;
        }
    } catch {
        const messages = t("noDeadlineSet");
        const langMessages = Array.isArray(messages) ? messages : (messages[currentLang] || messages.en || []);
        el.textContent = Array.isArray(langMessages) ? langMessages[0] : langMessages;
    }
    el.className = "countdown-timer no-deadline";
    el.classList.remove("countdown-danger", "countdown-warning", "countdown-normal", "countdown-expired");
}



const countdownElements = [];
let cachedNoDeadlineMessage = {
    message: "",
    updatedAt: 0
};
let cachedMotivations = {
    urgent: "",
    soon: "",
    plenty: ""
};
let lastMessagesUpdate = 0; // آخر وقت تحديث للرسائل (تحفيز + لا موعد)

function updateCountdownElements() {
    const now = new Date();
    const nowTimestamp = now.getTime();

    // تحديث كل الرسائل (تحفيز + لا موعد) مرة واحدة كل 10 ثواني
    if (nowTimestamp - lastMessagesUpdate >= 10000) {
        try {
            // تحديث رسالة "لا موعد نهائي"
            const noDeadlineMsgs = t("noDeadlineSet");
            const noDeadlineLangMsgs = Array.isArray(noDeadlineMsgs) ? noDeadlineMsgs :
                (noDeadlineMsgs[currentLang] || noDeadlineMsgs.en || []);
            cachedNoDeadlineMessage.message = Array.isArray(noDeadlineLangMsgs) ? noDeadlineLangMsgs[Math.floor(Math.random() * noDeadlineLangMsgs.length)] :
                noDeadlineLangMsgs;

            // تحديث رسائل التحفيز
            cachedMotivations.urgent = getCachedMotivation("urgent", nowTimestamp);
            cachedMotivations.soon = getCachedMotivation("soon", nowTimestamp);
            cachedMotivations.plenty = getCachedMotivation("plenty", nowTimestamp);

            lastMessagesUpdate = nowTimestamp;
            cachedNoDeadlineMessage.updatedAt = nowTimestamp;
        } catch {
            const noDeadlineMsgs = t("noDeadlineSet");
            const noDeadlineLangMsgs = Array.isArray(noDeadlineMsgs) ? noDeadlineMsgs :
                (noDeadlineMsgs[currentLang] || noDeadlineMsgs.en || []);
            cachedNoDeadlineMessage.message = Array.isArray(noDeadlineLangMsgs) ? noDeadlineLangMsgs[0] :
                noDeadlineLangMsgs;

            cachedMotivations.urgent = getCachedMotivation("urgent", nowTimestamp);
            cachedMotivations.soon = getCachedMotivation("soon", nowTimestamp);
            cachedMotivations.plenty = getCachedMotivation("plenty", nowTimestamp);

            lastMessagesUpdate = nowTimestamp;
            cachedNoDeadlineMessage.updatedAt = nowTimestamp;
        }
    }

    // تحديث كل عنصر من countdownElements
    countdownElements.forEach(el => {
        const li = el.closest("li");
        if (!li) return;

        const index = li.dataset.index;
        if (index === undefined) return;

        const task = tasks[index];
        if (!task || task.completed) {
            el.textContent = "";
            el.className = "countdown-timer";
            delete el.dataset.motivation;
            return;
        }

        const deadlineStr = el.dataset.deadline;
        const isNoDeadline = !deadlineStr || deadlineStr.trim() === "";

        if (isNoDeadline) {
            el.textContent = cachedNoDeadlineMessage.message;
            el.className = "countdown-timer no-deadline";
            delete el.dataset.motivation;
            return;
        }

        if (el.classList.contains("no-deadline")) el.classList.remove("no-deadline");

        const deadline = new Date(deadlineStr);
        if (isNaN(deadline)) return;

        const diff = deadline - now;
        const timeDiv = el.querySelector(".countdown-time");
        const motivationDiv = el.querySelector(".countdown-motivation");

        if (diff <= 0) {
            if (timeDiv) timeDiv.textContent = t("taskTimeExpired");
            if (motivationDiv) motivationDiv.textContent = "";
            el.className = "countdown-timer countdown-expired";
            return;
        }

        const totalSeconds = Math.floor(diff / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const days = Math.floor(totalMinutes / (60 * 24));
        const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
        const minutes = totalMinutes % 60;
        const seconds = totalSeconds % 60;

        let parts = [];
        if (diff >= 3600 * 1000) {
            if (days > 0) parts.push(`${days} ${days === 1 ? t("daySingular") : t("dayPlural")}`);
            if (hours > 0) parts.push(`${hours} ${hours === 1 ? t("hourSingular") : t("hourPlural")}`);
            if (minutes > 0 && days === 0) parts.push(`${minutes} ${minutes === 1 ? t("minuteSingular") : t("minutePlural")}`);
        } else {
            if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? t("minuteSingular") : t("minutePlural")}`);
            parts.push(`${seconds} ${seconds === 1 ? t("secondSingular") : t("secondPlural")}`);
        }

        const message = `${t("remainingTime")} ${parts.join(" / ")}`;

        // تحديث رسالة التحفيز (دون تحديث منفصل لأن التحديث حدث أعلى)
        if (!el.dataset.lastMotivationUpdate || nowTimestamp - +el.dataset.lastMotivationUpdate >= 10000) {
            let motivation = "";
            let className = "countdown-timer countdown-normal";

            if (diff <= 6 * 60 * 60 * 1000) {
                motivation = cachedMotivations.urgent;
                className = "countdown-timer countdown-danger";
            } else if (diff <= 2 * 24 * 60 * 60 * 1000) {
                motivation = cachedMotivations.soon;
                className = "countdown-timer countdown-warning";
            } else {
                motivation = cachedMotivations.plenty;
            }

            el.dataset.motivation = motivation;
            el.className = className;
            el.dataset.lastMotivationUpdate = nowTimestamp;
        }

        if (timeDiv) timeDiv.textContent = message;
        if (motivationDiv) motivationDiv.textContent = el.dataset.motivation || "";
    });
}

function priorityValue(p) {
    return {
        high: 3,
        medium: 2,
        low: 1
    } [p] || 0;
}

export function displayTasks(filteredTasks = null) {
    countdownElements.length = 0;
    taskList.innerHTML = "";

    const priorityMap = {
        high: 3,
        medium: 2,
        low: 1
    };
    const sortOrder = localStorage.getItem("taskSortOrder") || "default";

    let list = (filteredTasks || tasks).map((task, idx) => ({
        ...task,
        originalIndex: idx
    }));

    const sorters = {
        complete: () => (list = list.filter(t => t.completed)),
        incompleteOnly: () => (list = list.filter(t => !t.completed)),
        newest: () => list.sort((a, b) => new Date(b.date) - new Date(a.date)),
        oldest: () => list.sort((a, b) => new Date(a.date) - new Date(b.date)),
        priority: () => list.sort((a, b) => {
            const diff = (priorityMap[b.priority] || 0) - (priorityMap[a.priority] || 0);
            return diff !== 0 ? diff : new Date(b.date) - new Date(a.date);
        }),
        default: () => list.sort((a, b) => (a.completed !== b.completed) ? (a.completed ? 1 : -1) : new Date(b.date) - new Date(a.date)),
    };

    (sorters[sortOrder] || sorters.default)();

    if (!list.length) {
        const emptyMessages = {
            complete: t("noCompletedTasksMessage"),
            incompleteOnly: t("noIncompleteTasksMessage"),
            newest: t("noNewestTasksMessage"),
            oldest: t("noOldestTasksMessage"),
            priority: t("noPriorityTasksMessage"),
            default: t("noTasksMessage"),
        };
        taskList.innerHTML = `<p style="color:red; text-align:center; padding:30px;">${emptyMessages[sortOrder] || emptyMessages.default}</p>`;
        return;
    }

    const isArabic = currentLang === "ar";
    const formatDate = date => {
        let h = date.getHours(),
            m = String(date.getMinutes()).padStart(2, "0"),
            s = String(date.getSeconds()).padStart(2, "0");
        const period = h >= 12 ? (isArabic ? "م" : "PM") : (isArabic ? "ص" : "AM");
        h = h % 12 || 12;
        return `${period} ${h}:${m}:${s} ${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    };

    list.forEach(taskObj => {
        const li = document.createElement("li");
        li.dataset.index = taskObj.originalIndex;
        li.className = `${taskObj.completed ? "completed" : ""} priority-${taskObj.priority || "medium"}`;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = taskObj.completed;
        checkbox.addEventListener("click", () => toggleTaskCompletion(taskObj.originalIndex));

        const taskName = document.createElement("span");
        taskName.className = "task-name";
        taskName.textContent = taskObj.task;

        const taskDeadline = document.createElement("span");
        taskDeadline.className = "task-deadline";
        const creation = new Date(taskObj.date);
        taskDeadline.textContent = taskObj.deadline ? `${formatDate(creation)} ${isArabic ? "←" : "→"} ${formatDate(new Date(taskObj.deadline))}` :
            formatDate(creation);

        let countdownElement = null;
        if (!taskObj.completed) {
            countdownElement = document.createElement("div");
            countdownElement.className = "countdown-timer";

            if (!taskObj.deadline) {
                countdownElement.classList.add("no-deadline");
            } else {
                countdownElement.dataset.deadline = taskObj.deadline;
                const timeDiv = document.createElement("div");
                timeDiv.className = "countdown-time";
                const motivationDiv = document.createElement("div");
                motivationDiv.className = "countdown-motivation";
                countdownElement.append(timeDiv, motivationDiv);
            }

            countdownElements.push(countdownElement);
            li.appendChild(countdownElement);
        }

        const actionContainer = document.createElement("div");
        actionContainer.className = "task-actions";

        const editBtn = document.createElement("button");
        editBtn.textContent = t("editBtnText");
        if (taskObj.completed) {
            editBtn.style.opacity = "0.5";
            editBtn.title = t("cannotEditCompletedTask");
            editBtn.addEventListener("click", () => showSuccessMessage(t("cannotEditCompletedTask"), "#f44336"));
        } else {
            editBtn.addEventListener("click", () => editTask(taskObj.originalIndex, li));
        }

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = t("deleteBtnText");
        deleteBtn.addEventListener("click", () => deleteTask(taskObj.originalIndex));

        actionContainer.append(editBtn, deleteBtn);

        li.append(checkbox, taskName, taskDeadline);
        if (countdownElement) li.appendChild(countdownElement);
        li.appendChild(actionContainer);

        taskList.appendChild(li);
    });

    updateCountdownElements();
    if (!window.countdownInterval) window.countdownInterval = setInterval(updateCountdownElements, 1000);
}

if (sortSelect) {
    let previousSortOrder = localStorage.getItem("taskSortOrder") || "default";

    sortSelect.value = previousSortOrder;

    sortSelect.addEventListener("change", () => {
        const selectedValue = sortSelect.value;

        if (selectedValue !== previousSortOrder) {
            const fromLabel = getSortLabel(previousSortOrder);
            const toLabel = getSortLabel(selectedValue);

            localStorage.setItem("taskSortOrder", selectedValue);
            displayTasks();

            const template = t("sortChangedMessage");
            const message = template.replace("{from}", fromLabel).replace("{to}", toLabel);

            showSuccessMessage(message, "success");
            previousSortOrder = selectedValue;
        }
    });
}

// === تبديل حالة الإتمام ===
function animateTaskCompletion(li, isCompleted) {
    return new Promise((resolve) => {
        const bgColor = isCompleted ? getComputedStyle(document.documentElement).getPropertyValue('--priority-low-bg').trim() :
            getComputedStyle(document.documentElement).getPropertyValue('--priority-medium-bg').trim();

        li.classList.add("fade-background");
        li.style.animation = "pulse 0.5s ease-in-out 2";
        li.style.backgroundColor = bgColor;

        setTimeout(() => {
            li.classList.remove("fade-background");
            li.style.animation = "";
            li.style.backgroundColor = "";
            resolve(); // ← ننتقل بعد انتهاء التأثير
        }, 1000);
    });
}


async function toggleTaskCompletion(index) {
    const task = tasks[index];
    const isNowCompleted = !task.completed;

    const li = document.querySelector(`#taskList li[data-index="${index}"]`);
    if (!li) {
        task.completed = isNowCompleted;
        saveTasks();
        displayTasks();
        updateTaskCount();
        return;
    }

    // ✅ نفّذ التأثير أولاً قبل تغيير البيانات أو الكلاس
    await animateTaskCompletion(li, isNowCompleted);

    // ✅ الآن غيّر البيانات بعد انتهاء التأثير
    task.completed = isNowCompleted;
    saveTasks();

    // ✅ ثم أضف/أزل الكلاس .completed بعد التأثير
    if (isNowCompleted) {
        li.classList.add("completed");
    } else {
        li.classList.remove("completed");
    }

    // ✅ أخيرًا عرض الرسالة وتحديث القائمة
    const message = isNowCompleted ? `${t("taskCompleted")}: "${task.task}" ✅` :
        `${t("taskUncompleted")}: "${task.task}" ❌`;
    showSuccessMessage(message, isNowCompleted ? "#4caf50" : "#ff9800");

    displayTasks();
    updateTaskCount();
}


// 🧩 دالة مساعدة لتوليد التاريخ الحالي كنص
function getCurrentDateString() {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
}

// 🧩 دالة مساعدة لتوحيد وقت الموعد النهائي مع الوقت الحالي
function normalizeDeadline(deadline) {
    if (!deadline) return null;
    const now = new Date();
    const temp = new Date(deadline);
    temp.setSeconds(now.getSeconds());
    temp.setMilliseconds(now.getMilliseconds());
    return temp.toISOString();
}

// === إضافة مهمة ===
export function addTask() {
    let task = taskInput.value.trim();
    const priority = priorityInput.value;
    const rawDeadline = deadlineInput.value;

    const cleanedTask = removeDiacritics(task);
    const normalizedTask = cleanedTask.replace(/\s+/g, " "); // إزالة المسافات الزائدة

    // 🔴 1. المهمة فارغة أو تحتوي فقط على رموز
    if (!normalizedTask || !/[a-zA-Z\u0600-\u06FF]/.test(normalizedTask)) {
        showSuccessMessage(t("errorEmptyTask") || "⚠️ لا يمكن ترك المهمة فارغة أو تحتوي على رموز فقط.", "#f44336");
        return;
    }

    // 🔴 2. طول المهمة أقل من 3 أحرف
    if (normalizedTask.length < 3) {
        showSuccessMessage(t("errorMinChars") || "⚠️ المهمة قصيرة جدًا، يجب أن تكون 3 أحرف على الأقل.", "#f44336");
        return;
    }

    // 🔴 3. طول المهمة يتجاوز 200 حرف
    if (normalizedTask.length > 200) {
        showSuccessMessage(t("errorTooLong") || "⚠️ المهمة طويلة جدًا، الحد الأقصى 200 حرف.", "#f44336");
        return;
    }

    // 🔴 4. تحتوي على وسوم HTML
    if (/<[^>]*>/g.test(task)) {
        showSuccessMessage(t("errorHTMLNotAllowed") || "⚠️ لا يُسمح بإدخال HTML أو أكواد.", "#f44336");
        return;
    }

    // 🔴 5. التكرار (بعد إزالة التشكيل والمسافات)
    const isDuplicate = tasks.some(tk =>
        removeDiacritics(tk.task.trim().replace(/\s+/g, " ")) === normalizedTask
    );
    if (isDuplicate) {
        showSuccessMessage(t("errorDuplicateTask") || "⚠️ هذه المهمة موجودة بالفعل.", "#f44336");
        return;
    }

    // 🔴 6. الموعد النهائي في الماضي
    if (rawDeadline && new Date(rawDeadline) < new Date()) {
        showSuccessMessage(t("errorPastDeadline") || "⚠️ لا يمكن اختيار تاريخ في الماضي.", "#f44336");
        deadlineInput.focus();
        return;
    }

    // ✅ 7. إنشاء المهمة
    const newTask = {
        task,
        date: getCurrentDateString(),
        completed: false,
        priority,
        deadline: normalizeDeadline(rawDeadline),
    };

    tasks.push(newTask);
    tasks.sort((a, b) => new Date(b.date) - new Date(a.date));
    saveTasks();
    displayTasks();
    updateTaskCount();
    showSuccessMessage(t("taskAdded") || "✅ تم إضافة المهمة بنجاح.");

    taskInput.value = "";
    priorityInput.value = "medium";
    deadlineInput.value = "";
    taskInput.focus();
}
// === تعديل مهمة ===
function editTask(index, listItem) {
    const oldTask = tasks[index];

    const inputTask = Object.assign(document.createElement("input"), {
        type: "text",
        value: oldTask.task,
    });

    const selectPriority = document.createElement("select");
  ["high", "medium", "low"].forEach(p => {
        const option = document.createElement("option");
        option.value = p;
        option.textContent = t(`priority${p.charAt(0).toUpperCase() + p.slice(1)}`);
        if (p === oldTask.priority) option.selected = true;
        selectPriority.appendChild(option);
    });

    const inputDeadline = Object.assign(document.createElement("input"), {
        type: "datetime-local",
        title: t("deadlineTitle"),
        value: oldTask.deadline || "",
    });

    const saveBtn = document.createElement("button");
    saveBtn.textContent = t("saveEditText");

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = t("cancelEditText");

    const editContainer = document.createElement("div");
    editContainer.className = "edit-container";
    editContainer.append(inputTask, selectPriority, inputDeadline, saveBtn, cancelBtn);

    listItem.innerHTML = "";
    listItem.appendChild(editContainer);
    inputTask.focus();
    setTimeout(() => editContainer.classList.add("show"), 10);

    saveBtn.onclick = () => {
        const newTask = inputTask.value.trim();
        const newPriority = selectPriority.value;
        let newDeadline = normalizeDeadline(inputDeadline.value || null);

        if (newTask.length < 3 || !/[a-zA-Z\u0600-\u06FF]/.test(newTask)) {
            showSuccessMessage(t("errorEditMinChars"), "#f44336");
            inputTask.focus();
            return;
        }

        if (tasks.some((t, i) => t.task === newTask && i !== index)) {
            showSuccessMessage(t("errorEditDuplicate"), "#f44336");
            inputTask.focus();
            return;
        }

        if (newDeadline && new Date(newDeadline) < new Date()) {
            showSuccessMessage(t("errorEditPastDeadline"), "#f44336");
            inputDeadline.focus();
            return;
        }

        const noChange = newTask === oldTask.task &&
            newPriority === oldTask.priority &&
            newDeadline === oldTask.deadline;
        if (noChange) {
            showSuccessMessage(t("errorNoChange"), "#f44336");
            inputTask.focus();
            return;
        }

        tasks[index] = {
            ...oldTask,
            task: newTask,
            priority: newPriority,
            deadline: newDeadline,
            date: getCurrentDateString()
        };

        tasks.sort((a, b) => new Date(b.date) - new Date(a.date));
        saveTasks();
        displayTasks();
        updateTaskCount();
        showSuccessMessage(t("taskEdited"));
    };

    cancelBtn.onclick = () => {
        editContainer.classList.remove("show");
        setTimeout(displayTasks, 300);
    };
}


// === حذف مهمة ===
let pendingDeleteIndex = null;

function deleteTask(index) {
    const taskName = tasks[index]?.task || ""; // اسم المهمة للحذف

    showConfirmation(t("deleteTaskConfirm"), () => {
        tasks.splice(index, 1);
        saveTasks();
        displayTasks();
        updateTaskCount();

        // رسالة الحذف مع ذكر اسم المهمة
        const messageTemplate = t("taskDeleted"); // "تم حذف مهمة \"{taskName}\" بنجاح"
        const message = messageTemplate.replace("{taskName}", taskName);
        showSuccessMessage(message, "red");
    });
}

// دالة تشغيل الصوت حسب نوع الرسالة: 'success' أو 'error'
export function playFeedbackSound(type) {
    const sounds = {
        success: "sounds/success.mp3",
        error: "sounds/error.mp3"
    };

    const audioSrc = sounds[type] || sounds.success;
    const audio = new Audio(audioSrc);

    audio.play().catch(() => {});
}


export function showSuccessMessage(key, bgColor = "#74ef91") {
    const text = t(key); // ترجمة المفتاح

    const msg = document.createElement("div");
    msg.className = "success-message " + (["#f44336", "red"].includes(bgColor.toLowerCase()) ? "error" : "success");
    msg.innerText = text;
    msg.style.backgroundColor = bgColor;
    document.body.prepend(msg);

    // استدعاء دالة تشغيل الصوت المناسبة بناءً على لون الخلفية
    if (["#f44336", "red"].includes(bgColor.toLowerCase())) {
        playFeedbackSound("error");
    } else {
        playFeedbackSound("success");
    }

    setTimeout(() => msg.classList.add("show"), 30);
    setTimeout(() => {
        msg.classList.remove("show");
        setTimeout(() => msg.remove(), 500);
    }, 3500);
}


// === إزالة التشكيل العربي ===
function removeDiacritics(text) {
    const arabicDiacritics = /[\u0617-\u061A\u064B-\u0652]/g;
    return text.normalize("NFD").replace(arabicDiacritics, "");
}

// === تحديث عدد النتائج ===
export function updateMatchCount(count) {
    const wrapper = document.getElementById("matchCount");
    const label = document.getElementById("matchCountLabel");
    const number = document.getElementById("matchCountNumber");

    if (!wrapper || !label || !number) return;

    wrapper.style.display = "inline-block";
    label.textContent = `${t("matchCountLabel") || "عدد النتائج"}:`;
    number.textContent = count ?? 0;
}


let recognition;
let listeningIndicator;

export function searchTasks() {
    if (tasks.length < 3) {
        showSuccessMessage(t("errorSearchMinTasks"), "#f44336");
        return;
    }

    document.getElementById("searchControls").style.display = "flex";
    document.getElementById("searchBtn").style.display = "none";
    searchInput.style.display = "inline-block";
    searchInput.focus();

    function filterAndDisplay() {
        const rawText = searchInput.value.trim();
        const status = statusFilter.value;
        const mode = matchMode.value;
        const keywords = removeDiacritics(rawText.toLowerCase()).split(/\s+/).filter(Boolean);

        if (!rawText && status === "all") {
            displayTasks(tasks);
            highlightSearchMatches('');
            updateMatchCount(0);
            return;
        }

        const filtered = tasks.filter(t => {
            const taskText = removeDiacritics(t.task.toLowerCase());
            const statusMatches = (
                status === 'all' ||
                (status === 'completed' && t.completed) ||
                (status === 'pending' && !t.completed)
            );

            const wordMatch = mode === 'and' ? keywords.every(kw => taskText.includes(kw)) :
                keywords.some(kw => taskText.includes(kw));

            return statusMatches && wordMatch;
        });


        if (filtered.length === 0) {
            taskList.innerHTML = `<div class="no-results-message">${t("noSearchResults")}</div>`;
            updateMatchCount(0);
            if ("vibrate" in navigator) navigator.vibrate(200);
            playFeedbackSound("error");
        } else {
            displayTasks(filtered);
            highlightSearchMatches(rawText);
            updateMatchCount(filtered.length);
        }

    }

    searchInput.oninput = filterAndDisplay;
    statusFilter.onchange = filterAndDisplay;
    matchMode.onchange = filterAndDisplay;

    filterAndDisplay();
}


// === إبراز الكلمات المطابقة ===
function highlightSearchMatches(text) {
    const spans = taskList.querySelectorAll("li .task-name");
    if (!text) {
        spans.forEach(span => {
            span.innerHTML = span.textContent;
            span.classList.remove("rtl");
        });
        return;
    }

    const inputWords = text.trim().split(/\s+/).filter(Boolean);
    const regexWords = inputWords.map(word => {
        const clean = removeDiacritics(word.toLowerCase());
        return {
            word,
            regex: new RegExp(clean.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")
        };
    });

    spans.forEach(span => {
        const original = span.textContent;
        const cleanOriginal = removeDiacritics(original);
        let modified = original;
        let found = false;

        // خزّن مواقع المطابقة لتمييزها بدقة في النص الأصلي
        regexWords.forEach(({
            regex
        }) => {
            const matches = [];
            let match;
            while ((match = regex.exec(cleanOriginal)) !== null) {
                matches.push({
                    start: match.index,
                    length: match[0].length
                });
            }

            if (matches.length) {
                found = true;
                // فرّغ النص وأعد بناءه مع الإبراز
                let result = "";
                let lastIndex = 0;

                matches.forEach(({
                    start,
                    length
                }) => {
                    result += original.slice(lastIndex, start);
                    result += `<span class="matched-text">${original.slice(start, start + length)}</span>`;
                    lastIndex = start + length;
                });
                result += original.slice(lastIndex);
                modified = result;
            }
        });

        span.innerHTML = modified;
        span.classList.toggle("rtl", /\p{Script=Arabic}/u.test(original));
    });

    updateMatchCount(taskList.querySelectorAll(".matched-text").length);
}


// === إلغاء البحث ===
export function cancelSearch() {
    if (recognition?.stop) {
        recognition.stop();
        voiceSearchBtn.textContent = t("voiceSearchBtnText");
        voiceSearchBtn.disabled = false;
        listeningIndicator?.remove();
    }

    searchInput.value = "";

    document.getElementById("searchControls").style.display = "none";
    document.getElementById("searchBtn").style.display = "inline-block";
    searchInput.style.display = "none";

    displayTasks();
    updateTaskCount();
}


// === البحث الصوتي ===
const voiceSearchBtn = document.getElementById("voiceSearchBtn");

if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = currentLang === "en" ? "en-US" : "ar-SA";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
        voiceSearchBtn.textContent = "🎙️ " + t("listening");
        voiceSearchBtn.disabled = true;

        listeningIndicator = document.createElement("span");
        listeningIndicator.textContent = t("listening");
        Object.assign(listeningIndicator.style, {
            marginRight: "10px",
            color: "#1565c0",
            fontWeight: "bold",
        });
        voiceSearchBtn.parentNode.insertBefore(listeningIndicator, voiceSearchBtn);
    };

    recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript.trim();
        if (transcript) {
            searchInput.value = transcript;
            searchInput.dispatchEvent(new Event("input"));
        }
    };

    recognition.onerror = (e) => {
        alert(t("voiceRecognitionError"));
        console.error("Voice recognition error:", e.error);
    };

    recognition.onend = () => {
        voiceSearchBtn.textContent = t("voiceSearchBtnText");
        voiceSearchBtn.disabled = false;
        listeningIndicator?.remove();
    };

    voiceSearchBtn.onclick = () => recognition.start();
} else {
    voiceSearchBtn.style.display = "none";
}


// === حذف كل المهام ===
export function clearAllTasks() {
    if (!tasks.length) {
        showSuccessMessage(t("noTasksToDelete"), "orange");
        return;
    }
    showConfirmation(t("deleteAllConfirm"), () => {
        tasks = [];
        saveTasks();
        displayTasks();
        updateTaskCount(tasks);
        showSuccessMessage(t("taskDeleted"), "red"); // يمكن وضع نص مختلف إذا أردت
    });
}

// === نافذة التأكيد ===
function showConfirmation(message, onConfirm, onCancel) {
    const isRTL = document.documentElement.dir === "rtl";
    const confirmation = document.createElement("div");
    confirmation.className = "custom-confirmation show";
    confirmation.innerHTML = `
    <div class="confirm-content">
      <p>${message}</p>
      <div class="confirm-buttons">
        ${isRTL ? `<button class="confirm-no">${t("no")}</button><button class="confirm-yes">${t("yes")}</button>`
          : `<button class="confirm-yes">${t("yes")}</button><button class="confirm-no">${t("no")}</button>`}
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
        close();
    };
    confirmation.querySelector(".confirm-no").onclick = () => {
        onCancel?.();
        close();
    };

    function close() {
        content.classList.remove("show");
        confirmation.classList.remove("show");
        setTimeout(() => confirmation.remove(), 300);
    }
}

// === تهيئة التعرف الصوتي ===
function initVoiceRecognition(lang) {
    if (!('webkitSpeechRecognition' in window)) return;

    if (!window.voiceRecognitionInstance) {
        window.voiceRecognitionInstance = new webkitSpeechRecognition();
        window.voiceRecognitionInstance.continuous = false;
        window.voiceRecognitionInstance.interimResults = false;
    }

    window.voiceRecognitionInstance.lang = lang === "ar" ? "ar-SA" : "en-US";
}

// === عند تحميل الصفحة ===
window.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem("selectedLanguage") || "ar";
    const savedTheme = localStorage.getItem("theme");

    // إعداد اللغة والثيم
    const count = setLanguage(savedLang, tasks, displayTasks);
    updateMatchCount(count);
    initVoiceRecognition(savedLang);

    if (savedTheme === "dark") {
        document.documentElement.classList.add("dark-theme");
        themeToggleBtn.textContent = "🌞";
    } else {
        themeToggleBtn.textContent = "🌙";
    }

    updateTaskCount(tasks);
    displayTasks(tasks);

    // اختيار اللغة
    const languageSelect = document.getElementById("languageSelect");
    if (languageSelect) {
        languageSelect.value = savedLang;
        languageSelect.addEventListener("change", e => {
            const newLang = e.target.value;
            document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
            document.documentElement.lang = newLang;
            localStorage.setItem("selectedLanguage", newLang);

            const newCount = setLanguage(newLang, tasks, displayTasks);
            updateMatchCount(newCount);
            updateTaskCount(tasks);
            initVoiceRecognition(newLang);
        });
    }
});

// === تبديل الثيم ===
export function toggleTheme(btn) {
    btn = btn || document.getElementById("themeToggle");
    if (!btn) return console.warn("زر تبديل الثيم غير موجود!");

    const isDark = document.documentElement.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    btn.textContent = isDark ? "🌞" : "🌙";
}
themeToggleBtn?.addEventListener("click", () => toggleTheme(themeToggleBtn));

// === ربط الأحداث ===
addBtn.onclick = addTask;
searchBtn.onclick = searchTasks;
cancelBtn.onclick = cancelSearch;
clearAllBtn.onclick = clearAllTasks;

// === عرض المهام والعداد
updateTaskCount();
displayTasks();

// === اختصارات لوحة المفاتيح
document.addEventListener("keydown", e => {
    const isCtrl = e.ctrlKey;
    switch (e.code) {
        case "Enter":
            if (isCtrl) addTask();
            break;
        case "KeyS":
            if (isCtrl) {
                e.preventDefault();
                searchTasks();
            }
            break;
        case "KeyD":
            if (isCtrl) {
                e.preventDefault();
                themeToggleBtn?.click();
            }
            break;
        case "KeyX":
            if (isCtrl) {
                e.preventDefault();
                clearAllTasks();
            }
            break;
        case "KeyV":
            if (isCtrl) {
                e.preventDefault();
                document.getElementById("voiceControlBtn")?.click();
            }
            break;
        case "Digit1":
            if (isCtrl) {
                e.preventDefault();
                displayTasks(tasks.filter(t => t.completed));
                showSuccessMessage("✅ عرض المهام المكتملة فقط", "#4caf50");
            }
            break;
        case "Digit2":
            if (isCtrl) {
                e.preventDefault();
                displayTasks(tasks.filter(t => !t.completed));
                showSuccessMessage("⏳ عرض المهام غير المكتملة فقط", "#ffc107");
            }
            break;
        case "Digit0":
            if (isCtrl) {
                e.preventDefault();
                displayTasks();
                showSuccessMessage("📋 عرض جميع المهام", "#2196f3");
            }
            break;
        case "Escape":
            cancelSearch();
            document.querySelector(".edit-container button:nth-child(5)")?.click();
            break;
    }
});