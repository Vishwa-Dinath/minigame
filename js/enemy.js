class Enemy{
    elm;
    x;
    xSpeed=3+Math.random()*2;
    walking=true;
    constructor(x){
        this.x=x;
        this.elm=document.createElement('div');
        this.elm.classList.add('enemy');
        this.elm.style.right= `${this.x}px`;
        document.body.append(this.elm);
    }
    walk(){
        this.x += this.xSpeed;
        if (this.x>=innerWidth) this.x=0;
        this.elm.style.right=`${this.x}px`;
    }
}

export {Enemy};