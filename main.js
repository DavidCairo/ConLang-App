// Current possible quizes 
const quizData = [
    {
        english: "The woman loves water",
        tvaali: "sidhi aaloo thaim",
        type: "en_to_tv"
    },
    {
        tvaali: "sidhi aaloo thaim",
        english: "the woman loves water",
        type: "tv_to_en"
    }
];

let currentStep = 0; // Makes sure the question is en -> tv and tv -> en
let isCorrect = false; // Track if current question is solved

// Writes the HTML code to render the website
function renderApp() {
    const app = document.getElementById('app');
    const q = quizData[currentStep];
    isCorrect = false; 

    const prompt = q.type === "en_to_tv" ? q.english : q.tvaali;
    const label = q.type === "en_to_tv" ? "Translate to Tvaali:" : "Translate to English:";

    app.innerHTML = `
        <h1>Tvaali Lesson 1</h1>
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
    const q = quizData[currentStep];

    const correctAnswer = q.type === "en_to_tv" ? q.tvaali : q.english;

    if (userInput === correctAnswer.toLowerCase()) {
        feedback.innerText = "Correct!";
        feedback.style.color = "green";
        isCorrect = true;
        nextBtn.style.display = "block";
        document.getElementById('submit-btn').style.display = "none";
    } else {
        feedback.innerText = `Incorrect. Please try again!`;
        feedback.style.color = "red";
    }
}

// Next question maker
function nextQuestion() {
    currentStep++;
    if (currentStep < quizData.length) {
        renderApp();
    } else {
        showEndScreen();
    }
}

// Endscreen maker
function showEndScreen() {
    document.getElementById('app').innerHTML = `
        <div class="card">
            <h1>Lesson Complete!</h1>
            <p>You've mastered these Tvaali basics.</p>
            <button id="home-btn">Take me Home (Enter)</button>
        </div>
    `;
    document.getElementById('home-btn').onclick = () => location.reload();
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

renderApp();