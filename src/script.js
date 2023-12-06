import Ball from './ball.js';

const ball = new Ball(document.getElementById("ball"));

let lastTime;
function update(time){
// convert time to delta
    if(lastTime != null){
        const delta = time - lastTime;
        ball.update(delta);
    }
    lastTime = time;
    window.requestAnimationFrame(update);

}

window.requestAnimationFrame(update);