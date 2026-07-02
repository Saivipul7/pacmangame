//board
let board;
const rowCount = 21 ;
const columnCount =19;
const tileSize = 32;
const boardWidth = columnCount * tileSize;
const boardHeight = rowCount * tileSize;
let context;

//sprites
let blueGhost;
let orangeGhost;
let pinkGhost;
let redGhost;
let pacman;
let wall;


window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");
}
//getcontext('2d') - method returns a build-in canvasRenderingContext2D object .
//provides methods and properties for drawing and manipulating graphics on the canvas.


function loadImages() {
    //wall image 
    wall = new Image();
    wall.src = "png/wall.png";


    //ghost images

    blueGhost = new Image();
    blueGhost.src = "png/blueghost.png";

    orangeGhost = new Image();
    orangeGhost.src = "png/orangeghost.png";

    pinkGhost = new Image();
    pinkGhost.src = "png/pinkghost.png";

    redGhost = new Image();
    redGhost.src = "png/redghost.png";

    //pacman images

    pacmanup = new Image();
    pacmanup= "png/pacmanup.png";
    
    pacmandown = new Image();
    pacmandown= "png/pacmandown.png";

    
    pacmanleft = new Image();
    pacmanleft= "png/pacmanleft.png";

    
    pacmanright = new Image();
    pacmanright= "png/pacmanright.png";

    


}