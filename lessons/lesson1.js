// --- LESSON 1 ---
// Submodule structure
// 1.1 First words and Animacy
// 1.2 ACC case
// 1.3 Verbs and Pronoun marker
// 1.4 First sentences
// 1.5 ERG case
// Mix sentences

const lesson1Data = {
    id: 1,
    title: "The basics",
    description: "In this first chapter of lessons, we learn about nouns and verbs, the Subject-Object-Verb structure, noun classes, and the start of the Ergative-Accusative system.",
    // newWords: ["sidhi", "aaloo", "aim", "iilha", "roshuu", "nedhaan", "djaavuum", "rjiimai", "oroo", "aahvuu", "irni", "nimiir", "naama", "tarkaa", "araantho", "tsiipli"],
    
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
                title: "First Nouns",
                description: "Translate these basic words. You can hover over them to see the translation. Purple highlights will indicate that a word is new.",
                newWords: ["sidhi","aaloo","djaavuum"],
                questions: [
                    { tv: ROOT("woman"), en: "woman" },
                    { tv: ROOT("water"), en: "water" },
                    { tv: ROOT("bird"), en: "bird" },
                ]
            },
            {
                type: "infoCard",
                title: "Animacy in Tvaali",
                content: `
                    <p>In Tvaali, nouns are loosely classified by <strong>animacy</strong>. This is similar to gender in for example french or spanish. In french any noun is either male or female. Tvaali does not have any male/female distinction, but instead has distinction based on animacy. Therefore all words are categorized as <strong>animate, inanimate</strong>, or <strong> abstract</strong></p> 
                    <p> The last "gender" (this is the linguistic name for it) will only be seen much later on and contains much less nouns compared to the other two. Most of the time, words that describe living things, such as people and animals, are animate. All other words are either inanimite or abstract. </p>
                    <p>However, not all words fall in the obvious catergory. Some things that (used to) carry cultural significance are animate, despite not being "alive". For example </p>
                    <ul>
                        <li>Woman and bird are animate. </li>
                        <li>However, fire is animate, but grass is inanimate.</li>
                    </ul>
                `,
            },
            {
                type: "vocabDrill",
                title: "More Nouns",
                description: "Translate these basic words.",
                newWords: ["aahvuu","nimiir","naama"],
                questions: [
                    { tv: ROOT("fire"), en: "fire" },
                    { tv: ROOT("grass"), en: "grass"},
                    {tv: ROOT("name"), en: "name"},
                    { tv: ROOT("woman"), en: "woman" },
                    { tv: ROOT("water"), en: "water" },
                    { tv: ROOT("bird"), en: "bird" },
                ]
            },
            {
                type: "infoCard",
                title: "The test",
                content: `
                    <p>The concept of animacy plays a large roll in Tvaali. A lot of grammatical things are dependend on it. So let's test if you remember in what category these nouns fall!</p>`,
            },
            {
                type: "sorting",
                title: "Classifying Nouns",
                description: "Is it Animate or Inanimate?",
                groups: {
                    Animate: [ROOT("woman"),ROOT("fire"), ROOT("bird"),ROOT("name")],
                    Inanimate: [ROOT("grass"), ROOT("water")],
                }
            },
            {
                type: "infoCard",
                title: "More nouns!",
                content: `
                    <p>Repetition is key, so we will repeat the words we have already learned. But we will add some more!</p>`,
            },
            {
                type: "vocabDrill",
                title: "Even More Nouns",
                description: "Translate these basic words.",
                newWords: ["nedhaan", "oroo", "rjiimai"],
                questions: [
                    { tv: ROOT("man"), en: "man" },
                    { tv: ROOT("sun"), en: "sun" },
                    { tv: ROOT("cat"), en: "cat" },
                    { tv: ROOT("fire"), en: "fire" },
                    { tv: ROOT("grass"), en: "grass"},
                    { tv: ROOT("name"), en: "name"},
                    { tv: ROOT("woman"), en: "woman" },
                    { tv: ROOT("water"), en: "water" },
                    { tv: ROOT("bird"), en: "bird" },
                ]
            },
            {
                type: "infoCard",
                title: "The other way!",
                content: `
                    <p>Since we will be learning Tvaali from english, we will also need to translate words the other direction. Let's do that with the 9 basic words we have seen so far!</p>`,
            },
            {
                type: "vocabDrill",
                title: "The Other Way",
                description: "Translate these words into Tvaali",
                questions: [
                    {en: "man", tv: ROOT("man"), type: "en_to_tv"},
                    { tv: ROOT("sun"), en: "sun", type: "en_to_tv" },
                    { tv: ROOT("cat"), en: "cat", type: "en_to_tv" },
                    { tv: ROOT("grass"), en: "grass", type: "en_to_tv"},
                    { tv: ROOT("name"), en: "name", type: "en_to_tv"},
                    { tv: ROOT("fire"), en: "fire", type: "en_to_tv" },
                    { tv: ROOT("bird"), en: "bird", type: "en_to_tv" },
                    { tv: ROOT("water"), en: "water", type: "en_to_tv" },
                    { tv: ROOT("woman"), en: "woman", type: "en_to_tv" },
                ]
            },
        ]},
        // --- Sublesson 2 ---
        {title: "The Accusative Case", modules: [
            {
                type: "infoCard",
                title: "The Case System",
                content: `
                    <p>In Tvaali, when an animate noun is the <strong>object</strong> of an action, we use the <strong>Accusative</strong> case.</p>
                    <ul>
                        <li>The suffix is usually <strong>-(a)m</strong>.</li>
                        <li>If the root ends in a vowel, that vowel is deleted!</li>
                    </ul>
                `,
                note: "Example: sidhi (woman) + am becomes sidhim."
            },
            {
                type: "vocabDrill",
                title: "The Accusative",
                description: "Translate these accusative forms.",
                questions: [
                    { tv: ACC(nouns.woman), en: "woman" },
                    { tv: ACC(nouns.man), en: "man" },
                    { tv: ACC(nouns.fire), en: "fire" },
                ]
            },
            {
                type: "infoCard",
                title: "Vowel shifts",
                content: `
                <p> As you may notice, the length of the final vowel plays a crucial role in the accusative case. With long vowels, the long vowel "wins" over the short vowel <strong>a</strong></p>
                <p> Since inanimate nouns are typically the reciever of an action, i.e. the object of the sentence, the accusative case is the same as the nominative case (thus the root) </p>
                `,
            },
            {
                type: "vocabDrill",
                title: "Inanimate Nouns",
                description: "Translate the following accusative forms.",
                questions: [
                    {tv: ACC(nouns.sun), en: "sun"},
                    {tv: ACC(nouns.grass), en: "grass"},
                    {tv: ACC(nouns.water), en: "water"}
                ]
            },
            {
                type: "infoCard",
                title: "Inanimate Nouns",
                content: `
                <p> It is not possible to see the difference (as there is none), thus we can only find them in a sentence. </p>
                <p> You may wonder how we can know if an inanimate nouns is the subject of a sentence. This will soon be answered by the ergative case.</p>
                `,
            },
        ]},
        // --- Sublesson 3 ---
        {title: "Verbs and Pronoun Markers", modules: [
            {
                type: "infoCard",
                title: "The First Verbs",
                content:`
                <p> If we want to make any sentence, we need verbs!</p>
                <p> Verbs in Tvaali take marking for quite a number of things. So, let's introduce them one by one. </p>
                <p> The only one that is absolutely necessary is the subject marker. This marks what noun in the sentence is the subject and can even replace a pronoun! </p>
                <p> Let's start with the third perons animate marker <strong> tha- </strong>.</p>
                `
            },
            {
                type: "vocabDrill",
                title: "First Verbs",
                description: "Translate these 3rd person verbs.",
                newWords: ["aim", "iilha", "roshuu"],
                questions: [
                    {tv: V(verbs.love, "animate", "3rd", "singular", "perfective present"), en: ["he loves", "she loves"]},
                    {tv: V(verbs.sleep, "animate", "3rd", "singular", "perfective present"), en: ["he sleeps", "she sleeps"]},
                    {tv: V(verbs.see, "animate", "3rd", "singular", "perfective present"), en: ["he sees", "she sees"]},
                ]
            },
            {
                type: "infoCard",
                title: "The First Person",
                content:`
                <p> I made a small lie in the previous info card. We don't always have a subject marker. </p>
                <p> The subject marker for the first person does not exist! So if we have just the stem, it is the first person.</p>
                `
            },
            {
                type: "vocabDrill",
                title: "First Verbs",
                description: "Translate these 3rd person verbs.",
                questions: [
                    {tv: V(verbs.love, "animate", "1st", "singular", "perfective present"), en: "I love"},
                    {tv: V(verbs.sleep, "animate", "1st", "singular", "perfective present"), en: "I sleep"},
                    {tv: V(verbs.see, "animate", "1st", "singular", "perfective present"), en: "I see"},
                ]
            },
            {
                type: "infoCard",
                title: "The Stative - Active Difference",
                content:`
                <p> The last bit about verbs (for now) has to do with <strong>transitive</strong> versus <strong>intransitive</strong> verbs. That is, does the verb typically have an object? </p>
                <p> This difference is only important if the subject is inanimate, but nevertheless useful to keep in mind when learning verbs.</p>
                <p> So let's see if we can classify the verbs we have seen based on if they are an object or not! </p>
                `
            },
            {
                type: "classification",
                title: "Stative vs Active",
                description: "Decide if the verb is Transitive or Intransitive.",
                words: [
                    { word: verbs.see.stem, type: true},
                    { word: verbs.love.stem, type: true},
                    { word: verbs.sleep.stem, type: false}
                ]
            },
            {
                type: "infoCard",
                title: "The Test",
                content:`
                <p> Let's see if these concepts and verbs can be translated both directions! </p>
                `
            },
            {
                type: "vocabDrill",
                title: "First Verbs",
                description: "Translate these verbs.",
                questions: [
                    {tv: V(verbs.love, "animate", "1st", "singular", "perfective present"), en: "I love", type: "en_to_tv"},
                    {tv: V(verbs.sleep, "animate", "1st", "singular", "perfective present"), en: "I sleep", type: "en_to_tv"},
                    {tv: V(verbs.see, "animate", "1st", "singular", "perfective present"), en: "I see", type: "en_to_tv"},
                    {tv: V(verbs.love, "animate", "3rd", "singular", "perfective present"), en: "He/She loves", type: "en_to_tv"},
                    {tv: V(verbs.sleep, "animate", "3rd", "singular", "perfective present"), en: "He/She sleeps", type: "en_to_tv"},
                    {tv: V(verbs.see, "animate", "3rd", "singular", "perfective present"), en: "He/She sees", type: "en_to_tv"},
                ]
            },
        ]},
        // --- Sublesson 4 ---
        {title: "First Sentences", modules: [
            {
                type: "infoCard",
                title: "The First Sentences",
                content:`
                <p> We can now start with making the first sentences!</p>
                <p> We have seen how animate nouns function as the subject of a sentence, how all nouns function as the object of a transative verb, and how verbs are modified for the subject of the sentence.</p>
                <p> Here we will put those things together. Note that in Tvaali the order of words is "subject object verb". So "I apple eat" would be the normal order in Tvaali. </p>
                <p> Let's get started.</p>
                `
            },
            {
                type: "translation",
                title: "Step 4: Full Sentences",
                description: "Translate the following sentences.",
                questions: [
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: NOM(nouns.woman) + " " + V(verbs.sleep, nouns.woman.class, "3rd", "singular", "perfective present"),
                        english: ["the woman sleeps", "the woman is sleeping"]
                    },
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: NOM(nouns.woman) + " " + ACC(nouns.water) + " " + V(verbs.love, nouns.woman.class, "3rd", "singular", "perfective present"),
                        english: ["the woman loves water", "the woman loves the water"]
                    },
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: NOM(nouns.man) + " " + ACC(nouns.grass) + " " + V(verbs.see, nouns.man.class, "3rd", "singular", "perfective present"),
                        english: ["the man sees grass", "the man sees the grass"]
                    },
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: ACC(nouns.woman, "singular") + " " + V(verbs.see, "animate", "1st", "singular", "perfective present"),
                        english: "i see the woman"
                    },
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: ACC(nouns.fire, "singular") + " " + V(verbs.see, "animate", "3rd", "singular", "perfective present"),
                        english: ["he sees the fire", "she sees the fire"]
                    },
                ]
            },
            {
                type: "infoCard",
                title: "A Step Up",
                content:`
                <p> Let's try the other direction!</p>
                `
            },
            {
                type: "translation",
                title: "Step 4: Full Sentences",
                description: "Translate the following sentences.",
                questions: [
                    {
                        lessonId: 1,
                        type: "en_to_tv",
                        tvaali: NOM(nouns.man) + " " + V(verbs.sleep, nouns.man.class, "3rd", "singular", "perfective present"),
                        english: "the man sleeps"
                    },
                    {
                        lessonId: 1,
                        type: "en_to_tv",
                        tvaali: NOM(nouns.bird) + " " + ACC(nouns.grass) + " " + V(verbs.love, nouns.bird.class, "3rd", "singular", "perfective present"),
                        english: "the bird loves grass"
                    },
                    {
                        lessonId: 1,
                        type: "en_to_tv",
                        tvaali: NOM(nouns.cat) + " " + ACC(nouns.bird) + " " + V(verbs.see, nouns.cat.class, "3rd", "singular", "perfective present"),
                        english: "the cat sees the bird"
                    },
                    {
                        lessonId: 1,
                        type: "en_to_tv",
                        tvaali: ACC(nouns.woman, "singular") + " " + V(verbs.see, "animate", "1st", "singular", "perfective present"),
                        english: "i see the woman"
                    },
                    {
                        lessonId: 1,
                        type: "en_to_tv",
                        tvaali: ACC(nouns.sun, "singular") + " " + V(verbs.see, "animate", "3rd", "singular", "perfective present"),
                        english: ["he sees the sun", "she sees the sun"]
                    },
                ]
            },
            {
                type: "infoCard",
                title: "Inanimate Subjects",
                content:`
                <p> What happens when the subject is inanimate? We get a new subject marker!</p>
                <p> Note that inanimate nouns in Tvaali are assumed to be indefinite in number. So, unless specified otherwise, it is unclear how many of a thing you have. </p>
                <p> There does exist a singular for inanimate nouns (and a corresponding subject marker) but we will see these later on. </p>
                <p> For now, let's see what inanimate subjects look like!</p>
                `
            },
            {
                type: "translation",
                title: "Step 4: Full Sentences",
                description: "Translate the following sentences.",
                newWords: ["irni", "liin"],
                questions: [
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: NOM(nouns.stone, "plural") + " " + V(verbs.fall, nouns.stone.class, "3rd", "plural", "perfective present"),
                        english: "the stone falls"
                    },
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: NOM(nouns.sun, "plural") + " " + V(verbs.laugh, nouns.sun.class, "3rd", "plural", "perfective present"),
                        english: "the sun laughs"
                    },
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: NOM(nouns.grass, "plural") + " " + V(verbs.sleep, nouns.grass.class, "3rd", "plural", "perfective present"),
                        english: "the grass sleeps"
                    },
                ]
            },
        ]},
        // --- Sublesson 5 ---
        {title: "The Ergative Case", modules: [
            {
                type: "infoCard",
                title: "The Ergative",
                content:`
                <p> In all sentences so far the subject of a transitive verb has been animate. But what happens when the subject is inanimate? How can we tell what happens?</p>
                <p> For this special case (an inanimate subject of a transitive verb) Tvaali has a noun case. This is the <strong>ergative</strong> case, typically marked with -oo or -oot. </p>
                <p> This is the reason we look at the difference between transitive and intransitive verbs! </p>
                <p> Let's see this is action. </p>
                `
            },
            {
                type: "translation",
                title: "The Ergative Case",
                description: "Translate the following Tvaali sentences.",
                newWords: ["tarkaa", "araantho", "tsiipli"],
                questions: [
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: ERG(nouns.stone, "plural") + " " + ACC(nouns.earth, "plural") + " " + V(verbs.hit, nouns.stone.class, "3rd", "plural", "perfective present"), 
                        english: "the stone hits the earth"
                    },
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: ERG(nouns.snow, "plural") + " " + ACC(nouns.grass, "plural") + " " + V(verbs.hit, nouns.snow.class, "3rd", "plural", "perfective present"),
                        english: ["the snow hits the grass", "snow hits the grass"]
                    },
                ]
            },
        ]},
        // --- Sublesson 6 ---
        {title: "Final Practice", modules: [
            {
                type: "infoCard",
                title: "Final Practice",
                content:`
                <p> In all sentences so far the subject has been animate. But what happens when the subject of a transitive verb is inanimate and the object is animate? How can we tell what happens?</p>
                <p> For this special case (an inanimate subject of a transitive verb) Tvaali has a noun case. This is the <strong>ergative</strong> case, typically marked with -oo or -oot. </p>
                <p> This is the reason we look at the difference between transitive and intransitive verbs! </p>
                <p> Let's see this is action. </p>
                `
            },
            {
                type: "translation",
                title: "The Ergative Case",
                description: "Translate the following Tvaali sentences.",
                newWords: ["tarkaa", "araantho", "tsiipli"],
                questions: [
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: ERG(nouns.stone, "plural") + " " + ACC(nouns.earth, "plural") + " " + V(verbs.hit, nouns.stone.class, "3rd", "plural", "perfective present"), 
                        english: "the stone hits the earth"
                    },
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: ERG(nouns.snow, "plural") + " " + ACC(nouns.grass, "plural") + " " + V(verbs.hit, nouns.snow.class, "3rd", "plural", "perfective present"),
                        english: ["the snow hits the grass", "snow hits the grass"]
                    },
                ]
            },
        ]}
    ], 
};