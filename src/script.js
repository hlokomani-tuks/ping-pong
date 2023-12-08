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

// Function to start the game
function startGame() {
    winningScore = parseInt(document.getElementById("winning-score").value) || 5;
    document.getElementById("start-menu").style.display = "none";
    resetGame();
    sfx.theme.play();
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

// window.requestAnimationFrame(update);

document.getElementById("start-form").addEventListener("submit", function(event) {
    event.preventDefault();
    startGame();
});

function displayWinner(winner) {
    alert(winner + " Wins!");
    document.getElementById("start-menu").style.display = "flex";
    resetGame();
}