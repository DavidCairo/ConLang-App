const nouns={
    // Animate
    woman:  {root:"sidhi", class:"animate" },
    man:    {root: "ooro", class: "animate"},
    fire:   {root: "aahvuu", class: "animate" },
    birtd:  {root:"djaavuum",class:"animate"},
    cat:    {root:"rjiimai",class:"animate"},

    // Inanimate
    water:  {root: "aaloo", class: "inanimate" },
    stone:  {root:"irni",class:"inanimate"},
    sun:    {root:"nedhaan",class:"inanimate"},
    // Abstract
};

const verbs={
    love:   {stem: "aim", trans: true },
    laugh:  {stem: "aahan", trans: false },
    sleep:  {stem: "iilha", trans: false },
    see:    {stem:"roshuu", trans:true},
};

const V = verbConjugator.conjugate.bind(verbConjugator);
// const ERG
const ACC = nounCaser.getAccusative.bind(nounCaser);
// const DAT
// const GEN
// const LOC
// const TRA
// const DIR
// const ABL
// const INS
// const COM
const NR = (key) => nouns[key].root || "Word not found";