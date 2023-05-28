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
let score = 0;

function gameStart(){
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

    setEnemyWalk();
    setTimeout(()=>enableAttacking(),100)
    
}

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

let y =1;
function doRun(){
    let x = boy.offsetLeft + dx;
    if ((x)>= innerWidth) {
        x = 0;
        y++;
        setBackground(y)
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

const enemies = [];
enemies.push(new Enemy(0,1));
enemies.push(new Enemy(-300,2));
enemies.push(new Enemy(-600,3));

let m=1;
function enemyDrawWalk(element){
    element.elm.style.backgroundImage=`url('../img/Zombie${element.image}/Walk${m++}.png')`;
    if (m===6) m=1;
}

function setEnemyWalk(){
    for(let i=0;i<enemies.length;i++){
        setInterval(()=>{
            if (innerWidth-enemies[i].x <= boy.offsetLeft+boy.offsetWidth && boy.offsetTop>=innerHeight-300){
                boyDie();
            };
            if (enemies[i].walking) enemies[i].walk();
            
        },20);
        setInterval(()=>{
            if(!enemies[i].die)enemyDrawWalk(enemies[i]);
        },1000/8);
    }
}


let z=1;
function drawEnemyDie(enemy){
    enemy.elm.style.backgroundImage =`url('../img/Zombie${enemy.image}/Dead${z++}.png')`;
    if (z===8) z=6;
}


/*  Creating fire balls */
const fireBalls = [];
function enableAttacking(){
    document.body.addEventListener('click',()=>{
        let b1= new FireBall(boy.offsetLeft+boy.offsetWidth);
        fireBalls.push(b1);
        setInterval(()=>{
            b1.shoot();
        },5);
    })
}

function boyDie(){
    die = true;
    jump = false;
    run = false;
    enemies.forEach(each=>each.elm.style.visibility='hidden');
    document.body.removeEventListener('click');
}

setInterval(()=>{
    attack();
},10)

function attack(){
    for(let r=0; r<fireBalls.length;r++){
        for (let q=0; q<enemies.length; q++){
            if (fireBalls[r].x >= innerWidth - enemies[q].x-100){
                if (!fireBalls[r].dissapear){
                    fireBalls[r].dissapear=true;
                    document.body.removeChild(fireBalls[r].elm);
                    // enemies[q].x=-800;
                    enemies[q].die = true;
                    enemyDie(enemies[q]);
                    enemies[q].xSpeed = 0;
                    setTimeout(()=>{
                        enemies[q].x=-800;
                        enemies[q].die=false;
                        enemies[q].xSpeed=3+Math.random()*2;
                    },500)

                }
                
            }
        }
    }
    
}
let dieInt = null;
function enemyDie(enemy){
    dieInt = setInterval(()=>{
        if (enemy.die) drawEnemyDie(enemy);
    },100)
}

/* Design Surrounding */
const board = document.createElement('div');
board.classList.add('start');
document.body.append(board);
board.innerText='Start'

function setBackground(y){
    if (y===6) gameOver();
    if (y==5) {
        board.style.backgroundImage="url('../img/other/end-board.png'";
        bodyElm.style.backgroundImage=`url("../img/background${y}.jpg ")`
        board.style.visibility='visible';
        board.style.left='1300px';
        board.innerText='End';
        board.style.alignItems='flex-start';
        board.style.paddingTop='70px'
    }
    if (y<5){
        board.style.visibility='hidden';
        bodyElm.style.backgroundImage=`url("../img/background${y}.jpg ")`;
    }
}

function gameOver(){
    document.body.removeChild(boy);
}

actionStart();

function actionStart(){
    const imgStart = document.createElement('div');
    imgStart.classList.add('start-image');
    document.body.append(imgStart);
    const btnStart = document.createElement('div');
    btnStart.classList.add('btn-start');
    document.body.append(btnStart);
    btnStart.innerText= 'START';
    btnStart.addEventListener('mouseenter',()=>btnStart.style.opacity='0.8')
    btnStart.addEventListener('mouseleave',()=>btnStart.style.opacity='1')
    btnStart.addEventListener('click',()=>{
        document.body.removeChild(imgStart);
        document.body.removeChild(btnStart);
        gameStart();

    });
}

