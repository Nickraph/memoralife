var socket = io.connect('https://memoralife.onrender.com/');

var info; // ! USE THIS VARIABLE INSTEAD OF LOCALSTORAGE. LOCALSTORAGE BECOMES OUTDATED WHEN USER EDITS INFO !
const memoryFieldNames_global = [
    "Όνομα:","Επώνυμο:","Ημερομηνία Γέννησης:","Τόπος Γέννησης:","Ψευδώνυμο:","Τρέχουσα Διεύθυνση:","Οικογένεια","Επαγγέλματα Μελών Οικογένειας:","Κατοικίδια:","Παιδική Ηλικία:","Διεύθυνση των Παιδικών σας Χρόνων:","Σχολείο:","Έρωτες:","Πρόσθετες Πληροφορίες:","Σπουδές:","Καριέρα:","Έγγαμος Βίος:","Σύντροφος:","Τέκνα:","Πρόσθετες Πληροφορίες:","Εγγόνια/Δισέγγονα:","Αξίες και Ιδανικά:","Κατορθώματα για τα οποία είστε υπερήφανος/-η:","Φαγητά & Αγαπημένες Συνταγές:","Μυρωδιές & Ήχοι:","Ψυχαγωγία:","Εποχές:","Πολυμέσα:","Μουσική:","Χόμπι και Δραστηριότητες:","Πρόσθετα:","Τι Δεν Σας Αρέσει:","Η ρουτίνα σας:"
];
var informationColumns = [
    "name", "surname", "dob", "pob", "nickname", "generalinfo", "address", "familynames", "familyoccupations", "pets", "childhoodinfo", "address_childhood", "school_childhood", "lovememories", "memories_childhood_misc", "media_childhood", "studies", "occupations", "marriage", "partnerinfo", "kids", "memories_adulthood_misc", "media_adulthood", "grandchildren", "media_seniority", "values", "achievements", "fav_foods", "fav_scents", "fav_fun", "fav_seasons", "fav_media", "fav_memories", "fav_music", "fav_hobbies", "fav_misc", "leastfav", "routine"
];

const form = document.getElementById('file-form');

document.addEventListener('DOMContentLoaded', () => { 
    //Retrieve user information from localStorage
    info = JSON.parse(localStorage.getItem("userInfo"));
    let token = localStorage.getItem("sessionToken");
    localStorage.removeItem("sessionToken");
    sessionStorage.setItem("sessionToken", token);

    var informationColumns = [
        "name", "surname", "dob", "pob", "nickname", "generalinfo", "address", "familynames", "familyoccupations", "pets", "childhoodinfo", "address_childhood", "school_childhood", "lovememories", "memories_childhood_misc", "media_childhood", "studies", "occupations", "marriage", "partnerinfo", "kids", "memories_adulthood_misc", "media_adulthood", "grandchildren", "media_seniority", "values", "achievements", "fav_foods", "fav_scents", "fav_fun", "fav_seasons", "fav_media", "fav_memories", "fav_music", "fav_hobbies", "fav_misc", "leastfav", "routine"
    ];

    //add settings details
    document.getElementById("handleSpan").innerHTML = "Το handle: "+info.handle;
    document.getElementById("currentEmail").innerHTML = "Τρεχόν email: "+info.email;
    if(info.visibility == "private"){
        document.getElementById('radio_private').checked = true;
    }
    else{
        document.getElementById('radio_visible').checked = true;
    }

    // Generate all memory (text & media) storing divs & category dividers dynamically.
    const memoryContainer = document.getElementById("memory-container");
	const memoryFieldNames = [
        "Όνομα:","Επώνυμο:","Ημερομηνία Γέννησης:","Τόπος Γέννησης:","Ψευδώνυμο:", "Γενικότερα", "Τρέχουσα Διεύθυνση:","Οικογένεια","Επαγγέλματα Μελών Οικογένειας:","Κατοικίδια:","Παιδική Ηλικία:","Διεύθυνση των Παιδικών σας Χρόνων:","Σχολείο:","Έρωτες:","Πρόσθετες Πληροφορίες:","Σπουδές:","Καριέρα:","Έγγαμος Βίος:","Σύντροφος:","Τέκνα:","Πρόσθετες Πληροφορίες:","Εγγόνια/Δισέγγονα:","Αξίες και Ιδανικά:","Κατορθώματα για τα οποία είστε υπερήφανος/-η:","Φαγητά & Αγαπημένες Συνταγές:","Αγαπημένες μυρωδιές:","Αγαπημένες δραστηριότητες:","Αγαπημνένες εποχές:","Αγαπημένες ταινίες/σειρές:", "Αγαπημένη μουσική:","Χόμπι μου:","Πρόσθετα:","Τι δεν μου αρέσει:","Η ρουτίνα μου:"
    ];
    const categoryNames = ["—Γενικές Πληροφορίες—", "—Παιδικά Χρόνια—", "—Ενήλικη Ζωή—", "—Μεταγενέστερα Χρόνια—", "—Προσωπικές Προτιμήσεις—", "—Ρουτίνα—"];
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
        paragraph.textContent = info[informationColumns[i]];

        //Hidden edit buttons
        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-btn");
        editBtn.textContent = "Επεξεργασία";

        //Handle edit buttons logic
        editBtn.addEventListener("click", function (){
            openEditingModal(i);
        });

        //Read more buttons
        const readMoreBtn = document.createElement("span");
        readMoreBtn.classList.add("read-more-btn");
        readMoreBtn.textContent = "Επέκταση";

        //Handle full text modal logic
        readMoreBtn.addEventListener("click", function (){
            openFullTextModal(i);
        });

        //Append elements to memoryBox
        memoryBox.appendChild(heading);
        memoryBox.appendChild(paragraph);
        memoryBox.appendChild(editBtn);
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
            mediaBox.id = `mediaBox_${i}`;
            mediaBox.classList.add("media-box");

            const uploadBtn = document.createElement("button");
            uploadBtn.classList.add("upload-buttons");
            uploadBtn.innerText = "Μεταφόρτωση Πολυμέσων";
            uploadBtn.onclick = () => fileUpload(i);

            // Create a container for images
            const imageContainer = document.createElement("div");
            imageContainer.classList.add("image-container");
            imageContainer.style.display = "grid"; // Hidden by default

            // Check if there are stored images for this mediaBox
            if(i === 14 && info["media_childhood"] !== "") {
                const img = document.createElement("img");
                img.src = info["media_childhood"];
                img.classList.add("media-image"); 
                imageContainer.appendChild(img);
            }
            else if(i === 20 && info["media_adulthood"] !== "") {
                const img = document.createElement("img");
                img.src = info["media_adulthood"];
                img.classList.add("media-image"); 
                imageContainer.appendChild(img);
            }
            else if(i === 21 && info["media_seniority"] !== "") {
                const img = document.createElement("img");
                img.src = info["media_seniority"];
                img.classList.add("media-image"); 
                imageContainer.appendChild(img);
            }
            else if(i === 33 && info["media_misc"] !== "") {
                const img = document.createElement("img");
                img.src = info["media_misc"];
                img.classList.add("media-image"); 
                imageContainer.appendChild(img);
            }
                
            mediaBox.appendChild(imageContainer);
            mediaBox.appendChild(uploadBtn);
            memoryContainer.appendChild(mediaBox);
        }
    }

    //Set user's full name in the menu bar
    document.getElementById("usernameHeader").innerText = info.name +" "+ info.surname;

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

    /*/Enter information in their fields
    document.getElementById("divinfo1").innerHTML = info.name;
    document.getElementById("divinfo2").innerHTML = info.surname;*/

    // Enter information in their fields
    informationColumns.forEach((data_name, index) => {
        const divInfoElement = document.getElementById(`divinfo${index + 1}`);
        if (divInfoElement) {
            divInfoElement.innerHTML = info[data_name];
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
const answers = [];

questionnaireBtn.onclick = openQuestionaire;

function openQuestionaire() {

    for (let i in questions) {
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
        textArea.innerText = document.getElementById(`divinfo${index+3}`).innerText;
      
        labelContainer.appendChild(questionLabel);
        questionDiv.appendChild(labelContainer);
        questionDiv.appendChild(textArea);
        questionsContainer.appendChild(questionDiv);
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
        document.getElementById(`divinfo${index+3}`).innerText = answer;
        info[informationColumns[index+2]] = answer;
        updateInfo(informationColumns[index+2], answer); //update database
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
    //change info (localStorage)
    info[informationColumns[editedMemory-1]] = editingModal_input.value;
    //update database
    let data_name = informationColumns[editedMemory-1]; //name of variable that changed
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

window.addEventListener("beforeunload", function () {
    logout();
});

// file uploading
const fileFormModal = document.getElementById("fileFormModal");
const fileFormModalCloseBtn = document.getElementById("fileFormModal-closeBtn");
const fileformModal_input = document.getElementById("file");
const fileUploadBtn = document.getElementById("fileUploadBtn");

// File upload function using Cloudinary
function fileUpload(mediaIndex) {
    fileformModal_input.click(); // Opens file explorer

    // Attach mediaIndex to the file input change event so we know where to save the file
    fileformModal_input.onchange = async (event) => {
        const file = event.target.files[0]; // Get the uploaded file
        if (file) {
            // Upload the file directly to Cloudinary
            const fileUrl = await uploadToCloudinary(file);
    
            // Send the file URL to the server using socket.emit
            sendFileUrlToServer(mediaIndex, fileUrl);
        }
    };
}

// Close modal when clicking the close button
fileFormModalCloseBtn.addEventListener("click", () => {
    fileFormModal.style.display = "none";
});

// Function to send the file URL to the server
const sendFileUrlToServer = (mediaIndex, fileUrl) => {
    let sessionToken = sessionStorage.getItem("sessionToken");
    let updatePacket = { mediaIndex, fileUrl, sessionToken };

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