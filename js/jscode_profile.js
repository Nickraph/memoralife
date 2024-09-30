var socket = io.connect('https://memoralife.onrender.com/');

var info;
const memoryFieldNames_global = [
    "First name:","Last name:","Date of birth:","Place of birth:","Nickname:","Current address:","Family","Family's occupations:","Pets:","Childhood:","Childhood address:","School:","Love:","Additional notes:","Studies:","Career:","Marriage:","Partner:","Children:","Additional notes:","Grandchildren:","Values:","Achievements:","Foods & Recipes:","Scents:","Entertainment:","Season:","Media:","Music:","Hobbies:","Additional:","Dislikes:","Routine:"
];

document.addEventListener('DOMContentLoaded', () => { 
    //Retrieve user information from localStorage
    info = JSON.parse(localStorage.getItem("userInfo"));

    // Generate all memory (text & media) storing divs & category dividers dynamically.
    const memoryContainer = document.getElementById("memory-container");
	const memoryFieldNames = [
        "First name:","Last name:","Date of birth:","Place of birth:","Nickname:","Current address:","Family","Family's occupations:","Pets:","Childhood:","Childhood address:","School:","Love:","Additional notes:","Studies:","Career:","Marriage:","Partner:","Children:","Additional notes:","Grandchildren:","Values:","Achievements:","Foods & Recipes:","Scents:","Entertainment:","Season:","Media:","Music:","Hobbies:","Additional:","Dislikes:","Routine:"
    ];
    const categoryNames = ["—General Information—", "—Childhood—", "—Adulthood—", "—Seniority—", "—Preferences—", "—Routine—"];
    var categoryIndex = 0;
    const divNumber = memoryFieldNames.length;

    for (let i = 1; i <= divNumber; i++) {
        //Create memory divs
        const memoryBox = document.createElement("div");
        memoryBox.classList.add("memory-box");

        //Heading
        const heading = document.createElement("div");
        heading.classList.add("memory-heading");
        heading.textContent = memoryFieldNames[i-1];

        //Information inside
        const paragraph = document.createElement("p");
        paragraph.id = `divinfo${i}`;
        paragraph.textContent = "Information Placeholder";

        //Hidden edit buttons
        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-btn");
        editBtn.textContent = "Edit";

        //Handle edit buttons logic
        editBtn.addEventListener("click", function (){
            openEditingModal(i);
        });

        //Read more buttons
        const readMoreBtn = document.createElement("span");
        readMoreBtn.classList.add("read-more-btn");
        readMoreBtn.textContent = "Read more";

        //Handle expand/collapse logic
        readMoreBtn.addEventListener("click", function (){
            memoryBox.classList.toggle("expanded");
            readMoreBtn.textContent =
                memoryBox.classList.contains("expanded")
                    ? "Read less"
                    : "Read more";
        });

        //Append elements to memoryBox
        memoryBox.appendChild(heading);
        memoryBox.appendChild(paragraph);
        memoryBox.appendChild(editBtn)
        memoryBox.appendChild(readMoreBtn);

        //Create and append category dividers
        if(i === 1 || i === 10 || i === 15 || i === 21 || i === 22 || i === 33){
            const categoryLine = document.createElement("div");
            categoryLine.classList.add("category-headers");
            categoryLine.innerText = categoryNames[categoryIndex];
            categoryIndex++;
            memoryContainer.appendChild(categoryLine);
        }

        //Append memory div to memory container
        memoryContainer.appendChild(memoryBox);

        //Create and append media divs + upload buttons at the bottom of each category
        if (i === 14 || i === 20 || i === 21 || i === 33) {
            const mediaBox = document.createElement("div");
            mediaBox.classList.add("media-box");

            /*for (let j = 0; j < 3; j++) {
                const mediaPlaceholder = document.createElement("div");
                mediaPlaceholder.classList.add("media-placeholder");
                mediaBox.appendChild(mediaPlaceholder);
            }*/

            const uploadBtn = document.createElement("button");
            uploadBtn.classList.add("upload-buttons");
            uploadBtn.innerText = "Upload Media";
            
            mediaBox.appendChild(uploadBtn);
            memoryContainer.appendChild(mediaBox);
        }
    }

    //Set user's full name in the menu bar
    document.getElementById("usernameHeader").innerText = info.name +" "+ info.surname;

    //Prompt to open questionnaire if its first time loging in
    if(info.infocompletion == 0){
        var openQ = prompt("Welcome, "+info.name+". Seems like you are logging in for the first time. Would you like to complete a questionaire? Y/N")
        if(openQ == "y" || openQ == "Y"){
            openQuestionaire();
        }
    }

    //Enter information in their fields
    document.getElementById("divinfo1").innerHTML = info.name;
    document.getElementById("divinfo2").innerHTML = info.surname;
});




//questionaire (modal) related code++

const modal = document.getElementById("questionModal");
const QuestionnaireBtn = document.getElementById("openQuestionnaireBtn");
const span = document.getElementById("closeModal");
const questionTitle = document.getElementById("questionTitle");
const answerField = document.getElementById("answerField");
const nextBtn = document.getElementById("nextBtn");

const questions = [
    "Ποιά ειναι η ημερομηνια γεννησης σας;",
    "Και που γεννηθήκατε;",
    "Είχατε κατα τη διαρκεια της ζωης σας καποιο ψευδώνυμο;",
    "Ποια ειναι η τωρινη σας διευθυνση;",
    "Ποια ειναι τα ονοματα της οικογένειας σας; (Γονεις, αδερφια)",
    "Τι επαγγελονται οι γονεις και τα αδερφια σας; Γραψτε ελευθερα.",
    "Έχετε/Είχατε ποτε κατοικίδια; Γραψτε ορισμενα πραγματα γι αυτα.",
    "Πως θα περιγραφατε συνοπτικα την παιδικη σας ηλικια; Ποιες αναμνησεις θα θελατε να σημειωσετε; (Φίλοι, αγαπημένες δραστηριότητες, παιχνίδια κτλ)",
    "Ποια ήταν η διευθυνση του σπιτιου σας κατα την παιδικη σας ηλικία; Μπορειτε να σημειωσετε πανω απο μια.",
    "Σε ποια σχολεία πηγαίνατε;",
    "Εχετε καποιες αναμνήσεις απο τον πρώτο σας ερωτα που θα θελατε να σημειωσετε; Γραψτε ελέυθερα.",
    "Εχει μείνει κατι που θα θέλατε να προσθέσετε σχέτικα με την παιδική σας ηλικία; Σημειωστε το εδω.",
    "Ποιο ηταν το αντικείμενο των σπουδών σας;",
    "Γραψτε ορισμενα πραγματα για την επαγγελματική σας καριερα.",
    "Έχετε να καταγράψετε ορισμένες αναμνήσεις η/και πληροφοριες από τον γάμο σας;",
    "Ορισμένες πληροφορίες για τον/την συζηγο σας; (Ονοματεπωνυμο, επαγγελμα κτλ) Γραψτε ελευθερα.",
    "Έχετε παιδιά; Σημειώστε οσες πληροφορίες ή αναμνησεις θελετε εδω.",
    "Έχετε λοιπές πληροφορίες για την ενήλικη σας ζωή που θα θελατε να συμπληρώσετε;",
    "Έχετε εγγόνια; Καταγράψτε ορισμενες πληροφορίες ή αναμνήσεις γι αυτα.",
    "Ποιές είναι οι αξίες και τα πιστεύω σας; Γραψτε ελευθερα.",
    "Υπαρχουν καποια επιτευγματα στη ζωη σας που θα θελατε να σημειωσετε;",
    "Ποια ειναι τα αγαπημένα σας φαγητα η/και συνταγες;",
    "Έχετε καποιες αγαπημενες μυρωδιες; Υπάρχουν μυρωδιές που σας φερνουν συγκεκριμενες αναμνησεις;",
    "Ποιοι ειναι οι αγαπημένοι τρόποι διασκέδασης σας ή αγαπημένες σας ασχολίες;",
    "Έχετε καποια αγαπημένη εποχή;",
    "Ποιες ειναι οι αγαπημένες ταινίες, σειρές ή προγράμματα;",
    "Τι είδους μουσική σας αρεσει; Ορισμενα τραγουδια που θα θελατε να σημειωσετε; Γραψτε ελευθερα.",
    "Υπαρχει καποιο αλλο χομπυ ή ενδιαφερον σας;",
    "Υπαρχει κατι που αγαπατε και δεν σημειωσατε ακομα; Αγαπημενη ωρα της ημερας, συνηθεια κτλ.",
    "Υπαρχει κατι που ΔΕΝ σας αρεσει; Σημειωστε οσα θελετε εδω.",
    "Θα θελατε να περιγραψετε τη ρουτινα σας;"
  ];

let currentQuestionIndex = 0;
const answers = [];

QuestionnaireBtn.onclick = openQuestionaire;

function openQuestionaire() {
    modal.style.display = "block";
    loadQuestion();
}

span.onclick = function() {
    // Save the answer to the current question
    answers[currentQuestionIndex] = answerField.value;
    modal.style.display = "none";
    finishQuestions();
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
        currentQuestionIndex = 0;
    }
}

function loadQuestion() {
    answerField.value = ""; // Clear the previous answer
    questionTitle.innerText = questions[currentQuestionIndex];
    nextBtn.innerText = currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"; // Change button text
}

function finishQuestions() {
    modal.style.display = "none"; // Close modal
    
    //loop through every answers[] item and set the answer to the respective div
    for(i in answers){
        const index = parseInt(i, 10);
        document.getElementById(`divinfo${index+3}`).innerHTML = answers[index];
    }

    console.log("Finished Questions:", answers);
}

//questionaire (modal) related code--

//"Edit Information Mode" related code++

const editInfoBtn = document.getElementById("editInformationBtn");

var editMode = false;
var defaultBodyColor = window.getComputedStyle(document.body).backgroundColor;//get default <body> color

editInfoBtn.onclick = function() {

    if(editMode){ //if currently in edit mode - back to default mode.
        editMode = false;
        document.body.style.backgroundColor = defaultBodyColor;
        editInfoBtn.style.backgroundColor = "#00bfa5";
        editInfoBtn.innerText = "Open Edit Mode";

        //hide edit buttons
        const editButtons = document.querySelectorAll(".edit-btn");
        editButtons.forEach(button => {button.style.display = "none"});
        const uploadButtons = document.querySelectorAll(".upload-buttons");
        uploadButtons.forEach(button => {button.style.display = "none"});
        document.getElementById("pfp-edit-btn").style.display = "none";
    }
    else{
        editMode = true;
        document.body.style.backgroundColor = "#ede6e6";
        editInfoBtn.style.backgroundColor = "#eb3626";
        editInfoBtn.innerText = "Close Edit Mode";

        //show edit buttons
        const editButtons = document.querySelectorAll(".edit-btn");
        editButtons.forEach(button => {button.style.display = "block"});
        const uploadButtons = document.querySelectorAll(".upload-buttons");
        uploadButtons.forEach(button => {button.style.display = "block"});
        document.getElementById("pfp-edit-btn").style.display = "inline-block";
    }
}

//Specific memory box editing:
const editingModal = document.getElementById("editingModal");
const editingModal_closeBtn = document.getElementById("editingModal-closeBtn");
const editingModal_saveButton = document.getElementById("editingModal-saveBtn");
const editingModal_input = document.getElementById("editingModal-input");
const editingModal_header = document.getElementById("editingModal-header");
var editedMemory;

function openEditingModal(buttonNumber){
    editedMemory = buttonNumber;
    editingModal_input.value = document.getElementById(`divinfo${buttonNumber}`).innerText; // Set the input field to the current content
    editingModal_header.innerText = memoryFieldNames_global[buttonNumber-1];
    editingModal.style.display = "block";
}

editingModal_closeBtn.onclick = function() {
    editingModal.style.display = "none"; // Close editing modal
    editingModal_input.value = ""; // Empty input field
    editingModal_header.innerText = ""; // Empty header
    
}

editingModal_saveButton.onclick = function() {
    editingModal.style.display = "none"; // Close editing modal
    document.getElementById("divinfo"+editedMemory).innerText = editingModal_input.value;
    editedMemory = undefined; //reset which memory is being edited
}

//"Edit Information Mode" related code--

function logout() {
    //remove saved information from the client
    localStorage.removeItem("userInfo");
    //load homepage
    window.open("https://memoralife.onrender.com/", "_self");
}

socket.on("showMessage", function(msg) {
    alert(msg);
  });