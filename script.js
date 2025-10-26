let boardWidth = 550; 
let boardHeight = 768;
let timepipe = 2500 
let inputLocked = false; 
var music = new Audio("./music.mp3")
music.volume = 0.5
var pointsound = new Audio("./point.mp3")
var diesound = new Audio("./die.mp3")
document.addEventListener("keydown", handleKeyDown); 

let GAME_STATE = {
    MENU: "menu",
    PLAYING: "playing", 
    GAME_OVER: "gameOver"
}; 
let currentState = GAME_STATE.MENU;

let playButton = {
    x: boardWidth / 2 - 115.5 / 2,
    y: boardHeight / 2 - 64 / 2,
    width: 115,
    height: 64
};

let logo = {
    x: boardWidth / 2 - 300 / 2,
    y: boardHeight / 4,
    width: 300,
    height: 100
}; 

let flappyBirdTextImg = new Image();
flappyBirdTextImg.src = "./flappyBirdLogo.png";

let gameOverImg = new Image(); 
gameOverImg.src = "./flappy-gameover.png";

let bird = {
    x: 50,
    y: boardHeight / 2,
    width: 250,
    height: 150
}

let velocityY = 0;
let velocityX = -2;
let gravity = 0.5; 
let birdY = boardHeight / 2; 
let pipeWidth = 100; 
let pipeGap = 325; 
let pipeArray = []; 
let pipeIntervalId; 
let dieSoundPlayed = false

function placePipes() {
    createPipes();
}

function createPipes() {
    let maxTopPipeHeight = boardHeight - pipeGap - 100;
    let topPipeHeight = Math.floor(Math.random() * maxTopPipeHeight); 
    let bottomPipeHeight = 500;
    velocityX -= 0.1
    let topPipe = {
        x: boardWidth,
        y: 0-topPipeHeight,
        width: 100, 
        height: 500,
        img: topPipeImg,
        passed: false
    };

    let bottomPipe = {
        x: boardWidth , 
        y: 0-topPipeHeight+500 + pipeGap, 
        width: 100, 
        height: 500,
        img: bottomPipeImg,
        passed: false
    };
    pipeArray.push(topPipe, bottomPipe); 
}

window.onload = function() {
    board = document.getElementById("board"); 
    board.height = boardHeight; 
    board.width = boardWidth;
    context = board.getContext("2d"); 

    birdImg = new Image(); 
    birdImg.src = "./bird.png"; 

    topPipeImg = new Image();
    topPipeImg.src = "./toppipetree.png"; 

    bottomPipeImg = new Image(); 
    bottomPipeImg.src = "./bottompipetree.png"; 

    playButtonImg = new Image(); 
    playButtonImg.src = "./flappyBirdPlayButton.png"; 

    requestAnimationFrame(update); 
}

function update() {
    requestAnimationFrame(update); 
    context.clearRect(0,0, board.width, board.height); 

    if(currentState === GAME_STATE.MENU) {
        renderMenu(); 
    } else if(currentState === GAME_STATE.PLAYING) {
        renderGame(); 
    } else if(currentState === GAME_STATE.GAME_OVER) {
        renderGameOver(); 
        if (! diesound)diesound.play();
        

    }
}

function renderMenu() {
    if(playButtonImg.complete) {
        context.drawImage(playButtonImg, playButton.x, playButton.y, playButton.width, playButton.height); 
    }

    if(flappyBirdTextImg.complete) {
        let scaledWidth = logo.width; 
        let scaledHeight = (flappyBirdTextImg.height / flappyBirdTextImg.width) * scaledWidth; 
        context.drawImage(flappyBirdTextImg, logo.x, logo.y, scaledWidth, scaledHeight); 
    }
}

function renderGame() {
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0); 
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    music.play();
    if(bird.y > board.height) {
        currentState = GAME_STATE.GAME_OVER;
    }

    for(let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;

        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height); 

        if(!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;

            pipe.passed = true;
            pointsound.volume = 1      
            pointsound.play(); 
        }

        if(detectCollision(bird, pipe)) {
            currentState = GAME_STATE.GAME_OVER;
        }
    }

    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    context.fillStyle = "white"; 
    context.font = "45px sans-serif"; 
    context.textAlign = "left"; 
    context.fillText(score, 5, 45);
}

function renderGameOver() {
    music.pause();   
    if(gameOverImg.complete) {
        let imgWidth = 400; 
        let imgHeight = 80; 
        let x = (boardWidth - imgWidth) / 2; 
        let y = boardHeight / 3;

        context.drawImage(gameOverImg, x, y, imgWidth, imgHeight); 

        let scoreText = `Your score: ${Math.floor(score)}`; 
        context.fillStyle = "white"; 
        context.font = "45px sans-serif"; 
        context.textAlign = "center"; 
        context.fillText(scoreText, boardWidth / 2, y + imgHeight + 50); 
        inputLocked = true; 
        if (!dieSoundPlayed){
            diesound.play();
            dieSoundPlayed = true
        } 
        setTimeout(() => {
            inputLocked = false;
        }, 500);
    }
}

function handleKeyDown(e) {
    if(inputLocked) return; 

    if(e.code === "Space") {
        if(currentState === GAME_STATE.MENU) {
            startGame(); 
        } else if(currentState === GAME_STATE.GAME_OVER) {
            resetGame();
            currentState = GAME_STATE.MENU;
        } else if(currentState === GAME_STATE.PLAYING) {
            velocityY = -10;
        }
    }
}

function startGame() {
    currentState = GAME_STATE.PLAYING; 
    bird.y = birdY; 
    velocityY = 0; 
    pipeArray = []; 
    score = 0;
    velocityX = -3.5;


    if(pipeIntervalId) {
        clearInterval(pipeIntervalId);
    }

    pipeIntervalId = setInterval(placePipes, timepipe); 
}

function resetGame() {
    bird.y = birdY;
    pipeArray = []; 
    score = 0;
    music.load();
    dieSoundPlayed = false

}

function detectCollision(a, b) {
    return a.x < b.x + b.width*0.2 &&
        a.x + a.width*0.2 > b.x && 
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}