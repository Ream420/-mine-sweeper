'use strict';
// Connection Check.
const CHECK = 'CONNECTION CHECK';
console.log(CHECK);
// Connection Check.
const MINE = '💣';

var gStartup;
var gNumOfClicks = 0;
var gSec = 1;
var gSize = 0;
var levelOpt;
var elLostPic;
var elWinPic;
var timer;
var gLevel;
var gGame;
var gBoard;
var elEmoji;


// Initialization functions.
function init(size) {
    gStartup = false;
    var mines;
    switch (size) {
        case 4:
            mines = 2;
            break;
        case 8:
            mines = 12;
            break;
        case 12:
            mines = 30;
            break;
    }

    gLevel = {
        size: size,
        mines: mines
    }
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    gBoard = createMat(gLevel.size, gLevel.size);
    renderBoard(gBoard);
    console.table(gBoard);
    console.log(gBoard);

    //CSS restart
    elEmoji = document.querySelector('.emoji');
    elEmoji.innerText = '😃';

    levelOpt = document.querySelector('.level');
    levelOpt.style.display = 'unset';

    elLostPic = document.querySelector('.lostContainer');
    elLostPic.style.display = 'none';

    elWinPic = document.querySelector('.winContainer');
    elWinPic.style.display = 'none';
}
function restart() {
    init(gSize);
}


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

// Mouse left click.
function cellClicked(elCell, posi, posj, numOfMines) {
    var currCell = gBoard[posi][posj];
    gNumOfClicks++;


    if ((gNumOfClicks === 1) && (currCell.isMine)) {
        currCell.isMine = false;
        gLevel.mines--;
    }

    if (!gStartup) {
        timer = setInterval(timeCount, 900);
        gStartup = true;
        gGame.isOn = true;
    }

    if (!gGame.isOn) return;
    levelOpt = document.querySelector('.level');
    levelOpt.style.display = 'none';

    var innerText = null;
    if (!currCell.isMarked && !currCell.isShown) {

        //Model Update
        currCell.isShown = true;
        gGame.shownCount++;

        //Dom update
        if (currCell.isMine) {
            elCell.style.backgroundColor = 'red';
        } else elCell.style.backgroundColor = 'rgb(90, 132, 146)';

        innerText = numOfMines;
        if (currCell.isMine) innerText = MINE;
        if (numOfMines === 0) innerText = '';
        elCell.innerText = innerText;

        if ((currCell.minesAroundCount === 0) && !currCell.isMine) {
            showCellsAround(posi, posj);
        }

        if (checkMine(currCell, elCell, posi, posj)) return;
        if (isVictory()) {
            elWinPic = document.querySelector('.winContainer');
            elWinPic.style.display = 'unset';
            elEmoji = document.querySelector('.emoji');
            elEmoji.innerText = '😎';
        }
    }
}
// Mouse right click.
function rightClick(elCell, i, j, numOfMines) {

    if (!gStartup) {
        timer = setInterval(timeCount, 900);
        gStartup = true;
        gGame.isOn = true;
    }
    if (!gGame.isOn) return;

    var currCell = gBoard[i][j];
    if (!currCell.isMarked && !currCell.isShown) {

        //Model update.
        currCell.isMarked = true;
        gGame.markedCount++;

        //Dom update.
        numOfMines = '🚩';
        elCell.innerText = numOfMines;

        if (!gStartup) {
            var timer = setInterval(timeCount, 900);
            gStartup = true;
            gGame.isOn = true;
        }
    }

    else if (currCell.isMarked && !currCell.isShown) {

        //Model update.
        currCell.isMarked = false;
        gGame.markedCount--;

        //Dom update.
        numOfMines = '';
        elCell.innerText = numOfMines;
    }

    if (isVictory()) {
        elWinPic = document.querySelector('.winContainer');
        elWinPic.style.display = 'unset';
        elEmoji = document.querySelector('.emoji');
        elEmoji.innerText = '😎';
    }
}

function checkMine(currCell, elCell, posi, posj) {
    if (!gGame.isOn) return;

    if (currCell.isMine) {
        clearInterval(timer);

        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {

                var cell = gBoard[i][j];
                if (i === posi && j === posj) {
                    var elCellCurr = document.getElementById('' + i + j);
                    elCellCurr.innerText = MINE;
                    continue;
                }

                if (cell.isMine) {

                    //Model update
                    cell.isShown = true;
                    gGame.shownCount++;

                    //Dom update.            
                    var elCellCurr = document.getElementById('' + i + j);
                    elCellCurr.style.backgroundColor = 'rgb(90, 132, 146)';
                    elCellCurr.innerText = MINE;
                }
            }
        }
        gGame.isOn = false;
        itsALoss();
        return true;
    }
    return false;
}

// Victory situation.
function isVictory() {
    if (!gGame.isOn) return;

    var size = gLevel.size;
    var cond1 = ((gGame.shownCount + gGame.markedCount) === (size * size));
    var cond2 = (gGame.markedCount === gLevel.mines);
    if (cond1 && cond2) {
        clearInterval(timer);
        return true;
    }
}
// Loss situation.
function itsALoss() {
    elLostPic = document.querySelector('.lostContainer');
    elLostPic.style.display = 'unset';

    elEmoji = document.querySelector('.emoji');
    elEmoji.innerText = '🤯';

    clearInterval(timer);
}


function levelSelect(elChoise) {
    if (elChoise.innerText === 'Begginer') gSize = 4;
    if (elChoise.innerText === 'Medium') gSize = 8;
    if (elChoise.innerText === 'Expert') gSize = 12;

    init(gSize);

    levelOpt = document.querySelector('.level');
    levelOpt.style.display = 'none';
}

function showCellsAround(posi, posj) {
    if (!gGame.isOn) return;

    for (var i = posi - 1; i <= posi + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = posj - 1; j <= posj + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue;
            if (i === posi && j === posj) continue;

            var cell = gBoard[i][j];
            if (cell.isMine || cell.isShown) continue;

            //Model update.
            cell.isShown = true;
            gGame.shownCount++;

            //Dom update.            
            var elCell = document.getElementById('' + i + j);
            elCell.style.backgroundColor = 'rgb(90, 132, 146)';
            var innerText = cell.minesAroundCount;
            if (innerText === 0) innerText = '';
            elCell.innerText = innerText;
        }
    }
}

// Time functions.
function timeCount() {
    timeRender(gGame.secsPassed);
    gGame.secsPassed += 1;
}
function timeRender(seconds) {
    var elTime = document.querySelector('.time');
    elTime.innerText = 'Time\n' + secondsToTime(seconds);
}
function secondsToTime(sec) {
    var seconds = pad(sec % 60);
    var minutes = pad(Math.floor(sec / 60));
    var hours = pad(Math.floor(sec / 3600));
    return hours + ':' + minutes + ':' + seconds;
}
function pad(num) {
    return (num < 10 ? '0' + num : '' + num);
}

// Assist Function.
function showStatus() {
    console.log('gGame.shownCount\t' + gGame.shownCount);
    console.log('gGame.markedCount\t' + gGame.markedCount);
    console.log('size squared\t' + (gLevel.size * gLevel.size));
    console.log('gLevel.mines\t' + gLevel.mines);
}