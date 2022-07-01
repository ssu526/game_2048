/*********************** DOM ELEMENT *************************/
const scoreEl = document.querySelector('#score');
const bestEl = document.querySelector('#best');
const winMessageEl = document.querySelector('#winMessage');

/********************** INITIALIZE VARIABLES ******************/
let currentScore = 0;
let bestScore = 0;
let win=false;

let game = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [2, 0, 0, 0],
    [2, 2, 0, 0]
]

/************************** CONSTANTS *************************/
const LEN = 4; //size of the gameboard
const classes = ["c0", "c2", "c4", "c8", "c16", "c32"," c64", "c128", "c256", "c512", "c1024", "c2048"];
const cells = [
                    ['cell00', 'cell01', 'cell02', 'cell03'],
                    ['cell10', 'cell11', 'cell12', 'cell13'],
                    ['cell20', 'cell21', 'cell22', 'cell23'],
                    ['cell30', 'cell31', 'cell32', 'cell33'],
                  ]


/******************** Update the gameboard **********************/
// Update the canvas with the current state of the game matrix
updateGameboard();


/************************* EVENT LISTENER ************************/
document.addEventListener('keydown', e=>{
    switch(e.key){
        case 'ArrowUp':
            if(win===false) moveUp();
            break;
        case 'ArrowDown':
            if(win===false) moveDown();
            break;
        case 'ArrowLeft':
            if(win===false) moveLeft();
            break;
        case 'ArrowRight':
            if(win===false) moveRight();
            break;
    }
    generateNewTile();
    updateGameboard()
})

document.querySelector('button').addEventListener('click', ()=>{
    resetGameboard();
    updateGameboard();
    currentScore=0;
    scoreEl.innerHTML = currentScore;
    win=false;
    winMessageEl.style.visibility = 'hidden';
})

/************************* GAMEBOARD FUNCTIONS *********************/

// Reset the game matrix back to initial state
function resetGameboard(){
    game = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [2, 0, 0, 0],
        [2, 2, 0, 0]
    ]
}

// Update the canvas with the current state of the game matrix
function updateGameboard(){
    for(let row=0; row<LEN; row++){
        for(let col=0;col<LEN; col++){
            let classIndex = game[row][col]==0 ? 0 : Math.log(game[row][col])/Math.log(2);
            let text = game[row][col]==0 ? "" : game[row][col];
            document.querySelector(`#${cells[row][col]}`).className = classes[classIndex]; 
            document.querySelector(`#${cells[row][col]}`).innerHTML = text;
        }
    }
}

/************************ CONTROL FUNCTIONS ***************************/
function moveLeft(){
    for(let row=0; row<LEN; row++){
        let newRow = merge(game[row]);
        game[row]=newRow;
    }
}

function moveRight(){
    for(let row=0; row<LEN; row++){
        let newRow=[];
        for(let col=0;col<LEN;col++){
            newRow.unshift(game[row][col]);
        }
        newRow = merge(newRow).reverse();
        game[row]=newRow;
    }
}

function moveDown(){
    for(let col=0; col<LEN; col++){
        let newCol=[];
        for(let row=0;row<LEN; row++){
            newCol.unshift(game[row][col]);
        }
        newCol = merge(newCol).reverse();
        for(let i=0;i<LEN;i++){
            game[i][col]=newCol[i];
        }
    }
}

function moveUp(){
    for(let col=0; col<LEN; col++){
        let newCol=[];
        for(let row=0;row<LEN; row++){
            newCol.push(game[row][col]);
        }
        newCol = merge(newCol);
        for(let i=0;i<LEN;i++){
            game[i][col]=newCol[i];
        }
    }
}

/*********************** HELPER FUNCTIONS ************************/
function merge(row){
    // Merge cells with same number
    for(let i=0;i<LEN-1; i++){
        if(row[i]===row[i+1]){
            row[i]=row[i]*2
            currentScore += row[i];
            bestScore = currentScore>bestScore ? currentScore : bestScore; 
            row[i+1]=0;

            scoreEl.innerHTML = currentScore;
            bestEl.innerHTML = bestScore;

            if(row[i]===2048){
                win=true;
                winMessageEl.style.display="block";
            }
        }
    }

    // Remove the zeros in the row and return the new row
    let newRow = row.filter(x=>x!=0);
    while(newRow.length<4){
        newRow.push(0);
    }
    return newRow;
}

function generateNewTile(){
    let emptyRow="";
    let emptyCol="";

    for(let row=0; row<LEN; row++){
        for(let col=0;col<LEN; col++){
            if(game[row][col]===0){

                //If random number is zero, look for the next empty cell.
                //If random number is two, change the cell value from 0 to 2.
                let randomNumber = getRandomNumber();
                if(randomNumber===2){
                    emptyRow=row;
                    emptyCol=col;    
                    game[row][col] = randomNumber;
                    return;
                }
            }
        }
    }

    //This is for the case that all random number generated in the above loop are zeros.
    //Then we set the first empty cell to 2, if there's a empty cell.
    if(emptyRow!="") game[emptyRow][emptyCol] = 2;
}

// Return 0 or 2
function getRandomNumber(){
    let random = Math.random();
    if(random<0.5){
        return 0;
    }else{
        return 2;
    }
}
