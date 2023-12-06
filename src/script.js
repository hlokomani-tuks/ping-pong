import Ball from './ball.js';
import Bouncer from './bouncer.js';

const ball = new Ball(document.getElementById("ball"));

const playerBouncer = new Bouncer(document.getElementById("player-bouncer"));
const aiBouncer = new Bouncer(document.getElementById("ai-bouncer"));

const playerScoreElm = document.getElementById("player-score");
const aiScoreElm = document.getElementById("ai-score");

let lastTime;
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
    if(rect.right >= window.innerWidth){
        playerScoreElm.textContent = parseInt(playerScoreElm.textContent) +1;
    }else{
        aiScoreElm.textContent = parseInt(aiScoreElm.textContent) +1;
    }

    ball.reset();
    aiBouncer.reset();
}

document.addEventListener("mousemove", e => {
    playerBouncer.position = (e.y / window.innerHeight)*100;
})

window.requestAnimationFrame(update);