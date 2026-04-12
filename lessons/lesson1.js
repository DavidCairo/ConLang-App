const lesson1Data = {
    id: 1,
    title: "Basics of the Tripartite System",
    description: "Learn Subject-Object-Verb structure, noun classes, and the start of the Ergative-Accusative system.",
    newWords: ["woman", "sidhi", "water", "aaloo", "love", "aim", "sleep", "iilha", "see", "roshuu", "sun", "nedhaan", "bird", "djaavuum", "cat", "rjiimai", "man", "oroo", "fire", "aahvuu"],
    
    subLessons: [
        {title: "Nouns and Animate", modules: [
        {
            type: "vocab_drill",
            title: "Step 1: The Nouns",
            description: "Translate these basic words.",
            questions: [
                { tv: NR("woman"), en: "woman" },
                { tv: NR("man"), en: "man" },
                { tv: NR("fire"), en: "fire" },
                { tv: NR("water"), en: "water" }
            ]
        },
        {
            type: "sorting",
            title: "Step 2: Classifying Nouns",
            description: "Is it Animate or Inanimate?",
            groups: {
                Animate: [NR("woman"), NR("man"), NR("fire"), NR("bird"), NR("cat")],
                Inanimate: [NR("water"), NR("stone"), NR("sun")]
            }
        },
        {
            type: "classification",
            title: "Step 3: Action vs State",
            description: "Decide if the verb is Transitive or Intransitive.",
            words: [
                { word: verbs.laugh.stem, type: false},
                { word: verbs.love.stem, type: true},
                { word: verbs.sleep.stem, type: false}
            ]
        },
        {
            type: "translation",
            title: "Step 4: Full Sentences",
            useGlobalQuestions: true 
        }
    ]},
    {title: "Intransative Verbs", modules: [
        {
            type: "vocab_drill",
            title: "Step 1: The Nouns",
            description: "Translate these basic words.",
            questions: [
                { tv: NR("woman"), en: "woman" },
                { tv: NR("man"), en: "man" },
                { tv: NR("fire"), en: "fire" },
                { tv: NR("water"), en: "water" }
            ]
        },
        {
            type: "sorting",
            title: "Step 2: Classifying Nouns",
            description: "Is it Animate or Inanimate?",
            groups: {
                Animate: [NR("woman"), NR("man"), NR("fire"), NR("bird"), NR("cat")],
                Inanimate: [NR("water"), NR("stone"), NR("sun")]
            }
        },
        {
            type: "classification",
            title: "Step 3: Action vs State",
            description: "Decide if the verb is Transitive or Intransitive.",
            words: [
                { word: verbs.laugh.stem, type: false},
                { word: verbs.love.stem, type: true},
                { word: verbs.sleep.stem, type: false}
            ]
        },
        {
            type: "translation",
            title: "Step 4: Full Sentences",
            useGlobalQuestions: true 
        }
    ]},
    ],

    // Sentences
    questions: [
        {
            lessonId: 1,
            type: "en_to_tv",
            english: "The woman loves water",
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
            english: "The woman sleeps",
            tvaali: NR("woman") + " " + V(verbs.sleep, nouns.woman.class, "3rd", "singular", "present")
        },
        {
            lessonId: 1,
            type: "tv_to_en",
            tvaali: NR("woman") + " " + V(verbs.sleep, nouns.woman.class, "3rd", "singular", "present"),
            english: ["the woman sleeps", "the woman is sleeping"]
        }
    ]   
};