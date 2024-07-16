const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 32;
const mapRows = 20;
const mapCols = 20;

let score = 0;
let gameSpeed = 100; // Oyun hızını artırdık (milisaniye cinsinden)
let lastRenderTime = 0;

const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];


const pacman = {
    x: 1,
    y: 1,
    size: tileSize - 2,
    dx: 0,
    dy: 0
};

const enemies = [
    { x: 18, y: 1, dx: 1, dy: 0, color: 'red' },
    { x: 18, y: 18, dx: 0, dy: 1, color: 'pink' }
];

function drawMap() {
    for (let row = 0; row < mapRows; row++) {
        for (let col = 0; col < mapCols; col++) {
            if (map[row][col] === 1) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            } else {
                ctx.fillStyle = 'black';
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
                if (map[row][col] === 0) {
                    ctx.fillStyle = 'white';
                    ctx.beginPath();
                    ctx.arc(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2, 4, 0, 2 * Math.PI);
                    ctx.fill();
                }
            }
        }
    }
}

function drawPacman() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacman.x * tileSize + tileSize / 2, pacman.y * tileSize + tileSize / 2, pacman.size / 2, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacman.x * tileSize + tileSize / 2, pacman.y * tileSize + tileSize / 2);
    ctx.fill();
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.beginPath();
        ctx.arc(enemy.x * tileSize + tileSize / 2, enemy.y * tileSize + tileSize / 2, tileSize / 2 - 2, 0, 2 * Math.PI);
        ctx.fill();
    });
}

function updatePacman() {
    const nextX = pacman.x + pacman.dx;
    const nextY = pacman.y + pacman.dy;
    if (map[nextY][nextX] !== 1) {
        pacman.x = nextX;
        pacman.y = nextY;
        if (map[nextY][nextX] === 0) {
            map[nextY][nextX] = 2;
            score += 10;
            document.getElementById('score').innerText = `Score: ${score}`;
        }
    }
}

function updateEnemies() {
    enemies.forEach(enemy => {
        const nextX = enemy.x + enemy.dx;
        const nextY = enemy.y + enemy.dy;
        if (map[nextY][nextX] !== 1) {
            enemy.x = nextX;
            enemy.y = nextY;
        } else {
            // Basit AI: Rastgele yeni bir yön seç
            const directions = [
                { dx: 1, dy: 0 },
                { dx: -1, dy: 0 },
                { dx: 0, dy: 1 },
                { dx: 0, dy: -1 }
            ];
            const newDirection = directions[Math.floor(Math.random() * directions.length)];
            enemy.dx = newDirection.dx;
            enemy.dy = newDirection.dy;
        }
        // Pacman ile çarpışma kontrolü
        if (enemy.x === pacman.x && enemy.y === pacman.y) {
            alert('Game Over! Your score: ' + score);
            document.location.reload();
        }
    });
}

function gameLoop(currentTime) {
    if (currentTime - lastRenderTime < gameSpeed) {
        requestAnimationFrame(gameLoop);
        return;
    }
    lastRenderTime = currentTime;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawPacman();
    drawEnemies();
    updatePacman();
    updateEnemies();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => {
    e.preventDefault(); // Ekran kaymasını engeller
    if (e.key === 'ArrowUp') {
        pacman.dx = 0;
        pacman.dy = -1;
    } else if (e.key === 'ArrowDown') {
        pacman.dx = 0;
        pacman.dy = 1;
    } else if (e.key === 'ArrowLeft') {
        pacman.dx = -1;
        pacman.dy = 0;
    } else if (e.key === 'ArrowRight') {
        pacman.dx = 1;
        pacman.dy = 0;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        pacman.dx = 0;
        pacman.dy = 0;
    }
});

requestAnimationFrame(gameLoop);

