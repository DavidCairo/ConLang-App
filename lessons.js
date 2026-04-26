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
        window.renderHome();
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
        <button class="dict-btn" onclick="window.renderHome()">⬅ Back</button>
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
                const d = match.details;
                const grammarStr = d ? ` (${d.case} ${d.number})` : "";
                const className = match.data.class ? match.data.class.charAt(0).toUpperCase() + match.data.class.slice(1) : "";
                
                info = `En: ${match.en} | ${className}${grammarStr}`;
            } 
            else if (match.type === 'verb') {
                const d = match.details;
                const detailStr = d ? ` (${d.person} ${d.number} ${d.tense})` : "";
                const englishName = match.en || (match.data && match.data.en) || "Unknown";
                info = `Verb: ${englishName}${detailStr}`;
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
            <button onclick="window.renderHome()">Back to Map</button>
        </div>
    `;
}

// Allow for shuffling of arrays
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/* ==========================================================================
   GLOBAL EXPOSURE FOR UI EVENTS (lessons.js)
   ========================================================================== */

/**
 * 1. Lesson Navigation & Entry
 */
window.startLesson = startLesson;
window.startSubLesson = startSubLesson;
window.renderLesson = renderLesson;
window.renderHome = window.renderHome; // Assuming renderHome is defined in main.js, this ensures availability

/**
 * 2. Module Interactions (Checking Answers)
 */
window.checkAnswer = checkAnswer;
window.handleModuleProgress = window.handleModuleProgress;
window.checkSort = window.checkSort; // Already defined as window. in your code, but good to track
window.checkClassify = window.checkClassify; // Already defined as window.
window.checkMCQ = window.checkMCQ; // Already defined as window.

/**
 * 3. Info Modals & Vocabulary
 */
window.showInfo = window.showInfo; // Already defined as window.
window.closeModal = window.closeModal; // Already defined as window.

/**
 * 4. Helper & Initialization Functions
 */
window.startFirstModule = window.startFirstModule; // Already defined as window.
window.showEndScreen = showEndScreen;

/**
 * 5. Word Tooltip Logic (Used by wrapWords)
 */
window.wrapWords = wrapWords;