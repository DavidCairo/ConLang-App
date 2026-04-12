// Current possible quizes 
const quizData = [
    ...lesson1Data.questions
];
const allLessons = [lesson1Data]

// 
let activeLesson = null;
let activeQuestions = [];
let currentModuleIndex = 0; // Track which module we are in
let currentSubStep = 0;      // Track progress within a module (like vocab or sorting)
let seenWords = new Set();
let isCorrect = false;
let completedSubLessons = JSON.parse(localStorage.getItem('tvaali_progress')) || [];
let currentSubLessonIndex = 0; // Add this near 'currentModuleIndex'

// Make homepage
function renderHome() {
    const app = document.getElementById('app');
    activeLesson = null;
    
    app.innerHTML = `
        <div class="nav-container">
            <button class="dict-btn" onclick="renderDictionary()">📖 Dictionary</button>
        </div>
        <h1>Tvaali Lessons</h1>
        <div id="lesson-list"></div>
    `;
    
    const list = document.getElementById('lesson-list');

    allLessons.forEach(lesson => {
        const div = document.createElement('div');
        div.className = 'lesson-card';
        div.style.position = 'relative'; // Allows absolute positioning of the info button
        
        const subLessons = lesson.subLessons || [];
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

        div.innerHTML = `
            <button class="info-btn-home" onclick="showInfo(${lesson.id})" title="Lesson Info">ⓘ</button>
            
            <h3>Lesson ${lesson.id}: ${lesson.title}</h3>
            <div class="lesson-progress-container">
                <div class="progress-bar-line">
                    ${progressSegments}
                </div>
            </div>
            <p class="progress-text">${completedSubLessons.length} / ${subLessons.length} Parts Complete</p>
        `;
        list.appendChild(div);
    });
}

// Make the dictionary at the homepage
function renderDictionary() {
    const app = document.getElementById('app');
    
    let html = `
        <div class="nav-container">
            <button class="dict-btn" onclick="renderHome()">⬅ Back to Lessons</button>
        </div>
        <h1>Tvaali Dictionary</h1>

        <div class="card sandbox-card">
            <h3>Grammar Tester</h3>
            <div class="sandbox-controls">
                <select id="test-type" onchange="toggleSandboxFields()">
                    <option value="noun">Noun Caser</option>
                    <option value="verb">Verb Conjugator</option>
                </select>

                <input type="text" id="test-input" oninput="updateNumberOptions()" placeholder="Type a noun (e.g., woman, stone)">
                
                <div id="noun-fields">
                    <select id="test-case">
                        <option value="NOM">Nominative</option>
                        <option value="ACC">Accusative</option>
                        <option value="ERG">Ergative</option>
                    </select>
                    <select id="test-number"></select>
                </div>

                <div id="verb-fields" style="display:none;">
                    <select id="test-person">
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

                    <select id="test-aspect" onchange="filterTenses()">
                        <option value="perfective">Perfective</option>
                        <option value="continuous">Continuous</option>
                        <option value="habitual">Habitual</option>
                    </select>

                    <select id="test-tense"></select>
                </div>

                <button onclick="runSandboxTest()">Generate Form</button>
            </div>
            <h2 id="sandbox-result" style="color: #2c3e50; margin-top: 15px;">---</h2>
        </div>

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
                <thead><tr><th>English</th><th>Stem</th><th>Transitive</th></tr></thead>
                <tbody>
                    ${Object.entries(verbs).map(([en, data]) => `
                        <tr><td>${en}</td><td>${data.stem}</td><td>${data.trans ? "Yes" : "No"}</td></tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    app.innerHTML = html;
    
    // Ensure all dynamic fields are set correctly on load
    toggleSandboxFields(); 
    updateNumberOptions();
    filterTenses();
}

// Function to show the info popup
window.showInfo = function(lessonId) {
    const lesson = allLessons.find(l => l.id === lessonId);
    if (!lesson) return;

    // These must match the IDs in your index.html exactly!
    const modal = document.getElementById('infoModal');
    const content = document.getElementById('modalContent'); 

    if (!modal || !content) {
        console.error("Modal elements not found in the DOM!");
        return;
    }

    // Generate the table rows for vocabulary
    // This assumes your lesson.newWords list is [English, Tvaali, English, Tvaali...]
    let vocabRows = "";
    for (let i = 0; i < lesson.newWords.length; i += 2) {
        const english = lesson.newWords[i];
        const tvaali = lesson.newWords[i + 1] || "";
        vocabRows += `
            <tr>
                <td><strong>${english}</strong></td>
                <td class="tvaali-text">${tvaali}</td>
            </tr>
        `;
    }

    content.innerHTML = `
        <span class="close-modal" onclick="closeModal()">&times;</span>
        <h2>${lesson.title}</h2>
        <p>${lesson.description}</p>
        
        <div class="modal-vocab-section">
            <h3>New Vocabulary</h3>
            <table class="dict-table">
                <thead>
                    <tr>
                        <th>English</th>
                        <th>Tvaali</th>
                    </tr>
                </thead>
                <tbody>
                    ${vocabRows}
                </tbody>
            </table>
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
    const text = Array.isArray(sentence) ? sentence[0] : sentence;
    const words = text.split(" ");
    
    return words.map(word => {
        const cleanWord = word.toLowerCase().replace(/[.,!?;]/g, "");
        const particles = ["the", "a", "an", "is", "are"];
        if (particles.includes(cleanWord)) return word;

        let info = "";

        // 1. TRANSLATION LOGIC
        if (isTvaali) {
            const nounMatch = Object.entries(nouns).find(([k, v]) => cleanWord.includes(v.root.toLowerCase()));
            const verbMatch = Object.entries(verbs).find(([k, v]) => cleanWord.includes(v.stem.toLowerCase()));
            if (nounMatch) info = `En: ${nounMatch[0]} | Class: ${nounMatch[1].class}`;
            else if (verbMatch) info = `En: ${verbMatch[0]} | Verb Stem`;
        } else {
            const nounKey = Object.keys(nouns).find(key => cleanWord === key || cleanWord.startsWith(key));
            const verbKey = Object.keys(verbs).find(key => cleanWord === key || cleanWord.startsWith(key) || key.startsWith(cleanWord));
            if (nounKey) info = `Tv: ${nouns[nounKey].root} | Class: ${nouns[nounKey].class}`;
            else if (verbKey) info = `Tv: ${verbs[verbKey].stem}`;
        }

        // 2. HIGHLIGHT LOGIC (Now with Fuzzy Matching)
        let highlightClass = "";
        
        // We check if the cleanWord matches OR starts with any of our new words
        const isNewInLesson = newWordsList.some(nw => {
            const cleanNW = nw.toLowerCase();
            return cleanWord === cleanNW || 
                   cleanWord.startsWith(cleanNW) || 
                   (isTvaali && cleanWord.includes(cleanNW));
        });

        if (isNewInLesson && !seenWords.has(cleanWord)) {
            highlightClass = "new-word-highlight";
        }

        if (info) {
            return `<span class="word-tooltip ${highlightClass}">${word}<span class="tooltip-text">${info}</span></span>`;
        }
        return word; 
    }).join(" ");
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
    window.introFinished = false; // Reset for new lesson
    activeLesson = allLessons.find(l => l.id === lessonId);
    currentSubLessonIndex = subIndex;
    activeLesson.currentSubModules = activeLesson.subLessons[subIndex].modules;
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

    const app = document.getElementById('app');

    // 1. INTRO CARD CHECK
    // Show this ONLY when we haven't started the first module yet
    if (currentModuleIndex === 0 && currentSubStep === 0 && !window.introFinished) {
        app.innerHTML = `
            <div class="nav-container">
                <button class="dict-btn" onclick="renderHome()">⬅ Back</button>
                <button class="info-btn" onclick="showInfo(${activeLesson.id})">ⓘ</button>
            </div>
            <div class="card intro-card">
                <h1>Lesson ${activeLesson.id}: ${activeLesson.title}</h1>
                <p>${activeLesson.description}</p>
                <div class="vocab-preview">
                    <h4>New Vocabulary:</h4>
                    <p>${activeLesson.newWords.join(", ")}</p>
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
    // These functions need to be updated to PREPEND the navHtml or use a layout helper
    switch (module.type) {
        case "vocab_drill":
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
        default:
            console.error("Unknown module type:", module.type);
    }
    
    // 3. INJECT NAV AFTER MODULE RENDERS
    // Since module functions overwrite app.innerHTML, we add the nav back to the top
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

// --- VOCAB DRILL MODULE ---
function renderVocabDrill(module) {
    const app = document.getElementById('app');
    const q = module.questions[currentSubStep];
    const wrappedTv = wrapWords(q.tv, true, activeLesson.newWords);

    app.innerHTML = `
        <h1>${module.title}</h1>
        <div class="card">
            <p>Translate this new word:</p>
            <h2 class="large-tv">${wrappedTv}</h2>
            <input type="text" id="user-input" autocomplete="off" placeholder="English translation...">
            <button id="submit-btn">Check</button>
            <p id="feedback"></p>
        </div>
    `;

    document.getElementById('submit-btn').onclick = () => {
        const input = document.getElementById('user-input').value.trim().toLowerCase();
        if (input === q.en.toLowerCase()) {
            showSuccessAndContinue(module); // <--- Use the general function
        } else {
            document.getElementById('feedback').innerText = `Not quite! It means "${q.en}"`;
            document.getElementById('feedback').style.color = "red";
        }
    };
}

// --- NOUN SORTING MODULE ---
function renderSortingModule(module) {
    const app = document.getElementById('app');
    const allWords = [...module.groups.Animate, ...module.groups.Inanimate];
    const word = allWords[currentSubStep];
    const wrappedWord = wrapWords(word, true, activeLesson.newWords);
    
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
    const item = module.words[currentSubStep];
    const wrappedWord = wrapWords(item.word, true, activeLesson.newWords);
    
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
    if (module.useGlobalQuestions) {
        activeQuestions = activeLesson.questions;
    } else {
        activeQuestions = module.questions; 
    }
    
    // Safety check
    if (!activeQuestions || activeQuestions.length === 0) {
        console.error("No questions found! Check if useGlobalQuestions is set correctly.");
        document.getElementById('app').innerHTML = `<p style="color:red">Error: No questions found for this module.</p>`;
        return;
    }

    const q = activeQuestions[currentSubStep];
    
    const isTvaaliPrompt = q.type === "tv_to_en";
    const label = isTvaaliPrompt ? "Translate to English:" : "Translate to Tvaali:";
    const rawPromptText = isTvaaliPrompt ? q.tvaali : q.english;
    const wrappedPrompt = wrapWords(rawPromptText, isTvaaliPrompt, activeLesson.newWords);

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

    document.getElementById('submit-btn').onclick = checkAnswer;
    document.getElementById('next-btn').onclick = () => handleModuleProgress(module);
}

// Module progress
function handleModuleProgress(module) {
    let totalSteps = 0;
    
    if (module.useGlobalQuestions) {
        totalSteps = activeLesson.questions.length;
    } else if (module.questions) {
        totalSteps = module.questions.length;
    } else if (module.groups) {
        totalSteps = [...module.groups.Animate, ...module.groups.Inanimate].length;
    } else if (module.words) {
        totalSteps = module.words.length;
    }
    
    markWordsAsSeen(); // Mark the word we just finished
    currentSubStep++;  // Move to next question/word
    isCorrect = false; // Reset for next screen

    if (currentSubStep < totalSteps) {
        renderLesson(); 
    } else {
        currentModuleIndex++;
        currentSubStep = 0;
        
        // Safety check: is there actually another module?
        if (activeLesson.currentSubModules[currentModuleIndex]) {
            renderLesson();
        } else {
            showEndScreen(); // No more modules in this sub-lesson!
        }
    }
}

// Mark words as seen
function markWordsAsSeen() {
    // SAFETY: Ensure an active lesson and current module actually exist
    if (!activeLesson || !activeLesson.currentSubModules) return;
    
    const module = activeLesson.currentSubModules[currentModuleIndex];
    if (!module) return; // Exit if the module is undefined

    let textToClean = "";

    // Determine which questions to look at
    const questionList = module.useGlobalQuestions ? activeLesson.questions : module.questions;

    // Check module type and ensure the questionList exists
    if (module.type === "translation" && questionList) {
        // Ensure the current index actually exists in the list before reading [0]
        const q = questionList[currentSubStep];
        if (q) {
            textToClean = (q.type === "tv_to_en") ? q.tvaali : (Array.isArray(q.english) ? q.english[0] : q.english);
        }
    } else if (module.type === "vocab_drill" && module.questions) {
        const q = module.questions[currentSubStep];
        if (q) textToClean = q.tv;
    }

    if (textToClean) {
        // Use a fallback to empty string if textToClean is somehow undefined/null
        const words = String(textToClean).split(" ");
        words.forEach(word => {
            const clean = word.toLowerCase().replace(/[.,!?;]/g, "");
            seenWords.add(clean);
        });
    }
}


// Check answer function
function checkAnswer() {
    const userInput = document.getElementById('user-input').value.trim().toLowerCase();
    const feedback = document.getElementById('feedback');
    const nextBtn = document.getElementById('next-btn');
    
    // BUG FIX: Use currentSubStep instead of currentStep
    const q = activeQuestions[currentSubStep]; 

    const correctAnswer = q.type === "en_to_tv" ? q.tvaali : q.english;
    let isInputCorrect = false;

    if (Array.isArray(correctAnswer)) {
        isInputCorrect = correctAnswer.some(ans => ans.toLowerCase() === userInput);
    } else {
        isInputCorrect = userInput === correctAnswer.toLowerCase();
    }

    if (isInputCorrect) {
        feedback.innerText = "Correct!";
        feedback.style.color = "green";
        isCorrect = true; // This triggers the Enter key logic
        nextBtn.style.display = "block";
        document.getElementById('submit-btn').style.display = "none";
    } else {
        const displayAnswer = Array.isArray(correctAnswer) ? correctAnswer[0] : correctAnswer;
        feedback.innerText = `Incorrect. A correct answer would be: ${displayAnswer}`;
        feedback.style.color = "red";
    }
}

// Correct message 
function showSuccessAndContinue(module) {
    const feedback = document.getElementById('feedback');
    feedback.innerText = "That is correct!";
    feedback.style.color = "green";

    // Disable all buttons in the card to prevent double-tapping
    const buttons = document.querySelectorAll('.card button');
    buttons.forEach(btn => btn.disabled = true);

    // Wait 800ms, then move on
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
        const homeBtn = document.getElementById('home-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        
        if (homeBtn) {
            homeBtn.click();
        } 
        else if (isCorrect && nextBtn && nextBtn.style.display !== "none") {
            const currentSubModules = activeLesson.currentSubModules;
            if (currentSubModules && currentSubModules[currentModuleIndex]) {
                handleModuleProgress(currentSubModules[currentModuleIndex]);
            } else {
                // If something is wrong with the index, just go home to reset
                renderHome();
            }
        } 
        else if (submitBtn && submitBtn.style.display !== "none") {
            submitBtn.click();
        }
    }
});

renderHome();