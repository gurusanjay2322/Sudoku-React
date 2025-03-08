import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function signup(email, password) {
    try {
      setError(null);
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: email,
        gamesPlayed: 0,
        gamesWon: 0,
        createdAt: new Date().toISOString()
      });
      return userCredential;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      setError(null);
      await setPersistence(auth, browserLocalPersistence);
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  async function logout() {
    try {
      setError(null);
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setCurrentUser({ ...user, ...userDoc.data() });
          } else {
            // If user document doesn't exist, create it
            await setDoc(doc(db, 'users', user.uid), {
              email: user.email,
              gamesPlayed: 0,
              gamesWon: 0,
              createdAt: new Date().toISOString()
            });
            setCurrentUser({ ...user, gamesPlayed: 0, gamesWon: 0 });
          }
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    error,
    loading,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 