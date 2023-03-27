let player;
let playerStyle;

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

let input = [0,0,0,0];
let keyCodes = ["KeyW","KeyA","KeyS","KeyD"];
let walkspeed = 5;
let playerPos = [document.documentElement.clientWidth/2, document.documentElement.clientHeight/2] ;

addEventListener("keydown",function(inputCode){
    for (let i = 0; i < keyCodes.length; i++){
        console.log(input)
        if (inputCode.code === keyCodes[i]){
            input[i] = walkspeed;
        }
    }
})

addEventListener("keyup",function(inputCode){
    for (let i = 0; i < keyCodes.length; i++){
        if (inputCode.code === keyCodes[i]){
            input[i] = 0;
        }
    }
})


function createPlayer(){
    player = document.createElement("div"); 
    playerStyle = player.style;
    
    playerStyle.width = "50px";
    playerStyle.height = "50px";
    playerStyle.position = "absolute";
    playerStyle.backgroundColor = "blue";
    playerStyle.left = playerPos[0]+"px";
    playerStyle.top = playerPos[1]+"px";
    document.body.appendChild(player);
}




const gameSetup = function(){
    createPlayer();
    masterUpdate();
}
gameSetup();

function masterUpdate(){
    requestAnimationFrame(masterUpdate);
}