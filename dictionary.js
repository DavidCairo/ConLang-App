/* ==========================================================================
   NOUNS
   ========================================================================== */

const nouns={
    // Animate
    woman:  {en: "woman",       root:"sidhi",       class:"animate" },
    man:    {en: "man",         root: "oroo",       class: "animate"},
    fire:   {en: "fire",        root: "aahvuu",     class: "animate" },
    bird:   {en: "bird",        root:"djaavuum",    class:"animate"},
    cat:    {en: "cat",         root:"rjiimai",     class:"animate"},
    name:   {en: "name",        root:"naama",       class:"animate"},
    animal: {en: "animal",      root: "tospee",     class:"animate"},
    cattle: {en: "cattle",      root: "nurjo",      class:"animate"},
    child:  {en: "child",       root:"sevaan",      class: "animate"},
    eye:    {en: "eye",         root:"taaram",      class: "animate"},
    river:  {en: "river",       root:"nam",         class:"animate"},
    elder:  {en: "elder",       root:"mamdoo",      class:"animate"},
    warrior:{en: "warrior",     root:"tarkai",      class:"animate"},
    dog:    {en: "dog",         root:"kjooma",      class:"animate"},
    snake:  {en: "snake",       root:"ruveethi",    class:"animte"},
    fish:   {en: "fish",        root:"aalhu",       class: "animate"},
    spirit: {en: "spirit",      root:"nithoo",      class:"animate"},


    // Inanimate
    water:  {en: "water",       root: "aaloo",      class: "inanimate" },
    stone:  {en: "stone",       root:"irni",        class:"inanimate"},
    sun:    {en: "sun",         root:"nedhaan",     class:"inanimate"},
    grass:  {en: "grass",       root:"nimiir",      class:"inanimate"},
    earth:  {en: "earth",       root:"araantho",    class:"inanimate"},
    snow:   {en: "snow",        root:"tsiipli",     class:"inanimate"},
    

    // Abstract
    silence: {en: "silence",    root: "muuna",     class: "abstract" },
    justice: {en: "justice",    root: "raatvu",    class: "abstract" },
    cold:    {en: "cold",       root: "torvoo",    class: "abstract" },
    truth:   {en: "truth",      root: "eemda",     class: "abstract" },
    sleep:   {en: "slepp",      root: "iilhan",    class: "abstract" },
};

/* ==========================================================================
   VERBS
   ========================================================================== */

const verbs={
    love:   {stem: "aim",       trans: true},
    laugh:  {stem: "aahan",     trans: false},
    sleep:  {stem: "iilha",     trans: false},
    see:    {stem:"roshuu",     trans:true},
    fall:   {stem:"liin",       trans:false},
    hit:    {stem:"tarkaa",     trans:true},
    carve:  {stem:"baintras",   trans:true},
    eat:    {stem:"iihes",      trans:true},
    become: {stem:"taan",       trans:true},
    fight:  {stem:"taisuus",    trans:true},
};

/* ==========================================================================
   NUMBERS
   ========================================================================== */

const numbers={
    0: {cardinal: "ny", ordinal: "nyhar"},
    1: {cardinal: "i", ordinal: "iiwar",},
    2: {cardinal: "us", ordinal: "usar",},
    3: {cardinal: "miinee", ordinal: "miigar",},
    4: {cardinal: "gem", ordinal: "gemar",},
    5: {cardinal: "acha", ordinal: "achaar",},
    6: {cardinal: "raqy", ordinal: "raqyhar",},
    7: {cardinal: "lym", ordinal: "lymar",},
    8: {cardinal: "otso", ordinal: "otsowar",},
    9: {cardinal: "naa", ordinal: "naawar",},
    10: {cardinal: "oinen", ordinal: "oinenar",},
    11: {cardinal: "jyn", ordinal: "jynar",},
    12: {cardinal: "tvuum", ordinal:"tvuumar",}
};

const numBases = {
    12: "tvuum",       
    144: "rjaanaa",      
    1728: "chiiqi",
    20736: "kuumi"
};

Object.entries(nouns).forEach(([key, value]) => value.en = key);
Object.entries(verbs).forEach(([key, value]) => value.en = key);


/* ==========================================================================
   VERB LOGIC
   ========================================================================== */
   
const V = (verbObj, nClass = "animate", person = null, number = "singular", tense = "infinitive perfective") => {
    if (!verbObj || !verbObj.stem) return "[Unknown Verb]";
    
    const result = verbConjugator.conjugate(verbObj, nClass, person, number, tense);
    const form = result.toLowerCase();

    tvaaliLookup[form] = {
        en: verbObj.en || "Unknown",
        type: 'verb',
        data: verbObj,
        details: { person, number, tense }
    };

    return result;
};

/* ==========================================================================
   NOUN LOGIC
   ========================================================================== */

function ROOT(item) {
    // 1. Handle Case: input is a string (e.g., ROOT("woman"))
    if (typeof item === 'string') {
        if (!nouns[item]) {
            console.error(`Missing noun in dictionary: ${item}`);
            return "[Unknown]";
        }
        return nouns[item].root;
    }

    // 2. Handle Case: input is an object (e.g., ROOT(nouns.woman))
    if (item && item.root) {
        return item.root;
    }

    // 3. Fallback for invalid input
    console.error("ROOT received an invalid object or missing key:", item);
    return "[Unknown]";
}

const NOM = (nounObj, number = "singular") => {
    if (!nounObj || !nounObj.root) return "[Unknown]";
    const result = nounCaser.getNominative(nounObj, number);

    tvaaliLookup[result.toLowerCase()] = {
        en: nounObj.en,
        type: 'noun',
        data: nounObj,
        details: { case: "NOM", number: number }
    };

    return result;
};
const ERG = (nounObj, number = "singular") => {
    if (!nounObj || !nounObj.root) return "[Unknown]";

    // Split Ergative Logic:
    // If it's Animate, return the custom message instead of the root
    let result;
    if (nounObj.class === "animate") {
        result = "N/A";
    }

    // For Inanimate and Abstract, proceed with the suffix logic
    if (nounObj.class === "inanimate" || nounObj.class === "abstract") {
        result = nounCaser.getErgative(nounObj, number);
    }

    if (result !== "N/A") {
        tvaaliLookup[result.toLowerCase()] = {
            en: nounObj.en,
            type: 'noun',
            data: nounObj,
            details: { case: "ERG", number: number }
        };
    }

    return result;
};
const ACC = (nounObj, number = "singular") => {
    if (!nounObj || !nounObj.root) return "[Unknown]";

    // Rule: Objects of Animates are Accusative; Inanimates are Nominative (Root)
    let result;
    if (nounObj.class === "animate") {
        result = nounCaser.getAccusative(nounObj, number);
    } else {
        result = nounObj.root; // Inanimates stay in Nominative as objects
    }

    tvaaliLookup[result.toLowerCase()] = {
        en: nounObj.en,
        type: 'noun',
        data: nounObj,
        details: { case: "ACC", number: number }
    };

    return result;
};
const DAT = (nounObj, number = "singular") => {
    if (!nounObj || !nounObj.root) return "[Unknown]";

    const result = nounCaser.getDative(nounObj, number);

    tvaaliLookup[result.toLowerCase()] = {
        en: nounObj.en,
        type: 'noun',
        data: nounObj,
        details: { case: "DAT", number: number }
    };

    return result;
};
const GEN = (nounObj, number = "singular") => {
    if (!nounObj || !nounObj.root) return "[Unknown]";

    const result = nounCaser.getGenitive(nounObj, number);
    tvaaliLookup[result.toLowerCase()] = {
        en: nounObj.en,
        type: 'noun',
        data: nounObj,
        details: { case: "GEN", number: number }
    };

    return result;
};
const LOC = (nounObj, number = "singular") => {
    if (!nounObj || !nounObj.root) return "[Unknown]";

    const result = nounCaser.getLocative(nounObj, number);
    tvaaliLookup[result.toLowerCase()] = {
        en: nounObj.en,
        type: 'noun',
        data: nounObj,
        details: { case: "LOC", number: number }
    };

    return result;
};
const TRA = (nounObj, number = "singular") => {
    if (!nounObj || !nounObj.root) return "[Unknown]";

    if (nounObj.class === "abstract") { return "N/A"}

    const result = nounCaser.getTransportative(nounObj, number);
    if (result !== "N/A") {
        tvaaliLookup[result.toLowerCase()] = {
            en: nounObj.en,
            type: 'noun',
            data: nounObj,
            details: { case: "ERG", number: number }
        };
    }

    return result;
};
const ALL = (nounObj, number = "singular") => {
    if (!nounObj || !nounObj.root) return "[Unknown]";

    if (nounObj.class === "abstract") { return "N/A"}

    const result = nounCaser.getAllative(nounObj, number);
    if (result !== "N/A") {
        tvaaliLookup[result.toLowerCase()] = {
            en: nounObj.en,
            type: 'noun',
            data: nounObj,
            details: { case: "ERG", number: number }
        };
    }

    return result;
};
const ABL = (nounObj, number = "singular") => {
    if (!nounObj || !nounObj.root) return "[Unknown]";

    const result = nounCaser.getAblative(nounObj, number);
    tvaaliLookup[result.toLowerCase()] = {
        en: nounObj.en,
        type: 'noun',
        data: nounObj,
        details: { case: "ABL", number: number }
    };

    return result;
};
const INS = (nounObj, number = "singular") => {
    if (!nounObj || !nounObj.root) return "[Unknown]";

    const result = nounCaser.getInstrumental(nounObj, number);
    tvaaliLookup[result.toLowerCase()] = {
        en: nounObj.en,
        type: 'noun',
        data: nounObj,
        details: { case: "INS", number: number }
    };

    return result;
};
const COM = (nounObj, number = "singular") => {
    if (!nounObj || !nounObj.root) return "[Unknown]";

    const result = nounCaser.getComitative(nounObj, number);
    tvaaliLookup[result.toLowerCase()] = {
        en: nounObj.en,
        type: 'noun',
        data: nounObj,
        details: { case: "COM", number: number }
    };

    return result;
};

/* ==========================================================================
   NUMBER LOGIC
   ========================================================================== */

const NUM = (val, type = "cardinal") => {
    if (val === 0) {
        const res = numbers[0][type];
        tvaaliLookup[res.toLowerCase()] = { type: 'number', value: 0, en: "0" };
        return res;
    }

    const buildValue = (n) => {
        if (n < 12) return numbers[n].cardinal;
        const divisor = Object.keys(numBases).map(Number).sort((a, b) => b - a).find(p => p <= n);
        const count = Math.floor(n / divisor);
        const remainder = n % divisor;
        let part = `${buildValue(count)}-${numBases[divisor]}`;
        if (remainder > 0) part += `-${buildValue(remainder)}`;
        return part;
    };

    const fullCardinal = buildValue(val);
    let finalString = fullCardinal;

    // Logic for ordinals
    if (type === "ordinal") {
        const parts = fullCardinal.split("-");
        const lastWord = parts.pop();
        let ordinalSuffix = lastWord + "ar";
        for (let k in numbers) {
            if (numbers[k].cardinal === lastWord) {
                ordinalSuffix = numbers[k].ordinal;
                break;
            }
        }
        finalString = [...parts, ordinalSuffix].join("-");
    }
    
    tvaaliLookup[finalString.toLowerCase()] = {
        type: 'number',
        value: val,
        en: val.toString()
    };

    return finalString;
};

// This creates a "Master Lookup" for every possible form
function generateMorphologyMap() {
    const lookup = {};

    // Map Nouns
    Object.entries(nouns).forEach(([en, data]) => {
        const numbers = ["singular", "dual", "paucal", "plural"];
        const cases = ["NOM", "ACC", "ERG", "DAT", "GEN", "LOC", "TRA", "ALL", "ABL", "INS", "COM"];
        
        const rootForm = data.root.toLowerCase();
        if (!lookup[rootForm]) {
            lookup[rootForm] = { en, type: 'noun', data, details: { case: "Root", number: "singular" } };
        }

        cases.forEach(c => {
            numbers.forEach(n => {
                const form = window[c](data, n).toLowerCase();
                
                // ONLY save if this word hasn't been seen yet
                // This preserves the most "basic" case (usually NOM or ACC)
                if (!lookup[form]) {
                    lookup[form] = { 
                        en, 
                        type: 'noun', 
                        data,
                        details: { case: c, number: n } 
                    };
                }
            });
        });
    });

    // Map Verbs
    Object.entries(verbs).forEach(([en, data]) => {
        data.en = en; 

        const people = ["1st inclusive", "1st exclusive", "2nd formal", "2nd informal", "3rd animate", "3rd inanimate"];
        const numbers = ["singular", "dual", "paucal", "plural"];
        const tenses = ["present perfective", "past perfective", "future perfective"]; 

        people.forEach(p => {
            const nClass = p.split(' ').pop();
            numbers.forEach(num => {
                tenses.forEach(t => {
                    const form = verbConjugator.conjugate(data, nClass, p, num, t).toLowerCase();
                    
                    lookup[form] = { 
                        en, 
                        type: 'verb', 
                        data,
                        details: { person: p, number: num, tense: t } // <--- Added this
                    };
                });
            });
        });
    });

    return lookup;
}
