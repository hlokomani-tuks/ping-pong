const INITIAL_VELOCITY = 0.025;
const VELOCITY_INCR = .0002;

var sfx = {
    bound: new Howl({
        src: [
            "../assets/wall.wav"
        ],
        autoplay: true
    })
}

export default class Ball {
    constructor(ballElm) {
        this.ballElm = ballElm;
        this.reset();
    }

    get x(){
        // this line of code goes and get's that x variable we created in CSS
        return parseFloat(getComputedStyle(this.ballElm).getPropertyValue("--x"));
    }

    set x(value){
        this.ballElm.style.setProperty("--x", value);
    }

    get y(){
        // this line of code goes and get's that y variable we created in CSS
        return parseFloat(getComputedStyle(this.ballElm).getPropertyValue("--y"));
    }

    set y(value){
        this.ballElm.style.setProperty("--y", value);
    }

    rect() {
        return this.ballElm.getBoundingClientRect();
    }

    reset(){
        this.x = 50;
        this.y = 50;
        this.direction = {x: 0};
        while(Math.abs(this.direction.x) <= 0.2 || Math.abs(this.direction.x) >= 0.9){
            const heading = randomNumberBetween(0, 2*Math.PI);
            this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
        }

        this.velocity = INITIAL_VELOCITY;
    }

    update(delta , paddleRects){
        this.x += this.direction.x * this.velocity * delta;
        this.y += this.direction.y * this.velocity * delta;
        

        const rect = this.rect();

        if(rect.bottom >= window.innerHeight || rect.top <= 0){
            // when you hit top of screen, go the opposite direction
            sfx.bound.play();
            this.direction.y *= -1;
            this.velocity += VELOCITY_INCR * delta;
        }

        if(paddleRects.some(r => isCollision(r, rect))){
            this.direction.x *= -1;
            this.velocity += VELOCITY_INCR * delta;
        }
    }
    
}

function randomNumberBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function isCollision(rect1, rect2){
    return rect1.left <= rect2.right && rect1.right >= rect2.left && rect1.top <= rect2.bottom && rect1.bottom >= rect2.top;
}