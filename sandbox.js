const numberOptionsByClass = {
    animate: [
        { val: "singular", label: "Singular" },
        { val: "dual", label: "Dual" },
        { val: "paucal", label: "Paucal" },
        { val: "plural", label: "Plural" }
    ],
    inanimate: [
        { val: "singular", label: "Singular" },
        { val: "plural", label: "Indefinite" }
    ],
    abstract: [
        { val: "singular", label: "Indefinite" }
    ]
};

/* ==========================================================================
   UI STATE & TOGGLES
   ========================================================================== */

window.toggleSandboxFields = function() {
    const type = document.getElementById('test-type').value;
    const inputField = document.getElementById('test-input');
    
    // Toggle containers
    document.getElementById('noun-fields').style.display = type === 'noun' ? 'flex' : 'none';
    document.getElementById('verb-fields').style.display = type === 'verb' ? 'flex' : 'none';

    // Update Placeholder context
    inputField.placeholder = type === 'noun' ? "Enter noun (e.g. woman, sidhi)" : "Enter verb (e.g. love, stem)";

    // Refresh dynamic dropdowns
    updateNumberOptions();
    if (type === 'verb') filterTenses();
    
    runSandboxTest();
};

window.updateNumberOptions = function() {
    const type = document.getElementById('test-type').value;
    const input = document.getElementById('test-input').value.trim();
    const numberSelect = (type === 'noun') ? document.getElementById('test-number') : document.getElementById('test-verb-number');
    if (!numberSelect) return;

    if (type === 'verb') {
        numberSelect.innerHTML = `<option value="singular">Singular</option><option value="dual">Dual</option><option value="paucal">Paucal</option><option value="plural">Plural</option>`;
        return;
    }

    const wordObj = findByEn(input);
    let optionsHtml = "";

    if (!wordObj || wordObj.entries[0].class === "animate") {
        optionsHtml = `<option value="singular">Singular</option><option value="dual">Dual</option><option value="paucal">Paucal</option><option value="plural">Plural</option>`;
    } else if (wordObj.entries[0].class === "inanimate") {
        optionsHtml = `<option value="singular">Singular</option><option value="plural">Indefinite (Plural)</option>`;
    } else {
        optionsHtml = `<option value="singular">Indefinite</option>`;
    }

    if (numberSelect.innerHTML !== optionsHtml) {
        numberSelect.innerHTML = optionsHtml;
    }
};

window.filterTenses = function() {
    const aspect = document.getElementById('test-aspect')?.value;
    const tenseSelect = document.getElementById('test-tense');
    if (!aspect || !tenseSelect) return;

    const allTenses = ["present", "past", "pluperfect", "perfect", "future in past", "future perfect", "future in future", "future", "infinitive"];
    const habitualTenses = ["present", "past", "perfect"];
    const targetList = (aspect === "habitual") ? habitualTenses : allTenses;

    tenseSelect.innerHTML = targetList.map(t => `<option value="${t}">${t.charAt(0).toUpperCase() + t.slice(1)}</option>`).join('');
    runSandboxTest();
};

/* ==========================================================================
   CORE CALCULATION ENGINE
   ========================================================================== */

window.runSandboxTest = function() {
    const type = document.getElementById('test-type').value;
    const inputField = document.getElementById('test-input');
    // 1. Get the ID stored in the dataset
    const wordId = inputField.dataset.wordId;
    const resultDisplay = document.getElementById('sandbox-result');

    // 2. Safety check: Ensure we have a selection
    if (!wordId || !inputField.value.trim()) {
        resultDisplay.innerText = "---";
        return;
    }

    // 3. Find the word by ID (Exact Match) instead of English name
    const wordObj = lexicon.find(w => w.id === wordId);
    
    if (!wordObj) {
        return resultDisplay.innerText = `${type.charAt(0).toUpperCase() + type.slice(1)} ID not found`;
    }

    if (type === 'noun') {
        const caseType = document.getElementById('test-case').value;
        const selectedNumber = document.getElementById('test-number').value || "singular";
        
        if (typeof window[caseType] === "function") {
            // Bridge handles the noun logic
            const result = window[caseType](wordObj, selectedNumber);
            resultDisplay.innerText = result || "Error generating form";
        }
    } 
    else if (type === 'verb') {
        const person = document.getElementById('test-person').value;
        const number = document.getElementById('test-verb-number').value;
        const tense = document.getElementById('test-tense').value;
        const aspect = document.getElementById('test-aspect').value;

        // Determine class from the person string
        let nClass = "animate";
        if (person.includes("inanimate")) nClass = "inanimate";
        else if (person.includes("abstract")) nClass = "abstract";

        const options = {
            passive: document.getElementById('test-passive').checked,
            detransitive: document.getElementById('test-detrans').checked,
            causative: document.getElementById('test-causative').checked,
            reflexive: document.getElementById('test-reflexive').checked,
            negated: document.getElementById('test-negated').checked,
            interrogative: document.getElementById('test-interrogative').checked,
            modal: document.getElementById('test-modal').value,
            applicative: document.getElementById('test-applicative').value,
            evidential: document.getElementById('test-evidential').value
        };

        // Pass the full wordObj to the V bridge
        resultDisplay.innerText = V(wordObj, nClass, person, number, `${tense} ${aspect}`, options);
    }
};

window.handleAutocomplete = function(inputId = 'ref-search', listId = 'autocomplete-list') {
    const inputElement = document.getElementById(inputId);
    const suggestionsDiv = document.getElementById(listId);
    if (!inputElement || !suggestionsDiv) return;

    const term = inputElement.value.toLowerCase().trim();
    if (term.length < 2) {
        suggestionsDiv.innerHTML = "";
        return;
    }

    const matches = lexicon.filter(word => {
        const tvMatch = word.tv.toLowerCase().includes(term);
        const enMatch = word.entries.some(e => 
            e.senses.some(s => s.en.some(en => en.toLowerCase().includes(term)))
        );
        return tvMatch || enMatch;
    }).slice(0, 8);

    suggestionsDiv.innerHTML = matches.map(word => {
        const primaryEn = word.entries[0].senses[0].en[0];
        const type = word.entries[0].type;
        // FIX: Pass word.id instead of primaryEn
        return `
            <div class="suggestion-item" onclick="selectWord('${word.id}', '${type}', '${inputId}')">
                <span class="sugg-en">${primaryEn}</span>
                <span class="sugg-tv">${word.tv}</span>
                <span class="meta-tag tag-${type}">${type}</span>
            </div>
        `;
    }).join('');
};

window.selectWord = function(wordId, type, inputId) {
    // 1. Find the exact word using the unique ID
    const wordObj = lexicon.find(w => w.id === wordId);
    if (!wordObj) {
        console.error("Could not find word with ID:", wordId);
        return;
    }

    const inputField = document.getElementById(inputId);
    const primaryEn = wordObj.entries[0].senses[0].en[0];

    // 2. Update the input field: Display English, but store the ID
    inputField.value = primaryEn; 
    inputField.dataset.wordId = wordId; 

    // 3. Clear the correct suggestion list
    const listId = (inputId === 'test-input') ? 'sandbox-autocomplete-list' : 'autocomplete-list';
    const listElement = document.getElementById(listId);
    if (listElement) listElement.innerHTML = "";
    
    // 4. Logic: Route based on where the click came from
    if (inputId === 'test-input') {
        // From Word Builder (Sandbox)
        document.getElementById('test-type').value = type;
        toggleSandboxFields(); 
        // Note: runSandboxTest() is usually triggered inside toggleSandboxFields()
    } 
    else {
        // From Morphology Explorer
        if (type === 'noun') {
            // Pass the ID to showNounTable to ensure it grabs the right "play"
            showNounTable(wordId);
        } else {
            // VERB REDIRECT FEATURE: Move from Explorer to Builder
            const builderInput = document.getElementById('test-input');
            const builderType = document.getElementById('test-type');
            
            builderType.value = 'verb';
            builderInput.value = primaryEn; 
            builderInput.dataset.wordId = wordId; // CRITICAL: Carry the ID over!

            // UI Cleanup
            const refArea = document.getElementById('ref-display-area');
            if (refArea) refArea.innerHTML = "";
            
            document.querySelector('.sandbox-card').scrollIntoView({ behavior: 'smooth' });
            
            // Clear the explorer search bar after redirect
            inputField.value = ""; 
            delete inputField.dataset.wordId;
            
            toggleSandboxFields();
        }
    }
};

window.showNounTable = function(wordId) {
    // Look up by ID first, fallback to English if ID search fails
    const wordObj = lexicon.find(w => w.id === wordId) || findByEn(wordId);
    if (!wordObj) return;

    const entry = wordObj.entries[0];
    const primaryEn = entry.senses[0].en[0];
    const display = document.getElementById('ref-display-area');
    const cases = ["NOM", "ERG", "ACC", "DAT", "GEN", "LOC", "TRA", "ALL", "ABL", "INS", "COM"];

    let columns = [];
    if (entry.class === "animate") {
        columns = [{ id: "singular", label: "Singular" }, { id: "dual", label: "Dual" }, { id: "paucal", label: "Paucal" }, { id: "plural", label: "Plural" }];
    } else if (entry.class === "inanimate") {
        columns = [{ id: "singular", label: "Singular" }, { id: "plural", label: "Indefinite (Plural)" }];
    } else {
        columns = [{ id: "singular", label: "Indefinite" }];
    }

    display.innerHTML = `
        <div class="card fade-in">
            <h2>Noun Declension: ${primaryEn} (${wordObj.tv})</h2>
            <p>Class: <strong>${entry.class}</strong></p>
            <div class="table-container">
                <table class="grammar-table">
                    <thead><tr><th>Case</th>${columns.map(col => `<th>${col.label}</th>`).join('')}</tr></thead>
                    <tbody>
                        ${cases.map(c => `<tr><td><strong>${c}</strong></td>
                            ${columns.map(col => {
                                const form = (typeof window[c] === 'function') ? window[c](wordObj, col.id) : "N/A";
                                return `<td>${form}</td>`;
                            }).join('')}
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    display.scrollIntoView({ behavior: 'smooth' });
};

window.showVerbTable = function(wordId) {
    const wordObj = lexicon.find(w => w.id === wordId) || findByEn(wordId);
    if (!wordObj) return;

    const entry = wordObj.entries[0];
    const primaryEn = entry.senses[0].en[0];
    const display = document.getElementById('ref-display-area');
    const modalKeys = Object.keys(verbConjugator.modals);

    let tableHtml = `
        <div class="card fade-in">
            <h2>Verb Conjugation: ${primaryEn} (Stem: ${wordObj.tv})</h2>
            <p>Type: <strong>${entry.trans ? 'Transitive' : 'Intransitive'}</strong></p>
            
            <div class="table-controls">
                <label>Select Modal Pattern:</label>
                <select id="modal-selector" onchange="updateVerbTableDisplay('${wordObj.id}')">
                    ${modalKeys.map(m => `<option value="${m}">${m.charAt(0).toUpperCase() + m.slice(1)}</option>`).join('')}
                </select>
                
                <label style="margin-left: 20px;">
                    <input type="checkbox" id="interrogative-toggle" onchange="updateVerbTableDisplay('${wordObj.id}')"> Interrogative Mode
                </label>
            </div>

            <div id="verb-table-container"></div>
            
            <div style="margin-top: 20px; text-align: center;">
                <button class="primary-btn" onclick="selectWord('${wordObj.id}', 'verb', 'test-input')">
                    Open in Word Builder for Full Settings
                </button>
            </div>
        </div>
    `;
    
    display.innerHTML = tableHtml;
    updateVerbTableDisplay(wordObj.id); // Call with ID
    display.scrollIntoView({ behavior: 'smooth' });
};

window.updateVerbTableDisplay = function(wordId) {
    // 1. Look up by ID first to prevent Noun/Verb collisions
    const wordObj = lexicon.find(w => w.id === wordId) || findByEn(wordId);
    const container = document.getElementById('verb-table-container');
    if (!wordObj || !container) return;

    const modal = document.getElementById('modal-selector').value;
    const isInterrogative = document.getElementById('interrogative-toggle').checked;
    
    const persons = ["1st inclusive", "1st exclusive", "2nd formal", "2nd informal", "3rd animate", "3rd inanimate"];
    const numbers = ["singular", "dual", "paucal", "plural"];

    let html = `
        <div class="table-container">
            <table class="grammar-table">
                <thead>
                    <tr>
                        <th>Person</th>
                        ${numbers.map(n => `<th>${n.charAt(0).toUpperCase() + n.slice(1)}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${persons.map(p => `
                        <tr>
                            <td><strong>${p}</strong></td>
                            ${numbers.map(n => {
                                // 2. Determine class properly (Handling all 3 potential classes)
                                let vClass = "animate";
                                if (p.includes("inanimate")) vClass = "inanimate";
                                else if (p.includes("abstract")) vClass = "abstract";
                                
                                const defaultTense = "present perfective";
                                
                                // 3. Pass the full wordObj directly to the V bridge
                                return `<td>${V(wordObj, vClass, p, n, defaultTense, { modal, interrogative: isInterrogative })}</td>`;
                            }).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    container.innerHTML = html;
};

// old logic

// window.handleSandboxAutocomplete = function() {
//     const type = document.getElementById('test-type').value;
//     const term = document.getElementById('test-input').value.toLowerCase();
//     const suggestionsDiv = document.getElementById('sandbox-autocomplete-list');

//     // 1. Clear if less than 2 letters
//     if (term.length < 2) {
//         suggestionsDiv.innerHTML = "";
//         runSandboxTest(); // Still run the test for custom/manual entries
//         return;
//     }

//     // 2. Filter data based on the active mode (Noun or Verb)
//     let combined = [];
//     if (type === 'noun') {
//         combined = Object.entries(nouns).map(([en, data]) => ({ en, tv: data.root, type: 'noun' }));
//     } else {
//         combined = Object.entries(verbs).map(([en, data]) => ({ en, tv: data.stem, type: 'verb' }));
//     }

//     const filtered = combined.filter(item => 
//         item.en.toLowerCase().includes(term) || item.tv.toLowerCase().includes(term)
//     );

//     // 3. Render suggestions
//     suggestionsDiv.innerHTML = filtered.map(item => `
//         <div class="suggestion-item" onclick="selectSandboxWord('${item.tv}')">
//             <span class="sugg-en">${item.en}</span>
//             <span class="sugg-tv">${item.tv}</span>
//         </div>
//     `).join('');
    
//     runSandboxTest();
// };

// window.selectSandboxWord = function(tvWord) {
//     const input = document.getElementById('test-input');
//     const suggestionsDiv = document.getElementById('sandbox-autocomplete-list');
    
//     input.value = tvWord;
//     suggestionsDiv.innerHTML = ""; // Hide list
    
//     runSandboxTest(); // Update the result immediately
// };

// window.updateRefSearch = function() {
//     const term = document.getElementById('ref-search').value.toLowerCase();
//     const resultsDiv = document.getElementById('ref-search-results');
    
//     // Combine nouns and verbs into one searchable list
//     const combined = [
//         ...Object.entries(nouns).map(([en, data]) => ({ en, root: data.root, type: 'noun', class: data.class })),
//         ...Object.entries(verbs).map(([en, data]) => ({ en, root: data.stem, type: 'verb' }))
//     ].filter(item => item.en.toLowerCase().includes(term) || item.root.toLowerCase().includes(term));

//     resultsDiv.innerHTML = combined.map(item => `
//         <div class="ref-item" onclick="${item.type === 'noun' ? `showNounTable('${item.en}')` : `showVerbTable('${item.en}')`}">
//             <strong>${item.en}</strong> (${item.root})
//             <span class="tag">${item.type}</span>
//         </div>
//     `).join('');
// };
