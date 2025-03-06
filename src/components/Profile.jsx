import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/profile.css';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    winRate: 0
  });
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isSubscribed = true;

    async function loadUserData() {
      if (!currentUser) {
        console.log('No current user found');
        if (isSubscribed) {
          setLoading(false);
        }
        return;
      }

      try {
        console.log('Loading user data for:', currentUser.uid);
        
        // Get user stats
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('User data:', userData);
          if (isSubscribed) {
            setStats({
              gamesPlayed: userData.gamesPlayed || 0,
              gamesWon: userData.gamesWon || 0,
              winRate: userData.gamesPlayed ? 
                Math.round((userData.gamesWon / userData.gamesPlayed) * 100) : 0
            });
          }
        } else {
          console.log('No user document found');
          if (isSubscribed) {
            setStats({
              gamesPlayed: 0,
              gamesWon: 0,
              winRate: 0
            });
          }
        }

        // Get recent games
        console.log('Loading recent games');
        const gamesQuery = query(
          collection(db, 'games'),
          where('userId', '==', currentUser.uid)
        );
        const gamesSnapshot = await getDocs(gamesQuery);
        const games = gamesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('Recent games:', games);
        if (isSubscribed) {
          setRecentGames(games.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        if (isSubscribed) {
          setError(error.message);
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    }

    setLoading(true);
    loadUserData();

    return () => {
      isSubscribed = false;
    };
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
      setError(error.message);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div 
          key="loading"
          className="profile-loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h1>Loading...</h1>
          <p>Please wait while we load your profile data.</p>
        </motion.div>
      ) : error ? (
        <motion.div 
          key="error"
          className="profile-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="profile-card">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </motion.div>
      ) : !currentUser ? (
        <motion.div 
          key="not-logged-in"
          className="profile-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="profile-card">
            <h2>Not Logged In</h2>
            <p>Please log in to view your profile.</p>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key="profile"
          className="profile-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="profile-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="profile-header"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="profile-title">Profile</h2>
              <motion.button 
                className="logout-button" 
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            </motion.div>
            
            <motion.div 
              className="profile-info"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="info-group">
                <label>Email</label>
                <p>{currentUser.email}</p>
              </div>
              <div className="info-group">
                <label>Member Since</label>
                <p>{new Date(currentUser.createdAt).toLocaleDateString()}</p>
              </div>
            </motion.div>

            <motion.div 
              className="stats-section"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h3>Statistics</h3>
              <div className="stats-grid">
                <motion.div 
                  className="stat-card"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="stat-value">{stats.gamesPlayed}</span>
                  <span className="stat-label">Games Played</span>
                </motion.div>
                <motion.div 
                  className="stat-card"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="stat-value">{stats.gamesWon}</span>
                  <span className="stat-label">Games Won</span>
                </motion.div>
                <motion.div 
                  className="stat-card"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="stat-value">{stats.winRate}%</span>
                  <span className="stat-label">Win Rate</span>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="recent-games"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h3>Recent Games</h3>
              {recentGames.length > 0 ? (
                <div className="games-list">
                  {recentGames.map((game, index) => (
                    <motion.div 
                      key={game.id} 
                      className="game-item"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      whileHover={{ x: 5 }}
                      transition={{ delay: index * 0.1, duration: 0.2 }}
                    >
                      <span className="game-date">
                        {new Date(game.timestamp).toLocaleDateString()}
                      </span>
                      <span className={`game-result ${game.won ? 'won' : 'lost'}`}>
                        {game.won ? 'Won' : 'Lost'}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="no-games">No games played yet</p>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Profile; 