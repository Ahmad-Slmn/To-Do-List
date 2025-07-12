const translations = {
    ar: {
        // رسائل الخطأ
        errorSearchMinTasks: "لا يمكن البحث، يجب وجود 3 مهام على الأقل!",
        errorPastDeadline: "⚠️ لا يمكن تعيين موعد نهائي في الماضي",
        errorEditMinChars: "خطأ: المهمة يجب أن تحتوي على 3 أحرف على الأقل.",
        errorEditDuplicate: "هذه المهمة موجودة مسبقاً.",
        errorEditPastDeadline: "خطأ: لا يمكن تعيين موعد نهائي في الماضي.",
        errorNoChange: "لم تقم بتغيير المهمة.",
        errorEmptyTask: "⚠️ لا يمكن ترك المهمة فارغة أو تحتوي على رموز فقط.",
        errorMinChars: "⚠️ المهمة قصيرة جدًا، يجب أن تكون 3 أحرف على الأقل.",
        errorTooLong: "⚠️ المهمة طويلة جدًا، الحد الأقصى 200 حرف.",
        errorDuplicateTask: "⚠️ هذه المهمة موجودة بالفعل.",
        errorHTMLNotAllowed: "⚠️ لا يُسمح بإدخال HTML أو أكواد.",
        taskAdded: "✅ تم إضافة المهمة بنجاح.",

        // رسائل التأكيد
        confirmDesc: "هل أنت متأكد من القيام بهذا الإجراء؟",
        deleteAllConfirm: "هل أنت متأكد أنك تريد حذف جميع المهام؟",
        deleteTaskConfirm: "هل تريد حذف هذه المهمة؟",
        yes: "نعم",
        no: "لا",

        // النصوص العامة
        taskListTitle: "قائمة المهام", // h1
        tasksCountLabel: "عدد المهام الحالية",
        matchCountLabel: "عدد النتائج",
        emptyTaskList: "قائمة المهام فارغة",
        completionRateLabel: "نسبة الإنجاز",
        addTaskPlaceholder: "أضف مهمة جديدة",
        "labelTaskInput": "📝 عنوان المهمة",
        "labelDeadlineInput": "📅 الموعد النهائي للمهمة",
        "labelPriorityInput": "⚡ درجة أولوية المهمة	",


        // الأولوية
        priorityHigh: "⛔ عالية جدًا (عاجلة)",
        priorityMedium: "⚠️ متوسطة (هامة)",
        priorityLow: "✅ منخفضة (يمكن تأجيلها)",

        // الموعد النهائي
        deadlineTitle: "اختر الموعد النهائي",

        // التحكم الصوتي
        "voiceControlBtnText": "🎧 تشغيل التحكم الصوتي",
        voiceSearchBtnText: "🎤 البحث الصوتي",
        voiceRecognitionError: "حدث خطأ أثناء التعرف على الصوت. الرجاء المحاولة مجددًا.",
        listening: "⏳ جاري الاستماع...",
        stopListening: "🛑 تم إيقاف الاستماع",
        noActiveListening: "🎤 لا يوجد استماع نشط حاليًا",
        unknownCommand: "🤔 لم أفهم الأمر. مثال: \"أضف مهمة الدراسة غدًا الساعة 5 مساءً\"",
        errorUnknownCommand: "أمر غير معروف",
        listeningMessage: "🎙️ جاري الاستماع... مثال: أضف مهمة الدراسة غدًا الساعة 5 مساءً",
        "languageChanged": "تم تغيير اللغة إلى {{newLang}}",
        "arabic": "العربية",
        "english": "الإنجليزية",
        "voiceErrorNoSpeech": "لم يتم الكشف عن أي كلام، يرجى المحاولة مجددًا.",
        "voiceErrorAudioCapture": "لا يمكن الوصول إلى الميكروفون، تأكد من السماح للتطبيق باستخدامه.",
        "voiceErrorNotAllowed": "تم رفض الإذن لاستخدام الميكروفون. يرجى السماح به في إعدادات الجهاز.",
        "voiceErrorNetwork": "مشكلة في الاتصال بالشبكة. يرجى التحقق من الاتصال بالإنترنت.",
        "voiceErrorLanguageNotSupported": "اللغة غير مدعومة من قبل خدمة التعرف على الصوت.",
        "voiceErrorSpeechUnavailable": "خدمة التعرف على الصوت غير متوفرة حاليًا.",
        "voiceErrorUnknown": "حدث خطأ غير معروف أثناء معالجة الأمر الصوتي.",

        // الأزرار
        addBtnText: "➕ إضافة المهمة	",
        editBtnText: "تعديل",
        deleteBtnText: "حذف",
        cancelEditText: "إلغاء التعديل",
        saveEditText: "حفظ التعديل",
        clearAllBtnText: "🗑️ حذف جميع المهام",
        searchPlaceholder: "🔍 ابحث عن مهمة",
        searchBtnText: "🔎 البحث في قائمة المهام",
        cancelBtnText: "❌ إلغاء البحث",
        statusFilterLabel: "📋 حالة المهمة",
        statusAll: "كل الحالات",
        statusCompleted: "المكتملة",
        statusPending: "غير المكتملة",
        langSwitchBtn: "العربية",
        sortDefault: "الترتيب الافتراضي",
        sortComplete: "المهام المكتملة",
        sortIncomplete: "المهام غير المكتملة",
        sortNewest: "المهام الأحدث",
        sortOldest: "المهام الأقدم",
        sortPriority: "حسب الأولوية (من العالي إلى المنخفض)",

        // خيارات البحث
        matchModeLabel: "🧮 نمط البحث",
        matchModeOr: "أي كلمة",
        matchModeAnd: "كل الكلمات",

        // رسائل البحث
        noTasksFound: "لا توجد مهام",
        noSearchResults: "لا يوجد مهام تتطابق مع البحث",
        searchOpened: "🔍 تم فتح البحث بنجاح",
        searchAlreadyOpen: "ℹ️ البحث مفتوح بالفعل، يمكنك كتابة ما تريد البحث عنه",
        searchCancelled: "🛑 تم إلغاء البحث",
        noSearchToCancel: "ℹ️ لا يوجد بحث لتتم إزالته",

        // الرسائل التحفيزية
        noDeadlineSet: [
  "📝 لم يتم تعيين موعد نهائي بعد، يمكنك تعيين واحد الآن!",
  "⏰ لا تنسى ضبط موعد لإنجاز المهمة في الوقت المناسب.",
  "⚡ تنظيم الوقت يساعدك على الإنجاز بشكل أفضل!",
  "📅 أضف موعدًا نهائيًا لتبقى على المسار الصحيح.",
  "🔔 تذكير: تعيين موعد نهائي يحفزك على الإنجاز."
],

        motivationalUrgent: [
    "🚀 أسرع، الوقت ينفد!",
    "🔥 لا تستسلم الآن، أنجز المهمة قبل انتهاء الوقت!",
    "⏳ كل دقيقة مهمة، ركز واستمر!"
  ],
        motivationalSoon: [
    "👍 اقترب موعد المهمة!",
    "💪 استمر بالعمل الجيد، النجاح في انتظارك!",
    "🌟 خطوة واحدة فقط نحو إنجاز المهمة!"
  ],
        motivationalPlenty: [
    "😊 لديك وقت كافٍ، خطط بهدوء وابدأ الآن!",
    "🎯 تذكر: التنظيم هو مفتاح النجاح!",
    "🚀 استغل الوقت بحكمة، وستحقق أهدافك!"
  ],

        secondSingular: "ثانية",
        secondPlural: "ثوانٍ",
        // رسائل حالة المهام
        taskEdited: "!تم تعديل المهمة بنجاح",
        "taskDeleted": "تم حذف مهمة \"{taskName}\" بنجاح",
        taskAlreadyCompleted: "✅ المهمة رقم {{index}} مكتملة بالفعل",
        taskMarkedComplete: "✔️ تم تعليم المهمة رقم {{index}} كمكتملة",
        taskAlreadyCompletedByName: "✅ المهمة \"{{name}}\" مكتملة بالفعل",
        taskMarkedCompleteByName: "✔️ تم تعليم المهمة \"{{name}}\" كمكتملة",

        // رسائل قائمة المهام
        taskCount: "📋 لديك {{count}} مهمة حالية",
        noTasksToShow: "📭 لا توجد مهام لعرضها حاليًا",
        "taskCompleted": "تم إنهاء المهمة",
        "taskUncompleted": "تم إلغاء إنهاء المهمة",


        // أخطاء التحكم الصوتي
        "voice-errorMinChars": "❗ المهمة يجب أن تكون 3 أحرف على الأقل",
        taskAlreadyExists: "⚠️ المهمة \"{{taskText}}\" موجودة بالفعل، جرب إضافة شيء مختلف",
        taskNotFound: "📛 رقم المهمة غير موجود",
        taskDuplicateError: "⚠️ المهمة الجديدة مطابقة لمهمة موجودة بالفعل، لا يمكن التكرار",
        "voice-taskEdited": "✏️ تم تعديل \"{{oldTask}}\" إلى \"{{newText}}\"",
        taskByNameNotFound: "📛 لا توجد مهمة باسم \"{{name}}\"",
        "voice-taskDeleted": "تم حذف المهمة رقم {index} بنجاح",
        taskNotFoundByNumber: "📛 لا توجد مهمة برقم {{index}}",
        taskDeletedByName: " تم حذف مهمة \"{{name}}\" بنجاح",
        taskNotFoundByName: "📛 لا توجد مهمة باسم \"{{name}}\"",

        // تخصيص الوضع المظلم والفاتح
        darkTheme: "الليلي",
        lightTheme: "الفاتح",
        themeSwitched: "🌗 تم تبديل الوضع من {{currentTheme}} إلى {{newTheme}}",

        // عداد التنازل
        countdown: {
            expired: "❗ انتهى وقت هذه المهمة. يُفضل مراجعتها أو تعديلها.",
            remaining: "⏳ تبقى"
        },

        // وحدة الوقت
        daySingular: "يوم",
        dayPlural: "أيام",
        hourSingular: "ساعة",
        hourPlural: "ساعات",
        minuteSingular: "دقيقة",
        minutePlural: "دقائق",
        remainingTime: "⏳ الوقت المتبقي",
        taskTimeExpired: "❗ انتهى وقت المهمة. الرجاء المراجعة أو التعديل.",


        // الرسائل عند عدم وجود مهام
        cannotEditCompletedTask: "لا يمكن تعديل مهمة تم تنفيذها",
        noTasksMessage: "لا توجد مهام حتى الآن.",
        noCompletedTasksMessage: "لا توجد مهام مكتملة حتى الآن.",
        noIncompleteTasksMessage: "كل المهام مكتملة! 🎉",
        noNewestTasksMessage: "لا توجد مهام حديثة لعرضها.",
        noOldestTasksMessage: "لا توجد مهام قديمة لعرضها.",
        noPriorityTasksMessage: "لا توجد مهام مصنّفة بالأولوية.",
        allSamePriorityMessage: "كل المهام لها نفس الأولوية، لم يتم تغيير الترتيب.",
        sortChangedMessage: 'تم تغيير الفرز من "{from}" إلى "{to}"',
        sortLabels: {
            default: "الترتيب الافتراضي",
            complete: "المهام المكتملة",
            incompleteOnly: "المهام غير المكتملة",
            newest: "المهام الأحدث",
            oldest: "المهام الأقدم",
            priority: "حسب الأولوية",
        }


    },



    en: {
        // --- Error Messages ---
        errorSearchMinTasks: "Cannot search, at least 3 tasks are required!",
        errorEditMinChars: "Error: Task must be at least 3 characters.",
        errorEditDuplicate: "This task already exists.",
        errorEditPastDeadline: "Error: Cannot set deadline in the past.",
        errorNoChange: "You did not change the task.",
        "errorEmptyTask": "⚠️ Task cannot be empty or contain only symbols.",
        "errorMinChars": "⚠️ Task is too short, minimum 3 characters required.",
        "errorTooLong": "⚠️ Task is too long, maximum allowed is 200 characters.",
        "errorDuplicateTask": "⚠️ This task already exists.",
        "errorPastDeadline": "⚠️ You can't select a date in the past.",
        "errorHTMLNotAllowed": "⚠️ HTML or code is not allowed in the task.",
        "taskAdded": "✅ Task added successfully.",

        // --- Confirmation Messages ---
        confirmDesc: "Are you sure you want to perform this action?",
        deleteAllConfirm: "Are you sure you want to delete all tasks?",
        deleteTaskConfirm: "Do you want to delete this task?",
        yes: "Yes",
        no: "No",

        // --- General Texts ---
        taskListTitle: "To Do List", // h1
        tasksCountLabel: "Current Task Count",
        matchCountLabel: "Results count",
        emptyTaskList: "Task list is empty",
        completionRateLabel: "Completion Rate",
        addTaskPlaceholder: "Add a new task",
        "labelTaskInput": "📝 Task Title",
        "labelDeadlineInput": "📅 Task Deadline",
        "labelPriorityInput": "⚡ Task Priority Level",

        // --- Task Priority ---
        "priorityHigh": "⛔ Very High (Urgent)",
        "priorityMedium": "⚠️ Medium (Important)",
        "priorityLow": "✅ Low (Can Be Delayed)",

        // --- Buttons Text ---
        addBtnText: "➕ Add Task",
        editBtnText: "Edit",
        deleteBtnText: "Delete",
        cancelEditText: "Cancel edit",
        saveEditText: "Save edit",
        clearAllBtnText: "🗑️ Delete All Tasks",
        searchBtnText: "🔎 Search Task List",
        cancelBtnText: "❌ Cancel Search",
        voiceSearchBtnText: "🎤 Voice Search",
        langSwitchBtn: "English",
        sortDefault: "Default Order",
        sortComplete: "Completed Tasks",
        sortIncomplete: "Incomplete Tasks",
        sortNewest: "Newest Tasks",
        sortOldest: "Oldest Tasks",
        sortPriority: "By Priority (High to Low)",

        // --- Task Status ---
        statusFilterLabel: "📋 Task Status",
        statusAll: "All statuses",
        statusCompleted: "Completed",
        statusPending: "Pending",

        // --- Search Modes ---
        matchModeLabel: "🧮 Match Mode",
        matchModeOr: "Any word",
        matchModeAnd: "All words",

        // --- Search Results ---
        noTasksFound: "No tasks",
        noSearchResults: "No tasks match the search",

        // --- Task Status Updates ---
        taskEdited: "Task edited successfully!",
        "taskDeleted": "Task \"{taskName}\" deleted successfully",
        taskAlreadyCompleted: "✅ Task number {{index}} is already completed",
        taskMarkedComplete: "✔️ Task number {{index}} was marked as completed",
        taskAlreadyCompletedByName: "✅ The task \"{{name}}\" is already completed",
        taskMarkedCompleteByName: "✔️ The task \"{{name}}\" was marked as completed",
        "taskCompleted": "Task marked as complete",
        "taskUncompleted": "Task marked as incomplete",


        // --- Task Actions ---
        taskCount: "📋 You have {{count}} current tasks",
        noTasksToShow: "📭 There are no tasks to display currently",

        // --- Voice Control Messages ---
        "voiceControlBtnText": "🎧 Enable Voice Control",
        listening: "⏳ Listening...",
        voiceRecognitionError: "Voice recognition error, please try again.",
        stopListening: "🛑 Listening was stopped",
        noActiveListening: "🎤 There is no active listening currently",
        unknownCommand: "🤔 I didn't understand the command. Example: \"Add the study task tomorrow at 5 PM\"",
        errorUnknownCommand: "Unknown command",
        listeningMessage: "🎙️ Listening... Example: Add task: study tomorrow at 5 PM",
        voiceError: "❗ Error occurred during voice recognition",
        "languageChanged": "Language changed to {{newLang}}",
        "arabic": "Arabic",
        "english": "English",
        "voiceErrorNoSpeech": "No speech detected, please try again.",
        "voiceErrorAudioCapture": "Unable to access the microphone, make sure the app has permission to use it.",
        "voiceErrorNotAllowed": "Permission to use the microphone was denied. Please enable it in the device settings.",
        "voiceErrorNetwork": "Network issue. Please check your internet connection.",
        "voiceErrorLanguageNotSupported": "The language is not supported by the speech recognition service.",
        "voiceErrorSpeechUnavailable": "Speech recognition service is currently unavailable.",
        "voiceErrorUnknown": "An unknown error occurred while processing the voice command.",




        // --- Task Deletion Messages ---
        taskNotFound: "📛 Task number not found",
        taskDuplicateError: "⚠️ The new task matches an existing task, duplicates are not allowed",
        "voice-taskEdited": "✏️ Task \"{{oldTask}}\" was changed to \"{{newText}}\"",
        taskByNameNotFound: "📛 No task found with the name \"{{name}}\"",
        "voice-taskDeleted": "Task number {{index}} was deleted",
        taskNotFoundByNumber: "📛 No task found with number {{index}}",
        taskDeletedByName: "🗑️ Task \"{{name}}\" was deleted",
        taskNotFoundByName: "📛 No task found with the name \"{{name}}\"",

        // --- Theme Switching ---
        darkTheme: "Dark Mode",
        lightTheme: "Light Mode",
        themeSwitched: "🌗 The theme switched from {{currentTheme}} to {{newTheme}}",

        // --- Countdown & Time ---
        remainingTime: "⏳ Remaining",
        daySingular: "day",
        dayPlural: "days",
        hourSingular: "hour",
        hourPlural: "hours",
        minuteSingular: "minute",
        minutePlural: "minutes",
        taskTimeExpired: "❗ Task time expired. Please review or edit.",

        // --- Search Messages ---
        searchOpened: "🔍 Search was opened successfully",
        searchAlreadyOpen: "ℹ️ The search is already open, you can type what you want to search for",
        searchCancelled: "🛑 Search was cancelled",
        noSearchToCancel: "ℹ️ There is no search to cancel",
        secondSingular: "second",
        secondPlural: "seconds",

        // --- Motivational Messages ---
        noDeadlineSet: [
 "📝 No deadline set yet, you can set one now!",
    "⏰ Don't forget to set a deadline to complete the task on time.",
    "⚡ Time management helps you achieve better!",
    "📅 Add a deadline to stay on track.",
    "🔔 Reminder: Setting a deadline motivates you to get things done."
],
        motivationalUrgent: [
    "🚀 Hurry, time is running out!",
    "🔥 Don't give up now, finish the task before time runs out!",
    "⏳ Every minute counts, focus and keep going!"
  ],
        motivationalSoon: [
    "👍 Deadline is approaching!",
    "💪 Keep up the good work, success awaits!",
    "🌟 Just one step to complete the task!"
  ],
        motivationalPlenty: [
    "😊 You have plenty of time, plan calmly and start now!",
    "🎯 Remember: organization is key to success!",
    "🚀 Use time wisely, and you'll achieve your goals!"
  ],
        // Messages when there are no tasks
        cannotEditCompletedTask: "You cannot edit a completed task",
        noTasksMessage: "There are no tasks yet.",
        noCompletedTasksMessage: "No completed tasks yet.",
        noIncompleteTasksMessage: "All tasks are completed! 🎉",
        noNewestTasksMessage: "No recent tasks to display.",
        noOldestTasksMessage: "No older tasks to display.",
        noPriorityTasksMessage: "No tasks categorized by priority.",
        allSamePriorityMessage: "All tasks have the same priority, so the order was not changed.",

        sortChangedMessage: 'View mode changed from "{from}" to "{to}"',
        sortLabels: {
            default: "Default Order",
            complete: "Completed Tasks",
            incompleteOnly: "Incomplete Tasks",
            newest: "Newest Tasks",
            oldest: "Oldest Tasks",
            priority: "By Priority",
        }
    }

};
// اللغة الحالية
export let currentLang = 'ar';

// دالة ترجمة النصوص
// دالة ترجمة النصوص مع دعم المفاتيح المتعددة (key1.key2...) ودعم المتغيرات (vars)
export function t(key, vars = {}) {
    const keys = key.split('.');
    let obj = translations[currentLang];
    for (const k of keys) {
        obj = obj?. [k];
        if (obj === undefined) return key;
    }

    let text = obj;

    // استبدال المتغيرات داخل النص إن وجدت، مثلاً {{varName}}
    for (const varKey in vars) {
        text = text.replace(new RegExp(`{{${varKey}}}`, 'g'), vars[varKey]);
    }

    return text;
}

// ترجمة مفتاح الفرز إلى نص العرض أو إرجاع المفتاح إذا لم توجد ترجمة.
export const getSortLabel = (sortKey) => {
    return t(`sortLabels.${sortKey}`) || sortKey;
};


// دالة لتعيين اللغة وتحديث النصوص في الصفحة
export function setLanguage(lang, tasks = [], displayFn = () => {}) {
    if (!translations[lang]) return;

    currentLang = lang;
    localStorage.setItem("selectedLanguage", lang);

    document.documentElement.lang = lang;
    document.title = translations[lang].taskListTitle;

    // ✅ العناصر العامة
    document.getElementById('title-main').textContent = t('mainTitle');
    document.getElementById('taskCountLabel').textContent = t('tasksCountLabel');
    document.getElementById('searchBtn').textContent = t('searchBtnText');
    document.getElementById('cancelBtn').textContent = t('cancelSearchBtnText');
    document.getElementById('voiceSearchBtn').textContent = t('voiceSearchBtnText');
    document.getElementById('clearAllBtn').textContent = t('clearAllBtnText');
    document.getElementById('labelStatusFilter').textContent = t('statusFilterLabel');
    document.getElementById('labelMatchMode').textContent = t('matchModeLabel');
    document.getElementById("labelTaskInput").textContent = t("labelTaskInput");
    document.getElementById("labelDeadlineInput").textContent = t("labelDeadlineInput");
    document.getElementById("labelPriorityInput").textContent = t("labelPriorityInput");



    document.querySelector("header h1").textContent = t("taskListTitle");

    // ✅ تحديث نص عدد المهام
    document.querySelector(".Count > span:last-of-type").textContent =
        tasks.length ? t("tasksCountLabel") : t("emptyTaskList");

    // ✅ الإدخالات
    taskInput.placeholder = t("addTaskPlaceholder");

    // ✅ تحديد الأولوية
    const priorityOptions = priorityInput.querySelectorAll("option");
    priorityOptions[0].textContent = t("priorityHigh");
    priorityOptions[1].textContent = t("priorityMedium");
    priorityOptions[2].textContent = t("priorityLow");

    // تعيين خيارات القائمة
    const sortSelect = document.getElementById("sortTasksSelect");
    // استعادة الاختيار المحفوظ
    const savedSortOrder = localStorage.getItem("taskSortOrder") || "default";

    sortSelect.innerHTML = `
    <option value="default">${t("sortDefault")}</option>
  <option value="complete">${t("sortComplete")}</option>
  <option value="incompleteOnly">${t("sortIncomplete")}</option>
  <option value="newest">${t("sortNewest")}</option>
  <option value="oldest">${t("sortOldest")}</option>
  <option value="priority">${t("sortPriority")}</option>
`;
    sortSelect.value = savedSortOrder;

    // ✅ الموعد النهائي
    deadlineInput.title = t("deadlineTitle");

    // ✅ التحكم الصوتي
    const voiceControlBtn = document.getElementById("voiceControlBtn");
    voiceControlBtn.title = t("voiceControlTitle");
    voiceControlBtn.textContent = t("voiceControlBtnText") || "🎧 " + t("voiceControlTitle");

    // ✅ الأزرار
    addBtn.textContent = t("addBtnText");
    searchInput.placeholder = t("searchPlaceholder");
    searchBtn.textContent = t("searchBtnText");
    cancelBtn.textContent = t("cancelBtnText");
    voiceSearchBtn.textContent = t("voiceSearchBtnText");

    // ✅ الفلاتر
    document.querySelector('label[for="statusFilter"]').textContent = t("statusFilterLabel");
    statusFilter.options[0].textContent = t("statusAll");
    statusFilter.options[1].textContent = t("statusCompleted");
    statusFilter.options[2].textContent = t("statusPending");

    document.querySelector('label[for="matchMode"]').textContent = t("matchModeLabel");
    matchMode.options[0].textContent = t("matchModeOr");
    matchMode.options[1].textContent = t("matchModeAnd");

    // ✅ زر حذف الكل
    clearAllBtn.textContent = lang === "ar" ? "🗑️ حذف جميع المهام" : "🗑️ Delete All Tasks";


    // ✅ تحديث العداد
    updateTaskCount(tasks);

    // ✅ عرض المهام حسب الدالة المرسلة
    displayFn(tasks);
    // ✅ إعادة تعيين لغة التعرف الصوتي (إن وجدت)
    if (typeof recognition !== 'undefined') {
        recognition.lang = lang === 'en' ? 'en-US' : 'ar-SA';
    }
}


// دالة تحديث عدد المهام ونسبة الإنجاز
export function updateTaskCount(tasks = []) {
    const taskCount = document.getElementById("taskCount");
    const completionRate = document.getElementById("completionRate");

    if (!tasks.length) {
        taskCount.innerText = "";
        completionRate.innerText = "";
        document.querySelector(".Count > span:last-of-type").innerText = t("emptyTaskList");
        return;
    }

    taskCount.innerText = tasks.length;
    document.querySelector(".Count > span:last-of-type").innerText = t("tasksCountLabel");

    const completedCount = tasks.filter(t => t.completed).length;
    const percent = ((completedCount / tasks.length) * 100).toFixed(0);
    completionRate.innerText = `${t("completionRateLabel")}: ${percent}% (${completedCount} / ${tasks.length})`;
}