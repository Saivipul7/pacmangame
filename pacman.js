let board;
const rowCount = 20;
const columnCount = 19;
const tileSize = 32;
const boardwidth = columnCount * tileSize;
const boardheight = rowCount * tileSize;
let context;

// sprites
let blueGhost;
let orangeGhost;
let pinkGhost;
let redGhost;
let pacmanLeft;
let pacmanRight;
let pacmanTop;
let pacmanBottom;
let wall;

const walls = [];
const ghosts = [];
const foods = [];
let pacman;

const state = {
    score: 0,
    lives: 3,
    gameOver: false,
    win: false,
};

const tileMap = [
    "XXXXXXXXXXXXXXXXXXX",
    "X       X         X",
    "X XX XXX X XXX XX X",
    "X                 X",
    "X XX X XXXXX X XX X",
    "X    X       X    X",
    "XXXX X       X XXXX",
    "000X X       X X000",
    "XXXX X XXrXX X XXXX",
    "0       bpo       0",
    "XXXX X XXXXX X XXXX",
    "000X X       X X000",
    "XXXX X XXXXX X XXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X  X     P     X  X",
    "XX X X XXXXX X X XX",
    "X    X   X   X    X",
    "X                 X",
    "XXXXXXXXXXXXXXXXXXX",
];

window.onload = function () {
    board = document.querySelector('#board');
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext('2d');

    loadImages();
    loadMap();
    window.addEventListener('keydown', handleKeydown);
    update();
};

function loadImages() {
    blueGhost = new Image();
    blueGhost.src = 'pngs/blueghost.png';
    orangeGhost = new Image();
    orangeGhost.src = 'pngs/orangeg.png';
    pinkGhost = new Image();
    pinkGhost.src = 'pngs/pinkghost.png';
    redGhost = new Image();
    redGhost.src = 'pngs/redg.png';
    pacmanLeft = new Image();
    pacmanLeft.src = 'pngs/pacmanleft.png';
    pacmanRight = new Image();
    pacmanRight.src = 'pngs/pacmanright.png';
    pacmanTop = new Image();
    pacmanTop.src = 'pngs/pacmanup.png';
    pacmanBottom = new Image();
    pacmanBottom.src = 'pngs/pacmandown.png';
    wall = new Image();
    wall.src = 'pngs/wall.png';
}

function loadMap() {
    walls.length = 0;
    ghosts.length = 0;
    foods.length = 0;
    state.score = 0;
    state.lives = 3;
    state.gameOver = false;
    state.win = false;

    for (let row = 0; row < rowCount; row++) {
        const rowData = tileMap[row];
        for (let column = 0; column < columnCount; column++) {
            const tileMapChar = rowData[column];
            const x = column * tileSize;
            const y = row * tileSize;

            if (tileMapChar === 'X') {
                walls.push(new Block(wall, x, y, tileSize, tileSize));
            } else if (tileMapChar === 'r') {
                ghosts.push(new Ghost(redGhost, x, y, tileSize, tileSize));
            } else if (tileMapChar === 'b') {
                ghosts.push(new Ghost(blueGhost, x, y, tileSize, tileSize));
            } else if (tileMapChar === 'o') {
                ghosts.push(new Ghost(orangeGhost, x, y, tileSize, tileSize));
            } else if (tileMapChar === 'p') {
                ghosts.push(new Ghost(pinkGhost, x, y, tileSize, tileSize));
            } else if (tileMapChar === 'P') {
                pacman = new Block(pacmanRight, x, y, tileSize, tileSize);
                pacman.vx = 0;
                pacman.vy = 0;
                pacman.speed = 4;
                pacman.startX = x;
                pacman.startY = y;
            } else if (tileMapChar === ' ' || tileMapChar === '0') {
                foods.push(new Block(null, x + 14, y + 14, 4, 4));
            }
        }
    }
}

function update() {
    if (!state.gameOver && !state.win) {
        movePacman();
        moveGhosts();
        collectFood();
        checkGhostCollision();
    }
    draw();
    setTimeout(update, 50);
}

function movePacman() {
    if (!pacman) return;

    const nextX = pacman.x + pacman.vx;
    const nextY = pacman.y + pacman.vy;

    if (!collidesWithWall(nextX, pacman.y, pacman.width, pacman.height)) {
        pacman.x = nextX;
    }
    if (!collidesWithWall(pacman.x, nextY, pacman.width, pacman.height)) {
        pacman.y = nextY;
    }
}

function moveGhosts() {
    for (const ghost of ghosts) {
        ghost.updateDirectionCounter();
        const nextX = ghost.x + ghost.vx;
        const nextY = ghost.y + ghost.vy;

        if (collidesWithWall(nextX, ghost.y, ghost.width, ghost.height) || collidesWithWall(ghost.x, nextY, ghost.width, ghost.height)) {
            ghost.chooseNewDirection();
            continue;
        }

        ghost.x = nextX;
        ghost.y = nextY;
    }
}

function collectFood() {
    if (!pacman) return;

    for (let i = foods.length - 1; i >= 0; i--) {
        const food = foods[i];
        if (
            pacman.x < food.x + food.width &&
            pacman.x + pacman.width > food.x &&
            pacman.y < food.y + food.height &&
            pacman.y + pacman.height > food.y
        ) {
            foods.splice(i, 1);
            state.score += 10;
        }
    }

    if (foods.length === 0) {
        state.win = true;
    }
}

function checkGhostCollision() {
    if (!pacman) return;

    for (const ghost of ghosts) {
        if (
            pacman.x < ghost.x + ghost.width &&
            pacman.x + pacman.width > ghost.x &&
            pacman.y < ghost.y + ghost.height &&
            pacman.y + pacman.height > ghost.y
        ) {
            state.lives -= 1;
            if (state.lives <= 0) {
                state.gameOver = true;
            }
            resetPositions();
            break;
        }
    }
}

function resetPositions() {
    if (!pacman) return;

    pacman.x = pacman.startX;
    pacman.y = pacman.startY;
    pacman.vx = 0;
    pacman.vy = 0;

    for (const ghost of ghosts) {
        ghost.reset();
    }
}

function collidesWithWall(x, y, width, height) {
    const objectBox = {
        left: x + 3,
        right: x + width - 3,
        top: y + 3,
        bottom: y + height - 3,
    };

    for (const wallBlock of walls) {
        const wallBox = {
            left: wallBlock.x,
            right: wallBlock.x + wallBlock.width,
            top: wallBlock.y,
            bottom: wallBlock.y + wallBlock.height,
        };

        if (
            objectBox.right > wallBox.left &&
            objectBox.left < wallBox.right &&
            objectBox.bottom > wallBox.top &&
            objectBox.top < wallBox.bottom
        ) {
            return true;
        }
    }

    return false;
}

function handleKeydown(event) {
    if (state.gameOver || state.win) {
        if (event.key === 'Enter') {
            loadMap();
        }
        return;
    }

    if (!pacman) return;

    switch (event.key) {
        case 'ArrowLeft':
            pacman.vx = -pacman.speed;
            pacman.vy = 0;
            pacman.image = pacmanLeft;
            break;
        case 'ArrowRight':
            pacman.vx = pacman.speed;
            pacman.vy = 0;
            pacman.image = pacmanRight;
            break;
        case 'ArrowUp':
            pacman.vx = 0;
            pacman.vy = -pacman.speed;
            pacman.image = pacmanTop;
            break;
        case 'ArrowDown':
            pacman.vx = 0;
            pacman.vy = pacman.speed;
            pacman.image = pacmanBottom;
            break;
    }
}

function draw() {
    context.clearRect(0, 0, boardwidth, boardheight);
    context.fillStyle = 'black';
    context.fillRect(0, 0, boardwidth, boardheight);

    for (const food of foods) {
        context.fillStyle = '#FFD700';
        context.fillRect(food.x, food.y, food.width, food.height);
    }

    for (const wallBlock of walls) {
        if (wall.complete) {
            context.drawImage(wall, wallBlock.x, wallBlock.y, wallBlock.width, wallBlock.height);
        } else {
            context.fillStyle = '#0000FF';
            context.fillRect(wallBlock.x, wallBlock.y, wallBlock.width, wallBlock.height);
        }
    }

    for (const ghost of ghosts) {
        if (ghost.image && ghost.image.complete) {
            context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
        } else {
            context.fillStyle = '#FF0000';
            context.fillRect(ghost.x, ghost.y, ghost.width, ghost.height);
        }
    }

    if (pacman && pacman.image) {
        context.drawImage(pacman.image, pacman.x, pacman.y, pacman.width, pacman.height);
    }

    context.fillStyle = 'white';
    context.font = '18px Arial';
    context.fillText(`Score: ${state.score}`, 10, 22);
    context.fillText(`Lives: ${state.lives}`, boardwidth - 100, 22);

    if (state.gameOver) {
        context.fillStyle = 'rgba(0, 0, 0, 0.75)';
        context.fillRect(0, 0, boardwidth, boardheight);
        context.fillStyle = 'red';
        context.font = '36px Arial';
        context.fillText('Game Over', boardwidth / 2 - 100, boardheight / 2 - 20);
        context.fillStyle = 'white';
        context.font = '18px Arial';
        context.fillText('Press Enter to restart', boardwidth / 2 - 110, boardheight / 2 + 20);
    } else if (state.win) {
        context.fillStyle = 'rgba(0, 0, 0, 0.75)';
        context.fillRect(0, 0, boardwidth, boardheight);
        context.fillStyle = '#00FF00';
        context.font = '36px Arial';
        context.fillText('You Win!', boardwidth / 2 - 80, boardheight / 2 - 20);
        context.fillStyle = 'white';
        context.font = '18px Arial';
        context.fillText('Press Enter to play again', boardwidth / 2 - 125, boardheight / 2 + 20);
    }
}

class Block {
    constructor(image, x, y, width, height) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.startX = x;
        this.startY = y;
    }
}

class Ghost extends Block {
    constructor(image, x, y, width, height) {
        super(image, x, y, width, height);
        this.vx = 0;
        this.vy = 0;
        this.directionTimer = 0;
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.vx = 0;
        this.vy = 0;
        this.directionTimer = 0;
    }

    updateDirectionCounter() {
        this.directionTimer -= 1;
        if (this.directionTimer <= 0 || (this.vx === 0 && this.vy === 0)) {
            this.chooseNewDirection();
        }
    }

    chooseNewDirection() {
        const directions = [
            { vx: 2, vy: 0 },
            { vx: -2, vy: 0 },
            { vx: 0, vy: 2 },
            { vx: 0, vy: -2 },
        ];

        shuffleArray(directions);

        for (const direction of directions) {
            const nextX = this.x + direction.vx;
            const nextY = this.y + direction.vy;
            if (!collidesWithWall(nextX, nextY, this.width, this.height)) {
                this.vx = direction.vx;
                this.vy = direction.vy;
                this.directionTimer = 20 + Math.floor(Math.random() * 20);
                return;
            }
        }

        this.vx = 0;
        this.vy = 0;
        this.directionTimer = 10;
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
