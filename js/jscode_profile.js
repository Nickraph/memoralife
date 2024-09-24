var socket = io.connect('https://memoralife.onrender.com/');



socket.on("showMessage", function(msg){
    alert(msg);
  });