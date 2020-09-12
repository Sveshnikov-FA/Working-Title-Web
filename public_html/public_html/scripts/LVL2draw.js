var activity = 1,
    placeholderRate = 0.15,
    x,
    frame = 0,
    cooldown = 0;

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



document.getElementsByClassName("bubbleDn")[0].addEventListener("mousemove", damageInit);
for (var i = 0; i < document.getElementsByClassName("bit").length; ++i)
    document.getElementsByClassName("bit")[i].addEventListener("mousemove", damageInit);

function shutdown() {
    x = setInterval(function () {
        if (placeholderRate > 0) placeholderRate -= .05;
        song.volume = placeholderRate;
    }, 100);
    quicktime = 1;
    document.getElementsByClassName("bdnCont")[0].innerHTML = 0;
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

var dia = ["H", "i", ".", "_", "H", "o", "w", "_", "a", "r", "e", "_", "y", "o", "u", "_", "d", "o", "i", "n", "g", "?", "_", "S", "o", "r", "r", "y", ",", "I", "'", "v", "e", "_", "b", "e", "e", "n", "_", "v", "e", "r", "y", "_", "s", "t", "u", "p", "i", "d", "_", "l", "a", "t", "e", "l", "y", ".", ".", ".", "."];

//Random keys pop up
function keysPopUp() {
    document.getElementById("key").addEventListener("click", damageInit);
    document.getElementById("key").style.left = rndX + "px";
    document.getElementById("key").style.top = rndY + "px";
    if (frame == dia.length) frame = 0;
    document.getElementById("key").innerHTML = dia[frame];
    rndX = Math.random() * (context.canvas.width - 200) + 100;
    rndY = Math.random() * (context.canvas.height - 200) + 100;
    document.getElementById("ghostKey").style.left = rndX + "px";
    document.getElementById("ghostKey").style.top = rndY + "px";
    ++frame;
    if (frame == dia.length) frame = 0;
}

function messageToSide() {
    var newMsg = document.getElementsByClassName("bubble")[0].cloneNode(true);
    newMsg.style.top = (context.canvas.height / 2 - 450) + Math.random() * 900 + "px";
    newMsg.addEventListener("click", damageInit);
    if ((Math.floor(Math.random() * 2)) == 1) newMsg.style.transform = "rotateY(180deg)";
    document.body.appendChild(newMsg);
    setTimeout(function () {
        document.getElementsByClassName("bubble")[0].remove();
    }, 10000);
}

function messagesDown() {
    if (stageLvl > 4 && quicktime == 0 && (song.currentTime < 160 || song.currentTime > 230)) return;
    var newMsgDn = document.getElementsByClassName("bubbleDn")[0].cloneNode(true);
    document.body.appendChild(newMsgDn);
    var newnew = document.getElementsByClassName("bubbleDn")[document.getElementsByClassName("bubbleDn").length - 1];
    newnew.style.top = "-20vh";
    newnew.style.left = "50vw";
    newnew.addEventListener("click", damageInit);
    newMsgDn.style.transition = "10s";
    setTimeout(function () {
        newnew.style.left = (Math.random() * 200 - 100) + "vw";
        newnew.style.top = "160vh";
        setTimeout(function () {
            newnew.remove();
        }, 10000);
    }, 10000);
}

function winPopup() {
    for (var i = 0; i < document.getElementsByClassName("window").length; ++i) {
        document.getElementsByClassName("window")[i].style.animation = "none";
        document.getElementsByClassName("window")[i].offsetHeight;
    }
    for (var i = 0; i < document.getElementsByClassName("window").length; ++i)
        document.getElementsByClassName("window")[i].style.animation = "openUp calc(0.25s*var(--i)) linear 4 alternate";
}

function flowerBloom() {
    document.getElementsByClassName("absoluteCont")[0].style.display = "block";
    document.getElementsByClassName("absoluteCont")[0].style.animation = "flowDown 9s 16s ease-in-out forwards";
    for (var i = 0; i < document.getElementsByClassName("bitCont").length; ++i) {
        document.getElementsByClassName("bitCont")[i].style.animation = "bitGrow 3s ease-out forwards, BGTw calc(var(--i)/5 * 5s) 3s ease infinite alternate";
        document.getElementsByClassName("bit")[i].style.animation = "bitBlowUp 3s ease-in-out forwards, flowOut 12s 16s ease-in-out forwards";
        document.getElementsByClassName("bitBtm")[i].style.animation = "bitRotationCorr 3s ease-out forwards, BRCTw calc(var(--i)/5 * 5s) 3s ease infinite alternate";
        document.getElementsByClassName("stemDbl")[i].style.animation = "bitXShift 2.9s ease-in forwards";
        document.getElementsByClassName("stem")[i].style.animation = "flowerAppear 2.3s .25s ease-in forwards, FATw calc(var(--i)/5 * 5s) 3s ease infinite alternate";
    }
}

function sysShutDown() {
    document.getElementById("lTxt").innerHTML = "Shutting down...";
    document.getElementById("body").style.display = "grid";
    setTimeout(function () {
        stage[3] = 1;
        window.location.assign("popupScreenTable.html");
    }, 3000);
}


var Its, Its1, Its2;

function loop_() {
    window.requestAnimationFrame(loop_);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    if (ready == 1) {
        switch (stageLvl) {
            case 1:
                document.getElementById("body").style.display = "none";
                if (checked[0] == 0) {
                    ++checked[0];
                    try {
                    if (song.currentTime > 1) document.getElementById("soundBtn").remove();
                    } catch (e) {
                        console.log("already done");
                    }
                    Its = setInterval(keysPopUp, 400);
                }
                break;

            case 2:
                if (checked[1] == 0) {
                    setTimeout(function () {
                        clearInterval(Its);
                        document.getElementById("key").style.display = "none";
                        document.getElementById("ghostKey").style.display = "none";
                    }, 3000);
                    ++checked[1];
                    document.getElementsByClassName("bubble")[0].style.animation = "msgFl 10s ease-in";
                    Its1 = setInterval(messageToSide, 300);
                }
                break;

            case 3:
                if (checked[2] == 0) {
                    ++checked[2];
                    checked[3] = 0;
                    document.getElementById("key").style.display = "none";
                    document.getElementById("ghostKey").style.display = "none";
                    Its2 = setInterval(messagesDown, 400);
                    setTimeout(function () {
                        clearInterval(Its1);
                    }, 2000);
                }
                break;

            case 4:
                if (checked[3] == 0) {
                    checked[2] = 0;
                    ++checked[3];
                    winPopup();
                }
                break;
            case 5:
                if (checked[4] == 0) {
                    ++checked[4];
                    checked[2] = 0;
                    clearInterval(Its2);
                    setTimeout(flowerBloom, 10000);
                }
                break;
            case 6:
                if (checked[5] == 0) {
                    ++checked[5];
                    setTimeout(function () {
                        document.getElementsByClassName("absoluteCont")[0].style.display = "none";
                    }, 2000);
                    document.getElementById("key").style.display = "grid";
                    document.getElementById("ghostKey").style.display = "grid";
                    for (var i = 0; i < 10; ++i) {
                        setTimeout(keysPopUp, 700);
                        setTimeout(keysPopUp, 700);
                        setTimeout(keysPopUp, 700);
                        setTimeout(keysPopUp, 2400);
                    }
                }

                break;
            case 7:
                sysShutDown();
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
