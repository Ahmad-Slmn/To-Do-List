import { tasks, setTasks, showSuccessMessage, saveTasks, displayTasks, updateTaskCount, addTask, clearAllTasks, toggleTheme, searchTasks, cancelSearch  } from './main.js';
import { t } from './translations.js';

if ('webkitSpeechRecognition' in window) {
  
const voiceRecognition = new webkitSpeechRecognition();

// ✅ ضبط اللغة تلقائيًا حسب لغة الصفحة (عربي أو إنجليزي)
const pageLang = document.documentElement.lang || 'en';
voiceRecognition.lang = pageLang === 'ar' ? 'ar-SA' : 'en-US';

voiceRecognition.interimResults = false;
voiceRecognition.continuous = false;

let voiceActive = false;

// 🔧 دالة تطبيع النصوص (تفيد في مقارنة الأوامر والأسماء)
const normalizeText = (text) => {
  return text
    .normalize("NFD")
    .replace(/[\u064B-\u0652]/g, "")     // إزالة التشكيل
    .replace(/[أإآ]/g, "ا")              // توحيد الألف
    .replace(/ة/g, "ه")                 // توحيد التاء المربوطة
    .replace(/\s+/g, " ")               // إزالة المسافات الزائدة
    .trim()
    .toLowerCase();
};

  
const detectLanguage = (text) => {
  const cleaned = text.replace(/[\u200E\u200F\u202A-\u202E]/g, "");
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(cleaned) ? "ar" : "en";
};



// تحويل الكلمات العربية للأرقام
const arabicWordToNumber = (word) => {
  word = word.replace(/يه$/, "ية").replace(/ه$/, "ة").trim();
  const map = {
    "واحد": 1, "واحدة": 1,
    "اثنين": 2, "اثنتين": 2, "اثنا": 2,
    "ثلاثة": 3, "ثلاث": 3,
    "أربعة": 4, "اربعة": 4, "أربع": 4, "اربع": 4,
    "خمسة": 5, "خمس": 5,
    "ستة": 6, "ست": 6,
    "سبعة": 7, "سبع": 7,
    "ثمانية": 8, "ثمان": 8,
    "تسعة": 9, "تسع": 9,
    "عشرة": 10, "عشر": 10,
    "أحد عشر": 11, "احد عشر": 11, "احدعشر": 11,
    "اثنا عشر": 12, "اثني عشر": 12, "اثنعشر": 12,
    "ثلاثة عشر": 13, "ثلاث عشر": 13,
    "أربعة عشر": 14, "اربعة عشر": 14,
    "خمسة عشر": 15, "خمس عشر": 15,
    "ستة عشر": 16, "ست عشر": 16,
    "سبعة عشر": 17, "سبع عشر": 17,
    "ثمانية عشر": 18, "ثماني عشر": 18,
    "تسعة عشر": 19, "تسع عشر": 19,
    "عشرون": 20, "عشرين": 20,
  };
  return map[word] || null;
};

// تحويل الكلمات الإنجليزية للأرقام
const englishWordToNumber = (word) => {
  const map = {
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10,
    "eleven": 11,
    "twelve": 12,
    "thirteen": 13,
    "fourteen": 14,
    "fifteen": 15,
    "sixteen": 16,
    "seventeen": 17,
    "eighteen": 18,
    "nineteen": 19,
    "twenty": 20
  };
  return map[word.toLowerCase()] || null;
};

// ✅ النسخة النهائية لدالة parseNumber
const parseNumber = (str) => {
  let num = parseInt(str, 10);
  if (!isNaN(num)) return num;

  num = arabicWordToNumber(str);
  if (num !== null) return num;

  num = englishWordToNumber(str);
  return num;
};


  // دالة تقسيم الأوامر المركبة إلى أوامر منفصلة
  const splitCommands = (text) => {
    const separators = [" ثم ", " وبعدها ", " و ", " وبعد "];
    let commands = [text];
    separators.forEach(sep => {
      commands = commands.flatMap(cmd => cmd.split(sep));
    });
    commands = commands.map(cmd => cmd.trim()).filter(cmd => cmd.length > 0);
    return commands;
  };

  // دالة تطبيع وتحليل الأمر الصوتي
const normalizeArabicCommand = (command) => {
  command = command
    .normalize("NFD")
    .replace(/[\u064B-\u0652]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ")
    .trim();

  // حذف مهمة
  const deleteRegex = /^(احذف|احزف|حذف|امسح|شطب|شيل|الغِ|الغاء) (مهمه|المهمه)?(?: رقم)? (.+)/;
  const deleteMatch = command.match(deleteRegex);
  if (deleteMatch) {
    const target = deleteMatch[3].trim();
    const indexNum = parseNumber(target);
    return indexNum !== null ? { action: "delete", index: indexNum - 1 } : { action: "deleteByName", name: target };
  }

  // تعديل مهمة
  const editRegex = /^(عدل|تعديل|غير|غيري|حدث|حدثي|استبدل|بدل) (مهمه|المهمه)?(?: رقم)? (.+?) (الى|ب| نصها |ليكون |ليصير )?(.+)/;
  const editMatch = command.match(editRegex);
  if (editMatch) {
    const target = editMatch[3].trim();
    const newText = editMatch[5] ? editMatch[5].trim() : "";
    const indexNum = parseNumber(target);
    return indexNum !== null  ? { action: "edit", index: indexNum - 1, newText } : { action: "editByName", name: target, newText };
  }

  // إضافة مهمة
  const addRegex = /^(اضف|أضف|اضيف|سجل|اكتب|أكتب|انشئ|أنشئ|ادخل|خزن|ضف|ضيف|اضافة)( الى القائمة| مهمة| للمهام)? (.+)/;
  const addMatch = command.match(addRegex);
  if (addMatch) {
    return { action: "add", raw: addMatch[3].trim() };
  }

  // تعليم كمكتملة
  const markCompleteRegex = /^(علم|علّم|حدد|اعلم|تمت|انجزت)(مهمه|المهمه)?(?: رقم)? (.+) (كمكتمله|كمكتملة|انهاء|انجزتها)?/;
  const markCompleteMatch = command.match(markCompleteRegex);
  if (markCompleteMatch) {
    const target = markCompleteMatch[3].trim();
    const indexNum = parseNumber(target);
    return indexNum !== null  ? { action: "markComplete", index: indexNum - 1 }  : { action: "markCompleteByName", name: target };
  }

  // عرض المهام
  if (/^(اعرض|ارني|أرني|اظهر|عرض|اظهار|فرجيني|شوف|شوفي)( المهام|قائمة المهام|كل المهام)?$/.test(command)) {
    return { action: "showTasks" };
  }

  // حذف كل المهام
  if (/^(احذف|امسح|شطب|الغاء|ازالة) (الكل|كل المهام|جميع المهام|كلهم|الكلهم)$/.test(command)) {
    return { action: "clearAll" };
  }

  // تبديل الثيم
  if (/^(تبديل|تغيير|غير|قلب|تبدل|تغير) (الثيم|الوضع|المظهر|اللون|الستايل|النمط)$/.test(command)) {
    return { action: "toggleTheme" };
  }

  // إلغاء البحث
  if (/^(الغِ|الغاء|إلغاء|أوقف|قفل|اقفل|اطفئ|اطفي|سكر|اغلق|أغلق) (البحث)?$/.test(command)) {
    return { action: "cancelSearch" };
  }

  // فتح البحث
  if (/^(افتح|ابدأ|شغل|تشغيل|ابدئي|فعلي|ابدا|شغلي) (البحث)?$/.test(command)) {
    return { action: "openSearch" };
  }

  // إيقاف الاستماع
  if (/^(توقف|أوقف|اوقف|اطفي|اقفل|اغلق|اسكت|سكوت|قفل|انهاء|كفاية)( الاستماع| المايك| الميكروفون| الصوت)?$/.test(command)) {
    return { action: "stopListening" };
  }

  // أمر غير معروف
  return { action: "unknown", raw: command };
};

  
const normalizeEnglishCommand = (command) => {
  command = command
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

  // Delete task
  const deleteRegex = /^(delete|remove|del|rm|erase|drop|kill|trash)\s*(task)?\s*(number|no\.?|#)?\s*(.+)/;
  const deleteMatch = command.match(deleteRegex);
  if (deleteMatch) {
    const target = deleteMatch[4].trim();
    const indexNum = parseNumber(target);
    if (indexNum !== null) {
      return { action: "delete", index: indexNum - 1 };
    } else {
      return { action: "deleteByName", name: target };
    }
  }

  // Edit task
  const editRegex = /^(edit|change|update|modify|rename|replace)\s*(task)?\s*(number|no\.?|#)?\s*(.+?)\s*(to|as|with)\s*(.+)/;
  const editMatch = command.match(editRegex);
  if (editMatch) {
    const target = editMatch[4].trim();
    const newText = editMatch[6].trim();
    const indexNum = parseNumber(target);
    if (indexNum !== null) {
      return { action: "edit", index: indexNum - 1, newText };
    } else {
      return { action: "editByName", name: target, newText };
    }
  }

  // Add task
  const addRegex = /^(add|create|new|insert|write( down)?|put|make)\s*(task)?(\s*to\s*(my\s*)?(list|tasks))?\s*(.+)/;
  const addMatch = command.match(addRegex);
  if (addMatch) {
    return { action: "add", raw: addMatch[7].trim() };
  }

  // Mark task complete
  const completeRegex = /^(mark|set|check|done|finish|complete|check off)\s*(task)?\s*(number|no\.?|#)?\s*(.+?)\s*(as)?\s*(completed|done|finished|checked)?/;
  const completeMatch = command.match(completeRegex);
  if (completeMatch) {
    const target = completeMatch[4].trim();
    const indexNum = parseNumber(target);
    if (indexNum !== null) {
      return { action: "markComplete", index: indexNum - 1 };
    } else {
      return { action: "markCompleteByName", name: target };
    }
  }

  // Show tasks
  if (/^(show|list|display|view|see|what are)\s*(all)?\s*(my)?\s*(tasks|todos?|to-?dos?)/.test(command)) {
    return { action: "showTasks" };
  }

  // Clear all tasks
  if (/^(clear|delete|remove|erase|empty|trash|clean)\s*(all)?\s*(tasks|todos?)?$/.test(command)) {
    return { action: "clearAll" };
  }

  // Toggle theme
  if (/^(toggle|switch|change|flip|set|activate)\s*(theme|mode|appearance)?\s*(dark|light)?/.test(command)) {
    return { action: "toggleTheme" };
  }

  // Cancel search
  if (/^(cancel|close|stop|exit|abort|dismiss|hide)\s*(search)?/.test(command)) {
    return { action: "cancelSearch" };
  }

  // Open search
  if (/^(open|start|activate|begin|show|launch|find)\s*(search)?/.test(command)) {
    return { action: "openSearch" };
  }

  // Stop listening
  if (/^(stop|cancel|disable|turn off|shut down|end)\s*(listening|voice|microphone|mic)?/.test(command)) {
    return { action: "stopListening" };
  }

  if (result.action === "unknown") {
  showErrorMessage(t("errorUnknownCommand") + ": " + result.raw);
}

};



  // استخراج الوقت من النص
  const extractTimeFromSpeech = (text) => {
    const now = new Date();
    let deadline = null;
    let dateOffset = 0;

    if (text.includes("غدًا") || text.includes("غدا")) dateOffset = 1;
    else if (text.includes("بعد غد")) dateOffset = 2;

    const baseDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dateOffset);

    const timeMatch = text.match(/الساعة\s+(\d{1,2})(?:[:٫٫،](\d{1,2}))?\s*(صباحا|مساء)?/);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      const meridiem = timeMatch[3];

      if (meridiem === "مساء" && hours < 12) hours += 12;
      if (meridiem === "صباحا" && hours === 12) hours = 0;

      baseDate.setHours(hours, minutes, 0, 0);
      deadline = baseDate.toISOString().slice(0, 16);
    }

    const cleanedText = text
      .replace(/(غدًا|غدا|بعد غد|اليوم)/g, "")
      .replace(/الساعة\s+\d{1,2}(?:[:٫٫،]\d{1,2})?\s*(صباحا|مساء)?/, "")
      .trim();

    return { cleanedText, deadline };
  };

const processVoiceCommand = (result) => {
  switch (result.action) {
    case "add": {
      const extracted = extractTimeFromSpeech(result.raw);
      const taskText = extracted.cleanedText;
      const deadline = extracted.deadline;

      if (taskText.length < 3) {
        showSuccessMessage(t("voice-errorMinChars"), "#f44336");
        return true;
      }

      const exists = tasks.some(task => task.task.trim() === taskText);
      if (exists) {
        showSuccessMessage(t("taskAlreadyExists", { taskText }), "#f44336");
        return true;
      }

      taskInput.value = taskText;
      if (deadline) deadlineInput.value = deadline;
      addTask();
      break;
    }

    case "edit":
      if (!tasks[result.index]) {
        showSuccessMessage(t("taskNotFound"), "#f44336");
        break;
      }
      {
        const exists = tasks.some((task, idx) => idx !== result.index && task.task.trim() === result.newText);
        if (tasks[result.index].task === result.newText) {
          showSuccessMessage(t("taskDuplicateError"), "#f44336");
          return true;
        }

        const oldTask = tasks[result.index].task; // حفظ الاسم القديم
        tasks[result.index].task = result.newText;
        tasks[result.index].date = new Date().toISOString();
        saveTasks();
        displayTasks();
        updateTaskCount();
        showSuccessMessage(t("voice-taskEdited", { oldTask, newText: result.newText }));
      }
      break;

    case "editByName": {
      const name = result.name.toLowerCase();
      const idx = tasks.findIndex(t => normalizeText(t.task) === normalizeText(name));
      if (idx === -1) {
        showSuccessMessage(t("taskByNameNotFound", { name: result.name }), "#f44336");
        break;
      }
      const exists = tasks.some((task, i) => i !== idx && task.task.trim() === result.newText);
      if (exists) {
        showSuccessMessage(t("taskDuplicateError"), "#f44336");
        return true;
      }
      const oldTask = tasks[idx].task; // حفظ الاسم القديم
      tasks[idx].task = result.newText;
      tasks[idx].date = new Date().toISOString();
      saveTasks();
      displayTasks();
      updateTaskCount();
      showSuccessMessage(t("taskEdited", { oldTask, newText: result.newText }));
      break;
    }

    case "delete":
      if (tasks[result.index]) {
        tasks.splice(result.index, 1);
        saveTasks();
        displayTasks();
        updateTaskCount();
        showSuccessMessage(t("voice-taskDeleted", { index: result.index + 1 }));
      } else {
        showSuccessMessage(t("taskNotFoundByNumber", { index: result.index + 1 }), "#f44336");
      }
      break;

    case "deleteByName": {
      const name = result.name.toLowerCase();
      const idx = tasks.findIndex(t => normalizeText(t.task) === normalizeText(name));
      if (idx !== -1) {
        tasks.splice(idx, 1);
        saveTasks();
        displayTasks();
        updateTaskCount();
        showSuccessMessage(t("taskDeletedByName", { name: result.name }));
      } else {
        showSuccessMessage(t("taskNotFoundByName", { name: result.name }), "#f44336");
      }
      break;
    }

    case "clearAll":
      clearAllTasks();
      break;

    case "toggleTheme":
      const isDark = document.body.classList.contains("dark-theme");
      const currentTheme = isDark ? t("darkTheme") : t("lightTheme");
      const newTheme = isDark ? t("lightTheme") : t("darkTheme");
      toggleTheme();
      showSuccessMessage(t("themeSwitched", { currentTheme, newTheme }));
      break;

    case "openSearch":
      if (window.getComputedStyle(searchInput).display === "none") {
        searchTasks();
        showSuccessMessage(t("searchOpened"));
      } else {
        showSuccessMessage(t("searchAlreadyOpen"), "#ffa000");
      }
      break;

    case "cancelSearch":
      if (window.getComputedStyle(searchInput).display !== "none") {
        cancelSearch(); // أغلق البحث
        showSuccessMessage(t("searchCancelled"));
      } else {
        showSuccessMessage(t("noSearchToCancel"), "#f44336");
      }
      break;

    case "markComplete":
      if (tasks[result.index]) {
        if (tasks[result.index].completed) {
          showSuccessMessage(t("taskAlreadyCompleted", { index: result.index + 1 }));
        } else {
          tasks[result.index].completed = true;
          saveTasks();
          displayTasks();
          updateTaskCount();
          showSuccessMessage(t("taskMarkedComplete", { index: result.index + 1 }));
        }
      } else {
        showSuccessMessage(t("taskNotFound"), "#f44336");
      }
      break;

    case "markCompleteByName": {
      const name = result.name.toLowerCase();
      const idx = tasks.findIndex(t => normalizeText(t.task) === normalizeText(name));
      if (idx !== -1) {
        if (tasks[idx].completed) {
          showSuccessMessage(t("taskAlreadyCompletedByName", { name: result.name }));
        } else {
          tasks[idx].completed = true;
          saveTasks();
          displayTasks();
          updateTaskCount();
          showSuccessMessage(t("taskMarkedCompleteByName", { name: result.name }));
        }
      } else {
        showSuccessMessage(t("taskByNameNotFound", { name: result.name }), "#f44336");
      }
      break;
    }

    case "showTasks":
      if (tasks.length > 0) {
        displayTasks();
        showSuccessMessage(t("taskCount", { count: tasks.length }));
      } else {
        showSuccessMessage(t("noTasksToShow"));
      }
      break;

    case "stopListening":
      if (voiceActive) {
        voiceRecognition.stop();
        showSuccessMessage(t("stopListening"));
      } else {
        showSuccessMessage(t("noActiveListening"));
      }
      break;

    default:
      showSuccessMessage(t("unknownCommand"), "#f44336");
      break;
  }

  return true; // يمكن تعديل هذه القيمة حسب الحاجة
};


voiceRecognition.onstart = () => {
  voiceActive = true;
  showSuccessMessage(t("listeningMessage"), "#1565c0");
};



voiceRecognition.onresult = (e) => {
  voiceActive = false;
  const transcript = e.results[0][0].transcript.trim();
  console.log("🎧 Voice input:", transcript);

  // تنظيف النص من محارف اتجاه النص قبل التحليل
  const cleanedTranscript = transcript.replace(/[\u200E\u200F\u202A-\u202E]/g, "").trim();
  
  const detectedLang = detectLanguage(cleanedTranscript);
  const commands = splitCommands(cleanedTranscript);

  for (const cmd of commands) {
    const result = detectedLang === "ar" ? normalizeArabicCommand(cmd) : normalizeEnglishCommand(cmd);
    const continueListening = processVoiceCommand(result);
    if (result.action === "stopListening") break;
    if (!continueListening) break;
  }
};



voiceRecognition.onerror = (e) => {
  voiceActive = false;
  showSuccessMessage(t("voiceError"), "#f44336");
  console.error("❌ Voice error:", e.error);
};

  voiceRecognition.onend = () => {
    voiceActive = false;
  };

  const voiceControlBtn = document.getElementById("voiceControlBtn");
 if (voiceControlBtn) {
  voiceControlBtn.onclick = () => {
    if (!voiceActive) {
      const currentLang = localStorage.getItem("selectedLanguage") || 'ar';
      voiceRecognition.lang = currentLang === 'ar' ? 'ar-SA' : 'en-US';
      voiceRecognition.start();
    }
  };
}

} else {
  const voiceControlBtn = document.getElementById("voiceControlBtn");
  if (voiceControlBtn) voiceControlBtn.style.display = "none";
}