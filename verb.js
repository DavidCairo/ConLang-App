const verbConjugator = {
    // Vowel Matrix
    vowelMatrix: {
        'a':  { 'a':'a',  'i':'ai', 'e':'a',  'u':'a',  'o':'oi', 'y':'y', 'aa':'aa', 'ii':'ai', 'ee':'ee', 'uu':'uu', 'oo':'oi' },
        'i':  { 'a':'ia', 'i':'i',  'e':'ie', 'u':'iu', 'o':'io', 'y':'y', 'aa':'iaa', 'ii':'ii', 'ee':'iee', 'uu':'iuu', 'oo':'ioo' },
        'e':  { 'a':'a',  'i':'i',  'e':'e',  'u':'u',  'o':'o',  'y':'y', 'aa':'aa', 'ii':'ii', 'ee':'ee', 'uu':'uu', 'oo':'oo' },
        'u':  { 'a':'a',  'i':'i',  'e':'u',  'u':'u',  'o':'o',  'y':'y', 'aa':'aa', 'ii':'ii', 'ee':'ee', 'uu':'uu', 'oo':'oo' },
        'o':  { 'a':'a',  'i':'o',  'e':'o',  'u':'o',  'o':'o',  'y':'y', 'aa':'aa', 'ii':'ii', 'ee':'ee', 'uu':'uu', 'oo':'oo' },
        'y':  { 'a':'y',  'i':'y',  'e':'y',  'u':'y',  'o':'y',  'y':'y', 'aa':'aa', 'ii':'ii', 'ee':'y',  'uu':'uu', 'oo':'oo' },
        'aa': { 'a':'aa', 'i':'ai', 'e':'aa', 'u':'aa', 'o':'aa', 'y':'aa','aa':'aa', 'ii':'ai', 'ee':'aa', 'uu':'aa', 'oo':'aa' },
        'ii': { 'a':'iaa','i':'ii', 'e':'iee','u':'iuu','o':'ioo','y':'ii','aa':'iaa', 'ii':'ii', 'ee':'iee', 'uu':'iuu', 'oo':'ioo' },
        'ee': { 'a':'ee', 'i':'ee', 'e':'ee', 'u':'ee', 'o':'ee', 'y':'y', 'aa':'aa', 'ii':'ii', 'ee':'ee', 'uu':'uu', 'oo':'oo' },
        'uu': { 'a':'uu', 'i':'ii', 'e':'uu', 'u':'uu', 'o':'oo', 'y':'uu','aa':'aa', 'ii':'ii', 'ee':'uu', 'uu':'uu', 'oo':'oo' },
        'oo': { 'a':'oo', 'i':'oi', 'e':'oo', 'u':'oo', 'o':'oo', 'y':'oo','aa':'aa', 'ii':'oi', 'ee':'oo', 'uu':'oo', 'oo':'oo' }
    },

    combineVowels: function(v1, v2, precedingText = "") {
    let result = this.vowelMatrix[v1]?.[v2] || v1;

    // 1. Identify the immediately preceding consonant
    const lastChar = precedingText.slice(-1).toLowerCase();
    // 2. Identify the cluster (the last two characters)
    const cluster = precedingText.slice(-2).toLowerCase();

    const glidables = ['t', 'd', 'k', 's', 'r'];
    const forbiddenClusters = ['tr', 'pr', 'kr', 'ts'];

    // Check if we should apply the glide
    if (glidables.includes(lastChar)) {
        // BLOCKED: If the cluster is in our forbidden list, do NOT glide
        if (forbiddenClusters.includes(cluster)) {
            // Keep the 'i' version (the first option in your table)
            // No changes needed to 'result' as the matrix defaults to 'i'
        } 
        // ALLOWED: Apply the glide
        else if (result.startsWith('i') && result.length > 1) {
            result = 'j' + result.slice(1);
        }
    }
    
    return result;
},

    // Helper to get full vowel at start or end (handles long vowels like 'aa')
    getVowelCluster: function(text, fromStart = true) {
        const vowels = "aeiouy";
        if (fromStart) {
            let v = text[0];
            if (vowels.includes(text[1]) && text[1] === v) return v + v;
            return v;
        } else {
            let v = text.slice(-1);
            let p = text.slice(-2, -1);
            if (vowels.includes(p) && p === v) return v + v;
            return v;
        }
    },

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
        const vowels = "aeiouy";
        const pLastV = this.getVowelCluster(prefix, false);
        const sFirstV = this.getVowelCluster(stem, true);

        if (vowels.includes(pLastV[0]) && vowels.includes(sFirstV[0])) {
            const preceding = prefix.slice(0, -pLastV.length); 
            const combined = this.combineVowels(pLastV, sFirstV, preceding);
            
            return prefix.slice(0, -pLastV.length) + combined + stem.slice(sFirstV.length);
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
                "future in future": "i", future: "am", infinitive: "te" 
            },
            continuous: { 
                past: "avi", pluperfect: "wachi", perfect: "wan", 
                "future in past": "wes", "future perfect": "we", 
                "future in future": "ai", future: "wum", infinitive: "aate" 
            },
            habitual: { 
                past: "tsevi", perfect: "tsan", present: "tse" 
            }
        };

        return chart[aspect]?.[time] ?? "";
    },

    applySuffixPhonology: function(stem, suffix) {
        if (!suffix) return stem;
        const vowels = "aeiouy";
        const sLastV = this.getVowelCluster(stem, false);
        const sufFirstV = this.getVowelCluster(suffix, true);

        if (vowels.includes(sLastV[0]) && vowels.includes(sufFirstV[0])) {
            const preceding = stem.slice(0, -sLastV.length); 
            const combined = this.combineVowels(sLastV, sufFirstV, preceding);

            return stem.slice(0, -sLastV.length) + combined + suffix.slice(sufFirstV.length);
        }
        return stem + suffix;
    },

    // 3. THE MASTER BUILDER
    conjugate: function(verbObj, vClass, person, number, fullTense) {
        const stem = verbObj.stem;
        let res = stem;

        // 1. Only apply prefix if person is actually provided
        if (person) {
            const rawPrefix = this.getPronoun(vClass, person, "informal", number);
            res = this.applyPrefixPhonology(rawPrefix, stem);
        }

        // 2. Get the suffix (this will now look for "infinitive" in your chart)
        const rawSuffix = this.getTense(fullTense);
        
        // 3. Apply suffix phonology (handles vowel clashes like 'aim' + 'te')
        return this.applySuffixPhonology(res, rawSuffix);
    },
};