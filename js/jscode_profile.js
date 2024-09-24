var socket = io.connect('https://memoralife.onrender.com/');


window.onload = function(){
    var info = JSON.parse(localStorage.getItem("userInfo"));

    //Enter information in their fields
    document.getElementById("divinfo2").innerHTML = info.name;
    document.getElementById("divinfo3").innerHTML = info.surname;

}

socket.on("showMessage", function(msg){
    alert(msg);
  });