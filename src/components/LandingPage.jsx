import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleNewGame = () => {
    navigate('/game');
  };

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">Sudoku</h1>
        <p className="landing-subtitle">Challenge your mind with a classic puzzle game</p>
        <button className="landing-button" onClick={handleNewGame}>
          New Game
        </button>
      </div>
    </div>
  );
};

export default LandingPage; 