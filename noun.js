const nounCaser = {
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
        console.log(`Testing: ${root} + ${suffix}`);
        const vowels = "aeiou";
        const heavySingle = "aoi"; // Updated per your requirements
        
        const rootEnding = root.slice(-1).toLowerCase();
        const suffixStart = suffix.charAt(0).toLowerCase();
        const endingType = this.getEndingType(root);

        // Check if suffix creates a heavy environment
        const createsHeavyPair = this.isHeavy(rootEnding, suffixStart);
        const startsWithHeavy = heavySingle.includes(suffixStart);

        if (vowels.includes(rootEnding) && (startsWithHeavy || createsHeavyPair)) {
            
            // RULE 1: Long vowels of the stem override suffixes 
            // We keep the stem's long vowel and trim the SUFFIX's first vowel
            if (endingType === "longVowel") {
                // If suffix is "oot", we just want "ot" to append to the long stem
                const trimmedSuffix = vowels.includes(suffixStart) ? suffix.slice(1) : suffix;
                return root + trimmedSuffix;
            }

            // RULE 2: Heavy short vowels of the suffix override short vowels of the stem
            // We delete the root's short vowel and keep the full suffix
            return root.slice(0, -1) + suffix;
        }
        
        // Default: just join them
        return root + suffix;
    },

    // Find word ending
    getEndingType: function(word) {
    if (!word || typeof word !== 'string') return "consonant";
    
        const vowels = "aeiou";
        const last = word.slice(-1).toLowerCase();
        const penult = word.slice(-2, -1).toLowerCase();
        
        // Check if it's a long vowel using your isHeavy logic
        if (this.isHeavy(penult, last)) return "longVowel";
        if (vowels.includes(last)) return "vowel";
        return "consonant";
    },

    // The logic block for Accusative
    getAccusative: function(nounObj, number = "singular") {
        if (!nounObj || !nounObj.root) {
            console.error("getAccusative received an invalid object:", nounObj);
            return "ERROR"; 
        }

        const root = nounObj.root;
        const ending = this.getEndingType(root);
        const nClass = nounObj.class;

        if (nClass === "animate") {
            // --- SINGULAR ---
            if (number === "singular") {
                // Specific rule: -m for long vowels or 'a' roots, -am for others
                if (ending === "longVowel" || root.endsWith("a")) {
                    return root + "m";
                }
                // applySuffix handles the heavy 'a' in 'am' overriding other short vowels
                return this.applySuffix(root, "am");
            }

            // --- DUAL --- (-mro, -mdo, -nko for consonants; -m for vowels)
            if (number === "dual") {
                if (ending !== "consonant") return root + "m";
                
                const lastConsonant = root.slice(-1); 
                const stem = root.slice(0, -1);
                switch (lastConsonant) {
                    case "r": return stem + "mro";
                    case "t": return stem + "mdo";
                    case "k": return stem + "nko";
                    default:  return root; 
                }
            }

            // --- PAUCAL --- (-nro, -nto, -nko for consonants; -t for vowels)
            if (number === "paucal") {
                if (ending !== "consonant") return root + "t";
                
                const lastConsonant = root.slice(-1); 
                const stem = root.slice(0, -1);
                switch (lastConsonant) {
                    case "r": return stem + "nro";
                    case "t": return stem + "nto";
                    case "k": return stem + "nko";
                    default:  return root; 
                }
            }

            // --- PLURAL --- (-kro, -kto, -ko for consonants; -k for vowels)
            if (number === "plural") {
                if (ending !== "consonant") return root + "k";
                
                const lastConsonant = root.slice(-1); 
                const stem = root.slice(0, -1);
                switch (lastConsonant) {
                    case "r": return stem + "kro";
                    case "t": return stem + "kto";
                    case "k": return root; // -k on a root ending in -k stays root
                    default:  return root + "ko"; 
                }
            }
        }

        // Inanimate and Abstract return root for Accusative
        return root; 
    },

    // The logic block for Ergative
    getErgative: function(nounObj, number = "singular") {
    if (!nounObj || !nounObj.root) return "ERROR";

    const root = nounObj.root;
    const nClass = nounObj.class;
    const ending = this.getEndingType(root);

    // Inanimate Logic
    if (nClass === "inanimate") {
        const suffix = (number === "singular") ? "oot" : "oo";
        return this.applySuffix(root, suffix);
    }

    // Abstract Logic
    if (nClass === "abstract") {
        // Since 'ak' starts with a heavy vowel 'a', 
        // applySuffix will automatically handle the root vowel deletion.
        if (ending === "longVowel") return root + "k"; // Special rule: keep long + k
        return this.applySuffix(root, "ak");
    }

    return root; 
},
};