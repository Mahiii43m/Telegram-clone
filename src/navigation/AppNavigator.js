// src/navigation/AppNavigator.js
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import Dashboard from '../screens/Dashboard';                 // ✅ NEW
import ChatsListScreen from '../screens/home/ChatsListScreen';
import ChatWindowScreen from '../screens/chat/ChatWindowScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator size="large" color="#DD984B" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        // Not logged in → Login/SignUp
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      ) : (
        // Logged in → Dashboard is now the first screen
        <>
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="ChatsList" component={ChatsListScreen} />
          <Stack.Screen name="ChatWindow" component={ChatWindowScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}