var socket = io.connect('https://memoralife.onrender.com/');

socket.on("userInfo", function(data){//change username to email in css & index*
    
    if(data.response == "logged"){//if credentials were correct in login check:

        if(data.stayLoggedIn){
            localStorage.setItem("SavedEmail", data.dbData.email);
        }
        else{
            localStorage.setItem("SavedEmail", "");    
        }

        window.open("https://memoralife.onrender.com/profile", "_self");
        //alert("Welcome "+data.dbData.name);
        //save credentials in localStorage or enter them in profile fields directly:
        document.getElementById("divinfo1").innerHTML = "onoma: "+data.dbData.name;

        //test (setting information in fields of profile.html):
        window.onload("memoralife.onrender.com/profile")
        document.getElementById("userdiv").innerHTML = "Welcome, " + data.dbData.name;

    }//"logged"--
    else{//if credentials were incorrect or user's account is inactive:
        alert("Not logged. Server response: "+data.response)
        window.open("https://memoralife.onrender.com/profile", "_self");
        if(data.dbData.infocompletion == 0){alert("No information found. This is your first login.")}
        alert("infocompletion: "+data.dbData.infocompletion);
    }
})//userinfo--

socket.on("showMessage", function(msg){
    alert(msg);
  });