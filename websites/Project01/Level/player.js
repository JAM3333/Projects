let player;
let playerStyle;
let playerPos = [window.width/2, window.height/2] 

function createPlayer{
    player = document.createElement("div"); playerStyle = player.style;
    playerStyle.width = "50px";
    playerStyle.height = "50px";
    playerStyle.position = "absolute";
    playerStyle.top = playerPos.X
}



const gameSetup = function {
    createPlayer();

}

const masterUpdate = function {

    window.requestAnimationFrame(masterUpdate);
}