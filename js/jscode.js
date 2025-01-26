var socket = io.connect('https://memoralife.onrender.com/');

window.onload = function(){
    if(localStorage.getItem("rememberMe")){
        document.getElementById("email_field").value = localStorage.getItem("SavedEmail");
        document.getElementById("rememberMe-checkbox").checked = true;
    }
}

//var modalState = "login";

function submitCredentials(){
    var email = document.getElementById("email_field").value.trim();
    var password = document.getElementById("password_field").value;
    //var stayLoggedCheck = document.getElementById("stayLogged_checkbox").value;

    if(email != "" && password != ""){
        socket.emit("attemptLogin", {email, password});
    }
    else{
        alert("Τα πεδία username και password δεν μπορούν να είναι κενά.")
    }
}

function testFunction(){
    alert("kk");
}

function submitSignupInfo(){
    var email = document.getElementById("su_email_field").value.trim();
    var password = document.getElementById("su_password_field").value;
    var firstname = document.getElementById("su_firstname_field").value.trim();
    var lastname = document.getElementById("su_lastname_field").value.trim();

    if(email != "" && password.length >= 8 && password.length <= 20){
        socket.emit("attemptSignup", {email, password, firstname, lastname});
    }
    else{
        alert("Προσθέστε ένα έγκυρο email και έναν κωδικό μεταξύ 8 και 20 χαρακτήρων.");
    }
}

/*
function switchModal(){
    if(modalState=="login"){
        document.getElementById("loginModal").style.display = "none";
        document.getElementById("signupModal").style.display = "block";
        modalState = "signup";
    }
    else{
        document.getElementById("signupModal").style.display = "none";
        document.getElementById("loginModal").style.display = "block";
        modalState = "login";
    }
}*/

function searchUser(){
    let handle = document.getElementById("searchUser_field").value;
    socket.emit("searchUser", handle);
}

socket.on("confirmLogin", function(data){//change username to email in css & index*
    var infodata = data.userInfo;
    
    if(infodata.response == "logged"){//if server verified user credentials:

        let rememberMe = document.getElementById("rememberMe-checkbox").checked;
        // save user's email for next visit
        if(rememberMe){
            localStorage.setItem("rememberEmail", true);
            localStorage.setItem("SavedEmail", infodata.dbData.email);
        }
        else{
            localStorage.setItem("rememberEmail", false);
            localStorage.setItem("SavedEmail", "");
        }

        //save user information in local storage to load them in profile.html
        //if infoCompletion is not complete then
        localStorage.setItem("userInfo", JSON.stringify(infodata.dbData));
        localStorage.setItem("sessionToken", data.accountSessionToken);
        //load profile.html
        window.open("https://memoralife.onrender.com/profile", "_self");
    }
    else{//if credentials were incorrect or user's account is inactive:
        alert("Not logged. Server response: "+infodata.response)
    }
});

socket.on("searchResults", function(data){
    if (data.found){
        //save searched user's data locally
        localStorage.setItem("searchInfo", JSON.stringify(data.dbResults));
        //load profileview.html
        window.open("https://memoralife.onrender.com/profileview", "_self");
    }
    else{
        alert("User doesn't exist or has their profile visibility set to private.")
    }
});

socket.on("saveSessionToken", function(data){
    localStorage.setItem("sessionToken", data);
});

socket.on("showMessage", function(msg){
    alert(msg);
  });