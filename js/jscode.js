var socket = io.connect('https://memoralife.onrender.com/');

window.onload = function(){
    if(localStorage.getItem("rememberEmail")){
        document.getElementById("email_field").value = localStorage.getItem("SavedEmail");
    }
}

var modalState = "login";

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

    if(email != "" && password != ""){
        socket.emit("attemptSignup", {email, password, firstname, lastname});
    }
    else{
        alert("Τα πεδία username και password δεν μπορούν να είναι κενά.")
    }
}

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
}

function searchUser(){
    let handle = document.getElementById("searchUser_field").value;
    socket.emit("searchUser", handle);
}

socket.on("confirmLogin", function(data){//change username to email in css & index*
    
    if(data.response == "logged"){//if server verified user credentials:

        if(data.stayLoggedIn){
            localStorage.setItem("SavedEmail", data.dbData.email);
        }
        else{
            localStorage.setItem("SavedEmail", "");    
        }

        //save user information in local storage to load them in profile.html
        //if infoCompletion is not complete then
        localStorage.setItem("userInfo", JSON.stringify(data.dbData));
        //load profile.html
        window.open("https://memoralife.onrender.com/profile", "_self");
    }
    else{//if credentials were incorrect or user's account is inactive:
        alert("Not logged. Server response: "+data.response)
    }
});

socket.on("searchResults", function(data){
    if (data.found){
        //save searched user's data locally
        localStorage.setItem("searchInfo", JSON.stringify(data.DBinformation));
        //load profileview.html
        window.open("https://memoralife.onrender.com/profileview", "_self");
    }
    else{
        alert("User doesn't exist or has their profile visibility set to private.")
    }
});

socket.on("showMessage", function(msg){
    alert(msg);
  });