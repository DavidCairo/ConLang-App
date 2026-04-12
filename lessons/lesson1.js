const lesson1Data = {
    id: 1,
    title: "The basics",
    description: "In this first chapter of lessons, we learn about nouns and verbs, the Subject-Object-Verb structure, noun classes, and the start of the Ergative-Accusative system.",
    newWords: ["woman", "sidhi", "water", "aaloo", "love", "aim", "sleep", "iilha", "see", "roshuu", "sun", "nedhaan", "bird", "djaavuum", "cat", "rjiimai", "man", "oroo", "fire", "aahvuu", "stone", "inri", "grass", "nimiir", "name", "naama"],
    
    subLessons: [
        {title: "Nouns and Animacy", modules: [
            {
                type: "infoCard",
                title: "The first nouns",
                content: `
                    <p>Let's start with a few basic nouns.</p>`,
            },
            {
                type: "vocabDrill",
                title: "Step 1: The Nouns",
                description: "Translate these basic words.",
                questions: [
                    { tv: NR("woman"), en: "woman" },
                    // { tv: NR("man"), en: "man" },
                    // { tv: NR("fire"), en: "fire" },
                    { tv: NR("water"), en: "water" },
                    // { tv: NR("sun"), en: "sun" },
                    { tv: NR("bird"), en: "bird" },
                    // { tv: NR("cat"), en: "cat" },
                    // { tv: V(verbs.love), en: "to love" },
                    // { tv: V(verbs.sleep), en: "to sleep" },
                    // { tv: V(verbs.see), en: "to see" },
                ]
            },
            {
                type: "infoCard",
                title: "Animacy in Tvaali",
                content: `
                    <p>In Tvaali, nouns are loosely classified by <strong>animacy</strong>. However, not all words fall in the obvious catergory.</p>
                    <ul>
                        <li>Some words are clear: woman is animate. </li>
                        <li>Some are less obvious: fire is animte, but grass is inanimate.</li>
                    </ul>
                `,
                // note: "Example: sidhi (woman) + am becomes sidham."
            },
            {
                type: "vocabDrill",
                title: "Step 1: The Nouns",
                description: "Translate these basic words.",
                questions: [
                    // { tv: NR("woman"), en: "woman" },
                    // { tv: NR("man"), en: "man" },
                    { tv: NR("fire"), en: "fire" },
                    // { tv: NR("water"), en: "water" },
                    // { tv: NR("sun"), en: "sun" },
                    // { tv: NR("bird"), en: "bird" },
                    // { tv: NR("cat"), en: "cat" },
                    // { tv: V(verbs.love), en: "to love" },
                    // { tv: V(verbs.sleep), en: "to sleep" },
                    // { tv: V(verbs.see), en: "to see" },
                    { tv: NR("grass"), en: "grass"},
                    {tv: NR("name"), en: "name"},
                ]
            },
            {
                type: "infoCard",
                title: "The test",
                content: `
                    <p>Let's test if you remember what category the nouns fall!</p>`,
                // note: "Example: sidhi (woman) + am becomes sidham."
            },
            {
                type: "sorting",
                title: "Step 2: Classifying Nouns",
                description: "Is it Animate or Inanimate?",
                groups: {
                    Animate: [NR("woman"),NR("fire"), NR("bird"),NR("name")],
                    Inanimate: [NR("grass"), NR("water")],
                }
            },
        ]},
        {title: "Intransative Verbs", modules: [
            {
                type: "infoCard",
                title: "The first nouns",
                content: `
                    <p>In Tvaali, when an animate noun is the <strong>object</strong> of an action, we use the <strong>Accusative</strong> case.</p>
                    <ul>
                        <li>The suffix is usually <strong>-am</strong>.</li>
                        <li>If the root ends in a short vowel, that vowel is deleted!</li>
                    </ul>
                `,
                note: "Example: sidhi (woman) + am becomes sidham."
            },
            {
                type: "vocabDrill",
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