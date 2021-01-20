'use strict';
var x = 'util';
console.log(x);

//gMat creation function.
function createMat(rows, cols) {
    var mat = [];
    // debugger;
    for (var i = 0; i < rows; i++) {
        mat[i] = [];
        for (var j = 0; j < cols; j++) {
            var newCell = createCell();
            mat[i][j] = newCell;
            if (i === 1 && j === 1 ||
                i === 2 && j === 2) {
                mat[i][j].isMine = true;
            }
        }
    }
    return mat;
}

//gCell creation function.
function createCell() {
    var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
    return cell;
}