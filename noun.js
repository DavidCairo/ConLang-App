const nounCaser = {
    // Find word ending
    getEndingType: function(word) {
        // If 'word' is undefined, null, or an empty string, return a fallback so the .slice() below doesn't crash the app.
        if (!word || typeof word !== 'string') {
            console.error("nounCaser Error: getEndingType received an invalid word:", word);
            return "consonant"; 
        }

        const vowels = "aeiou"
        const last = word.slice(-1);
        const penult = word.slice(-2, -1);
        
        if (last === penult) return "longVowel";
        if (vowels.contains(last)) return "vowel";
        return "consonant";
    },

    // The logic block for Accusative
    getAccusative: function(nounObj, number = "singular") {
        // Safety: check if nounObj exists and has a root
        if (!nounObj || !nounObj.root) {
            console.error("getAccusative received an invalid object:", nounObj);
            return "ERROR"; 
        }

        const root = nounObj.root;
        const ending = this.getEndingType(root);
        const nClass = nounObj.class;

        // Animate
        if (nClass === "animate") {

            // Singular animate
            if (number === "singular") {
                if (ending === "longVowel") return root + "m"; 
                if (ending === "vowel") {
                    const lastVowel = root.slice(-1);

                    if (lastVowel === "a"){
                        return root + "m";
                    } else {
                        return root.slice(0, -1) + "am"
                    }
                }    
                return root + "am";
            }

            // Dual animate
            if (number === "dual") {
                if (ending === "longVowel" || ending === "vowel") return root + "m";
                if (ending === "consonant") {
                    const lastConsonant = root.slice(-1); 

                    switch (lastConsonant) {
                        case "r":
                            return root.slice(0, -1) + "mro";

                        case "t":
                            return root.slice(0, -1) + "mdo";

                        case "k":
                            return root.slice(0, -1) + "nko";

                        default:
                            return root; 
                    }
                }
            }

            // Paucal animate
            if (number === "paucal") {
                if (ending === "longVowel" || ending === "vowel") return root + "t";
                if (ending === "consonant") {
                    const lastConsonant = root.slice(-1); 

                    switch (lastConsonant) {
                        case "r":
                            return root.slice(0, -1) + "nro";

                        case "t":
                            return root.slice(0, -1) + "nto";

                        case "k":
                            return root.slice(0, -1) + "nko";

                        default:
                            return root; 
                    }
                }
            }

            // Plural animate
            if (number === "plural") {
                if (ending === "longVowel" || ending === "vowel") return root + "k";
                if (ending === "consonant") {
                    const lastConsonant = root.slice(-1); 

                    switch (lastConsonant) {
                        case "r":
                            return root.slice(0, -1) + "kro";

                        case "t":
                            return root.slice(0, -1) + "kto";

                        case "k":
                            return root;

                        default:
                            return root + "ko"; 
                    }
                }
            }
        }

        // Inanimate
        if (nClass === "inanimate") {
            return root; 
        }

        // Abstract
        if (nClass === "abstract") {
            return root;
        }

        return root; 
    }
};