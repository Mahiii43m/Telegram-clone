import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '1:901982597632:android:69ea91f9cf21b0c5c49ee5',
    iosClientId: '1:901982597632:web:22dcc3a54e3e5615c49ee5',
    webClientId: '1:901982597632:web:22dcc3a54e3e5615c49ee5',
    redirectUri: makeRedirectUri({
      scheme: 'orbitchat',
    }),
  });

  // ─── Listen to Firebase Auth State ──────────────────────────────
  useEffect(() => {
    console.log('🔥 AuthContext: Setting up Firebase listener...');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            fullName: userData.fullName || firebaseUser.displayName || 'User',
            phone: userData.phone || '',
            profilePicture: userData.profilePicture || firebaseUser.photoURL || null,
          });
          console.log('✅ User logged in:', firebaseUser.email);
        } else {
          setUser(null);
          console.log('❌ No user logged in');
        }
      } catch (error) {
        console.error('❌ Auth state change error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // ─── Handle Google Sign-In Response ─────────────────────────────
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          const uid = userCredential.user.uid;
          // Save user to Firestore
          await setDoc(
            doc(db, 'users', uid),
            {
              email: userCredential.user.email?.toLowerCase(),
              fullName: userCredential.user.displayName || 'Google User',
              profilePicture: userCredential.user.photoURL || null,
              provider: 'google',
              createdAt: new Date().toISOString(),
            },
            { merge: true }
          );
          console.log('✅ Google sign-in successful');
        })
        .catch((error) => {
          console.error('❌ Google sign-in error:', error);
        });
    }
  }, [response]);

  // ─── Email/Password Login ──────────────────────────────────────
  const login = async (email, password) => {
    console.log('🔐 Attempting login:', email);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Login successful:', userCredential.user.email);
      return userCredential.user;
    } catch (error) {
      console.error('❌ Login error:', error.code, error.message);
      throw error;
    }
  };

  // ─── Sign Up ──────────────────────────────────────────────────────
  const signUp = async (fullName, phone, email, password) => {
    console.log('📝 Attempting sign up:', email);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      console.log('✅ Auth user created:', uid);

      await setDoc(doc(db, 'users', uid), {
        fullName,
        phone,
        email: email.toLowerCase(),
        profilePicture: null,
        provider: 'email',
        createdAt: new Date().toISOString(),
      });
      console.log('✅ Firestore user data saved');

      return userCredential.user;
    } catch (error) {
      console.error('❌ Sign up error:', error.code, error.message);
      throw error;
    }
  };

  // ─── Google Sign-In ─────────────────────────────────────────────
  const signInWithGoogle = async () => {
    console.log('🔑 Attempting Google sign-in...');
    try {
      const result = await promptAsync();
      if (result?.type === 'success') {
        console.log('✅ Google sign-in successful');
        return result;
      } else {
        throw new Error('Google sign-in was cancelled.');
      }
    } catch (error) {
      console.error('❌ Google sign-in error:', error);
      throw error;
    }
  };

  // ─── Logout ──────────────────────────────────────────────────────
  const logout = async () => {
    console.log('🚪 Attempting logout...');
    try {
      await signOut(auth);
      setUser(null);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error.message);
    }
  };

  // ─── Update Profile Picture ──────────────────────────────────────
  const updateProfilePicture = async (imageUri) => {
    console.log('🖼️ Profile picture update requested:', imageUri);
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signUp,
        signInWithGoogle,
        logout,
        updateProfilePicture,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};