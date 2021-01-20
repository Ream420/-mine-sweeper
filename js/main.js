'use strict';
var x = 'main';
console.log(x);
// Connection Cheack.
var gCounter = 0
var gMsec = 1;

var gLevel = {
    size: 4,
    mines: 2 // number of mines in the fame 
}


// Game stat(keep updating)
var gGame = {
    isOn: false,
    shownCount: 0, //for each cell open
    markedCount: 0, //for each cell marked
    secsPassed: 0 //how many sec paseed
}

var gBoard = createMat(gLevel.size, gLevel.size);
console.table(gBoard); //CHeack Board
console.log(gBoard); //CHeack Board

renderBoard(gBoard);
//Board Rendering



function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr class="tableRow">`;
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var cellClassName = 'floor';
            var cellPos = { i: i, j: j };
            var minesAround = setMinesNegsCount(board, cellPos);
            if (minesAround === 0) minesAround = null;
            if (cell.isMine === true) cellClassName = 'mine';
            strHTML += `<td class="cell ${cellClassName}" 
                onclick="cellClicked(this, ${i}, ${j}, ${minesAround})"></td>`;
        }
        strHTML += `</tr>`;
    }
    var elTable = document.querySelector('table');
    elTable.innerHTML = strHTML;
}

function setMinesNegsCount(board, cellPos) {
    var counter = 0;
    for (var i = cellPos.i - 1; i <= cellPos.i + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = cellPos.j - 1; j <= cellPos.j + 1; j++) {
            var currCell = board[i][j];
            if (j < 0 || j > board[0].length - 1) continue;
            if (i === cellPos.i && j === cellPos.j) continue;
            if (currCell.isBooked) continue;
            if (currCell.isMine) counter++;
        }
    }
    return counter;
}

function cellClicked(elCell, i, j, numOfMines) {
    var currCell = gBoard[i][j];
    //Model Update
    currCell.isShown = true;
    console.log(currCell);
    //Dom update
    elCell.style.backgroundColor = 'rgb(90, 132, 146)';
    if (currCell.isMine === true) numOfMines = '💣';
    elCell.innerText = numOfMines;
    gCounter++;
    if (gCounter === 1) var timer = setInterval(timeCount, 900);

}


//Time functions
function timeCount() {
    timeRender(`${gMsec} Seconds`);
    gMsec += 1;
}
function timeRender(txt) {
    var elTime = document.querySelector('.time');
    elTime.innerText = txt;
}

// onmousedown="WhichButton(this, ${i}, ${j}, ${minesAround})"

