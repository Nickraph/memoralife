var socket = io.connect('https://memoralife.onrender.com/');


window.onload = function(){
    var info = JSON.parse(localStorage.getItem("userInfo"));

    if(info.infoCompletion == 0){
        alert("Seems like you are logging in for the first time. Would you like to complete a questionaire?")
    }

    //Enter information in their fields
    document.getElementById("divinfo2").innerHTML = info.name;
    document.getElementById("divinfo3").innerHTML = info.surname;

}

function logout(){
    //remove saved information from the client
    localStorage.removeItem("userInfo");
    //load homepage
    window.open("https://memoralife.onrender.com/", "_self");
}

socket.on("showMessage", function(msg){
    alert(msg);
  });