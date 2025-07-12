import {
    tasks,
    setTasks,
    showSuccessMessage,
    saveTasks,
    displayTasks,
    updateTaskCount,
    addTask,
    clearAllTasks,
    toggleTheme,
    searchTasks,
    cancelSearch,
    playFeedbackSound
} from './main.js';

import {
    t,
    setLanguage,
    getSortLabel
} from './translations.js';

if ('webkitSpeechRecognition' in window) {

    // إنشاء كائن التعرف على الصوت
    const voiceRecognition = new webkitSpeechRecognition();

    // ضبط اللغة تلقائيًا حسب لغة الصفحة (عربي أو إنجليزي)
    const pageLang = document.documentElement.lang || 'en';
    voiceRecognition.lang = pageLang === 'ar' ? 'ar-SA' : 'en-US';

    // إعدادات التعرف الصوتي
    voiceRecognition.interimResults = false;
    voiceRecognition.continuous = false;

    let voiceActive = false;

    // تحديث لغة التعرف الصوتي بناءً على اللغة المختارة في التخزين المحلي
    const configureVoiceRecognitionLanguage = () => {
        const savedLang = localStorage.getItem("selectedLanguage") || "ar";
        voiceRecognition.lang = savedLang === "ar" ? "ar-SA" : "en-US";
    };

    // عند الضغط على الزر لتفعيل التعرف الصوتي
    const voiceControlBtn = document.getElementById("voiceControlBtn");
    if (voiceControlBtn) {
        voiceControlBtn.onclick = () => {
            if (!voiceActive) {
                const currentLang = localStorage.getItem("selectedLanguage") || 'ar';
                voiceRecognition.lang = currentLang === 'ar' ? 'ar-SA' : 'en-US';
                voiceRecognition.start();
            } else {
                voiceRecognition.stop();
            }
        };
    }

    // حدث عند بدء التعرف على الصوت
    voiceRecognition.onstart = () => {
        voiceActive = true;
        configureVoiceRecognitionLanguage();

        // تشغيل الصوت
        playFeedbackSound("error");

        let statusDiv = document.getElementById('voiceStatus');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.id = 'voiceStatus';
            statusDiv.innerHTML = `
      ${t("listeningMessage")}
      <div class="voice-waves">
        <span></span><span></span><span></span>
      </div>
    `;
            document.body.appendChild(statusDiv);
        }

        // بداية: اجعل العنصر مخفي
        statusDiv.classList.remove('show');
        statusDiv.classList.add('hide');

        // ثم أظهره بسلاسة
        requestAnimationFrame(() => {
            statusDiv.classList.remove('hide');
            statusDiv.classList.add('show');
        });

        // أخفِ الإشعار بعد 9 ثوانٍ
        setTimeout(() => {
            statusDiv.classList.remove('show');
            statusDiv.classList.add('hide');
        }, 9000);
    };

    // دالة تطبيع النصوص العربية (لتسهيل مقارنة الأوامر والأسماء)
    const normalizeText = (text) => {
        return text
            .normalize("NFD")
            .replace(/[\u064B-\u0652]/g, "") // إزالة التشكيل
            .replace(/[أإآ]/g, "ا") // توحيد الألف
            .replace(/ة/g, "ه") // توحيد التاء المربوطة
            .replace(/\s+/g, " ") // إزالة المسافات الزائدة
            .trim()
            .toLowerCase();
    };


    // دالة تطبيع النصوص الإنجليزية
    const normalizeEnglishText = (text) => {
        return text.toLowerCase().replace(/\s+/g, " ").trim();
    };

    // دالة كشف اللغة (عربية أم إنجليزية)
    const detectLanguage = (text) => {
        const cleaned = text.replace(/[\u200E\u200F\u202A-\u202E]/g, "");
        const arabicRegex = /[\u0600-\u06FF]/;
        return arabicRegex.test(cleaned) ? "ar" : "en";
    };

    // تحويل الكلمات العربية للأرقام - دالة واحدة خارجية لإعادة الاستخدام
    const arabicWordToNumber = (word) => {
        word = word.replace(/يه$/, "ية").replace(/ه$/, "ة").trim();

        const map = {
            "يوم": 1,
            "يومين": 2,
            "واحد": 1,
            "واحدة": 1,
            "اثنين": 2,
            "اثنتين": 2,
            "اثنا": 2,
            "ثلاثة": 3,
            "ثلاث": 3,
            "أربعة": 4,
            "اربعة": 4,
            "أربع": 4,
            "اربع": 4,
            "خمسة": 5,
            "خمس": 5,
            "ستة": 6,
            "ست": 6,
            "سبعة": 7,
            "سبع": 7,
            "ثمانية": 8,
            "ثمان": 8,
            "تسعة": 9,
            "تسع": 9,
            "عشرة": 10,
            "عشر": 10,
            "أحد عشر": 11,
            "احد عشر": 11,
            "احدعشر": 11,
            "اثنا عشر": 12,
            "اثني عشر": 12,
            "اثنعشر": 12,
            "ثلاثة عشر": 13,
            "ثلاث عشر": 13,
            "أربعة عشر": 14,
            "اربعة عشر": 14,
            "خمسة عشر": 15,
            "خمس عشر": 15,
            "ستة عشر": 16,
            "ست عشر": 16,
            "سبعة عشر": 17,
            "سبع عشر": 17,
            "ثمانية عشر": 18,
            "ثماني عشر": 18,
            "تسعة عشر": 19,
            "تسع عشر": 19,
            "عشرون": 20,
            "عشرين": 20,
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

    // دالة نهائية لتحليل الأرقام سواء كانت نصوص أو أرقام
    const parseNumber = (str) => {
        let num = parseInt(str, 10);
        if (!isNaN(num)) return num;

        num = arabicWordToNumber(str);
        if (num !== null) return num;

        num = englishWordToNumber(str);
        return num;
    };

    // دالة تبديل اللغة
    const toggleLanguage = () => {
        const currentLang = localStorage.getItem("selectedLanguage") || "ar";
        return currentLang === "ar" ? "en" : "ar";
    };

    // دالة تقسيم الأوامر المركبة إلى أوامر منفصلة
    const splitCommands = (text) => {
        const separators = [
    " ثم ",
    " وبعدها ",
    " و ",
    " وبعد ",
    " وأيضا ",
    " ثم أيضا ",
    " بعد ذلك ",
    " وبالتالي ",
    " بعدها مباشرة ",
    " وكذلك "
  ];
        let commands = [text];
        separators.forEach(sep => {
            commands = commands.flatMap(cmd => cmd.split(sep));
        });

        commands = commands.map(cmd => cmd.trim()).filter(cmd => cmd.length > 0);
        return commands;
    };

    // دالة تطبيع وتحليل الأمر الصوتي باللغة العربية
    const normalizeArabicCommand = (command) => {
        command = normalizeText(command);

        // أمر لتغيير اللغة فقط (تبديل بين العربية والإنجليزية)
        if (/^(غير) (اللغه|اللغة)$/.test(command)) {
            return {
                action: "changeLanguage",
                lang: toggleLanguage()
            };
        }

        // أمر تغيير اللغة مع تحديد اللغة
        const changeLanguageMatch = command.match(/^(غير|حول|اختار) (اللغه|اللغة) (عربي|إنجليزي|الإنجليزية|العربية)$/);
        if (changeLanguageMatch) {
            const targetLang = changeLanguageMatch[3];
            if (targetLang.includes("عربي")) return {
                action: "changeLanguage",
                lang: "ar"
            };
            if (targetLang.includes("إنجليزي")) return {
                action: "changeLanguage",
                lang: "en"
            };
        }


        // تعديل أولوية مهمة 
        const priorityMatch = command.match(
            /^(?:غير|عدل|تعديل|حدث|بدل|استبدل)\s+(?:او?لوي[ةه])\s+(?:المهمة|مهمه)?\s*(?:رقم\s*)?(.+?)\s+(?:الى|لـ|الـ|ل)\s+(عالية|عاليه|عالي|متوسطة|متوسطه|متوسط|منخفضة|منخفضه|منخفض)$/i
        );

        // خريطة الأولويات المقبولة
        const priorityMap = {
            "عالية": "high",
            "عاليه": "high",
            "عالي": "high",
            "متوسطة": "medium",
            "متوسطه": "medium",
            "متوسط": "medium",
            "منخفضة": "low",
            "منخفضه": "low",
            "منخفض": "low"
        };

        if (priorityMatch) {
            const targetRaw = priorityMatch[1].trim();
            const priorityWord = priorityMatch[2].trim().toLowerCase();
            const newPriority = priorityMap[priorityWord];

            // إزالة "أولوية المهمة" من اسم المهمة إذا كانت موجودة
            const cleanedTarget = targetRaw.replace(/^اولويه(?:\s+(?:المهمة|مهمه))?\s+/i, "").trim();

            const indexNum = parseNumber(cleanedTarget);
            if (indexNum !== null) {
                return {
                    action: "edit",
                    index: indexNum - 1,
                    newPriority
                };
            } else {
                return {
                    action: "editByName",
                    name: cleanedTarget,
                    newPriority
                };
            }
        }


        // ✅ أمر تعديل تاريخ المهمة - يشترط وجود "تاريخ" بعد "إلى"
        const editDateMatch = command.match(
            /^(?:غير|عدل|تعديل|حدث|بدل|استبدل)\s+(?:تاريخ|موعد)?\s*(?:المهمة|مهمه)?\s*(?:رقم\s*)?(.+?)\s+(?:الى|لـ|الـ|ل)\s+تاريخ\s+(.+)$/i
        );

        if (editDateMatch) {
            const targetRaw = editDateMatch[1].trim();
            const dateExpression = editDateMatch[2].trim();

            const cleanedTarget = targetRaw.replace(/^تاريخ(?:\s+(?:المهمة|مهمه))?\s+/i, "").trim();
            const indexNum = parseNumber(cleanedTarget);

            return indexNum !== null ? {
                    action: "edit",
                    index: indexNum - 1,
                    deadlineText: dateExpression
                } :
                {
                    action: "editByName",
                    name: cleanedTarget,
                    deadlineText: dateExpression
                };
        }

        // ✅ دعم صيغة: غير المهمة إلى تاريخ بعد يومين
        const editDateMatchAlt = command.match(
            /^(?:غير|عدل|تعديل|حدث|بدل|استبدل)\s+(?:المهمة|مهمه)?\s*(?:رقم\s*)?(.+?)\s+(?:الى|لـ|الـ|ل)\s+تاريخ\s+(.+)$/i
        );

        if (editDateMatchAlt) {
            const targetRaw = editDateMatchAlt[1].trim();
            const dateExpression = editDateMatchAlt[2].trim();

            const indexNum = parseNumber(targetRaw);
            return indexNum !== null ? {
                    action: "edit",
                    index: indexNum - 1,
                    deadlineText: dateExpression
                } :
                {
                    action: "editByName",
                    name: targetRaw,
                    deadlineText: dateExpression
                };
        }

        // ✅ دعم صيغة: غير تاريخ شجرة إلى بعد يومين
        const editDateMatchNatural = command.match(
            /^(?:غير|عدل|تعديل|حدث|بدل|استبدل)\s+تاريخ\s+(.+?)\s+(?:الى|لـ|الـ|ل)\s+(.+)$/i
        );

        if (editDateMatchNatural) {
            const name = editDateMatchNatural[1].trim();
            const deadlineText = editDateMatchNatural[2].trim();
            return {
                action: "editByName",
                name,
                deadlineText
            };
        }

        // ✅ صيغ دعم مثل: أجّل المهمة، أو أزح شجرة إلى الأسبوع القادم
        const delayMatch = command.match(
            /^(?:أجّل|أجل|أخر|أخّر|أزح|مدد|أبعد)\s+(?:المهمة|مهمه)?\s*(?:رقم\s*)?(.+?)\s+(?:الى|لـ|الـ|ل)?\s*(.+)$/i
        );

        if (delayMatch) {
            const targetRaw = delayMatch[1].trim();
            const delayExpression = delayMatch[2].trim();

            const indexNum = parseNumber(targetRaw);
            return indexNum !== null ? {
                    action: "edit",
                    index: indexNum - 1,
                    deadlineText: delayExpression
                } :
                {
                    action: "editByName",
                    name: targetRaw,
                    deadlineText: delayExpression
                };
        }


        // حذف مهمة
        const deleteMatch = command.match(/^(احذف|احزف|حذف|امسح|شطب|شيل|الغِ|الغاء)\s*(?:مهمه|المهمه)?\s*(?:رقم\s*)?(.+)/);
        if (deleteMatch) {
            const target = deleteMatch[2].trim();
            const indexNum = parseNumber(target);
            return indexNum !== null ? {
                action: "delete",
                index: indexNum - 1
            } : {
                action: "deleteByName",
                name: target
            };
        }


        // تعديل مهمة
        const editMatch = command.match(/^(عدل|تعديل|غير|غيري|حدث|حدثي|استبدل|بدل)\s*(مهمه|المهمه)?(?:\s*رقم)?\s*(.+?)\s*(?:الى|ب|نصها|ليكون|ليصير)?\s+(.+)/i);

        if (editMatch) {
            const target = editMatch[3]?.trim();
            const newText = editMatch[4]?.trim();

            if (!newText) {
                console.warn("⚠️ لم يتم استخراج النص الجديد بنجاح.");
                return null; // أو رسالة خطأ
            }

            const indexNum = parseNumber(target);
            return indexNum !== null ? {
                action: "edit",
                index: indexNum - 1,
                newText
            } : {
                action: "editByName",
                name: target,
                newText
            };
        }



        // إضافة مهمة
        const addMatch = command.match(/^(?:.*(أريد|من فضلك|رجاءً|يرجى|هل يمكنك|ممكن)?\s*)?(اضف|أضف|اضيف|سجل|اكتب|أكتب|انشئ|أنشئ|ادخل|خزن|ضف|ضيف|اضافة)( الى القائمة| مهمة| للمهام)?\s+(.+)/);
        if (addMatch) {
            return {
                action: "add",
                raw: addMatch[4].trim()
            };
        }

        // تعليم كمكتملة
        const markCompleteMatch = command.match(/^(علم|علّم|حدد|اعلم|تمت|انجزت)\s*(مهمه|المهمه)?\s*(?:رقم\s*)?(.+?)\s*(كمكتمله|كمكتملة|انهاء|انجزتها)?$/);
        if (markCompleteMatch) {
            const target = markCompleteMatch[3].trim();
            const indexNum = parseNumber(target);
            return indexNum !== null ? {
                action: "markComplete",
                index: indexNum - 1
            } : {
                action: "markCompleteByName",
                name: target
            };
        }

        // === أوامر الصوت لعرض المهام ===
        // 📋 اعرض كل المهام
        if (/^(اعرض|ارني|أرني|اظهر|عرض|اظهار|فرجيني|شوف|شوفي)( المهام|قائمة المهام)?$/.test(command)) {
            return {
                action: "showTasks",
                sort: "default"
            };
        }

        // ✅ اعرض المهام المكتملة
        if (/^(اعرض|ارني|أرني|اظهر|عرض|اظهار|فرجيني|شوف|شوفي)? ?(المهام )?(المكتملة|المكتمله|المنجزة|المنجزه)$/.test(command)) {
            return {
                action: "showTasks",
                sort: "complete"
            };
        }

        // ✅ اعرض المهام غير المكتملة
        if (/^(اعرض|ارني|أرني|اظهر|عرض|اظهار|فرجيني|شوف|شوفي)? ?(المهام )?(الغير مكتملة|غير مكتملة|الغير مكتمله|غير مكتمله|المتأخرة|المتبقية|الباقية|الغير منجزة|غير منجزة|الغير منجزه|غير منجزه)$/.test(command)) {
            return {
                action: "showTasks",
                sort: "incompleteOnly"
            };
        }

        // ✅ الأحدث
        if (/^(اعرض|ارني|أرني|اظهر|عرض|اظهار|فرجيني|شوف|شوفي)? ?(المهام )?(الاحدث|الجديدة|الجدد)$/.test(command)) {
            return {
                action: "showTasks",
                sort: "newest"
            };
        }

        // ✅ الأقدم
        if (/^(اعرض|ارني|أرني|اظهر|عرض|اظهار|فرجيني|شوف|شوفي)? ?(المهام )?(الأقدم|القديمة)$/.test(command)) {
            return {
                action: "showTasks",
                sort: "oldest"
            };
        }

        // ✅ حسب الأولوية
        if (/^(اعرض|ارني|أرني|اظهر|عرض|اظهار|فرجيني|شوف|شوفي)? ?(المهام )?(حسب الأولوية|بالأولوية|المرتب حسب الأولوية|من العالي إلى المنخفض|ذات الأولوية|ذات الاولويه)$/.test(command)) {
            return {
                action: "showTasks",
                sort: "priority"
            };
        }


        // === حذف كل المهام ===
        if (/^(احذف|امسح|شطب|الغاء|ازالة) (الكل|كل المهام|جميع المهام|كلهم|الكلهم)$/.test(command)) {
            return {
                action: "clearAll"
            };
        }

        // تبديل الثيم
        if (/^(تبديل|تغيير|غير|قلب|تبدل|تغير) (الثيم|الوضع|المظهر|اللون|الستايل|النمط)$/.test(command)) {
            return {
                action: "toggleTheme"
            };
        }

        // إلغاء البحث
        if (/^(الغِ|الغاء|إلغاء|أوقف|قفل|اقفل|اطفئ|اطفي|سكر|اغلق|أغلق) (البحث)?$/.test(command)) {
            return {
                action: "cancelSearch"
            };
        }

        // فتح البحث
        if (/^(افتح|ابدأ|شغل|تشغيل|ابدئي|فعلي|ابدا|شغلي) (البحث)?$/.test(command)) {
            return {
                action: "openSearch"
            };
        }

        // إيقاف الاستماع
        if (/^(توقف|أوقف|اوقف|اطفي|اقفل|اغلق|اسكت|سكوت|قفل|انهاء|كفاية)( الاستماع| المايك| الميكروفون| الصوت)?$/.test(command)) {
            return {
                action: "stopListening"
            };
        }

        // أمر غير معروف
        return {
            action: "unknown",
            raw: command
        };
    };

    // دالة تطبيع وتحليل الأمر الصوتي باللغة الإنجليزية
    const normalizeEnglishCommand = (command) => {
        command = normalizeEnglishText(command);

        // أمر تبديل اللغة
        if (/^(switch) (language)$/.test(command)) {
            return {
                action: "changeLanguage",
                lang: toggleLanguage()
            };
        }

        // أمر تغيير اللغة مع تحديد اللغة
        const changeLanguageMatch = command.match(/^(change|switch|witch) (language|to) (arabic|english)$/);
        if (changeLanguageMatch) {
            const targetLang = changeLanguageMatch[3];
            if (targetLang === "arabic") return {
                action: "changeLanguage",
                lang: "ar"
            };
            if (targetLang === "english") return {
                action: "changeLanguage",
                lang: "en"
            };
        }

        // حذف مهمة
        const deleteMatch = command.match(/^(delete|remove|del|rm|erase|drop|kill|trash)\s*(task)?\s*(number|no\.?|#)?\s*(.+)/);
        if (deleteMatch) {
            const target = deleteMatch[4].trim();
            const indexNum = parseNumber(target);
            return indexNum !== null ? {
                action: "delete",
                index: indexNum - 1
            } : {
                action: "deleteByName",
                name: target
            };
        }

        // تعديل مهمة
        const editMatch = command.match(/^(edit|change|update|modify|rename|replace)\s*(task)?\s*(number|no\.?|#)?\s*(.+?)\s*(to|as|with)\s*(.+)/);
        if (editMatch) {
            const target = editMatch[4].trim();
            const newText = editMatch[6].trim();
            const indexNum = parseNumber(target);
            return indexNum !== null ? {
                action: "edit",
                index: indexNum - 1,
                newText
            } : {
                action: "editByName",
                name: target,
                newText
            };
        }

        // إضافة مهمة
        const addMatch = command.match(/^(add|create|new|insert|write( down)?|put|make)\s*(task)?(\s*to\s*(my\s*)?(list|tasks))?\s*(.+)/);
        if (addMatch) {
            return {
                action: "add",
                raw: addMatch[7].trim()
            };
        }

        // تعليم كمكتملة
        const completeMatch = command.match(/^(mark|set|check|done|finish|complete|check off)\s*(task)?\s*(number|no\.?|#)?\s*(.+?)\s*(as)?\s*(completed|done|finished|checked)?/);
        if (completeMatch) {
            const target = completeMatch[4].trim();
            const indexNum = parseNumber(target);
            return indexNum !== null ? {
                action: "markComplete",
                index: indexNum - 1
            } : {
                action: "markCompleteByName",
                name: target
            };
        }

        // عرض المهام
        if (/^(show|list|display|view|see|what are)\s*(all)?\s*(my)?\s*(tasks|todos?|to-?dos?)/.test(command)) {
            return {
                action: "showTasks"
            };
        }

        // حذف كل المهام
        if (/^(clear|delete|remove|erase|empty|trash|clean)\s*(all)?\s*(tasks|todos?)?$/.test(command)) {
            return {
                action: "clearAll"
            };
        }

        // تبديل الثيم
        if (/^(toggle|switch|change|flip|set|activate)\s*(theme|mode|appearance)?\s*(dark|light)?/.test(command)) {
            return {
                action: "toggleTheme"
            };
        }

        // إلغاء البحث
        if (/^(cancel|close|stop|exit|abort|dismiss|hide)\s*(search)?/.test(command)) {
            return {
                action: "cancelSearch"
            };
        }

        // فتح البحث
        if (/^(open|start|activate|begin|show|launch|find)\s*(search)?/.test(command)) {
            return {
                action: "openSearch"
            };
        }

        // إيقاف الاستماع
        if (/^(stop|cancel|disable|turn off|shut down|end)\s*(listening|voice|microphone|mic)?/.test(command)) {
            return {
                action: "stopListening"
            };
        }

        // أمر غير معروف
        return {
            action: "unknown",
            raw: command
        };
    };



    // استخراج الوقت من النص المنطوق وتحويله إلى كائن تاريخ (Date)
    const extractTimeFromSpeech = (text) => {
        const now = new Date();
        let deadline = null;

        const addDays = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        const timeUnits = {
            "دقيقة": 1,
            "دقيقتين": 2,
            "دقيقه": 1,
            "دقائق": 1,
            "دقايق": 1,
            "ساعة": 60,
            "ساعه": 60,
            "ساعات": 60
        };

        // 🧠 تعابير زمنية ثابتة
        const fixedExpressions = [
            {
                pattern: /غدًا|غدا/,
                days: 1
            },
            {
                pattern: /بعد\s+غد/,
                days: 2
            },
            {
                pattern: /في\s+الاسبوع\s+القادم/,
                days: 7
            },
            {
                pattern: /في\s+الشهر\s+المقبل/,
                monthOffset: 1
            }
  ];
        for (const expr of fixedExpressions) {
            if (expr.pattern.test(text)) {
                deadline = new Date(now);
                if (expr.days) deadline.setDate(now.getDate() + expr.days);
                if (expr.monthOffset) deadline.setMonth(now.getMonth() + expr.monthOffset);
                break;
            }
        }

        // ⏱️ "بعد X دقيقة / ساعة"
        if (!deadline) {
            let match = text.match(/بعد\s+(?:(\S+)\s+)?(دقيقة|دقيقتين|دقيقه|دقائق|ساعه|ساعة|ساعات)/i);
            if (match) {
                let num = parseInt(match[1]) || arabicWordToNumber(match[1]) || 1;
                const unit = match[2];
                if (!isNaN(num)) {
                    deadline = new Date(now.getTime() + num * (timeUnits[unit] || 0) * 60 * 1000);
                }
            }
        }

        // 📅 "بعد X يوم"
        if (!deadline) {
            const match = text.match(/بعد\s+(\d+|[^\s]+)\s*(يوم|أيام|ايام|يوما|يومًا|يوماً)?/i);
            if (match) {
                let num = parseInt(match[1]) || arabicWordToNumber(match[1]);
                if (!isNaN(num)) deadline = addDays(num);
            }
        }

        // ⏳ "بعد X أسبوع وY يوم"
        if (!deadline) {
            const match = text.match(/بعد\s+((\d+|[^\s]+)\s*(أسبوع|أسابيع))?(?:\s*و\s*)?((\d+|[^\s]+)\s*(يوم|أيام))?/i);
            if (match) {
                let totalDays = 0;
                const weekNum = parseInt(match[2]) || arabicWordToNumber(match[2]);
                const dayNum = parseInt(match[5]) || arabicWordToNumber(match[5]);
                if (!isNaN(weekNum)) totalDays += weekNum * 7;
                if (!isNaN(dayNum)) totalDays += dayNum;
                if (totalDays > 0) deadline = addDays(totalDays);
            }
        }

        // 📆 "بعد X شهر"
        if (!deadline) {
            const match = text.match(/بعد\s+(\d+|[^\s]+)?\s*(شهر|شهور|شهرًا|شهورًا)/i);
            if (match) {
                let num = match[1] ? parseInt(match[1]) || arabicWordToNumber(match[1]) : 1;
                if (!isNaN(num)) {
                    deadline = new Date(now);
                    deadline.setMonth(now.getMonth() + num);
                }
            }
        }

        // 🗓️ "يوم الأحد القادم"
        if (!deadline) {
            const match = text.match(/(?:يوم\s*)?(السبت|الأحد|الاحد|الإثنين|الاثنين|الثلاثاء|الثلاثا|الأربعاء|الاربعاء|الخميس|الجمعه)\s*(القادمة|المقبلة|المقبل|القادم)?/i);
            if (match) {
                const daysOfWeek = {
                    "الأحد": 0,
                    "الاحد": 0,
                    "الإثنين": 1,
                    "الاثنين": 1,
                    "الثلاثاء": 2,
                    "الثلاثا": 2,
                    "الأربعاء": 3,
                    "الاربعاء": 3,
                    "الخميس": 4,
                    "الجمعة": 5,
                    "الجمعه": 5,
                    "السبت": 6
                };
                const targetDay = daysOfWeek[match[1]];
                const diff = (targetDay - now.getDay() + 7) % 7 || 7;
                deadline = addDays(diff);
            }
        }

        // 🗓️ "5 يوليو"
        if (!deadline) {
            const match = text.match(/(\d{1,2})\s*(يناير|فبراير|مارس|أبريل|مايو|يونيو|يوليو|أغسطس|سبتمبر|أكتوبر|نوفمبر|ديسمبر)/);
            if (match) {
                const monthMap = {
                    "يناير": 0,
                    "فبراير": 1,
                    "مارس": 2,
                    "أبريل": 3,
                    "مايو": 4,
                    "يونيو": 5,
                    "يوليو": 6,
                    "أغسطس": 7,
                    "سبتمبر": 8,
                    "أكتوبر": 9,
                    "نوفمبر": 10,
                    "ديسمبر": 11
                };
                deadline = new Date(now.getFullYear(), monthMap[match[2]], parseInt(match[1]));
            }
        }

        // ⏰ "الساعة 10:30 صباحاً"
        const timeMatch = text.match(/الساعه\s+(\d{1,2})(?:[:٫،:](\d{1,2}))?\s*(صباحا|مساء)?/i);
        if (timeMatch) {
            let hour = parseInt(timeMatch[1]);
            const minute = parseInt(timeMatch[2]) || 0;
            if (timeMatch[3] === "مساء" && hour < 12) hour += 12;
            if (timeMatch[3] === "صباحا" && hour === 12) hour = 0;
            if (!deadline) deadline = new Date(now);
            deadline.setHours(hour, minute, 0, 0);
        }

        // 🧹 تنظيف النص من العبارات الزمنية
        const cleanedText = text
            .replace(/بعد\s+(?:\d+|[^\s\d]+)?\s*\b(دقيقة|دقيقتين|دقيقه|دقائق|ساعه|ساعة|ساعات)\b/gi, "")
            .replace(/بعد\s+(?:\d+|[^\s\d]+)?\s*(يوم(?:ين)?|يوماً|يوما|يومًا|أيام|ايام)?/gi, "")
            .replace(/بعد\s+(?:\d+|[^\s\d]+)?\s*\b(أسبوع(?:ين)?|أسابيع)\b/gi, "")
            .replace(/بعد\s+(?:\d+|[^\s\d]+)?\s*\b(شهر|شهور|شهرًا|شهورًا)\b/gi, "")
            .replace(/بعد\s+غد(?:ا|ًا)?/gi, "")
            .replace(/\b(غدًا|غدا|اليوم)\b/gi, "")
            .replace(/في\s+الشهر\s+المقبل/gi, "")
            .replace(/في\s+الأسبوع\s+القادم/gi, "")
            .replace(/الساعة\s+\d{1,2}(?:[:٫،:]\d{1,2})?\s*(صباحا|مساء)?/gi, "")
            .replace(/\b(يوم\s*)?(السبت|الأحد|الاحد|الإثنين|الاثنين|الثلاثاء|الثلاثا|الأربعاء|الاربعاء|الخميس|الجمعه)(\s*(القادمة|المقبلة|المقبل|القادم))?\b/gi, "")
            .replace(/\b(\d{1,2})\s*(يناير|فبراير|مارس|أبريل|مايو|يونيو|يوليو|أغسطس|سبتمبر|أكتوبر|نوفمبر|ديسمبر)\b/gi, "")
            .trim();

        return {
            cleanedText,
            deadline,
            modified: !!deadline
        };
    };


    const processVoiceCommand = (result) => {
        const {
            action
        } = result;

        const findTaskIndexByName = (name) =>
            tasks.findIndex(t => normalizeText(t.task) === normalizeText(name.toLowerCase()));

        const saveAndRefreshTasks = () => {
            saveTasks();
            displayTasks();
            updateTaskCount();
        };

        const showError = (msgKey, params = {}) => showSuccessMessage(t(msgKey, params), "#f44336");

        const updateTask = (idx, newText, newPriority, newDeadlineRaw, deadlineText, msgKey) => {
            const task = tasks[idx];
            let newDeadline = newDeadlineRaw ? new Date(newDeadlineRaw) :
                deadlineText ? extractTimeFromSpeech(deadlineText).deadline : new Date(task.deadline);

            const unchanged =
                newText === task.task &&
                newPriority === task.priority &&
                (!newDeadline || newDeadline.toISOString() === task.deadline);

            if (unchanged) return showError("errorNoChange");

            if (newText.length < 3 || !newText.match(/[a-zA-Z\u0600-\u06FF]/))
                return showError("voice-errorMinChars");

            if (tasks.some((t, i) => t.task === newText && i !== idx))
                return showError("taskDuplicateError");

            const now = new Date();
            const dateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

            Object.assign(task, {
                task: newText,
                priority: newPriority,
                deadline: newDeadline ? newDeadline.toISOString() : null,
                date: dateStr,
            });

            saveAndRefreshTasks();
            showSuccessMessage(t(msgKey, {
                oldTask: task.task,
                newText
            }));
        };

        switch (action) {
            case "changeLanguage": {
                const newLang = result.lang;
                document.documentElement.lang = newLang;
                document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
                localStorage.setItem("selectedLanguage", newLang);
                voiceRecognition.lang = newLang === "ar" ? "ar-SA" : "en-US";
                setLanguage(newLang, tasks, displayTasks);
                const sel = document.getElementById("languageSelect");
                if (sel) sel.value = newLang;
                showSuccessMessage(t("languageChanged", {
                    newLang: t(newLang === "ar" ? "arabic" : "english")
                }));
                break;
            }

            case "add": {
                const {
                    cleanedText: taskText,
                    deadline
                } = extractTimeFromSpeech(result.raw);
                if (taskText.length < 3) return showError("voice-errorMinChars");
                if (tasks.some(t => t.task.trim() === taskText))
                    return showError("taskAlreadyExists", {
                        taskText
                    });
                taskInput.value = taskText;
                if (deadline) {
                    const localISO = new Date(deadline.getTime() - deadline.getTimezoneOffset() * 60000)
                        .toISOString().slice(0, 16);
                    deadlineInput.value = localISO;
                }
                addTask();
                break;
            }

            case "edit":
            case "editByName": {
                const idx = action === "edit" ? result.index : findTaskIndexByName(result.name);
                if (idx === -1 || !tasks[idx])
                    return showError(action === "edit" ? "taskNotFound" : "taskByNameNotFound", {
                        name: result.name
                    });

                const task = tasks[idx];
                const newText = result.newText?.trim() || task.task;
                const newPriority = result.newPriority || task.priority;
                updateTask(idx, newText, newPriority, result.deadline, result.deadlineText,
                    action === "edit" ? "voice-taskEdited" : "taskEdited");
                break;
            }

            case "delete":
            case "deleteByName": {
                const idx = action === "delete" ? result.index : findTaskIndexByName(result.name);
                if (idx === -1 || !tasks[idx]) {
                    return showError(action === "delete" ? "taskNotFoundByNumber" : "taskNotFoundByName",
                        action === "delete" ? {
                            index: result.index + 1
                        } : {
                            name: result.name
                        });
                }
                tasks.splice(idx, 1);
                saveAndRefreshTasks();
                const msg = action === "delete" ? t("voice-taskDeleted").replace("{index}", idx + 1) :
                    t("taskDeletedByName", {
                        name: result.name
                    });
                showSuccessMessage(msg, "red");
                break;
            }

            case "clearAll":
                clearAllTasks();
                break;

            case "toggleTheme": {
                const isDark = document.body.classList.contains("dark-theme");
                toggleTheme();
                showSuccessMessage(t("themeSwitched", {
                    currentTheme: t(isDark ? "darkTheme" : "lightTheme"),
                    newTheme: t(isDark ? "lightTheme" : "darkTheme")
                }));
                break;
            }

            case "openSearch": {
                if (window.getComputedStyle(searchInput).display === "none") {
                    searchTasks();
                    showSuccessMessage(t("searchOpened"));
                } else {
                    showSuccessMessage(t("searchAlreadyOpen"), "#ffa000");
                }
                break;
            }

            case "cancelSearch": {
                if (window.getComputedStyle(searchInput).display !== "none") {
                    cancelSearch();
                    showSuccessMessage(t("searchCancelled"));
                } else {
                    showError("noSearchToCancel");
                }
                break;
            }

            case "markComplete":
            case "markCompleteByName": {
                const idx = action === "markComplete" ? result.index : findTaskIndexByName(result.name);
                if (idx === -1 || !tasks[idx])
                    return showError(action === "markComplete" ? "taskNotFound" : "taskByNameNotFound", {
                        name: result.name
                    });

                if (tasks[idx].completed) {
                    showSuccessMessage(t(
                        action === "markComplete" ? "taskAlreadyCompleted" : "taskAlreadyCompletedByName",
                        action === "markComplete" ? {
                            index: idx + 1
                        } : {
                            name: result.name
                        }
                    ));
                } else {
                    tasks[idx].completed = true;
                    saveAndRefreshTasks();
                    showSuccessMessage(t(
                        action === "markComplete" ? "taskMarkedComplete" : "taskMarkedCompleteByName",
                        action === "markComplete" ? {
                            index: idx + 1
                        } : {
                            name: result.name
                        }
                    ));
                }
                break;
            }

            case "showTasks": {
                const sort = result.sort || "default";
                const sortSelect = document.getElementById("sortTasksSelect");
                const previousSort = localStorage.getItem("taskSortOrder") || "default";

                if (sortSelect) {
                    sortSelect.value = sort;
                    localStorage.setItem("taskSortOrder", sort);
                }

                displayTasks();
                const msg = t("sortChangedMessage")
                    .replace("{from}", getSortLabel(previousSort, t))
                    .replace("{to}", getSortLabel(sort, t));
                showSuccessMessage(`📋 ${msg}`, "#4caf50");
                break;
            }

            case "stopListening":
                if (voiceActive) {
                    voiceRecognition.stop();
                    showSuccessMessage(t("stopListening"));
                } else {
                    showError("noActiveListening");
                }
                break;

            default:
                showError("unknownCommand");
        }

        return true;
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

        let errorMessage = '';
        switch (e.error) {
            case 'no-speech':
                errorMessage = t("voiceErrorNoSpeech"); // No speech was detected
                break;
            case 'audio-capture':
                errorMessage = t("voiceErrorAudioCapture"); // Microphone is not available or permission denied
                break;
            case 'not-allowed':
                errorMessage = t("voiceErrorNotAllowed"); // User denied permission to use microphone
                break;
            case 'network':
                errorMessage = t("voiceErrorNetwork"); // Network issues
                break;
            case 'language-not-supported':
                errorMessage = t("voiceErrorLanguageNotSupported"); // Language is not supported by the speech recognition service
                break;
            case 'speech-unavailable':
                errorMessage = t("voiceErrorSpeechUnavailable"); // Speech service is unavailable
                break;
            default:
                errorMessage = t("voiceErrorUnknown"); // Unknown error
                break;
        }

        // عرض رسالة الخطأ مع اللون الأحمر
        showSuccessMessage(errorMessage, "#f44336");

        // سجل الخطأ في وحدة التحكم لمزيد من التفاصيل
        console.error("❌ Voice error:", e.error);
    };


    voiceRecognition.onend = () => {
        voiceActive = false;
    };


} else {
    const voiceControlBtn = document.getElementById("voiceControlBtn");
    if (voiceControlBtn) voiceControlBtn.style.display = "none";
}