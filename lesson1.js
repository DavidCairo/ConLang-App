const lesson1Data = [
    {
        lessonId: 1,
        type: "en_to_tv",
        english: "The woman loves water",
        // Added "perfective" before "present"
        tvaali: NR("woman") + " " + ACC(nouns.water, "singular") + " " + V(verbs.love, nouns.woman.class, "3rd", "singular", "present")
    },
    {
        lessonId: 1,
        type: "tv_to_en",
        tvaali: NR("woman") + " " + ACC(nouns.water, "singular") + " " + V(verbs.love, nouns.woman.class, "3rd", "singular", "present"),
        english: "the woman loves water"
    },
    {
        lessonId: 1,
        type: "en_to_tv",
        english: "The woman sleeps/The woman is sleeping",
        tvaali: NR("woman") + " " + V(verbs.sleep, nouns.woman.class, "3rd", "singular", "present")
    },
    {
        lessonId: 1,
        type: "tv_to_en",
        tvaali: NR("woman") + " " + V(verbs.sleep, nouns.woman.class, "3rd", "singular", "present"),
        english: ["the woman sleeps", "the woman is sleeping"]
    }
];