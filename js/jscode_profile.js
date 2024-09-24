var socket = io.connect('https://memoralife.onrender.com/');


window.onload = function(){
    var info = localStorage.getItem("userInfo");

    //Enter information in their fields
    document.getElementById("divinfo2").innerHTML = "onoma: "+info.name;
    document.getElementById("divinfo3").innerHTML = "onoma: "+info.surname;
}

socket.on("showMessage", function(msg){
    alert(msg);
  });