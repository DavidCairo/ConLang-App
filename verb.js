const verbConjugator = {
    // Check starting letter 
    getStartType: function(stem) {
        const first = stem[0];
        const second = stem[1];
        const vowels = "aeiou";

        if (vowels.includes(first)) {
            return (first === second) ? "long_vowel" : "vowel";
        }
        return "consonant";
    },

    // 1. Helper to determine vowel weight
    isHeavy: function(char1, char2) {
        if (!char1 || !char2) return false;
        const pair = char1 + char2;
        // Doubled vowels or diphthongs ai/oi are "Heavy"
        return (char1 === char2 && "aeiou".includes(char1)) || 
               (pair === "ai" || pair === "oi");
    },

    // 1. Prefix pronoun
    getPronoun: function(vClass, person, formality, number) {

        if (person === "1st") {
            if (vClass === "inc") {
                if (number === "singular") return "";
                if (number === "dual") return "iis";
                if (number === "paucal") return "iitaa";
                if (number === "plural") return "kii";
            } else {
                if (number === "dual") return "sa";
                if (number === "paucal") return "achtaa";
                if (number === "plural") return "iitha";
            }
        }
        if (person === "2nd") {
            if (formality === "formal") {
                if (number === "singular") return "iichte";
                if (number === "dual") return "iichtes";
                if (number === "plural") return "ikraa";
            } else {
                if (number === "singular") return "tsi";
                if (number === "dual") return "tsisa";
                if (number === "paucal") return "tsitaa";
                if (number === "plural") return "raa";
            }
        }
        if (person === "3rd") {
            if (vClass === "animate") {
                if (number === "singular") return "tha";
                if (number === "dual") return "thasa";
                if (number === "paucal") return "thadaa";
                if (number === "plural") return "am";
            } else if (pClass === "inanimate") {
                if (number === "singular") return "ne";
                if (number === "plural") return "pe";
            } else { 
                return "rii"; // Abstract
            }
        }
        if (person === "indef") {
            if (vClass === "animate") {
                if (number === "singular") return "vi";
                if (number === "dual") return "vasa";
                if (number === "plural") return "viraa";
            } else {
                if (number === "singular") return "ivi";
                if (number === "plural") return "iviraa";
            }
        }
        return ""; 
    },

    applyPrefixPhonology: function(prefix, stem) {
        if (!prefix) return stem;

        const pLast = prefix.slice(-1);
        const pPenult = prefix.slice(-2, -1);
        const sFirst = stem[0];
        const sSecond = stem[1];

        const pIsLong = this.isHeavy(pPenult, pLast);
        const sIsLong = this.isHeavy(sFirst, sSecond);
        const isVowelMeeting = "aeiou".includes(pLast) && "aeiou".includes(sFirst);

        if (isVowelMeeting) {
            const pFull = pPenult + pLast;
            const sFull = sFirst + sSecond;

            if (pFull === "aa" && sFull === "ii") return prefix.slice(0, -2) + "ai" + stem.slice(2);
            if (pFull === "ii") return prefix.slice(0, -2) + "j" + stem;
            if (pFull === "aa") return prefix.slice(0, -2) + stem;
            if (sIsLong && !pIsLong) return prefix.slice(0, -1) + stem;
            if (pIsLong && !sIsLong) return prefix + stem.slice(1);
            return prefix.slice(0, -1) + stem;
        }
        return prefix + stem;
    },

    // 2. Suffix tense
    getTense: function(tense, time) {
        if (time === "present") {
            if (tense === "perfective" || tense === "continuous") return "";
        }

        const chart = {
            perfective: { past: "ev", pluperfect: "echt", perfect: "an", fip: "es", present: "", futperfect: "e", fif: "i", future: "am", infinitive: "te" },
            continuous: { past: "avi", pluperfect: "wach", perfect: "wan", fip: "wes", futperfect: "we", fif: "ai", future: "wum", infinitive: "aate" },
            habitual: { past: "tsev", perfect: "tsan", present: "tse" }
        };
        return chart[tense]?.[time] ?? "";
    },

    applySuffixPhonology: function(stem, suffix) {
        if (!suffix) return stem;
        const sLast = stem.slice(-1);
        const sPenult = stem.slice(-2, -1);
        const sufFirst = suffix[0];
        const sufSecond = suffix[1];

        if (!"aeiou".includes(sLast)) return stem + suffix;

        const stemIsHeavy = this.isHeavy(sPenult, sLast);
        const sufIsHeavy = this.isHeavy(sufFirst, sufSecond);

        if (stemIsHeavy && !sufIsHeavy) return stem + suffix.slice(1);
        if (sufIsHeavy && !stemIsHeavy) return stem.slice(0, -1) + suffix;
        if (!stemIsHeavy && !sufIsHeavy) return stem.slice(0, -1) + suffix;
        return stem + suffix.slice(1);
    },

    // 3. THE MASTER BUILDER
    conjugate: function(verbObj, vClass, person, number, tense = "perfective", time, formality = "informal") {
        const rawPrefix = this.getPronoun(vClass, person, formality, number);
        const stem = verbObj.stem;

        let res = this.applyPrefixPhonology(rawPrefix, stem);
        const rawSuffix = this.getTense(tense, time);
        
        return this.applySuffixPhonology(res, rawSuffix);
    }
};