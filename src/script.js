import Ball from './ball.js';
import Bouncer from './bouncer.js';

const ball = new Ball(document.getElementById("ball"));

const playerBouncer = new Bouncer(document.getElementById("player-bouncer"));
const aiBouncer = new Bouncer(document.getElementById("ai-bouncer"));

const playerScoreElm = document.getElementById("player-score");
const aiScoreElm = document.getElementById("ai-score");

document.getElementById("pause-button").style.display = "none";
var sfx = {
    theme: new Howl({
        src: [
            "../assets/theme.mp3"
        ],
        volume: 0.25
    }),

    loss: new Howl({
        src: [
            "../assets/goal.wav"
        ]
    })
}

let lastTime;

let winningScore = 5;

let gamePaused = false;

// Pause Game Function
function pauseGame() {
    gamePaused = true;
    window.cancelAnimationFrame(update);
    document.getElementById("pause-button").style.display = "flex";
    document.getElementById("pause-menu").style.display = "flex";
    sfx.theme.volume(0.1);
    document.getElementById("pause-button").textContent = "Resume";
}

function resumeGame() {
    gamePaused = false;
    document.getElementById("pause-menu").style.display = "none";
    sfx.theme.volume(0.25);
    lastTime = null;
    document.getElementById("pause-button").textContent = "Pause";
    window.requestAnimationFrame(update);
}


// Mute Music Function
function toggleMuteMusic() {
    if (sfx.theme.playing()) {
        sfx.theme.pause();
        document.getElementById("mute-music").textContent = "Unmute Music";
    } else {
        sfx.theme.play();
        document.getElementById("mute-music").textContent = "Mute Music";
    }
}

// Quit Game Function
function quitGame() {
    gamePaused = false;
    document.getElementById("pause-menu").style.display = "none";
    document.getElementById("start-menu").style.display = "flex";
    document.getElementById("pause-button").textContent = "Pause";
    document.getElementById("pause-button").style.display = "none";
    resetGame();
    sfx.theme.stop();
}

// Function to start the game
function startGame() {
    let playerName = document.getElementById("player-name").value.trim();
    playerName = playerName ? playerName : "Player"; // Default to "Player" if no name is entered
    document.getElementById("player-score").setAttribute("data-name", playerName);
    document.getElementById("ai-score").setAttribute("data-name", "AI");
    sfx.theme.play();
    document.getElementById("pause-button").style.display = "flex";
    winningScore = parseInt(document.getElementById("winning-score").value) || 5;
    document.getElementById("start-menu").style.display = "none";
    resetGame();
    window.requestAnimationFrame(update);
}

// Function to reset the game
function resetGame() {
    document.getElementById("pause-button").textContent = "Pause";
    ball.reset();
    playerBouncer.reset();
    aiBouncer.reset();
    playerScoreElm.textContent = 0;
    aiScoreElm.textContent = 0;
    lastTime = null;
}


function update(time){

    if(gamePaused) return;

    if(lastTime != null){
        // convert time to delta
        const delta = time - lastTime;
        ball.update(delta, [playerBouncer.rect(), aiBouncer.rect()]);
        aiBouncer.update(delta, ball.y);

        const hue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hue"));

        document.documentElement.style.setProperty("--hue", hue + delta * 0.1);

        if(isLoser()){
            lossHandler();
        }
    }
    lastTime = time;
    if(!gamePaused){
        window.requestAnimationFrame(update);
    }
    

}

function isLoser() {
    const rect = ball.rect();
    return rect.right >= window.innerWidth || rect.left <= 0;
}

function lossHandler() {
    const rect = ball.rect();
    sfx.loss.play();
    if(rect.right >= window.innerWidth){
        playerScoreElm.textContent = parseInt(playerScoreElm.textContent) +1;
    }else{
        aiScoreElm.textContent = parseInt(aiScoreElm.textContent) +1;
    }

    if (parseInt(playerScoreElm.textContent) >= winningScore || parseInt(aiScoreElm.textContent) >= winningScore) {
        displayWinner(parseInt(playerScoreElm.textContent) >= winningScore ? "Player" : "AI");
        return;
    }

    ball.reset();
    aiBouncer.reset();
}

function displayWinner(winner) {
    gamePaused = true;
    window.cancelAnimationFrame(update);
    sfx.loss.stop();
    // Update the text to show the winner
    document.getElementById("winner-text").textContent = winner + " Wins!";

    // Show the game over menu
    document.getElementById("game-over-menu").style.display = "flex";
    document.getElementById("pause-button").style.display = "none";
}

// Restart Game Function
function restartGame() {
    gamePaused = false;
    lastTime = null;
    sfx.theme.stop();
    document.getElementById("game-over-menu").style.display = "none";
    startGame();
}

// // Main Menu Function
function mainMenu() {
    sfx.theme.stop();
    document.getElementById("game-over-menu").style.display = "none";
    document.getElementById("pause-button").style.display = "none";
    document.getElementById("start-menu").style.display = "flex";
    resetGame();
}

// EVENT LISTENERS

document.addEventListener("mousemove", e => {
    playerBouncer.position = (e.y / window.innerHeight)*100;
})

document.getElementById("resume-game").addEventListener("click", resumeGame);
document.getElementById("mute-music").addEventListener("click", toggleMuteMusic);
document.getElementById("quit-game").addEventListener("click", quitGame);

// escape key pause
document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        if(gamePaused) {
            resumeGame();
        } else {
            pauseGame();
        }
    }
});

// pause button
document.getElementById("pause-button").addEventListener("click", () => {
    // If the game is not paused, pause it; otherwise, resume
    if (!gamePaused) {
        pauseGame();
    } else {
        resumeGame();
    }
});

// game over handling buttons
document.getElementById("restart-game").addEventListener("click", restartGame);
document.getElementById("main-menu").addEventListener("click", mainMenu);

// start game button
document.getElementById("start-form").addEventListener("submit", function(event) {
    event.preventDefault();
    startGame();
});