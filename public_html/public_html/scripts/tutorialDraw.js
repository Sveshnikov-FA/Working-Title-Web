class Circle {
    constructor(x, y, radius, rgb_string) {
        this.radius = radius;
        this.vx = this.vy = 0;
    }
}

class Projectile extends Circle {
    constructor(x, y, radius, i) {
        super(x, y, radius);
        this.x = x;
        this.y = y;
        this.i = i;
        this.a = 1;
        this.vx = Math.random() * 0.01 + -(Math.cos(9 * (this.i - 1)));
        this.vy = Math.random() * 0.01 + -(Math.sin(9 * (this.i - 1)));
    }

    updatePosition() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -100 || this.x > context.canvas.width || this.y < -100 || this.y > context.canvas.height) this.a = 0;
    }
}

class DamageTaken extends Circle {
    constructor(x, y, radius, i) {
        super(x, y, radius);
        this.x = x;
        this.y = y;
        this.i = i;
        this.a = 1;
        this.vx = Math.random() * 3 + -(Math.cos(9 * (this.i - 1)));
        this.vy = Math.random() * 3 + -(Math.sin(9 * (this.i - 1)));
    }
    updatePosition() {
        this.x += this.vx;
        this.y += this.vy;
        this.a -= 0.01;
    }
}

class Player extends Circle {
    constructor(x, y, radius, rgb_string) {
        super(x, y, radius, rgb_string);
    }
    update() {
        this.vx *= 0.9;
        this.vy *= 0.9;
    }

    collidecircle_(circle_, index, i) {
        let xD = pointer.x - circle_.x;
        let yD = pointer.y - circle_.y;
        xD *= xD;
        yD *= yD;
        xD = Math.sqrt(xD + yD);
        if (xD < (circle_.radius + this.radius)) {
            circle_.a = 0;
            return 1;
        }
    }
}

class ColorPick {

    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    getRGBString() {
        return String(this.r + "," + this.g + "," + this.b);
    }

    gradualShift_(direction) {
        if (this.r > 250) cnt = 0;
        if (cnt == 0) {
            direction = -0.5;
        }
        if (cnt == 1 || this.r < 220) {
            cnt = 1;
            direction = 0.5;
        }
        this.r = this.g = this.b += direction;
    }

}

var damageParticles = new Array(),
    projectiles = new Array();

var context = document.getElementById("canvas").getContext("2d");
var complete = 0;
var pointer = {
    x: context.width / 2,
    y: context.height / 2,
    down: false
};

var direction = 0,
    cnt = 0,
    stage = 0,
    entry = 0;

var ParticleColor = new ColorPick(250, 250, 250);
var PlayerCursor = new Player(pointer.x, pointer.y, Math.floor(10), ParticleColor.getRGBString());

var xC = -10,
    yC = -5;

setTimeout(function () {
    stage = 1;
    setTimeout(function () {
        stage = 2;
    }, 16000);
}, 20000);

function loop_(time_stamp) {
    window.requestAnimationFrame(loop_);

    function damageInit(xDa, yDa) {
        life -= 2.5;
        document.getElementById("life").style.width = life + "vw";
        if (life == 0) shutdown();
        var dmg = new Array();
        for (var i = 0; i < 40; ++i) {
            dmg.push(new DamageTaken(xDa, yDa, Math.random() * 2 + 10, i + 1));
        }
        damageParticles.push(dmg);
    }

    if (stage > 0 && stage != 7) { //before the right line of dialogue gets through and in the end
        if (entry == 0) {
            damageInit(pointer.x, pointer.y);
            damageInit(pointer.x, pointer.y);
            damageInit(pointer.x, pointer.y);
            entry = 1;
        }

        function drawPlayer() { 
            context.beginPath();
            context.arc(pointer.x, pointer.y, PlayerCursor.radius, 0, 2 * Math.PI, true);
            context.fillStyle = "#00bfff";
            context.fill();
            requestAnimationFrame(drawPlayer);
        }
        drawPlayer();
        PlayerCursor.update();
    }

    for (let index = projectiles.length - 1; index > -1; --index) {
        for (var i = 0; i < projectiles[index].length; ++i)
            if (PlayerCursor.collidecircle_(projectiles[index][i], index, i) == 1) damageInit(pointer.x, pointer.y);
    }
    context.fillStyle = "#00001a";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    direction += 0.01;
    ParticleColor.gradualShift_(direction);
    complete = 1;

    if (stage == 2) {
        var project = new Array(); //launch projectiles on cue
        var xP = context.canvas.width / 2,
            yP = context.canvas.height / 3;
        for (var i = 0; i < 40; ++i) {
            project.push(new Projectile(xP, yP, 10, i + 1));
        }
        projectiles.push(project);
        stage = 3;
        setTimeout(function () {
            stage = 4;
            life = 100;
            document.getElementById("life").style.width = "100vw"; //render life bar
            document.getElementById("life").style.opacity = 1;
            
            for (var j = 0; j < projectiles.length; ++j) { //speed up projectiles
                for (var k = 0; k < projectiles[j].length; ++k) {
                    projectiles[j][k].vx *= 20;
                    projectiles[j][k].vy *= 20;
                }
            }
        }, 4000);
    }

    if (projectiles.length == 0 && stage == 4) stage = 5; //

    if (stage == 5) { //render arrow on cue
        setTimeout(function () {
            if (stage == 5) {
                document.getElementById("arrow").style.opacity = 1;
                stage = 6;
            }
        }, 12000);
    }

    if (pointer.y < 10 && stage == 6) { //fade arrow out
        document.getElementById("arrow").style.opacity = 0;
        stage = 7;

    }

    if (stage == 7) { //redirect to level 1
        setTimeout(function () {
            if (stage == 7) window.location.assign("sound.html");
            stage = 8;
        }, 15000);
    }

    for (var j = 0; j < projectiles.length; ++j) { //preojectile reder loop
        if (projectiles[j].length == 0) {
            projectiles.splice(j, 1);
            --j;
            continue;
        }
        for (var i = projectiles[j].length - 1; i > -1; --i) {
            let SingleProjectile = projectiles[j][i];
            SingleProjectile.updatePosition();
            context.beginPath();
            if (SingleProjectile.a <= 0) projectiles[j].splice(i, 1);
            context.arc(SingleProjectile.x, SingleProjectile.y, SingleProjectile.radius, 0, Math.PI * 2);
            context.fillStyle = "#fff";
            context.fill();
            context.closePath();
        }
    }

    for (var j = 0; j < damageParticles.length; ++j) { //damage render loop
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
            context.arc(singleDmgP.x, singleDmgP.y, singleDmgP.radius, 0, Math.PI * 2);
            context.fillStyle = "rgba(128,128," + (Math.random() * 15 + 240) + "," + singleDmgP.a + ")";
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

    event.preventDefault();

    var rect = context.canvas.getBoundingClientRect();

    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;

    switch (event.type) {

        case "mousedown":
            pointer.down = true;
            break;
        case "mouseup":
            pointer.down = false;

    }

}

window.addEventListener("resize", resize);

window.addEventListener("mousedown", mouseDownMoveUp);
window.addEventListener("mousemove", mouseDownMoveUp);
window.addEventListener("mouseup", mouseDownMoveUp);

resize();
loop_();
