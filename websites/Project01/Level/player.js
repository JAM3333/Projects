let player;
let playerStyle;

let canvas = document.getElementById("canvas");

let keyCodes = ["KeyD","KeyS","KeyA","KeyW"];
let input = [0,0]; // x/y movement

let walkspeed = [5,-5]; // forward/backward

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

const gameSetup = function(){
    createPlayer();
    masterUpdate();
}
gameSetup();

function masterUpdate(){


    if (Math.abs(input[0]) !== Math.abs(input[1])) {
        state.player.posX = parseInt(state.player.posX) + input[0];
        state.player.posY = parseInt(state.player.posY) + input[1];
    }
    else {
        state.player.posX = parseInt(state.player.posX) + input[0] / 1.5;
        state.player.posY = parseInt(state.player.posY) + input[1] / 1.5;
    }  
    state.player.rot = Math.atan2(state.mouse.posX - state.player.posX,-(state.mouse.posY - state.player.posY));

    playerStyle.transform = "rotate("+state.player.rot+"rad)"
    playerStyle.left = state.player.posX+"px";
    playerStyle.top = state.player.posY+"px";
    requestAnimationFrame(masterUpdate);
}