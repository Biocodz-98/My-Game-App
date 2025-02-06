const colors = {
  easy: ["red", "blue", "green", "yellow", "purple", "orange"],
  medium: ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown"],
  hard: ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown", "black", "white"]
};

let difficulty = "easy";
let targetColor = "";
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let lives = 3;
let timeLeft = 15;
let timer;
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

const colorBox = document.getElementById("colorBox");
const colorOptions = document.getElementById("colorOptions");
const gameStatus = document.getElementById("gameStatus");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const livesDisplay = document.getElementById("lives");
const timeDisplay = document.getElementById("time");
const newGameButton = document.getElementById("newGameButton");
const difficultySelect = document.getElementById("difficulty");
const leaderboardDisplay = document.getElementById("leaderboard");

function startTimer() {
  clearInterval(timer);
  timeLeft = difficulty === "easy" ? 15 : difficulty === "medium" ? 10 : 5;
  timeDisplay.textContent = timeLeft;
  timer = setInterval(() => {
      timeLeft--;
      timeDisplay.textContent = timeLeft;
      if (timeLeft <= 0) {
          handleWrongGuess();
      }
  }, 1000);
}

function updateTargetColor() {
  targetColor = colors[difficulty][Math.floor(Math.random() * colors[difficulty].length)];
  colorBox.style.backgroundColor = targetColor;
}

function startNewGame() {
  score = 0;
  lives = 3;
  updateScoreAndLives();
  generateColorOptions();
  updateTargetColor();
  startTimer();
}

function generateColorOptions() {
  colorOptions.innerHTML = "";
  const shuffledColors = [...colors[difficulty]].sort(() => Math.random() - 0.5);
  shuffledColors.forEach(color => {
      const button = document.createElement("button");
      button.style.backgroundColor = color;
      button.dataset.color = color;
      button.onclick = handleGuess;
      colorOptions.appendChild(button);
  });
}

function handleGuess(event) {
  const selectedColor = event.target.dataset.color;
  if (selectedColor === targetColor) {
      score++;
      if (score > highScore) {
          highScore = score;
          localStorage.setItem("highScore", highScore);
      }
      gameStatus.textContent = "Correct! 🎉";
  } else {
      handleWrongGuess();
  }
  updateScoreAndLives();
  updateTargetColor();
  startTimer();
}

function handleWrongGuess() {
  lives--;
  if (lives === 0) {
      saveToLeaderboard();
      alert("Game Over! Your score: " + score);
      startNewGame();
  } else {
      gameStatus.textContent = "Wrong! ❌";
  }
  updateScoreAndLives();
}

function updateScoreAndLives() {
  scoreDisplay.textContent = score;
  highScoreDisplay.textContent = highScore;
  livesDisplay.textContent = lives;
}

function saveToLeaderboard() {
  leaderboard.push(score);
  leaderboard.sort((a, b) => b - a);
  leaderboard = leaderboard.slice(0, 5);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  updateLeaderboardDisplay();
}

function updateLeaderboardDisplay() {
  leaderboardDisplay.innerHTML = leaderboard.map((score, index) => `<p>${index + 1}. ${score}</p>`).join('');
}

difficultySelect.addEventListener("change", (event) => {
  difficulty = event.target.value;
  startNewGame();
});

newGameButton.addEventListener("click", startNewGame);

updateLeaderboardDisplay();
startNewGame();
