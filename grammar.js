/**
 * GRAMMAR.JS
 * Core linguistic engine for Tvaali.
 * Order: 1. Shortcuts, 2. Utilities, 3. Noun Engine, 4. Verb Engine
 */

/* ==========================================================================
   1. GLOBAL INITIALIZATION & SHORTCUTS
   ========================================================================== */

/* ==========================================================================
   2. SHARED LINGUISTIC UTILITIES
   ========================================================================== */

const TvaaliUtil = {
    vowels: "aeiouy",

    getEndingType: function(word) {
        if (!word) return "consonant";
        const last = word.slice(-1), pen = word.slice(-2, -1);
        if (!this.vowels.includes(last)) return "consonant";
        return (last === pen || (pen === 'a' && last === 'i') || (pen === 'o' && last === 'i')) 
            ? "longVowel" : "vowel";
    },

    getVowelCluster: function(text, fromStart = true) {
        if (!text) return "";
        if (fromStart) {
            let v = text[0];
            return (this.vowels.includes(text[1]) && (text[1] === v || "ao".includes(v) && text[1] === 'i')) 
                ? text.slice(0, 2) : v;
        } else {
            let v = text.slice(-1), p = text.slice(-2, -1);
            return (this.vowels.includes(p) && (p === v || "ao".includes(p) && v === 'i')) 
                ? text.slice(-2) : v;
        }
    },

    parseNumber: function(str) {
        const parts = str.split("-");
        let total = 0, currentCount = 0;
        const nameToVal = {};
        Object.entries(numbers).forEach(([n, o]) => { nameToVal[o.cardinal] = nameToVal[o.ordinal] = parseInt(n); });
        const baseToVal = {};
        Object.entries(numBases).forEach(([v, n]) => { baseToVal[n] = baseToVal[n + "ar"] = parseInt(v); });

        parts.forEach((p, i) => {
            if (nameToVal[p] !== undefined) {
                currentCount = nameToVal[p];
                if (i === parts.length - 1) total += currentCount;
            } else if (baseToVal[p] !== undefined) {
                total += (currentCount || 1) * baseToVal[p];
                currentCount = 0;
            }
        });
        return total;
    }
};

/* ==========================================================================
   3. NOUN ENGINE (nounCaser)
   ========================================================================== */

const nounCaser = {
    // INTERNAL HELPERS
    _executeSuffix: function(root, suffix, endingType) {
        if (!suffix) return root;
        // If suffix doesn't start with '-', it's a direct attachment
        if (!suffix.startsWith("-")) return root + suffix;
        // If it starts with '-', we drop the stem's final vowel(s) first
        return root.slice(0, (endingType === "longVowel" ? -2 : -1)) + suffix.slice(1);
    },

    _resolveFromTable: function(root, row, nClass, number, endingType) {
        if (!row) return root;
        if (nClass === "animate") {
            const i = ["singular", "dual", "paucal", "plural"].indexOf(number);
            return this._executeSuffix(root, row.anim[i], endingType);
        }
        if (nClass === "inanimate") {
            const i = (number === "plural") ? 1 : 0;
            return this._executeSuffix(root, row.inan[i], endingType);
        }
        if (nClass === "abstract") {
            return this._executeSuffix(root, row.abs, endingType);
        }
        return root;
    },

    // CASE METHODS
    getNominative: function(nounObj, number = "singular") {
        const { root, class: nClass } = nounObj;
        const ending = TvaaliUtil.getEndingType(root);
        const suffixes = {
            vowel: { anim: ["", "-as", "-at", "-ak"], inan: ["-at", ""], abs: "" },
            consonant: { anim: ["", "as", "at", "ak"], inan: ["at", ""], abs: "" },
            longVowel: { anim: ["", "s", "t", "k"], inan: ["t", ""], abs: "" }
        };
        return this._resolveFromTable(root, suffixes[ending] || suffixes.consonant, nClass, number, ending);
    },

    getAccusative: function(nounObj, number = "singular") {
        const { root, class: nClass } = nounObj;
        if (nClass !== "animate") return root; 

        const ending = TvaaliUtil.getEndingType(root);
        const lastChar = root.slice(-1).toLowerCase();

        if (ending === "consonant") {
            const conTable = {
                'n': { sg: "am", du: "",    pau: "tham", pl: "kam" },
                'm': { sg: "am", du: "",    pau: "dham", pl: "kam" },
                's': { sg: "am", du: "",    pau: "tam",  pl: "kam" },
                'r': { sg: "am", du: "s",   pau: "t",    pl: "k" }, 
                'k': { sg: "am", du: "s",   pau: "r",    pl: "am" },
                't': { sg: "am", du: "s",   pau: "am",   pl: "r" }
            };
            const row = conTable[lastChar] || conTable['n'];
            const keys = { singular: "sg", dual: "du", paucal: "pau", plural: "pl" };
            const val = row[keys[number]];
            
            if (!val) return root; 
            if (val.length === 1) return root.slice(0, -1) + val + lastChar + "am";
            if (val === "am" && (lastChar === 't' || lastChar === 'k')) return root.slice(0, -1) + "am";
            return root + val;
        }

        const vSuffix = { 
            singular: (lastChar === 'o' && ending === "vowel" ? "-am" : "m"), 
            dual: "sa", paucal: "ta", plural: "ka" 
        };
        return this._executeSuffix(root, vSuffix[number], ending);
    },

    getErgative: function(nounObj, number = "singular") {
        const { root, class: nClass } = nounObj;
        if (nClass === "animate") return "N/A";
        const ending = TvaaliUtil.getEndingType(root);

        if (nClass === "inanimate") {
            const suffix = (number === "singular") ? "oot" : "oo";
            return (ending === "consonant") ? root + suffix : root.replace(/[aeiouy]+$/i, "") + suffix;
        }

        if (nClass === "abstract") {
            const last = root.slice(-1).toLowerCase();
            const rowMap = { n: "oo", m: "-noo", k: "-noo", t: "-noo", s: "noo", r: "noo" };
            const suffix = (ending === "consonant") ? (rowMap[last] || "noo") : "noo";
            return this._executeSuffix(root, suffix, ending);
        }
        return root;
    },

    getDative: function(nounObj, number = "singular") {
        const { root, class: nClass } = nounObj;
        const ending = TvaaliUtil.getEndingType(root);
        const last = root.slice(-1).toLowerCase();
        const suffixes = {
            'n': { anim: ["tho", "thas", "that", "thak"], inan: ["that", "tho"], abs: "tho" },
            'm': { anim: ["dho", "dhas", "dhat", "dhak"], inan: ["dhat", "dho"], abs: "ndho" },
            's': { anim: ["tho", "thas", "that", "thak"], inan: ["that", "tho"], abs: "ntho" },
            'r': { anim: ["tho", "sro", "tro", "kro"],    inan: ["tro", "thro"], abs: "ntro" },
            'k': { anim: ["ro", "ros", "rot", "rok"],     inan: ["rot", "ro"],   abs: "ntho" },
            't': { anim: ["o", "os", "ot", "ok"],         inan: ["ot", "oo"],    abs: "ntho" },
            'vowel': { anim: ["tho", "thas", "that", "thak"], inan: ["that", "tho"], abs: "ntho" }
        };
        let row = ending.includes("vowel") ? suffixes.vowel : (suffixes[last] || suffixes.n);
        return this._resolveFromTable(root, row, nClass, number, ending);
    },

    getGenitive: function(nounObj, number = "singular") {
        const { root, class: nClass } = nounObj;
        const ending = TvaaliUtil.getEndingType(root);
        const last = root.slice(-1).toLowerCase();
        const suffixes = {
            'n': { anim: ["on", "os", "ot", "ok"], inan: ["ot", "on"], abs: "on" },
            'm': { anim: ["on", "os", "ot", "ok"], inan: ["ot", "on"], abs: "-non" },
            's': { anim: ["on", "os", "ot", "ok"], inan: ["ot", "on"], abs: "non" },
            't': { anim: ["on", "-ntos", "-ntot", "-ntok"], inan: ["-ntot", "on"], abs: "-non" },
            'vowel': { anim: ["-on", "-os", "-ot", "-ok"], inan: ["-ot", "-on"], abs: "non" },
            'longVowel': { anim: ["no", "so", "to", "ko"], inan: ["to", "no"], abs: "non" },
        };
        const rowMap = { k: 'm', r: 's', t: 't' };
        let row = (ending === "longVowel") ? suffixes.longVowel : 
                  (ending === "vowel") ? suffixes.vowel : 
                  (suffixes[rowMap[last] || last] || suffixes.n);
        return this._resolveFromTable(root, row, nClass, number, ending);
    },

    getLocative: function(nounObj, number = "singular") {
        const { root, class: nClass } = nounObj;
        const ending = TvaaliUtil.getEndingType(root);
        const last = root.slice(-1).toLowerCase();
        const suffixes = {
            'n': { anim: ["oi", "ois", "oit", "oik"], inan: ["oit", "oi"], abs: "oi" },
            'm': { anim: ["oi", "ois", "oit", "oik"], inan: ["oit", "oi"], abs: "-noi" },
            's': { anim: ["oi", "ois", "oit", "oik"], inan: ["oit", "oi"], abs: "noi" },
            'vowel': { anim: ["-oi", "-ois", "-oit", "-oik"], inan: ["-oit", "-oi"], abs: "noi" },
            'longVowel': { anim: ["noi", "soi", "toi", "koi"], inan: ["toi", "noi"], abs: "noi" }
        };
        const rowMap = { k: 'm', t: 'm', r: 's' };
        let row = (ending === "longVowel") ? suffixes.longVowel : 
                  (ending === "vowel") ? suffixes.vowel : 
                  (suffixes[rowMap[last] || last] || suffixes.n);
        return this._resolveFromTable(root, row, nClass, number, ending);
    },

    getTransportative: function(nounObj, number = "singular") {
        const { root, class: nClass } = nounObj;
        const ending = TvaaliUtil.getEndingType(root);
        const suffixes = {
            'n': { anim: ["iir", "iis", "iit", "iik"], inan: ["iit", "oor"], abs: "" },
            'vowel': { anim: ["-iir", "-iis", "-iit", "-iik"], inan: ["-iit", "-iir"], abs: "" }
        };
        let row = (ending.includes("vowel")) ? suffixes.vowel : suffixes.n;
        return this._resolveFromTable(root, row, nClass, number, ending);
    },

    getAllative: function(nounObj, number = "singular") {
        const { root, class: nClass } = nounObj;
        const ending = TvaaliUtil.getEndingType(root);
        const last = root.slice(-1).toLowerCase();
        const suffixes = {
            'n': { anim: ["et", "es", "et", "ek"], inan: ["et", "ot"], abs: "" },
            's': { anim: ["et", "-tses", "-tset", "-tsek"], inan: ["-tset", "-tsot"], abs: "" },
            'a': { anim: ["-et", "-es", "-et", "-ek"], inan: ["-et", "-ot"], abs: "" },
            'o': { anim: ["-et", "-es", "-et", "-ek"], inan: ["-et", "ta"], abs: "" },
            'vowel': { anim: ["t", "s", "t", "k"], inan: ["t", "-ot"], abs: "" },
            'longVowel': { anim: ["te", "se", "te", "ke"], inan: ["te", "te"], abs: "" },
        };
        const rowMap = { m: 'n', k: 'n', t: 'n', r: 'n' };
        let row = (ending === "longVowel") ? suffixes.longVowel : 
                  (ending === "vowel") ? (suffixes[last] || suffixes.vowel) : 
                  (suffixes[rowMap[last] || last] || suffixes.n);
        return this._resolveFromTable(root, row, nClass, number, ending);
    },

    getAblative: function(nounObj, number = "singular") {
        const { root, class: nClass } = nounObj;
        const ending = TvaaliUtil.getEndingType(root);
        const last = root.slice(-1).toLowerCase();
        const suffixes = {
            'n': { anim: ["an", "atsa", "antha", "anka"], inan: ["antha", "ano"], abs: "ano" },
            's': { anim: ["an", "-tsa", "antha", "anka"], inan: ["antha", "ano"], abs: "ano" },
            'vowel': { anim: ["n", "tsa", "ntha", "nka"], inan: ["ntha", "n"], abs: "n" },
            'longVowel': { anim: ["ni", "si", "ti", "ki"], inan: ["ti", "ni"], abs: "ni" },
        };
        const rowMap = { m: 'n', k: 'n', t: 'n', r: 'n' };
        let row = (ending === "longVowel") ? suffixes.longVowel : 
                  (ending === "vowel") ? suffixes.vowel : 
                  (suffixes[rowMap[last] || last] || suffixes.n);
        return this._resolveFromTable(root, row, nClass, number, ending);
    },

    getInstrumental: function(nounObj, number = "singular") {
        const { root, class: nClass } = nounObj;
        const ending = TvaaliUtil.getEndingType(root);
        const last = root.slice(-1).toLowerCase();
        const suffixes = {
            'n': { anim: ["u", "us", "ut", "uk"], inan: ["ut", "u"], abs: "tu" },
            'm': { anim: ["u", "us", "ut", "uk"], inan: ["u", "ut"], abs: "-nu" },
            's': { anim: ["u", "us", "ut", "uk"], inan: ["ut", "u"], abs: "nu" },
            'vowel': { anim: ["-u", "-us", "-ut", "-uk"], inan: ["-ut", "-u"], abs: "nu" },
            'longVowel': { anim: ["du", "su", "tu", "ku"], inan: ["tu", "du"], abs: "nu" },
        };
        const rowMap = { k: 'm', t: 'm', r: 's' };
        let row = (ending === "longVowel") ? suffixes.longVowel : 
                  (ending === "vowel") ? suffixes.vowel : 
                  (suffixes[rowMap[last] || last] || suffixes.n);
        return this._resolveFromTable(root, row, nClass, number, ending);
    },

    getComitative: function(nounObj, number = "singular") {
        const { root, class: nClass } = nounObj;
        const ending = TvaaliUtil.getEndingType(root);
        const last = root.slice(-1).toLowerCase();
        const suffixes = {
            'n': { anim: ["ym", "ys", "yt", "yk"], inan: ["yt", "om"], abs: "ym" },
            'm': { anim: ["ym", "ys", "yt", "yk"], inan: ["yt", "om"], abs: "-nym" },
            's': { anim: ["ym", "ys", "yt", "yk"], inan: ["yt", "om"], abs: "nym" },
            'vowel': { anim: ["-ym", "-ys", "-yt", "-yk"], inan: ["-yt", "-ym"], abs: "nym" },
            'longVowel': { anim: ["my", "sy", "ty", "ky"], inan: ["ty", "my"], abs: "nym" },
        };
        const rowMap = { k: 'm', t: 'm', r: 's' };
        let row = (ending === "longVowel") ? suffixes.longVowel : 
                  (ending === "vowel") ? suffixes.vowel : 
                  (suffixes[rowMap[last] || last] || suffixes.n);
        return this._resolveFromTable(root, row, nClass, number, ending);
    }
};

/* ==========================================================================
   4. VERB ENGINE (verbConjugator)
   ========================================================================== */

const verbConjugator = {
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

    /* --- PHONOLOGY HELPERS --- */
    
    // Combines vowels based on your matrix and handles "glides" (the slashes)
    combineVowels: function(v1, v2, precedingText = "") {
        let result = this.vowelMatrix[v1]?.[v2] || v1;

        if (result.includes('/')) {
            const parts = result.split('/');
            const lastChar = precedingText.slice(-1).toLowerCase();
            const cluster = precedingText.slice(-2).toLowerCase();
            
            const glidables = ['t', 'd', 'k', 's', 'r'];
            const forbiddenClusters = ['tr', 'pr', 'kr', 'ts'];

            // Use the glide (e.g., 'ja') if following a glidable consonant, 
            // provided it doesn't create a forbidden cluster.
            result = (glidables.includes(lastChar) && !forbiddenClusters.includes(cluster)) 
                ? parts[1] : parts[0];
        }

        // Clean up redundant diphthong clusters
        if (precedingText.endsWith('a') && result === 'ai') return 'i'; 
        if (precedingText.endsWith('o') && result === 'oi') return 'i';
        
        return result;
    },

    // Standard engine for attaching prefixes or suffixes while obeying Tvaali phonology
    applyAffix: function(base, affix, isPrefix = false) {
        if (!affix) return base;
        
        const bCluster = TvaaliUtil.getVowelCluster(base, isPrefix);
        const aCluster = TvaaliUtil.getVowelCluster(affix, !isPrefix);

        // If both touching parts are vowels, trigger the Vowel Matrix logic
        if (TvaaliUtil.vowels.includes(bCluster[0]) && TvaaliUtil.vowels.includes(aCluster[0])) {
            const preceding = isPrefix ? affix.slice(0, -aCluster.length) : base.slice(0, -bCluster.length);
            const v1 = isPrefix ? aCluster : bCluster;
            const v2 = isPrefix ? bCluster : aCluster;
            const combined = this.combineVowels(v1, v2, preceding);
            
            return isPrefix 
                ? affix.slice(0, -aCluster.length) + combined + base.slice(bCluster.length)
                : base.slice(0, -bCluster.length) + combined + affix.slice(aCluster.length);
        }
        
        return isPrefix ? affix + base : base + affix;
    },

    /* --- MORPHOLOGY METHODS --- */

    getPronoun: function(vClass, person, formality, number) {
        const p = person.split(" ")[0];
        
        const table = {
            "1st": {
                inclusive: { singular: "", dual: "iis", paucal: "iitaa", plural: "kii" },
                exclusive: { dual: "sa", paucal: "achtaa", plural: "iitha" }
            },
            "2nd": {
                formal: { singular: "iichte", dual: "iichtes", plural: "ikraa" },
                informal: { singular: "tsi", dual: "tsisa", paucal: "tsitaa", plural: "raa" }
            },
            "3rd": {
                animate: { singular: "tha", dual: "thasa", paucal: "thadaa", plural: "am" },
                inanimate: { singular: "ne", plural: "pe" },
                abstract: { singular: "rii" }
            },
            "indef": {
                animate: { singular: "vi", dual: "vasa", plural: "viraa" },
                inanimate: { singular: "ivi", plural: "iviraa" }
            }
        };

        const group = table[p];
        if (!group) return "";

        // Resolve sub-class (e.g., animate vs inanimate or formal vs informal)
        const subClass = group[vClass] || group[formality] || group;
        return subClass[number] || "";
    },

    getTense: function(fullTense) {
        if (!fullTense) return "";
        const [time, aspect = "perfective"] = fullTense.split(" ");

        // Present Perfective/Continuous is unmarked (null)
        if (time === "present" && (aspect === "perfective" || aspect === "continuous")) return "";

        const chart = {
            perfective: { 
                past: "evi", pluperfect: "echti", perfect: "an", 
                "future in past": "es", "future perfect": "e", 
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

        return chart[aspect]?.[time] || "";
    },

    modals: {
        indicative:  { base: "",      interrogative: "ree" },
        speculative: { base: "chaa",  interrogative: "charee" },
        deductive:   { base: "niir",  interrogative: "niree" },
        assumptive:  { base: "maan",  interrogative: "maree" },
        abilitive:   { base: "staa",  interrogative: "staree" },
        volitive:    { base: "poo",   interrogative: "poree" },
        permissive:  { base: "par",   interrogative: "per" },
        obligative:  { base: "nuupar", interrogative: "nupeer" },
        commissive:  { base: "taa",   interrogative: "taree" },
        optative:    { base: "zoku",  interrogative: "zokree" },
        conditional: { base: "huu",   interrogative: "huree" },
        honorific:   { base: "maida", interrogative: "mairee" }
    },

    getModal: function(type, isInterrogative) {
        const m = this.modals[type || "indicative"];
        return isInterrogative ? m.interrogative : m.base;
    },

    // Simple boolean/lookup flags
    getPassive: (val) => val ? "te" : "",
    getDetransitive: (val) => val ? "tsu" : "",
    getReflexive: (val) => val ? "raa" : "",
    getCausative: (val) => val ? "so" : "",
    getNegation: (val) => val ? "tai" : "",
    
    getApplicative: function(type) {
        const apps = { benefactive: "dhe", instrumental: "hi", directive: "ba", comitative: "mi", ablative: "du" };
        return apps[type] || "";
    },

    getEvidential: function(type) {
        const evs = { reportative: "vigaa", inferential: "iwosaa", dubitative: "vigigaa" };
        return evs[type] || "";
    },

    getConverb: function(type) {
        const cvbs = { imperfective: "tho", perfective: "as", causal: "ri", purposive: "thohi", concessive: "aam", terminative: "dho", resultative: "oku", conditional: "iime", preparative: "ves", consecutive: "ire", immediative: "", sequencial: "lus" };
        return cvbs[type] || "";
    },
    /* ==========================================================================
       THE MASTER BUILDER
       Order: Subject - Passive - Applicative - Detransative - STEM - 
              Tense - Converb - Modal - Causative - Reflexive - 
              Evidential - Negation
       ========================================================================== */
    conjugate: function(verbObj, vClass, person, number, fullTense, options = {}) {
        let res = verbObj.stem;

        // --- 1. PREFIX CHAIN (Moving outwards from the Stem) ---
        // Detransitive
        if (options.detransitive) {
            res = this.applyAffix(res, this.getDetransitive(true), true);
        }
        // Applicative
        if (options.applicative) {
            res = this.applyAffix(res, this.getApplicative(options.applicative), true);
        }
        // Passive
        if (options.passive) {
            res = this.applyAffix(res, this.getPassive(true), true);
        }
        // Subject Marker (Outer-most)
        if (person) {
            const formality = options.formality || "informal";
            const subPrefix = this.getPronoun(vClass, person, formality, number);
            res = this.applyAffix(res, subPrefix, true);
        }

        // --- 2. SUFFIX CHAIN (Moving outwards from the Stem) ---
        // Tense
        res = this.applyAffix(res, this.getTense(fullTense), false);

        // Converb
        if (options.converb) {
            res = this.applyAffix(res, this.getConverb(options.converb), false);
        }
        // Modal
        if (options.modal || options.interrogative) {
            const modalSuf = this.getModal(options.modal || "indicative", options.interrogative);
            res = this.applyAffix(res, modalSuf, false);
        }
        // Causative
        if (options.causative) {
            res = this.applyAffix(res, this.getCausative(true), false);
        }
        // Reflexive
        if (options.reflexive) {
            res = this.applyAffix(res, this.getReflexive(true), false);
        }
        // Evidential
        if (options.evidential) {
            res = this.applyAffix(res, this.getEvidential(options.evidential), false);
        }
        // Negation
        if (options.negated) {
            res = this.applyAffix(res, this.getNegation(true), false);
        }

        return res;
    }
};

/* ==========================================================================
   5. GLOBAL EXPOSURE & LATE INITIALIZATION
   ========================================================================== */

// 1. Attach engines to window so dictionary.js and lessons can see them
window.nounCaser = nounCaser;
window.verbConjugator = verbConjugator;
window.TvaaliUtil = TvaaliUtil;

// 2. Map Case Shortcuts
window.NOM = (obj, num) => nounCaser.getNominative(obj, num);
window.ACC = (obj, num) => nounCaser.getAccusative(obj, num);
window.ERG = (obj, num) => nounCaser.getErgative(obj, num);
window.DAT = (obj, num) => nounCaser.getDative(obj, num);
window.GEN = (obj, num) => nounCaser.getGenitive(obj, num);
window.LOC = (obj, num) => nounCaser.getLocative(obj, num);
window.TRA = (obj, num) => nounCaser.getTransportative(obj, num);
window.ALL = (obj, num) => nounCaser.getAllative(obj, num);
window.ABL = (obj, num) => nounCaser.getAblative(obj, num);
window.INS = (obj, num) => nounCaser.getInstrumental(obj, num);
window.COM = (obj, num) => nounCaser.getComitative(obj, num);
window.CONJ = (...args) => verbConjugator.conjugate(...args);
window.parseTvaaliNumber = (str) => TvaaliUtil.parseNumber(str);

// 3. The "Fix-It" Function: Merges dictionary data after everything loads
window.addEventListener('load', () => {
    if (typeof generateMorphologyMap === "function") {
        const dictionaryMap = generateMorphologyMap();
        window.tvaaliLookup = Object.assign({}, dictionaryMap, window.tvaaliLookup);
        console.log("Tvaali Engine: Dictionary Map Integrated.");
    } else {
        console.error("Tvaali Engine: could not find generateMorphologyMap in dictionary.js");
    }
});