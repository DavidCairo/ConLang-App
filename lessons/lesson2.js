// Lesson structure
// 2.1 Dual 
// 2.2 A few vs Many
// 2.3 Where things happen
// 2.4 Number and Case
// 2.5 Locative in a sentence
// 2.6 Practice sentences

const lesson2Data = {
    id: 2,
    title: "Number & Space",
    description: "dual, paucal, plural and locative",
    newWords: ["taaram", "nam", "mamdoo", "kjooma", "ruveethi", "tarkai", "nithoo", "aalhu"],

    subLessons: [
        {
            title: "The Dual", modules: [
                {
                    type: "infoCard",
                    title: "Two of a Kind",
                    content: `
                        <p>Most likely, you are used to talking about things in a singular or in plural. Either you have one shirt or multiple shirt"s". This is the difference between singular and plural. However, there are other numbers for nouns, for example the dual. In English this is often seen with the word "a pair".</p>
                        <p>In Tvaali, a pair of something has a separate noun number. This only exists for animate nouns. So a pair of woman or a pair of cats can be denoted with their own noun cases. </p>
                        <p>The dual is typically marked with the letter <strong>s</strong>. As before, vowels can do interesting alteration. A pair of woman is sidhas, and a pair of cats is rjiimais. </p>
                        <p>Let's translate some of the nouns we had seen in the previous lesson with "two ...", together with some new words.</p>
                        `,
                        note: "The new words are not in the dual!"
                },
                {
                type: "vocabDrill",
                title: "The First Duals",
                description: "Translate these words.",
                newWords: ["taaram", "nam", "mamdoo", "kjooma", "ruveethi", "tarkai", "nithoo", "aalhu"],
                // newWords: ["nedhaan", "oroo", "rjiimai"],
                questions: [
                    { tv: NOM(nouns.man, "dual"), en: "two men" }, 
                    // { tv: NOM("sun"), en: "sun" },
                    { tv: NOM(nouns.cat,"dual"), en: "two cats" },
                    { tv: NOM(nouns.fire,"dual"), en: "two fires" },
                    // { tv: NOM("grass"), en: "grass"},
                    { tv: NOM(nouns.name,"dual"), en: "two names"},
                    { tv: NOM(nouns.woman,"dual"), en: "two women" },
                    // { tv: NOM("water"), en: "water" },
                    { tv: NOM(nouns.bird,"dual"), en: "two birds" },
                    {tv: NOM(nouns.elder), en: "elder"},
                    {tv: NOM(nouns.warrior), en: "warrior"},
                    {tv: NOM(nouns.dog), en: "dog"},
                    {tv: NOM(nouns.snake), en: "snake"},
                    {tv: NOM(nouns.fish), en: "fish"},
                    {tv: NOM(nouns.spirit), en: "spirit"},
                ]
                },
                {
                    type: "infoCard",
                    title: "Verbs",
                    content: `
                        <p>Just like before, verbs have a prefix for number and gender. This is also true in English: one woman <strong>says</strong> something but two women <strong>say</strong> something.</p>
                        <p>The prefix for the thrid person animate dual is <strong>thasa</strong>. As you may remember, the singualar version for the third person was <strong>tha</strong>, so we again see the letter "s", indicating the dual!</p>
                        <p>Let's make some basic sentences.</p>
                        `,
                },
                {
                type: "translation",
                title: "Dual Sentences",
                description: "Translate the following sentences.",
                questions: [
                    {
                        lessonId: 2,
                        type: "tv_to_en",
                        tvaali: NOM(nouns.woman, "dual") + " " + V(verbs.sleep, nouns.woman.class, "3rd", "dual", "perfective present"),
                        english: ["the two women sleep", "the two women are sleeping", "two women sleep", "two women are sleeping"]
                    },
                    {
                        lessonId: 2,
                        type: "tv_to_en",
                        tvaali: NOM(nouns.woman, "dual") + " " + ACC(nouns.water) + " " + V(verbs.love, nouns.woman.class, "3rd", "dual", "perfective present"),
                        english: ["the two women love water", "the two women love the water", "two women love water", "two women love the water"]
                    },
                    {
                        lessonId: 2,
                        type: "tv_to_en",
                        tvaali: NOM(nouns.man, "dual") + " " + ACC(nouns.grass) + " " + V(verbs.see, nouns.man.class, "3rd", "dual", "perfective present"),
                        english: ["the two men see grass", "the two men see the grass", "two men see grass", "two men see the grass"]
                    },
                    // {
                    //     lessonId: 1,
                    //     type: "tv_to_en",
                    //     tvaali: ACC(nouns.woman, "singular") + " " + V(verbs.see, "animate", "1st", "singular", "perfective present"),
                    //     english: "i see the woman"
                    // },
                    // {
                    //     lessonId: 1,
                    //     type: "tv_to_en",
                    //     tvaali: ACC(nouns.fire, "singular") + " " + V(verbs.see, "animate", "3rd", "singular", "perfective present"),
                    //     english: ["he sees the fire", "she sees the fire"]
                    // },
                ]
                },
                {
                    type: "infoCard",
                    title: "The Accusative",
                    content: `
                        <p>Similar to the verbs and the nominative, the accusative can also indicate the dual for animate nouns. This is again indicated with the letter "s" together with the letter "a" from the accusatve.</p>
                        <p>Due to phonological reasons, the dual for nouns ending with the letters <strong>n</strong>, <strong>m</strong>, and <strong>s</strong> is the same as the nominative. For all these nouns we have to use the word "us" for two.</p>
                        <p>Let's see some of this in practice.</p>
                        `,
                },
                {
                    type: "translation",
                    title: "More Complex Sentences",
                    description: "Translate the following sentences.",
                    questions: [
                        {
                            lessonId: 2,
                            type: "tv_to_en",
                            tvaali: ACC(nouns.woman, "dual") + " " + V(verbs.see, "animate", "1st", "singular", "perfective present"),
                            english: ["i see the two women", "i see two women"]
                        },
                        {
                            lessonId: 2,
                            type: "tv_to_en",
                            tvaali: ACC(nouns.eye, "dual") + " " + NUM(2) + " " + V(verbs.see, "animate", "3rd", "singular", "perfective present"),
                            english: ["she sees the two eyes", "she sees two eyes", "he sees the two eyes", "he sees two eyes"]
                        },
                        {
                            lessonId: 2,
                            type: "tv_to_en",
                            tvaali: NOM(nouns.child) + " " + ACC(nouns.river, "dual") + " " + V(verbs.see, "animate", "3rd", "singular", "perfective present"),
                            english: ["the child sees the two rivers", "the child sees two rivers"]
                        },
                        {
                            lessonId: 2,
                            type: "tv_to_en",
                            tvaali: NOM(nouns.elder, "dual") + " " + ACC(nouns.dog, "dual") + " " + V(verbs.see, "animate", "3rd", "dual", "perfective present"),
                            english: ["the two elders see the two dogs", "two elders see two dogs", "the two elders see two dogs", "two elders see the two dogs"]
                        },
                        {
                            lessonId: 2,
                            type: "tv_to_en",
                            tvaali: NOM(nouns.warrior) + " " + ACC(nouns.snake, "dual") + " " + V(verbs.fight, "animate", "3rd", "singular", "perfective present"),
                            english: ["the warrior fights the two snakes", "a warrior fights the two snakes", "the warrior fights two snakes", "a warrior fights the two snakes"]
                        },
                        {
                            lessonId: 2,
                            type: "tv_to_en",
                            tvaali: NOM(nouns.spirit) + " " + ACC(nouns.fish, "dual") + " " + V(verbs.love, "animate", "3rd", "singular", "perfective present"),
                            english: ["the spirit loves the two fish", "the spirit loves two fish", "a spirit loves the two fish", "a spirit loves two fish"]
                        },
                    ]
                },
                // {
                //     type: "infoCard",
                //     title: "New Words",
                //     content: `
                //         <p>Since we have seen somne new words, let's practice those.</p>
                //         `,
                // },
                // {
                //     type: "vocabDrill",
                //     title: "New Words",
                //     description: "Translate these words",
                //     questions: [
                //         {tv: NOM(nouns.elder), en: "elder"},
                //         {tv: NOM(nouns.warrior), en: "warrior"},
                //         {tv: NOM(nouns.dog), en: "dog"},
                //         {tv: NOM(nouns.snake), en: "snake"},
                //         {tv: NOM(nouns.fish), en: "fish"},
                //         {tv: NOM(nouns.spirit), en: "spirit"},
                //     ]
                // },
            ],
        },
        // Sublesson 2
        {title: "A Few vs Many", modules: [
                {
                    type: "infoCard",
                    title: "New Words First",
                    content:`
                    <p>Let's start with some new words for this section!</p>
                    `,
                },
                {
                    type: "vocabDrill",
                    title: "New Words",
                    description: "Translate these words",
                    questions: [
                        {tv: NOM(nouns.elder), en: "elder"}, // to do 
                    ]
                },
                {
                    type: "infoCard",
                    title: "Two Types of Plural",
                    content:`
                    <p>In Tvaali, Animate nouns are divided in two types of plurals. These groups are "a few", or more technically referred to as paucal, and "many", just the normal plural.</p>
                    <p>The category for paucal is usually up to 12 of something. So if you are with 6 people, you refer to this group with the paucal. For all intents and purposes this functions as a normal plural.</p> 
                    <p>As with the dual, there are some changes to the verbs and noun cases depending on the paucal of plural. The paucal is marked with the letter <strong>t</strong> and the plural is marked with the letter <strong>k</strong>. </p>
                    <p>The 3rd person animate subject marker for the paucal is <strong>thadaa</strong> and the plural marker is (rather confusingly) <strong>am</strong>.</p>
                    <p>Before we mix all these things, let us start with some paucal sentences. For example: djaavuum<strong>at thada</strong>ilha -- a few birds are sleeping.</p>
                    `,
                },
                {
                    type: "translation",
                    title: "Paucal Sentences",
                    description: "Translate the following sentences.",
                    questions: [
                        {
                            lessonId: 2, // to do
                            type: "tv_to_en",
                            tvaali: NOM(nouns.woman, "dual") + " " + V(verbs.sleep, nouns.woman.class, "3rd", "dual", "perfective present"),
                            english: ["the two women sleep", "the two women are sleeping", "two women sleep", "two women are sleeping"]
                        },
                    ]
                },
                {
                    type: "infoCard",
                    title: "The Other Kind of Plural",
                    content:`
                    <p>Let's turn our attention to the plural for more than twelve things, and for inanimate nouns. These two are in fact very different! Like the dual and paucal, we always indicate a number for animate nouns. You can have one cat, two cats, a few cats, or many cats. But you can never just have an undefined number of cats.</p>
                    <p>The plural for animate nouns is indicated with the letter <strong>k</strong>. This is very similar to the dual and paucal we have already seen. </p>
                    <ul>
                        <li>The dual: s;</li>
                        <li>The paucal: t;</li>
                        <li>The plural: k.</li>
                    </ul>
                    `,
                },
                {
                    type: "translation",
                    title: "Paucal Sentences",
                    description: "Translate the following sentences.",
                    questions: [
                        {
                            lessonId: 2, // to do
                            type: "tv_to_en",
                            tvaali: NOM(nouns.woman, "dual") + " " + V(verbs.sleep, nouns.woman.class, "3rd", "dual", "perfective present"),
                            english: ["the two women sleep", "the two women are sleeping", "two women sleep", "two women are sleeping"]
                        },
                    ]
                },
                {
                    type: "infoCard",
                    title: "Inanimte Nouns",
                    content:`
                    <p>For inanimate nouns this is not the case. Inanimate nouns are assumed to be <strong>mass nouns</strong>. This means, unless we use the singular, we do not in any way indicate howmany we have of a thing. So usual the indefinite (as it is called in Tvaali), it just means we have a number of rocks. We can specifically indicate we have one single rock, or we can use a number, like 32 rocks, but the word "rocks" does not exist.</p>
                    <p>What this implies we have "a rock" or "rock".</p>
                    <p>So far we have only seen the indefinite for inanimate nouns. Thus what we will see here is actually the singular!</p>
                    <p>This singular for inanimate nouns is indicated with the letter <strong>t</strong>. This is the same as the paucal for animate nouns, and these are historically related!</p>
                    <p>Let's see this in practice</p>
                    `,
                },
                {
                    type: "translation",
                    title: "Paucal Sentences",
                    description: "Translate the following sentences.",
                    questions: [
                        {
                            lessonId: 2, // to do
                            type: "tv_to_en",
                            tvaali: NOM(nouns.woman, "dual") + " " + V(verbs.sleep, nouns.woman.class, "3rd", "dual", "perfective present"),
                            english: ["the two women sleep", "the two women are sleeping", "two women sleep", "two women are sleeping"]
                        },
                    ]
                },
                {
                    type: "infoCard",
                    title: "The Accusative",
                    content:`
                    <p>Let's see how the accusative looks for the paucal and plural for animate nouns. these are combinatieons of the letters "t" and "k" with the letter "a", comming form the accusative.</p>
                    <p>For the inanimate we will introduce the singular ergative. The ergative is indicated with <strong>oo</strong> and using the letter "t" from the singular we obtain the ending <strong>oot</strong> for the singular ergative.</p>
                    <p>Let's see these three in action!</p>
                    `,
                },
                {
                    type: "translation",
                    title: "Paucal Sentences",
                    description: "Translate the following sentences.",
                    questions: [
                        {
                            lessonId: 2, // to do
                            type: "tv_to_en",
                            tvaali: NOM(nouns.woman, "dual") + " " + V(verbs.sleep, nouns.woman.class, "3rd", "dual", "perfective present"),
                            english: ["the two women sleep", "the two women are sleeping", "two women sleep", "two women are sleeping"]
                        },
                    ]
                },
            ]
        },
        // Sublesson 3
        {title: "Where Things Happen", modules: [
                {
                    type: "infoCard",
                    title: "New Words First",
                    content:`
                    <p>Let's start with some new words for this section!</p>
                    `,
                },
                {
                    type: "vocabDrill",
                    title: "New Words",
                    description: "Translate these words",
                    questions: [
                        {tv: NOM(nouns.elder), en: "elder"}, // to do 
                    ]
                },
                {
                    type: "infoCard",
                    title: "The Location",
                    content:`
                    <p>In Tvaali, the location of an event or verb is indicated with the locative case. Simply said, most words like "at", "in", "on", and so forth are all combined in one noun case.</p>
                    <p>The locative is indicated with the letters <strong>oi</strong>, usually together with the letters seen in the dual, paucal, and plural. </p>
                    <p>For now, let's start translating some sentences with a locative!</p>
                    `,
                },
                {
                    type: "translation",
                    title: "Paucal Sentences",
                    description: "Translate the following sentences.",
                    questions: [
                        {
                            lessonId: 2, // to do
                            type: "tv_to_en",
                            tvaali: NOM(nouns.woman, "dual") + " " + V(verbs.sleep, nouns.woman.class, "3rd", "dual", "perfective present"),
                            english: ["the two women sleep", "the two women are sleeping", "two women sleep", "two women are sleeping"]
                        },
                    ]
                },
                
            ]
        },
        // Sublesson 4
        {title: "Number and Case", modules: [
                {
                    type: "infoCard",
                    title: "New Words First",
                    content:`
                    <p>Let's start with some new words for this section!</p>
                    `,
                },
                {
                    type: "vocabDrill",
                    title: "New Words",
                    description: "Translate these words",
                    questions: [
                        {tv: NOM(nouns.elder), en: "elder"}, // to do 
                    ]
                },
                {
                    type: "infoCard",
                    title: "The Location and the Number",
                    content:`
                    <p>Let us now combine number and case. </p>
                    `,
                },
                {
                    type: "translation",
                    title: "Paucal Sentences",
                    description: "Translate the following sentences.",
                    questions: [
                        {
                            lessonId: 2,
                            type: "tv_to_en",
                            tvaali: ACC(nouns.eye, "dual") + " " + NUM(2) + " " + V(verbs.see, "animate", "3rd", "singular", "perfective present"),
                            english: ["she sees the two eyes", "she sees two eyes", "he sees the two eyes", "he sees two eyes"]
                        },
                        {
                            lessonId: 2,
                            type: "tv_to_en",
                            tvaali: ACC(nouns.eye, "dual") + " " + NUM(2) + " " + V(verbs.see, "animate", "3rd", "singular", "perfective present"),
                            english: ["she sees the two eyes", "she sees two eyes", "he sees the two eyes", "he sees two eyes"]
                        },
                    ]
                },
                
            ]
        },
    ]
};