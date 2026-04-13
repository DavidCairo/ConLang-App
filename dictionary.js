const nouns={
    // Animate
    woman:  {root:"sidhi", class:"animate" },
    man:    {root: "oroo", class: "animate"},
    fire:   {root: "aahvuu", class: "animate" },
    bird:  {root:"djaavuum",class:"animate"},
    cat:    {root:"rjiimai",class:"animate"},
    name:   {root:"naama",class:"animate"},

    // Inanimate
    water:  {root: "aaloo", class: "inanimate" },
    stone:  {root:"irni",class:"inanimate"},
    sun:    {root:"nedhaan",class:"inanimate"},
    grass:  {root:"nimiir",class:"inanimate"},
    earth:  {root:"araantho",class:"inanimate"},
    snow:  {root:"tsiipli",class:"inanimate"},
    // Abstract
};

const verbs={
    love:   {stem: "aim", trans: true },
    laugh:  {stem: "aahan", trans: false },
    sleep:  {stem: "iilha", trans: false },
    see:    {stem:"roshuu", trans:true},
    fall:   {stem:"liin", trans:false},
    hit:   {stem:"tarkaa", trans:true},
};

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
const V = (verbObj, nClass = "animate", person = null, number = "singular", tense = "infinitive perfective") => {
    if (!verbObj || !verbObj.stem) return "[Unknown Verb]";
    // The verbConjugator should handle the logic for "future perfective" etc.
    return verbConjugator.conjugate(verbObj, nClass, person, number, tense);
};
const NOM = (nounObj, number = "singular") => {
    if (!nounObj || !nounObj.root) return "[Unknown]";

    return nounCaser.getNominative(nounObj, number);
};
const ERG = (nounObj, number = "singular") => {
    if (!nounObj || !nounObj.root) return "[Unknown]";

    // Split Ergative Logic:
    // If it's Animate, return the custom message instead of the root
    if (nounObj.class === "animate") {
        return "This is an animate noun. These don't have an ergative case.";
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
// const DAT
// const GEN
// const LOC
// const TRA
// const DIR
// const ABL
// const INS
// const COM
