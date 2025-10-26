let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height : dinoHeight
}

let cactusArraY = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight

let cactus1Img;
let cactus2Img;
let cactus3Img;


window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");
    dinoImg = new Image();
    dinoImg.src = "./dino.png";
    dinoImg.onload = function() {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }
    cactus1Img = new Image ();
    cactus1Img.src = "./cactus1.png"
    cactus2Img = new Image ();
    cactus2Img.src = "./cactus2.png"
    cactus3Img = new Image ();
    cactus3Img.src = "./cactus3png"

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000)

}

function update () {
    requestAnimationFrame(update);
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    //for (let i = 0 < cactusArraY.length)
}

function placeCactus () {

    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }
    let placeCactusChange = Math.random();

    if (placeCactusChange > .90) {
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArraY.push(cactus);
    }
    else  if (placeCactusChange > .70 ) {
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArraY.push(cactus);
    }
    else  if (placeCactusChange > .50 ) {
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArraY.push(cactus);
    }
}