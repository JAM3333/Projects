window.addEventListener("load",function(){
let player;
let gun;
let highscore;

let playerStyle;
let gunStyle;

let device = 0;

let enemies = [];
let bullets = [];


let currentPrice = 100; // start from 100 score
let priceIncrease = "1.2;100"; // x1.2 + 100 every upgrade
let upgrades = {rate: "300;-60;120",plrSpeed: "10;1;17",lives: "3;1;6",speed: "15;2;21",lifetime: "5;1;7",critical:"5;5;25",criticalDamage:"1;1;3",damage: "1;1;3"}; // current;upgradeAmount;maxAmount
let upgradeNames = ["Firerate","Player Speed","Player Lives","Bullet Speed","Bullet Lifetime","Critical Hit Chance","Critical Hit Damage","Bullet Damage"];
let upgradeCycle = 0;
const enemyTypes = [{name: "Test1",sprite: "../images/Sprites/enemy/SkeletonSmall/SkeletonWalk.png",speed: 2,lives: 1,score: 15},{name: "Test2",sprite: "../images/Sprites/enemy/ZombieSmall/ZombieWalk.png",speed: 3,lives: 1,score: 30},{name: "Test3",sprite: "../images/Sprites/enemy/ZombieBuff/ZombieBuff.png",speed: 1,lives: 5,score: 50}]

const enemyInterval = 200;
const AnimFrameChange = 500;

const canvas = document.getElementById("canvasElement");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = this.window.innerHeight;
context.imageSmoothingEnabled = false;

let loopBullet = 0;
let loopEnemy = 0;

let paused = false;
let playing = false;
let upgradeMenu = false;

let score = 0;
let enemyCount = 0;
let enemiesSpawned = false;
let lastEnemyCount = 0;
let round = 0;


let keyCodes = ["KeyD","KeyS","KeyA","KeyW"];
let input = [0,0]; // x/y movement



if (!localStorage.getItem("Highscore")){
    highscore = localStorage.setItem("Highscore",0)
} else {
    highscore = localStorage.getItem("Highscore")
}


let state = {
    mouse: {
        posX: 0,
        posY: 0,
    },
    player: {
        playerSize: [48,96], // x/y size
        posX: 0,
        posY: 0,
        gunPosX: 0,
        gunPosY: 0,
        gunRot: 0,
        animFrame: 1,
        timeSinceFrame: 0
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
                    //window.innerWidth/2+";"+window.innerHeight/2,]
                    "-50;"+window.innerHeight/2] // x;y
let playerStartPos = [(window.innerWidth/2) - (state.player.playerSize[0]/2), (window.innerHeight/2) - (state.player.playerSize[1]/2)] ;



document.getElementById('buttonPlay').onclick = function() {
    if (document.getElementById("play").innerHTML == "Play"){
        if (!playing){
            if (device == 1){
                document.getElementsByClassName("btnMobile")[0].style.display = "flex";
            }
            playing = true;
            gameSetup();
        }
        document.getElementsByClassName('uiDown')[0].style.transform = "translateY(27vh)"
    } else {
        if (playing){
            playing = false;
            gameEnd();
        }
    }


}

document.getElementById('btnSettings').onclick = function() {
    if (!paused && !upgradeMenu){
        if (device == 1){
            document.getElementsByClassName("btnMobile")[0].style.display = "none";
        }
        document.getElementById("centerTitle").innerHTML = "Settings";
        document.getElementsByClassName("Shop")[0].style.display = "none";
        document.getElementsByClassName("Settings")[0].style.display = "flex";
        document.getElementsByClassName('uiCenter')[0].style.transform = "translateX(-95vw)";
        paused = true;
    } else if (!upgradeMenu) {
        if (device == 1 && playing){
            document.getElementsByClassName("btnMobile")[0].style.display = "flex";
        }
        document.getElementsByClassName('uiCenter')[0].style.transform = "translateX(95vw)";
        paused = false;
        masterUpdate();
    }
}
document.getElementById('set01').onclick = function(){
    if (paused){
        if (device == 1 && playing){
            document.getElementsByClassName("btnMobile")[0].style.display = "flex";
        }        
        document.getElementsByClassName('uiCenter')[0].style.transform = "translateX(95vw)";
        paused = false;
        masterUpdate();
    }
}
document.getElementById('set02').onclick = function(){
    if (playing){
        playing = false;
        paused = false;
        gameEnd();
    }
}


document.getElementsByClassName('Buy1')[0].onclick = function() {
    upgrade(false,upgradeCycle);
}
document.getElementsByClassName('Buy2')[0].onclick = function() {
    upgrade(false,upgradeCycle+1);

}
document.getElementsByClassName('Buy3')[0].onclick = function() {
    upgrade(false,upgradeCycle+2);

}



function upgrade(state,index){
    if (typeof index == "undefined" || upgrades[Object.keys(upgrades)[index]].split(";")[0] != upgrades[Object.keys(upgrades)[index]].split(";")[2]){
        if (state == false){     
            upgrades[Object.keys(upgrades)[index]] = (parseInt(upgrades[Object.keys(upgrades)[index]].split(";")[0])+parseInt(upgrades[Object.keys(upgrades)[index]].split(";")[1]))+";"+upgrades[Object.keys(upgrades)[index]].split(";")[1]+";"+upgrades[Object.keys(upgrades)[index]].split(";")[2];


            if (upgradeCycle == upgradeNames.length-3){
                upgradeCycle = 0;
            } 
            else{
                upgradeCycle++;
            }
            document.getElementsByClassName('uiCenter')[0].style.transform = "translateX(95vw)";
            initiateUI();
            paused = false;
            upgradeMenu = false;
            masterUpdate();
        }
        else{
        
            document.getElementById("centerTitle").innerHTML = "Upgrade";
            document.getElementsByClassName("Shop")[0].style.display = "flex";
            document.getElementsByClassName("Settings")[0].style.display = "none";

            let maxUpgrades = 0;

            document.getElementById("Buy1Img").src = "../images/Sprites/upgrades/Upgrades"+upgradeCycle+".png"
            document.getElementById("Buy2Img").src = "../images/Sprites/upgrades/Upgrades"+(upgradeCycle+1)+".png"
            document.getElementById("Buy3Img").src = "../images/Sprites/upgrades/Upgrades"+(upgradeCycle+2)+".png"

            document.getElementById('buy1').innerHTML = upgradeNames[upgradeCycle];
            document.getElementById('buy1').style.backgroundColor = "transparent";
            document.getElementById('buy2').innerHTML = upgradeNames[upgradeCycle+1];
            document.getElementById('buy2').style.backgroundColor = "transparent";
            document.getElementById('buy3').innerHTML = upgradeNames[upgradeCycle+2];
            document.getElementById('buy3').style.backgroundColor = "transparent";

            if (upgrades[Object.keys(upgrades)[upgradeCycle]].split(";")[0] == upgrades[Object.keys(upgrades)[upgradeCycle]].split(";")[2]){
                document.getElementById('buy1').style.backgroundColor = "red";
                document.getElementById('buy1').innerHTML = "Max upgrade";
                maxUpgrades++;
            }
            if (upgrades[Object.keys(upgrades)[upgradeCycle+1]].split(";")[0] == upgrades[Object.keys(upgrades)[upgradeCycle+1]].split(";")[2]){
                document.getElementById('buy2').style.backgroundColor = "red";
                document.getElementById('buy2').innerHTML = "Max upgrade";
                maxUpgrades++;
            }
            if (upgrades[Object.keys(upgrades)[upgradeCycle+2]].split(";")[0] == upgrades[Object.keys(upgrades)[upgradeCycle+2]].split(";")[2]){
                document.getElementById('buy3').style.backgroundColor = "red";
                document.getElementById('buy3').innerHTML = "Max upgrade";
                maxUpgrades++;
            }
            if(maxUpgrades == 3){
                document.getElementsByClassName('uiCenter')[0].style.transform = "translateX(95vw)";
                initiateUI();
                paused = false;
                upgradeMenu = false;
                masterUpdate();              
            } else {
                document.getElementsByClassName('uiCenter')[0].style.transform = "translateX(-95vw)";
                paused= true;
                upgradeMenu = true;
                currentPrice = (currentPrice * parseFloat(priceIncrease.split(";")[0])) + parseFloat(priceIncrease.split(";")[1]);
            }
          
        }
    } 
}

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    device = 1;
    document.addEventListener("touchmove",function(info){
        info.preventDefault();
        [...info.changedTouches].forEach(function(touch){
            state.mouse.posX = touch.pageX;
            state.mouse.posY = touch.pageY;
        })  
    },{passive:false});
    document.getElementById("btnUp").ontouchstart = function(){
        input[1] = -parseInt(upgrades.plrSpeed.split(";")[0]);
    }
    document.getElementById("btnUp").ontouchend = function(){
        input[1] = 0;
    }
    document.getElementById("btnRight").ontouchstart = function(){
        input[0] = parseInt(upgrades.plrSpeed.split(";")[0]);
    }
    document.getElementById("btnRight").ontouchend = function(){
        input[0] = 0;
    }
    document.getElementById("btnDown").ontouchstart = function(){
        input[1] = parseInt(upgrades.plrSpeed.split(";")[0]);
    }
    document.getElementById("btnDown").ontouchend = function(){
        input[1] = 0;
    }
    document.getElementById("btnLeft").ontouchstart = function(){
        input[0] = -parseInt(upgrades.plrSpeed.split(";")[0]);
    }
    document.getElementById("btnLeft").ontouchend = function(){
        input[0] = 0;
    }
} 
else { 
    addEventListener("keydown",function(inputCode){
        for (let i = 0; i < keyCodes.length; i++){
            if (inputCode.code === keyCodes[i]){
                if (i <= 1){
                    input[Math.ceil((i/2))] = parseInt(upgrades.plrSpeed.split(";")[0]);
                }
                else {
                    input[Math.ceil((i/2)) - 1] = -parseInt(upgrades.plrSpeed.split(";")[0]);
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
}

function playAudio(audioFile,looped,volume,randSpeed) {
    //if (device == 0){
        var audio = new Audio(audioFile);
        audio.loop = looped;
        audio.volume = volume;
        if(randSpeed){
            audio.playbackRate = Math.random() + 0.5
        }
        audio.play();
   // }
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
    playerStyle.backgroundImage = "url(../images/Sprites/player/playerIdle.png)";
    playerStyle.backgroundRepeat = "no-repeat"
    playerStyle.backgroundPositionX = -state.player.playerSize[0]/2+"px";
    playerStyle.backgroundSize = state.player.playerSize[1]+"px";

    state.player.posX = playerStartPos[0];
    state.player.posY = playerStartPos[1];

    gun = document.createElement("div")
    gunStyle = gun.style;
    
    gunStyle.width = state.player.playerSize[0]/1.5+"px";
    gunStyle.height = state.player.playerSize[1]+"px";
    gunStyle.position = "absolute";
    gunStyle.transformOrigin = "60% 70% 0px"
    gunStyle.backgroundImage = "url(../images/Sprites/player/gun.png)";
    gunStyle.backgroundSize = state.player.playerSize[0]/1.5+"px";
    gunStyle.zIndex = 4;

    state.player.gunPosX = playerStartPos[0] + state.player.playerSize[0]/3;
    state.player.gunPosY = playerStartPos[1] - state.player.playerSize[1]/2;

    document.body.appendChild(player);
    document.getElementById("playerDiv").appendChild(gun);
}
class Enemy{
    constructor(type,posX,posY,sizeX,sizeY,angle){
        this.type = type;
        this.posX = posX;
        this.posY = posY;
        this.sizeX = sizeX; 
        this.sizeY = sizeY;  
        this.angle = angle; 
        this.isalive = true;
        this.lives = enemyTypes[enemyTypes.findIndex(item => item.name == type)].lives;
        this.backgroundImage = new Image();
        this.backgroundImage.src = enemyTypes[enemyTypes.findIndex(item => item.name == type)].sprite;
        this.animFrame = 1;
        this.timeSinceFrame = 0;
    }
    draw(){
        context.drawImage(this.backgroundImage,this.posX,this.posY,this.sizeX,this.sizeY)
    }
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
    document.getElementById("uiLives").innerHTML = "Lives: "+parseInt(upgrades.lives.split(";")[0]);      
    document.getElementById("uiScore").innerHTML = "Score: "+score;     
    document.getElementById("uiRound").innerHTML = "Round: "+round; 
    document.getElementById("Highscore").innerHTML = "Highscore: "+highscore;
    document.getElementById("HighscoreEndScreen").style.display = "none";
}

function gameEnd(){
    document.getElementsByClassName('uiCenter')[0].style.transform = "translateX(95vw)";
    document.getElementById("uiLives").style.transform = "scale(1)";        
    document.getElementsByClassName('uiDown')[0].style.transform = "translateY(27vh)";
    if (score > parseInt(highscore)){
        localStorage.setItem("Highscore",score);
        highscore = localStorage.getItem("Highscore");
    }
    context.clearRect(0,0,window.innerWidth,window.innerHeight);
    enemies.length = 0;
    if (device == 1){
        document.getElementsByClassName("btnMobile")[0].style.display = "flex";
    }
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
    state.player.timeSinceFrame = 0;
    state.player.animFrame = 1;

    upgrades = {rate: "300;-60;120",plrSpeed: "10;1;17",lives: "3;1;6",speed: "15;2;21",lifetime: "5;1;7",critical:"5;5;25",criticalDamage:"1;1;3",damage: "1;1;3"};
    upgradeCycle = 0;
    currentPrice = 100;
    
    enemyCount = 0;
    enemiesSpawned = false;
    loopBullet = 0;
    loopEnemy = 0;
    score = 0;
    round = 0;

    paused = false;
    playing = true;
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
        if (parseInt(upgrades.lives.split(";")[0]) > 0){
            if (enemiesSpawned == false || enemyCount > 0){
                loopBullet += 16;
                loopEnemy += 16;
                if (loopBullet >=  parseInt(upgrades.rate.split(";")[0])){
                    loopBullet = 0;
                    createBullet(20,state.player.gunPosX ,state.player.gunPosY,state.player.gunRot,1);
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
                            let spawnPointY = parseInt(spawnpointPos[1]);

                            enemies.push(new Enemy(game[round].split(";")[1],spawnPointX,spawnPointY,96,96,Math.atan2(state.player.posX - spawnPointX,-(state.player.posX - spawnPointY))*180/Math.PI))
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
                            let spawnPointY = parseInt(spawnpointPos[1]);
        
                            let rand = Math.random()*100;
                            let index = 0;
        
                            for(let i = 0; i<enemyChance.length;i++){
                                if (enemyChance[i] <= rand){
                                    index = i;
                                }
                            }
                            let enemyType = enemyTypes[index].name
                            enemies.push(new Enemy(enemyType,spawnPointX,spawnPointY,96,96,Math.atan2(state.player.posX - spawnPointX,-(state.player.posX - spawnPointY))*180/Math.PI))
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
              
                context.clearRect(0,0,window.innerWidth,window.innerHeight);
                if (enemies.length != 0) {
                    for (let i = 0; i < enemies.length; i++){
                        if (enemies[i].isalive == true ) {
                            enemies[i].angle = Math.atan2((state.player.posY - enemies[i].posY) ,(state.player.posX - enemies[i].posX));
                       
                            let distX = enemyTypes[enemyTypes.findIndex(item => item.name == enemies[i].type)].speed * Math.cos(enemies[i].angle);
                            let distY = enemyTypes[enemyTypes.findIndex(item => item.name == enemies[i].type)].speed * Math.sin(enemies[i].angle);  
    
                            enemies[i].posX = parseFloat(enemies[i].posX) + distX;
                            enemies[i].posY = parseFloat(enemies[i].posY) + distY;

                            enemies[i].timeSinceFrame += 16 * enemyTypes[enemyTypes.findIndex(item => item.name == enemies[i].type)].speed;

                            if (enemies[i].timeSinceFrame >= AnimFrameChange) {
                                enemies[i].timeSinceFrame = 0;
                                if (enemies[i].animFrame == 1){
                                    enemies[i].animFrame = 2;
                                }else{
                                    enemies[i].animFrame = 1;
                                }
                            }

                            if (enemies[i].angle <= Math.PI/2 && enemies[i].angle >= -Math.PI/2){
                                enemies[i].backgroundImage.src = (enemyTypes[enemyTypes.findIndex(item => item.name == enemies[i].type)].sprite).substring(0, (enemyTypes[enemyTypes.findIndex(item => item.name == enemies[i].type)].sprite).length - 4) + enemies[i].animFrame +".png";
                            }
                            else {
                                enemies[i].backgroundImage.src = (enemyTypes[enemyTypes.findIndex(item => item.name == enemies[i].type)].sprite).substring(0, (enemyTypes[enemyTypes.findIndex(item => item.name == enemies[i].type)].sprite).length - 4) +"Invert"+ enemies[i].animFrame +".png";
                            }

                            var collide = collision(state.player.posX,enemies[i].posX,state.player.playerSize[0],enemies[i].sizeX,state.player.posY,enemies[i].posY,state.player.playerSize[1],enemies[i].sizeY);
                            if (collide){
                                enemies[i].isalive = false;
                                playAudio("../sounds/impact01.mp3",false,.5,false);
                                playAudio("../sounds/impact05.mp3",false,1,false);

                                enemyCount--;
                                let livesLeft = (parseInt(upgrades.lives.split(";")[0])) - 1;
                                upgrades.lives = livesLeft+";"+upgrades.lives.split(";")[1]+";"+upgrades.lives.split(";")[2];
                                document.getElementById("uiLives").innerHTML = "Lives: "+parseInt(upgrades.lives.split(";")[0]);   
                                document.getElementById("uiLives").style.transform = "scale(1.7)";        
     
                            }
                            context.drawImage(enemies[i].backgroundImage,enemies[i].posX,enemies[i].posY,enemies[i].sizeX,enemies[i].sizeY);
                        } 
                    }
                }
            
                if (bullets.length != 0) {
                    for (let i = 0; i < bullets.length; i++){
                        let bulletDiv = document.body.getElementsByClassName("bullet"+i)[0];
                        if (bulletDiv) {
                            bulletDiv.style.transform = bulletDiv.style.transform + "translateY(-"+parseInt(upgrades.speed.split(";")[0])+"px)";
    
                            bullets[i].aliveTime += 1/16
                            bullets[i].posX = bulletDiv.getBoundingClientRect().x
                            bullets[i].posY = bulletDiv.getBoundingClientRect().y
                            
                            for (let b = 0; b < enemies.length;b++) {
                                if (enemies[b].isalive == true && bullets[i]){
                                    var collide = collision(bullets[i].posX,enemies[b].posX,bullets[i].size,enemies[b].sizeX,bullets[i].posY,enemies[b].posY,bullets[i].size,enemies[b].sizeY);
                                    if (collide){
                                        let randomCrit = Math.random() * 100
                                        if (randomCrit <= +parseInt(upgrades.critical.split(";")[0])){
                                            enemies[b].lives -= parseInt(upgrades.damage.split(";")[0]) + parseInt(upgrades.criticalDamage.split(";")[0]);
                                            playAudio("../sounds/damageCritical.mp3",false,.5,false);
                                        } else{
                                            enemies[b].lives -= parseInt(upgrades.damage.split(";")[0]);
                                        }
                                        if (enemies[b].lives >= 1) {
                                            playAudio("../sounds/impact02.mp3",false,1,false);
                                        } 
                                        else{
                                            enemies[b].isalive = false;
                                            score += enemyTypes[enemyTypes.findIndex(item => item.name == enemies[b].type)].score;
                                            if(score >= currentPrice){
                                                upgrade();
                                            }
                                            document.getElementById("uiScore").innerHTML = "Score: "+score;      
                                            playAudio("../sounds/impact01.mp3",false,.5,false);
                                            playAudio("../sounds/impact02.mp3",false,1,false);
                                            enemyCount--;     
                                        } 
                                        bullets.splice(bullets.indexOf(bullets[i]),1);
                                        if (bulletDiv && bulletDiv.parentNode){
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
    
                            if (bullets[i] && bullets[i].aliveTime >= parseInt(upgrades.lifetime.split(";")[0])){
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
    
                state.player.gunPosX = state.player.posX + state.player.playerSize[0]/3;
                state.player.gunPosY = state.player.posY + state.player.playerSize[1]/2;
 
                state.player.gunRot = Math.atan2(state.mouse.posX - state.player.gunPosX,-(state.mouse.posY - state.player.gunPosY))*180/Math.PI;

                state.player.timeSinceFrame += 2 * parseInt(upgrades.speed.split(";")[0]);
                if (state.player.timeSinceFrame >= AnimFrameChange) {
                    state.player.timeSinceFrame = 0;
                    if (state.player.animFrame == 1){
                        state.player.animFrame = 2;
                    }else{
                        state.player.animFrame = 1;
                    }
                }
                if (input[0] == 0 && input[1] == 0){
                    if (state.player.gunRot <= 180 && state.player.gunRot >= 0){
                        gunStyle.transform = "rotate("+state.player.gunRot+"deg)";
                        playerStyle.backgroundImage = "url(../images/Sprites/player/playerIdle"+state.player.animFrame+".png";
                    }
                    else {
                        gunStyle.transform = "rotate("+state.player.gunRot+"deg) scale(-1,1)";
                        playerStyle.backgroundImage = "url(../images/Sprites/player/playerIdleInverted"+state.player.animFrame+".png";
                    }
                } else {
                    if (state.player.gunRot <= 180 && state.player.gunRot >= 0){
                        gunStyle.transform = "rotate("+state.player.gunRot+"deg)";
                        playerStyle.backgroundImage = "url(../images/Sprites/player/playerMove" + state.player.animFrame +".png";
                    }
                    else {
                        gunStyle.transform = "rotate("+state.player.gunRot+"deg) scale(-1,1)";
                        playerStyle.backgroundImage = "url(../images/Sprites/player/playerMove" + state.player.animFrame +"Inverted.png";
                    }
                }
                
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
            if (score > highscore){
                document.getElementById("HighscoreEndScreen").style.display = "flex";
            }else{
                document.getElementById("HighscoreEndScreen").style.display = "none";
            }
            document.getElementById("buttonPlay").value = "Play Again";
            document.getElementById("uiEndScore").innerHTML = "You reached a Score of "+score+" and survived until Round "+round+". [Your Rank: #1]"
            document.getElementsByClassName('uiDown')[0].style.transform = "translateY(0vh)"
        }
    }
}
});