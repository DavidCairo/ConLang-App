window.updateNumberOptions = function() {
    const inputElement = document.getElementById('test-input');
    const numberSelect = document.getElementById('test-number');
    const caseSelect = document.getElementById('test-case');
    
    if (!inputElement || !numberSelect) return;

    const input = inputElement.value.trim().toLowerCase();
    const noun = nouns[input];
    const currentCase = caseSelect ? caseSelect.value : "NOM";

    // 1. If Case is "ROOT", force only Singular (since Root doesn't change)
    if (currentCase === "ROOT") {
        numberSelect.innerHTML = '<option value="singular">N/A (Root)</option>';
        return;
    }

    // If word not found, default to singular
    if (!noun) {
        numberSelect.innerHTML = '<option value="singular">Singular</option>';
        return;
    }

    // Logic based on Noun Class
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
        if (!nounObj) {
            resultDisplay.innerText = `"${input}" not found in nouns.`;
            return;
        }

        const caseType = document.getElementById('test-case').value;
        const num = document.getElementById('test-number').value;

        // Logic check
        let result = "";
        if (caseType === "ROOT") {
            // Just the root, no grammar applied
            result = nounObj.root; 
        } else if (caseType === "NOM") {
            // Use your new Nominative generator with number support
            result = NOM(nounObj, num); 
        } else if (caseType === "ACC") {
            result = ACC(nounObj, num); 
        } else if (caseType === "ERG") {
            result = ERG(nounObj, num); 
        }
        
        resultDisplay.innerText = result;
    } 
    else if (type === 'verb') {
        const verbObj = verbs[input];
        if (!verbObj) return resultDisplay.innerText = `Verb "${input}" not found!`;

        const person = document.getElementById('test-person').value;
        const aspect = document.getElementById('test-aspect').value;
        const tenseBase = document.getElementById('test-tense').value;
        
        // Construct the full tense string: e.g., "future perfective"
        const fullTense = `${tenseBase} ${aspect}`;

        // Pass the specific class from the person selection (e.g., "3rd animate" -> "animate")
        const nClass = person.split(' ').pop(); 

        resultDisplay.innerText = V(verbObj, nClass, person, "singular", fullTense);
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