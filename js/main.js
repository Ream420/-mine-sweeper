'use strict';
var x = 'main';
console.log(x);
// Connection Cheack.

const MINE = '💣';
var gStartup = false;
var gSec = 1;
var timer;

var gLevel = {
    size: 8,
    mines: 8 // number of mines in the fame 
}

// Game stat(keep updating)
var gGame = {
    isOn: false,
    shownCount: 0, //for each cell open
    markedCount: 0, //for each cell marked
    secsPassed: 0 //how many sec paseed
}

var gBoard = createMat(gLevel.size, gLevel.size);
console.table(gBoard); //CHeack Board*
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
    // console.log('setMinesNegsCount(board, cellPos)');

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
    console.log('cellClicked(elCell, posi, posj, numOfMines)');

    if (!gStartup) {
        timer = setInterval(timeCount, 800);
        gStartup = true;
        gGame.isOn = true;
    }
    if (!gGame.isOn) return;
    var currCell = gBoard[posi][posj];
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
        console.log('win Cheack');
        if (isVictory()) {
            alert('Victory with Cell!');
            //TODO: set victory image
        }
    }
}

//Mouse right click.
function rightClick(elCell, i, j, numOfMines) {
    console.log('rightClick(elCell, i, j, numOfMines)');

    if (!gStartup) {
        timer = setInterval(timeCount, 900);
        gStartup = true;
        gGame.isOn = true;
    }
    if (!gGame.isOn) return;

    var currCell = gBoard[i][j];
    // var stat = cheackStatFlag();
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
    if (isVictory()) { console.log('Victory with flag'); }
}

//TODO
function checkMine(currCell, elCell, posi, posj) {
    console.log('checkMine(currCell, elCell, posi, posj)');


    if (!gGame.isOn) return;
    if (currCell.isMine) {
        clearInterval(timer);
        //TODO: set loose image


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
                    // var c = ((i === posi) && (j === posj) ? 'rgb(255, 0, 0)' : 'rgb(90, 132, 146)');
                    elCellCurr.style.backgroundColor = 'rgb(90, 132, 146)';
                    elCellCurr.innerText = MINE;
                }
            }
        }
        console.log('problem1');
        // console.log(elCell);
        // console.log(elCell.style);
        // elCell = document.getElementById('' + posi + posj);
        // // elCell.style.backgroundColor = 'rgb(255 ,0, 0)';
        // console.log(elCell.style.backgroundColor);
        gGame.isOn = false;
        return true;
        // gStartup = false;
    }
    return false;
}

function showStatus() {
    console.log('gGame.shownCount\t' + gGame.shownCount);
    console.log('gGame.markedCount\t' + gGame.markedCount);
    console.log('size squared\t' + (gLevel.size * gLevel.size));
    console.log('gLevel.mines\t' + gLevel.mines);
}

function isVictory() {
    console.log('isVictory() function');
    if (!gGame.isOn) return;
    var size = gLevel.size;
    var cond1 = ((gGame.shownCount + gGame.markedCount) === (size * size));
    var cond2 = (gGame.markedCount === gLevel.mines);
    if (cond1 && cond2) {
        clearInterval(timer);
        return true;
    }
}

//TODO

function levelSelect() {
}

function showCellsAround(posi, posj) {
    console.log('showCellsAround(posi, posj)');
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

//Time functions.
function timeCount() {
    if (!gGame.isOn) return;
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

