import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { doc, updateDoc, collection, addDoc, increment } from 'firebase/firestore';
import { generateSudoku } from '../utils/sudokuGenerator';

const SudokuBoard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [game, setGame] = useState(null);
  const [board, setBoard] = useState(Array(9).fill().map(() => Array(9).fill(0)));
  const [solution, setSolution] = useState(Array(9).fill().map(() => Array(9).fill(0)));
  const [selectedCell, setSelectedCell] = useState(null);
  const [errors, setErrors] = useState(new Set());
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [hintedCells, setHintedCells] = useState(new Set());
  const [startTime, setStartTime] = useState(null);

  // Initialize new game
  useEffect(() => {
    const newGame = generateSudoku();
    setGame(newGame);
    setBoard(newGame.board);
    setSolution(newGame.solution);
    setStartTime(Date.now());
  }, []);

  const isValidMove = (row, col, num) => {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (x !== col && board[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (x !== row && board[x][col] === num) return false;
    }

    // Check 3x3 box
    let boxRow = Math.floor(row / 3) * 3;
    let boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (boxRow + i !== row && boxCol + j !== col && 
            board[boxRow + i][boxCol + j] === num) return false;
      }
    }

    return true;
  };

  const isPuzzleComplete = () => {
    return board.every((row, rowIndex) => 
      row.every((cell, colIndex) => cell === solution[rowIndex][colIndex])
    );
  };

  const saveGameData = async (won) => {
    try {
      // Update user stats
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        gamesPlayed: increment(1),
        gamesWon: won ? increment(1) : increment(0)
      });

      // Save game record
      await addDoc(collection(db, 'games'), {
        userId: currentUser.uid,
        timestamp: Date.now(),
        won,
        duration: Date.now() - startTime,
        hintsUsed: 3 - hintsRemaining
      });
    } catch (error) {
      console.error('Error saving game data:', error);
    }
  };

  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (num) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;
    const newBoard = [...board];
    newBoard[row][col] = num;
    setBoard(newBoard);

    if (!isValidMove(row, col, num)) {
      setErrors(prev => new Set([...prev, `${row}-${col}`]));
    } else {
      setErrors(prev => {
        const newErrors = new Set(prev);
        newErrors.delete(`${row}-${col}`);
        return newErrors;
      });
    }

    // Check if puzzle is complete after the move
    if (isPuzzleComplete()) {
      saveGameData(true);
      alert('Congratulations! You solved the puzzle!');
    }
  };

  const handleKeyPress = (e) => {
    if (!selectedCell) return;
    
    const num = parseInt(e.key);
    if (num >= 1 && num <= 9) {
      handleNumberInput(num);
    }
  };

  const handleNewGame = async () => {
    // Save current game as lost if it's not complete
    if (!isPuzzleComplete()) {
      await saveGameData(false);
    }

    const newGame = generateSudoku();
    setGame(newGame);
    setBoard(newGame.board);
    setSolution(newGame.solution);
    setErrors(new Set());
    setSelectedCell(null);
    setHintsRemaining(3);
    setHintedCells(new Set());
    setStartTime(Date.now());
  };

  const handleHint = () => {
    if (hintsRemaining <= 0) {
      alert('No hints remaining!');
      return;
    }

    // Find an empty cell that hasn't been hinted yet
    let emptyCells = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0 && !hintedCells.has(`${row}-${col}`)) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      alert('No empty cells to hint!');
      return;
    }

    // Randomly select an empty cell
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const { row, col } = randomCell;

    // Update the board with the correct number
    const newBoard = [...board];
    newBoard[row][col] = solution[row][col];
    setBoard(newBoard);

    // Mark this cell as hinted
    setHintedCells(prev => new Set([...prev, `${row}-${col}`]));
    
    // Decrease remaining hints
    setHintsRemaining(prev => prev - 1);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedCell, board]);

  if (!game) return null;

  return (
    <div className="sudoku-container">
      <div className="sudoku-card">
        <div className="sudoku-header">
          <h1 className="sudoku-title">Sudoku</h1>
          <div className="button-group">
            <button className="sudoku-button new-game-button" onClick={handleNewGame}>
              New Game
            </button>
            <button 
              className={`sudoku-button hint-button ${hintsRemaining === 0 ? 'disabled' : ''}`}
              onClick={handleHint}
              disabled={hintsRemaining === 0}
            >
              Hint ({hintsRemaining})
            </button>
            <button 
              className="sudoku-button profile-button"
              onClick={() => navigate('/profile')}
            >
              Profile
            </button>
          </div>
        </div>
        <div className="sudoku-board">
          <div className="sudoku-grid">
            {board.map((row, rowIndex) => (
              row.map((cell, colIndex) => (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  type="number"
                  min="1"
                  max="9"
                  value={cell || ''}
                  readOnly={game.board[rowIndex][colIndex] !== 0 || hintedCells.has(`${rowIndex}-${colIndex}`)}
                  className={`sudoku-cell ${
                    (rowIndex + 1) % 3 === 0 ? 'border-bottom' : ''
                  } ${
                    (colIndex + 1) % 3 === 0 ? 'border-right' : ''
                  } ${
                    errors.has(`${rowIndex}-${colIndex}`) ? 'error' : ''
                  } ${
                    hintedCells.has(`${rowIndex}-${colIndex}`) ? 'hinted' : ''
                  }`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 1 && value <= 9) {
                      handleNumberInput(value);
                    }
                  }}
                />
              ))
            ))}
          </div>
          
          <div className="sudoku-numbers">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                className="sudoku-button"
                onClick={() => handleNumberInput(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
        <div className="sudoku-instructions">
          <p>Click on a cell and use numbers 1-9 to play</p>
          <p>Or use the number buttons below the board</p>
          <p>You have {hintsRemaining} hints remaining</p>
        </div>
      </div>
    </div>
  );
};

export default SudokuBoard; 