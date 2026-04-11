// Current possible quizes 
const quizData = [
    ...lesson1Data.questions
];
const allLessons = [lesson1Data]

let activeQuestions = []; // This will hold the questions for the current session
let currentStep = 0; // Makes sure the question is en -> tv and tv -> en
let isCorrect = false; // Track if current question is solved

// Functions

// Make homepage
// Add to your main.js

function renderHome() {
    const app = document.getElementById('app');
    
    // Add a navigation bar at the top or side
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
        div.style.position = 'relative';
        div.innerHTML = `
            <h3>Lesson ${lesson.id}: ${lesson.title}</h3>
            <div class="info-icon" onclick="showInfo(${lesson.id})">i</div>
            <button onclick="startLesson(${lesson.id})">Start</button>
        `;
        list.appendChild(div);
    });
}

function renderDictionary() {
    const app = document.getElementById('app');
    
    let html = `
        <div class="nav-container">
            <button class="dict-btn" onclick="renderHome()">⬅ Back to Lessons</button>
        </div>
        <h1>Tvaali Dictionary</h1>
        
        <h3>Nouns</h3>
        <table class="dict-table">
            <thead>
                <tr><th>English</th><th>Tvaali Root</th><th>Class</th></tr>
            </thead>
            <tbody>
                ${Object.keys(nouns).map(key => `
                    <tr>
                        <td>${key}</td>
                        <td>${nouns[key].root}</td>
                        <td>${nouns[key].class}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <h3>Verbs</h3>
        <table class="dict-table">
            <thead>
                <tr><th>English</th><th>Stem</th><th>Transitive</th></tr>
            </thead>
            <tbody>
                ${Object.keys(verbs).map(key => `
                    <tr>
                        <td>${key}</td>
                        <td>${verbs[key].stem}</td>
                        <td>${verbs[key].trans ? 'Yes' : 'No'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    app.innerHTML = html;
}

// Function to show the popup
window.showInfo = function(id) {
    const lesson = allLessons.find(l => l.id === id);
    
    // Create or find the modal element
    let modal = document.getElementById('infoModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'infoModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>About Lesson ${lesson.id}</h2>
            <p>${lesson.description}</p>
            <h4>New Vocabulary:</h4>
            <ul>
                ${lesson.newWords.map(word => `<li>${word}</li>`).join('')}
            </ul>
            <button onclick="document.getElementById('infoModal').style.display='none'">Close</button>
        </div>
    `;
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

// Start the lesson
let seenWords = new Set(); // Tracks words encountered in the current lesson

function startLesson(id) {
    activeQuestions = quizData.filter(q => q.lessonId === id);
    if (activeQuestions.length > 0) {
        seenWords.clear(); // Clear the list when a new lesson starts
        currentStep = 0;
        renderLesson();
    } else {
        alert("This lesson is still under construction!");
    }
}

// Writes the HTML code to render the website
function renderLesson() {
    const app = document.getElementById('app');

    // 1. Safety Guard
    if (!activeQuestions || activeQuestions.length === 0) {
        renderHome();
        return;
    }

    const q = activeQuestions[currentStep];
    isCorrect = false; 

    // 2. Logic for labels and tooltips
    const isTvaaliPrompt = q.type === "tv_to_en";
    const label = isTvaaliPrompt ? "Translate to English:" : "Translate to Tvaali:";
    
    // We get the raw text based on the question type
    const rawPromptText = isTvaaliPrompt ? q.tvaali : q.english;
    
    // Get the newWords array from the current lesson data
    const currentLesson = allLessons.find(l => l.id === q.lessonId);
    const newWordsList = currentLesson ? currentLesson.newWords : [];

    // Pass that list into the wrapper
    const wrappedPrompt = wrapWords(rawPromptText, isTvaaliPrompt, newWordsList);

    // 3. Single Render (Merge all variables here)
    app.innerHTML = `
        <h1>Lesson ${q.lessonId}</h1>
        <div class="card">
            <p><strong>${label}</strong></p>
            <h2>${wrappedPrompt}</h2>
            <input type="text" id="user-input" autocomplete="off" placeholder="Type here...">
            <button id="submit-btn">Check Answer</button>
            <p id="feedback"></p>
            <button id="next-btn" style="display:none;">Next Question (Enter) ➔</button>
        </div>
    `;

    // 4. Attach Events
    document.getElementById('submit-btn').onclick = checkAnswer;
    document.getElementById('next-btn').onclick = nextQuestion;
    document.getElementById('user-input').focus();
}

// Check answer function
function checkAnswer() {
    const userInput = document.getElementById('user-input').value.trim().toLowerCase();
    const feedback = document.getElementById('feedback');
    const nextBtn = document.getElementById('next-btn');
    const q = activeQuestions[currentStep];

    const correctAnswer = q.type === "en_to_tv" ? q.tvaali : q.english;

    let isInputCorrect = false;

    if (Array.isArray(correctAnswer)) {
        // If it's an array, check if the input matches any item in the list
        isInputCorrect = correctAnswer.some(ans => ans.toLowerCase() === userInput);
    } else {
        // If it's just a single string
        isInputCorrect = userInput === correctAnswer.toLowerCase();
    }

    if (isInputCorrect) {
        feedback.innerText = "Correct!";
        feedback.style.color = "green";
        isCorrect = true;
        nextBtn.style.display = "block";
        document.getElementById('submit-btn').style.display = "none";
    } else {
        const displayAnswer = Array.isArray(correctAnswer) ? correctAnswer[0] : correctAnswer;
        feedback.innerText = `Incorrect. A correct answer would be: ${displayAnswer}`;
        feedback.style.color = "red";
    }
}

// Next question maker
function nextQuestion() {
    // Before moving to next step, mark the words in the current prompt as "seen"
    const q = activeQuestions[currentStep];
    const promptText = (q.type === "tv_to_en") ? q.tvaali : (Array.isArray(q.english) ? q.english[0] : q.english);
    
    promptText.split(" ").forEach(word => {
        const clean = word.toLowerCase().replace(/[.,!?;]/g, "");
        seenWords.add(clean);
    });

    currentStep++;
    if (currentStep < activeQuestions.length) {
        renderLesson();
    } else {
        showEndScreen();
    }
}

// Endscreen maker
function showEndScreen() {
    // Get the ID from the first question of the active set instead
    const lessonId = activeQuestions[0].lessonId;

    document.getElementById('app').innerHTML = `
        <div class="card">
            <h1>Lesson Complete!</h1>
            <p>You've mastered lesson ${lessonId}.</p>
            <button id="home-btn">Take me Home (Enter)</button>
        </div>
    `;
    document.getElementById('home-btn').onclick = () => renderHome();
}

// Global enter check
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const homeBtn = document.getElementById('home-btn');
        
        // 1. If we are on the end screen
        if (homeBtn) {
            homeBtn.click();
        } 
        // 2. If we answered correctly and the next button is there
        else if (isCorrect) {
            nextQuestion();
        } 
        // 3. Otherwise, check the answer
        else {
            checkAnswer();
        }
    }
});

renderHome();