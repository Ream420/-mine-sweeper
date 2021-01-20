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
            var cellClassName = `${i}${j}`;
            var cellPos = { i: i, j: j };
            var minesAround = setMinesNegsCount(board, cellPos);
            cell.minesAroundCount = minesAround;
            strHTML += `<td class="cell ${cellClassName}" id="${i}${j}"
                oncontextmenu="rightClick(this, ${i}, ${j});return false" 
                onclick="cellClicked(this, ${i}, ${j}, ${cell.minesAroundCount})"></td>`;
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
            if (j < 0 || j > board[0].length - 1) continue;
            if (i === cellPos.i && j === cellPos.j) continue;
            var currCell = board[i][j];
            if (currCell.isMine) counter++;
        }
    }
    return counter;
}

function cellClicked(elCell, posi, posj, numOfMines) {
    var currCell = gBoard[posi][posj];

    if (!currCell.isMark) {

        //Model Update
        currCell.isShown = true;
        //Dom update
        elCell.style.backgroundColor = 'rgb(90, 132, 146)';
        if (currCell.isMine === true) numOfMines = '💣';
        if (numOfMines === 0) numOfMines = '';
        elCell.innerText = numOfMines;
        gCounter++;
        if (gCounter === 1) var timer = setInterval(timeCount, 900);
        showCellsAround(posi, posj);

    }
}

function showCellsAround(posi, posj) {
    for (var i = posi - 1; i <= posi + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = posj - 1; j <= posj + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue;
            if (i === posi && j === posj) continue;
            var cell = gBoard[i][j];
             if (cell.isMine || cell.isShown) continue;
            //Model update.
             cell.isShown = true;
            //Dom update.            
            var elCell = document.getElementById('' + i + j);
            elCell.style.backgroundColor = 'rgb(90, 132, 146)';
            elCell.innerText = cell.minesAroundCount;
        }
    }
}


function rightClick(elCell, i, j, numOfMines) {
    var currCell = gBoard[i][j];
    if (!currCell.isMark && !currCell.isShown) {

        //Model update.
        currCell.isMark = true;

        //Dom update.
        numOfMines = '🚩';
        elCell.innerText = numOfMines;
        gCounter++;
        if (gCounter === 1) var timer = setInterval(timeCount, 900);
    }
    else if (currCell.isMark && !currCell.isShown) {

        //Model update.
        currCell.isMark = false;

        //Dom update.
        numOfMines = '';
        elCell.innerText = numOfMines;
    }
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


