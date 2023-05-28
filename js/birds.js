class Bird{
    elm;
    x;
    xSpeed=4+Math.random()*5;
    constructor(y,size,forward){
        this.forward = forward;
        this.x=(this.forward)?0:innerWidth;
        this.elm=document.createElement('div');
        this.elm.style.top=`${y}px`;
        this.elm.style.left=`${this.x}px`;
        this.elm.style.width=`${size}px`;
        this.elm.style.height=`${size}px`;
        this.elm.style.transform=`scaleX(${(forward)?1:-1})`
        this.elm.style.position='absolute';
        document.body.append(this.elm);
    }

    fly(){
        (this.forward)? this.x += this.xSpeed:this.x -=this.xSpeed;
        if (this.x>=innerWidth+200 && this.forward){
            this.x=0;
        }
        if (this.x<=-200 && !this.forward){
            this.x=innerWidth;
        }
        this.elm.style.left=`${this.x}px`
    }
}

export {Bird}





