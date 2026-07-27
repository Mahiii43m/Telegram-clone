import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCGOfX6MV7OljGwBAOui7grg9bHBQtHO3M",
  authDomain: "orbit2-e551b.firebaseapp.com",
  projectId: "orbit2-e551b",
  storageBucket: "orbit2-e551b.appspot.com",
  messagingSenderId: "901982597632",
  appId: "1:901982597632:web:22dcc3a54e3e5615c49ee5",
  measurementId: "G-Y8Z7H9SBJF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);