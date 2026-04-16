const verbConjugator = {
    // Vowel Matrix
    vowelMatrix: {
    'a':  { 'a':'a',  'i':'ai', 'e':'a',  'u':'a',  'o':'ao', 'y':'y', 'aa':'aa', 'ii':'ai', 'ee':'ee', 'uu':'uu', 'oo':'oi', 'ai':'ai', 'oi':'aoi' },
    'i':  { 'a':'a/ja', 'i':'i',  'e':'e/je', 'u':'i/ju', 'o':'o/jo', 'y':'y', 'aa':'aa/jaa', 'ii':'ii', 'ee':'ee/jee', 'uu':'uu/juu', 'oo':'oo/joo', 'ai':'ai/jai', 'oi':'oi/joi' },
    'e':  { 'a':'a',  'i':'i',  'e':'e',  'u':'u',  'o':'o',  'y':'y', 'aa':'aa', 'ii':'ii', 'ee':'ee', 'uu':'uu', 'oo':'oo', 'ai':'ai', 'oi':'oi' },
    'u':  { 'a':'a',  'i':'i',  'e':'u',  'u':'u',  'o':'o',  'y':'y', 'aa':'aa', 'ii':'ii', 'ee':'ee', 'uu':'uu', 'oo':'oo', 'ai':'ai', 'oi':'oi' },
    'o':  { 'a':'a',  'i':'o',  'e':'o',  'u':'o',  'o':'o',  'y':'y', 'aa':'aa', 'ii':'ii', 'ee':'ee', 'uu':'uu', 'oo':'oo', 'ai':'ai', 'oi':'oi' },
    'y':  { 'a':'y',  'i':'y',  'e':'y',  'u':'y',  'o':'y',  'y':'y', 'aa':'aa', 'ii':'ii', 'ee':'y',  'uu':'uu', 'oo':'oo', 'ai':'ai', 'oi':'oi' },
    'aa': { 'a':'aa', 'i':'ai', 'e':'aa', 'u':'aa', 'o':'aa', 'y':'aa','aa':'aa', 'ii':'ai', 'ee':'aa', 'uu':'aa', 'oo':'aa', 'ai':'ai', 'oi':'oi' },
    'ii': { 'a':'ii/jaa','i':'ii', 'e':'ii/jee','u':'ii/juu','o':'ii/joo','y':'ii','aa':'aa/jaa', 'ii':'ii', 'ee':'ee/jee', 'uu':'uu/juu', 'oo':'oo/joo', 'ai':'ai/jai', 'oi':'oi/joi' },
    'ee': { 'a':'ee', 'i':'ee', 'e':'ee', 'u':'ee', 'o':'ee', 'y':'y', 'aa':'aa', 'ii':'ii', 'ee':'ee', 'uu':'uu', 'oo':'oo', 'ai':'ai', 'oi':'oi' },
    'uu': { 'a':'uu', 'i':'ii', 'e':'uu', 'u':'uu', 'o':'oo', 'y':'uu','aa':'aa', 'ii':'ii', 'ee':'uu', 'uu':'uu', 'oo':'oo', 'ai':'ai', 'oi':'oi' },
    'oo': { 'a':'oo', 'i':'oi', 'e':'oo', 'u':'oo', 'o':'oo', 'y':'oo','aa':'aa', 'ii':'oi', 'ee':'oo', 'uu':'oo', 'oo':'oo', 'ai':'ai', 'oi':'oi' },
    'ai': { 'a':'ai', 'i':'ai', 'e':'ai', 'u':'ai', 'o':'ai', 'y':'ai', 'aa':'ai', 'ii':'ai', 'ee':'ai', 'uu':'ao/joo', 'oo':'ai', 'ai':'ai', 'oi':'oi' },
    'oi': { 'a':'oi', 'i':'oi', 'e':'oi', 'u':'oi', 'o':'oi', 'y':'oi', 'aa':'oi', 'ii':'oi', 'ee':'oi', 'uu':'oi', 'oo':'oi', 'ai':'ai', 'oi':'oi' }
},

    getVowelCluster: function(text, fromStart = true) {
        if (!text) return "";
        const vowels = "aeiouy";
        
        if (fromStart) {
            let first = text[0];
            let second = text[1];
            // Check for diphthongs or identical pairs
            if (second && vowels.includes(second)) {
                if (second === first || (first === 'a' && second === 'i') || (first === 'o' && second === 'i')) {
                    return first + second;
                }
            }
            return first;
        } else {
            let last = text.slice(-1);
            let penult = text.slice(-2, -1);
            // Check for diphthongs or identical pairs
            if (penult && vowels.includes(penult)) {
                if (penult === last || (penult === 'a' && last === 'i') || (penult === 'o' && last === 'i')) {
                    return penult + last;
                }
            }
            return last;
        }
    },

    // Helper to get full vowel at start or end (handles long vowels like 'aa')
    combineVowels: function(v1, v2, precedingText = "") {
        let result = this.vowelMatrix[v1]?.[v2] || v1;

        // 1. Handle the "Slash" results (a/ja, ii/jaa, etc.)
        if (result.includes('/')) {
            const parts = result.split('/');
            const lastChar = precedingText.slice(-1).toLowerCase();
            const cluster = precedingText.slice(-2).toLowerCase();
            
            const glidables = ['t', 'd', 'k', 's', 'r'];
            const forbiddenClusters = ['tr', 'pr', 'kr', 'ts'];

            if (glidables.includes(lastChar) && !forbiddenClusters.includes(cluster)) {
                result = parts[1]; // Use glide version (ja, jaa, jai, etc.)
            } else {
                result = parts[0]; // Use vowel version (a, aa, ai, etc.)
            }
        }

        // 2. COLLAPSE LOGIC: Prevent triple-length or redundant clusters
        // Ensures aai -> ai, jaai -> jai, ooi -> oi, etc.
        if (precedingText.endsWith('a') && result === 'ai') return 'i'; // a + ai -> ai
        if (precedingText.endsWith('o') && result === 'oi') return 'i'; // o + oi -> oi
        
        // Specifically handle the "jaa" result from the table to ensure it becomes "jai" if needed
        if (v2 === 'ii' || v2 === 'i') {
            if (result === 'jaa') result = 'jai';
            if (result === 'aa') result = 'ai';
        }

        return result;
    },

    // 1. Prefix pronoun
    getPronoun: function(vClass, person, formality, number) {
        const cleanPerson = person.split(" ")[0];

        if (cleanPerson === "1st") {
            if (vClass === "inclusive") {
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