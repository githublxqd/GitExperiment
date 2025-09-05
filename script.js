// 等待DOM加载完成后再执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('high-score');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const gameOverElement = document.getElementById('gameOver');
    const finalScoreElement = document.getElementById('finalScore');
    const playAgainBtn = document.getElementById('playAgainBtn');

    // 设置画布尺寸
    canvas.width = 500;
    canvas.height = 500;

    // 游戏常量
    const GRID_SIZE = 20;
    const GRID_WIDTH = canvas.width / GRID_SIZE;
    const GRID_HEIGHT = canvas.height / GRID_SIZE;

    // 游戏变量
    let snake = [];
    let food = {};
    let direction = 'right';
    let newDirection = '';
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let gameInterval = null;
    let gameSpeed = 150;
    console.log('游戏初始化完成，等待开始指令...');
    console.log('当前游戏速度:', gameSpeed, 'ms');
    console.log('开始按钮元素:', startBtn);
    let isGameOver = true;
    let isPaused = false;

    // 更新最高分显示
highScoreElement.textContent = highScore;

    // 初始化游戏
    function initGame() {
        // 重置游戏状态
        snake = [
            {x: 10, y: 10},
            {x: 9, y: 10},
            {x: 8, y: 10}
        ];
        
        // 随机生成食物
        generateFood();
        
        // 初始化方向
        direction = 'right';
        newDirection = 'right';
        
        // 重置分数
        score = 0;
        scoreElement.textContent = score;
        
        // 重置游戏状态标志
        isGameOver = false;
        isPaused = false;
        gameOverElement.style.display = 'none';
    }

// 随机生成食物
function generateFood() {
    let newFood;
    
    // 确保食物不会生成在蛇身上
    do {
        newFood = {
            x: Math.floor(Math.random() * GRID_WIDTH),
            y: Math.floor(Math.random() * GRID_HEIGHT)
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    food = newFood;
}

// 绘制游戏
function drawGame() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制蛇
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#4ecdc4' : '#3caea3';
        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        
        // 绘制蛇的边框
        ctx.strokeStyle = '#1a1a2e';
        ctx.lineWidth = 2;
        ctx.strokeRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        
        // 绘制蛇头眼睛（仅第一个段）
        if (index === 0) {
            ctx.fillStyle = '#ffffff';
            const eyeSize = GRID_SIZE / 6;
            
            // 根据方向调整眼睛位置
            if (direction === 'right') {
                ctx.beginPath();
                ctx.arc(segment.x * GRID_SIZE + GRID_SIZE * 0.7, segment.y * GRID_SIZE + GRID_SIZE * 0.3, eyeSize, 0, Math.PI * 2);
                ctx.arc(segment.x * GRID_SIZE + GRID_SIZE * 0.7, segment.y * GRID_SIZE + GRID_SIZE * 0.7, eyeSize, 0, Math.PI * 2);
                ctx.fill();
            } else if (direction === 'left') {
                ctx.beginPath();
                ctx.arc(segment.x * GRID_SIZE + GRID_SIZE * 0.3, segment.y * GRID_SIZE + GRID_SIZE * 0.3, eyeSize, 0, Math.PI * 2);
                ctx.arc(segment.x * GRID_SIZE + GRID_SIZE * 0.3, segment.y * GRID_SIZE + GRID_SIZE * 0.7, eyeSize, 0, Math.PI * 2);
                ctx.fill();
            } else if (direction === 'up') {
                ctx.beginPath();
                ctx.arc(segment.x * GRID_SIZE + GRID_SIZE * 0.3, segment.y * GRID_SIZE + GRID_SIZE * 0.3, eyeSize, 0, Math.PI * 2);
                ctx.arc(segment.x * GRID_SIZE + GRID_SIZE * 0.7, segment.y * GRID_SIZE + GRID_SIZE * 0.3, eyeSize, 0, Math.PI * 2);
                ctx.fill();
            } else if (direction === 'down') {
                ctx.beginPath();
                ctx.arc(segment.x * GRID_SIZE + GRID_SIZE * 0.3, segment.y * GRID_SIZE + GRID_SIZE * 0.7, eyeSize, 0, Math.PI * 2);
                ctx.arc(segment.x * GRID_SIZE + GRID_SIZE * 0.7, segment.y * GRID_SIZE + GRID_SIZE * 0.7, eyeSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    });
    
    // 绘制食物
    ctx.fillStyle = '#e94560';
    ctx.beginPath();
    ctx.arc(food.x * GRID_SIZE + GRID_SIZE / 2, food.y * GRID_SIZE + GRID_SIZE / 2, GRID_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
}

// 更新游戏状态
function updateGame() {
    if (isPaused || isGameOver) return;
    
    // 更新方向（防止180度转向）
    if (newDirection) {
        // 确保不会直接反向移动
        if (
            (newDirection === 'up' && direction !== 'down') ||
            (newDirection === 'down' && direction !== 'up') ||
            (newDirection === 'left' && direction !== 'right') ||
            (newDirection === 'right' && direction !== 'left')
        ) {
            direction = newDirection;
        }
        newDirection = '';
    }
    
    // 获取蛇头位置
    const head = {x: snake[0].x, y: snake[0].y};
    
    // 根据方向移动蛇头
    switch (direction) {
        case 'up':
            head.y -= 1;
            break;
        case 'down':
            head.y += 1;
            break;
        case 'left':
            head.x -= 1;
            break;
        case 'right':
            head.x += 1;
            break;
    }
    
    // 检查边界碰撞
    if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
        gameOver();
        return;
    }
    
    // 检查自身碰撞
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }
    
    // 将新头添加到蛇身
    snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        // 增加分数
        score += 10;
        scoreElement.textContent = score;
        
        // 检查是否打破最高分
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
        
        // 生成新食物
        generateFood();
        
        // 随着分数增加，游戏速度加快
        if (score % 50 === 0 && gameSpeed > 50) {
            gameSpeed -= 10;
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, gameSpeed);
        }
    } else {
        // 移除尾部（如果没吃到食物）
        snake.pop();
    }
    
    // 绘制更新后的游戏状态
    drawGame();
}

// 游戏循环
function gameLoop() {
    updateGame();
}

// 游戏结束处理
function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    
    // 显示游戏结束界面
    finalScoreElement.textContent = score;
    gameOverElement.style.display = 'block';
}

// 开始游戏
function startGame() {
    console.log('开始游戏按钮被点击');
    if (false) {
        // 游戏已经在运行
        console.log('游戏已经开始');
        return;
    }
    
    if (isPaused) {
        // 恢复游戏
        isPaused = false;
        console.log('游戏已恢复');
        gameInterval = setInterval(gameLoop, gameSpeed);
    } else {
        // 新游戏
        initGame();
        console.log('游戏已重新开始');
        gameInterval = setInterval(gameLoop, gameSpeed);
    }
}

// 暂停游戏
function pauseGame() {
    if (isGameOver || !gameInterval) return;
    
    if (isPaused) {
        // 恢复游戏
        isPaused = false;
        gameInterval = setInterval(gameLoop, gameSpeed);
        pauseBtn.textContent = '暂停';
    } else {
        // 暂停游戏
        isPaused = true;
        clearInterval(gameInterval);
        pauseBtn.textContent = '继续';
    }
}

// 重置游戏
function resetGame() {
    clearInterval(gameInterval);
    initGame();
    drawGame();
    pauseBtn.textContent = '暂停';
}

// 键盘控制
function handleKeyPress(e) {
    const key = e.key;
    
    switch (key) {
        case 'ArrowUp':
            newDirection = 'up';
            break;
        case 'ArrowDown':
            newDirection = 'down';
            break;
        case 'ArrowLeft':
            newDirection = 'left';
            break;
        case 'ArrowRight':
            newDirection = 'right';
            break;
        case ' ': // 空格键暂停/继续
            if (!isGameOver) {
                pauseGame();
            }
            break;
        case 'Enter': // 回车键开始游戏
            if (isGameOver) {
                startGame();
            }
            break;
    }
}

// 触摸控制 - 为移动设备添加滑动控制
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}

function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    
    // 确定滑动方向（优先考虑水平或垂直方向更明显的移动）
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // 水平滑动
        if (diffX > 0 && direction !== 'left') {
            newDirection = 'right';
        } else if (diffX < 0 && direction !== 'right') {
            newDirection = 'left';
        }
    } else {
        // 垂直滑动
        if (diffY > 0 && direction !== 'up') {
            newDirection = 'down';
        } else if (diffY < 0 && direction !== 'down') {
            newDirection = 'up';
        }
    }
}

// 添加事件监听器
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resetBtn.addEventListener('click', resetGame);
playAgainBtn.addEventListener('click', startGame);

// 键盘控制
document.addEventListener('keydown', handleKeyPress);

// 触摸控制
canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchend', handleTouchEnd, false);

// 初始化游戏并绘制初始状态
initGame();
drawGame();
});