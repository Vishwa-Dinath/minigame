import { Bird } from "./birds.js";
import { Enemy } from "./enemy.js";
import { FireBall } from "./fire.js";


const bodyElm = document.querySelector('body');
const boy = document.createElement('div');
bodyElm.style.backgroundImage=`url("../img/background1.jpg ")`;
boy.classList.add('boy');
document.body.append(boy);

let jump = false;
let run = false;
let die = false;
let dx = 0;

document.body.addEventListener('keydown', (eventData)=> {
    if (eventData.code === 'Space'){
        jump = (!die)?true:false;  
    }else if (eventData.code === 'ArrowRight'){
        run = (!die)?true:false;
        if(!die)boy.style.transform='scaleX(1)';
        dx = 2;
    }else if (eventData.code === 'ArrowLeft'){
        run = (!die)?true:false;
        console.log("turned");
        if(!die) boy.style.transform='scaleX(-1)';
        dx = -2;
    }
});

document.body.addEventListener('keyup', (eventData) => {
    if (eventData.code === 'ArrowRight'){ 
        run = false;
        dx = 0;
    }else if (eventData.code === 'ArrowLeft'){
        run = false;
        dx = 0;
    }
});

let angle = 0;
function doJump(){
    let y  = Math.cos(angle * (Math.PI / 180));
    y *= 5;
    boy.style.top = (boy.offsetTop - y) + "px";
    angle++;
    if (angle >  180){
        jump = false;
        angle = 0;  
    }
}

// function doRun(){
//     let x = boxElm.offsetLeft + dx;
//     if ((x + boxElm.offsetWidth)> innerWidth) {
//         x = innerWidth - boxElm.offsetWidth;
//     }else if (x <= 0) x = 0;
//     boxElm.style.left = `${x}px`;
// }
let y =0;
function doRun(){
    let x = boy.offsetLeft + dx;
    if ((x)> innerWidth) {
        x = 0;
        y++;
        if (y<4){
            bodyElm.style.backgroundImage=`url("../img/background${y+1}.jpg ")`;
        } 
    }else if (x <= 0) x = 0;
    boy.style.left = `${x}px`;
}

setInterval(()=> {
    if (jump){
        doJump();
    }
    if (run){
        doRun();
    }
}, 5);

let i = 1;
// let i = 0;
function drawIdle(){
    boy.style.backgroundImage = `url('../img/1/Idle (${i++}).png')`;
    // boxElm.style.backgroundImage = `url('img/2/Idle__00${i++}.png')`;
    if(i === 10) i = 1;
    // if(i === 9) i = 0;
}
let j=1
// let j=0
function drawRun(){
    boy.style.backgroundImage = `url('../img/1/Run (${j++}).png')`;
    // boxElm.style.backgroundImage = `url('img/2/Run__00${j++}.png')`;
    if (j===8) j=1;
    // if (j===9) j=0;
}
let k=1
// let k=0
function drawJump(){
    boy.style.backgroundImage = `url('../img/1/Jump (${k++}).png')`;
    // boxElm.style.backgroundImage = `url('img/2/Jump__00${k++}.png')`;
    if (k===12) k=1;
    // if (k===9) k=0;
}
let p=1;
function drawBoyDie(i){
    boy.style.backgroundImage=`url('../img/1/Dead (${p++}).png')`;
    if (p===10) p=9;
}


setInterval(()=> {

    if (!jump && !run && !die){
        drawIdle()
    }else if (jump){
        drawJump();
    }else if(run){
        drawRun();
    }else if(die){
        drawBoyDie();
    }
}, (1000/10)); 



/*   Creating Birds */
const birds = [];
birds.push(new Bird(100,50,true));
birds.push(new Bird(200,60,false));
birds.push(new Bird(50,40,true));
birds.push(new Bird(60,40,true));

let no=1;
function drawFly(element){
    element.elm.style.backgroundImage = `url('../img/${no++}.png')`;
    element.elm.style.backgroundPosition='center'
    element.elm.style.backgroundSize='cover'
    if(no === 6) no = 1;
}

birds.forEach(each=>{
    setInterval(()=>drawFly(each),1000/10)
    setInterval(()=>each.fly(),20);
});


/*  Creating Enemy */

// let enemyWalk = true;

const enemies = [];
enemies.push(new Enemy(0));
enemies.push(new Enemy(-300));
enemies.push(new Enemy(-600));

let m=1;
function enemyDrawWalk(element,i){
    element.elm.style.backgroundImage=`url('../img/Zombie${i}/Walk${m++}.png')`;
    if (m===6) m=1;
}

for(let i=0;i<enemies.length;i++){
    setInterval(()=>{
        if (!die && innerWidth-enemies[i].x <= boy.offsetLeft+boy.offsetWidth && boy.offsetTop>=innerHeight-300){
            boyDie();
        };
        if (enemies[i].walking) enemies[i].walk();
        
    },20);
    setInterval(()=>{
        if (enemies[i].walking) enemyDrawWalk(enemies[i],i+1)
    },1000/8);
}

/*  Creating fire balls */
document.body.addEventListener('click',()=>{
    let b1= new FireBall(boy.offsetLeft+boy.offsetWidth);
    setInterval(()=>{
        b1.shoot();
    },5);
})

function boyDie(){
    die = true;
    jump = false;
    run = false;
}

function attack(){

}