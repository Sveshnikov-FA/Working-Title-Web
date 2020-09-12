//chat room
var data = [[],[],[]], sel = 0;

// no script room
var stage = [0,0,0,0,0];

var life = 100;
try {
var controlType = (document.cookie.split(";")[7].split("=")[1]);
} catch (e) {
    console.log("cookies not initialized");
}
var chatFlag = 0;