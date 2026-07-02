//board
let board;
const rowCount = 21 ;
const columnCount =19;
const tileSize = 32;
const boardWidth = columnCount * tileSize;
const boardHeight = rowCount * tileSize;
let context;

//sprites

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");
}
//getcontext('2d') - method returns a build-in canvasRenderingContext2D object .
//provides methods and properties for drawing and manipulating graphics on the canvas.


