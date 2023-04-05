let player;
let enemies = [];
let bullets = []

const bulletTypes = [{name: "Test1",speed: 10,lifetime: 5},{name: "Test2",speed: 12, lifetime: 6}]
const enemieTypes = [{name: "Test1",speed: 2},{name: "Test2",speed: 12}]

const bulletInterval = 200; // 200 ms between shots
let playerStyle;

let loop = 0;

let score = 0;
let lives = 3;
let enemyCount = 0;

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
    }
};

let game = ["5:1,2:2","7:1,2:2"]; //amount enemies:type (if multiple types ,)

let spawnPoints = [//"-50:-50",
                    //window.innerWidth/2+":-50",
                    //window.innerWidth+":-50",
                    //window.innerWidth+":"+window.innerHeight/2,
                   // window.innerWidth+":"+window.innerHeight,
                    //window.innerWidth/2+":"+window.innerHeight,
                    window.innerWidth/2+":"+window.innerHeight/2,
                    //"-50:"+window.innerHeight,
                    /*"-50:"+window.innerHeight/2,*/] // x:y
let enemieWave = 0;
let currentEnemies = 0;

let playerStartPos = [(window.innerWidth/2) - (state.player.playerSize[0]/2), (window.innerHeight/2) - (state.player.playerSize[1]/2)] ;


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


function createPlayer(){
    player = document.createElement("div"); 
    playerStyle = player.style;
    
    playerStyle.width = state.player.playerSize[0]+"px";
    playerStyle.height = state.player.playerSize[1]+"px";
    playerStyle.position = "absolute";
    playerStyle.backgroundColor = "blue";
    playerStyle.backgroundImage = "url(../images/Sprites/Arrow01.png)";
    playerStyle.backgroundSize = state.player.playerSize[0]+"px";

    state.player.posX = playerStartPos[0];
    state.player.posY = playerStartPos[1];
    document.body.appendChild(player);
}

function createEnemy(type,posX,posY,size,angle,lives){
    enemies.push({type: type, posX: posX, posY: posY, size: size, angle: angle, isalive: true, lives: lives, draw: function(){
        let enemy = document.createElement("div");
        enemy.className = "enemy"+(enemies.length-1)
        let enemyStyle = enemy.style;

        enemyStyle.height = size+"px";
        enemyStyle.width = size+"px";
        enemyStyle.position = "absolute";
        enemyStyle.transform = "rotate("+angle+"deg)";
       // enemyStyle.backgroundColor = "red";
        enemyStyle.backgroundImage = "url(../images/Sprites/Arrow01.png)";
        enemyStyle.backgroundSize = size+"px";
        enemyStyle.left = posX+"px";
        enemyStyle.top = posY+"px";
        document.body.appendChild(enemy);
    }})
}
function createBullet(type,size,posX,posY,angle){
    bullets.push({type: type, posX: posX, posY: posY, size: size,angle: angle, speed: 0, aliveTime: 0, draw: function(){
        let bullet = document.createElement("div");
        bullet.className = "bullet"+(bullets.length-1);
        let bulletStyle = bullet.style;

        bulletStyle.height = size+"px";
        bulletStyle.width = size+"px";
        bulletStyle.position = "absolute";
        bulletStyle.transform = "rotate("+angle+"deg)";
        bulletStyle.backgroundColor = "orange";
        bulletStyle.left = posX+"px";
        bulletStyle.top = posY+"px";
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

let count = 0;

const gameSetup = function(){
    createPlayer();

    masterUpdate();

}
gameSetup();

function masterUpdate(){
    loop += 16;
    if (loop >= bulletInterval){
        loop = 0;
        createBullet(bulletTypes[0].name,20,state.player.posX + state.player.playerSize[0]/2 - 20/2,state.player.posY + state.player.playerSize[1]/2 - 20/2,state.player.rot,1);
        bullets[bullets.length-1].draw();
        if (count < 1) {
            count++;
            let spawnpointPos = spawnPoints[Math.floor(Math.random() * spawnPoints.length)].split(":");
            let spawnPointX = parseInt(spawnpointPos[0]) + 100*count
            let spawnPointY = spawnpointPos[1]
            createEnemy("Test1",spawnPointX,spawnPointY,50,Math.atan2(state.player.posX - spawnPointX,-(state.player.posX - spawnPointY))*180/Math.PI);
            enemies[enemies.length-1].draw();    
            enemyCount++;
        }     
    }

    if (enemies.length != 0) {
        for (let i = 0; i < enemies.length; i++){
            let enemieDiv = document.body.getElementsByClassName("enemy"+i)[0]; 
            if (enemieDiv) {

                enemies[i].posX = enemieDiv.getBoundingClientRect().x
                enemies[i].posY = enemieDiv.getBoundingClientRect().y
                //enemies[i].angle = (enemies[i].angle + Math.atan2(state.player.posX - enemies[i].posX,-(state.player.posY - enemies[i].posY))*180/Math.PI)%360;
                enemies[i].angle = Math.atan2(state.player.posX - enemies[i].posX,-(state.player.posY - enemies[i].posY))*180/Math.PI;
                
                if (enemies[i].angle >= 0) {
                    enemies[i].angle *= -1
                }
                console.log(enemies[i].angle);

                enemieDiv.style.transform = "rotate("+enemies[i].angle+"deg)"
                //enemieDiv.style.transform = "rotate(-"+enemies[i].angle+"deg)" + enemieDiv.style.transform + "translateY(-"+enemieTypes[enemieTypes.findIndex(item => item.name == enemies[i].type)].speed+"px)"
            } 
        }
    }

    if (bullets.length != 0) {
        for (let i = 0; i < bullets.length; i++){
            let bulletDiv = document.body.getElementsByClassName("bullet"+i)[0];
            if (bulletDiv) {
                bulletDiv.style.transform = bulletDiv.style.transform + "translateY(-"+bulletTypes[bulletTypes.findIndex(item => item.name == bullets[i].type)].speed+"px)";

                bullets[i].aliveTime += 1/16
                bullets[i].posX = bulletDiv.getBoundingClientRect().x
                bullets[i].posY = bulletDiv.getBoundingClientRect().y
                
                for (let b = 0; b < enemies.length;b++) {
                    if (enemies[b].isalive == true){
                        var collide = collision(bullets[i].posX,enemies[b].posX,bullets[i].size,enemies[b].size,bullets[i].posY,enemies[b].posY,bullets[i].size,enemies[b].size);
                        if (collide){
                            enemies[b].isalive = false;
                            console.log(enemies);                       
                            let enemieDiv = document.body.getElementsByClassName("enemy"+b)[0];
                            if (enemieDiv) {
                                enemieDiv.classList.remove("enemy"+b);
                                enemieDiv.parentNode.removeChild(enemieDiv);   
                                enemyCount--;
                            }         
                        }
                    }
                }

                if (bullets[i].aliveTime >= bulletTypes[bulletTypes.findIndex(item => item.name == bullets[i].type)].lifetime){
                    bullets.splice(bullets.indexOf(bullets[i]),1);
                    bulletDiv.classList.remove("bullet"+i);
                    bulletDiv.parentNode.removeChild(bulletDiv);

                    for (let a = 0; a < bullets.length+1; a++){
                        let bulletDivNew = document.body.getElementsByClassName("bullet"+a)[0];
                        if (bulletDivNew) {           
                            bulletDivNew.className = "bullet"+(a-1);
                        }
                    } 
                }
            } 
        }
    }
    
    if (Math.abs(input[0]) !== Math.abs(input[1])) {
        state.player.posX = parseInt(state.player.posX) + input[0];
        state.player.posY = parseInt(state.player.posY) + input[1];
    }
    else {
        state.player.posX = parseInt(state.player.posX) + input[0] / 1.5;
        state.player.posY = parseInt(state.player.posY) + input[1] / 1.5;
    }  
    state.player.rot = Math.atan2(state.mouse.posX - state.player.posX - state.player.playerSize[0]/2,-(state.mouse.posY - state.player.posY - state.player.playerSize[1]/2))*180/Math.PI;


    playerStyle.transform = "rotate("+state.player.rot+"deg)"
    playerStyle.left = state.player.posX+"px";
    playerStyle.top = state.player.posY+"px";


    //requestAnimationFrame(masterUpdate)
    setTimeout(masterUpdate,16)
}