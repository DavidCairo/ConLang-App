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
    description: "In this first chapter of lessons (sublesson 1 through 6), we learn about nouns and verbs. We learn how nouns can alter for case, thus changing what function a noun can have in the sentence. We learn how grammatical gender (commonly seen as masculine vs feminine words) manifests in Tvaali. How these different genders have different case markings for their roles in a sentence. And most importantly, we learn how to build our first sentences!",
    newWords: ["sidhi", "aaloo", "aim", "iilha", "roshuu", "nedhaan", "djaavuum", "rjiimai", "oroo", "aahvuu", "irni", "nimiir", "naama", "tarkaa", "araantho", "tsiipli"],
    
    subLessons: [
        {title: "Nouns and Animacy", modules: [
            {
                type: "infoCard",
                title: "The first nouns",
                content: `
                    <p>Let's start with a few basic nouns.</p>`,
                    note: "In Tvaali, the words 'the' and 'an' do not exist, so do not appear in their translation."
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
                    <p>In Tvaali, nouns are loosely classified by <strong>animacy</strong>. This is similar to gender in for example french or spanish. In french any noun is either masculine or feminine. Tvaali does not have any male/female distinction, but instead has distinction based on animacy. Therefore all words are categorized as <strong>animate, inanimate</strong>, or <strong> abstract</strong></p> 
                    <p> The last grammatical "gender" (this is the linguistic name for it) will only be seen much later on and contains much less nouns compared to the other two. Most of the time, words that describe living things, such as people and animals, are animate. All other words are either inanimite or abstract. </p>
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
                type: "multipleChoice", 
                title: "Recognition",
                description: "Select the correct Tvaali translation for each word.",
                questions: [
                    { en: "man", tv: ROOT("man"), type: "en_to_tv" },
                    { en: "sun", tv: ROOT("sun"), type: "en_to_tv" },
                    { en: "cat", tv: ROOT("cat"), type: "en_to_tv" },
                    { en: "grass", tv: ROOT("grass"), type: "en_to_tv" },
                    { en: "name", tv: ROOT("name"), type: "en_to_tv" },
                    { en: "fire", tv: ROOT("fire"), type: "en_to_tv" },
                    { en: "bird", tv: ROOT("bird"), type: "en_to_tv" },
                    { en: "water", tv: ROOT("water"), type: "en_to_tv" },
                    { en: "woman", tv: ROOT("woman"), type: "en_to_tv" },
                ]
            },
        ]},
        // --- Sublesson 2 ---
        {title: "The Accusative Case", modules: [
            {
                type: "infoCard",
                title: "The Case System",
                content: `
                    <p>In Tvaali, when an animate noun is the <strong>object</strong> of an action, we use the <strong>Accusative</strong> case. So in the sentence "I give you flowers", you are the reciever of the action and since you are animate, in the accusative case.</p>
                    <p> Like all other cases in Tvaali, the accusative is marked with a suffix (an add-on at the end of the word). For the accusative singular, this is typically the ending <strong>am</strong>. However, the vowel preceeding the letter "m" may very based on the vowel at the end of the stem of the noun </p>
                    <ul>
                        <li>The suffix is usually <strong>-(a)m</strong>.</li>
                        <li>If the root ends in a vowel, that vowel may alter! For example: sidhi (woman) + am becomes sidhim.</li>
                    </ul>
                    <p> The vowel alteration patterns will slowly become more clear. But on the home page there is a declension table, where all cases and how they manifest can be found! </p>
                `,
            },
            {
                type: "vocabDrill",
                title: "The Accusative",
                description: "Translate these accusative forms. (The translation is the same as the nominative)",
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
                <p> As you may notice, the length of the final vowel plays a role in the accusative case. With long vowels (denoted with double vowels or as "y", "ai", or "oi"), the long vowel "wins" over the vowel <strong>a</strong>. When the stem ends with a short vowel, usually the vowel wins, except for the vowel "o", that one gets replaced with an "a".</p>
                <p> Since inanimate nouns are typically the reciever of an action, i.e. the object of the sentence, the accusative case is the same as the nominative case (thus the root). Let's practice both groups!</p>
                `,
            },
            {
                type: "vocabDrill",
                title: "Inanimate Nouns",
                description: "Translate the following accusative forms.",
                questions: [
                    {tv: ACC(nouns.sun), en: "sun"},
                    {tv: ACC(nouns.grass), en: "grass"},
                    {tv: ACC(nouns.water), en: "water"},
                    { tv: ACC(nouns.woman), en: "woman" },
                    { tv: ACC(nouns.man), en: "man" },
                    { tv: ACC(nouns.fire), en: "fire" },
                ]
            },
            {
                type: "infoCard",
                title: "Inanimate Nouns",
                content: `
                <p> As there is no difference between the nominative form and accusative form of a inanimate noun, we can only find their role in a sentence.</p>
                <p> You may wonder how we can know if an inanimate nouns is the subject of a sentence. This will soon be answered by the ergative case.</p>
                <p> For now, let's keep practicing these words!"
                `,
            },
            {
                type: "multipleChoice", 
                title: "Recognition",
                description: "Select the correct Tvaali translation for each word.",
                questions: [
                    { en: "man", tv: ROOT("man"), type: "en_to_tv" },
                    { en: "sun", tv: ROOT("sun"), type: "en_to_tv" },
                    { en: "cat", tv: ROOT("cat"), type: "en_to_tv" },
                    { en: "grass", tv: ROOT("grass"), type: "en_to_tv" },
                    { en: "name", tv: ROOT("name"), type: "en_to_tv" },
                    { en: "fire", tv: ROOT("fire"), type: "en_to_tv" },
                    { en: "bird", tv: ROOT("bird"), type: "en_to_tv" },
                    { en: "water", tv: ROOT("water"), type: "en_to_tv" },
                    { en: "woman", tv: ROOT("woman"), type: "en_to_tv" },
                ]
            },
        ]},
        // --- Sublesson 3 ---
        {title: "Verbs and Subject Markers", modules: [
            {
                type: "infoCard",
                title: "The First Verbs",
                content:`
                <p> If we want to make any sentence, we need verbs!</p>
                <p> Verbs in Tvaali take marking (that is prefixes-before the word-and suffixes-after the word) for quite a number of things. So, let's introduce them one by one. </p>
                <p> The only one that is absolutely necessary is the subject marker. This marks on the verb what noun in the sentence is the subject and can even replace a pronoun. </p>
                <p> So for example, taking a verb like "to love", which is "aim-te" (the "te" shows that it is the infinitive: "to" love), we can make the sentence "he loves" by applying the singular 3rd person animate subject marker <strong> tha </strong> to the verb to get "thaim". </p>
                <p> Notice that there is no pronoun! As before, there is no difference between male and female. So "she loves" is also "thaim", where the <strong>th</strong> shows that it is singular, 3rd person, and animite that does the verb. </p>
                <p> Just like with the nouns of the previous lesson, vowels can do weird things. The full marker for the singular 3rd person animate subject is <strong>tha</strong>. But again, the long vowel "ai" wins, and the "a" is lost. </p>
                <p> Lastly, in the present (the here and now) tense, there is no difference between <strong>perfective</strong> and <strong>continuous</strong>. Thus "she is sleeping" and "she sleeps" are considered the same in Tvaali. </p>
                <p> Let's start practicing with the third perons animate marker <strong> tha- </strong>.</p>
                `
            },
            {
                type: "vocabDrill",
                title: "First Verbs",
                description: "Translate these 3rd person verbs.",
                newWords: ["aim", "iilha", "roshuu", "aahan", "liin", "tarkaa"],
                questions: [
                    {tv: V(verbs.love, "animate", "3rd", "singular", "perfective present"), en: ["he loves", "she loves"]},
                    {tv: V(verbs.sleep, "animate", "3rd", "singular", "perfective present"), en: ["he sleeps", "she sleeps", "he is sleeping", "she is sleeping"]},
                    {tv: V(verbs.see, "animate", "3rd", "singular", "perfective present"), en: ["he sees", "she sees", "he is seeing", "she is seeing"]},
                    {tv: V(verbs.fall, "animate", "3rd", "singular", "perfective present"), en: ["he falls", "she falls", "he is falling", "she is falling"]},
                    {tv: V(verbs.laugh, "animate", "3rd", "singular", "perfective present"), en: ["he laughs", "she laughs", "he is laughing", "she is laughing"]},
                    {tv: V(verbs.hit, "animate", "3rd", "singular", "perfective present"), en: ["he hits", "she hits", "he is hitting", "she is hitting"]},
                ]
            },
            {
                type: "infoCard",
                title: "The First Person",
                content:`
                <p> I made a small lie in the previous info card. We don't always have a subject marker. </p>
                <p> The subject marker for the first person singular does not exist! So if we have just the stem, it is the first person.</p>
                <p> For example "aim" means "I love". 
                `
            },
            {
                type: "vocabDrill",
                title: "First Verbs",
                description: "Translate these 1st person verbs.",
                questions: [
                    {tv: V(verbs.love, "animate", "1st", "singular", "perfective present"), en: "I love"},
                    {tv: V(verbs.sleep, "animate", "1st", "singular", "perfective present"), en: ["I sleep", "I am sleeping"]},
                    {tv: V(verbs.see, "animate", "1st", "singular", "perfective present"), en: ["I see", "I am seeing"]},
                    {tv: V(verbs.laugh, "animate", "1st", "singular", "perfective present"), en: ["I laugh", " I am laughing"]},
                    {tv: V(verbs.hit, "animate", "1st", "singular", "perfective present"), en: ["I hit", "I am hitting"]},
                    {tv: V(verbs.fall, "animate", "1st", "singular", "perfective present"), en: ["I fall", "I am falling"]},
                ]
            },
            {
                type: "infoCard",
                title: "The Stative - Active Difference",
                content:`
                <p> The last bit about verbs (for this lesson) has to do with <strong>transitive</strong> versus <strong>intransitive</strong> verbs. That is, does the verb typically have a reciever? </p>
                <p> This difference can be seen in "to love" vs "to sleep". Usually, you love <strong>something</strong>, but you do not sleep something. Therefore, to sleep is intransitive, and to love is transitive </p>
                <p> This difference is only important if the subject is inanimate but nevertheless useful to keep in mind when learning verbs.</p>
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
                    { word: verbs.sleep.stem, type: false},
                    { word: verbs.hit.stem, type: true},
                    { word: verbs.laugh.stem, type: false},
                    { word: verbs.fall.stem, type: false},
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
                type: "multipleChoice",
                title: "First Verbs",
                description: "Translate these verbs.",
                questions: [
                    {tv: V(verbs.love, "animate", "1st", "singular", "perfective present"), en: "I love", type: "en_to_tv"},
                    {tv: V(verbs.sleep, "animate", "1st", "singular", "perfective present"), en: "I sleep", type: "en_to_tv"},
                    {tv: V(verbs.see, "animate", "1st", "singular", "perfective present"), en: "I see", type: "en_to_tv"},
                    {tv: V(verbs.laugh, "animate", "1st", "singular", "perfective present"), en: " I am laughing", type: "en_to_tv"},
                    {tv: V(verbs.hit, "animate", "1st", "singular", "perfective present"), en: "I hit", type: "en_to_tv"},
                    {tv: V(verbs.fall, "animate", "1st", "singular", "perfective present"), en: "I am falling", type: "en_to_tv"},
                    {tv: V(verbs.love, "animate", "3rd", "singular", "perfective present"), en: "He/She loves", type: "en_to_tv"},
                    {tv: V(verbs.sleep, "animate", "3rd", "singular", "perfective present"), en: "He/She sleeps", type: "en_to_tv"},
                    {tv: V(verbs.see, "animate", "3rd", "singular", "perfective present"), en: "He/She sees", type: "en_to_tv"},
                    {tv: V(verbs.fall, "animate", "3rd", "singular", "perfective present"), en: "she falls", type: "en_to_tv"},
                    {tv: V(verbs.laugh, "animate", "3rd", "singular", "perfective present"), en: "she is laughing", type: "en_to_tv"},
                    {tv: V(verbs.hit, "animate", "3rd", "singular", "perfective present"), en: "he hits", type: "en_to_tv"},
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
                <p> In order to make a sentence, we need (1) a topic, (2) an object if the verb is transitive, and (3) a verb. Let's see how these combine! </p>
                <p> If the subject is explicite, thus not a pronoun, we place the animate subject in the nominative case, which is just the root of the noun. Next we make the object, which is in the accusative case for animate nouns, and in the nominative case for inamite nouns. Lastly, we take the verb and put on the subject marker correspondig with the subject of the sentence. </p>
                <ul>
                    <li> Thus a sentence like "the woman sees the man" in Tvaali is: (1) sidhi (woman nominative) (2) oroom (man accusative oroo + am) (3) tharoshuu (to see with the singular 3rd person animate marker tha + roshuu). </li>
                    <li> And "The cat sees the grass" is: (1) rjiimai (cat nominative) (2) nimiir (grass nominative) (3) tharoshuu. </li>
                    <li> Lastly, "I love the bird" is: (1) ... (pronoun not included) (2) djaavuumam (bird accusative) (3) aim (to love with the singular 1st person marker-the one that does not exist!). </li>
                </ul>
                <p> Let's get practicing!</p>
                `
            },
            {
                type: "translation",
                title: "Full Sentences",
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
                <p> Let's try the other direction with multiple choice!</p>
                `,
                note: "Be very careful with the case marking!"
            },
            {
                type: "multipleChoice",
                title: "Full Sentences",
                description: "Translate the following sentences.",
                questions: [
                    {
                        type: "en_to_tv",
                        tv: NOM(nouns.man) + " " + V(verbs.sleep, nouns.man.class, "3rd", "singular", "perfective present"),
                        en: "the man is sleeping",
                        distractors: [NOM(nouns.man) + " " + V(verbs.laugh, nouns.man.class, "3rd", "singular", "perfective present"), NOM(nouns.woman) + " " + V(verbs.sleep, nouns.woman.class, "3rd", "singular", "perfective present")]
                    },
                    {
                        type: "en_to_tv",
                        tvaali: NOM(nouns.bird) + " " + ACC(nouns.grass) + " " + V(verbs.love, nouns.bird.class, "3rd", "singular", "perfective present"),
                        english: "the bird loves grass",
                        distractors: [NOM(nouns.cat) + " " + ACC(nouns.grass) + " " + V(verbs.love, nouns.bird.class, "3rd", "singular", "perfective present"),NOM(nouns.woman) + " " + ACC(nouns.man) + " " + V(verbs.love, nouns.woman.class, "3rd", "singular", "perfective present")]
                    },
                    {
                        type: "en_to_tv",
                        tvaali: NOM(nouns.cat) + " " + ACC(nouns.bird) + " " + V(verbs.see, nouns.cat.class, "3rd", "singular", "perfective present"),
                        english: "the cat sees the bird",
                        distractors: [NOM(nouns.cat) + " " + ACC(nouns.bird) + " " + V(verbs.see, "animate", "1st", "singular", "perfective present"),NOM(nouns.cat) + " " + NOM(nouns.bird) + " " + V(verbs.see, nouns.cat.class, "3rd", "singular", "perfective present")]
                    },
                    {
                        type: "en_to_tv",
                        tvaali: ACC(nouns.woman, "singular") + " " + V(verbs.see, "animate", "1st", "singular", "perfective present"),
                        english: "i see the woman",
                        distractors: [NOM(nouns.woman, "singular") + " " + V(verbs.see, "animate", "1st", "singular", "perfective present"),NOM(nouns.woman, "singular") + " " + V(verbs.see, "animate", "3rd", "singular", "perfective present")]
                    },
                    {
                        type: "en_to_tv",
                        tvaali: ACC(nouns.sun, "singular") + " " + V(verbs.see, "animate", "3rd", "singular", "perfective present"),
                        english: "she sees the sun",
                        distractors: [ACC(nouns.sun, "singular") + " " + V(verbs.see, "animate", "1st", "singular", "perfective present"),NOM(nouns.sun, "singular") + " " + V(verbs.see, "animate", "3rd", "singular", "perfective present")]
                    },
                ]
            },
            {
                type: "infoCard",
                title: "Inanimate Subjects",
                content:`
                <p> What happens when the subject is inanimate? We get a new subject marker - <strong> pe </strong>!</p>
                <p> Note that inanimate nouns in Tvaali are assumed to be indefinite in number (so they are not singular or plural). So, unless specified otherwise, it is unclear how many of a thing you have. </p>
                <p> There does exist a singular for inanimate nouns to emphasize (and a corresponding subject marker) but we will see these later on. </p>
                <p> For now, let's see what inanimate subjects look like!</p>
                `,
                note: "The following sentences can be weird. We don't have a large enough vocabulary yet."
            },
            {
                type: "translation",
                title: "Full Sentences",
                description: "Translate the following sentences.",
                questions: [
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: NOM(nouns.stone, "plural") + " " + V(verbs.fall, nouns.stone.class, "3rd", "plural", "perfective present"),
                        english: ["the stone falls", "the stone is falling"]
                    },
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: NOM(nouns.sun, "plural") + " " + V(verbs.laugh, nouns.sun.class, "3rd", "plural", "perfective present"),
                        english: ["the sun laughs", "the sun is laughing"]
                    },
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: NOM(nouns.grass, "plural") + " " + V(verbs.sleep, nouns.grass.class, "3rd", "plural", "perfective present"),
                        english: ["the grass sleeps", "the grass is sleeping"]
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
                <p> For this special case (an inanimate subject of a transitive verb) Tvaali has a noun case. This is the <strong>ergative</strong> case, always (!) marked with -oo or -oot. </p>
                <p> Tvaali has what is called a "split-Ergative" system. When the verb is intransative, the subject is always in the nominative case. If the verb is transative, animate <strong>subjects</strong> are in the nominative case, animate <strong>object</strong> are in the accusative case, inanimte <strong>subjects</strong> are in the ergative case, and inanimate <strong>objects</strong> are in the nominative case.</p>
                <p> This is the reason we look at the difference between transitive and intransitive verbs. </p>
                <p> For an example sentence, let's translate "the grass hits the bird". First we have the subject, nimiiroo (grass + oo). Next is the object, djaavuumam (bird + am-accusative). And lastly, the verb, petarkaa (indefinite 3rd person inanimate subject marker pe + to hit, tarkaa). Thus the full sentence is: nimiiroo djaavuumam petarkaa.</p>
                <p> Let's see some sentences as examples. </p>
                `
            },
            {
                type: "translation",
                title: "The Ergative Case",
                description: "Translate the following Tvaali sentences.",
                newWords: ["tarkaa", "araantho", "tsiipli", "baintras", "iihes"],
                questions: [
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: ERG(nouns.stone, "plural") + " " + ACC(nouns.earth, "plural") + " " + V(verbs.hit, nouns.stone.class, "3rd", "plural", "perfective present"), 
                        english: ["the stone hits the earth", "stone is hitting the earth"]
                    },
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: ERG(nouns.snow, "plural") + " " + ACC(nouns.grass, "plural") + " " + V(verbs.hit, nouns.snow.class, "3rd", "plural", "perfective present"),
                        english: ["the snow hits the grass", "snow hits the grass", "the snow is hitting the grass", "snow is hitting the grass"]
                    },
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: ERG(nouns.water, "plural") + " " + ACC(nouns.fire, "singular") + " " + V(verbs.hit, nouns.water.class, "3rd", "plural", "perfective present"),
                        english: ["the water hits the fire", "water hits the fire", "water is hitting the fire", "the water is hitting the fire"]
                    },
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: ERG(nouns.water, "plural") + " " + ACC(nouns.stone, "plural") + " " + V(verbs.carve, nouns.water.class, "3rd", "plural", "perfective present"),
                        english: ["the water carves the stone", "water carves the stone", "water is carving the stone", "the water is carving the stone"]
                    },
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: ERG(nouns.grass, "plural") + " " + ACC(nouns.water, "plural") + " " + V(verbs.eat, nouns.grass.class, "3rd", "plural", "perfective present"),
                        english: ["the grass eats the water", "grass eats the water", "the grass is eating the water", "grass is eating the water", "grass eats water", "grass is eating water", "the grass eats water", "the grass is eating water"]
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
                <p> Let's end with practicing everything we have learned in full example sentences! </p>
                `
            },
            {
                type: "translation",
                title: "Final Practice",
                description: "Translate the following sentences.",
                newWords: ["tospee", "sevaan", "taan", "nurjo"],
                questions: [
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: NOM(nouns.woman, "singular") + " " + ACC(nouns.sun, "plural") + " " + V(verbs.love, nouns.woman.class, "3rd", "singular", "perfective present"), 
                        english: "the woman loves the sun"
                    },
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: ACC(nouns.snow, "plural") + " " + V(verbs.see, "animate", "1st", "singular", "perfective present"),
                        english: ["I see snow", "I see the snow"]
                    },
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: NOM(nouns.man, "singular") + " " + ACC(nouns.animal, "singular") + " " + V(verbs.eat, nouns.man.class, "3rd", "singular", "perfective present"), 
                        english: ["the man eats the animal", "the man is eating the animal"]
                    },
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: ERG(nouns.water, "plural") + " " + V(verbs.fall, nouns.water.class, "3rd", "plural", "perfective present"), 
                        english: ["water is falling", "the water falls", "the water is falling", "water falls"]
                    },
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: NOM(nouns.fire, "singular") + " " + ACC(nouns.earth, "plural") + " " + V(verbs.carve, nouns.fire.class, "3rd", "singular", "perfective present"), 
                        english: ["fire carves the earth", "fire is carving the earth", "the fire is carving the earth", "the fire carves the earth"]
                    },
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: NOM(nouns.child, "singular") + " " + ACC(nouns.woman, "singular") + " " + V(verbs.become, nouns.child.class, "3rd", "singular", "perfective present"), 
                        english: ["the child is becoming a woman", "the child becomes a woman"]
                    },
                    {
                        lessonId: 1,
                        type: "tv_to_en",
                        tvaali: NOM(nouns.cattle, "singular") + " " + ACC(nouns.grass, "plural") + " " + V(verbs.eat, nouns.cattle.class, "3rd", "singular", "perfective present"), 
                        english: ["the cattle eats the grass", "the cattle is eating the grass", "cattle eats grass", "cattle is eating grass"]
                    },
                ]
            },
            {
                type: "infoCard",
                title: "Let us finish with the hardest part: translating English to Tvaali!",
                content:`
                <p> Let us finish with the hardest part: translating English to Tvaali! </p>
                <p> The sentences are relatively easy, compared to the previous exercises. And you have already seen these sentences. </p>
                `
            },
            {
                type: "translation",
                title: "English to Tvaali",
                description: "Translate the following sentences.",
                questions: [
                    {
                        lessonId: 1,
                        type: "en_to_tv",
                        tvaali: V(verbs.sleep, "animate", "1st", "singular", "perfective present"),
                        english: ["I sleep", "I am sleeping"]
                    },
                    {
                        lessonId: 1,
                        type: "en_to_tv",
                        tvaali: V(verbs.laugh, "animate", "3rd", "singular", "perfective present"),
                        english: ["he is laughing", "she is laughing", "he laughs", "she laughs"]
                    },
                    {
                        lessonId: 1,
                        type: "en_to_tv",
                        tvaali: NOM(nouns.woman, "singular") + " " + ACC(nouns.water, "plural") + " " + V(verbs.love, nouns.woman.class, "3rd", "singular", "perfective present"),
                        english: "the woman loves water"
                    },
                ]
            },
        ]}
    ], 
};