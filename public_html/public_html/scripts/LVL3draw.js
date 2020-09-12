var activity = 1,
    placeholderRate = 0.15,
    x,
    frame = 0,
    cooldown = 0,
    quicktime = 0;

class Circle {
    constructor(x, y, radius, rgb_string) {
        this.radius = radius;
        this.vx = this.vy = 0;
        this.x = x;
        this.y = y;
    }
}

class DamageTaken extends Circle {
    constructor(x, y, radius, i) {
        super(x, y, radius);
        this.i = i;
        this.a = 1;
        this.vx = Math.random() * 3 + -(Math.cos(9 * (this.i - 1)));
        this.vy = Math.random() * 3 + -(Math.sin(9 * (this.i - 1)));
    }
    updatePosition() {
        this.x += this.vx;
        this.y += this.vy;
        this.a -= 0.05;
    }
}

class Player extends Circle {
    constructor(x, y, radius, rgb_string) {
        super(x, y, radius, rgb_string);
    }
}

var context = document.getElementById("canvas").getContext("2d");

var pointer = {
    x: context.canvas.width / 2,
    y: context.canvas.height / 2
};

var xShift = 0,
    yShift = 0,
    xshiftKeep = 0,
    yshiftKeep = 0;

var rndX = Math.random() * context.canvas.width - 50,
    rndY = Math.random() * context.canvas.height - 50;

var complete = 0;

var damageParticles = new Array();

var PlayerCursor = new Player(pointer.x, pointer.y, Math.floor(10), "rgb(255,255,255)");


function shutdown() {
    document.getElementById("counterContainer").style.zIndex = 50;
    x = setInterval(function () {
        if (placeholderRate > 0) placeholderRate -= .05;
        song.volume = placeholderRate;
    }, 100);
    quicktime = 1;
    document.getElementById("counter").innerHTML = "Game Over";
    document.getElementById("counter").style.opacity = 1;
    document.getElementById("btnReset").style.display = "grid";
    setTimeout(function () {
        quicktime = 0;
        activity = 0;
    }, 15000);

}

function damageInit() {
    if (cooldown == 1) return;
    life -= 10;
    cooldown = 1;
    setTimeout(function () {
        cooldown = 0;
    }, 300);
    document.getElementById("life").style.width = life + "vw";
    if (life == 0) shutdown();
    var dmg = new Array();
    for (var i = 0; i < 20; ++i) {
        dmg.push(new DamageTaken(pointer.x, pointer.y, Math.random() * 2 + 10, i + 1));
    }
    damageParticles.push(dmg);
}

function drawPlayer() {
    context.beginPath();
    context.arc(pointer.x, pointer.y, PlayerCursor.radius, 0, 2 * Math.PI, true);
    context.fillStyle = (cooldown == 0) ? "#00bfff" : "#ffff99";
    context.fill();
    context.closePath();
    requestAnimationFrame(drawPlayer);
}

function resetLevel() {
    document.getElementById("btnReset").style.display = "none";
    countdown();
    setTimeout(function () {
        location.reload();
    }, 3000);
}

function sc(txt) {
    var scissors = document.getElementById(txt);
    //starting x y
    var currLeft = scissors.style.left.split("vw").join("");
    var currTop = scissors.style.top.split("vh").join("");
    //-20 to the left means the scissors are on the left side; 120 - on the right; otherwise check top positions
    var currShift = (currLeft == "-20") ? 0 : (currLeft == "120") ? 2 : (currTop == "-20") ? 1 : 3;
    var Shif_t = 2,
        nextLeft, nextTop;

    //picking random target side
    while (Shif_t == currShift)
        Shif_t = Math.floor(Math.random() * 4);

    //picking according target x y 
    switch (Shif_t) {
        case 0:
            nextLeft = "-20vw";
            nextTop = Math.floor(Math.random() * 80 + 10) + "vh";
            break;
        case 1:
            nextTop = "-20vh";
            nextLeft = Math.floor(Math.random() * 70 + 10) + "vw";
            break;
        case 2:
            nextLeft = "120vw";
            nextTop = Math.floor(Math.random() * 70 + 10) + "vh";
            break;
        case 3:
            nextTop = "120vh";
            nextLeft = Math.floor(Math.random() * 70 + 10) + "vw";
            break;

    }
    //applying according target x y
    scissors.style.left = nextLeft;
    scissors.style.top = nextTop;
    nextLeft.split("vw").join("");
    nextLeft = parseInt(nextLeft);

    nextTop.split("vh").join("");
    nextTop = parseInt(nextTop);
    currLeft = parseInt(currLeft);
    currTop = parseInt(currTop);

    var addAngle = (currShift == 0) ? 90 : (currShift == 1) ? -180 : (currShift == 2 && Shif_t == 0) ? 90 : (currShift == 2 && Shif_t == 1) ? 180 : 0;

    var dAx = nextLeft - currLeft;
    var dAy = nextTop - currTop;
    var dBx = 85;
    var dBy = 0;
    var angle = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy);
    var degree_angle = angle * (180 / Math.PI);
    degree_angle += addAngle;

    scissors.style.transform = "rotateZ(" + degree_angle + "deg)";
}

function sc1() {
    sc("scissors");
}

function sc2() {
    sc("scissors1");
}

function sc3() {
    sc("scissors2");
}

function sc4() {
    sc("scissors3");
}

function sc5() {
    sc("scissors4");
}

function sc6() {
    sc("scissors5");
}

function countdown() {
    var count = document.getElementById("counter");
    count.innerHTML = "3";
    activity = 0;
    count.style.opacity = 1;
    count.style.transform = "scale(0.75)";
    setTimeout(function () {
        count.innerHTML = "2";
        setTimeout(function () {
            count.innerHTML = "1";
            setTimeout(function () {
                count.style.opacity = 0;
                count.style.transform = "scale(1)";
            }, 1000)
        }, 1000);
    }, 1000);
    setTimeout(function () {
        activity = 1;
    }, 3000);
}

function btnsPopUp() {
    var btn = document.getElementById("buttonPop").cloneNode(true);
    btn.style.left = rndX + "px";
    btn.style.top = rndY + "px";
    document.getElementById("buttonPopStock").appendChild(btn);
    rndX = Math.random() * (context.canvas.width - 200) + 100;
    rndY = Math.random() * (context.canvas.height - 200) + 100;
    /*document.getElementById("ghostButton").style.left = rndX + "px";
    document.getElementById("ghostButton").style.top = rndY + "px";*/

}

var Its, Its1, Its2;

function loop_() {
    if (quicktime == 1) return;
    window.requestAnimationFrame(loop_);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    if (ready == 1) {

        switch (stageLvl) {
            case 0:
                if (checked[0] == 0) {
                    ++checked[0];
                    
                    try {
                        if (song.currentTime > 1) document.getElementById("soundBtn").remove();
                    } catch (e) {
                        console.log("already done");
                    }
                    document.getElementsByClassName("hanger1")[0].style.animation = " hanger1float 30s ease-in-out forwards";
                    document.getElementsByClassName("hanger2")[0].style.animation = " hanger2float 30s ease-in-out forwards";
                }
                break;

            case 1:
                if (checked[1] == 0) {
                    ++checked[1];
                    Its = setInterval(btnsPopUp, 900);
                }
                break;

            case 2:
                if (checked[2] == 0) {
                    ++checked[2];
                    clearInterval(Its);
                    document.getElementById("buttonPopStock").style.left = "120vw";
                    setTimeout(function () {
                        document.getElementById("buttonPopStock").innerHTML = "";
                    }, 5000);
                    Its1 = setInterval(function () {
                        document.getElementsByClassName("hanger1")[0].style.animation = "";
                        document.getElementsByClassName("hanger2")[0].style.animation = "";
                        document.getElementsByClassName("hanger1")[0].offsetHeight;
                        document.getElementsByClassName("hanger2")[0].offsetHeight;
                        document.getElementsByClassName("hanger1")[0].style.animation = " hanger1float 3s ease-in-out forwards";
                        document.getElementsByClassName("hanger2")[0].style.animation = " hanger2float 3s ease-in-out forwards";
                    }, 3000);
                }
                break;

            case 3:
                clearInterval(Its1);
                if (checked[3] == 0) {
                    ++checked[3];
                    Its2 = setInterval(function () {
                        document.getElementById("comb").style.animation = "comb 3.5s ease infinite alternate";
                        document.getElementById("comb1").style.animation = "comb1 3.5s ease infinite alternate";
                    }, 1500);
                }
                break;
            case 4:
                clearInterval(Its2);
                if (checked[4] == 0) {
                    ++checked[4];

                    clearInterval(Its2);
                    document.getElementById("comb").offsetHeight;
                    document.getElementById("comb1").offsetHeight;
                    document.getElementById("comb").style.animation = "";
                    document.getElementById("comb1").style.animation = "";
                    Its = setInterval(function () {
                        if (stageLvl != 4) return;
                        sc1();
                        sc2();
                        sc3();
                        sc4();
                        sc5();
                        sc6();
                    }, 1500);
                }
                break;
            case 5:

                clearInterval(Its);
                if (checked[5] == 0) {
                    ++checked[5];
                    clearInterval(Its);
                    document.getElementsByClassName("hanger1")[0].style.animation = "";
                    document.getElementsByClassName("hanger2")[0].style.animation = "";
                    document.getElementsByClassName("hanger1")[0].offsetHeight;
                    document.getElementsByClassName("hanger2")[0].offsetHeight;
                    document.getElementsByClassName("hanger1")[0].style.animation = " hanger1float 30s ease-in-out forwards";
                    document.getElementsByClassName("hanger2")[0].style.animation = " hanger2float 30s ease-in-out forwards";
                }
                break;
            case 6:
                if (checked[6] == 0) {
                    ++checked[6];
                    stage[4] = 1;
                    setTimeout(function () {
                        window.location.assign("popupScreenCloset.html");
                    }, 2500);
                }
                break;

        }
    }

    drawPlayer();

    for (var j = 0; j < damageParticles.length; ++j) {
        if (damageParticles[j].length == 0) {
            damageParticles.splice(j, 1);
            --j;
            continue;
        }
        for (var i = damageParticles[j].length - 1; i > -1; --i) {
            let singleDmgP = damageParticles[j][i];
            singleDmgP.updatePosition();
            context.beginPath();
            if (singleDmgP.a <= 0) damageParticles[j].splice(i, 1);
            singleDmgP.x += xShift;
            singleDmgP.y += yShift;
            context.arc(singleDmgP.x, singleDmgP.y, singleDmgP.radius, 0, Math.PI * 2);
            context.fillStyle = "rgba(128,128," + (Math.random() * 85 + 155) + "," + singleDmgP.a + ")";
            context.fill();
            context.closePath();
        }
    }
}


function resize(event) {
    context.canvas.height = document.documentElement.clientHeight - 16;
    context.canvas.width = document.documentElement.clientWidth - 16;
}

function mouseDownMoveUp(event) {
    if (controlType == 0) {
        event.preventDefault();

        var rect = context.canvas.getBoundingClientRect();

        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;


        drawPlayer();
    }

}

function keyPress_(event) {
    if (controlType == 1) {
        pointer.y += (event.keyCode == 38) ? -5 : (event.keyCode == 40) ? 5 : 0;
        pointer.x += (event.keyCode == 37) ? -5 : (event.keyCode == 39) ? 5 : 0;
    } else if (controlType == 2) {
        pointer.y += (event.keyCode == 87) ? -5 : (event.keyCode == 83) ? 5 : 0;
        pointer.x += (event.keyCode == 65) ? -5 : (event.keyCode == 68) ? 5 : 0;
    }
}

window.addEventListener("resize", resize);
window.addEventListener("mousemove", mouseDownMoveUp);
window.addEventListener("keydown", keyPress_, false);
resize();
loop_();
