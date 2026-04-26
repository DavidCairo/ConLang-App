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
    const inputField = document.getElementById('test-input');
    if (!inputField) return;
    
    const input = inputField.value.trim().toLowerCase();
    const numberSelect = (type === 'noun') 
        ? document.getElementById('test-number') 
        : document.getElementById('test-verb-number');
    
    if (!numberSelect) return;

    // Verb Logic
    if (type === 'verb') {
        numberSelect.innerHTML = `
            <option value="singular">Singular</option>
            <option value="dual">Dual</option>
            <option value="paucal">Paucal</option>
            <option value="plural">Plural</option>`;
        return;
    }

    // Noun Logic: Try English key first, then search for Tvaali root
    let noun = nouns[input]; 
    if (!noun) {
        noun = Object.values(nouns).find(n => n.root.toLowerCase() === input);
    }

    // If no noun is found yet (user still typing), show full options
    if (!noun) {
        numberSelect.innerHTML = `
            <option value="singular">Singular</option>
            <option value="dual">Dual</option>
            <option value="paucal">Paucal</option>
            <option value="plural">Plural</option>`;
        return;
    }

    // We found a noun! Now filter the numbers based on its class
    let optionsHtml = "";
    const nounClass = noun.class ? noun.class.toLowerCase() : "";

    if (nounClass === "animate") {
        optionsHtml = `
            <option value="singular">Singular</option>
            <option value="dual">Dual</option>
            <option value="paucal">Paucal</option>
            <option value="plural">Plural</option>`;
    } else if (nounClass === "inanimate") {
        optionsHtml = `
            <option value="singular">Singular</option>
            <option value="plural">Indefinite (Plural)</option>`;
    } else {
        // Fallback for special classes (e.g. Abstract/Collective)
        optionsHtml = `<option value="singular">Indefinite</option>`;
    }

    // Only update if the content actually changed to prevent focus flickering
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
    const input = document.getElementById('test-input').value.trim().toLowerCase();
    const resultDisplay = document.getElementById('sandbox-result');

    if (!input) {
        resultDisplay.innerText = "---";
        return;
    }

    if (type === 'noun') {
        const nounObj = nouns[input] || Object.values(nouns).find(n => n.root === input);
        if (!nounObj) return resultDisplay.innerText = "Noun not found";

        const caseType = document.getElementById('test-case').value;
        const num = document.getElementById('test-number').value;

        // Ensure these window shortcuts (NOM, ACC, etc) are defined in main.js
        if (typeof window[caseType] === "function") {
            resultDisplay.innerText = window[caseType](nounObj, num);
        } else {
            resultDisplay.innerText = nounObj.root; // Fallback to root
        }
    } 
    else if (type === 'verb') {
        const verbObj = verbs[input] || Object.values(verbs).find(v => v.stem === input);
        if (!verbObj) return resultDisplay.innerText = "Verb not found";

        // Collect Options for the Master Builder
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

        const person = document.getElementById('test-person').value;
        const number = document.getElementById('test-verb-number').value;
        const tense = document.getElementById('test-tense').value;
        const aspect = document.getElementById('test-aspect').value;

        // Extract vClass from the person string
        let vClass = "animate";
        if (person.includes("inanimate")) vClass = "inanimate";
        if (person.includes("abstract")) vClass = "abstract";
        if (person.includes("inclusive")) vClass = "inclusive";
        if (person.includes("exclusive")) vClass = "exclusive";

        const fullTense = `${tense} ${aspect}`;
        resultDisplay.innerText = verbConjugator.conjugate(verbObj, vClass, person, number, fullTense, options);
    }
};

window.handleAutocomplete = function(inputId = 'ref-search', listId = 'autocomplete-list') {
    const inputElement = document.getElementById(inputId);
    const suggestionsDiv = document.getElementById(listId);

    if (!inputElement || !suggestionsDiv) return;

    const term = inputElement.value.toLowerCase();

    // Clear everything if less than 2 characters
    if (term.length < 2) {
        suggestionsDiv.innerHTML = "";
        return;
    }

    // Combine and filter
    const combined = [
        ...Object.entries(nouns).map(([en, data]) => ({ en, tv: data.root, type: 'noun' })),
        ...Object.entries(verbs).map(([en, data]) => ({ en, tv: data.stem, type: 'verb' }))
    ].filter(item => item.en.toLowerCase().includes(term) || item.tv.toLowerCase().includes(term));

    // Render suggestions
    suggestionsDiv.innerHTML = combined.map(item => `
        <div class="suggestion-item" onclick="selectWord('${item.en}', '${item.type}', '${inputId}')">
            <span class="sugg-en">${item.en}</span>
            <span class="sugg-tv">${item.tv}</span>
            <span class="meta-tag tag-${item.type}">${item.type}</span>
        </div>
    `).join('');
};

window.selectWord = function(enKey, type, targetInputId = 'ref-search') {
    // 1. Fill the correct input and clear its specific autocomplete list
    const inputField = document.getElementById(targetInputId);
    if (inputField) inputField.value = enKey;

    const listId = (targetInputId === 'test-input') ? 'sandbox-autocomplete-list' : 'autocomplete-list';
    const suggestionsDiv = document.getElementById(listId);
    if (suggestionsDiv) suggestionsDiv.innerHTML = "";

    // 2. LOGIC: What happens after selection?
    
    // A. If selected FROM the Word Builder (test-input)
    if (targetInputId === 'test-input') {
        const typeSelect = document.getElementById('test-type');
        if (typeSelect) {
            typeSelect.value = type;
            toggleSandboxFields(); 
            if (type === 'noun') updateNumberOptions(); // Ensure noun numbers match
            runSandboxTest();
        }
    } 
    // B. If selected FROM the Morphology Explorer (ref-search)
    else {
        if (type === 'noun') {
            showNounTable(enKey);
        } else {
            // Verbs redirect to the builder since they don't have static tables
            const verbObj = verbs[enKey];
            if (verbObj) {
                const builderInput = document.getElementById('test-input');
                const builderType = document.getElementById('test-type');
                
                builderType.value = 'verb';
                builderInput.value = verbObj.stem;
                
                document.querySelector('.sandbox-card').scrollIntoView({ behavior: 'smooth' });
                toggleSandboxFields();
                runSandboxTest();
                
                // Clear the explorer search since we moved
                inputField.value = ""; 
            }
        }
    }
};

window.handleSandboxAutocomplete = function() {
    const type = document.getElementById('test-type').value;
    const term = document.getElementById('test-input').value.toLowerCase();
    const suggestionsDiv = document.getElementById('sandbox-autocomplete-list');

    // 1. Clear if less than 2 letters
    if (term.length < 2) {
        suggestionsDiv.innerHTML = "";
        runSandboxTest(); // Still run the test for custom/manual entries
        return;
    }

    // 2. Filter data based on the active mode (Noun or Verb)
    let combined = [];
    if (type === 'noun') {
        combined = Object.entries(nouns).map(([en, data]) => ({ en, tv: data.root, type: 'noun' }));
    } else {
        combined = Object.entries(verbs).map(([en, data]) => ({ en, tv: data.stem, type: 'verb' }));
    }

    const filtered = combined.filter(item => 
        item.en.toLowerCase().includes(term) || item.tv.toLowerCase().includes(term)
    );

    // 3. Render suggestions
    suggestionsDiv.innerHTML = filtered.map(item => `
        <div class="suggestion-item" onclick="selectSandboxWord('${item.tv}')">
            <span class="sugg-en">${item.en}</span>
            <span class="sugg-tv">${item.tv}</span>
        </div>
    `).join('');
    
    runSandboxTest();
};

window.selectSandboxWord = function(tvWord) {
    const input = document.getElementById('test-input');
    const suggestionsDiv = document.getElementById('sandbox-autocomplete-list');
    
    input.value = tvWord;
    suggestionsDiv.innerHTML = ""; // Hide list
    
    runSandboxTest(); // Update the result immediately
};

window.updateRefSearch = function() {
    const term = document.getElementById('ref-search').value.toLowerCase();
    const resultsDiv = document.getElementById('ref-search-results');
    
    // Combine nouns and verbs into one searchable list
    const combined = [
        ...Object.entries(nouns).map(([en, data]) => ({ en, root: data.root, type: 'noun', class: data.class })),
        ...Object.entries(verbs).map(([en, data]) => ({ en, root: data.stem, type: 'verb' }))
    ].filter(item => item.en.toLowerCase().includes(term) || item.root.toLowerCase().includes(term));

    resultsDiv.innerHTML = combined.map(item => `
        <div class="ref-item" onclick="${item.type === 'noun' ? `showNounTable('${item.en}')` : `showVerbTable('${item.en}')`}">
            <strong>${item.en}</strong> (${item.root})
            <span class="tag">${item.type}</span>
        </div>
    `).join('');
};

window.showNounTable = function(enKey) {
    const data = nouns[enKey];
    const display = document.getElementById('ref-display-area');
    const cases = ["NOM", "ERG", "ACC", "DAT", "GEN", "LOC", "TRA", "ALL", "ABL", "INS", "COM"];

    // 1. Determine columns based on Noun Class
    let columns = [];
    if (data.class === "animate") {
        columns = [
            { id: "singular", label: "Singular" },
            { id: "dual", label: "Dual" },
            { id: "paucal", label: "Paucal" },
            { id: "plural", label: "Plural" }
        ];
    } else if (data.class === "inanimate") {
        columns = [
            { id: "singular", label: "Singular" },
            { id: "plural", label: "Indefinite" } // Plural logic mapped to "Indefinite"
        ];
    } else if (data.class === "abstract") {
        columns = [
            { id: "singular", label: "Indefinite" } // Only one column for abstract
        ];
    }

    let tableHtml = `
        <div class="card fade-in">
            <h2>Noun Declension: ${enKey} (${data.root})</h2>
            <p>Class: <strong>${data.class.charAt(0).toUpperCase() + data.class.slice(1)}</strong></p>
            <div class="table-container"><table class="grammar-table">
                    <thead>
                        <tr>
                            <th>Case</th>
                            ${columns.map(col => `<th>${col.label}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${cases.map(c => `
                            <tr>
                                <td><strong>${c}</strong></td>
                                ${columns.map(col => `<td>${window[c](data, col.id)}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    display.innerHTML = tableHtml;
    display.scrollIntoView({ behavior: 'smooth' });
    window.NOM = (nounObj, num) => nounCaser.getNominative(nounObj, num);
    window.ERG = (nounObj, num) => nounCaser.getErgative(nounObj, num);
    window.ACC = (nounObj, num) => nounCaser.getAccusative(nounObj, num);
    window.DAT = (nounObj, num) => nounCaser.getDative(nounObj, num);
    window.GEN = (nounObj, num) => nounCaser.getGenitive(nounObj, num);
    window.LOC = (nounObj, num) => nounCaser.getLocative(nounObj, num);
    window.TRA = (nounObj, num) => nounCaser.getTransportative(nounObj, num);
    window.ALL = (nounObj, num) => nounCaser.getAllative(nounObj, num);
    window.ABL = (nounObj, num) => nounCaser.getAblative(nounObj, num);
    window.INS = (nounObj, num) => nounCaser.getInstrumental(nounObj, num);
    window.COM = (nounObj, num) => nounCaser.getComitative(nounObj, num);
};

window.showVerbTable = function(enKey) {
    const data = verbs[enKey];
    const display = document.getElementById('ref-display-area');
    
    // Config for the table rows/columns
    const persons = ["1st inclusive", "1st exclusive", "2nd formal", "2nd informal", "3rd animate", "3rd inanimate"];
    const numbers = ["singular", "dual", "paucal", "plural"];
    const modalKeys = Object.keys(verbConjugator.modals);

    let tableHtml = `
        <div class="card fade-in">
            <h2>Verb Conjugation: ${enKey} (Stem: ${data.stem})</h2>
            
            <div class="table-controls">
                <label>Select Modal Pattern:</label>
                <select id="modal-selector" onchange="updateVerbTableDisplay('${enKey}')">
                    ${modalKeys.map(m => `<option value="${m}">${m.charAt(0).toUpperCase() + m.slice(1)}</option>`).join('')}
                </select>
                
                <label style="margin-left: 20px;">
                    <input type="checkbox" id="interrogative-toggle" onchange="updateVerbTableDisplay('${enKey}')"> Interrogative Mode
                </label>
            </div>

            <div id="verb-table-container">
                </div>
        </div>
    `;
    
    display.innerHTML = tableHtml;
    updateVerbTableDisplay(enKey);
    display.scrollIntoView({ behavior: 'smooth' });
};

window.updateVerbTableDisplay = function(enKey) {
    const verbObj = verbs[enKey];
    const container = document.getElementById('verb-table-container');
    const selectedModal = document.getElementById('modal-selector').value;
    const isInterrogative = document.getElementById('interrogative-toggle').checked;

    const persons = ["1st inclusive", "1st exclusive", "2nd formal", "2nd informal", "3rd animate", "3rd inanimate"];
    const numbers = ["singular", "dual", "paucal", "plural"];

    let html = `
        <table class="grammar-table">
            <thead>
                <tr>
                    <th>Person</th>
                    <th>Singular</th>
                    <th>Dual</th>
                    <th>Paucal</th>
                    <th>Plural</th>
                </tr>
            </thead>
            <tbody>
                ${persons.map(p => `
                    <tr>
                        <td><strong>${p}</strong></td>
                        ${numbers.map(n => {
                            // Determine vClass based on person
                            const vClass = p.includes("animate") || p.includes("1st") || p.includes("2nd") ? "animate" : "inanimate";
                            
                            const form = verbConjugator.conjugate(verbObj, vClass, p, n, "present perfective", {
                                modal: selectedModal,
                                interrogative: isInterrogative
                            });
                            return `<td>${form}</td>`;
                        }).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    container.innerHTML = html;
};