var player_elem = document.getElementById("player");
var shadow_elem = document.getElementById("shadow");
var background_elem = document.getElementById("background");
var up_elem = document.getElementById("up");

var deltaFrame = 0;
var lastFrame = Date.now();

var boop = new Audio('music/boop.mp3');
boop.volume = .4;
var introVoice = new Audio('music/introvoice.mp3');
introVoice.volume = .4;

function playNextSound() {

}

var player = {pos : {}, velocity: {}};
player.pos.x = 48;
player.pos.y = 48;
player.velocity.x = 0;
player.velocity.y = 0;
player.rotation = 0;
player.rotVelocity = 0;
player.swerveDecay = 0;
player.swerveVelocity = 1;
player.bounces = 0;
player.bounce = function(normal) {
    player.bounces += 1;
    player.rotVelocity *= -1;
    if (player.bounces < 8) {
        //play boop
        boop.play();
        return;
    }
    if (player.bounces == 8) {
        setTimeout(function () {
            //text show "bored now"
            //play voice "bored now"
            introVoice.play();
            //set timeout
            setTimeout(swerveStart,2000);
            //text show "do something New!"
            //play voice "do something New!"
            //unlock swerve
            //set timeout
            //hide text
        }, 2000);
    }
    if (player.bounces > 16) {
        //play next sound
        boop.play();
    }
};
player.borderColor = 'black';
player.collisionRange = 3;
player.collisions = 0;
player.collision = function() {
    player.collisions += 1;
    if (player.collisions == 1) {
        //start music
        //start edge sound queue
        //set timeout
    }
};

var shadow = {pos : {}, velocity: {}};
shadow.pos.x = 48;
shadow.pos.y = 48;
shadow.velocity.x = 0;
shadow.velocity.y = 0;
shadow.opacity = 0;

var up = {pos : {}, velocity: {}};
up.pos.x = 68;
up.pos.y = 48;
up.velocity.x = 0;
up.velocity.y = -60;
up.rotation = 0;
up.rotVelocity = 0;
up.swerveDecay = 0;
up.swerveVelocity = -1;
up.bounces = 0;
up.bounce = function(normal) {
    up.rotVelocity *= -1;
    up.bounces += 1;
};
up.borderColor = 'black';
up.borderSequence = ['green','indigo','orange','purple','yellow','blue','red'];
up.borderIndex = 0;
up.collision = function() {
    collisionTimeout = 500;
    up.swerveDecay = swerveDecay;
    up.borderIndex = (up.borderIndex + 1) % 7;
    up.borderColor = up.borderSequence[up.borderIndex];
    document.body.style.backgroundColor = up.borderColor;
    background_elem.style.color = up.borderSequence[(up.borderIndex + 1) % 7]
    background_elem.style.borderColor = background_elem.style.color;
    background_elem.textContent = player.collisions;
};

var coordSuffix = "vw";

var startVelocity = 60;

var swerveDecay = 500;

var gameStarted = false;
var collisionTimeout = 500;
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

function playerSwerve() {
    if (player.swerveDecay <= 0) {
        player.rotVelocity = 100;
        player.swerveDecay = swerveDecay;
        shadowTrail();
        document.removeEventListener('keydown', playerSwerve);
        document.removeEventListener('mousedown', playerSwerve);
        document.removeEventListener('touchstart', playerSwerve);

        setTimeout(playerReleaseSwerve, 1000);
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
        e.velocity.x += e.velocity.y * e.swerveVelocity * (e.swerveDecay / swerveDecay) * deltaFrame / 1000;
        e.velocity.y -= e.velocity.x * e.swerveVelocity * (e.swerveDecay / swerveDecay) * deltaFrame / 1000;
        e.swerveDecay -= deltaFrame;
    }
    e.pos.x = e.pos.x + (e.velocity.x * deltaFrame / 1000);
    e.pos.y = e.pos.y + (e.velocity.y * deltaFrame / 1000);

    e.rotation = e.rotation + (e.rotVelocity * deltaFrame / 1000);
}

// Bounces player off edges
function entityEdgeDetection(e) {
    if ((e.pos.x < 1) || (e.pos.x > 94.5)) {
        if (e.pos.x < 1) {e.pos.x = 1;} else {e.pos.x = 94.5;}
        e.velocity.x *= -1;
        e.bounce();
    }
    if ((e.pos.y < 1) || (e.pos.y > 94.5)) {
        if (e.pos.y < 1) {e.pos.y = 1;} else {e.pos.y = 94.5;}
        e.velocity.y *= -1;
        e.bounce();
    }
}

// 1up detection
function collisionDetection() {
    if (collisionTimeout > 0) {
        collisionTimeout -= deltaFrame;
        return;
    }
    if (Math.abs(player.pos.x - up.pos.x) < player.collisionRange && Math.abs(player.pos.y - up.pos.y) < player.collisionRange) {
        console.log(Math.abs(player.pos.x - up.pos.x));
        console.log(Math.abs(player.pos.y - up.pos.y));
        player.collision();
        up.collision();
    }
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
    collisionDetection();
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

        collisionDetection();

        if (shadow.opacity > 0) {
            entityMovement(shadow);
        }
    }

    //player.style.borderColor = playerSSTrue ? "red" : "black";
    player_elem.style.left = player.pos.x.toString() + coordSuffix;
    player_elem.style.bottom = player.pos.y.toString() + coordSuffix;
    player_elem.style.transform = "rotate(" + player.rotation.toString() +"deg)";
    player_elem.style.webkitTransform = "rotate(" + player.rotation.toString() +"deg)";
    player_elem.style.borderColor = player.borderColor;

    if (shadow.opacity > 0) {
        shadow_elem.style.left = shadow.pos.x.toString() + coordSuffix;
        shadow_elem.style.bottom = shadow.pos.y.toString() + coordSuffix;
        shadow.opacity -= deltaFrame / 2000;
        shadow_elem.style.opacity = shadow.opacity.toString();
    }

    up_elem.style.left = up.pos.x.toString() + coordSuffix;
    up_elem.style.bottom = up.pos.y.toString() + coordSuffix;
    up_elem.style.borderColor = up_elem.borderColor;

    window.requestAnimationFrame(render);
}
window.requestAnimationFrame(init);