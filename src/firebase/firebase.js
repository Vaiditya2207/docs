import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // Correct import
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCkLKdHsLBKknv1vCYwToZZ8Yfhj426p_g",
    authDomain: "journal-ae12f.firebaseapp.com",
    projectId: "journal-ae12f",
    storageBucket: "journal-ae12f.appspot.com",
    messagingSenderId: "132763783714",
    appId: "1:132763783714:web:7c9b2b1e1f5e9f7d7d5f1d",
    measurementId: "G-ZGS1HW2JS4"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app); // Initialize Firestore

export { db, storage, auth };