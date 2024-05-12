

window.onload() = function(){
    if(localStorage.getItem("rememberUsername")){
        document.getElementById("username_field").value = localStorage.getItem("SavedUsername");
    }
}

function submitCredentials(){
    var username = document.getElementById("username_field");
    var password = document.getElementById("password_field");

    if(username.value != "" && password.value != ""){
        //socket.emit();
    }
    else{
        alert("Τα πεδία username και password δεν μπορούν να είναι κενά.")

        if(username == ""){
            username.style.borderColor = "#FF0000";
        }
        else{
            password.style.borderColor = "#FF0000";
        }
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