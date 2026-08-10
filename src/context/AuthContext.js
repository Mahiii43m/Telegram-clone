import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebase'; // Make sure db is imported
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ✅ FIXED: Accept all 4 arguments
  const signUp = async (fullName, phone, email, password) => {
    console.log('🔥 AuthContext signUp called with:', { fullName, phone, email });
    
    // 1. Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    console.log('✅ User created with UID:', uid);

    // 2. Save user profile to Firestore
    await setDoc(doc(db, 'users', uid), {
      fullName,
      phone,
      email: email.toLowerCase(),
      createdAt: new Date().toISOString(),
    });
    console.log('✅ Firestore user data saved');

    return userCredential.user;
  };

  // ✅ signIn remains the same
  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => signOut(auth);

  const value = { user, loading, signUp, signIn, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);