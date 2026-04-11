const l1_nouns= {
    woman: { root: "sidhi", class: "animate" },
    water: { root: "aaloo", class: "inanimate" },
    fire: { root: "aahvuu", class: "animate" }
};

const l1_verbs={
    love: { stem: "aim", trans: true },
    laugh: { stem: "aahan", trans: false },
    sleep: { stem: "iilha", trans: false }
}

const lesson1Data = [
    {
        lessonId: 1,
        type: "en_to_tv",
        english: "The woman loves water",
        tvaali: l1_nouns.woman.root + " " + 
                nounCaser.getAccusative(l1_nouns.water, l1_nouns.water.animate) + " " + 
                "th" + l1_verbs.love.stem // For now a simple th- as verb.js is not build yet. 
    },
    {
        lessonId: 1,
        type: "tv_to_en",
        tvaali: l1_nouns.woman.root + " " + 
                nounCaser.getAccusative(l1_nouns.water, l1_nouns.water.animate) + " " + 
                "th" + l1_verbs.love.stem,
        english: "the woman loves water"
    },
    {
        lessonId: 1,
        type: "en_to_tv",
        english: "The woman sleeps/The woman is sleeping",
        // Intransitive: Subject + Verb
        tvaali: l1_nouns.woman.root + " " + "th" + l1_verbs.sleep.stem
    },
    {
        lessonId: 1,
        type: "tv_to_en",
        tvaali: l1_nouns.woman.root + " " + l1_verbs.sleep.stem,
        english: ["the woman sleeps", "the woman is sleeping"]
    }
];