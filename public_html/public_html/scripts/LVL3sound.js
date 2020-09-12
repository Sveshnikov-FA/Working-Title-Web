var song = document.getElementById("audio"),
    ready = 0, stageLvl = -1, checked=[0,0,0,0,0,0,0];
    ready = 1;
    song.volume = 0.15;
    stageLvl = 0;


setInterval (function() {
    if (song.currentTime > 14) stageLvl = 1;
    //vocals
    if (song.currentTime > 27) stageLvl = 2;
    //drop
    if (song.currentTime > 41) stageLvl = 3;
    //pause - 56, 64
    if (song.currentTime > 58) stageLvl = 3;
    //70 - keys
    if (song.currentTime > 70) stageLvl = 4;
    //100 - drums go out
    if (song.currentTime > 99) stageLvl = 23;
    if (song.currentTime > 100) stageLvl = 5;
    //126 - end 
    if (song.currentTime > 126) stageLvl = 6;

},100);

