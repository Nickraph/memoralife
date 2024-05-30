var socket = io.connect('https://memoralife.onrender.com/');

window.onload = function(){
    if(localStorage.getItem("rememberEmail")){
        document.getElementById("email_field").value = localStorage.getItem("SavedEmail");
    }
}

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

function submitSignupInfo(){
    var email = document.getElementById("su_email_field").value.trim();
    var password = document.getElementById("su_password_field").value;

    if(email != "" && password != ""){
        socket.emit("attemptSignup", {email, password});
    }
    else{
        alert("Τα πεδία username και password δεν μπορούν να είναι κενά.")
    }
}

socket.on("userInfo", function(data){//change username to email in css & index*
    
    if(data.response == "logged"){//if credentials were correct in login check:

        if(data.stayLoggedIn){
            localStorage.setItem("SavedEmail", data.dbData.email);
        }
        else{
            localStorage.setItem("SavedEmail", "");    
        }

        alert("Welcome "+data.dbData.name);
        //save credentials in localStorage or enter them in profile fields directly

    }//"logged"--
    else{//if credentials were incorrect or user's account is inactive:
        alert("Not logged. Server response: "+data.response)
    }
})//userinfo--

socket.on("showMessage", function(msg){
    alert(msg);
  });