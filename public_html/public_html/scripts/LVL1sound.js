
var song, amp, FiveFiveTwo,
    peakDet,
    ready = 0,
    quicktime = 0,
    activateControl = 0;

song = document.getElementById("audio");
song.volume = 0.15;
ready = 1;


setInterval(function() {
    if ((song.currentTime > 93.0 && song.currentTime < 98) || song.currentTime > 275.0) {
        quicktime = 1;
        setTimeout(function () {
            quicktime = 0;
        }, 5000);
        if (song.currentTime > 93.0 && song.currentTime < 95) {
            document.getElementById("container").style.opacity = 1;
            activateControl = 1;
            life = 100;
        }
    }

    if (song.currentTime>275) {
        setTimeout(function () {
            window.location.assign("popupScreenKeys.html")
        }, 3000);
    }
},1000);
