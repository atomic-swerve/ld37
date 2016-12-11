var player = document.getElementById("player");
var background = document.getElementById("background");
var score = document.getElementById("score");

var deltaFrame = 0;
var lastFrame = Date.now();

var playerPos = {};
playerPos.x = 48;
playerPos.y = 48;

var coordSuffix = "vw";

var playerVelocity = {};
playerVelocity.x = 0;
playerVelocity.y = 0;

var startVelocity = 60;

var swerveDecay = 250;
var currSwerveDecay = 250;

var playerRotationVelocity = 10;

var playerStunned = true;

var combo = 0;

var gameWon = false;


// On any key, mouse, touch
function playerInputStart(e) {
    if (playerStunned) {
        playerStart();
        document.removeEventListener('keydown',playerInputStart);
        document.removeEventListener('mousedown',playerInputStart);
        document.removeEventListener('touchstart',playerInputStart);
        document.addEventListener('keydown',playerInputSwerve);
        document.addEventListener('mousedown',playerInputSwerve);
        document.addEventListener('touchstart',playerInputSwerve);
    }
}
document.addEventListener('keydown',playerInputStart);
document.addEventListener('mousedown',playerInputStart);
document.addEventListener('touchstart',playerInputStart);

// Starts movement
function playerStart() {
    playerStunned = false;
    playerVelocity.y = startVelocity;
}

// Swerve
function playerInputSwerve() {
    if (currSwerveDecay <= 0) {
        currSwerveDecay = swerveDecay;
        combo += 1;
    }
}

// Called every frame to move player
function playerMovement() {
    if (currSwerveDecay > 0) {
        playerVelocity.x +=  playerVelocity.y * playerRotationVelocity * (currSwerveDecay / swerveDecay) * deltaFrame / 1000;
        playerVelocity.y += -playerVelocity.x * playerRotationVelocity * (currSwerveDecay / swerveDecay) * deltaFrame / 1000;
        currSwerveDecay -= deltaFrame;
    }
    playerPos.x = playerPos.x + (playerVelocity.x * deltaFrame / 1000);
    playerPos.y = playerPos.y + (playerVelocity.y * deltaFrame / 1000);
}

// Bounces player off edges
function playerEdgeDetection() {
    if ((playerPos.x < 1) || (playerPos.x > 94.5)) {
        if (playerPos.x < 1) {playerPos.x = 1;} else {playerPos.x = 94.5;}
        playerVelocity.x = playerVelocity.x * -1;
    }
    if ((playerPos.y < 1) || (playerPos.y > 94.5)) {
        if (playerPos.y < 1) {playerPos.y = 1;} else {playerPos.y = 94.5;}
        playerVelocity.y = playerVelocity.y * -1;
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
    window.requestAnimationFrame(render);
}

function render(timestamp) {
    deltaFrame = timestamp - lastFrame;
    lastFrame = timestamp;

    playerEdgeDetection();
    playerMovement();

    //player.style.borderColor = playerSSTrue ? "red" : "black";
    player.style.left = playerPos.x.toString() + coordSuffix;
    player.style.bottom = playerPos.y.toString() + coordSuffix;

    score.innerHTML = combo;
    window.requestAnimationFrame(render);
}
window.requestAnimationFrame(init);