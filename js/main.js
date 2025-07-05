import {
    setLanguage,
    currentLang,
    t
} from './translations.js';
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



export function displayTasks(filteredTasks = null) {
    const list = filteredTasks || tasks;
    list.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return new Date(b.date) - new Date(a.date);
    });

    taskList.innerHTML = list.length ? "" : `<p style="color:red; text-align:center; padding:30px;">${t("noTasksMessage")}</p>`;

    list.forEach((taskObj, i) => {
        const li = document.createElement("li");
        li.dataset.index = i;
        li.className = `${taskObj.completed ? "completed" : ""} priority-${
      taskObj.priority || "medium"
    }`;

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
            taskDeadline.textContent = `${taskObj.date} → ${d.getFullYear()}-${
        d.getMonth() + 1
      }-${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(
        2,
        "0"
      )}`;
        } else {
            taskDeadline.textContent = taskObj.date;
        }

        const countdownElement = document.createElement("div");
        countdownElement.className = "countdown-timer";

        const motivationalMessages = {
            urgent: [
        t("motivations.urgent.1"),
        t("motivations.urgent.2"),
        t("motivations.urgent.3"),
      ],
            soon: [
        t("motivations.soon.1"),
        t("motivations.soon.2"),
        t("motivations.soon.3"),
      ],
            plenty: [
        t("motivations.plenty.1"),
        t("motivations.plenty.2"),
        t("motivations.plenty.3"),
      ],
        };

        const getRandomMessage = (arr) =>
            arr[Math.floor(Math.random() * arr.length)];

        const updateCountdown = () => {
            if (!taskObj.deadline) {
                countdownElement.textContent = "";
                return;
            }

            const now = new Date();
            const deadline = new Date(taskObj.deadline);
            const diff = deadline - now;

            if (diff <= 0) {
                countdownElement.textContent = t("taskTimeExpired"); // ❗ انتهى وقت هذه المهمة. يُفضل مراجعتها أو تعديلها.
                countdownElement.className = "countdown-timer countdown-expired";
                return;
            }

            const totalMinutes = Math.floor(diff / (1000 * 60));
            const days = Math.floor(totalMinutes / (60 * 24));
            const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
            const minutes = totalMinutes % 60;

            let parts = [];

            if (days > 0) parts.push(`${days} ${days === 1 ? t("daySingular") : t("dayPlural")}`);
            if (hours > 0) parts.push(`${hours} ${hours === 1 ? t("hourSingular") : t("hourPlural")}`);
            if (minutes > 0 && days === 0) parts.push(`${minutes} ${minutes === 1 ? t("minuteSingular") : t("minutePlural")}`);

            let message = `${t("remainingTime")} ${parts.join(" / ")}`; // ⏳ تبقى ...

            let motivation = "";

            if (diff <= 30 * 60 * 1000) { // أقل من 30 دقيقة
                const urgentMessages = t("motivationalUrgent");
                motivation = urgentMessages[Math.floor(Math.random() * urgentMessages.length)];
                countdownElement.className = "countdown-timer countdown-danger";
            } else if (diff <= 6 * 60 * 60 * 1000) { // أقل من 6 ساعات
                const urgentMessages = t("motivationalUrgent");
                motivation = urgentMessages[Math.floor(Math.random() * urgentMessages.length)];
                countdownElement.className = "countdown-timer countdown-danger";
            } else if (diff <= 2 * 24 * 60 * 60 * 1000) { // أقل من يومين
                const soonMessages = t("motivationalSoon");
                motivation = soonMessages[Math.floor(Math.random() * soonMessages.length)];
                countdownElement.className = "countdown-timer countdown-warning";
            } else {
                const plentyMessages = t("motivationalPlenty");
                motivation = plentyMessages[Math.floor(Math.random() * plentyMessages.length)];
                countdownElement.className = "countdown-timer countdown-normal";
            }

            countdownElement.textContent = `${message} — ${motivation}`;
        };


        updateCountdown();
        setInterval(updateCountdown, 60000);

        const actionContainer = document.createElement("div");
        actionContainer.className = "task-actions";

        const editBtn = document.createElement("button");
        editBtn.textContent = t("editBtnText");

        if (taskObj.completed) {
            editBtn.style.opacity = "0.5";
            editBtn.title = t("cannotEditCompletedTask");
            editBtn.addEventListener("click", () => {
                showSuccessMessage(t("cannotEditCompletedTask"), "#f44336");
            });
        } else {
            editBtn.addEventListener("click", () => editTask(i, li));
        }

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = t("deleteBtnText");
        deleteBtn.addEventListener("click", () => deleteTask(i));

        actionContainer.append(deleteBtn, editBtn);

        li.append(checkbox, taskName, taskDeadline, countdownElement, actionContainer);

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
export function addTask() {
    const task = taskInput.value.trim();
    const priority = priorityInput.value;
    const deadline = deadlineInput.value;

    if (task.length < 3 || !task.match(/[a-zA-Z\u0600-\u06FF]/)) {
        showSuccessMessage(t("errorMinChars"), "#f44336");
        return;
    }

    if (tasks.some(tk => tk.task === task)) {
        showSuccessMessage(t("errorDuplicateTask"), "#f44336");
        return;
    }

    if (deadline && new Date(deadline) < new Date()) {
        showSuccessMessage(t("errorPastDeadline"), "#f44336");
        deadlineInput.focus();
        return;
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
    showSuccessMessage(t("taskAdded"));

    taskInput.value = "";
    priorityInput.value = "medium";
    deadlineInput.value = "";
    taskInput.focus();
}


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
        option.textContent =
            p === "high" ? t("priorityHigh") :
            p === "medium" ? t("priorityMedium") :
            t("priorityLow");
        if (p === oldTask.priority) option.selected = true;
        selectPriority.appendChild(option);
    });

    const inputDeadline = document.createElement("input");
    inputDeadline.type = "datetime-local";
    inputDeadline.title = t("deadlineTitle");
    if (oldTask.deadline) inputDeadline.value = oldTask.deadline;

    const saveBtn = document.createElement("button");
    saveBtn.textContent = t("saveEditText");

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = t("cancelEditText");

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
        if (
            newTask === oldTask.task &&
            newPriority === oldTask.priority &&
            newDeadline === oldTask.deadline
        ) {
            showSuccessMessage(t("errorNoChange"), "#f44336");
            inputTask.focus();
            return;
        }

        const now = new Date();
        const dateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

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
    showConfirmation(t("deleteTaskConfirm"), () => {
        tasks.splice(index, 1);
        saveTasks();
        displayTasks();
        updateTaskCount();
        showSuccessMessage("taskDeleted", "red");
    });
}

// === رسالة مؤقتة ===
export function showSuccessMessage(key, bgColor = "#74ef91") {
    const text = t(key); // ترجمة المفتاح

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

// === عدد نتائج البحث ===
export function updateMatchCount(count) {
    const matchCount = document.getElementById('matchCount');
    if (!matchCount) return;

    const label = t('matchCountLabel') || "Results count";

    matchCount.style.display = 'non';
    matchCount.textContent = `${label}: ${count !== undefined ? count : 0}`;
}



let recognition; // تعريف عام لاستخدامه في الإلغاء
let listeningIndicator;

export function searchTasks() {
    if (tasks.length < 3) {
        showSuccessMessage(t("errorSearchMinTasks") || "لا يمكن البحث، يجب وجود 3 مهام على الأقل!", "#f44336");
        return;
    }

    // إظهار عناصر البحث فقط
    searchInput.style.display = "inline-block";
    document.getElementById('statusFilterGroup').style.display = "inline-block";
    document.getElementById('matchModeGroup').style.display = "inline-block";
    clearSearchBtn.style.display = "none";
    cancelBtn.style.display = "inline-block";
    matchCount.style.display = "inline-block";
    voiceSearchBtn.style.display = "inline-block";

    // إخفاء العناصر الأخرى
    searchBtn.style.display = "none";
    searchInput.focus();

    function filterAndDisplay() {
        const rawText = searchInput.value.trim();
        const status = statusFilter.value;
        const mode = matchMode.value;

        if (!rawText && status === "all") {
            displayTasks(tasks);
            highlightSearchMatches('');
            updateMatchCount(0);
            clearSearchBtn.style.display = 'none';
            return;
        }

        clearSearchBtn.style.display = rawText ? 'inline-block' : 'none';

        const keywords = removeDiacritics(rawText.toLowerCase()).split(/\s+/).filter(Boolean);

        const filtered = tasks.filter(t => {
            const taskText = removeDiacritics(t.task.toLowerCase());

            if (status === 'completed' && !t.completed) return false;
            if (status === 'pending' && t.completed) return false;

            if (mode === 'and') {
                return keywords.every(kw => taskText.includes(kw));
            } else {
                return keywords.some(kw => taskText.includes(kw));
            }
        });

        if (filtered.length === 0) {
            taskList.innerHTML = `
                <div class="no-results-message">
                    ${t("noSearchResults") || "لا يوجد مهام تتطابق مع البحث"}
                </div>
            `;
            updateMatchCount(0);
            if ('vibrate' in navigator) navigator.vibrate(200);
            const audio = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=');
            audio.play();
        } else {
            displayTasks(filtered);
            highlightSearchMatches(rawText);
            updateMatchCount(filtered.length);
        }
    }

    searchInput.oninput = filterAndDisplay;
    statusFilter.onchange = filterAndDisplay;
    matchMode.onchange = filterAndDisplay;

    clearSearchBtn.onclick = () => {
        searchInput.value = '';
        filterAndDisplay();
        searchInput.focus();
    };

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
    const words = cleanText.split(/\s+/).filter(Boolean).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    taskList.querySelectorAll("li .task-name").forEach(span => {
        const originalText = span.textContent;
        const cleanOriginal = removeDiacritics(originalText);

        let modifiedText = originalText;
        let matchFound = false;

        words.forEach(word => {
            if (!word) return;
            const regex = new RegExp(`(${word})`, 'gi');
            if (regex.test(cleanOriginal)) {
                matchFound = true;
                modifiedText = modifiedText.replace(regex, `<span class="matched-text">$1</span>`);
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

export function cancelSearch() {
    // ✅ إيقاف البحث الصوتي عند الإلغاء
    if (recognition && typeof recognition.stop === 'function') {
        recognition.stop();
        voiceSearchBtn.textContent = t("voiceSearchBtnText") || '🎤 البحث صوتي';
        voiceSearchBtn.disabled = false;
        if (listeningIndicator) listeningIndicator.remove();
    }

    searchInput.value = "";
    searchInput.style.display = "none";
    document.getElementById('statusFilterGroup').style.display = "none";
    document.getElementById('matchModeGroup').style.display = "none";
    clearSearchBtn.style.display = "none";
    cancelBtn.style.display = "none";
    matchCount.style.display = "none";
    voiceSearchBtn.style.display = "none";

    searchBtn.style.display = "inline-block";
    displayTasks();
    updateTaskCount();
}


const voiceSearchBtn = document.getElementById('voiceSearchBtn');
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = currentLang === 'en' ? 'en-US' : 'ar-SA'; // ✅ اللغة حسب اللغة الحالية
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
        voiceSearchBtn.textContent = '🎙️ ' + t('listening');
        voiceSearchBtn.disabled = true;

        listeningIndicator = document.createElement('span');
        listeningIndicator.textContent = t('listening'); // ✅ ترجمة
        listeningIndicator.style.marginRight = '10px';
        listeningIndicator.style.color = '#1565c0';
        listeningIndicator.style.fontWeight = 'bold';
        voiceSearchBtn.parentNode.insertBefore(listeningIndicator, voiceSearchBtn);
    };

    recognition.onresult = e => {
        const transcript = e.results[0][0].transcript.trim();
        if (transcript) {
            searchInput.value = transcript;
            searchInput.dispatchEvent(new Event('input'));
        }
    };

    recognition.onerror = e => {
        alert(t('voiceRecognitionError')); // ✅ ترجمة رسالة الخطأ
        console.error('Voice recognition error:', e.error);
    };

    recognition.onend = () => {
        voiceSearchBtn.textContent = t('voiceSearchBtnText') || '🎤'; // ✅ ترجمة الزر
        voiceSearchBtn.disabled = false;
        if (listeningIndicator) listeningIndicator.remove();
    };

    voiceSearchBtn.onclick = () => recognition.start();
} else {
    voiceSearchBtn.style.display = 'none';
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
        ${isRTL ?
          `<button class="confirm-no">${t("no")}</button>
           <button class="confirm-yes">${t("yes")}</button>` :
          `<button class="confirm-yes">${t("yes")}</button>
           <button class="confirm-no">${t("no")}</button>`}
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
    // استدعاء setLanguage وإرجاع عدد المهام
    const savedLang = localStorage.getItem("selectedLanguage") || "ar";
    const count = setLanguage(savedLang, tasks, displayTasks);

    // تحديث عدد نتائج البحث (عدد المهام) فوراً
    updateMatchCount(count);

    // إعداد الثيم حسب التخزين المحلي
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.documentElement.classList.add("dark-theme");
        themeToggleBtn.textContent = "🌞";
    } else {
        themeToggleBtn.textContent = "🌙";
    }

    // تحديث عدد المهام (العداد العام) وعرض المهام
    updateTaskCount(tasks);
    displayTasks(tasks);

    // === ✅ دالة تحديث لغة التعرف الصوتي
    if ('webkitSpeechRecognition' in window) {
        const updateVoiceRecognitionLanguage = (langCode) => {
            const voiceRecognition = window.voiceRecognitionInstance;
            if (!voiceRecognition) return;
            voiceRecognition.lang = langCode === "ar" ? "ar-SA" : "en-US";
        };

        // حفظ مرجع التعرف الصوتي في window لكي نستطيع تعديله
        if (!window.voiceRecognitionInstance) {
            window.voiceRecognitionInstance = new webkitSpeechRecognition();
            window.voiceRecognitionInstance.continuous = false;
            window.voiceRecognitionInstance.interimResults = false;
        }

        // ✅ ضبط اللغة المبدئية عند تحميل الصفحة
        updateVoiceRecognitionLanguage(savedLang);
    }

    // إعداد عنصر اختيار اللغة
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = savedLang;

        languageSelect.addEventListener('change', e => {
            const newLang = e.target.value;

            // ✅ تحديث اتجاه الصفحة واللغة
            document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
            document.documentElement.lang = newLang;

            // ✅ حفظ اللغة في التخزين المحلي
            localStorage.setItem("selectedLanguage", newLang);

            // ✅ تعيين اللغة وتشغيل التحديثات
            const newCount = setLanguage(newLang, tasks, displayTasks);
            updateMatchCount(newCount);
            updateTaskCount(tasks);

            // ✅ تحديث لغة التعرف الصوتي مباشرةً
            if (window.voiceRecognitionInstance) {
                window.voiceRecognitionInstance.lang = newLang === "ar" ? "ar-SA" : "en-US";
            }
        });
    }
});




// === تبديل الثيم ===
export function toggleTheme(themeToggleBtn) {
    if (!themeToggleBtn) {
        themeToggleBtn = document.getElementById("themeToggle");
        if (!themeToggleBtn) {
            console.warn("زر تبديل الثيم غير موجود!");
            return;
        }
    }

    const isDark = document.documentElement.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggleBtn.textContent = isDark ? "🌞" : "🌙";
}

// ربط الزر مع الحدث (بعد تحميل الصفحة أو في السكريبت)
if (themeToggleBtn) {
    themeToggleBtn.onclick = () => toggleTheme(themeToggleBtn);
}



// === ربط الأحداث ===
addBtn.onclick = addTask;
searchBtn.onclick = searchTasks;
cancelBtn.onclick = cancelSearch;
clearAllBtn.onclick = clearAllTasks;

// === تهيئة أولية ===
updateTaskCount();
displayTasks();

// === اختصارات لوحة المفاتيح العامة للتحكم السريع ===
document.addEventListener("keydown", e => {
    // إضافة مهمة
    if (e.ctrlKey && e.code === "Enter") {
        addTask();
    }

    // البحث
    else if (e.ctrlKey && e.code === "KeyS") {
        e.preventDefault();
        searchTasks();
    }

    // تبديل الثيم
    else if (e.ctrlKey && e.code === "KeyD") {
        e.preventDefault();
        themeToggleBtn.click();
    }

    // حذف الكل
    else if (e.ctrlKey && e.code === "KeyX") {
        e.preventDefault();
        clearAllTasks();
    }

    // التحكم الصوتي
    else if (e.ctrlKey && e.code === "KeyV") {
        e.preventDefault();
        const voiceControlBtn = document.getElementById("voiceControlBtn");
        if (voiceControlBtn) voiceControlBtn.click();
    }

    // ✅ عرض المهام المكتملة فقط
    else if (e.ctrlKey && e.code === "Digit1") {
        e.preventDefault();
        const completedTasks = tasks.filter(t => t.completed);
        displayTasks(completedTasks);
        showSuccessMessage("✅ عرض المهام المكتملة فقط", "#4caf50");
    }

    // ⏳ عرض المهام غير المكتملة فقط
    else if (e.ctrlKey && e.code === "Digit2") {
        e.preventDefault();
        const pendingTasks = tasks.filter(t => !t.completed);
        displayTasks(pendingTasks);
        showSuccessMessage("⏳ عرض المهام غير المكتملة فقط", "#ffc107");
    }

    // 📋 عرض كل المهام
    else if (e.ctrlKey && e.code === "Digit0") {
        e.preventDefault();
        displayTasks();
        showSuccessMessage("📋 عرض جميع المهام", "#2196f3");
    }

    // إلغاء البحث والتعديل
    else if (e.code === "Escape") {
        cancelSearch();
        const cancelEditBtn = document.querySelector(".edit-container button:nth-child(5)");
        if (cancelEditBtn) cancelEditBtn.click();
    }
});