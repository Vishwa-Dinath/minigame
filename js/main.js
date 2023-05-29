import { Bird } from "./birds.js";
import { Enemy } from "./enemy.js";
import { FireBall } from "./fire.js";


const bodyElm = document.querySelector('body');
const boy = document.createElement('div');
bodyElm.style.backgroundImage=`url("img/background1.jpg ")`;
boy.classList.add('boy');
document.body.append(boy);

let audio = document.getElementById('game-audio');

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
    showScoreBoard();
    setInterval(()=>setScore(),10);
    audio.play();
}

let angle = 0;
function doJump(){
    let y  = Math.cos(angle * (Math.PI / 180));
    y *= 6;
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
    if ((x)>= innerWidth-20) {
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
function drawIdle(){
    boy.style.backgroundImage = `url('img/1/Idle (${i++}).png')`;
    if(i === 10) i = 1;
}
let j=1
function drawRun(){
    boy.style.backgroundImage = `url('img/1/Run (${j++}).png')`;
    if (j===8) j=1;
}
let k=1
function drawJump(){
    boy.style.backgroundImage = `url('img/1/Jump (${k++}).png')`;
    if (k===12) k=1;
}
let p=1;
function drawBoyDie(i){
    boy.style.backgroundImage=`url('img/1/Dead (${p++}).png')`;
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
    element.elm.style.backgroundImage = `url('img/${no++}.png')`;
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
    element.elm.style.backgroundImage=`url('img/Zombie${element.image}/Walk${m++}.png')`;
    if (m===6) m=1;
}

console.log(boy.getBoundingClientRect());

let intervalEnemy=null;
const arrayEnemyInterval = [];
function setEnemyWalk(){
    for(let i=0;i<enemies.length;i++){
        intervalEnemy = setInterval(()=>{
            // if ((innerWidth-enemies[i].x <= boy.offsetLeft+boy.offsetWidth) && boy.offsetTop>=innerHeight-300){
            //     boyDie();
            // };
            let rect1=enemies[i].elm.getBoundingClientRect();
            let rect2=boy.getBoundingClientRect();
            if (rect1.x < rect2.x + rect2.width-20 &&
                rect1.x + rect1.width-20 > rect2.x && boy.offsetTop>=innerHeight-300){
                boyDie();
            };
            if (enemies[i].walking) enemies[i].walk();
            
        },20);
        arrayEnemyInterval.push(intervalEnemy);
        setInterval(()=>{
            if(!enemies[i].die)enemyDrawWalk(enemies[i]);
        },1000/8);
    }
}


let z=1;
function drawEnemyDie(enemy){
    enemy.elm.style.backgroundImage =`url('img/Zombie${enemy.image}/Dead${z++}.png')`;
    if (z===8) z=6;
}


/*  Creating fire balls */
const fireBalls = [];
function enableAttacking(){
    document.body.addEventListener('click',()=>{
        let b1= new FireBall(boy.offsetLeft+boy.offsetWidth);
        fireBalls.push(b1);
        setInterval(()=>{
            if (!die) b1.shoot();
        },5);
    })
}

function boyDie(){
    arrayEnemyInterval.forEach(intvl=>clearInterval(intvl));
    die = true;
    jump = false;
    run = false;
    enemies.forEach(each=>each.elm.style.visibility='hidden');
    actionEnd();
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
                    enemies[q].die = true;
                    if (!die) score +=2;
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

/*  Set scoring */
let scoreBoard = null;
function showScoreBoard(){
    scoreBoard = document.createElement('div');
    scoreBoard.classList.add('score');
    document.body.append(scoreBoard);
}
function setScore(){
    scoreBoard.innerText = `Score : ${score}`;
}



/* Design Surrounding */
const board = document.createElement('div');
board.classList.add('start');
document.body.append(board);
board.innerText='Start'

function setBackground(y){
    if (y===6) gameWon();
    if (y==5) {
        board.style.backgroundImage="url('img/other/end-board.png'";
        bodyElm.style.backgroundImage=`url("img/background${y}.jpg ")`
        board.style.visibility='visible';
        board.style.left='1300px';
        board.innerText='End';
        board.style.alignItems='flex-start';
        board.style.paddingTop='70px'
    }
    if (y<5){
        board.style.visibility='hidden';
        bodyElm.style.backgroundImage=`url("img/background${y}.jpg ")`;
    }
}

function gameWon(){
    audio.pause();
    document.body.removeChild(boy);
    const imgWon = document.createElement('div');
    imgWon.classList.add('restart');
    document.body.append(imgWon);
    imgWon.style.backgroundImage='url("img/other/WON-GAME.png")';
    const btnReplay = document.createElement('div');
    btnReplay.classList.add('btn-restart');
    document.body.append(btnReplay);
    const scoreView = document.createElement('div');
    scoreView.classList.add('score-view');
    document.body.append(scoreView);
    scoreView.style.top='600px'
    scoreView.innerText= `Score : ${score}`;
    btnReplay.innerText= 'REPLAY';
    btnReplay.addEventListener('mouseenter',()=>btnReplay.style.opacity='0.8')
    btnReplay.addEventListener('mouseleave',()=>btnReplay.style.opacity='1')
    btnReplay.addEventListener('click',()=>{
        window.location.href = "https://vishwa-dinath.github.io/minigame/";

    });
}

actionStart();

function actionStart(){
    const imgStart = document.createElement('div');
    imgStart.classList.add('start-image');
    document.body.append(imgStart);
    let btnStart = document.createElement('div');
    btnStart.classList.add('btn-start');
    btnStart.classList.add('animate__animated','animate__pulse','animate__infinite');
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

function actionEnd(){
    audio.pause();
    const imgRestart = document.createElement('div');
    imgRestart.classList.add('restart');
    document.body.append(imgRestart);
    const btnRestart = document.createElement('div');
    btnRestart.classList.add('btn-restart');
    document.body.append(btnRestart);
    const scoreView = document.createElement('div');
    scoreView.classList.add('score-view');
    document.body.append(scoreView);
    scoreView.innerText= `Score : ${score}`;
    btnRestart.innerText= 'RESTART';
    btnRestart.addEventListener('mouseenter',()=>btnRestart.style.opacity='0.8')
    btnRestart.addEventListener('mouseleave',()=>btnRestart.style.opacity='1')
    btnRestart.addEventListener('click',()=>{
        window.location.href = "https://vishwa-dinath.github.io/minigame/";
        actionStart();

    });
}

let note = new Bird(100,150,false);
note.elm.classList.add('note');
note.elm.style.width='150px'
note.xSpeed=2;
setInterval(()=>note.fly(),20)
