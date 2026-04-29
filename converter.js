const convertToLexicon = (oldNouns, oldVerbs) => {
    const newLexicon = [];

    // 1. Process Nouns
    for (const [english, data] of Object.entries(oldNouns)) {
        newLexicon.push({
            id: `${data.root}_${Math.random().toString(36).substr(2, 4)}`, // Unique ID
            tv: data.root,
            entries: [{
                type: "noun",
                class: data.class,
                senses: [{
                    en: [english], // Puts the key into the English array
                    definition: "" // Placeholder for your future dictionary work
                }]
            }]
        });
    }

    // 2. Process Verbs
    for (const [english, data] of Object.entries(oldVerbs)) {
        newLexicon.push({
            id: `${data.stem}_${Math.random().toString(36).substr(2, 4)}`,
            tv: data.stem,
            entries: [{
                type: "verb",
                trans: data.trans,
                senses: [{
                    en: [english],
                    definition: ""
                }]
            }]
        });
    }

    return newLexicon;
};