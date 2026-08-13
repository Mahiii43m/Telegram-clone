import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ChatsListScreen from '../screens/home/ChatsListScreen';
import ChatWindowScreen from '../screens/chat/ChatWindowScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import BaseScreen from '../screens/BaseScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0c29' }}>
        <ActivityIndicator size="large" color="#6c5ce7" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="ChatsList" component={ChatsListScreen} />
          <Stack.Screen name="ChatWindow" component={ChatWindowScreen} />
          
          {/* Settings & all sub-screens */}
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
          
          {/* Sub-screens for Settings */}
          <Stack.Screen name="Account" component={BaseScreen} initialParams={{ title: 'Account' }} options={{ headerShown: false }} />
          <Stack.Screen name="PrivacySecurity" component={BaseScreen} initialParams={{ title: 'Privacy & Security' }} options={{ headerShown: false }} />
          <Stack.Screen name="Devices" component={BaseScreen} initialParams={{ title: 'Devices' }} options={{ headerShown: false }} />
          <Stack.Screen name="Chats" component={BaseScreen} initialParams={{ title: 'Chats' }} options={{ headerShown: false }} />
          <Stack.Screen name="MessageSettings" component={BaseScreen} initialParams={{ title: 'Message Settings' }} options={{ headerShown: false }} />
          <Stack.Screen name="BackupStorage" component={BaseScreen} initialParams={{ title: 'Backup & Storage' }} options={{ headerShown: false }} />
          <Stack.Screen name="Notifications" component={BaseScreen} initialParams={{ title: 'Notifications' }} options={{ headerShown: false }} />
          <Stack.Screen name="NotificationSound" component={BaseScreen} initialParams={{ title: 'Notification Sound' }} options={{ headerShown: false }} />
          <Stack.Screen name="ThemePicker" component={BaseScreen} initialParams={{ title: 'Theme' }} options={{ headerShown: false }} />
          <Stack.Screen name="AccentColor" component={BaseScreen} initialParams={{ title: 'Accent Color' }} options={{ headerShown: false }} />
          <Stack.Screen name="HelpFAQ" component={BaseScreen} initialParams={{ title: 'Help & FAQ' }} options={{ headerShown: false }} />
          <Stack.Screen name="About" component={BaseScreen} initialParams={{ title: 'About Orbit Chat' }} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}