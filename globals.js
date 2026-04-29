let activeLesson = null;
let activeQuestions = [];
let currentModuleIndex = 0;
let currentSubStep = 0;
let seenWords = new Set();
let isCorrect = false;
let completedSubLessons = JSON.parse(localStorage.getItem('tvaali_progress')) || [];
let currentSubLessonIndex = 0;
let tvaaliLookup = {};
let isTvToEn = false;
let lastDetectedClass = null;
/* ==========================================================================
   LESSON CONTENT HELPERS (Global)
   ========================================================================== */

// Simple lookup for a word object
window.getWord = (en) => findByEn(en);

/**
 * Generates a noun question object.
 * @param {string} enKey - The English lookup key.
 * @param {function} caseFunc - The grammar function (NOM, ACC, etc).
 * @param {string} num - "singular" or "plural".
 */
window.Q = (enKey, caseFunc = NOM, num = "singular") => {
    const wordObj = findByEn(enKey);
    if (!wordObj) return { tv: "Error", en: `Word "${enKey}" not found` };

    const allSynonyms = wordObj.entries[0].senses.flatMap(s => s.en);

    return {
        tv: caseFunc(wordObj, num),
        en: allSynonyms 
    };
};

window.VQ = (enKey, person, number, tense, options = {}) => {
    if (!enKey) {
        console.warn("VQ called without an English key!");
        return { tv: "", en: "" };
    }

    const wordObj = findByEn(enKey);
    if (!wordObj) return { tv: "Error", en: `Verb "${enKey}" not found` };

    const subjects = {
        "1st": number === "singular" ? "I" : "We",
        "2nd": "You",
        "3rd": number === "singular" ? "He/She/It" : "They"
    };

    const allSynonyms = wordObj.entries[0].senses.flatMap(s => s.en);
    
    const conjugatedEnglish = allSynonyms.map(syn => {
        const subject = subjects[person];
        if (person === "3rd" && number === "singular") {
            const suffix = syn.endsWith('sh') || syn.endsWith('ch') ? 'es' : 's';
            return `${subject} ${syn}${suffix}`;
        }
        return `${subject} ${syn}`;
    });

    // Note: We use window.V to ensure the grammar engine is also globally accessible
    return {
        tv: V(wordObj, person, person, number, tense, options),
        en: conjugatedEnglish 
    };
};