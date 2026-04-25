// Current possible quizes 
const allLessons = [lesson1Data, lesson2Data, lesson3Data, lesson4Data, lesson5Data, lesson6Data, lesson7Data, lesson8Data, lesson9Data, lesson10Data, lesson11Data, lesson12Data, lesson13Data, lesson14Data, lesson15Data, lesson16Data, lesson17Data, lesson18Data, lesson19Data, lesson20Data, lesson21Data, lesson22Data, lesson23Data, lesson24Data]
const courseUnits = [
    {
        title: "The Basics",
        color: "#e3f2fd", // Light Blue
        lessonIds: [1, 2, 3, 4, 5]
    },
    {
        title: "Action",
        color: "#f3e5f5", // Light Purple
        lessonIds: [6, 7, 8, 9, 10, 11, 12, 13]
    },
    {
        title: "Social Lense",
        color: "#e8f5e9", // Light Green
        lessonIds: [14, 15, 16, 17, 18]
    },
    {
        title: "Connectivity",
        color: "#f5e9e8ff", // Light Red
        lessonIds: [19, 20, 21, 22, 23, 24]
    },
];

// Allow for shuffling of arrays
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Make homepage
function renderHome() {
    const app = document.getElementById('app');
    activeLesson = null;
    
    let html = `
        <div class="nav-container">
            <button class="primary-btn" onclick="renderDictionary()">📖 Dictionary</button>
            <button class="primary-btn" onclick="renderReference()">📚 Grammar Tables</button>
        </div>
        <h1>Tvaali Course</h1>
    `;

    courseUnits.forEach(unit => {
        html += `
            <div class="unit-container" style="background-color: ${unit.color}">
                <h2 class="unit-header">${unit.title}</h2>
                <div class="unit-lessons">
        `;

        // Filter allLessons to find the ones belonging to this unit
        const unitLessons = allLessons.filter(l => unit.lessonIds.includes(l.id));

        unitLessons.forEach(lesson => {
            const subLessons = lesson.subLessons || [];
            
            // FIX: Filter progress specifically for this lesson ID
            const lessonCompletions = completedSubLessons.filter(key => key.startsWith(`${lesson.id}-`));
            const doneCount = lessonCompletions.length;
            const totalCount = subLessons.length;

            const progressSegments = subLessons.map((sub, index) => {
                const isDone = completedSubLessons.includes(`${lesson.id}-${index}`);
                const statusClass = isDone ? 'segment-done' : 'segment-pending';
                return `
                    <div class="progress-segment ${statusClass}" 
                         onclick="startSubLesson(${lesson.id}, ${index})"
                         title="${sub.title}">
                        <span class="segment-number">${index + 1}</span>
                    </div>
                `;
            }).join('');

            html += `
                <div class="lesson-card">
                    <button class="info-btn-home" onclick="showInfo(${lesson.id})" title="Lesson Info">ⓘ</button>
                    <h3>Lesson ${lesson.id}: ${lesson.title}</h3>
                    <div class="lesson-progress-container">
                        <div class="progress-bar-line">
                            ${progressSegments}
                        </div>
                        <p class="progress-text">${doneCount} / ${totalCount} Parts Complete</p>
                    </div>
                </div>
            `;
        });

        html += `</div></div>`; // Close unit-lessons and unit-container
    });

    app.innerHTML = html;
}

// Make the dictionary at the homepage
function renderDictionary() {
    const app = document.getElementById('app');
    
    let html = `
        <div class="nav-container">
            <button class="primary-btn" onclick="renderHome()">⬅ Back to Lessons</button>
        </div>
        <h1>Tvaali Dictionary</h1>

        <div class="card sandbox-card">
            <h3>Grammar Tester</h3>
            
            <div class="sandbox-global-controls">
                <select id="test-type" onchange="toggleSandboxFields(); updateNumberOptions();">
                    <option value="noun">Noun Caser</option>
                    <option value="verb">Verb Conjugator</option>
                </select>
                <input type="text" id="test-input" oninput="updateNumberOptions()" placeholder="Type a word...">
            </div>

            <div class="sandbox-display-wrapper">
                
                <div id="noun-fields" class="sandbox-column">
                    <label>Noun Settings</label>
                    <select id="test-case" onchange="updateNumberOptions()">
                        <option value="ROOT">Root</option>
                        <option value="NOM">Nominative</option>
                        <option value="ERG">Ergative</option>
                        <option value="ACC">Accusative</option>
                        <option value="DAT">Dative</option>
                        <option value="GEN">Genitive</option>
                        <option value="LOC">Locative</option>
                        <option value="TRA">Transportative</option>
                        <option value="ALL">Allative</option>
                        <option value="ABL">Ablative</option>
                        <option value="INS">Instrumental</option>
                        <option value="COM">Comitative</option>
                    </select>
                    <select id="test-number"></select>
                </div>

                <div id="verb-fields" class="sandbox-column">
                    <label>Verb Settings</label>
                    <select id="test-person" onchange="updateNumberOptions()">
                        <option value="1st inclusive">1st inclusive</option>
                        <option value="1st exclusive">1st exclusive</option>
                        <option value="2nd formal">2nd formal</option>
                        <option value="2nd informal">2nd informal</option>
                        <option value="3rd animate">3rd animate</option>
                        <option value="3rd inanimate">3rd inanimate</option>
                        <option value="3rd abstract">3rd abstract</option>
                        <option value="indefinite animate">indefinite animate</option>
                        <option value="indefinite inanimate">indefinite inanimate</option>
                    </select>

                    <select id="test-verb-number"></select>

                    <select id="test-aspect" onchange="filterTenses()">
                        <option value="perfective">Perfective</option>
                        <option value="continuous">Continuous</option>
                        <option value="habitual">Habitual</option>
                    </select>

                    <select id="test-tense"></select>
                </div>
            </div>

            <div class="sandbox-footer">
                <button class="primary-btn" onclick="runSandboxTest()">Generate Form</button>
                <h2 id="sandbox-result">---</h2>
            </div>
        </div>
        <div class="dict-grid">
            <div class="card">
                <h3>Nouns</h3>
                <table class="dict-table">
                <thead><tr><th>English</th><th>Root</th><th>Class</th></tr></thead>
                <tbody>

                ${Object.entries(nouns).map(([en, data]) => `

                <tr><td>${en}</td><td>${data.root}</td><td>${data.class}</td></tr>

                `).join('')}

                </tbody>
                </table>
            </div>

            <div class="card">
                <h3>Verbs</h3>
                <table class="dict-table">
                <thead><tr><th>English</th><th>Stem</th><th>Trans.</th></tr></thead>
                <tbody>

                ${Object.entries(verbs).map(([en, data]) => `

                <tr><td>${en}</td><td>${data.stem}</td><td>${data.trans ? "Y" : "N"}</td></tr>

                `).join('')}

                </tbody>
                </table>
            </div>
        </div>
        `;

    app.innerHTML = html;
    
    toggleSandboxFields(); 
    updateNumberOptions();
    filterTenses();
}

function renderReference() {
    const app = document.getElementById('app');
    
    let html = `
        <div class="nav-container">
            <button class="primary-btn" onclick="renderHome()">⬅ Back to Lessons</button>
        </div>
        <h1>Grammar Reference</h1>

        <div class="card">
            <h3>Morphology Tables</h3>
            <p>Search for a word to see its full declension or conjugation patterns.</p>
            <input type="text" id="ref-search" oninput="updateRefSearch()" placeholder="Search English or Tvaali root...">
            
            <div id="ref-search-results" class="ref-search-grid">
                </div>
        </div>

        <div id="ref-display-area">
            </div>
    `;

    app.innerHTML = html;
    updateRefSearch(); // Initial populate
}

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
            <table class="grammar-table">
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
    `;
    display.innerHTML = tableHtml;
    display.scrollIntoView({ behavior: 'smooth' });
};

// Function to show the info popup
window.showInfo = function(lessonId) {
    const lesson = allLessons.find(l => l.id === lessonId);
    if (!lesson) return;

    const modal = document.getElementById('infoModal');
    const content = document.getElementById('modalContent'); 

    if (!modal || !content) return;

    let vocabCards = "";
    const wordsToDisplay = lesson.newWords || [];

    if (wordsToDisplay.length === 0) {
        vocabCards = `<p style="text-align:center; color:#666; padding:20px;">No new vocabulary introduced in this lesson.</p>`;
    } else {
        wordsToDisplay.forEach(tvaaliRoot => {
            const nounEntry = Object.entries(nouns).find(([en, obj]) => obj.root === tvaaliRoot);
            const verbEntry = Object.entries(verbs).find(([en, obj]) => obj.stem === tvaaliRoot);
            
            let english = "Unknown";
            let meta = "";

            if (nounEntry) {
                english = nounEntry[0];
                meta = `<span class="meta-tag tag-${nounEntry[1].class.toLowerCase()}">${nounEntry[1].class}</span>`;
            } else if (verbEntry) {
                english = verbEntry[0];
                meta = `<span class="meta-tag tag-verb">verb</span>`;
            }
            
            vocabCards += `
                <div class="modal-vocab-row">
                    <div class="vocab-left">
                        <span class="en-word">${english}</span>
                        ${meta}
                    </div>
                    <div class="vocab-right">
                        <span class="tvaali-text">${tvaaliRoot}</span>
                    </div>
                </div>
            `;
        });
    }

    content.innerHTML = `
        <span class="close-modal" onclick="closeModal()">&times;</span>
        <div class="modal-header">
            <h2>${lesson.title}</h2>
            <p>${lesson.description}</p>
        </div>
        
        <div class="modal-vocab-section">
            <h3>New Vocabulary</h3>
            <div class="modal-vocab-list">
                ${vocabCards}
            </div>
        </div>
    `;

    modal.style.display = "block";
};

window.closeModal = function() {
    const modal = document.getElementById('infoModal');
    if (modal) modal.style.display = "none";
};

// Also close if they click outside the white box
window.onclick = function(event) {
    const modal = document.getElementById('infoModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// Hover over word to show translation
function wrapWords(sentence, isTvaali = false, newWordsList = []) {
    if (!sentence) return "";
    const words = (Array.isArray(sentence) ? sentence[0] : sentence).split(" ");
    
    return words.map(word => {
        const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, "");
        if (["the", "is", "a", "an"].includes(cleanWord)) return word;

        let info = "";

        if (isTvaali) {
    const match = tvaaliLookup[cleanWord];
    
    if (match) {
        if (match.type === 'noun') {
                info = `En: ${match.en} | ${match.data.class}`;
            } 
            else if (match.type === 'verb') {
                // Show the specific conjugation details
                const d = match.details;
                const detailStr = d ? ` (${d.person} ${d.number} ${d.tense})` : "";
                info = `Verb: ${match.en}${detailStr}`;
            } 
            else if (match.type === 'number') {
                // Show the digit value for Tvaali numbers
                info = `Digit: ${match.value}`;
            }
        }
    } else {
            // English lookup...
            const nounKey = Object.keys(nouns).find(k => cleanWord === k.toLowerCase());
            const verbKey = Object.keys(verbs).find(k => cleanWord.includes(k.toLowerCase()));
            if (nounKey) info = `Tv: ${nouns[nounKey].root}`;
            else if (verbKey) info = `Tv: ${verbs[verbKey].stem}`;
            else if (!isNaN(cleanWord)) info = `Tv: ${NUM(parseInt(cleanWord))}`;
        }

        if (info) {
            const highlight = (newWordsList || []).some(nw => cleanWord.includes(nw.toLowerCase())) ? "new-word-highlight" : "";
            return `<span class="word-tooltip ${highlight}">${word}<span class="tooltip-text">${info}</span></span>`;
        }
        return word; 
    }).join(" ");
}

// Parse numbers to allow for digit conversion
function parseTvaaliNumber(str) {
    const parts = str.split("-");
    let total = 0;
    let currentCount = 0;

    // Map names back to numbers
    const nameToVal = {};
    for (let [num, obj] of Object.entries(numbers)) {
        nameToVal[obj.cardinal] = parseInt(num);
        nameToVal[obj.ordinal] = parseInt(num);
    }
    const baseToVal = {};
    for (let [val, name] of Object.entries(numBases)) {
        baseToVal[name] = parseInt(val);
        baseToVal[name + "ar"] = parseInt(val);
    }

    for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (nameToVal[p] !== undefined) {
            currentCount = nameToVal[p];
            // If it's the last word and we haven't hit a base, it's just the ones
            if (i === parts.length - 1) total += currentCount;
        } else if (baseToVal[p] !== undefined) {
            total += (currentCount || 1) * baseToVal[p];
            currentCount = 0; // Reset for next part
        }
    }
    return total;
}


// Check if a lesson has been shuffled
function renderSortingModule(module) {
    const app = document.getElementById('app');
    
    // 1. Create the combined list if it doesn't exist yet
    if (!module.shuffledList) {
        module.shuffledList = shuffleArray([...module.groups.Animate, ...module.groups.Inanimate]);
    }

    const word = module.shuffledList[currentSubStep];
    const relevantNewWords = module.newWords || activeLesson.newWords || [];
    const wrappedWord = wrapWords(word, true, relevantNewWords);
    
    app.innerHTML = `
        <h1>${module.title}</h1>
        <div class="card">
            <p>${module.description}</p>
            <h2 class="large-tv">${wrappedWord}</h2>
            <div class="sorting-buttons">
                <button class="primary-btn sort-btn" onclick="checkSort('${word}', 'Animate', this)">Animate</button>
                <button class="primary-btn sort-btn" onclick="checkSort('${word}', 'Inanimate', this)">Inanimate</button>
            </div>
            <p id="feedback"></p>
        </div>
    `;
}

// Start a lesson when clicking on one
function startLesson(id) {
    activeLesson = allLessons.find(l => l.id === id);
    
    if (activeLesson) {
        seenWords.clear();
        currentModuleIndex = 0;
        currentSubStep = 0;
        renderLesson();
    } else {
        alert("Lesson not found!");
    }
}

// Sublessons within each lesson
function startSubLesson(lessonId, subIndex) {
    window.introFinished = false;
    activeLesson = allLessons.find(l => l.id === lessonId);
    currentSubLessonIndex = subIndex;
    activeLesson.currentSubModules = activeLesson.subLessons[subIndex].modules;

    // NEW: Clear shuffled lists so they re-randomize next time
    activeLesson.currentSubModules.forEach(mod => {
        if (mod.shuffledList) delete mod.shuffledList;
    });

    seenWords.clear();
    currentModuleIndex = 0;
    currentSubStep = 0;
    renderLesson();
}

// Writes the HTML code to render the lesson
function renderLesson() {
    if (!activeLesson) {
        renderHome();
        return;
    }

    // RESET STATE
    isCorrect = false; 

    const app = document.getElementById('app');

    // 1. INTRO CARD CHECK: Only show if it's the very first part of the whole lesson
    if (currentSubLessonIndex === 0 && currentModuleIndex === 0 && currentSubStep === 0 && !window.introFinished) {
        
        let vocabListHtml = "";
        
        // Grab the full lesson vocabulary list
        const displayWords = activeLesson.newWords || [];

        displayWords.forEach(tvaaliRoot => {
            // Look up English name and type from your dictionary objects
            const nounEntry = Object.entries(nouns).find(([en, obj]) => obj.root === tvaaliRoot);
            const verbEntry = Object.entries(verbs).find(([en, obj]) => obj.stem === tvaaliRoot);
            
            let english = "Unknown";
            let meta = "";
            
            if (nounEntry) {
                english = nounEntry[0];
                const animacy = nounEntry[1].class.toLowerCase();
                meta = `<span class="meta-tag tag-${animacy}">${animacy}</span>`;
            } else if (verbEntry) {
                english = verbEntry[0];
                meta = `<span class="meta-tag">verb</span>`;
            }

            vocabListHtml += `
                <div class="intro-vocab-item">
                    <div class="vocab-info">
                        <span class="en">${english}</span>
                        ${meta}
                    </div>
                    <span class="tv">${tvaaliRoot}</span>
                </div>
            `;
        }); // End of forEach

        app.innerHTML = `
            <div class="nav-container">
                <button class="dict-btn" onclick="renderHome()">⬅ Back</button>
                <button class="info-btn" onclick="showInfo(${activeLesson.id})">ⓘ</button>
            </div>
            <div class="card intro-card">
                <h1>Lesson ${activeLesson.id}: ${activeLesson.title}</h1>
                <p class="intro-description">${activeLesson.description}</p>
                
                <div class="vocab-preview-container">
                    <h4>Core Vocabulary</h4>
                    <div class="intro-vocab-list">
                        ${vocabListHtml}
                    </div>
                </div>

                <button class="primary-btn" onclick="window.startFirstModule()">Start Lesson ➔</button>
            </div>
        `;
        return;
    }

    const module = activeLesson.currentSubModules[currentModuleIndex];
    if (!module) {
        showEndScreen();
        return;
    }

    // 2. MODULE ROUTER
    switch (module.type) {
        case "infoCard":
            renderInfoCard(module);
            break;
        case "vocabDrill":
            renderVocabDrill(module);
            break;
        case "sorting":
            renderSortingModule(module);
            break;
        case "classification":
            renderClassificationModule(module);
            break;
        case "translation":
            renderTranslationModule(module);
            break;
        case "multipleChoice":
            renderMultipleChoice(module);
            break;
        default:
            console.error("Unknown module type:", module.type);
    }
    
    // 3. INJECT NAV
    const navDiv = document.createElement('div');
    navDiv.className = "nav-container";
    navDiv.innerHTML = `
        <button class="dict-btn" onclick="renderHome()">⬅ Back</button>
        <button class="info-btn" onclick="showInfo(${activeLesson.id})">ⓘ</button>
    `;
    app.prepend(navDiv);
}

// Helper to clear the intro and start the lesson
window.startFirstModule = function() {
    window.introFinished = true; // Flag to prevent looping back to intro
    renderLesson();
};

// --- CREATE INFO CARD ---
function renderInfoCard(module) {
    const app = document.getElementById('app');
    
    // Set this so the global Enter key listener knows to proceed
    isCorrect = true;

    app.innerHTML = `
        <div class="card info-module-card">
            <h2>${module.title}</h2>
            <div class="info-content">${module.content}</div>
            ${module.note ? `<div class="flavour-note">${module.note}</div>` : ''}
            <button id="next-btn" class="primary-btn" onclick="handleModuleProgress(activeLesson.currentSubModules[currentModuleIndex])">Continue ➔</button>
        </div>
    `;
}

// --- VOCAB DRILL MODULE ---
function renderVocabDrill(module) {
    const app = document.getElementById('app');
    
    if (currentSubStep === 0 && !module.shuffled) {
        module.questions = shuffleArray(module.questions);
        module.shuffled = true;
    }

    const q = module.questions[currentSubStep];
    
    const direction = q.type || "tv_to_en";
    const isEnToTv = direction === "en_to_tv";
    const relevantNewWords = module.newWords || activeLesson.newWords || [];
    const promptText = isEnToTv ? q.en : q.tv;
    const expectedAnswer = isEnToTv ? q.tv : q.en;
    
    // Wrap words 
    const displayPrompt = wrapWords(promptText, !isEnToTv, relevantNewWords);

    app.innerHTML = `
        <h1>${module.title}</h1>
        <div class="card">
            <p>${isEnToTv ? "Translate to Tvaali:" : "Translate to English:"}</p>
            <h2 class="large-tv">${displayPrompt}</h2>
            <input type="text" id="user-input" autocomplete="off" 
                   placeholder="${isEnToTv ? "Type in Tvaali..." : "Type in English..."}">
            <button id="submit-btn">Check</button>
            <p id="feedback"></p>
        </div>
    `;

    document.getElementById('submit-btn').onclick = () => {
    const input = document.getElementById('user-input').value.trim().toLowerCase();
    const answers = Array.isArray(expectedAnswer) ? expectedAnswer : [expectedAnswer];
    const answersLower = answers.map(a => a.toLowerCase());

    if (answersLower.includes(input)) {
        isCorrect = true;
        
        // Find other solutions the user didn't type
        const others = answers.filter(a => a.toLowerCase() !== input);
        let feedbackText = "That is correct!";
        if (others.length > 0) {
            feedbackText += ` (Another correct solution: "${others.join(", ")}")`;
        }

        const feedback = document.getElementById('feedback');
        feedback.innerText = feedbackText;
        feedback.style.color = "green";

        // Create hidden next-btn for global Enter key
        if(!document.getElementById('next-btn')){
            const btn = document.createElement('button');
            btn.id = "next-btn";
            btn.style.display = "none";
            app.appendChild(btn);
        }
        
        // Use a slightly longer timeout if showing extra info so they can read it
        setTimeout(() => {
            handleModuleProgress(module);
        }, others.length > 0 ? 1500 : 800);

    } else {
        const primaryAns = Array.isArray(expectedAnswer) ? expectedAnswer[0] : expectedAnswer;
        document.getElementById('feedback').innerText = 
            isEnToTv ? `Not quite! The Tvaali word is "${primaryAns}"` 
                     : `Not quite! It means "${primaryAns}"`;
        document.getElementById('feedback').style.color = "red";
    }
};
}

// --- NOUN SORTING MODULE ---
function renderSortingModule(module) {
    const app = document.getElementById('app');
    
    // Standardize to shuffledList to match handleModuleProgress
    if (!module.shuffledList) {
        module.shuffledList = shuffleArray([...module.groups.Animate, ...module.groups.Inanimate]);
    }

    const word = module.shuffledList[currentSubStep];
    
    // Ensure we handle the sublesson newWords logic
    const relevantNewWords = module.newWords || activeLesson.newWords || [];
    const wrappedWord = wrapWords(word, true, relevantNewWords);
    
    app.innerHTML = `
        <h1>${module.title}</h1>
        <div class="card">
            <p>${module.description}</p>
            <h2 class="large-tv">${wrappedWord}</h2>
            <div class="sorting-buttons">
                <button class="primary-btn sort-btn" onclick="checkSort('${word}', 'Animate', this)">Animate</button>
                <button class="primary-btn sort-btn" onclick="checkSort('${word}', 'Inanimate', this)">Inanimate</button>
            </div>
            <p id="feedback"></p>
        </div>
    `;
}

window.checkSort = function(word, choice, clickedButton) {
    const module = activeLesson.currentSubModules[currentModuleIndex];
    const feedback = document.getElementById('feedback');
    
    if (!module || !module.groups) {
        console.error("Module or groups not found!");
        return;
    }

    const isCorrectChoice = module.groups[choice].includes(word);
    
    if (isCorrectChoice) {
        showSuccessAndContinue(module);
    } else {
        feedback.innerText = "In Tvaali logic, that belongs elsewhere!";
        feedback.style.color = "red";
        if (clickedButton) {
            clickedButton.style.backgroundColor = "#ffcccc";
            setTimeout(() => clickedButton.style.backgroundColor = "", 500);
        }
    }
};

// --- VERB CLASSIFICATION MODULE ---
function renderClassificationModule(module) {
    const app = document.getElementById('app');

    if (currentSubStep === 0 && !module.shuffled) {
        module.words = shuffleArray(module.words);
        module.shuffled = true;
    }

    const item = module.words[currentSubStep];
    const relevantNewWords = module.newWords || activeLesson.newWords || [];
    const wrappedWord = wrapWords(item.word, true, relevantNewWords);
    
    app.innerHTML = `
        <h1>${module.title}</h1>
        <div class="card">
            <p>${module.description}</p>
            <h2 class="large-tv">${wrappedWord}</h2>
            <p><em>${item.hint || ""}</em></p>
            <div class="sorting-buttons">
                <button class="primary-btn" onclick="checkClassify(true, this)">Transitive</button>
                <button class="primary-btn" onclick="checkClassify(false, this)">Intransitive</button>
            </div>
            <p id="feedback"></p>
        </div>
    `;
}

window.checkClassify = (userChoice, clickedButton) => {
    const module = activeLesson.currentSubModules[currentModuleIndex];
    const item = module.words[currentSubStep];
    const feedback = document.getElementById('feedback');
    
    if (userChoice === item.type) {
        showSuccessAndContinue(module);
    } else {
        feedback.innerText = "Not quite!";
        feedback.style.color = "red";
        if (clickedButton) {
            clickedButton.style.backgroundColor = "#ffcccc";
            setTimeout(() => clickedButton.style.backgroundColor = "", 500);
        }
    }
};

// --- TRANSLATION MODULE ---
function renderTranslationModule(module) {
    if (currentSubStep === 0 && !module.shuffled) {
        const source = (module.useGlobalQuestions ? activeLesson.questions : module.questions) || [];
        module.activeQuestions = shuffleArray(source);
        activeQuestions = module.activeQuestions;
        module.shuffled = true;
    }
    
    const q = module.activeQuestions[currentSubStep];
    const isTvaaliPrompt = q.type === "tv_to_en";
    const label = isTvaaliPrompt ? "Translate to English:" : "Translate to Tvaali:";
    const rawPromptText = isTvaaliPrompt ? q.tvaali : q.english;
    const relevantNewWords = module.newWords || activeLesson.newWords || [];
    const wrappedPrompt = wrapWords(rawPromptText, isTvaaliPrompt, relevantNewWords);

    document.getElementById('app').innerHTML = `
        <h1>${module.title}</h1>
        <div class="card">
            <p><strong>${label}</strong></p>
            <h2>${wrappedPrompt}</h2>
            <input type="text" id="user-input" autocomplete="off" placeholder="Type here...">
            <button id="submit-btn">Check Answer</button>
            <p id="feedback"></p>
            <button id="next-btn" style="display:none;">Next Question ➔</button>
        </div>
    `;

    document.getElementById('submit-btn').onclick = () => checkAnswer(module.activeQuestions);
    document.getElementById('next-btn').onclick = () => handleModuleProgress(module);
}

// --- MULTIPLE CHOICE MODULE ---
function renderMultipleChoice(module) {
    const app = document.getElementById('app');
    
    if (currentSubStep === 0 && !module.shuffled) {
        module.activeQuestions = shuffleArray([...module.questions]);
        module.shuffled = true;
    }

    const q = module.activeQuestions[currentSubStep];
    const isEnToTv = q.type === "en_to_tv";
    const prompt = isEnToTv ? (q.en || q.english) : (q.tv || q.tvaali);
    const correctAns = isEnToTv ? (q.tv || q.tvaali) : (q.en || q.english);

    let finalChoices = [];

    // Check if you provided manual distractors in the lesson file
    if (q.distractors && q.distractors.length > 0) {
        finalChoices = shuffleArray([correctAns, ...q.distractors]);
    } else {
        // Fallback to random distractors
        const allTvaaliRoots = Object.values(nouns).map(n => n.root).concat(Object.values(verbs).map(v => v.stem));
        const allEnglishTerms = Object.keys(nouns).concat(Object.keys(verbs));
        const pool = isEnToTv ? allTvaaliRoots : allEnglishTerms;
        
        let randomDistractors = pool
            .filter(item => item && item.toLowerCase() !== correctAns.toLowerCase())
            .sort(() => 0.5 - Math.random())
            .slice(0, 2);
            
        finalChoices = shuffleArray([correctAns, ...randomDistractors]);
    }

    const relevantNewWords = module.newWords || activeLesson.newWords || [];
    const wrappedPrompt = wrapWords(prompt, !isEnToTv, relevantNewWords);

    app.innerHTML = `
        <h1>${module.title}</h1>
        <div class="card">
            <p>${isEnToTv ? "Select the Tvaali translation:" : "Select the English translation:"}</p>
            <h2 class="large-tv">${wrappedPrompt}</h2>
            
            <div class="mcq-container">
                ${finalChoices.map(choice => `
                    <button class="primary-btn mcq-btn" 
                            onclick="checkMCQ('${choice.replace(/'/g, "\\'")}', '${correctAns.replace(/'/g, "\\'")}', this)">
                        ${choice}
                    </button>
                `).join('')}
            </div>
            <p id="feedback"></p>
        </div>
    `;
}

window.checkMCQ = function(choice, correct, btn) {
    const module = activeLesson.currentSubModules[currentModuleIndex];
    const feedback = document.getElementById('feedback');
    
    if (choice.toLowerCase() === correct.toLowerCase()) {
        btn.style.backgroundColor = "#4CAF50"; // Green success
        showSuccessAndContinue(module);
    } else {
        btn.style.backgroundColor = "#f44336"; // Red error
        feedback.innerText = "Not quite! Try another one.";
        feedback.style.color = "red";
        setTimeout(() => btn.style.backgroundColor = "", 1000);
    }
};

// Module progress
window.handleModuleProgress = function(module) {
    isCorrect = false;

    let totalSteps = 0;
    if (module.questions) {
        totalSteps = module.questions.length;
    } else if (module.shuffledList) { // Match the property used in sorting
        totalSteps = module.shuffledList.length;
    } else if (module.groups) {
        totalSteps = [...module.groups.Animate, ...module.groups.Inanimate].length;
    } else if (module.words) {
        totalSteps = module.words.length;       
    } else if (module.activeQuestions) { // Add this check
        totalSteps = module.activeQuestions.length;
    } else {
        totalSteps = 1; 
    }
    
    markWordsAsSeen(); 
    currentSubStep++;  

    if (currentSubStep < totalSteps) {
        renderLesson(); 
    } else {
        currentModuleIndex++;
        currentSubStep = 0;
        renderLesson();
    }
};

// Mark words as seen
function markWordsAsSeen() {
    if (!activeLesson || !activeLesson.currentSubModules) return;
    
    const module = activeLesson.currentSubModules[currentModuleIndex];
    if (!module) return;

    let textToClean = "";

    // If it's a sorting module, we mark the specific word currently being shown
    if (module.type === "sorting" && module.shuffledList) {
        textToClean = module.shuffledList[currentSubStep];
    } 
    // Otherwise, use your existing translation/drill logic
    else {
        const questionList = module.useGlobalQuestions ? activeLesson.questions : module.questions;
        if (module.type === "translation" && questionList) {
            const q = questionList[currentSubStep];
            if (q) {
                textToClean = (q.type === "tv_to_en") ? q.tvaali : (Array.isArray(q.english) ? q.english[0] : q.english);
            }
        } else if (module.type === "vocab_drill" && module.questions) {
            const q = module.questions[currentSubStep];
            if (q) textToClean = q.tv;
        }
    }

    if (textToClean) {
        const words = String(textToClean).split(" ");
        words.forEach(word => {
            const clean = word.toLowerCase().replace(/[.,!?;]/g, "");
            seenWords.add(clean);
        });
    }
}


// Check answer function
function checkAnswer(questionsToUse) {
    const userInput = document.getElementById('user-input').value.trim().toLowerCase();
    const feedback = document.getElementById('feedback');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    // Safety check: Use passed-in list or global fallback
    const source = questionsToUse || activeQuestions;
    const q = source[currentSubStep]; 

    if (!q) {
        console.error("No question found at step", currentSubStep);
        return;
    }

    const correctAnswer = q.type === "en_to_tv" ? q.tvaali : q.english;
    
    // Convert everything to an array for easy checking
    const answers = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];
    const answersLower = answers.map(a => a.toLowerCase());

    if (answersLower.includes(userInput)) {
        // SUCCESS LOGIC
        isCorrect = true; 
        
        // Find other correct answers the user didn't type
        const others = answers.filter(a => a.toLowerCase() !== userInput);
        let successMsg = "Correct!";
        
        if (others.length > 0) {
            successMsg += ` (Another solution: "${others[0]}")`;
        }

        feedback.innerText = successMsg;
        feedback.style.color = "green";
        
        if (nextBtn) nextBtn.style.display = "block";
        if (submitBtn) submitBtn.style.display = "none";
    } else {
        // FAILURE LOGIC
        const displayAnswer = answers[0];
        feedback.innerText = `Incorrect. A correct answer would be: ${displayAnswer}`;
        feedback.style.color = "red";
    }
}

// Correct message 
function showSuccessAndContinue(module) {
    const feedback = document.getElementById('feedback');
    feedback.innerText = "That is correct!";
    feedback.style.color = "green";
    
    isCorrect = true; // IMPORTANT: Allow the Enter key to work now

    // Ensure a next-btn exists for the global listener to "see"
    if (!document.getElementById('next-btn')) {
        const hiddenBtn = document.createElement('button');
        hiddenBtn.id = "next-btn";
        hiddenBtn.style.display = "none";
        document.querySelector('.card').appendChild(hiddenBtn);
    }

    const buttons = document.querySelectorAll('.card button');
    buttons.forEach(btn => btn.disabled = true);

    setTimeout(() => {
        handleModuleProgress(module);
    }, 800);
}

function markCurrentSubLessonComplete() {
    // We need to know which sub-lesson index we are on. 
    // Let's assume we store it in a global called currentSubLessonIndex
    const key = `${activeLesson.id}-${currentSubLessonIndex}`;
    if (!completedSubLessons.includes(key)) {
        completedSubLessons.push(key);
        localStorage.setItem('tvaali_progress', JSON.stringify(completedSubLessons));
    }
}

// Endscreen maker
function showEndScreen() {
    markCurrentSubLessonComplete(); // Save progress!

    document.getElementById('app').innerHTML = `
        <div class="card">
            <h1>Part Complete!</h1>
            <p>You've finished this section of Tvaali Basics.</p>
            <button onclick="renderHome()">Back to Map</button>
        </div>
    `;
}

// Global enter check
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        
        // 1. If we are on a screen where the answer is already correct (or it's an infoCard)
        if (isCorrect && nextBtn && nextBtn.style.display !== "none") {
            const currentModule = activeLesson.currentSubModules[currentModuleIndex];
            handleModuleProgress(currentModule);
        } 
        // 2. If we are on a question screen and haven't submitted yet
        else if (submitBtn && submitBtn.style.display !== "none") {
            submitBtn.click();
        }
    }
});

renderHome();