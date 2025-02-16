var socket = io.connect('https://memoralife.onrender.com/');

var info; // ! USE THIS VARIABLE INSTEAD OF LOCALSTORAGE. LOCALSTORAGE BECOMES OUTDATED WHEN USER EDITS INFO !

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
    document.getElementById("handleSpan").innerHTML = "Αναγνωριστηκό: "+info.handle;
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


socket.on("showMessage", function(msg) {
    alert(msg);
});
