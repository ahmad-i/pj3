//Tetris Features
//A-level (0.8pt each):
// Menu screen for starting/pausing/restarting the game is stylistically neat
// Random shapes (order changes every time the game loads) drop from the top
// Shapes fall incrementally and not continuously
// Full row clears itself
// Blocks can spin
// Shapes move down to bottom and stop when touching another block or the ground
// 4 or more unique shapes with unique colors
// Scoring system present, and it awards successive clears
// Levels of difficulty increase as the game progresses
// Hard drop
// Audio is present for interactions as well as background


var dropSpeed = 40;
var userScore = 0;
var prevScore = 0;
let paused = false;


function getNext() {
    if (pieceSequence.length === 0) {
        const sequence = ['Long', 'J', 'L', 'Square', 'S', 'T', 'Z'];
        while (sequence.length) {
            min = Math.ceil(0);
            max = Math.floor(sequence.length - 1);
            const rand = Math.floor(Math.random() * ((max) - min + 1)) + min;
            const name = sequence.splice(rand, 1)[0];
            pieceSequence.push(name);
        }
    }

    const name = pieceSequence.pop();
    const matrix = pieces[name];

    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
    const row = -2;

    return {
        name: name,
        matrix: matrix, 
        row: row,       
        col: col         
    };
}

function validPlacement(matrix, cellRow, cellCol) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col]) {
                const newRow = cellRow + row;
                const newCol = cellCol + col;
                
                if (newCol < 0 || newCol >= playfield[0].length || newRow >= playfield.length) {
                    return false;
                }
                
                if (playfield[newRow][newCol]) {
                    return false;
                }
            }
        }
    }

    return true;
}

function place() {
    for (let row = 0; row < piece.matrix.length; row++) {
        for (let col = 0; col < piece.matrix[row].length; col++) {
            const blockValue = piece.matrix[row][col];
            if (blockValue) {
                const newRow = piece.row + row;
                const newCol = piece.col + col;
                if (newRow < 0) {
                    return endScreen();
                }
                playfield[newRow][newCol] = piece.name;
            }
        }
    }


for (let row = playfield.length - 1; row >= 0; row--) {
    if (playfield[row].every(cell => !!cell)) {
        for (let r = row; r >= 0; r--) {
            if (r > 0) {
                playfield[r] = [...playfield[r - 1]];
            } else {
                playfield[r] = Array.from({ length: 10 }, () => 0);
            }
        }
        
        userScore += 3000 + (200 * prevScore);
        playSound('/music/line_clear.mp3');
    }
    else {
        row--;
        prevScore = 0;
    }
    prevScore++;
}


    piece = getNext();
}

function playSound(soundFile) {
    const audio = new Audio(soundFile);
    audio.play();
}

function endScreen() {
    cancelAnimationFrame(runLoop);
    gameOver = true;

    playSound('/music/game_over.mp3');
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = 'yellow';
    context.font = 'bold 24px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 10);
    context.fillText('Press "r" to restart', canvas.width / 2, canvas.height / 2 + 15);
    context.fillText('Score: ' + userScore, canvas.width / 2, canvas.height / 2 + 40);
    document.addEventListener('keydown', function(e) {
        const key = e.key || e.keyCode;
        if (key === 'r' || key === 'R') {
            location.reload();
          }
    });
}


const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const board = 32;
const pieceSequence = [];

const playfield = [];

for (let row = -2; row < 20; row++) {
  playfield[row] = [];

  for (let col = 0; col < 10; col++) {
    playfield[row][col] = 0;
  }
}

// adapted from 
// https://gist.github.com/straker/3c98304f8a6a9174efd8292800891ea1
const pieces = {
  'Long': [
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0]
  ],
  'J': [
    [1,0,0],
    [1,1,1],
    [0,0,0],
  ],
  'L': [
    [0,0,1],
    [1,1,1],
    [0,0,0],
  ],
  'Square': [
    [1,1],
    [1,1],
  ],
  'S': [
    [0,1,1],
    [1,1,0],
    [0,0,0],
  ],
  'Z': [
    [1,1,0],
    [0,1,1],
    [0,0,0],
  ],
  'T': [
    [0,1,0],
    [1,1,1],
    [0,0,0],
  ]
};

const colors = {
    'Long': '#FFCCCC',
    'Square': '#CCFFFF',
    'T': '#E0E0E0',
    'S': '#CCE5FF',
    'Z': '#CCFFCC',
    'J': '#FFCCFF',     
    'L': '#FFFFCC'       
  };
  

let count = 0;
let piece = getNext();
let runLoop = null;
let gameOver = false;

function drawPlayfieldCells() {
    const borderThickness = 2;

    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            if (playfield[row][col]) {
                const name = playfield[row][col];
                const color = colors[name];


                context.fillStyle = 'black';
                context.fillRect(col * board, row * board, board, board);
                context.fillStyle = color;
                context.fillRect(
                    col * board + borderThickness,
                    row * board + borderThickness,
                    board - borderThickness * 2,
                    board - borderThickness * 2
                );
            }
        }
    }
}





function loop() {
  runLoop = requestAnimationFrame(loop);
  context.clearRect(0,0,canvas.width,canvas.height);

  drawPlayfieldCells();

  if (piece) {
    

    context.fillStyle = 'white';
    context.font = '12px Arial Rounded MT Bold';
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillText('Score: ' + userScore, 10, 10);
    

    context.fillText('Level: ' + Math.floor(41-dropSpeed), 10, 30);

    //userScore = 0;
    dropSpeed = 40 - (userScore / 1000.0);
    if (dropSpeed < 3) {
        dropSpeed = 3;
        console.log("max speed reached.")
    }
    //console.log(dropSpeed);

    if (++count > dropSpeed) {
        const newRow = piece.row + 1;
        if (validPlacement(piece.matrix, newRow, piece.col)) {
            piece.row = newRow;
        } else {
            place();
        }
        count = 0;
    }
    
for (let row = 0; row < piece.matrix.length; row++) {
    for (let col = 0; col < piece.matrix[row].length; col++) {
        const blockValue = piece.matrix[row][col];
        if (blockValue) {
            const x = (piece.col + col) * board;
            const y = (piece.row + row) * board;
            const color = colors[piece.name];
            context.fillStyle = color;
            context.fillRect(x, y, board - 1, board - 1);
        }
    }
}


  }
}

function togglePaused() {
    paused = !paused;
    if (paused) {
        cancelAnimationFrame(runLoop);
        context.fillStyle = 'rgba(0, 0, 0, 0.75)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
        context.font = 'bold 20px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('Paused', canvas.width / 2, canvas.height / 2);
        context.fillText('Press ESC to Unpause', canvas.width / 2, canvas.height / 2 + 30);
        context.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 60);

    } else {
        runLoop = requestAnimationFrame(loop);
    }
}




document.addEventListener('keydown', function(e) {
    if (gameOver) return;
  
    const key = e.key || e.keyCode;
  
    if (key === 'Escape' || key === 'Esc') {
      togglePaused();
    }
  
    if (key === 'r' || key === 'R') {
      location.reload();
    }
  
    if (key === 'ArrowLeft' || key === 'Left') {
      let col;
      col = piece.col - 1;
  
      if (validPlacement(piece.matrix, piece.row, col)) {
        piece.col = col;
      }
    }
  
    if (key === 'ArrowRight' || key === 'Right') {
      let col;
      col = piece.col + 1;
  
      if (validPlacement(piece.matrix, piece.row, col)) {
        piece.col = col;
      }
    }
  
    if (key === 'ArrowUp' || key === 'Up') {
      const N = piece.matrix.length - 1;
      const result = piece.matrix.map((row, i) => row.map((val, j) => piece.matrix[N - j][i]));
      const matrix = result;
  
      if (validPlacement(matrix, piece.row, piece.col)) {
        piece.matrix = matrix;
      }
    }
  
    if (key === 'ArrowDown' || key === 'Down') {
        const newRow = piece.row + 1;
        const newCol = piece.col;
    
        if (!validPlacement(piece.matrix, newRow, newCol)) {
            piece.row = newRow - 1;
            place();
            return;
        }
    
        piece.row = newRow;
    }
  
    if (key === ' ') {
      while (!downOne()) {}
    }
  });
  
function downOne() {
    const row = piece.row + 1;
   
       if (!validPlacement(piece.matrix, row, piece.col)) {
         piece.row = row - 1;
   
         place();
         return true;
       }
   
       piece.row = row;
       
       return false;
}