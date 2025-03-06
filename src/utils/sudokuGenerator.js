// Function to check if a number can be placed in a cell
const isValid = (board, row, col, num) => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }

  // Check 3x3 box
  let boxRow = Math.floor(row / 3) * 3;
  let boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] === num) return false;
    }
  }

  return true;
};

// Function to solve the Sudoku puzzle
const solveSudoku = (board) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

// Function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

// Function to generate a random Sudoku puzzle
export const generateSudoku = () => {
  // Create empty board
  const board = Array(9).fill().map(() => Array(9).fill(0));
  
  // Fill diagonal boxes first
  for (let i = 0; i < 9; i += 3) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleArray(numbers);
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        board[i + row][i + col] = numbers[row * 3 + col];
      }
    }
  }

  // Solve the rest of the puzzle
  solveSudoku(board);

  // Create a copy of the solution
  const solution = board.map(row => [...row]);

  // Remove some numbers to create the puzzle
  const cellsToRemove = 45; // Adjust this number to change difficulty
  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (board[row][col] !== 0) {
      board[row][col] = 0;
      removed++;
    }
  }

  return { board, solution };
}; 