'use strict';
// Connection Check.
const utilCHECK = 'UTIL CONNECTION CHECK';
console.log(utilCHECK);
// Connection Check.

function createMat(rows, cols) {
    var mat = [];
    var mineCount = 0;
    var ranI;
    var ranJ;

    for (var i = 0; i < rows; i++) {
        mat[i] = [];
        for (var j = 0; j < cols; j++) {
            var newCell = createCell();
            mat[i][j] = newCell;
        }
    }

    while (mineCount < gLevel.mines) {
        ranI = randNum(rows);
        ranJ = randNum(cols);
        if (mat[ranI][ranJ].isMine) continue;
        mat[ranI][ranJ].isMine = true;
        mineCount++;
    }
    return mat;
}

function randNum(lim) {
    return Math.floor(Math.random() * lim);
}

function createCell() {
    var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
    return cell;
}