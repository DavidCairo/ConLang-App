// 1. Database of questions
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

let currentStep = 0;

// 2. Build the HTML
function renderApp() {
    const app = document.getElementById('app');
    const q = quizData[currentStep];

    // Determine what the prompt is based on the type
    const prompt = q.type === "en_to_tv" ? q.english : q.tvaali;
    const label = q.type === "en_to_tv" ? "Translate to Tvaali:" : "Translate to English:";

    app.innerHTML = `
        <h1>Tvaali Lesson 1</h1>
        <div class="card">
            <p><strong>${label}</strong></p>
            <h2 id="prompt-display">${prompt}</h2>
            
            <input type="text" id="user-input" autocomplete="off" placeholder="Your answer...">
            <button id="submit-btn">Check Answer</button>
            
            <p id="feedback"></p>
            <button id="next-btn" style="display:none;">Next Question ➔</button>
        </div>
    `;

    // Event Listeners
    document.getElementById('submit-btn').onclick = checkAnswer;
    document.getElementById('next-btn').onclick = nextQuestion;
    
    // Allow "Enter" key to submit
    document.getElementById('user-input').onkeypress = (e) => {
        if (e.key === 'Enter') checkAnswer();
    };
}

// 3. The Logic
function checkAnswer() {
    const userInput = document.getElementById('user-input').value.trim().toLowerCase();
    const feedback = document.getElementById('feedback');
    const nextBtn = document.getElementById('next-btn');
    const q = quizData[currentStep];

    // Check against either the tvaali or english answer depending on type
    const correctAnswer = q.type === "en_to_tv" ? q.tvaali : q.english;

    if (userInput === correctAnswer.toLowerCase()) {
        feedback.innerText = "Correct! Well done.";
        feedback.style.color = "green";
        nextBtn.style.display = "block"; // Show the next button
    } else {
        feedback.innerText = `Incorrect. The answer was: ${correctAnswer}`;
        feedback.style.color = "red";
        nextBtn.style.display = "block"; 
    }
}

function nextQuestion() {
    currentStep++;
    if (currentStep < quizData.length) {
        renderApp();
    } else {
        document.getElementById('app').innerHTML = `
            <h1>Chapter Finished!</h1>
            <p>You've mastered the first few sentences.</p>
            <button onclick="location.reload()">Restart</button>
        `;
    }
}

// Initial Launch
renderApp();