class FireBall{
    elm;
    x;
    xSpeed=5;
    constructor(x){
        this.x=x;
        this.elm=document.createElement("div");
        this.elm.classList.add("fire-ball");
        this.elm.style.left=`${this.x}px`
        document.body.append(this.elm);
    }
    shoot(){
        this.x += this.xSpeed;
        this.elm.style.left=`${this.x}px`;
    }
}

export {FireBall};