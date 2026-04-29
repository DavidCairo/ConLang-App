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

function getVocabMetadata(tvaaliRoot) {
    // Find the word in the lexicon by its Tvaali stem/root
    const wordObj = lexicon.find(w => w.tv === tvaaliRoot);
    if (!wordObj) return { english: "Unknown", meta: "" };

    const entry = wordObj.entries[0];
    const english = entry.senses[0].en[0]; // Get the first English synonym
    let meta = "";

    if (entry.type === 'noun') {
        const animacy = entry.class.toLowerCase();
        meta = `<span class="meta-tag tag-${animacy}">${animacy}</span>`;
    } else if (entry.type === 'verb') {
        meta = `<span class="meta-tag tag-verb">verb</span>`;
    }
    
    return { english, meta };
}

// Writes the HTML code to render the lesson
function renderLesson() {
    if (!activeLesson) {
        window.renderHome();
        return;
    }

    isCorrect = false; 
    const app = document.getElementById('app');

    // 1. INTRO CARD CHECK
    if (currentSubLessonIndex === 0 && currentModuleIndex === 0 && currentSubStep === 0 && !window.introFinished) {
        
        let vocabListHtml = "";
        const displayWords = activeLesson.newWords || [];

        displayWords.forEach(tvaaliRoot => {
            // UPDATED: Use the new lexicon helper
            const { english, meta } = getVocabMetadata(tvaaliRoot);

            vocabListHtml += `
                <div class="intro-vocab-item">
                    <div class="vocab-info">
                        <span class="en">${english}</span>
                        ${meta}
                    </div>
                    <span class="tv">${tvaaliRoot}</span>
                </div>
            `;
        });

        app.innerHTML = `
            <div class="nav-container">
                <button class="primary-btn" onclick="renderHome()">⬅ Back</button>
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
        <button class="primary-btn" onclick="window.renderHome()">⬅ Back</button>
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
        
        const feedback = document.getElementById('feedback');
        feedback.innerText = isEnToTv 
            ? `Not quite! The Tvaali word is "${primaryAns}"` 
            : `Not quite! It means "${primaryAns}"`;
        feedback.style.color = "red";
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
    
    if (!module || !module.groups) return;

    // Standardize comparison to avoid case or whitespace issues
    const isCorrectChoice = module.groups[choice].some(w => w.toLowerCase() === word.toLowerCase());
    
    if (isCorrectChoice) {
        showSuccessAndContinue(module);
    } else {
        feedback.innerText = "In Tvaali logic, that belongs elsewhere!";
        feedback.style.color = "red";
        // Visual shake/color feedback
        if (clickedButton) {
            clickedButton.classList.add('error-shake'); // Add a CSS shake if you have one
            clickedButton.style.backgroundColor = "#ffcccc";
            setTimeout(() => {
                clickedButton.style.backgroundColor = "";
                clickedButton.classList.remove('error-shake');
            }, 500);
        }
    }
};

// --- VERB CLASSIFICATION MODULE ---
function renderClassificationModule(module) {
    const app = document.getElementById('app');

    if (currentSubStep === 0 && !module.shuffled) {
        // If the lesson provides full word objects, great. 
        // If it provides strings, we find the word in the lexicon.
        module.activeWords = module.words.map(item => {
            const wordObj = lexicon.find(w => w.tv === item.word || w.tv === item);
            return {
                tv: wordObj ? wordObj.tv : item.word,
                // Use lexicon value if type isn't explicitly defined in the lesson
                isTransitive: item.type !== undefined ? item.type : (wordObj?.entries[0].transitive ?? true)
            };
        });
        module.activeWords = shuffleArray(module.activeWords);
        module.shuffled = true;
    }

    const item = module.activeWords[currentSubStep];
    const relevantNewWords = module.newWords || activeLesson.newWords || [];
    const wrappedWord = wrapWords(item.tv, true, relevantNewWords);
    
    app.innerHTML = `
        <h1>${module.title}</h1>
        <div class="card">
            <p>${module.description}</p>
            <h2 class="large-tv">${wrappedWord}</h2>
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
        feedback.innerText = item.isTransitive ? "This verb needs an object!" : "This verb stands alone!";
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
    
    // Support synonyms: if en is an array, show the first one as the prompt
    const prompt = isEnToTv 
        ? (Array.isArray(q.en || q.english) ? (q.en || q.english)[0] : (q.en || q.english))
        : (q.tv || q.tvaali);
        
    const correctAns = isEnToTv ? (q.tv || q.tvaali) : (q.en || q.english);

    let finalChoices = [];

    if (q.distractors && q.distractors.length > 0) {
        finalChoices = shuffleArray([correctAns, ...q.distractors]);
    } else {
        // UPDATED: Pull from Lexicon instead of old objects
        const pool = isEnToTv 
            ? lexicon.map(w => w.tv) 
            : lexicon.map(w => w.entries[0].senses[0].en[0]);
        
        let randomDistractors = pool
            .filter(item => item && item.toLowerCase() !== (Array.isArray(correctAns) ? correctAns[0] : correctAns).toLowerCase())
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
    
    // Handle both string and array for 'correct'
    const correctList = Array.isArray(correct) ? correct : [correct];
    const isRight = correctList.some(c => c.toLowerCase() === choice.toLowerCase());
    
    if (isRight) {
        btn.style.backgroundColor = "#4CAF50";
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
            // Find the word in the new lexicon
            const wordObj = lexicon.find(w => w.tv === tvaaliRoot);
            
            let english = "Unknown";
            let meta = "";

            if (wordObj) {
                const entry = wordObj.entries[0];
                // Get the first synonym
                english = entry.senses[0].en[0];
                
                if (entry.type === 'noun') {
                    const animacy = entry.class.toLowerCase();
                    meta = `<span class="meta-tag tag-${animacy}">${entry.class}</span>`;
                } else if (entry.type === 'verb') {
                    meta = `<span class="meta-tag tag-verb">verb</span>`;
                }
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
    
    // 1. Ensure we have a string and split it
    const sentenceStr = Array.isArray(sentence) ? sentence[0] : sentence;
    const words = sentenceStr.split(" ");
    
    // 2. Get the morphology map once, rather than re-generating inside the loop
    // We assume you have a global variable 'morphologyMap' or call the function here
    const lookupMap = isTvaali ? (window.tvaaliLookup || generateMorphologyMap()) : null;
    
    return words.map(word => {
        const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, "");
        
        // Skip common English particles if we are in English mode
        if (!isTvaali && ["the", "is", "a", "an", "and"].includes(cleanWord)) return word;

        let info = "";

        if (isTvaali) {
            // FIX: Access the pre-calculated lookup map
            const match = lookupMap[cleanWord]; 
            
            if (match) {
                const d = match.details;
                if (match.type === 'noun') {
                    // Pull class from the data entry
                    const className = match.data.entries[0].class || "animate";
                    const grammarStr = d ? ` (${d.case} ${d.number})` : "";
                    info = `En: ${match.en} | ${className}${grammarStr}`;
                } 
                else if (match.type === 'verb') {
                    // Extract verb details
                    const detailStr = d ? ` (${d.person} ${d.number} ${d.tense})` : "";
                    info = `Verb: ${match.en}${detailStr}`;
                }
            }
        } else {
            // English lookup
            const wordObj = findByEn(cleanWord);
            if (wordObj) {
                const type = wordObj.entries[0].type;
                info = `Tv: ${wordObj.tv} (${type})`;
            }
        }

        if (info) {
            const isNew = (newWordsList || []).some(nw => cleanWord === nw.toLowerCase());
            const highlightClass = isNew ? "new-word-highlight" : "";
            return `<span class="word-tooltip ${highlightClass}">${word}<span class="tooltip-text">${info}</span></span>`;
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

    if (module.type === "sorting" && module.shuffledList) {
        textToClean = module.shuffledList[currentSubStep];
    } 
    else {
        // Use activeQuestions if it exists (from shuffling), otherwise fallback
        const questionList = module.activeQuestions || module.questions || [];
        const q = questionList[currentSubStep];
        
        if (q) {
            if (module.type === "translation") {
                // Grab the prompt text regardless of direction
                textToClean = (q.type === "tv_to_en") ? q.tvaali : q.english;
            } else if (module.type === "vocabDrill") {
                textToClean = q.tv;
            }
        }
    }

    if (textToClean) {
        // Handle cases where textToClean might be an array (English synonyms)
        const items = Array.isArray(textToClean) ? textToClean : [textToClean];
        
        items.forEach(item => {
            const words = String(item).split(/\s+/); // Split by any whitespace
            words.forEach(word => {
                const clean = word.toLowerCase().replace(/[.,!?;:]/g, "");
                if (clean) seenWords.add(clean);
            });
        });
    }
}

// Check answer function
window.checkAnswer = function(questionsToUse) {
    const userInput = document.getElementById('user-input').value.trim().toLowerCase();
    const feedback = document.getElementById('feedback');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    const source = questionsToUse || activeQuestions;
    const q = source[currentSubStep]; 

    if (!q) return;

    // Use q.english or q.en (to match different module formats)
    const correctAnswer = q.type === "en_to_tv" ? (q.tvaali || q.tv) : (q.english || q.en);
    
    // Ensure we are working with a flat array of strings
    const answers = Array.isArray(correctAnswer) ? correctAnswer.flat() : [correctAnswer];
    const answersLower = answers.map(a => String(a).toLowerCase());

    if (answersLower.includes(userInput)) {
        isCorrect = true; 
        
        // Improve feedback: if there are multiple synonyms, show the NEXT one as a suggestion
        const others = answers.filter(a => String(a).toLowerCase() !== userInput);
        let successMsg = "Correct!";
        
        if (others.length > 0) {
            successMsg += ` (Also: "${others[0]}")`; // Show one alternative clearly
        }

        feedback.innerText = successMsg;
        feedback.style.color = "green";
        
        if (nextBtn) nextBtn.style.display = "block";
        if (submitBtn) submitBtn.style.display = "none";
    } else {
        // Show the primary answer (first in array)
        const primaryAns = Array.isArray(answers) ? answers[0] : answers;
        feedback.innerText = `Incorrect. A correct answer would be: ${primaryAns}`;
        feedback.style.color = "red";
    }
};

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

