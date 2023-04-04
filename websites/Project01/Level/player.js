let player;
let enemies = [];
let bullets = [];
let bulletTypes = [{name: "Test1",speed: 10,lifetime: 5},{name: "Test2",speed: 12, lifetime: 6}]
let bulletInterval = 200; // 200 ms between shots
let playerStyle;

let loop = 0;

let score = 0;
let lives = 3;

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
let spawnPoints = ["-50:-50","window.innerWidth/2:-50"]
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
    state.player.posX = playerStartPos[0];
    state.player.posY = playerStartPos[1];
    document.body.appendChild(player);
}

function createEnemy(type,posX,posY,size){
    enemies.push({type: type, posX: posX, posY: posY, size: size, draw: function(){
        let enemie = document.createElement("div");
        enemie.className = "enemie"+(enemies.length-1)
        let enemieStyle = enemie.style;

        enemieStyle.height = size+"px";
        enemieStyle.width = size+"px";
        enemieStyle.position = "absolute";
        enemieStyle.backgroundColor = "red";
        enemieStyle.left = posX+"px";
        enemieStyle.top = posY+"px";
        document.body.appendChild(enemie);
    }})
}
function createBullet(type,size,posX,posY,angle,speed){
    bullets.push({type: type, posX: posX, posY: posY, size: size,angle: angle, speed: speed, time: 0, draw: function(){
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


const gameSetup = function(){
    createPlayer();

    masterUpdate();

}
gameSetup();

function masterUpdate(){

    loop += 16;
    if (loop >= bulletInterval){
        loop = 0;
        createBullet(bulletTypes[0].name,20,state.player.posX + state.player.playerSize[0]/2,state.player.posY + state.player.playerSize[1]/2,state.player.rot,bulletTypes[0].speed);
        bullets[bullets.length-1].draw();
        console.log(bullets)
    }
    createEnemy("02",50,50,20);
    enemies[enemies.length-1].draw();

    if (enemies.length != 0) {
        for (let i = 0; i < enemies.length; i++){
            let enemieDiv = document.body.getElementsByClassName("enemie"+i)[0]; 
            if (enemieDiv) {
                enemies[i].angle = Math.atan2(state.player.posX - enemies[i].posX,-(state.player.posX - enemies[i].posY))*180/Math.PI;
                //console.log(enemies[i].angle)
                enemieDiv.style.transform += "translateY("+enemies[i].speed+"px),rotate("+enemies[i].angle+"deg)";
            } 
        }
    }

    if (bullets.length != 0) {
        for (let i = 0; i < bullets.length; i++){
            let bulletDiv = document.body.getElementsByClassName("bullet"+i)[0];
            if (bulletDiv) {
                bulletDiv.style.transform = bulletDiv.style.transform + "translateY(-"+bullets[i].speed+"px)";

                bullets[i].time += 1/16
                bullets[i].posX = bulletDiv.style.left
                bullets[i].posY = bulletDiv.style.top

                if (bullets[i].time >= bulletTypes[bulletTypes.findIndex(item => item.name == bullets[i].type)].lifetime){
                    bulletDiv.parentNode.removeChild(bulletDiv);
                    bullets.splice(i) // index verschoben
                    console.log("del")
                    for (let i = 0; i < bullets.length+1; i++){
                        let bulletDiv = document.body.getElementsByClassName("bullet"+i)[0];
                        if (bulletDiv) {
                            bulletDiv.className = "bullet"+i;
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
    state.player.rot = Math.atan2(state.mouse.posX - state.player.posX,-(state.mouse.posY - state.player.posY))*180/Math.PI;
    if (state.player.rot < 0) {
        state.player.rot = 360 + state.player.rot 
    }

    playerStyle.transform = "rotate("+state.player.rot+"deg)"
    playerStyle.left = state.player.posX+"px";
    playerStyle.top = state.player.posY+"px";



    setTimeout(masterUpdate,16)
}