/* ==========================================================================
   NOUNS
   ========================================================================== */

const nouns={
    // Animate
    woman:  {root:"sidhi", class:"animate" },
    man:    {root: "oroo", class: "animate"},
    fire:   {root: "aahvuu", class: "animate" },
    bird:   {root:"djaavuum",class:"animate"},
    cat:    {root:"rjiimai",class:"animate"},
    name:   {root:"naama",class:"animate"},
    animal: {root: "tospee", class:"animate"},
    cattle: {root: "nurjo", class:"animate"},
    child:  {root:"sevaan", class: "animate"},
    eye:    {root:"taaram", class: "animate"},
    river: {root:"nam", class:"animate"},
    elder:  {root:"mamdoo", class:"animate"},
    warrior:{root:"tarkai", class:"animate"},
    dog:    {root:"kjooma", class:"animate"},
    snake:  {root:"ruveethi", class:"animte"},
    fish:   {root:"aalhu", class: "animate"},
    spirit: {root:"nithoo", class:"animate"},


    // Inanimate
    water:  {root: "aaloo", class: "inanimate" },
    stone:  {root:"irni",class:"inanimate"},
    sun:    {root:"nedhaan",class:"inanimate"},
    grass:  {root:"nimiir",class:"inanimate"},
    earth:  {root:"araantho",class:"inanimate"},
    snow:  {root:"tsiipli",class:"inanimate"},
    

    // Abstract
    silence: { root: "muuna", class: "abstract" },
    justice: { root: "raatvu", class: "abstract" },
    cold:    { root: "torvoo",  class: "abstract" },
    truth:   { root: "eemda",  class: "abstract" },
    sleep:   { root: "iilhan", class: "abstract" },
};

/* ==========================================================================
   VERBS
   ========================================================================== */

const verbs={
    love:   {stem: "aim", trans: true },
    laugh:  {stem: "aahan", trans: false },
    sleep:  {stem: "iilha", trans: false },
    see:    {stem:"roshuu", trans:true},
    fall:   {stem:"liin", trans:false},
    hit:    {stem:"tarkaa", trans:true},
    carve:  {stem:"baintras", trans:true},
    eat:    {stem:"iihes", trans:true},
    become: {stem:"taan", trans:true},
    fight:  {stem:"taisuus",trans:true},
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


/* ==========================================================================
   VERB LOGIC
   ========================================================================== */
   
const V = (verbObj, nClass = "animate", person = null, number = "singular", tense = "infinitive perfective") => {
    if (!verbObj || !verbObj.stem) return "[Unknown Verb]";
    
    const result = verbConjugator.conjugate(verbObj, nClass, person, number, tense);
    const form = result.toLowerCase();

    tvaaliLookup[form] = {
        en: verbObj.en,
        type: 'verb',
        data: verbObj,
        details: { person, number, tense } // Used by the tooltip
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

    return nounCaser.getNominative(nounObj, number);
};
const ERG = (nounObj, number = "singular") => {
    if (!nounObj || !nounObj.root) return "[Unknown]";

    // Split Ergative Logic:
    // If it's Animate, return the custom message instead of the root
    if (nounObj.class === "animate") {
        return "N/A";
    }

    // For Inanimate and Abstract, proceed with the suffix logic
    if (nounObj.class === "inanimate" || nounObj.class === "abstract") {
        return nounCaser.getErgative(nounObj, number);
    }
    
    return nounObj.root; 
};
const ACC = (nounObj, number = "singular") => {
    if (!nounObj || !nounObj.root) return "[Unknown]";

    // Rule: Objects of Animates are Accusative; Inanimates are Nominative (Root)
    if (nounObj.class === "animate") {
        return nounCaser.getAccusative(nounObj, number);
    }
    return nounObj.root; // Inanimates stay in Nominative as objects
};
const DAT = (nounObj, number = "singular") => {
    if (!nounObj || !nounObj.root) return "[Unknown]";

    return nounCaser.getDative(nounObj, number);
};
const GEN = (nounObj, number = "singular") => {
    if (!nounObj || !nounObj.root) return "[Unknown]";

    return nounCaser.getGenitive(nounObj, number);
};
const LOC = (nounObj, number = "singular") => {
    if (!nounObj || !nounObj.root) return "[Unknown]";

    return nounCaser.getLocative(nounObj, number);
};
const TRA = (nounObj, number = "singular") => {
    if (!nounObj || !nounObj.root) return "[Unknown]";

    if (nounObj.class === "abstract") { return "N/A"}

    return nounCaser.getTransportative(nounObj, number);
};
const ALL = (nounObj, number = "singular") => {
    if (!nounObj || !nounObj.root) return "[Unknown]";

    if (nounObj.class === "abstract") { return "N/A"}

    return nounCaser.getAllative(nounObj, number);
};
const ABL = (nounObj, number = "singular") => {
    if (!nounObj || !nounObj.root) return "[Unknown]";

    return nounCaser.getAblative(nounObj, number);
};
const INS = (nounObj, number = "singular") => {
    if (!nounObj || !nounObj.root) return "[Unknown]";

    return nounCaser.getInstrumental(nounObj, number);
};
const COM = (nounObj, number = "singular") => {
    if (!nounObj || !nounObj.root) return "[Unknown]";

    return nounCaser.getLocative(nounObj, number);
};

/* ==========================================================================
   NUMBER LOGIC
   ========================================================================== */

const NUM = (val, type = "cardinal") => {
    // Safety check for 0
    if (val === 0) return numbers[0][type];

    // Internal recursive builder (always works in cardinals)
    const buildValue = (n) => {
        if (n < 12) return numbers[n].cardinal;

        // Find the largest base (20736, 1728, 144, or 12)
        const divisor = Object.keys(numBases)
            .map(Number)
            .sort((a, b) => b - a)
            .find(p => p <= n);

        const count = Math.floor(n / divisor);
        const remainder = n % divisor;

        // "count-base" (e.g., "us-tvuum")
        let part = `${buildValue(count)}-${numBases[divisor]}`;
        
        if (remainder > 0) {
            part += `-${buildValue(remainder)}`;
        }
        return part;
    };

    const fullCardinal = buildValue(val);

    if (type === "cardinal") return fullCardinal;
    let finalString = fullCardinal;

    // --- Ordinal Logic ---
    // Rule: Take the full cardinal string, find the last word, and swap it for the ordinal
    if (type === "ordinal") {
        const parts = fullCardinal.split("-");
        const lastWord = parts.pop();
        let ordinalSuffix = lastWord + "ar"; // Default fallback

        for (let k in numbers) {
            if (numbers[k].cardinal === lastWord) {
                ordinalSuffix = numbers[k].ordinal;
                break;
            }
        }
        finalString = [...parts, ordinalSuffix].join("-");
    }
    
    tvaaliLookup[result.toLowerCase()] = {
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
        const cases = ["NOM", "ACC", "ERG", "DAT", "GEN", "LOC"];
        
        // Add the root itself
        lookup[data.root.toLowerCase()] = { en, type: 'noun', data };

        cases.forEach(c => {
            numbers.forEach(n => {
                // Use your existing NOM/ACC/ERG functions
                const form = window[c](data, n).toLowerCase();
                lookup[form] = { en, type: 'noun', data };
            });
        });
    });

    // Map Verbs
    Object.entries(verbs).forEach(([en, data]) => {
        const people = ["1st inclusive", "1st exclusive", "2nd formal", "2nd informal", "3rd animate", "3rd inanimate"];
        const numbers = ["singular", "dual", "paucal", "plural"];
        const tenses = ["present perfective", "past perfective", "future perfective"]; // Add core tenses

        people.forEach(p => {
            const nClass = p.split(' ').pop();
            numbers.forEach(num => {
                tenses.forEach(t => {
                    const form = verbConjugator.conjugate(data, nClass, p, num, t).toLowerCase();
                    lookup[form] = { en, type: 'verb', data };
                });
            });
        });
    });

    return lookup;
}

tvaaliLookup = generateMorphologyMap();
