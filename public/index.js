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
var maxVelocity = 120;

var playerRotationVelocity = 0;

var playerNormals = {};
playerNormals.x = Math.random() * 2 - 1;
playerNormals.y = 1 - Math.abs(playerNormals.x);

var playerStunned = true;

var playerSSRadius = 3;

var combo = 0;
var comboSafe = false;

var gameWon = false;

function jumpInput(e) {
    if (playerStunned) {
        console.log('Start!');
        playerJump();
        return;
    }
    if (playerSSDetection()) {
        console.log('SS!');
        playerSS();
    }
}
document.addEventListener('keydown',jumpInput);
document.addEventListener('mousedown',jumpInput);
document.addEventListener('touchstart',jumpInput);

function playerJump() {
    playerStunned = false;
    playerVelocity.x = playerNormals.x * startVelocity;
    playerVelocity.y = playerNormals.y * startVelocity;
    playerRotationVelocity = playerVelocity.x;
}

function comboSafeStart() {
    comboSafe = true;
}
function comboSafeEnd() {
    comboSafe = false;
}

function playerSS() {
    playerVelocity.x *= 1.1;
    playerVelocity.y *= 1.1;

    if (Math.abs(playerVelocity.x) > maxVelocity) {
        playerVelocity.x = maxVelocity * Math.sign(playerVelocity.x);
    }
    if (Math.abs(playerVelocity.y) > maxVelocity) {
        playerVelocity.y = maxVelocity * Math.sign(playerVelocity.y);
    }

    if (playerNormals[0]) {
        playerVelocity.x *= -1;
    }
    if (playerNormals[1]) {
        playerVelocity.y *= -1;
    }

    combo += 1;

    comboSafeStart();
    setTimeout(function() {comboSafeEnd();},200);
}

function playerMovement() {
    playerPos.x = playerPos.x + (playerVelocity.x * deltaFrame / 1000);
    playerPos.y = playerPos.y + (playerVelocity.y * deltaFrame / 1000);
}

function playerEdgeDetection() {
    if ((playerPos.x < 0 && playerVelocity.x < 0) || (playerPos.x > 96.5 && playerVelocity.x > 0)) {
        if (playerPos.x < 0) {playerPos.x = 0;} else {playerPos.x = 96.5;}
        playerVelocity.x = playerVelocity.x * -1;
    }
    if ((playerPos.y < 0 && playerVelocity.y < 0) || (playerPos.y > 96.5 && playerVelocity.y > 0)) {
        if (playerPos.y < 0) {playerPos.y = 0;} else {playerPos.y = 96.5;}
        playerVelocity.y = playerVelocity.y * -1;
    }
}

function playerSSDetection() {
    playerNormals.x = 0;
    playerNormals.y = 0;

    if ((playerPos.x <= playerSSRadius && playerVelocity.x < 0)) {
        playerNormals.x = 1;
    }
    if ((playerPos.x >= (96.5 - playerSSRadius) && playerVelocity.x > 0)) {
        playerNormals.x = -1;
    }
    if ((playerPos.y <= playerSSRadius && playerVelocity.y < 0)) {
        playerNormals.y = 1;
    }
    if ((playerPos.y >= (96.5 - playerSSRadius) && playerVelocity.y > 0)) {
        playerNormals.y = -1;
    }
    if (playerNormals.x != 0 || playerNormals.y != 0) {
        return true;
    } else {
        return false;
    }
}

function calcWindow() {
    if (window.innerHeight > window.innerWidth) {
        coordSuffix = "vw";
    }
    else {
        coordSuffix = "vh";
    }
}
window.addEventListener('resize', calcWindow);


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