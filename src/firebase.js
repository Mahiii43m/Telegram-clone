import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD5ZtP4j7OqvVtGQl8ULO7nNsbiHj0TQw4",
  authDomain: "orbit2-e551b.firebaseapp.com",
  databaseURL: "https://orbit2-e551b-default-rtdb.firebaseio.com",
  projectId: "orbit2-e551b",
  storageBucket: "orbit2-e551b.firebasestorage.app",
  messagingSenderId: "901982597632",
  appId: "1:901982597632:web:22dcc3a54e3e5615c49ee5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);