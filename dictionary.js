/* ==========================================================================
   NOUNS (Categorized by Animate/Inanimate/Abstract)
   ========================================================================== */
const nouns = {
    // Animate (Na / Na-variants)
    animal:      { root: "tospee",      class: "animate" },
    "big cat":   { root: "iimai",       class: "animate" },
    cat:         { root: "rjiimai",     class:"animate"  },
    bird:        { root: "djaavuum",    class: "animate" },
    "bird of prey": { root: "atuska",   class: "animate" },
    cattle:      { root: "nurjo",       class: "animate" },
    child:       { root: "sevaan",      class: "animate" },
    stream:      { root: "raaliin",     class: "animate" },
    "spiritual animal": { root: "sjo",  class: "animate" },
    eye:         { root: "taaram",      class: "animate" },
    fire:        { root: "aahvuu",      class: "animate" },
    friend:      { root: "luun",        class: "animate" },
    deity:       { root: "sja",         class: "animate" },
    king:        { root: "ankaali",     class: "animate" },
    lizard:      { root: "kepraa",      class: "animate" },
    man:         { root: "oroo",        class: "animate" },
    chief:       { root: "ambas",       class: "animate" },
    name:        { root: "naama",       class: "animate" },
    reptile:     { root: "kepraatos",   class: "animate" },
    river:       { root: "nam",         class: "animate" },
    "sea creature": { root: "miintos",  class: "animate" },
    sleeper:     { root: "ilhan",       class: "animate" },
    storm:       { root: "beskor",      class: "animate" },
    woman:       { root: "sidhi",       class: "animate" },
    crocodile:   { root: "thakepraa",   class: "animate" },
    being:       { root: "wariin",      class: "animate" },
    hand:        { root: "tuum",        class: "animate" },
    priest:      { root: "eetvalke",    class: "animate" },
    "water buffalo": { root: "kaspyn",  class: "animate" },
    archon:      { root: "tvamaak",     class: "animate" },
    human:       { root: "iitaa",       class: "animate" },
    citizen:     { root: "aarhanan",    class: "animate" },
    being:       { root: "wariin",      class: "animate" },
    "head of rulers": { root: "sachuk", class: "animate" },
    pentarch:    { root: "achatvam",    class: "animate" },
    curator:     { root: "tagajan",     class: "animate" },
    scholar:     { root: "qambuin",     class: "animate" },

    // Inanimate (Ni)
    sun:         { root: "nedhaan",     class: "inanimate" },
    language:    { root: "tvaali",      class: "inanimate" },
    alignment:   { root: "maqaas",      class: "inanimate" },
    arboglyph:   { root: "kjawidawan",  class: "inanimate" },
    territory:   { root: "aarhan",      class: "inanimate" },
    cycle:       { root: "karkaam",     class: "inanimate" },
    day:         { root: "nethaa",      class: "inanimate" },
    daylight:    { root: "nethachi",    class: "inanimate" },
    choice:      { root: "tolkuum",     class: "inanimate" },
    earth:       { root: "araantho",    class: "inanimate" },
    goal:        { root: "limriit",     class: "inanimate" },
    grass:       { root: "nimiir",      class: "inanimate" },
    hill:        { root: "kajaan",      class: "inanimate" },
    house:       { root: "dek",         class: "inanimate" },
    ice:         { root: "kimru",       class: "inanimate" },
    land:        { root: "araan",       class: "inanimate" },
    marking:     { root: "dawan",       class: "inanimate" },
    moon:        { root: "buulan",      class: "inanimate" },
    rock:        { root: "uurpo",       class: "inanimate" },
    school:      { root: "qambointek",  class: "inanimate" },
    sea:         { root: "miin",        class: "inanimate" },
    sky:         { root: "talmaa",      class: "inanimate" },
    snow:        { root: "tsiipli",     class: "inanimate" },
    song:        { root: "sinproo",     class: "inanimate" },
    star:        { root: "roojoo",      class: "inanimate" },
    temple:      { root: "sjaadok",     class: "inanimate" },
    moment:      { root: "thachi",      class: "inanimate" },
    tree:        { root: "kjawi",       class: "inanimate" },
    volcano:     { root: "aavuukajaan", class: "inanimate" },
    water:       { root: "aaloo",       class: "inanimate" },
    wave:        { root: "miihaan",     class: "inanimate" },
    year:        { root: "doorjo",      class: "inanimate" },
    stone:       { root: "irni",        class: "inanimate" },
    book:        { root: "iktem",       class: "inanimate" },
    piece:       { root: "artar",       class: "inanimate" },
    section:     { root: "iktemiik",    class: "inanimate" },
    location:    { root: "arantar",     class: "inanimate" },
    table:       { root: "kiichtaa",    class: "inanimate" },
    script:      { root: "kachar",      class: "inanimate" },
    chapter:     { root: "saavuum",     class: "inanimate" },
    word:        { root: "araali",      class: "inanimate" },
    password:    { root: "tuurkiitaaraalii", class: "inanimate" },
    consonant:   { root: "kiiras",      class: "inanimate" },
    vowel:       { root: "ajoi",        class: "inanimate" },
    punctuation: { root: "dawanaitar",  class: "inanimate" },
    "cherry blossom": { root: "koivam", class: "inanimate" },

    // Abstract (Nb / Other)
    health:      { root: "siituur",     class: "abstract" },
    heat:        { root: "attsuum",     class: "abstract" },
    rest:        { root: "ilhanan",     class: "abstract" },
    total:       { root: "qoorum",      class: "abstract" },
    beauty:      { root: "buulai",      class: "abstract" },
    peace:       { root: "tarkaan",     class: "abstract" },
    peace:       { root: "tarkan",      class: "abstract" }, 
    silence:     { root: "muuna",       class: "abstract" },
    politics:    { root: "tvaarhaniik", class: "abstract" },
    system:      { root: "iimsetai",    class: "abstract" },
    culture:     { root: "tajatar",     class: "abstract" },
    religion:    { root: "sataiton",    class: "abstract" },
    money:       { root: "suunga",      class: "abstract" }, // Social debt/value
    law:         { root: "tvoon",       class: "abstract" },
    bright:      { root: "kytaar",      class: "abstract" },
    glow:        { root: "nehrasiit",   class: "abstract" },
    origin:      { root: "machoitar",   class: "abstract" },
    geography:   { root: "araanimoin",  class: "abstract" },
    sentience:   { root: "iintusoin",   class: "abstract" },
    abstract:    { root: "jyraishootrii", class: "abstract" },
    numbers:     { root: "tarkan",      class: "abstract" },
    "grammatical number": { root: "qootar", class: "abstract" },
    fate:        { root: "sja",         class: "abstract" },
    sleep:       { root: "iilham",      class: "abstract" },
    existence:   { root: "haamotos",    class: "abstract" },
    dream:       { root: "qaadotoon",   class: "abstract" },
};

/* ==========================================================================
   VERBS (Stems stripped of -te)
   ========================================================================== */
const verbs = {
    leave:       { stem: "muutiin",     trans: false },
    exist:       { stem: "ha o",        trans: false },
    arrive:      { stem: "na",          trans: false },
    die:         { stem: "tirin",       trans: false },
    fall:        { stem: "liin",        trans: false },
    laugh:       { stem: "aahan",       trans: false },
    live:        { stem: "saraa",       trans: false },
    remain:      { stem: "meeles",      trans: false },
    return:      { stem: "veetsis",     trans: false },
    rise:        { stem: "daiso",       trans: false },
    sit:         { stem: "kiiros",      trans: false },
    walk:        { stem: "vaqes",       trans: false },
    sleep:       { stem: "ilha",        trans: true }, // Vp Pair
    hear:        { stem: "laamidi",     trans: true }, // Vp Pair
    add:         { stem: "qooruu",      trans: true },
    become:      { stem: "taan",        trans: true },
    eat:         { stem: "iihes",       trans: true },
    fight:       { stem: "taisuus",     trans: true },
    help:        { stem: "oloor",       trans: true },
    hit:         { stem: "tarkaa",      trans: true },
    kill:        { stem: "tiprain",     trans: true },
    know:        { stem: "iintus",      trans: true },
    learn:       { stem: "qamboi",      trans: true },
    love:        { stem: "aim",         trans: true },
    see:         { stem: "roshuu",      trans: true },
    sing:        { stem: "sinproo",     trans: true },
    wash:        { stem: "nanraah",     trans: true },
    bring:       { stem: "sheqaa",      trans: true },
    burn:        { stem: "maalaa",      trans: true },
    talk:        { stem: "kiir",        trans: false },
    originate:   { stem: "machoi",      trans: false },
    divide:      { stem: "ar",          trans: true },
    curate:      { stem: "tagaja",      trans: true },
    "set up":    { stem: "setai",       trans: true },
    carry:       { stem: "chiitlaa",    trans: true },
    write:       { stem: "kate",        trans: true },
    locate:      { stem: "aran",        trans: true },
    shine:       { stem: "nehras",      trans: false },
    gleam:       { stem: "nehrasiit",   trans: false },
    "rise up":   { stem: "doichti",     trans: false },
    jump:        { stem: "aichti",      trans: false },
    "jump up":   { stem: "aigaichti",   trans: false },
    depart:      { stem: "kastaa",      trans: false },
    leave:       { stem: "iitroo",      trans: false },
    "fall down": { stem: "haiqoo",      trans: false },
    descend:     { stem: "toivee",      trans: false },
    play:        { stem: "oivi",        trans: false },
    stop:        { stem: "pan",         trans: false },
    inspect:     { stem: "katoo",       trans: true },
    present:     { stem: "roshuusoo",   trans: true },
    represent:   { stem: "rairoshuusoo", trans: true },
};

/* ==========================================================================
   OTHER CATEGORIES
   ========================================================================== */
const adjectives = {
    all:         { tv: "kji",       type: "N" },
    big:         { tv: "qaadhaa",   type: "V" },
    cold:        { tv: "torvoo",    type: "V" },
    different:   { tv: "yliire",    type: "N" },
    dry:         { tv: "maher",     type: "V" },
    fast:        { tv: "riihaa",    type: "V" },
    good:        { tv: "miirnuu",   type: "N" },
    hot:         { tv: "atsuu",     type: "VN" },
    long:        { tv: "tasmee",    type: "V" },
    old:         { tv: "kuulko",    type: "V" },
    same:        { tv: "liire",     type: "N" },
    sharp:       { tv: "iit",       type: "V" },
    small:       { tv: "hon",       type: "V" },
    strong:      { tv: "sjaahi",    type: "V" },
    white:       { tv: "biijoo",    type: "N" },
    beautiful:   { tv: "buulaiqo",  type: "N" },
    pure:        { tv: "diimaa",    type: "N" },
    political:   { tv: "totvaarhaniik", type: "N" },
    important:   { tv: "aini",          type: "N" },
    geographical: { tv: "toraanimoin",  type: "N" },
    bright:      { tv: "kytaar",        type: "V" },
    many:        { tv: "tsoi",          type: "N" },
    happy:       { tv: "mai",           type: "V" },
    slow:        { tv: "kanchai",       type: "V" },
    animate:     { tv: "sjoohen",       type: "N" },
    inanimate:   { tv: "taisjoohen",    type: "N" },
    sweet:       { tv: "makai",         type: "N" },
    paucal:      { tv: "kjonto",        type: "N" },
    plural:      { tv: "tsoiki",        type: "N" },
};

const adverbs = {
    additionally: "qooruudoo",
    alone:        "giisahaa",
    enough:       "qaanas",
    still:        "meeles",
    therefore:    "suukimdoo",
    too:          "qothoo",
    totally:      "qooruntoo",
    again:        "saichii",
    also:        "juki",
    tomorrow:    "hasiitsoo",
    now:         "huun",
    soon:        "sjai",
    here:        "kahaa",
    newly:       "doogas",
};

const postpositions = {
    against:     { tv: "siin",      case: "default" },
    under:       { tv: "qaani",     case: "default" },
    beyond:      { tv: "minaam",    case: "default" },
    by:          { tv: "voti",      case: "INS" },
    from:        { tv: "an",        case: "LOC" },
    in:          { tv: "sar",       case: "LOC" },
    into:        { tv: "kit",       case: "DIR" },
    like:        { tv: "enke",      case: "default" },
    on:          { tv: "naigaa",    case: "LOC" },
    through:     { tv: "oonuu",     case: "DIR" },
    with:        { tv: "jiim",      case: "COM" },
    with:        { tv: "tiim",      case: "INS" },
    about:       { tv: "janon",     case: "ABL" },
    of:          { tv: "tson",      case: "GEN" },
    after:       { tv: "aigaa",     case: "LOC" },
};

const conjunctions = {
    and:         "loo",
    "and also":  "loojuki",
    but:         "do",
    or:          "iis",
    "either or": "iis",
    thus:        "re",
    therefore:   "re",
    unless:      "liihuuntho",
};

const particles = {
    complementizer: { en: "that", tv: "hiintho" },
    this:           { en: "this", tv: "koo" },
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
};

/* ==========================================================================
   GLOBAL SEARCHABLE LEXICON
   ========================================================================== */
const allLexicon = [
    ...Object.entries(nouns).map(([en, d]) => ({ 
        en: en, tv: d.root, type: 'noun', class: d.class 
    })),
    ...Object.entries(verbs).map(([en, d]) => ({ 
        en: en, tv: d.stem, type: 'verb', trans: d.trans 
    })),
    ...Object.entries(adjectives).map(([en, d]) => ({ 
        en: en, tv: d.tv, type: 'adj' 
    })),
    ...Object.entries(adverbs).map(([en, tv]) => ({ 
        en: en, tv: tv, type: 'adv' 
    })),
    ...Object.entries(postpositions).map(([en, d]) => ({ 
        en: en, tv: d.tv, type: 'post', case: d.case 
    }))
];
