import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
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
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      // fail silently on logout
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);