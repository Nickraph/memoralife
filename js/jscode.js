

window.onload() = function(){
    if(localStorage.getItem("rememberUsername")){
        //username placeholder = localStorage.getItem("SavedUsername");
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