const nounCaser = {
    // 1. Helper to get vowel clusters (Matches verb logic)
    getVowelCluster: function(text, fromStart = true) {
        const vowels = "aeiouy";
        if (fromStart) {
            let v = text[0];
            if (vowels.includes(text[1]) && text[1] === v) return v + v;
            return v;
        } else {
            let v = text.slice(-1);
            let p = text.slice(-2, -1);
            if (vowels.includes(p) && p === v) return v + v;
            return v;
        }
    },
    
    // Find heavy vowels
    isHeavy: function(char1, char2) {
        if (!char1 || !char2) return false;
        const pair = char1 + char2;
        // Doubled vowels or diphthongs ai/oi are "Heavy"
        return (char1 === char2 && "aeiou".includes(char1)) || 
               (pair === "ai" || pair === "oi");
    },

    // apply suffix 
    applySuffix: function(root, suffix) {
        if (!suffix) return root;
        const vowels = "aeiouy";
        const rLastV = this.getVowelCluster(root, false);
        const sFirstV = this.getVowelCluster(suffix, true);

        // If both are vowels, use the central Matrix logic
        if (vowels.includes(rLastV[0]) && vowels.includes(sFirstV[0])) {
            const preceding = root.slice(0, -rLastV.length); 
            // Call the shared logic from verbConjugator
            const combined = verbConjugator.combineVowels(rLastV, sFirstV, preceding);
            
            return root.slice(0, -rLastV.length) + combined + suffix.slice(sFirstV.length);
        }
        
        return root + suffix;
    },

    // Find word ending
    getEndingType: function(word) {
        if (!word || typeof word !== 'string') return "consonant";
        const vowels = "aeiouy";
        const last = word.slice(-1).toLowerCase();
        const penult = word.slice(-2, -1).toLowerCase();
        
        if (vowels.includes(last)) {
            // It's a long vowel if penult is the same or it's a known diphthong (ai/oi)
            if (last === penult || (penult === 'a' && last === 'i') || (penult === 'o' && last === 'i')) {
                return "longVowel";
            }
            return "vowel";
        }
        return "consonant";
    },

    // The logic block for Nominative
    getNominative: function(nounObj, number = "singular") {
        if (!nounObj || !nounObj.root) {
            console.error("getNominative received an invalid object:", nounObj);
            return "ERROR"; 
        }

        const root = nounObj.root;
        const ending = this.getEndingType(root);
        const nClass = nounObj.class;

        if (nClass === "animate") {
            // --- SINGULAR ---
            if (number === "singular") return root

            // --- DUAL --- (as for consonants and short vowels, VVs for long vowels)
            if (number === "dual") {
                if (ending === "consonant") return root + "as";
                if (ending === "longVowel") return root + "s";
                if (ending === "vowel") return root.slice(0,-1) + "as";
            }

            // --- PAUCAL --- (at for consonants and short vowels, VVt for long vowels)
            if (number === "paucal") {
                if (ending === "consonant") return root + "at";
                if (ending === "longVowel") return root + "t";
                if (ending === "vowel") return root.slice(0,-1) + "at";
            }

            // --- PLURAL --- (ak for consonants and short vowels, VVk for long vowels)
            if (number === "plural") {
                if (ending === "consonant") return root + "ak";
                if (ending === "longVowel") return root + "k";
                if (ending === "vowel") return root.slice(0,-1) + "ak";
            }
        }

        if (nClass === "inanimate") {
            // --- SINGULAR ---
            if (number === "singular") {
                if (ending === "consonant") return root + "at";
                if (ending === "longVowel") return root + "t";
                if (ending === "vowel") return root.slice(0,-1) + "at";
            }

            // --- INDEFINITE ---
            if (number === "plural") return root;
        }

        // Abstract return root for Nominative
        return root; 
    },

    // The logic block for Accusative
    getAccusative: function(nounObj, number = "singular") {
        if (!nounObj || !nounObj.root) return "ERROR";

        const root = nounObj.root;
        const nClass = nounObj.class;
        const endingType = this.getEndingType(root);
        
        // Animate are unmarked
        if (nClass !== "animate") return root;

        // Helper for consonant stems based on the s, r, k, t tables
        const applyConsonantInfix = (marker, suffix) => {
            const lastConsonant = root.slice(-1);
            const stem = root.slice(0, -1);
            // Based on the table: (s)ram -> marker + root_consonant + suffix
            return stem + marker + lastConsonant + suffix;
        };

        if (number === "singular") {
            const lastChar = root.slice(-1).toLowerCase();

            // 1. Vowel stem "o" gets "am" with removed "o"
            if (lastChar === 'o') {
                return root.slice(0, -1) + "am";
            }

            // 2. Vowel stems a, i, e, u, y and long vowels get "m"
            if (endingType === "longVowel" || ['a', 'i', 'e', 'u', 'y'].includes(lastChar)) {
                return root + "m";
            }

            // 3. Consonant stems get "am"
            return this.applySuffix(root, "am");
        }

        if (number === "dual") {
            if (endingType === "consonant") {
                const lastChar = root.slice(-1).toLowerCase();
                
                // n, m, s stems have no dual accusative (marked '-' in the table)
                if (['n', 'm', 's'].includes(lastChar)) {
                    return root; 
                }
                
                // r, t, k stems use the s-infix: (s)ram, (s)tam, (s)kam
                // Note: the suffix is "am" following the infix
                return applyConsonantInfix("s", "am");
            }

            // All vowel stems get 'sa' suffix 
            return this.applySuffix(root, "sa");
        }

        if (number === "paucal") {
            if (endingType === "consonant") {
                const last = root.slice(-1).toLowerCase();

                if (last === 'n') return root + "tham";
                if (last === 'm') return root + "dham";
                if (last === 's') return root + "tam";
                
                // k stems use an 'r' infix: (r)kam
                if (last === 'k') return applyConsonantInfix("r", "am"); 
                
                // r stems use a 't' infix: (t)ram
                if (last === 'r') return applyConsonantInfix("t", "am");

                // t stems get 'am' (replaces the 't')
                if (last === 't') return root + "am";
            }

            // All vowel stems get 'ta' suffix 
            return this.applySuffix(root, "ta");
        }

        if (number === "plural") {
            if (endingType === "consonant") {
                const last = root.slice(-1).toLowerCase();

                // n, m, s stems get the full 'kam' suffix
                if (['n', 'm', 's'].includes(last)) {
                    return root + "kam";
                }

                // k stem gets just 'am' (replaces the 'k' or absorbs it)
                if (last === 'k') {
                    return root + "am";
                }

                // t stem gets an 'r' infix: (r)tam
                if (last === 't') {
                    return applyConsonantInfix("r", "am");
                }

                // r stem (and fallbacks) gets a 'k' infix: (k)ram
                if (last === 'r') {
                    return applyConsonantInfix("k", "am");
                }
            }

            // All vowel stems get 'ka' suffix
            return this.applySuffix(root, "ka");
        }

        return root;
    },

    // The logic block for Ergative
    getErgative: function(nounObj, number = "singular") {
        if (!nounObj || !nounObj.root) return "ERROR";

        const root = nounObj.root;
        const nClass = nounObj.class;
        const endingType = this.getEndingType(root);

        // Animate Ergative is blank (-)
        if (nClass === "animate") return root;

        // --- INANIMATE LOGIC ---
        if (nClass === "inanimate") {
            const suffix = (number === "singular") ? "oot" : "oo";
            
            if (endingType === "consonant") {
                return root + suffix;
            }
            
            // Vowel stem (long and short): remove vowel(s) and use suffix
            const stemWithoutVowels = root.replace(/[aeiouy]+$/i, "");
            return stemWithoutVowels + suffix;
        }

        // --- ABSTRACT LOGIC ---
        if (nClass === "abstract") {
            const last = root.slice(-1).toLowerCase();

            if (endingType === "consonant") {
                // 1. 'n' consonant stem: add oo
                if (last === 'n') {
                    return root + "oo";
                }
                
                // 2. 'm', 'k', 't' stems: remove the consonant and add noo
                if (['m', 'k', 't'].includes(last)) {
                    return root.slice(0, -1) + "noo";
                }
                
                // 3. 's', 'r' stems: just add noo
                if (['s', 'r'].includes(last)) {
                    return root + "noo";
                }
            }

            // All vowel stems (short or long): just add noo
            return root + "noo";
        }

        return root;
    },
};