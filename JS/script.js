



// Elements
var questionsEl = document.querySelector("#questions");
var timerEl = document.querySelector("#time");
var choicesEl = document.querySelector("#choices");
var submitBtn = document.querySelector("#submit");
var startBtn = document.querySelector("#start");
var initialsEl = document.querySelector("#initials");
var feedbackEl = document.querySelector("#feedback");

// establishes the number of questions
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

function startQuiz() {
  // Hides the start screen after beginning the quiz
  var startScreenEl = document.getElementById("start-screen");
  startScreenEl.setAttribute("class", "hide");

  // display the question
  questionsEl.removeAttribute("class");

  // start timer
  timerId = setInterval(clockTick, 1000);

  // show timer to the user
  timerEl.textContent = time;

  getQuestion();
}

function getQuestion() {
  // get the current question object from question array (contained in questions.js)
  var currentQuestion = questions[currentQuestionIndex];

  // update title element with the current question
  var titleEl = document.getElementById("question-title");
  titleEl.textContent = currentQuestion.title;

  // clear out choices from the last question
  choicesEl.innerHTML = "";

  // loop over choices
  currentQuestion.choices.forEach(function(choice, i) {
    // create a new button for each choice
    var choiceNode = document.createElement("button");
    choiceNode.setAttribute("class", "choice");
    choiceNode.setAttribute("value", choice);

    choiceNode.textContent = i + 1 + ". " + choice;

    //click event listener for each choice
    choiceNode.onclick = questionClick;

    // display the choices on the page
    choicesEl.appendChild(choiceNode);
  });
}

function questionClick() {
  // check if the user guessed wrong
  if (this.value !== questions[currentQuestionIndex].answer) {
    // if they checked wrong, penalize ten seconds
    time -= 10;

    if (time < 0) {
      time = 0;
    }
    // display new time on the page
    timerEl.textContent = time;
    feedbackEl.textContent = "-10 seconds";
    feedbackEl.style.color = "lightcoral";
    feedbackEl.style.fontSize = "300%";
  } else {
    feedbackEl.textContent = "Well done!";
    feedbackEl.style.color = "aquamarine";
    feedbackEl.style.fontSize = "300%";
  }

  // flash right or wrong depending on answer
  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function() {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 1000);

  // advances to the next question
  currentQuestionIndex++;

  // checks how much time is remaining
  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  // stop timer
  clearInterval(timerId);

  // display the end screen
  var endScreenEl = document.getElementById("end-screen");
  endScreenEl.removeAttribute("class");

  // show final score
  var finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = time;

  // hide questions section
  questionsEl.setAttribute("class", "hide");
}

function clockTick() {
  // update time
  time--;
  timerEl.textContent = time;

  // check if the user ran out of time, if they do, end the quiz
  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore() {
  // get value of input box
  var initials = initialsEl.value.trim();

  if (initials !== "") {
    // get saved scores from localstorage, or if not any, set to empty array
    var highscores =
      JSON.parse(window.localStorage.getItem("highscores")) || [];

    // format new score object for current user
    var newScore = {
      score: time,
      initials: initials
    };

    // save to localstorage
    highscores.push(newScore);
    window.localStorage.setItem("highscores", JSON.stringify(highscores));

    // redirect to next page (score.html)
    window.location.href = "score.html";
  }
}

function checkForEnter(event) {
  // "13" represents the enter key
  if (event.key === "Enter") {
    saveHighscore();
  }
}

// submit high score
submitBtn.onclick = saveHighscore;

// start quiz
startBtn.onclick = startQuiz;

initialsEl.onkeyup = checkForEnter;
