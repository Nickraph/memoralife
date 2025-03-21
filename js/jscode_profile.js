var socket = io.connect('https://memoralife.onrender.com/');

var info; // ! USE THIS VARIABLE INSTEAD OF LOCALSTORAGE. LOCALSTORAGE BECOMES OUTDATED WHEN USER EDITS INFO !
const memoryFieldNames_global = [
    "Όνομα:","Επώνυμο:","Ημερομηνία Γέννησης:","Τόπος Γέννησης:","Ψευδώνυμο:", "Γενικότερα:", "Τρέχουσα Διεύθυνση:","Οικογένεια","Επαγγέλματα Μελών Οικογένειας:","Κατοικίδια:","Παιδική Ηλικία:","Διεύθυνση των Παιδικών σας Χρόνων:","Σχολείο:","Έρωτες:", "Πρόσθετες Πληροφορίες:", "media","Σπουδές:","Καριέρα:","Έγγαμος Βίος:","Σύντροφος:","Τέκνα:","Πρόσθετες Πληροφορίες:", "media", "Εγγόνια/Δισέγγονα:", "media", "Αξίες και Ιδανικά:","Κατορθώματα για τα οποία είστε υπερήφανος/-η:","Φαγητά & Αγαπημένες Συνταγές:","Αγαπημένες μυρωδιές:","Αγαπημένες δραστηριότητες:","Αγαπημνένες εποχές:","Αγαπημένες ταινίες/σειρές:", "Αγαπημένες αναμνήσεις:", "Αγαπημένη μουσική:","Χόμπι μου:","Πρόσθετα:","Τι δεν μου αρέσει:","Η ρουτίνα μου:", "media" 
];
var informationColumns = [
    "name", "surname", "dob", "pob", "nickname", "generalinfo", "address", "familynames", "familyoccupations", "pets", "childhoodinfo", "address_childhood", "school_childhood", "lovememories", "memories_childhood_misc", "media_childhood", "studies", "occupations", "marriage", "partnerinfo", "kids", "memories_adulthood_misc", "media_adulthood", "grandchildren", "media_seniority", "values", "achievements", "fav_foods", "fav_scents", "fav_fun", "fav_seasons", "fav_media", "fav_memories", "fav_music", "fav_hobbies", "fav_misc", "leastfav", "routine", "media_misc"
];

const form = document.getElementById('file-form');

document.addEventListener('DOMContentLoaded', () => { 
    //Retrieve user information from localStorage
    info = JSON.parse(localStorage.getItem("userInfo"));
    let token = localStorage.getItem("sessionToken");
    localStorage.removeItem("sessionToken");
    sessionStorage.setItem("sessionToken", token);

    var informationColumns = [
        "name", "surname", "dob", "pob", "nickname", "generalinfo", "address", "familynames", "familyoccupations", "pets", "childhoodinfo", "address_childhood", "school_childhood", "lovememories", "memories_childhood_misc", "media_childhood", "studies", "occupations", "marriage", "partnerinfo", "kids", "memories_adulthood_misc", "media_adulthood", "grandchildren", "media_seniority", "values", "achievements", "fav_foods", "fav_scents", "fav_fun", "fav_seasons", "fav_media", "fav_memories", "fav_music", "fav_hobbies", "fav_misc", "leastfav", "routine", "media_misc"
    ];

    //add settings details
    document.getElementById("handleSpan").innerHTML = "Αναγνωριστικό: "+info.handle;
    document.getElementById("currentEmail").innerHTML = "Τρέχον email: "+info.email;
    if(info.visibility == "private"){
        document.getElementById('radio_private').checked = true;
    }
    else{
        document.getElementById('radio_visible').checked = true;
    }

    // Generate all memory (text & media) storing divs & category dividers dynamically.
    const memoryContainer = document.getElementById("memory-container");
	const memoryFieldNames = [
        "Όνομα:","Επώνυμο:","Ημερομηνία Γέννησης:","Τόπος Γέννησης:","Ψευδώνυμο:", "Γενικότερα:", "Τρέχουσα Διεύθυνση:","Οικογένεια","Επαγγέλματα Μελών Οικογένειας:","Κατοικίδια:","Παιδική Ηλικία:","Διεύθυνση των Παιδικών σας Χρόνων:","Σχολείο:","Έρωτες:", "Πρόσθετες Πληροφορίες:", "media","Σπουδές:","Καριέρα:","Έγγαμος Βίος:","Σύντροφος:","Τέκνα:","Πρόσθετες Πληροφορίες:", "media", "Εγγόνια/Δισέγγονα:", "media", "Αξίες και Ιδανικά:","Κατορθώματα για τα οποία είστε υπερήφανος/-η:","Φαγητά & Αγαπημένες Συνταγές:","Αγαπημένες μυρωδιές:","Αγαπημένες δραστηριότητες:","Αγαπημνένες εποχές:","Αγαπημένες ταινίες/σειρές:", "Αγαπημένες αναμνήσεις:", "Αγαπημένη μουσική:","Χόμπι μου:","Πρόσθετα:","Τι δεν μου αρέσει:","Η ρουτίνα μου:", "media" 
    ];
    const categoryNames = ["—Γενικές Πληροφορίες—", "—Παιδικά Χρόνια—", "—Ενήλικη Ζωή—", "—Μεταγενέστερα Χρόνια—", "—Προσωπικές Προτιμήσεις—", "—Ρουτίνα—"];
    var categoryIndex = 0;
    const divNumber = informationColumns.length; // make as many divs as entries in informationColumns
    let divinfo_index = 0;

    for (let i = 0; i < divNumber; i++) { // dynamic div creation

        //Create and append category dividers
        if(i === 0 || i === 10 || i === 16 || i === 23 || i === 25 || i === 37){
            const categoryLine = document.createElement("div");
            categoryLine.classList.add("category-headers");
            categoryLine.innerText = categoryNames[categoryIndex];
            categoryIndex++;
            memoryContainer.appendChild(categoryLine);
        }

        // memory divs
        if(informationColumns[i].substring(0, 6) != "media_"){ //skip media columns

            let currentIndex = divinfo_index; // local variable otherwise all buttons will have the same index
            
            //Create memory divs
            const memoryBox = document.createElement("div");
            memoryBox.classList.add("memory-box");

            //Heading
            const heading = document.createElement("div");
            heading.classList.add("memory-heading");
            heading.textContent = memoryFieldNames[i];

            //Information inside
            const paragraph = document.createElement("p");
            paragraph.id = `divinfo${currentIndex}`; // give divinfo id + index number (ignores media columns)
            paragraph.dataset.number = i; // give divinfo data-number i for info() update (does not ignore media columns)
            paragraph.textContent = info[informationColumns[i]];

            //Hidden edit buttons
            const editBtn = document.createElement("button");
            editBtn.classList.add("edit-btn");
            editBtn.textContent = "Επεξεργασία";

            //Handle edit buttons logic
            editBtn.addEventListener("click", function (){
                openEditingModal(currentIndex);
            });

            //Read more buttons
            const readMoreBtn = document.createElement("span");
            readMoreBtn.classList.add("read-more-btn");
            readMoreBtn.textContent = "Επέκταση";

            //Handle full text modal logic
            readMoreBtn.addEventListener("click", function (){
                openFullTextModal(i);
            });

            //Increase divinfo_index
            divinfo_index++;

            //Append elements to memoryBox
            memoryBox.appendChild(heading);
            memoryBox.appendChild(paragraph);
            memoryBox.appendChild(editBtn);
            memoryBox.appendChild(readMoreBtn);

            //Append memory div to memory container
            memoryContainer.appendChild(memoryBox);
        } //media columns skipped
        else { //media columns
            const mediaBox = document.createElement("div");
            mediaBox.id = `mediaBox_${i}`;
            mediaBox.classList.add("media-box");

            const uploadBtn = document.createElement("button");
            uploadBtn.classList.add("upload-buttons");
            uploadBtn.innerText = "Μεταφόρτωση Πολυμέσων";
            uploadBtn.onclick = () => fileUpload(informationColumns[i]);

            // Create a container for images
            const imageContainer = document.createElement("div");
            imageContainer.classList.add("image-container");
            imageContainer.setAttribute("data-container", informationColumns[i]);
            imageContainer.style.display = "grid"; // grid by default

            // Check if there are stored images for this mediaBox
            if(informationColumns[i] === "media_childhood" && info["media_childhood"] !== "[]") {
                let imageArray = JSON.parse(info["media_childhood"]);

                for(var imageIndex in imageArray){
                    const img = document.createElement("img");
                    img.src = imageArray[imageIndex];
                    img.classList.add("media-image"); 
                    imageContainer.appendChild(img);
                }
            }
            else if(informationColumns[i] === "media_adulthood" && info["media_adulthood"] !== "[]") {
                let imageArray = JSON.parse(info["media_adulthood"]);

                for(var imageIndex in imageArray){
                    const img = document.createElement("img");
                    img.src = imageArray[imageIndex];
                    img.classList.add("media-image"); 
                    imageContainer.appendChild(img);
                }
            }
            else if(informationColumns[i] === "media_seniority" && info["media_seniority"] !== "[]") {
                let imageArray = JSON.parse(info["media_seniority"]);

                for(var imageIndex in imageArray){
                    const img = document.createElement("img");
                    img.src = imageArray[imageIndex];
                    img.classList.add("media-image"); 
                    imageContainer.appendChild(img);
                }
            }
            else if(informationColumns[i] === "media_misc" && info["media_misc"] !== "[]") {
                let imageArray = JSON.parse(info["media_misc"]);

                for(var imageIndex in imageArray){
                    const img = document.createElement("img");
                    img.src = imageArray[imageIndex];
                    img.classList.add("media-image"); 
                    imageContainer.appendChild(img);
                }
            }
                
            mediaBox.appendChild(imageContainer);
            mediaBox.appendChild(uploadBtn);
            memoryContainer.appendChild(mediaBox);
        }
    }

    //Set user's full name in the menu bar
    document.getElementById("usernameHeader").innerText = info.name +" "+ info.surname;

    //Set profile picture
    if(info.pfp != "-"){
        let pfpImg = document.getElementById("pfpImg");
        pfpImg.src = info.pfp;
    }

    //add prompt to guide and/or questionnaire
    if(info.init === "not_init"){
        document.getElementById("initModal").style.display = "flex"; // Display modal

        //add show class to initModal-Btn after 2 seconds
        setTimeout(function() {
            document.getElementById("initModal-Btn").classList.add("show");
        }, 2000);

        let sessionToken = sessionStorage.getItem("sessionToken");
        let data_name = "init";
        let data_value = "init";
        let updatePacket = {data_name, data_value, sessionToken};
        socket.emit("updateCredentials", updatePacket);
    }

    let currentIndex = 0; // local variable for information input
    // Enter information in their fields
    informationColumns.forEach((data_name, index) => {
        
        if(informationColumns[index].substring(0, 6) != "media_"){ //skip media columns

            // get informationColumns
            const divInfoElement = document.getElementById(`divinfo${currentIndex}`);
            if (divInfoElement) {
                divInfoElement.innerHTML = info[data_name];
            }

            // Increase currentIndex
            currentIndex++;
        }
    });

});

//init modal proceed btn
const initBtn = document.getElementById("initModal-Btn");
initBtn.onclick = function() {
    //close modal
    document.getElementById("initModal").style.display = "none";
    // Open the questionnaire
    openQuestionaire();
}


//questionaire (modal) related code++

const questionnaireBtn = document.getElementById("openQuestionnaireBtn"); // open Q button
const questionnaireModal = document.getElementById("questionnaireModal"); // modal
const questionnaireClose= document.getElementById("closeQModal"); // X button modal
const questionnaireSave = document.getElementById("questionnaireModal-saveButton"); // save button modal

const infoCols = ["dob", "pob", "nickname", "generalinfo", "address", "familynames", "familyoccupations", 
    "pets", "childhoodinfo", "address_childhood", "school_childhood", "lovememories", "memories_childhood_misc", 
    "studies", "occupations", "marriage", "partnerinfo", "kids", "memories_adulthood_misc", 
    "grandchildren", "values", "achievements", "fav_foods", "fav_scents", 
    "fav_fun", "fav_seasons", "fav_media", "fav_memories", "fav_music", "fav_hobbies", "fav_misc", "leastfav", "routine", 
]; // informationColumns without media columns

const questions = [
    "Ποιά είναι η ημερομηνία γέννησης σας;",
    "Και που γεννηθήκατε;",
    "Είχατε κατά τη διάρκεια της ζωής σας κάποιο ψευδώνυμο;",
    "Πείτε μερικές γενικές πληροφορίες για εσάς: ",
    "Ποιά είναι η τωρινή σας διεύθυνση κατοικίας;",
    "Ποιά είναι τα ονόματα της οικογένειας σας; (Γονείς, αδέρφια, ξαδέρφια)",
    "Τι επαγγέλματα είχαν οι γονείς και τα αδέρφια σας; Γράψτε ελεύθερα.",
    "Έχετε/Είχατε ποτέ κατοικίδια; Γράψτε ορισμένα πράγματα γι' αυτά.",
    "Πως θα περιγράφατε συνοπτικά την παιδική σας ηλικία; Ποιές αναμνήσεις θα θέλατε να μοιραστείτε; (Φίλοι, αγαπημένες δραστηριότητες, παιχνίδια κτλ)",
    "Ποια ήταν η διεύθυνση του σπιτιού σας κατά την παιδική σας ηλικία;",
    "Σε ποιά σχολεία πηγαίνατε;",
    "Έχετε κάποιες αναμνήσεις απο τον πρώτο σας έρωτα που θα θέλατε να μοιραστείτε; Γράψτε ελέυθερα.",
    "Εχει μείνει κάτι που θα θέλατε να γράψετε σχέτικα με την παιδική σας ηλικία; Μοιραστείτε το εδώ.",
    "Ποιό ήταν το αντικείμενο των σπουδών σας;",
    "Γράψτε ορισμένα πράγματα για την επαγγελματική σας καριέρα.",
    "Έχετε να καταγράψετε ορισμένες αναμνήσεις η/και πληροφορίες από τον γάμο σας;",
    "Ορισμένες πληροφορίες για τον/την σύζυγο σας; (Ονοματεπώνυμο, επάγγελμα κτλ) Γράψτε ελεύθερα.",
    "Έχετε παιδιά; Σημειώστε όσες πληροφορίες ή αναμνήσεις θέλετε εδω.",
    "Έχετε λοιπές πληροφορίες για την ενήλικη σας ζωή που θα θέλατε να μοιραστείτε;",
    "Έχετε εγγόνια ή και δισέγγονα; Καταγράψτε ορισμένες πληροφορίες ή αναμνήσεις γι'αυτά.",
    "Ποιές είναι οι αξίες και τα πιστεύω σας; Μοιραστείτε τα ελεύθερα.",
    "Υπάρχουν κάποια επιτεύγματα στη ζωή σας που θα θέλατε να μοιραστείτε;",
    "Ποιά είναι τα αγαπημένα σας φαγητά η/και συνταγές;",
    "Έχετε κάποιες αγαπημπένες μυρωδιές; Υπάρχουν μυρωδιές που σας φέρνουν συγκεκριμένες αναμνήσεις;",
    "Ποιοί είναι οι αγαπημένοι τρόποι διασκέδασης σας ή αγαπημένες σας ασχολίες;",
    "Έχετε κάποια αγαπημένη εποχή και αγαπημένο καιρό;",
    "Ποιές είναι οι αγαπημένες ταινίες, σειρές ή προγράμματα;",
    "Εδώ μπορείτε να μοιραστείτε αγαπημένες αναμνήσεις και αυτές που σας σημάδεψαν και δεν μπορείτε να ξεχάσετε με τίποτα:",
    "Τι είδους μουσική σας αρέσει; Ορισμένα τραγούδια που θα θέλατε να μοιραστείτε; Γράψτε ελεύθερα.",
    "Υπάρχει κάποιο άλλο χόμπυ ή ενδιαφέρον σας;",
    "Υπάρχει κάτι που αγαπάτε και δεν μοιραστήκατε ακόμα; Αγαπημένη ώρα της ημέρας, συνήθεια κτλ.",
    "Υπάρχει κάτι που ΔΕΝ σας αρέσει; Μοιραστείτε όσα θέλετε εδω.",
    "Θα θέλατε να περιγράψετε τη ρουτίνα σας;"
  ];
const answers = [];

questionnaireBtn.onclick = openQuestionaire;

function openQuestionaire() {
    questionsContainer.innerHTML = ""; // Clear previous content
    skipMedia = 0;

    for (let i in questions) {
        if(document.getElementById('divinfo'+i) != null){
            const questionDiv = document.createElement("div");
            questionDiv.classList.add("question");
            
            const labelContainer = document.createElement("div");
            labelContainer.classList.add("labelContainer");

            const questionLabel = document.createElement("label");
            questionLabel.textContent = questions[i];
            
            const textArea = document.createElement("textarea");
            textArea.classList.add("questionnaireTextarea");
            textArea.id = `questionnaireAnswer_${i}`;
            let index = parseInt(i, 10);
            textArea.innerText = document.getElementById(`divinfo${index+2}`).innerText;//skip onoma + epwnymo me +2
        
            labelContainer.appendChild(questionLabel);
            questionDiv.appendChild(labelContainer);
            questionDiv.appendChild(textArea);
            questionsContainer.appendChild(questionDiv);
        }
    }

    questionnaireModal.style.display = "flex";
}

questionnaireClose.onclick = function() {
    questionnaireModal.style.display = "none";
}

questionnaireSave.onclick = function() {
    for (let i in questions) {
        
        let index = parseInt(i, 10);
        let answer = document.getElementById(`questionnaireAnswer_${i}`).value;
        document.getElementById(`divinfo${index+2}`).innerText = answer;

        info[infoCols[index]] = answer;
        updateInfo(infoCols[index], answer); //update database
    }

    questionnaireModal.style.display = "none";
}



//"Edit Information Mode" related code++

const editInfoBtn = document.getElementById("editInformationBtn");

var editMode = false;
var defaultBodyColor = window.getComputedStyle(document.body).backgroundColor;//get default <body> color

editInfoBtn.onclick = function() {

    if(editMode){ //if currently in edit mode - back to default mode.
        editMode = false;
        document.body.style.backgroundColor = defaultBodyColor;
        editInfoBtn.style.backgroundColor = "#00bfa5";
        editInfoBtn.innerText = "Λειτουργία Επεξεργασίας";

        // Show images again
        document.querySelectorAll(".image-container").forEach(container => {
            container.style.display = "grid";
        });

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
        editInfoBtn.innerText = "Κλείσιμο Επεξεργασίας";

        // Hide images
        document.querySelectorAll(".image-container").forEach(container => {
            container.style.display = "none";
        });

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
    editedMemory = buttonNumber; //divinfo index number (ignores media columns)
    editingModal_input.value = document.getElementById(`divinfo${buttonNumber}`).innerText; // Set the input field to the current content
    editingModal_header.innerText = memoryFieldNames_global[buttonNumber];
    editingModal.style.display = "block";
}

editingModal_closeBtn.onclick = function() {
    editingModal.style.display = "none"; // Close editing modal
    editingModal_input.value = ""; // Empty input field
    editingModal_header.innerText = ""; // Empty header
    
}

editingModal_saveButton.onclick = function() {
    //change info (localStorage)
    let columnIndex = document.getElementById("divinfo"+editedMemory).dataset.number; // get the data-number of the divinfo element NOT the divinfo index
    info[informationColumns[columnIndex]] = editingModal_input.value;
    console.log("columnIndex: "+columnIndex);
    //update database
    let data_name = informationColumns[columnIndex]; //name of variable that changed
    let data_value = editingModal_input.value; //data of variable that changed
    updateInfo(data_name, data_value); // update database

    //check if memory changed was the first 2 (name, surname) and update the header
    if(editedMemory == 1 || editedMemory == 2){
        document.getElementById("usernameHeader").innerText = info.name +" "+ info.surname;
    }

    editingModal.style.display = "none"; // Close editing modal
    document.getElementById("divinfo"+editedMemory).innerText = editingModal_input.value;
    editedMemory = undefined; //reset which memory is being edited
}

//"Edit Information Mode" related code--

// Settings modal
const settingsModal = document.getElementById("settingsModal");
const settingsClose = document.getElementById("settingsModal-closeBtn");
const settingsSave = document.getElementById("settingsModal-saveBtn");

function openSettingsModal() {
    settingsModal.style.display = "block";
}

settingsClose.onclick = function() {
    settingsModal.style.display = "none";
}

// full text modal (the read more button)
const fullTextModal = document.getElementById("fullTextModal");
const fullTextModal_closeBtn = document.getElementById("fullTextModal-closeBtn");
const fullTextModal_text = document.getElementById("fullTextModal-text");

function openFullTextModal(memoryNumber) {
    fullTextModal_text.innerText = document.getElementById(`divinfo${memoryNumber}`).innerText;
    fullTextModal.style.display = "flex";
}

fullTextModal_closeBtn.onclick = function() {
    fullTextModal.style.display = "none";
}

// open user guide modal
const videoGuideModal = document.getElementById("videoGuideModal");
const videoGuideModalClose = document.getElementById("videoGuideModal-closeBtn");
const video = document.getElementById("videoGuide");

function openUserGuideModal() {
    videoGuideModal.style.display = "flex";
}

videoGuideModalClose.onclick = function() {
    video.pause();
    videoGuideModal.style.display = "none";
}

//update user information in the database
function updateInfo(data_name, data_value) {
    let sessionToken = sessionStorage.getItem("sessionToken");
    let updatePacket = {data_name, data_value, sessionToken};
    socket.emit("updateUserInfo", updatePacket);
}

//update user credentials in the database
function saveSettings() {
    let new_email = document.getElementById("settingsModal-email").value;
    let old_password = document.getElementById("settingsModal-oldPassword").value;
    let new_password = document.getElementById("settingsModal-newPassword").value;

    if(new_email != ""){
        let sessionToken = sessionStorage.getItem("sessionToken");
        let data_name = "email";
        let data_value = new_email;
        let updatePacket = {data_name, data_value, sessionToken};

        socket.emit("updateCredentials", updatePacket);
    }

    if(old_password != "" && new_password != ""){
        let sessionToken = sessionStorage.getItem("sessionToken");
        let data_name = "password";
        let data_value = new_password;
        let updatePacket = {data_name, data_value, old_password, sessionToken};

        socket.emit("updateCredentials", updatePacket);
    }

    const radio_private = document.getElementById('radio_private').checked;
    const radio_visible = document.getElementById('radio_visible').checked;

    if(info.visibility == "private" && radio_visible){
        let sessionToken = sessionStorage.getItem("sessionToken");
        let data_name = "visibility";
        let data_value = "visible";
        let updatePacket = {data_name, data_value, sessionToken};

        socket.emit("updateCredentials", updatePacket);
    }
    else if(info.visibility == "visible" && radio_private){
        let sessionToken = sessionStorage.getItem("sessionToken");
        let data_name = "visibility";
        let data_value = "private";
        let updatePacket = {data_name, data_value, sessionToken};

        socket.emit("updateCredentials", updatePacket);
    }

    logout();
}

// Logout function
function logout() {
    let sessionToken = sessionStorage.getItem("sessionToken");
    socket.emit("logout", sessionToken)
    //remove saved information from the client
    localStorage.removeItem("userInfo");
    //load homepage
    window.open("https://memoralife.onrender.com/", "_self");
}

socket.on("showMessage", function(msg) {
    alert(msg);
});


socket.on("forceLogout", function(sessionToLogout){
    let sessionToken = sessionStorage.getItem("sessionToken");
    
    //console.log both session tokens
    console.log("sessionToken: "+sessionToken);
    console.log("sessionToLogout: "+sessionToLogout);

    if(sessionToken == sessionToLogout){
        alert("Login detected from another browser or device. Logging you out.")
        logout();
    }
});

socket.on("changeImgSrc", function(pfp){
   //update pfp image source
   let pfpImg = document.getElementById("pfpImg");
   pfpImg.src = pfp;
});

window.addEventListener("beforeunload", function () {
    logout();
});

// Profile Pic updating
function changePfp() {
    fileformModal_input.click(); // Opens file explorer

    // Attach mediaIndex to the file input change event so we know where to save the file
    fileformModal_input.onchange = async (event) => {
        const file = event.target.files[0]; // Get the uploaded file
        if (file) {
            // Upload the file directly to Cloudinary
            const fileUrl = await uploadToCloudinary(file);
    
            // Send the file URL to the server using socket.emit
            updatePfp(fileUrl);
        }
    };
}

function updatePfp(fileUrl) {
    let sessionToken = sessionStorage.getItem("sessionToken");
    let updatePacket = {fileUrl, sessionToken};

    // Emit the updateMedia event with the file URL
    socket.emit("updatePfp", updatePacket);
}

// file uploading
const fileFormModal = document.getElementById("fileFormModal");
const fileFormModalCloseBtn = document.getElementById("fileFormModal-closeBtn");
const fileformModal_input = document.getElementById("file");
const fileUploadBtn = document.getElementById("fileUploadBtn");

// File upload function using Cloudinary
function fileUpload(mediaType) {
    fileformModal_input.click(); // Opens file explorer

    // Attach mediaIndex to the file input change event so we know where to save the file
    fileformModal_input.onchange = async (event) => {
        const file = event.target.files[0]; // Get the uploaded file
        if (file) {
            // Upload the file directly to Cloudinary
            const fileUrl = await uploadToCloudinary(file);
    
            // Send the file URL to the server using socket.emit
            sendFileUrlToServer(mediaType, fileUrl);

            // UPDATE LOCAL DISPLAY OF IMAGES:

            // update info image array
            let imageArray = JSON.parse(info[mediaType]);
            imageArray.push(fileUrl);
            info[mediaType] = JSON.stringify(imageArray);

            // clear existing images
            document.querySelector(`[data-container="${mediaType}"]`).innerHTML = "";

            // reappend old and new images
            for(var imageIndex in imageArray){
                const img = document.createElement("img");
                img.src = imageArray[imageIndex];
                img.classList.add("media-image"); 
                document.querySelector(`[data-container="${mediaType}"]`).appendChild(img);
            }
        }
    };
}

// Close modal when clicking the close button
fileFormModalCloseBtn.addEventListener("click", () => {
    fileFormModal.style.display = "none";
});

// Function to send the file URL to the server
const sendFileUrlToServer = (mediaType, fileUrl) => {
    let sessionToken = sessionStorage.getItem("sessionToken");
    let updatePacket = { mediaType, fileUrl, sessionToken };

    // Emit the updateMedia event with the file URL
    socket.emit("updateMedia", updatePacket);
};

// CLOUDINARY++++++

// Handle file upload to Cloudinary
const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_preset_ml"); // Replace with your Cloudinary preset name

    try {
        // Upload file to Cloudinary
        const response = await fetch("https://api.cloudinary.com/v1_1/dbf34ckzm/image/upload", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (response.ok) {
            console.log("File uploaded successfully:", data);
            return data.secure_url; // Return the URL from Cloudinary
        } else {
            console.error("Error uploading file:", data);
        }
    } catch (error) {
        console.error("Error uploading file:", error);
    }
};

// CLOUDINARY------