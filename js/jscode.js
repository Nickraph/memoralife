var socket = io.connect('https://memoralife.onrender.com/');

window.onload() = function(){
    if(localStorage.getItem("rememberUsername")){
        document.getElementById("username_field").value = localStorage.getItem("SavedUsername");
    }
}

function submitCredentials(){
    var email = document.getElementById("username_field").value.trim();
    var password = document.getElementById("password_field").value;
    //var stayLoggedCheck = document.getElementById("stayLogged_checkbox").value;

    if(email != "" && password != ""){
        socket.emit("attemptLogin", {email, password});
    }
    else{
        alert("Τα πεδία username και password δεν μπορούν να είναι κενά.")
    }
}

socket.on("userInfo", function(data){
    if(data.stayLoggedIn){
        localStorage.setItem("SavedUsername", data.username);
    }
    else{
        localStorage.setItem("SavedUsername", "");    
    }
})

socket.on("showMessage", function(msg){
    alert(msg);
  });