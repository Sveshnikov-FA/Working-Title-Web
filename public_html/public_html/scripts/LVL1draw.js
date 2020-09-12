var controlType = 0, //the controls picked (mouse - 0, arrows - 1, wasd - 2)
    activity = 1, // utility variable to stop particles in place when controls change or on game over screen
    placeholderRate = 0.15, // utility variable to do the spinDown effect for gameOver; rate as in sound rate
    x, // utility for global setinterval variable (bad practice most likely)
    cooldown = 0, pd = 1, song = document.getElementById("audio"); // utility for controlling damage 

//head class for defining particles; all of them are circles, they have according parameters
class Circle {
    constructor(x, y, radius, rgb_string) {
        this.radius = radius;
        this.vx = this.vy = 0; //v stands for velocity as in the direction something is shifted to
        this.x = x;
        this.y = y;
    }
}

class Projectile extends Circle {
    constructor(x, y, radius, i) {
        super(x, y, radius);
        this.i = i;
        this.a = 1;
        this.vx = Math.random() * 0.1 + -(Math.cos(9 * (this.i - 1))); // gets the effect of starting in a single point right
        this.vy = Math.random() * 0.1 + -(Math.sin(9 * (this.i - 1)));
    }

    updatePosition(activ) {
        this.x += this.vx * activ * ((quicktime == 1) ? 5 : 1);
        this.y += this.vy * activ * ((quicktime == 1) ? 5 : 1);
        if (this.x < -50 || this.x > context.canvas.width || this.y < -50 || this.y > context.canvas.height) this.a = 0;
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

    collidecircle_(circle_) {
        let yD = (pointer.y - circle_.y) * (pointer.y - circle_.y); //distance from ball center to projectile center
        let xD = Math.sqrt((pointer.x - circle_.x) * (pointer.x - circle_.x) + yD); // hipottenuse of yDistance and xDistance
        if (xD < (circle_.radius + this.radius)) { //if it's less than both the radius of player and pellet
            circle_.a = 0; //delete projectile
            return 1; //return true so damageTaken can run
        }
    }
}

var context = document.getElementById("canvas").getContext("2d"); //head variable for canvas

var pointer = { //dictionary of mousePosition; starts in middle of screen to prevent bad rendering and starting at a border, thus, changing controls accidentally
    x: context.canvas.width / 2,
    y: context.canvas.height / 2
};

var xShift = 0, // variable of units to move the screen by x-wise
    yShift = 0, // and y-wise
    xshiftKeep = 0, // variable of how far the screen was moved x-wise
    yshiftKeep = 0; //and y-wise

//i say screen, but actually it's just the projectiles; large numbers may be the reason for throttling

var complete = 0; // utility variable to prevent premature pellet spawning

var damageParticles = new Array(), //array of all the objects spawned with their respective properties
    projectiles = new Array();

var PlayerCursor = new Player(pointer.x, pointer.y, Math.floor(10), "rgb(255,255,255)"); // player object init

function shutdown() { // function that runs when life = 0;
    x = setInterval(function () { // spindown effect
        if (placeholderRate > 0) placeholderRate -= .05;
        song.volume = placeholderRate; // see song info in LVL1sound.js
    }, 100);
    document.getElementById("counter").innerHTML = "Game Over"; // repurposing countdown
    document.getElementById("counter").style.opacity = 1; // fade-in
    document.getElementById("btnReset").style.display = "grid"; // it's initially at "none"
    quicktime = 1; // massively speeds up pellets
    setTimeout(function () { // done to account for these less;
        quicktime = 0;
        activity = 0;
    }, 15000);

}

function damageInit(xDa, yDa) { // function that launches when player collides with a pellet
    life -= 7; //global variable that keeps track of life points decreased
    cooldown = 1; // cooldown period
    setTimeout(function () {
        cooldown = 0;
    }, 500);
    document.getElementById("life").style.width = life + "vw"; //changing the element width
    if (life == 0) shutdown(); //launching gameOver screen; could be loaded in separate file with async, idk
    var dmg = new Array(); // spawning damage particles; those are purely cosmetic;
    for (var i = 0; i < 20; ++i) {
        dmg.push(new DamageTaken(xDa, yDa, Math.random() * 2 + 10, i + 1)); //xDa, yDa are saved pointer coordinates
    }
    damageParticles.push(dmg); //pushing the array into the master array
}

function drawPlayer() { // player render function
    context.beginPath();
    context.arc(pointer.x, pointer.y, PlayerCursor.radius, 0, 2 * Math.PI, true);
    context.fillStyle = (cooldown == 0) ? "#00bfff" : "#ffff99";
    context.fill();
    context.closePath();
    requestAnimationFrame(drawPlayer);
}

function resetLevel() { // Used when clicked on "Reset" on game over screen
    document.getElementById("btnReset").style.display = "none";
    countdown();
    setTimeout(function () {
        location.reload();
    }, 3000);
}

function countdown() { // countdown utilized for the controls change mostly
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
    }, 1000); // promises might do this better 
    setTimeout(function () {
        activity = 1;
    }, 3000); // pellets are allowed to move after countdown is done
}

setInterval(function() {
    ++pd;
},60);

function loop_(time_stamp) { // head render function; runs every frame;
    window.requestAnimationFrame(loop_);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); //clearing the frame to re-render

    if (ready == 1 && activity == 1) { // checking if the time is right to start spawning pellets
    try {
        document.getElementById("soundbtn").remove();
    } catch (e) {
        console.log("already done");
    }
        if (song.currentTime > 13.35) {
            complete = 1;
            ++ready;
        }
    }

    if (activateControl == 1) { // checks to see if the first drop has passed already;
        // shifting controls;

        //checks if pellet is near the border of the screen
        xShift = (pointer.x > context.canvas.width - 15 && xshiftKeep > -200) ? -5 : (pointer.x < 10 && xshiftKeep < 200) ? 5 : 0;

        yShift = (pointer.y > context.canvas.height - 15 && yshiftKeep > 0) ? -5 : (pointer.y < 10 && yshiftKeep < 200) ? 5 : 0;

        //updating screen movement vars
        xshiftKeep += xShift;
        yshiftKeep += yShift;

        //if it's far along enough, switch the controls accordingly; we have to check for control type duplication to avoid endless pause and to make sense
        if (pointer.x > context.canvas.width - 10 && xshiftKeep < -180 && controlType != 1 && activity == 1) {
            document.cookie = "ctrl=1;path=/";
            controlType = 1;
            countdown();
        } else if (pointer.x < 10 && xshiftKeep > 180 && controlType != 2 && activity == 1) {
            document.cookie = "ctrl=2;path=/";
            controlType = 2;
            countdown();
        } else if (pointer.y < 10 && yshiftKeep > 180 && controlType != 0 && activity == 1) {
            document.cookie = "ctrl=0;path=/";
            controlType = 0;
            countdown();
        }
    }

    //the pellets spawn when a peak in audio is detected, when it's not counting down, when the time is right, and when game is not over
    if (complete == 1 && pd%16==0 && activity == 1 && quicktime == 0) {
        pd = 1;
        var project = new Array();
        var xP = Math.floor(Math.random() * context.canvas.width),
            yP = Math.floor(Math.random() * context.canvas.height);
        for (var i = 0; i < 40; ++i) {
            project.push(new Projectile(xP, yP, 10, i + 1));
        }
        projectiles.push(project);
    }


    // projectiles render function
    for (var j = 0; j < projectiles.length; ++j) {
        if (projectiles[j].length == 0) {
            projectiles.splice(j, 1); //deleting arrays if they're empty
            --j;
            continue;
        }
        for (var i = projectiles[j].length - 1; i > -1; --i) {
            let SingleProjectile = projectiles[j][i];
            SingleProjectile.updatePosition(activity);
            context.beginPath();
            if (SingleProjectile.a <= 0) projectiles[j].splice(i, 1); //deleting particles if they're  transparent
            SingleProjectile.x += xShift; //moving them along the screen
            SingleProjectile.y += yShift;
            context.arc(SingleProjectile.x, SingleProjectile.y, SingleProjectile.radius, 0, Math.PI * 2);
            context.fillStyle = "#fff";
            context.fill();
            context.closePath();
            //list of conditions for when to NOT check for collision, because otherwise that function loops through every pellet on screen
            if (Math.abs(pointer.x - SingleProjectile.x) > 50 || Math.abs(pointer.y - SingleProjectile.y) > 50 || cooldown == 1) continue;
            if (PlayerCursor.collidecircle_(SingleProjectile) == 1) damageInit(pointer.x, pointer.y);
        }
    }

    //damage particles render
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

//keeping the screen resonsive
function resize(event) {
    context.canvas.height = document.documentElement.clientHeight - 16;
    context.canvas.width = document.documentElement.clientWidth - 16;
    document.getElementById("wasdArrow").style.top = context.canvas.height / 2 + "px";
    document.getElementById("wasdArrow").style.left = "50px";
    document.getElementById("arrwArrow").style.left = (context.canvas.width - 150) + "px";
    document.getElementById("arrwArrow").style.top = context.canvas.height / 2 + "px";
    document.getElementById("mausArrow").style.left = (context.canvas.width / 2 - 50) + "px";
    document.getElementById("mausArrow").style.top = "-10px";
}

//mousemove event handler
function mouseDownMoveUp(event) {
    if (controlType == 0) {
        event.preventDefault();

        var rect = context.canvas.getBoundingClientRect();

        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;


        drawPlayer();
    }

}

// keypress event handler
function keyPress_(event) {
    if (controlType == 1) {
        pointer.y += (event.keyCode == 38) ? -5 : (event.keyCode == 40) ? 5 : 0;
        pointer.x += (event.keyCode == 37) ? -5 : (event.keyCode == 39) ? 5 : 0;
    } else if (controlType == 2) {
        pointer.y += (event.keyCode == 87) ? -5 : (event.keyCode == 83) ? 5 : 0;
        pointer.x += (event.keyCode == 65) ? -5 : (event.keyCode == 68) ? 5 : 0;
    }

}
//stacking all of that together
window.addEventListener("resize", resize);
window.addEventListener("mousemove", mouseDownMoveUp);
window.addEventListener("keydown", keyPress_, false);
resize();
loop_();
