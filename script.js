/* =================================
   GAME VARIABLES
================================= */
let score = 0;

let currentQuestionNumber = 1;

let totalQuestions = 10;

let currentOperation = "addition";

let correctAnswer;

let questionAnswered = false;

/* =================================
   HTML ELEMENTS
================================= */
const question = document.getElementById("question");

const answerInput = document.getElementById("answerInput");

const resultMessage = document.getElementById("resultMessage");

const scoreDisplay = document.getElementById("score");

const currentQuestionDisplay = document.getElementById("currentQuestion");

const nextButton = document.getElementById("nextBtn");

const gameScreen = document.querySelector(".game-screen");

const resultScreen = document.getElementById("resultScreen");

const finalScore = document.getElementById("finalScore");

const finalMessage = document.getElementById("finalMessage");

/*=========================================================
    BACKGROUND MUSIC
=========================================================*/

// --- Audio setup ---
const bgMusic = new Audio("nastelbom-toy-theme-442638.mp3");

// Audio loop
bgMusic.loop = true;

// Preload sounds 
bgMusic.load();

const audioToggle = document.getElementById("audioToggle");

const audioIcon = audioToggle.querySelector("i");

let isMuted = false;

audioToggle.addEventListener("click", function () {
  if (bgMusic.paused) {
    bgMusic.play();

    audioIcon.className = "fas fa-volume-up";
  } else {
    bgMusic.pause();

    audioIcon.className = "fas fa-volume-mute";
  }
});

// Load saved mute state
const savedMute = localStorage.getItem("mathKids_mute");

if (savedMute !== null) {
  isMuted = savedMute === "true";
}

// Start background music after the user's first interaction
document.addEventListener(
  "click",
  function startMusic() {
    if (!isMuted) {
      bgMusic.play().catch((error) => {
        console.log("Audio could not play:", error);
      });
    }

    // Run only once
    document.removeEventListener("click", startMusic);
  },
  { once: true },
);

// Apply mute state
function applyMuteState() {
  if (isMuted) {
    bgMusic.muted = true;

    audioToggle.classList.add("muted");

    audioIcon.className = "fas fa-volume-mute";
  } else {
    bgMusic.muted = false;

    audioToggle.classList.remove("muted");

    audioIcon.className = "fas fa-volume-up";
  }

  localStorage.setItem("mathKids_mute", String(isMuted));
}

// Toggle music
audioToggle.addEventListener("click", function (event) {
  event.stopPropagation();

  isMuted = !isMuted;

  if (isMuted) {
    bgMusic.pause();
  } else {
    bgMusic.play().catch((error) => {
      console.log("Audio could not play:", error);
    });
  }

  applyMuteState();
});

// Initialize
applyMuteState();

/* =================================
   RANDOM NUMBER
================================= */
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* =================================
   SELECT OPERATION
================================= */
function selectOperation(operation, selectedButton) {
  currentOperation = operation;

  isRandomMode = false;

  const operationButtons = document.querySelectorAll(".operation-btn");

  operationButtons.forEach((button) => {
    button.classList.remove("active");
  });

  selectedButton.classList.add("active");

  generateQuestion();
}

/* =================================
   RANDOMIZE OPERATION
================================= */
function randomizeOperation(selectedButton) {
  isRandomMode = true;

  const operationButtons = document.querySelectorAll(".operation-btn");

  operationButtons.forEach((button) => {
    button.classList.remove("active");
  });

  selectedButton.classList.add("active");

  generateQuestion();
}

/* =================================
   GENERATE QUESTION
================================= */
function generateQuestion() {
  if (isRandomMode) {
    const operations = [
      "addition",
      "subtraction",
      "multiplication",
      "division",
    ];

    const randomIndex = randomNumber(0, operations.length - 1);

    currentOperation = operations[randomIndex];
  }

  let number1;

  let number2;

  let operator;

  questionAnswered = false;

  answerInput.value = "";

  answerInput.disabled = false;

  nextButton.classList.add("hidden");

  resultMessage.textContent = "Good luck! 🍀";

  resultMessage.style.color = "#166534";

  /* ADDITION */

  if (currentOperation === "addition") {
    number1 = randomNumber(0, 10);

    number2 = randomNumber(0, 10);

    correctAnswer = number1 + number2;

    operator = "+";
  } else if (currentOperation === "subtraction") {
    /* SUBTRACTION */

    number1 = randomNumber(0, 10);

    number2 = randomNumber(0, 10);

    if (number2 > number1) {
      let temporary = number1;

      number1 = number2;

      number2 = temporary;
    }

    correctAnswer = number1 - number2;

    operator = "-";
  } else if (currentOperation === "multiplication") {
    /* MULTIPLICATION */

    number1 = randomNumber(0, 10);

    number2 = randomNumber(0, 10);

    correctAnswer = number1 * number2;

    operator = "×";
  } else if (currentOperation === "division") {
    /* DIVISION */

    number2 = randomNumber(1, 10);

    correctAnswer = randomNumber(1, 10);

    number1 = number2 * correctAnswer;

    operator = "÷";
  }

  question.textContent = `${number1} ${operator} ${number2} = ?`;
}

/* =================================
   CHECK ANSWER
================================= */
function checkAnswer() {
  if (questionAnswered) {
    return;
  }

  if (answerInput.value === "") {
    resultMessage.textContent = "Please enter your answer first! 😊";

    resultMessage.style.color = "#d97706";

    return;
  }

  const userAnswer = Number(answerInput.value);

  questionAnswered = true;

  answerInput.disabled = true;

  if (userAnswer === correctAnswer) {
    score++;

    scoreDisplay.textContent = score;

    resultMessage.textContent = "🎉 Correct! Great job, Math Star!";

    resultMessage.style.color = "#16a34a";
  } else {
    resultMessage.textContent = `Not quite! The answer is ${correctAnswer}. 😊`;

    resultMessage.style.color = "#dc2626";
  }

  nextButton.classList.remove("hidden");
}

/* =================================
   NEXT QUESTION
================================= */
function nextQuestion() {
  if (currentQuestionNumber >= totalQuestions) {
    showFinalResult();

    return;
  }

  currentQuestionNumber++;

  currentQuestionDisplay.textContent = currentQuestionNumber;

  generateQuestion();
}

/* =================================
   SHOW FINAL RESULT
================================= */
function showFinalResult() {
  gameScreen.classList.add("hidden");

  resultScreen.classList.remove("hidden");

  finalScore.textContent = `${score} / ${totalQuestions}`;

  if (score === 10) {
    finalMessage.textContent = "🏆 Perfect Score! You are a Math Superstar! 🌟";
  } else if (score >= 7) {
    finalMessage.textContent = "🎉 Amazing work! You are doing great!";
  } else if (score >= 5) {
    finalMessage.textContent = "😊 Good job! Keep practicing!";
  } else {
    finalMessage.textContent = "💪 Keep trying! Practice makes perfect!";
  }
}

/* =================================
   RESET GAME
================================= */
function resetGame() {
  score = 0;

  currentQuestionNumber = 1;

  currentOperation = "addition";

  scoreDisplay.textContent = score;

  currentQuestionDisplay.textContent = currentQuestionNumber;

  gameScreen.classList.remove("hidden");

  resultScreen.classList.add("hidden");

  const operationButtons = document.querySelectorAll(".operation-btn");

  operationButtons.forEach((button) => {
    button.classList.remove("active");
  });

  operationButtons[0].classList.add("active");

  generateQuestion();
}

/* =================================
   PLAY AGAIN
================================= */

function restartGame() {
  resetGame();
}

/* =================================
   ENTER KEY SUPPORT
================================= */

answerInput.addEventListener(
  "keydown",

  function (event) {
    if (event.key === "Enter") {
      checkAnswer();
    }
  },
);

/* =================================
   START GAME IMMEDIATELY
================================= */

generateQuestion();
