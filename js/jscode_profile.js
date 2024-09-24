var socket = io.connect('https://memoralife.onrender.com/');

var info;

window.onload = function(){
    info = JSON.parse(localStorage.getItem("userInfo"));

    if(info.infocompletion == 0){
        var openQ = prompt("Seems like you are logging in for the first time. Would you like to complete a questionaire? Y/N")
        if(openQ == "y" || openQ == "Y"){
            openQuestionaire();
        }
    }

    //Enter information in their fields
    document.getElementById("divinfo2").innerHTML = info.name;
    document.getElementById("divinfo3").innerHTML = info.surname;

}

//questionaire (modal) related code++

const modal = document.getElementById("questionModal");
const btn = document.getElementById("openModalBtn");
const span = document.getElementById("closeModal");
const questionTitle = document.getElementById("questionTitle");
const answerField = document.getElementById("answerField");
const nextBtn = document.getElementById("nextBtn");

const questions = [
    "What is your name?",
    "What is your favorite color?",
    "What are your hobbies?",
    "Any additional comments?"
];

let currentQuestionIndex = 0;
const answers = [];

btn.onclick = openQuestionaire();

function openQuestionaire() {
    modal.style.display = "block";
    loadQuestion();
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

nextBtn.onclick = function() {
    // Save the answer to the current question
    answers[currentQuestionIndex] = answerField.value;

    // Move to the next question or finish
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        finishQuestions();
    }
}

function loadQuestion() {
    answerField.value = ""; // Clear the previous answer
    questionTitle.innerText = questions[currentQuestionIndex];
    nextBtn.innerText = currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"; // Change button text
}

function finishQuestions() {
    modal.style.display = "none"; // Close modal
    // Do something with the answers, e.g., send them to the server or display them
    console.log("Finished Questions:", answers);
}

//questionaire (modal) related code--



function logout(){
    //remove saved information from the client
    localStorage.removeItem("userInfo");
    //load homepage
    window.open("https://memoralife.onrender.com/", "_self");
}

socket.on("showMessage", function(msg){
    alert(msg);
  });