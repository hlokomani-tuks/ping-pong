import Ball from './ball.js';
import Bouncer from './bouncer.js';

const ball = new Ball(document.getElementById("ball"));

const playerBouncer = new Bouncer(document.getElementById("player-bouncer"));
const aiBouncer = new Bouncer(document.getElementById("ai-bouncer"));

const playerScoreElm = document.getElementById("player-score");
const aiScoreElm = document.getElementById("ai-score");

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
    resetGame();
    sfx.theme.stop();
}

// Function to start the game
function startGame() {
    sfx.theme.play();
    winningScore = parseInt(document.getElementById("winning-score").value) || 5;
    document.getElementById("start-menu").style.display = "none";
    resetGame();
    window.requestAnimationFrame(update);
}

// Function to reset the game
function resetGame() {
    ball.reset();
    playerBouncer.reset();
    aiBouncer.reset();
    playerScoreElm.textContent = 0;
    aiScoreElm.textContent = 0;
    lastTime = null;
}


function update(time){

    if(gamePaused) return;

// convert time to delta
    if(lastTime != null){
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
    window.requestAnimationFrame(update);

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

// button pause
document.getElementById("pause-button").addEventListener("click", () => {
    // If the game is not paused, pause it; otherwise, resume
    if (!gamePaused) {
        pauseGame();
    } else {
        resumeGame();
    }
});

document.getElementById("start-form").addEventListener("submit", function(event) {
    event.preventDefault();
    startGame();
});

function displayWinner(winner) {
    alert(winner + " Wins!");
    document.getElementById("start-menu").style.display = "flex";
    resetGame();
}