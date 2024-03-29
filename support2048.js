documentWidth = window.screen.availWidth;
gridContainerWidth = 0.92 * documentWidth;
cellSideLength = 0.18 * documentWidth
cellSpace = 0.04 * documentWidth;

function getPosTop(i, j) {
    return cellSpace + i * (cellSpace + cellSideLength);
}

function getPosLeft(i, j) {
    return cellSpace + j * (cellSpace + cellSideLength);
}

function getNumberBackgroundColor(number) {
    switch (number) {
        case 2: return "#fff8dc"; break;
        case 4: return "#e9967a"; break;
        case 8: return "#f2b179"; break;
        case 16: return "#f59563"; break;
        case 32: return "#f67c5f"; break;
        case 64: return "#ff7f50"; break;
        case 128: return "#edcf72"; break;
        case 256: return "#edcc61"; break;
        case 512: return "#9c0"; break;
        case 1024: return "#33b5e5"; break;
        case 2048: return "#09c"; break;
        case 4096: return "#a6c"; break;
        case 8192: return "#93c"; break;
    }
    return "black";
}

function getNumberColor(number) {
    if (number <= 4)
        return "#776e65";

    return "white";
}
// 判断是否还有空间生成
function nospace(board) {
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++) {
            if (board[i][j] == 0)
                return false;
        }

    return true;
}
// 随机生成0,1,2,3四个数字的一个
function getRand44Num() {
    return parseInt(Math.floor(Math.random() * 4));
}
// 随机生成2,4两个数字的一个
function getRand24Num() {
    return Math.random() < 0.5 ? 2 : 4;
}
//格子向左移动
function canMoveLeft(board) {
    // 对格子的后三列进行循环
    for (var i = 0; i < 4; i++)
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0)
                if (board[i][j - 1] == 0 || board[i][j - 1] == board[i][j])
                    return true;
        }

    return false;
}
//格子向右移动
function canMoveRight(board) {
    // 对格子的前三列进行循环
    for (var i = 0; i < 4; i++)
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0)
                if (board[i][j + 1] == 0 || board[i][j + 1] == board[i][j])
                    return true;
        }

    return false;
}

//格子向上移动
function canMoveUp(board) {
    // 对格子的后三行进行循环
    for (var j = 0; j < 4; j++)
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0)
                if (board[i - 1][j] == 0 || board[i - 1][j] == board[i][j])
                    return true;
        }

    return false;
}
//格子向下移动
function canMoveDown(board) {
    // 对格子的前三行进行循环
    for (var j = 0; j < 4; j++)
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0)
                if (board[i + 1][j] == 0 || board[i + 1][j] == board[i][j])
                    return true;
        }

    return false;
}
// 判断水平方向有无障碍物
function noBlockHorizontal(row, col1, col2, board) {
    for (var i = col1 + 1; i < col2; i++) {
        if (board[row][i] != 0)
            return false;
    }
    return true;
}
// 判断垂直方向有无障碍物
function noBlockVertical(col, row1, row2, board) {
    for (var i = row1 + 1; i < row2; i++) {
        if (board[i][col] != 0)
            return false;
    }
    return true;
}

function nomove(board) {
    if (canMoveLeft(board) || canMoveRight(board)
        || canMoveDown(board) || canMoveUp(board))
        return false;
    return true;
}
