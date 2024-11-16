// Select all required elements from the DOM
const start_btn = document.querySelector(".start_btn button"); // Start button element
const info_box = document.querySelector(".info_box"); // Info box that appears before the quiz
const quiz_box = document.querySelector(".quiz_box"); // Main quiz box where questions and options are displayed
const result_box = document.querySelector(".result_box"); // Result box where the final score is displayed
const option_list = document.querySelector(".option_list"); // List of options for each question
const time_line = document.querySelector("header .time_line"); // The time line that visually represents the time
const timeText = document.querySelector(".timer .time_left_txt"); // Text showing the remaining time
const timeCount = document.querySelector(".timer .timer_sec"); // Timer counter showing the time left in seconds

// Variable to store the selected language for the quiz
let selectedLanguage = null;

// Function to select the language for the quiz
function selectLanguage(language) {
  selectedLanguage = language;

  // Hide the language selection buttons once a language is selected
  document.querySelector(".language_selection").style.display = "none";

  // Update the start quiz button text and show it
  const startBtn = document.querySelector(".start_btn");
  startBtn.classList.remove("hidden"); // Remove hidden class
  startBtn.style.display = "block"; // Make the start button visible

  const startQuizButton = startBtn.querySelector("button");
  startQuizButton.textContent = `Start ${language} Quiz`; // Update the button text based on the selected language
}

// Function to start the quiz when the start button is clicked
start_btn.onclick = () => {
  // Check if a language is selected before proceeding
  if (selectedLanguage) {
    quiz_box.classList.add("activeQuiz"); // Make the quiz box visible
    startQuizProcess(); // Start the quiz
  } else {
    alert("Please select a language first."); // Prompt user to select a language
  }
};

// Quiz flow variables
let selectedQuestions = []; // Array to store the selected questions based on language
let timeValue = 15; // Time for each question in seconds
let que_count = 0; // Current question count
let que_numb = 1; // Question number being displayed
let userScore = 0; // User's score
let counter; // Timer counter for each question
let counterLine; // Timer for the time line
let widthValue = 0; // Initial width of the time line

// Function to start the quiz process based on selected language
function startQuizProcess() {
  // Filter questions based on the selected language
  switch (selectedLanguage) {
    case "HTML":
      selectedQuestions = htmlQuestions; // Assign HTML questions
      break;
    case "CSS":
      selectedQuestions = cssQuestions; // Assign CSS questions
      break;
    case "JavaScript":
      selectedQuestions = jsQuestions; // Assign JavaScript questions
      break;
    default:
      alert("Invalid language selection!"); // Alert for invalid selection
      return;
  }

  // Initialize the quiz with the first question
  showQuestion(0);
  updateQuestionCounter(1);
  startTimer(timeValue); // Start the timer
  startTimerLine(0); // Start the time line
}

// Function to display the current question and options
function showQuestion(index) {
  const que_text = document.querySelector(".que_text"); // Element to display question text

  // Display the question text
  const que_tag = `<span>${selectedQuestions[index].numb}. ${selectedQuestions[index].question}</span>`;
  // Create options HTML
  const option_tag = selectedQuestions[index].options
    .map((option) => `<div class="option"><span>${option}</span></div>`)
    .join(""); // Join all options into a single string

  // Update question and options in the DOM
  que_text.innerHTML = que_tag;
  option_list.innerHTML = option_tag;

  // Add click event listeners to options
  const options = option_list.querySelectorAll(".option");
  options.forEach(
    (option) => option.addEventListener("click", () => optionSelected(option)) // Use addEventListener for better event handling
  );
}

// Function to handle when an option is selected
function optionSelected(answer) {
  clearInterval(counter); // Stop the question timer
  clearInterval(counterLine); // Stop the time line timer

  const userAns = answer.textContent; // Get the user's selected answer
  const correctAns = selectedQuestions[que_count].answer; // Get the correct answer
  const allOptions = option_list.children.length; // Get the number of options

  // Check if the selected answer is correct or incorrect
  if (userAns === correctAns) {
    userScore++; // Increment score for correct answer
    markOption(answer, "correct"); // Mark the option as correct
  } else {
    markOption(answer, "incorrect"); // Mark the option as incorrect
    highlightCorrectAnswer(correctAns); // Highlight the correct answer
  }

  // Disable all options after selection
  disableOptions();
  // Show the "next" button for proceeding to the next question
  document.querySelector("footer .next_btn").classList.add("show");
}

// Function to mark an option as correct or incorrect
function markOption(option, status) {
  option.classList.add(status); // Add status class to the selected option
  const icon = status === "correct" ? "tick" : "cross"; // Select icon based on status
  const iconHtml = `<div class="icon ${icon}"><i class="fas fa-${
    icon === "tick" ? "check" : "times"
  }"></i></div>`;
  option.insertAdjacentHTML("beforeend", iconHtml); // Insert the icon in the option
}

// Function to highlight the correct answer when the user selects an incorrect one
function highlightCorrectAnswer(correctAns) {
  Array.from(option_list.children).forEach((option) => {
    if (option.textContent === correctAns) {
      markOption(option, "correct"); // Mark the correct option
    }
  });
}

// Function to disable all options after selection
function disableOptions() {
  Array.from(option_list.children).forEach(
    (option) => option.classList.add("disabled") // Add disabled class to all options
  );
}

// Function to handle the "next" button click
const next_btn = document.querySelector("footer .next_btn");
next_btn.onclick = () => {
  // If there are more questions, move to the next one
  if (que_count < selectedQuestions.length - 1) {
    que_count++;
    que_numb++;
    showQuestion(que_count); // Show the next question
    updateQuestionCounter(que_numb); // Update the question number
    resetTimers(); // Reset timers
    startTimer(timeValue); // Start the timer for the next question
    startTimerLine(widthValue); // Start the time line for the next question
    timeText.textContent = "Time Left"; // Reset time text
    next_btn.classList.remove("show"); // Hide the next button
  } else {
    clearInterval(counter); // Stop the timer
    clearInterval(counterLine); // Stop the time line
    showResult(); // Show the result at the end
  }
};

// Function to update the question counter
function updateQuestionCounter(index) {
  const bottom_ques_counter = document.querySelector("footer .total_que");
  bottom_ques_counter.innerHTML = `<span><p>${index}</p> of <p>${selectedQuestions.length}</p> Questions</span>`;
}

// Function to reset the timers (question timer and time line)
function resetTimers() {
  clearInterval(counter);
  clearInterval(counterLine);
}

// Function to start the question timer
function startTimer(time) {
  counter = setInterval(() => {
    timeCount.textContent = time < 10 ? "0" + time : time; // Update the timer display
    if (time-- <= 0) {
      // If time runs out, stop the timer
      clearInterval(counter);
      timeText.textContent = "Time Off"; // Update time text
      handleTimeOut(); // Handle the time-out scenario
    }
  }, 1000); // Decrease the time every second
}

// Function to handle time-out situation when the timer reaches zero
function handleTimeOut() {
  const correctAns = selectedQuestions[que_count].answer; // Get the correct answer for the current question
  highlightCorrectAnswer(correctAns); // Highlight the correct answer
  disableOptions(); // Disable all options
  next_btn.classList.add("show"); // Show the next button
}

// Function to start the time line that visually represents the time passing
function startTimerLine(time) {
  counterLine = setInterval(() => {
    time++; // Increment the time line width
    time_line.style.width = time + "px"; // Update the width of the time line
    if (time > 549) clearInterval(counterLine); // Stop the time line once it reaches the end
  }, 29); // Adjust time for smooth visual progress
}

// Function to display the final result after the quiz ends
function showResult() {
    quiz_box.classList.remove("activeQuiz"); // Hide the quiz box
    result_box.classList.add("activeResult"); // Show the result box
  
    const scoreText = result_box.querySelector(".score_text"); // Element to display score message
    // Determine the result message based on the user's score
    let resultMessage =
      userScore > 3
        ? `Great job! You got ${userScore} out of ${selectedQuestions.length}.`
        : `Good try! You scored ${userScore} out of ${selectedQuestions.length}.`;
    scoreText.innerHTML = `<span>${resultMessage}</span>`;
  
    // Get the replay and quit buttons
    const replayBtn = result_box.querySelector(".replay_btn");
    const quitBtn = result_box.querySelector(".quit_btn");
  
    // Event listener for replaying the quiz
    replayBtn.onclick = () => {
      resetQuiz(); // Reset quiz to start over
    };
  
    // Event listener for quitting the quiz
    quitBtn.onclick = () => {
      window.location.reload(); // Reload the page to reset the quiz completely
    };
  }
  
  // Function to reset the quiz (for replay)
  function resetQuiz() {
    userScore = 0; // Reset score
    que_count = 0; // Reset question count
    que_numb = 1; // Reset question number
    selectedQuestions = []; // Clear selected questions
    showQuestion(que_count); // Show the first question again
    updateQuestionCounter(que_numb); // Update question counter
    resetTimers(); // Reset the timers
    startTimer(timeValue); // Restart the timer
    startTimerLine(widthValue); // Restart the time line
    timeText.textContent = "Time Left"; // Reset time text
    next_btn.classList.remove("show"); // Hide the next button again
    result_box.classList.remove("activeResult"); // Hide the result box
    quiz_box.classList.add("activeQuiz"); // Show the quiz box again
  }
  