import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  initializeFirestore, 
  persistentLocalCache,
  persistentMultipleTabManager,
  CACHE_SIZE_UNLIMITED
} from 'firebase/firestore';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyBRmWahR-C_udQ6SNyAAs4Q6kiJqB_l0sg",
  authDomain: "sudoku-react-2a9b9.firebaseapp.com",
  projectId: "sudoku-react-2a9b9",
  storageBucket: "sudoku-react-2a9b9.firebasestorage.app",
  messagingSenderId: "920939939242",
  appId: "1:920939939242:web:f7f8f90bbdacfa763897d3",
  measurementId: "G-HH0VMVYE2T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with persistence settings
export const db = initializeFirestore(app, {
  cache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  })
}); 