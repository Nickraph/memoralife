var socket = io.connect('https://memoralife.onrender.com/');

var info;
const memoryFieldNames_global = [
    "First name:","Last name:","Date of birth:","Place of birth:","Nickname:","Current address:","Family","Family's occupations:","Pets:","Childhood:","Childhood address:","School:","Love:","Additional notes:","Studies:","Career:","Marriage:","Partner:","Children:","Additional notes:","Grandchildren:","Values:","Achievements:","Foods & Recipes:","Scents:","Entertainment:","Season:","Media:","Music:","Hobbies:","Additional:","Dislikes:","Routine:"
];
var informationColumns = [
    "name", "surname", "dob", "pob", "nickname", "generalinfo", "address", "familynames", "familyoccupations", "pets", "childhoodinfo", "address_childhood", "school_childhood", "lovememories", "memories_childhood_misc", "media_childhood", "studies", "occupations", "marriage", "partnerinfo", "kids", "memories_adulthood_misc", "grandchildren", "media_seniority", "values", "achievements", "fav_foods", "fav_scents", "fav_fun", "fav_seasons", "fav_media", "fav_memories", "fav_music", "fav_hobbies", "fav_misc", "leastfav", "routine"
];

document.addEventListener('DOMContentLoaded', () => { 
    //Retrieve user information from localStorage
    info = JSON.parse(localStorage.getItem("searchInfo"));

    var informationColumns = [
        "name", "surname", "dob", "pob", "nickname", "generalinfo", "address", "familynames", "familyoccupations", "pets", "childhoodinfo", "address_childhood", "school_childhood", "lovememories", "memories_childhood_misc", "media_childhood", "studies", "occupations", "marriage", "partnerinfo", "kids", "memories_adulthood_misc", "grandchildren", "media_seniority", "values", "achievements", "fav_foods", "fav_scents", "fav_fun", "fav_seasons", "fav_media", "fav_memories", "fav_music", "fav_hobbies", "fav_misc", "leastfav", "routine"
    ];

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
        paragraph.textContent = info[informationColumns[i]];

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

    // Enter information in their fields
    informationColumns.forEach((data_name, index) => {
        const divInfoElement = document.getElementById(`divinfo${index + 1}`);
        if (divInfoElement) {
            divInfoElement.innerHTML = info[data_name];
        }
    });
});

// Clear the data when the window is about to close
window.addEventListener('beforeunload', function() {
    localStorage.removeItem("searchInfo");
});

socket.on("showMessage", function(msg) {
    alert(msg);
  });