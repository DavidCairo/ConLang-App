// Creating lessons
const lessons = [
    { id: 1, title: "Lesson 1: Basics", description: "Learn 'Woman' and 'Water'" },
    { id: 2, title: "Lesson 2: Animals", description: "Learn 'Animal' and 'Bird'" },
    { id: 3, title: "Lesson 3: Cases", description: "Introduction to the Accusative" }
];

// Current possible quizes 
const quizData = [
    ...lesson1Data
];

let activeQuestions = []; // This will hold the questions for the current session
let currentStep = 0; // Makes sure the question is en -> tv and tv -> en
let isCorrect = false; // Track if current question is solved

// Functions

// Make homepage
function showHome() {
    const app = document.getElementById('app');
    
    // 1. Set up the header
    let html = `
        <h1>Tvaali Language App</h1>
        <p>Select a lesson to begin:</p>
        <div id="lesson-list">
    `;

    // 2. Loop through your lessons and add a button for each
    lessons.forEach(lesson => {
        html += `
            <div class="lesson-card">
                <h3>${lesson.title}</h3>
                <p>${lesson.description}</p>
                <button onclick="startLesson(${lesson.id})">Start</button>
            </div>
        `;
    });

    // 3. Close the div and inject it into the app
    html += `</div>`;
    app.innerHTML = html;
}

// Start the lesson
function startLesson(id) {
    // 1. Filter questions by the ID passed from the button
    activeQuestions = quizData.filter(q => q.lessonId === id);

    // 2. Safety check: make sure the lesson isn't empty
    if (activeQuestions.length > 0) {
        currentStep = 0;    // Reset progress
        renderLesson();     // Call your quiz renderer
    } else {
        alert("This lesson is still under construction!");
    }
}

// Writes the HTML code to render the website
function renderLesson() {
    const app = document.getElementById('app');

    // Safety Guard: If there's no data, go home
    if (!activeQuestions || activeQuestions.length === 0) {
        showHome();
        return;
    }

    const q = activeQuestions[currentStep];
    isCorrect = false; 

    const prompt = q.type === "en_to_tv" ? q.english : q.tvaali;
    const label = q.type === "en_to_tv" ? "Translate to Tvaali:" : "Translate to English:";

    app.innerHTML = `
        <h1>Lesson ${q.lessonId}</h1>
        <div class="card">
            <p><strong>${label}</strong></p>
            <h2>${prompt}</h2>
            <input type="text" id="user-input" autocomplete="off" placeholder="Type here...">
            <button id="submit-btn">Check Answer</button>
            <p id="feedback"></p>
            <button id="next-btn" style="display:none;">Next Question (Enter) ➔</button>
        </div>
    `;

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
    document.getElementById('home-btn').onclick = () => showHome();
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

showHome();