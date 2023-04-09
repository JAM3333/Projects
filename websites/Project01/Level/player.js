let player;
let gun;

let playerStyle;
let gunStyle;

let enemies = [];
let bullets = []

let bulletStats = {speed: 12,lifetime: 5,rate: 200}
const enemyTypes = [{name: "Test1",sprite: "url(../images/Sprites/Arrow01.png)",speed: 2,lives: 1,score: 10},{name: "Test2",sprite: "url(../images/Sprites/Arrow02.png)",speed: 3,lives: 1,score: 20},{name: "Test3",sprite: "url(../images/Sprites/Arrow03.png)",speed: 1,lives: 5,score: 50}]

const enemyInterval = 200;


let loopBullet = 0;
let loopEnemy = 0;

let paused = false;

let score = 0;
let lives = 3;
let enemyCount = 0;
let enemiesSpawned = false;
let lastEnemyCount = 0;
let round = 0;
let count = 0;

let canvas = document.getElementById("canvas");

let keyCodes = ["KeyD","KeyS","KeyA","KeyW"];
let input = [0,0]; // x/y movement

let walkspeed = [10,-10]; // forward/backward

let state = {
    mouse: {
        posX: 0,
        posY: 0,
    },
    player: {
        playerSize: [50,70], // x/y size
        posX: 0,
        posY: 0,
        rot: 0,
        gunPosX: 0,
        gunPosY: 0,
        gunRot: 0
    }
};

let game = ["3;Test1","5;Test2","4;Test3"]; //amount enemies;type (if multiple types ,)
let roundMulti = 1.25;
let enemyChance = [30,50,82];

let spawnPoints = ["-50;-50",
                    window.innerWidth/2+";-50",
                    window.innerWidth+";-50",
                    window.innerWidth+";"+window.innerHeight/2,
                    window.innerWidth+";"+window.innerHeight,
                    window.innerWidth/2+";"+window.innerHeight,
                    "-50;"+window.innerHeight,
                    "-50;"+window.innerHeight/2] // x;y
let enemieWave = 0;
let currentEnemies = 0;

let playerStartPos = [(window.innerWidth/2) - (state.player.playerSize[0]/2), (window.innerHeight/2) - (state.player.playerSize[1]/2)] ;



document.getElementById('buttonPlay').onclick = function() {
    if (document.getElementById("play").innerHTML == "Play"){
        gameSetup();
        document.getElementsByClassName('uiDown')[0].style.transform = "translateY(27vh)"
    } else {
        gameEnd();
    }


}

document.getElementById('pauseShop').onclick = function() {
    if (!paused){
        document.getElementsByClassName('uiCenter')[0].style.transform = "translateX(-80vw)";
        paused = true;
    } else {
        document.getElementsByClassName('uiCenter')[0].style.transform = "translateX(80vw)";
        paused = false;
        masterUpdate();
    }
}

document.getElementById('buy1').onclick = function() {
    upgrade("rate",-20,80,1)
}

document.getElementById('buy2').onclick = function() {
    upgrade("lifetime",0.5,6.5,2);
}

document.getElementById('buy3').onclick = function() {
    upgrade("speed",1,18,3);
}

function upgrade(type, amount, maxAmount,button){
    if (bulletStats[type] == maxAmount){
        document.getElementById('price'+button).innerHTML = "upgrade complete";
    } else{
        if (score >= document.getElementById('price'+button).innerHTML.split(" ")[0]){
            let price = parseInt(document.getElementById('price'+button).innerHTML.split(" ")[0]);
            bulletStats[type] += amount;
            score -= price;
            if (bulletStats[type] == maxAmount){
                document.getElementById('price'+button).innerHTML = "upgrade complete";
            } else {
                document.getElementById('price'+button).innerHTML = price*2+" score-points";
            }
            initiateUI();
        }
    }
}


/*if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    document.addEventListener("touchmove",function(info){
        //info.preventDefault();
        [...info.changedTouches].forEach(function(touch){
            state.mouse.posX = touch.pageX;
            state.mouse.posY = touch.pageY;
        })  
    })
} 
else { */
    addEventListener("keydown",function(inputCode){
        for (let i = 0; i < keyCodes.length; i++){
            if (inputCode.code === keyCodes[i]){
                if (i <= 1){
                    input[Math.ceil((i/2))] = walkspeed[0];
                }
                else {
                    input[Math.ceil((i/2)) - 1] = walkspeed[1];
                }
            }
        }
    
    })
    
    addEventListener("keyup",function(inputCode){
        for (let i = 0; i < keyCodes.length; i++){
            if (inputCode.code === keyCodes[i]){
                if (i <= 1){
                    input[Math.ceil((i/2))] = 0;
                }
                else {
                    input[Math.ceil((i/2)) - 1] = 0;
                }
            }
        }
    })
    
    addEventListener("mousemove",function(MousePos) {
        state.mouse.posX = MousePos.clientX;
        state.mouse.posY = MousePos.clientY;
    })
//}

function playAudio(audioFile,looped,volume,randSpeed) {
    var audio = new Audio(audioFile);
    audio.loop = looped;
    audio.volume = volume;
    if(randSpeed){
        audio.playbackRate = Math.random() + 0.5
    }
    audio.play();
}

function createPlayer(){
    player = document.createElement("div"); 
    player.id = "playerDiv";
    playerStyle = player.style;
    
    playerStyle.width = state.player.playerSize[0]+"px";
    playerStyle.height = state.player.playerSize[1]+"px";
    playerStyle.position = "absolute";
    playerStyle.overflow = "visible"
    playerStyle.zIndex = 2;
    playerStyle.boxShadow = "0 0 1vh blue";
    playerStyle.backgroundSize = state.player.playerSize[0]+"px";

    state.player.posX = playerStartPos[0];
    state.player.posY = playerStartPos[1];

    gun = document.createElement("div")
    gunStyle = gun.style;
    
    gunStyle.width = state.player.playerSize[0]/3+"px";
    gunStyle.height = state.player.playerSize[1]/1.5+"px";
    gunStyle.position = "absolute";
    gunStyle.transformOrigin = "50% 100% 0px"
    gunStyle.backgroundColor = "darkblue";
    gunStyle.backgroundImage = "url(../images/Sprites/Arrow01.png)";
    //gunStyle.backgroundImage = "url(../images/Sprites/Arrow01.png)";
    gunStyle.backgroundSize = state.player.playerSize[0]/3+"px";
    gunStyle.zIndex = 4;

    state.player.gunPosX = playerStartPos[0] + state.player.playerSize[0]/6;
    state.player.gunPosY = playerStartPos[1] + state.player.playerSize[0]/3 - state.player.playerSize[1]/1.5;

    document.body.appendChild(player);
    document.getElementById("playerDiv").appendChild(gun);
}
function createEnemy(type,posX,posY,size,angle){
    enemies.push({type: type, posX: posX, posY: posY, size: size, angle: angle, isalive: true, lives: enemyTypes[enemyTypes.findIndex(item => item.name == type)].lives, draw: function(){
        let enemy = document.createElement("div");
        enemy.className = "enemy"+(enemies.length-1)
        let enemyStyle = enemy.style;

        enemyStyle.height = size+"px";
        enemyStyle.width = size+"px";
        enemyStyle.position = "absolute";
        enemyStyle.transform = "rotate("+angle+"deg)";
       // enemyStyle.backgroundColor = "red";
        enemyStyle.backgroundImage = enemyTypes[enemyTypes.findIndex(item => item.name == type)].sprite;
        enemyStyle.backgroundSize = size+"px";
        enemyStyle.left = posX+"px";
        enemyStyle.top = posY+"px";
        document.body.appendChild(enemy);
    }})
}
function createBullet(size,posX,posY,angle){
    bullets.push({posX: posX, posY: posY, size: size,angle: angle, speed: 0, aliveTime: 0, draw: function(){
        let bullet = document.createElement("div");
        bullet.className = "bullet"+(bullets.length-1);
        let bulletStyle = bullet.style;

        bulletStyle.height = size+"px";
        bulletStyle.width = size/2+"px";
        bulletStyle.position = "absolute";
        bulletStyle.transform = "rotate("+angle+"deg)";
        bulletStyle.backgroundColor = "orange";
        bulletStyle.boxShadow = "0 10px 1vh orange";
        bulletStyle.left = posX+"px";
        bulletStyle.top = posY+"px";
        bulletStyle.zIndex = 3;
        document.body.appendChild(bullet);
    }})
}

function collision(posX1,posX2,width1,width2,posY1,posY2,height1,height2) {
    let collide = true;
    if (posX1 > posX2 + width2 || posX1 + width1 < posX2 || posY1 > posY2 + height2 || posY1 + height1 < posY2) {
        collide = false;
    }
    return collide
}


function initiateUI(){
    document.getElementById("uiLives").innerHTML = "Lives: "+lives;      
    document.getElementById("uiScore").innerHTML = "Score: "+score;     
    document.getElementById("uiRound").innerHTML = "Round: "+round; 
}

function gameEnd(){
    document.getElementsByClassName('uiCenter')[0].style.transform = "translateX(80vw)"
    document.getElementsByClassName('uiDown')[0].style.transform = "translateY(27vh)"
    document.getElementById('price1').innerHTML = "100 score-points";
    document.getElementById('price2').innerHTML = "100 score-points";
    document.getElementById('price3').innerHTML = "100 score-points";
    for (let i = 0; i < enemies.length; i++){
        let enemyDiv = document.body.getElementsByClassName("enemy"+i)[0]; 
        if (enemyDiv){
            enemyDiv.classList.remove("enemy"+i);
            enemyDiv.parentNode.removeChild(enemyDiv);  
        }
    }
    enemies.length = 0;
    for (let i = 0; i < bullets.length; i++){
        let bulletDiv = document.body.getElementsByClassName("bullet"+i)[0]; 
        if (bulletDiv){
            bulletDiv.classList.remove("bullet"+i);
            bulletDiv.parentNode.removeChild(bulletDiv);  
        }
    }
    bullets.length = 0;

    state.player.posX = playerStartPos[0];
    state.player.posY = playerStartPos[1];

    bulletStats = {speed: 12,lifetime: 5,rate: 200}; // start with speed 10 and bullet type 1

    enemyCount = 0;
    enemiesSpawned = false;
    loopBullet = 0;
    loopEnemy = 0;
    score = 0;
    round = 0;
    lives = 3;

    paused = false;
    initiateUI();
    masterUpdate();
}


const gameSetup = function(){
    createPlayer();
    playAudio("../sounds/music01.mp3",true,.3,false);

    initiateUI();
    masterUpdate();
}

function masterUpdate(){
    if (!paused) {
        if (lives > 0){
            if (enemiesSpawned == false || enemyCount > 0){
                loopBullet += 16;
                loopEnemy += 16;
                if (loopBullet >= bulletStats.rate){
                    loopBullet = 0;
                    createBullet(20,state.player.gunPosX - 20/2,state.player.gunPosY - 20/4,state.player.gunRot,1);
                    bullets[bullets.length-1].draw();
                    playAudio("../sounds/shoot01.mp3",false,.1,false);
                    playAudio("../sounds/bullet01.mp3",false,.1,false);
                }
                if (loopEnemy >= enemyInterval){
                    loopEnemy = 0;
                    if (game[round]) {
                        if (enemyCount < game[round].split(";")[0] && enemiesSpawned == false) {
                            let spawnpointPos = spawnPoints[Math.floor(Math.random() * spawnPoints.length)].split(";");
                            let spawnPointX = parseInt(spawnpointPos[0]);
                            let spawnPointY = spawnpointPos[1];
                            createEnemy(game[round].split(";")[1],spawnPointX,spawnPointY,50,Math.atan2(state.player.posX - spawnPointX,-(state.player.posX - spawnPointY))*180/Math.PI);
                            enemies[enemies.length-1].draw();    
                            enemyCount++;
                        } else {
                            if (enemyCount > lastEnemyCount){
                                lastEnemyCount = enemyCount;
                            }
                            enemiesSpawned = true;
                        }  
                    }
                    else{
                        let amountEnemies = Math.ceil(lastEnemyCount * roundMulti);
                        if (enemyCount < amountEnemies && enemiesSpawned == false) {
                            let spawnpointPos = spawnPoints[Math.floor(Math.random() * spawnPoints.length)].split(";");
                            let spawnPointX = parseInt(spawnpointPos[0]);
                            let spawnPointY = spawnpointPos[1];
        
                            let rand = Math.random()*100;
                            let index = 0;
        
                            for(let i = 0; i<enemyChance.length;i++){
                                if (enemyChance[i] <= rand){
                                    index = i;
                                }
                            }
                            let enemyType = enemyTypes[index].name
                            createEnemy(enemyType,spawnPointX,spawnPointY,50,Math.atan2(state.player.posX - spawnPointX,-(state.player.posX - spawnPointY))*180/Math.PI);
                            enemies[enemies.length-1].draw();    
                            enemyCount++;
                        } else {
                            if (enemyCount > lastEnemyCount){
                                lastEnemyCount = enemyCount;
                            }           
                            enemiesSpawned = true;
                        }  
                    }
                }
              
    
                if (enemies.length != 0) {
                    for (let i = 0; i < enemies.length; i++){
                        let enemyDiv = document.body.getElementsByClassName("enemy"+i)[0]; 
                        if (enemyDiv && enemies[i].isalive == true ) {
    
         
                        // enemies[i].angle = (enemies[i].angle + Math.atan2(state.player.posX - enemies[i].posX,-(state.player.posY - enemies[i].posY))*180/Math.PI)%360;
                           // enemies[i].angle = Math.atan2(state.player.posX - enemies[i].posX,-(state.player.posY - enemies[i].posY))*180/Math.PI;
                            enemies[i].angle = Math.atan2((state.player.posY - enemies[i].posY) ,(state.player.posX - enemies[i].posX));
    
                       
                            let distX = enemyTypes[enemyTypes.findIndex(item => item.name == enemies[i].type)].speed * Math.cos(enemies[i].angle);
                            let distY = enemyTypes[enemyTypes.findIndex(item => item.name == enemies[i].type)].speed * Math.sin(enemies[i].angle);  
    
                            enemyDiv.style.left = parseFloat(enemyDiv.style.left) + distX+"px";
                            enemyDiv.style.top = parseFloat(enemyDiv.style.top) + distY+"px";
    
                            enemies[i].posX = parseFloat(enemyDiv.style.left);
                            enemies[i].posY = parseFloat(enemyDiv.style.top);
    
    
                           //console.log(Math.floor(enemies[i].angle))
                           /// console.log(state.player.posX,state.player.posY,enemies[i].angle,distX,distY)
                            var collide = collision(state.player.posX,enemies[i].posX,state.player.playerSize[0],enemies[i].size,state.player.posY,enemies[i].posY,state.player.playerSize[1],enemies[i].size);
                            if (collide){
                                enemies[i].isalive = false;
                                let enemyDiv = document.body.getElementsByClassName("enemy"+i)[0];
                                if (enemyDiv) {
                                    enemyDiv.classList.remove("enemy"+i);
                                    enemyDiv.parentNode.removeChild(enemyDiv);   
                                    playAudio("../sounds/impact01.mp3",false,.5,false);
                                    enemyCount--;
                                }   
                                playAudio("../sounds/impact04.mp3",false,1,false);
                                lives--;
                                document.getElementById("uiLives").innerHTML = "Lives: "+lives;      
                            }
                            
                            enemyDiv.style.transform = "rotate("+(enemies[i].angle+(Math.PI/2))+"rad)";
                            //enemyTypes[enemyTypes.findIndex(item => item.name == enemies[i].type)].speed
                          //  enemyDiv.style.transform = "translateY(-"+enemyTypes[enemyTypes.findIndex(item => item.name == enemies[i].type)].speed*+"px)";
                        //  enemyDiv.style.transform =  "rotate("+enemies[i].angle+"deg) translateY(-"+enemyTypes[enemyTypes.findIndex(item => item.name == enemies[i].type)].speed*+"px)"
                        } 
                    }
                }
    
                if (bullets.length != 0) {
                    for (let i = 0; i < bullets.length; i++){
                        let bulletDiv = document.body.getElementsByClassName("bullet"+i)[0];
                        if (bulletDiv) {
                            bulletDiv.style.transform = bulletDiv.style.transform + "translateY(-"+bulletStats.speed+"px)";
    
                            bullets[i].aliveTime += 1/16
                            bullets[i].posX = bulletDiv.getBoundingClientRect().x
                            bullets[i].posY = bulletDiv.getBoundingClientRect().y
                            
                            for (let b = 0; b < enemies.length;b++) {
                                if (enemies[b].isalive == true && bullets[i]){
                                    var collide = collision(bullets[i].posX,enemies[b].posX,bullets[i].size,enemies[b].size,bullets[i].posY,enemies[b].posY,bullets[i].size,enemies[b].size);
                                    if (collide){
                                        if (enemies[b].lives > 1) {
                                            enemies[b].lives--;
                                            playAudio("../sounds/impact02.mp3",false,1,false);
                                        } 
                                        else{
                                            enemies[b].isalive = false;
                                            score += enemyTypes[enemyTypes.findIndex(item => item.name == enemies[b].type)].score
                                            document.getElementById("uiScore").innerHTML = "Score: "+score;      
    
                                            let enemyDiv = document.body.getElementsByClassName("enemy"+b)[0];
                                            if (enemyDiv) {
                                                enemyDiv.classList.remove("enemy"+b);
                                                enemyDiv.parentNode.removeChild(enemyDiv);   
                                                playAudio("../sounds/impact01.mp3",false,.5,false);
                                                playAudio("../sounds/impact02.mp3",false,1,false);
                                                enemyCount--;
                                            }      
                                        } 
                                        bullets.splice(bullets.indexOf(bullets[i]),1);
                                        if (bulletDiv){
                                            bulletDiv.classList.remove("bullet"+i);
                                            bulletDiv.parentNode.removeChild(bulletDiv);    
                                        }
                                    
                                        for (let a = i; a < bullets.length+1; a++){
                                            let bulletDivNew = document.body.getElementsByClassName("bullet"+a)[0];
                                            if (bulletDivNew ) {           
                                                bulletDivNew.className = "bullet"+(a-1);
                                            }
                                        } 
                                    }
                                }
                            }
    
                            if (bullets[i] && bullets[i].aliveTime >= bulletStats.lifetime){
                                if (bulletDiv) {
                                    bullets.splice(bullets.indexOf(bullets[i]),1);
                                    bulletDiv.classList.remove("bullet"+i);
                                    bulletDiv.parentNode.removeChild(bulletDiv);
                
                                    for (let a = i; a < bullets.length+1; a++){
                                        let bulletDivNew = document.body.getElementsByClassName("bullet"+a)[0];
                                        if (bulletDivNew ) {           
                                            bulletDivNew.className = "bullet"+(a-1);
                                        }
                                    } 
                                }
                            }
                        } 
                    }
                }
                
                if (state.player.posX <= 0 && input[0] < 0) {
                    input[0] = 0;     
                } else if (state.player.posX >= window.innerWidth - state.player.playerSize[0] && input[0] > 0) {
                    input[0] = 0;     
                } else if (state.player.posY <= 0 && input[1] < 0){
                    input[1] = 0;     
                } else if (state.player.posY >= window.innerHeight - state.player.playerSize[1] && input[1] > 0) {
                    input[1] = 0;            
                }
    
                if (Math.abs(input[0]) !== Math.abs(input[1])) {
                    state.player.posX = parseInt(state.player.posX) + input[0];
                    state.player.posY = parseInt(state.player.posY) + input[1];
                }
                else {
                    state.player.posX = parseInt(state.player.posX) + input[0] / 1.5;
                    state.player.posY = parseInt(state.player.posY) + input[1] / 1.5;
                }  
    
                state.player.gunPosX = state.player.posX + state.player.playerSize[0]/6;
                state.player.gunPosY = state.player.posY + state.player.playerSize[0]/1.5 + state.player.playerSize[0]/6;
    
                state.player.gunRot = Math.atan2(state.mouse.posX - state.player.gunPosX,-(state.mouse.posY - state.player.gunPosY))*180/Math.PI;
    
    
                gunStyle.transform = "rotate("+state.player.gunRot+"deg)"
                playerStyle.left = state.player.posX+"px";
                playerStyle.top = state.player.posY+"px";
    
    
                //requestAnimationFrame(masterUpdate)
                setTimeout(masterUpdate,16)
                
            }
            else {
                round++;
                playAudio("../sounds/round01.mp3",false,1,false);
                enemiesSpawned = false;
                document.getElementById("uiRound").innerHTML = "Round: "+round; 
                masterUpdate();
            }
        }
        else {
            document.getElementById("play").innerHTML = "Game Over";
            document.getElementById("buttonPlay").value = "Play Again";
            document.getElementById("uiEndScore").innerHTML = "You reached a Score of "+score+" and survived until Round "+round+". [Your Rank: #1]"
            document.getElementsByClassName('uiDown')[0].style.transform = "translateY(0vh)"
        }
    }
}