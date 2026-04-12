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
        if (!char1) return false;
        const heavySingles = "aoi";
        // If char2 is provided, check for long vowels/diphthongs
        if (char2) {
            const pair = char1 + char2;
            if ((char1 === char2 && "aeiou".includes(char1)) || (pair === "ai" || pair === "oi")) {
                return true;
            }
        }
        // If it's a single vowel, check if it's in the heavy list
        return heavySingles.includes(char1);
    },

    // 1. Prefix pronoun
    getPronoun: function(vClass, person, formality, number) {
        const cleanPerson = person.split(" ")[0];

        if (cleanPerson === "1st") {
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
        if (cleanPerson === "2nd") {
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
        if (cleanPerson === "3rd") {
            if (vClass === "animate") {
                if (number === "singular") return "tha";
                if (number === "dual") return "thasa";
                if (number === "paucal") return "thadaa";
                if (number === "plural") return "am";
            } else if (vClass === "inanimate") {
                if (number === "singular") return "ne";
                if (number === "plural") return "pe";
            } else { 
                return "rii"; // Abstract
            }
        }
        if (cleanPerson === "indef") {
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
    getTense: function(fullTense) {
        if (!fullTense) return "";
        
        // Split "future perfective" into ["future", "perfective"]
        const parts = fullTense.split(" ");
        const time = parts[0];
        const aspect = parts[1] || "perfective"; 

        if (time === "present" && (aspect === "perfective" || aspect === "continuous")) {
            return "";
        }

        const chart = {
            perfective: { 
                past: "evi", pluperfect: "echti", perfect: "an", 
                "future in past": "es", present: "", "future perfect": "e", 
                "future in future": "i", future: "am", indefinite: "te" 
            },
            continuous: { 
                past: "avi", pluperfect: "wachi", perfect: "wan", 
                "future in past": "wes", "future perfect": "we", 
                "future in future": "ai", future: "wum", indefinite: "aate" 
            },
            habitual: { 
                past: "tsevi", perfect: "tsan", present: "tse" 
            }
        };

        return chart[aspect]?.[time] ?? "";
    },

    applySuffixPhonology: function(stem, suffix) {
        if (!suffix) return stem;
        const vowels = "aeiou";
        const sLast = stem.slice(-1).toLowerCase();
        const sPenult = stem.slice(-2, -1).toLowerCase();
        const sufFirst = suffix[0].toLowerCase();

        if (!vowels.includes(sLast)) return stem + suffix;

        const stemIsLong = this.isHeavy(sPenult, sLast); // e.g., 'aa'
        const suffixStartsHeavy = this.isHeavy(sufFirst); // e.g., 'a', 'o', or 'i'

        // RULE 1: Long vowels of the stem override suffixes
        if (stemIsLong) {
            const trimmedSuffix = vowels.includes(sufFirst) ? suffix.slice(1) : suffix;
            return stem + trimmedSuffix;
        }

        // RULE 2: Heavy short vowels of the suffix override short stem vowels
        if (suffixStartsHeavy) {
            return stem.slice(0, -1) + suffix;
        }

        return stem + suffix;
    },

    // 3. THE MASTER BUILDER
    conjugate: function(verbObj, vClass, person, number, fullTense, formality = "informal") {
        const stem = verbObj.stem;
        
        // Handle Prefix
        // Note: You'll need to map your "3rd animate" person string back to the logic
        const rawPrefix = this.getPronoun(vClass, person, formality, number);
        let res = this.applyPrefixPhonology(rawPrefix, stem);

        // Handle Suffix
        const rawSuffix = this.getTense(fullTense);
        
        return this.applySuffixPhonology(res, rawSuffix);
    },
};