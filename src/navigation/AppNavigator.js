import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import ChatsListScreen from '../screens/home/ChatsListScreen';
import ChatWindowScreen from '../screens/chat/ChatWindowScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  // Show a blank loading screen while AsyncStorage is being read
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
        // Not logged in — show Login screen first
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        // Logged in — show main app screens
        <>
          <Stack.Screen name="ChatsList" component={ChatsListScreen} />
          <Stack.Screen name="ChatWindow" component={ChatWindowScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}