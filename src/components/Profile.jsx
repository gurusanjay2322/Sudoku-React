import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
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

  useEffect(() => {
    async function loadUserData() {
      try {
        // Get user stats
        const userDoc = await getDocs(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setStats({
            gamesPlayed: userData.gamesPlayed || 0,
            gamesWon: userData.gamesWon || 0,
            winRate: userData.gamesPlayed ? 
              Math.round((userData.gamesWon / userData.gamesPlayed) * 100) : 0
          });
        }

        // Get recent games
        const gamesQuery = query(
          collection(db, 'games'),
          where('userId', '==', currentUser.uid)
        );
        const gamesSnapshot = await getDocs(gamesQuery);
        const games = gamesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRecentGames(games.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5));
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2 className="profile-title">Profile</h2>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        
        <div className="profile-info">
          <div className="info-group">
            <label>Email</label>
            <p>{currentUser.email}</p>
          </div>
          <div className="info-group">
            <label>Member Since</label>
            <p>{new Date(currentUser.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="stats-section">
          <h3>Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">{stats.gamesPlayed}</span>
              <span className="stat-label">Games Played</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.gamesWon}</span>
              <span className="stat-label">Games Won</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.winRate}%</span>
              <span className="stat-label">Win Rate</span>
            </div>
          </div>
        </div>

        <div className="recent-games">
          <h3>Recent Games</h3>
          {recentGames.length > 0 ? (
            <div className="games-list">
              {recentGames.map(game => (
                <div key={game.id} className="game-item">
                  <span className="game-date">
                    {new Date(game.timestamp).toLocaleDateString()}
                  </span>
                  <span className={`game-result ${game.won ? 'won' : 'lost'}`}>
                    {game.won ? 'Won' : 'Lost'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-games">No games played yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 