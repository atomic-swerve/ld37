var player_elem = document.getElementById("player");
var shadow_elem = document.getElementById("shadow");
var background_elem = document.getElementById("background");
var up_elem = document.getElementById("up");
var score_elem = document.getElementById("score");

var deltaFrame = 0;
var lastFrame = Date.now();

var player = {pos : {}, velocity: {}};
player.pos.x = 48;
player.pos.y = 48;
player.velocity.x = 0;
player.velocity.y = 0;
player.swerveDecay = 0;
player.bounces = 0;
player.bounce = function(normal) {
    player.bounces += 1;
    if (player.bounces < 8) {
        //play sound
        return;
    }
    if (player.bounces == 8) {
        setTimeout(function () {
            //play voice
            //set timeout
            //play voice
            //unlock swerve
            swerveStart();
        }, 2000);
    }
};
player.collision = function() {

};

var shadow = {pos : {}, velocity: {}};
shadow.pos.x = 48;
shadow.pos.y = 48;
shadow.velocity.x = 0;
shadow.velocity.y = 0;
shadow.opacity = 0;

var up = {pos : {}, velocity: {}};
up.pos.x = 48;
up.pos.y = 48;
up.velocity.x = 0;
up.velocity.y = 0;
up.swerveDecay = 0;
up.bounces = 0;
up.bounce = function(normal) {
    up.bounces += 1;
    switch(normal) {
        case 1:
            //left side
            background_elem.style.borderLeftColor = up_elem.style.borderLeftColor;
            break;
        case 2:
            //right side
            background_elem.style.borderRightColor = up_elem.style.borderRightColor;
            break;
        case 3:
            //top side
            background_elem.style.borderTopColor = up_elem.style.borderTopColor;
            break;
        case 4:
            //bottom side
            background_elem.style.borderBottomColor = up_elem.style.borderBottomColor;
            break;
    }
};

var coordSuffix = "vw";

var startVelocity = 60;

var swerveDecay = 500;

var swerveVelocity = 1;

var combo = 0;

var gameStarted = false;
var gameWon = false;


// On any key, mouse, touch
function gameStart() {
    document.removeEventListener('keydown',gameStart);
    document.removeEventListener('mousedown',gameStart);
    document.removeEventListener('touchstart',gameStart);
    //Play sound
    setTimeout(function() {
        gameStarted = true;
        player.velocity.y = startVelocity;
    },2000);
}

document.addEventListener('keydown',gameStart);
document.addEventListener('mousedown',gameStart);
document.addEventListener('touchstart',gameStart);

function swerveStart() {
    document.addEventListener('keydown',playerSwerve);
    document.addEventListener('mousedown',playerSwerve);
    document.addEventListener('touchstart',playerSwerve);
}

// Swerve
function playerSwerve() {
    if (player.swerveDecay <= 0) {
        shadowTrail();
        player.swerveDecay = swerveDecay;
        combo += 1;
        document.removeEventListener('keydown',playerSwerve);
        document.removeEventListener('mousedown',playerSwerve);
        document.removeEventListener('touchstart',playerSwerve);

        setTimeout(playerReleaseSwerve,2000);
    }
}

function shadowTrail() {
    shadow.pos.x = player.pos.x;
    shadow.pos.y = player.pos.y;
    shadow.velocity.x = player.velocity.x;
    shadow.velocity.y = player.velocity.y;
    shadow.opacity = .5;

}

function playerReleaseSwerve() {
    player.swerveDecay = 0;

    swerveStart();
}

// Called every frame to move player
function entityMovement(e) {
    if (e.swerveDecay > 0) {
        e.velocity.x += e.velocity.y * swerveVelocity * (e.swerveDecay / swerveDecay) * deltaFrame / 1000;
        e.velocity.y -= e.velocity.x * swerveVelocity * (e.swerveDecay / swerveDecay) * deltaFrame / 1000;
        e.swerveDecay -= deltaFrame;
    }
    e.pos.x = e.pos.x + (e.velocity.x * deltaFrame / 1000);
    e.pos.y = e.pos.y + (e.velocity.y * deltaFrame / 1000);
}

// Bounces player off edges
function entityEdgeDetection(e) {
    if ((e.pos.x < 1) || (e.pos.x > 94.5)) {
        if (e.pos.x < 1) {e.pos.x = 1;} else {e.pos.x = 94.5;}
        e.velocity.x = e.velocity.x * -1;
        e.bounce();
    }
    if ((e.pos.y < 1) || (e.pos.y > 94.5)) {
        if (e.pos.y < 1) {e.pos.y = 1;} else {e.pos.y = 94.5;}
        e.velocity.y = e.velocity.y * -1;
        e.bounce();
    }
}

// 1up detection
function collisionDetection() {

}

// Recalculate width/height based on portrait/landscape
function calcWindow() {
    if (window.innerHeight > window.innerWidth) {
        coordSuffix = "vw";
    }
    else {
        coordSuffix = "vh";
    }
}
window.addEventListener('resize', calcWindow);

// Init and Render use Performance.now() for deltaTime from requestAnimationFrame
function init(timestamp) {
    lastFrame = timestamp;
    calcWindow();
    window.requestAnimationFrame(render);
}

function render(timestamp) {
    deltaFrame = timestamp - lastFrame;
    lastFrame = timestamp;

    if (gameStarted) {
        entityEdgeDetection(player);
        entityMovement(player);

        entityEdgeDetection(up);
        entityMovement(up);

        if (shadow.opacity > 0) {
            entityMovement(shadow);
        }
    }

    //player.style.borderColor = playerSSTrue ? "red" : "black";
    player_elem.style.left = player.pos.x.toString() + coordSuffix;
    player_elem.style.bottom = player.pos.y.toString() + coordSuffix;

    if (shadow.opacity > 0) {
        shadow_elem.style.left = shadow.pos.x.toString() + coordSuffix;
        shadow_elem.style.bottom = shadow.pos.y.toString() + coordSuffix;
        shadow.opacity -= deltaFrame / 2000;
        shadow_elem.style.opacity = shadow.opacity.toString();
    }

    up_elem.style.left = up.pos.x.toString() + coordSuffix;
    up_elem.style.bottom = up.pos.y.toString() + coordSuffix;

    score_elem.innerHTML = deltaFrame;
    window.requestAnimationFrame(render);
}
window.requestAnimationFrame(init);