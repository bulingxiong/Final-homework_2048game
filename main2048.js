var board = new Array();
var score = 0;
// 申明应该新的变量，来记录每一个小格子是否发生了新的碰撞
var hasConficted = new Array();

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;
// 当整个程序加载完毕后，运行的主函数
$(document).ready(function () {
    // 在移动端游戏之前进行的准备工作
    prepareForMobile();

    newgame();
});

function prepareForMobile() {

    if (documentWidth > 500) {
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }
    $('#grid-container').css('width', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('height', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius', 0.02 * gridContainerWidth);

    $('.grid-cell').css('width', cellSideLength);
    $('.grid-cell').css('height', cellSideLength);
    $('.grid-cell').css('border-radius', 0.02 * cellSideLength);

}
function newgame() {

    // 初始化棋盘格
    init();
    // 随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function init() {
    // 双重循环，对十六个小格子进行赋值
    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConficted[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            // 在初始的时候每一个位置都没有进行过碰撞
            hasConficted[i][j] = false;
            var gridCell = $("#grid-cell-" + i + "-" + j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
        }

    }

    updateBoardView();
    score = 0;
}

function updateBoardView() {
    $(".number-cell").remove();
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++) {
            $("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>')
            var theNumberCell = $('#number-cell-' + i + '-' + j);
            if (board[i][j] == 0) {
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPosTop(i, j) + cellSideLength / 2);
                theNumberCell.css('left', getPosLeft(i, j) + cellSideLength / 2);
            }
            else {
                theNumberCell.css('width', cellSideLength);
                theNumberCell.css('height', cellSideLength);
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
            // 新的一轮开始，碰撞的值重新赋值成false
            hasConficted[i][j] = false;
        }
    $('.number-cell').css('line-height', cellSideLength + 'px');
    $('.number-cell').css('font-size', 0.5 * cellSideLength + 'px');
}

// 在十六个格子里找一个空闲的生成一个数字
function generateOneNumber() {
    // 判断是否有空格子
    if (nospace(board))
        return false;
    // 随机一个位置
    var randx = getRand44Num();
    var randy = getRand44Num();
    // 判断该位置是否可用
    var times = 0;
    // 优化随机数生成算法，只让计算机猜五十次，看看能不能生成一个新的数字的位置
    while (times < 50) {
        if (board[randx][randy] == 0)
            break;

        var randx = getRand44Num();
        var randy = getRand44Num();
        times++;
    }
    // 人工的生成一个新的数字的位置
    if (times == 50) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    randx = i;
                    randy = j;
                }

            }
        }
    }

    // 随机一个数字
    var randNumber = getRand24Num();
    // 在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);
    return true;
}
// 实现玩家按下一个按键的操作
//基于玩家相应的事件循环
$(document).keydown(function (event) {

    switch (event.keyCode) {
        case 37: // left
            event.preventDefault();
            if (moveLeft(board)) {
                generateOneNumber();
                isgameover();
            }
            break;
        case 38: // up
            event.preventDefault();
            if (moveUp(board)) {
                generateOneNumber();
                isgameover();
            }
            break;
        case 39: // right
            event.preventDefault();
            if (moveRight(board)) {
                generateOneNumber();
                isgameover();
            }
            break;
        case 40: // down
            event.preventDefault();
            if (moveDown(board)) {
                generateOneNumber();
                isgameover();
            }
            break;
        default:
            break;
    }
});

document.addEventListener('touchstart', function (event) {
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

document.addEventListener('touchmove', function (event) {
    event.preventDefault();
}, { passive: false });

document.addEventListener('touchend', function (event) {
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;
    //避免手指点击也会发生滑动操作
    if (Math.abs(deltax) < 0.1 * documentWidth && Math.abs(deltay) < 0.1 * documentWidth)
        return 0;
    // 向X方向滑动
    if (Math.abs(deltax) >= Math.abs(deltay)) {

        if (deltax > 0) {
            // move right
            if (moveRight(board)) {
                generateOneNumber();
                isgameover();
            }

        }
        else {
            // move left
            if (moveLeft(board)) {
                generateOneNumber();
                isgameover();
            }
        }
    }
    // 向Y方向滑动
    else {
        if (deltay > 0) {
            // move down
            if (moveDown(board)) {
                generateOneNumber();
                isgameover();
            }
        }
        else {
            // move up
            if (moveUp(board)) {
                generateOneNumber();
                isgameover();
            }
        }
    }
});

function moveLeft(board) {
    // 判断格子是否能向左移动
    if (!canMoveLeft(board))
        return false;
    // 对格子的后三列进行循环，第一列的数字肯定不能向左移动故不考虑
    for (var i = 0; i < 4; i++)
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        // move
                        // 从[i][k]位置移动到位置[i][j]
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    // 判断两个值相等并且没有障碍物并且将要移动到的位置没有发生过碰撞
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConficted[i][k]) {
                        // move  add
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        // 加分
                        score += board[i][k];
                        // 更新分数
                        updateScore(score);
                        // 碰撞发生，下一次这个位置不能发生碰撞
                        hasConficted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    // 等待200ms重置，实现showMoveAnimation动画效果
    setTimeout("updateBoardView()", 200);
    return true;
}


function moveRight(board) {
    // 判断格子是否能向右移动
    if (!canMoveRight(board))
        return false;

    for (var i = 0; i < 4; i++)
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        // move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConficted[i][k]) {
                        // move  add
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        hasConficted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveUp(board) {
    // 判断格子是否能向上移动
    if (!canMoveUp(board))
        return false;

    for (var j = 0; j < 4; j++)
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                        // move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConficted[k][j]) {
                        // move  add
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        hasConficted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveDown(board) {
    // 判断格子是否能向下移动
    if (!canMoveDown(board))
        return false;

    for (var j = 0; j < 4; j++)
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noBlockHorizontal(j, i, k, board)) {
                        // move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[k][j] == board[i][j] && noBlockHorizontal(j, i, k, board) && !hasConficted[k][j]) {
                        // move  add
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        hasConficted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()", 200);
    return true;
}

function isgameover() {
    if (nospace(board) && nomove(board)) {
        gameover();
    }
}
//游戏结束
function gameover() {
    alert("game over!");
}

