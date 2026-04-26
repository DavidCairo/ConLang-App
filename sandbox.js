window.updateNumberOptions = function() {
    const type = document.getElementById('test-type').value;
    const inputElement = document.getElementById('test-input');
    
    // Select the correct dropdown based on the mode
    const numberSelect = (type === 'noun') 
        ? document.getElementById('test-number') 
        : document.getElementById('test-verb-number');
    
    if (!inputElement || !numberSelect) return;

    const input = inputElement.value.trim().toLowerCase();

    // VERB LOGIC
    if (type === 'verb') {
        // Standard Tvaali verbal number markers
        numberSelect.innerHTML = `
            <option value="singular">Singular</option>
            <option value="dual">Dual</option>
            <option value="paucal">Paucal</option>
            <option value="plural">Plural</option>`;
        return;
    }

    // NOUN LOGIC (Existing)
    const noun = nouns[input];
    const caseSelect = document.getElementById('test-case');
    const currentCase = caseSelect ? caseSelect.value : "NOM";

    if (currentCase === "ROOT") {
        numberSelect.innerHTML = '<option value="singular">N/A (Root)</option>';
        return;
    }

    if (!noun) {
        numberSelect.innerHTML = '<option value="singular">Singular</option>';
        return;
    }

    if (noun.class === "animate") {
        numberSelect.innerHTML = `
            <option value="singular">Singular</option>
            <option value="dual">Dual</option>
            <option value="paucal">Paucal</option>
            <option value="plural">Plural</option>`;
    } else if (noun.class === "inanimate") {
        numberSelect.innerHTML = `
            <option value="singular">Singular</option>
            <option value="plural">Indefinite</option>`;
    } else if (noun.class === "abstract") {
        numberSelect.innerHTML = `<option value="singular">Indefinite</option>`;
    }
};

window.runSandboxTest = function() {
    const type = document.getElementById('test-type').value;
    const input = document.getElementById('test-input').value.trim().toLowerCase();
    const resultDisplay = document.getElementById('sandbox-result');

    if (!input) {
        resultDisplay.innerText = "Please enter a word.";
        return;
    }

    if (type === 'noun') {
        const nounObj = nouns[input];
        if (!nounObj) return resultDisplay.innerText = `"${input}" not found in nouns.`;

        const caseType = document.getElementById('test-case').value;
        const num = document.getElementById('test-number').value;

        let result = "";
        if (caseType === "ROOT") result = nounObj.root; 
        else if (caseType === "NOM") result = NOM(nounObj, num); 
        else if (caseType === "ACC") result = ACC(nounObj, num); 
        else if (caseType === "ERG") result = ERG(nounObj, num); 
        
        resultDisplay.innerText = result;
    } 
    else if (type === 'verb') {
        const verbObj = verbs[input] || Object.values(verbs).find(v => v.stem === input);
        if (!verbObj) return resultDisplay.innerText = "Verb not found";

        const options = {
            passive: document.getElementById('test-passive').checked,
            causative: document.getElementById('test-causative').checked,
            interrogative: document.getElementById('test-interrogative').checked,
            negated: document.getElementById('test-negated').checked,
            modal: document.getElementById('test-modal').value
        };

        const person = document.getElementById('test-person').value;
        const number = document.getElementById('test-verb-number').value;
        const tense = document.getElementById('test-tense').value;
        const aspect = document.getElementById('test-aspect').value;

        // Determine vClass (simplified)
        const vClass = person.includes("inanimate") ? "inanimate" : "animate";

        const result = verbConjugator.conjugate(verbObj, vClass, person, number, `${tense} ${aspect}`, options);
        resultDisplay.innerText = result;
    }
};

window.toggleSandboxFields = function() {
    const type = document.getElementById('test-type').value;
    const inputField = document.getElementById('test-input');
    
    // Toggle field visibility
    document.getElementById('noun-fields').style.display = type === 'noun' ? 'block' : 'none';
    document.getElementById('verb-fields').style.display = type === 'verb' ? 'block' : 'none';

    // Update Placeholder
    if (type === 'noun') {
        inputField.placeholder = "Type a noun (e.g., woman, stone)";
    } else {
        inputField.placeholder = "Type a verb (e.g., love, laugh)";
    }

    // Reset the input and number options when switching types
    inputField.value = "";
    updateNumberOptions();
};

window.filterTenses = function() {
    const aspectElement = document.getElementById('test-aspect');
    const tenseSelect = document.getElementById('test-tense');
    
    // Safety: if we aren't on the verb screen, aspectElement might be hidden or null
    if (!aspectElement || !tenseSelect) return;

    const aspect = aspectElement.value;
    
    const allTenses = [
        "present", "past", "pluperfect", "perfect", 
        "future in past", "future perfect", "future in future", 
        "future", "indefinite"
    ];
    const habitualTenses = ["present", "past", "perfect"];

    const targetList = (aspect === "habitual") ? habitualTenses : allTenses;

    tenseSelect.innerHTML = targetList.map(t => `<option value="${t}">${t}</option>`).join('');
};