const lesson1Data = [
    {
        lessonId: 1,
        type: "en_to_tv",
        english: "The woman loves water",
        tvaali: nouns.woman.root + " " + 
                nounCaser.getAccusative(nouns.water, "singular") + " " + 
                "th" + verbs.love.stem // For now a simple th- as verb.js is not build yet. 
    },
    {
        lessonId: 1,
        type: "tv_to_en",
        tvaali: nouns.woman.root + " " + 
                nounCaser.getAccusative(nouns.water, "singular") + " " + 
                "th" + verbs.love.stem,
        english: "the woman loves water"
    },
    {
        lessonId: 1,
        type: "en_to_tv",
        english: "The woman sleeps/The woman is sleeping",
        // Intransitive: Subject + Verb
        tvaali: nouns.woman.root + " " + "th" + verbs.sleep.stem
    },
    {
        lessonId: 1,
        type: "tv_to_en",
        tvaali: nouns.woman.root + " " + verbs.sleep.stem,
        english: ["the woman sleeps", "the woman is sleeping"]
    }
];