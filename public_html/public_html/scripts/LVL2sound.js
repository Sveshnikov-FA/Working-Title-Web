var song = document.getElementById("audio"),ready = 0, stageLvl = 0, checked=[0,0,0,0,0,0];
ready = 1;
song.volume = 0.15;

setInterval(function() {    
    if(song.currentTime> 2) stageLvl = 1;
    if(song.currentTime>23) stageLvl = 2;
    if(song.currentTime>40) stageLvl = 3;
    if(song.currentTime>75) stageLvl = 4;
    if(song.currentTime>78) stageLvl = 3;
    if(song.currentTime>99) stageLvl = 4;
    if(song.currentTime>102) stageLvl = 3;
    if(song.currentTime>113) stageLvl = 5;
    if(song.currentTime>145) stageLvl = 6;
    if(song.currentTime>170) stageLvl = 3;
    if(song.currentTime>197) stageLvl = 4;
    if(song.currentTime>200) stageLvl = 3;
    if(song.currentTime>218.5) stageLvl = 4;
    if(song.currentTime>221) stageLvl = 3;
    if(song.currentTime>230) stageLvl = 7;
},100);

