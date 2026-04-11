const lesson1Data = {
    id: 1,
    title: "First Sentences",
    description: "In this lesson, you will learn the absolute basics of Tvaali sentence structure (Subject-Object-Verb), the Accusative noun case, and how verbs change for 3rd person subjects.",
    newWords: ["woman", "water", "love", "sleep"],
    questions: [
        // {
            // lessonId:1,
            // type: "en_to_tv" "tv_to_en",
            // english: " ",
            // tvaali: 
        // },
        {
            lessonId:1,
            type: "en_to_tv",
            english: "The woman",
            tvaali: NR("woman")
        },
        {
            lessonId:1,
            type: "en_to_tv",
            english: "The woman loves water",
            tvaali: NR("woman") + " " + ACC(nouns.water, "singular") + " " + V(verbs.love, nouns.woman.class, "3rd", "singular", "perfective", "present")
        },
        {
            lessonId:1,
            type: "tv_to_en",
            tvaali: NR("woman") + " " + ACC(nouns.water, "singular") + " " + V(verbs.love, nouns.woman.class, "3rd", "singular", "present"),
            english: "the woman loves water"
        },
        {
            lessonId:1,
            type: "en_to_tv",
            english: "The woman sleeps/The woman is sleeping",
            tvaali: NR("woman") + " " + V(verbs.sleep, nouns.woman.class, "3rd", "singular", "present")
        },
        {
            lessonId:1,
            type: "tv_to_en",
            tvaali: NR("woman") + " " + V(verbs.sleep, nouns.woman.class, "3rd", "singular", "present"),
            english: ["the woman sleeps", "the woman is sleeping"]
        }
    ]   
};