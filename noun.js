const nounCaser = {
    // === 1. CORE HELPERS (Internal use) ===
    
    // Shared logic for slicing stems and adding suffixes
    // We moved the longVowel logic here so it's defined only once
    _executeSuffix: function(root, suffix, endingType) {
        if (!suffix) return root;
        if (!suffix.startsWith("-")) return root + suffix;
        
        return root.slice(0, (endingType === "longVowel" ? -2 : -1)) + suffix.slice(1);
    },

    // Standard logic to pick the correct suffix from a table row based on Class/Number
    _resolveFromTable: function(root, row, nClass, number, endingType) {
        if (!row) {
            console.warn("Missing suffix row for:", endingType);
            return root;
        }
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

    // === 2. LINGUISTIC UTILITIES ===

    getVowelCluster: function(text, fromStart = true) {
        const vowels = "aeiouy";
        if (fromStart) {
            let v = text[0];
            return (vowels.includes(text[1]) && text[1] === v) ? v + v : v;
        } else {
            let v = text.slice(-1), p = text.slice(-2, -1);
            return (vowels.includes(p) && p === v) ? v + v : v;
        }
    },

    getEndingType: function(word) {
        if (!word) return "consonant";
        const vowels = "aeiouy", last = word.slice(-1), pen = word.slice(-2, -1);
        if (!vowels.includes(last)) return "consonant";
        return (last === pen || (pen === 'a' && last === 'i') || (pen === 'o' && last === 'i')) 
            ? "longVowel" : "vowel";
    },

/* ==========================================================================
    NOMINATIVE
========================================================================== */
    getNominative: function(nounObj, number = "singular") {
        const { root, class: nClass } = nounObj;
        const ending = this.getEndingType(root);

        const suffixes = {
            vowel: { anim: ["", "-as", "-at", "-ak"], inan: ["-at", ""], abs: "" },
            consonant: { anim: ["", "as", "at", "ak"], inan: ["at", ""], abs: "" },
            longVowel: { anim: ["", "s", "t", "k"], inan: ["t", ""], abs: "" }
        };

        const row = suffixes[ending] || suffixes.consonant;

        return this._resolveFromTable(root, row, nClass, number, ending);
    },

/* ==========================================================================
    ACCUSATIVE
========================================================================== */
    getAccusative: function(nounObj, number = "singular") {
        const { root, class: nClass } = nounObj;
        if (nClass !== "animate") return root; // Only Animate is marked

        const ending = this.getEndingType(root);
        const lastChar = root.slice(-1).toLowerCase();

        // Table for consonant infixes/suffixes
        const conTable = {
            'n': { sg: "am", du: "",    pau: "tham", pl: "kam" },
            'm': { sg: "am", du: "",    pau: "dham", pl: "kam" },
            's': { sg: "am", du: "",    pau: "tam",  pl: "kam" },
            'r': { sg: "am", du: "s",   pau: "t",    pl: "k" }, 
            'k': { sg: "am", du: "s",   pau: "r",    pl: "am" },
            't': { sg: "am", du: "s",   pau: "am",   pl: "r" }
        };

        if (ending === "consonant") {
            const row = conTable[lastChar] || conTable['n'];
            const keys = { singular: "sg", dual: "du", paucal: "pau", plural: "pl" };
            const val = row[keys[number]];
            
            if (!val) return root; 
            // Logic for infixes (s, t, k, r)
            if (val.length === 1) return root.slice(0, -1) + val + lastChar + "am";
            // Logic for k/t stems that drop the consonant before 'am'
            if (val === "am" && (lastChar === 't' || lastChar === 'k')) return root.slice(0, -1) + "am";
            
            return root + val;
        }

        // Vowel Logic using the shared helper
        const vSuffix = { singular: (lastChar === 'o' && ending === "vowel" ? "-am" : "m"), dual: "sa", paucal: "ta", plural: "ka" };
        return this._executeSuffix(root, vSuffix[number], ending);
    },

/* ==========================================================================
    ERGATIVE
========================================================================== */
    getErgative: function(nounObj, number = "singular") {
        const { root, class: nClass } = nounObj;
        const ending = this.getEndingType(root);
        const last = root.slice(-1).toLowerCase();

        if (nClass === "animate") return root;

        if (nClass === "inanimate") {
            const suffix = (number === "singular") ? "oot" : "oo";
            return (ending === "consonant") ? root + suffix : root.replace(/[aeiouy]+$/i, "") + suffix;
        }

        if (nClass === "abstract") {
            const rowMap = { n: "oo", m: "-noo", k: "-noo", t: "-noo", s: "noo", r: "noo" };
            const suffix = (ending === "consonant") ? (rowMap[last] || "noo") : "noo";
            return this._executeSuffix(root, suffix, ending);
        }

        return root;
    },

/* ==========================================================================
    DATIVE
========================================================================== */
    getDative: function(nounObj, number = "singular") {
        const { root, class: nClass } = nounObj;
        const ending = this.getEndingType(root);
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

/* ==========================================================================
    GENITIVE
========================================================================== */
    getGenitive: function(nounObj, number = "singular") {
        const { root, class: nClass } = nounObj;
        const ending = this.getEndingType(root);
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
        let row;
        if (ending === "longVowel") row = suffixes.longVowel;
        else if (ending === "vowel") row = suffixes.vowel;
        else row = suffixes[rowMap[last] || last] || suffixes.n;

        return this._resolveFromTable(root, row, nClass, number, ending);
    },

/* ==========================================================================
    LOCATIVE
========================================================================== */
    getLocative: function(nounObj, number = "singular") {
        const { root, class: nClass } = nounObj;
        const ending = this.getEndingType(root);
        const last = root.slice(-1).toLowerCase();

        const suffixes = {
            'n': { anim: ["oi", "ois", "oit", "oik"], inan: ["oit", "oi"], abs: "oi" },
            'm': { anim: ["oi", "ois", "oit", "oik"], inan: ["oit", "oi"], abs: "-noi" },
            's': { anim: ["oi", "ois", "oit", "oik"], inan: ["oit", "oi"], abs: "noi" },
            'vowel': { anim: ["-oi", "-ois", "-oit", "-oik"], inan: ["-oit", "-oi"], abs: "noi" },
            'longVowel': { anim: ["noi", "soi", "toi", "koi"], inan: ["toi", "noi"], abs: "noi" }
        };

        const rowMap = { k: 'm', t: 'm', r: 's' };
        let row;
        if (ending === "longVowel") row = suffixes.longVowel;
        else if (ending === "vowel") row = suffixes.vowel;
        else row = suffixes[rowMap[last] || last] || suffixes.n;

        return this._resolveFromTable(root, row, nClass, number, ending);
    },

/* ==========================================================================
    TRANSPORTATIVE
========================================================================== */
    getTransportative: function(nounObj, number = "singular") {
        const { root, class: nClass } = nounObj;
        const ending = this.getEndingType(root);
        const last = root.slice(-1).toLowerCase();

        const suffixes = {
            'n': { anim: ["iir", "iis", "iit", "iik"], inan: ["iit", "oor"], abs: "" },
            'vowel': { anim: ["iir", "iis", "iit", "iik"], inan: ["iit", "iir"], abs: "" }
        };

        let row = (ending === "longVowel" || ending === "vowel") ? suffixes.vowel : suffixes.n;
        return this._resolveFromTable(root, row, nClass, number, ending);
    },

/* ==========================================================================
    ALLATIVE
========================================================================== */
    getAllative: function(nounObj, number = "singular") {
        const { root, class: nClass } = nounObj;
        const ending = this.getEndingType(root);
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
        let row;
        if (ending === "longVowel") row = suffixes.longVowel;
        else if (ending === "vowel") row = suffixes[last] || suffixes.vowel;
        else row = suffixes[rowMap[last] || last] || suffixes.n;

        return this._resolveFromTable(root, row, nClass, number, ending);
    },

/* ==========================================================================
    ABLATIVE
========================================================================== */
    getAblative: function(nounObj, number = "singular") {
        const { root, class: nClass } = nounObj;
        const ending = this.getEndingType(root);
        const last = root.slice(-1).toLowerCase();

        const suffixes = {
            'n': { anim: ["an", "atsa", "antha", "anka"], inan: ["antha", "ano"], abs: "ano" },
            's': { anim: ["an", "-tsa", "antha", "anka"], inan: ["antha", "ano"], abs: "ano" },
            'vowel': { anim: ["n", "tsa", "ntha", "nka"], inan: ["ntha", "n"], abs: "n" },
            'longVowel': { anim: ["ni", "si", "ti", "ki"], inan: ["ti", "ni"], abs: "ni" },
        };

        const rowMap = { m: 'n', k: 'n', t: 'n', r: 'n' };
        let row;
        if (ending === "longVowel") row = suffixes.longVowel;
        else if (ending === "vowel") row = suffixes.vowel;
        else row = suffixes[rowMap[last] || last] || suffixes.n;

        return this._resolveFromTable(root, row, nClass, number, ending);
    },

/* ==========================================================================
    INSTRUMENTAL
========================================================================== */
    getInstrumental: function(nounObj, number = "singular") {
        const { root, class: nClass } = nounObj;
        const ending = this.getEndingType(root);
        const last = root.slice(-1).toLowerCase();

        const suffixes = {
            'n': { anim: ["u", "us", "ut", "uk"], inan: ["ut", "u"], abs: "tu" },
            'm': { anim: ["u", "us", "ut", "uk"], inan: ["u", "ut"], abs: "-nu" },
            's': { anim: ["u", "us", "ut", "uk"], inan: ["ut", "u"], abs: "nu" },
            'vowel': { anim: ["-u", "-us", "-ut", "-uk"], inan: ["-ut", "-u"], abs: "nu" },
            'longVowel': { anim: ["du", "su", "tu", "ku"], inan: ["tu", "du"], abs: "nu" },
        };

        const rowMap = { k: 'm', t: 'm', r: 's' };
        let row;
        if (ending === "longVowel") row = suffixes.longVowel;
        else if (ending === "vowel") row = suffixes.vowel;
        else row = suffixes[rowMap[last] || last] || suffixes.n;

        return this._resolveFromTable(root, row, nClass, number, ending);
    },

/* ==========================================================================
    COMITATIVE
========================================================================== */
    getComitative: function(nounObj, number = "singular") {
        const { root, class: nClass } = nounObj;
        const ending = this.getEndingType(root);
        const last = root.slice(-1).toLowerCase();

        const suffixes = {
            'n': { anim: ["ym", "ys", "yt", "yk"], inan: ["yt", "om"], abs: "ym" },
            'm': { anim: ["ym", "ys", "yt", "yk"], inan: ["yt", "om"], abs: "-nym" },
            's': { anim: ["ym", "ys", "yt", "yk"], inan: ["yt", "om"], abs: "nym" },
            'vowel': { anim: ["-ym", "-ys", "-yt", "-yk"], inan: ["-yt", "-ym"], abs: "nym" },
            'longVowel': { anim: ["my", "sy", "ty", "ky"], inan: ["ty", "my"], abs: "nym" },
        };

        const rowMap = { k: 'm', t: 'm', r: 's' };
        let row;
        if (ending === "longVowel") row = suffixes.longVowel;
        else if (ending === "vowel") row = suffixes.vowel;
        else row = suffixes[rowMap[last] || last] || suffixes.n;

        return this._resolveFromTable(root, row, nClass, number, ending);
    }
};

window.NOM = (nounObj, number) => nounCaser.getNominative(nounObj, number);
window.ACC = (nounObj, number) => nounCaser.getAccusative(nounObj, number);
window.ERG = (nounObj, number) => nounCaser.getErgative(nounObj, number);
window.DAT = (nounObj, number) => nounCaser.getDative(nounObj, number);
window.GEN = (nounObj, number) => nounCaser.getGenitive(nounObj, number);
window.LOC = (nounObj, number) => nounCaser.getLocative(nounObj, number);
window.TRA = (nounObj, number) => nounCaser.getTransportative(nounObj, number);
window.ALL = (nounObj, number) => nounCaser.getAllative(nounObj, number);
window.ABL = (nounObj, number) => nounCaser.getAblative(nounObj, number);
window.INS = (nounObj, number) => nounCaser.getInstrumental(nounObj, number);
window.COM = (nounObj, number) => nounCaser.getComitative(nounObj, number);