var song, slider, sliderRate, FiveFiveTwo;

function preload() {
    song = loadSound("file.mp3");
}

function setup() {
    createCanvas(300, 300);
    colorMode(HSB);
    angleMode(DEGREES);
    song.play();
    song.setVolume(0.25);
    FiveFiveTwo = new p5.FFT(0,256);
    slider = createSlider(0,1,0.12,0.01);
}

function draw() {
    background(51);
    var spectrum = FiveFiveTwo.analyze();
    noStroke();
    translate(width/2,height/2);
    for(var i = 0;i<spectrum.length;++i) {
        //if(spectrum[i]>245) alert("fukc");
        var angle = map(i,0,spectrum.length,0,600);
        var amp = spectrum[i];
        var r = map(amp,0,256,20,30);
        var x = r * cos(angle);
        var y = r * sin(angle);
        stroke(225,255,255);
        line(0,0,x,y);
    }
    /*var diam = map(vol,0,0.3,10,200);
    fill(255,0,0);
    ellipse(width/2, height/2, diam, diam);
    //console.log(song.currentTime());
    //song.rate(sliderRate.value());
    //song.pan(slider.value());*/
    song.setVolume(0.12);
}
