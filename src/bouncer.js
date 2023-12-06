const SPEED = .02;
export default class Bouncer{
    constructor(bouncerElm){
        this.bouncerElm=bouncerElm;
        this.reset();
    }

    get position(){
        return parseFloat(getComputedStyle(this.bouncerElm).getPropertyValue("--position"));
    }

    set position(value){
        this.bouncerElm.style.setProperty("--position", value);
    }

    reset(){
        this.position = 50;
    }

    update(delta, ballHeight){
        this.position += SPEED * delta * (ballHeight - this.position);
    }

    rect(){
        return this.bouncerElm.getBoundingClientRect();
    }
}