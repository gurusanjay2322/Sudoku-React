import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/landing.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleNewGame = () => {
    navigate('/game');
  };

  return (
    <motion.div 
      className="landing-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="landing-content"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.h1 
          className="landing-title"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Sudoku
        </motion.h1>
        <motion.p 
          className="landing-subtitle"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Challenge yourself with our modern Sudoku game
        </motion.p>
        <motion.button
          className="landing-button"
          onClick={handleNewGame}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          New Game
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default LandingPage; 