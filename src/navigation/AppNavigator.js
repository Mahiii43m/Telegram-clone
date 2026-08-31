import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ChatsListScreen from '../screens/home/ChatsListScreen';
import ChatWindowScreen from '../screens/chat/ChatWindowScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import BaseScreen from '../screens/BaseScreen';
import NewChatScreen from '../screens/chat/NewChatScreen';
import NewGroupScreen from '../screens/chat/NewGroupScreen';
import AboutScreen from '../screens/settings/AboutScreen';
import AccountScreen from '../screens/settings/AccountScreen';
import ThemeScreen from '../screens/settings/ThemeScreen';
import NotificationsSettingsScreen from '../screens/settings/NotificationsSettingsScreen';
import PrivacySecurityScreen from '../screens/settings/PrivacySecurityScreen';
import HelpFAQScreen from '../screens/settings/HelpFAQScreen';
import ChatSettingsScreen from '../screens/settings/ChatSettingsScreen';
import BackupStorageScreen from '../screens/settings/BackupStorageScreen';
import MessageSettingsScreen from '../screens/settings/MessageSettingsScreen';
// ✅ New DevicesScreen import
import DevicesScreen from '../screens/settings/DevicesScreen';

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
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="NewChat" component={NewChatScreen} options={{ headerShown: false }} />
          <Stack.Screen name="NewGroup" component={NewGroupScreen} options={{ headerShown: false }} />
          
          {/* ─── Settings Sub‑screens ─────────────────────────── */}
          <Stack.Screen name="Account" component={AccountScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} options={{ headerShown: false }} />
          {/* ✅ Devices now uses the real screen */}
          <Stack.Screen name="Devices" component={DevicesScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Chats" component={ChatSettingsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MessageSettings" component={MessageSettingsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="BackupStorage" component={BackupStorageScreen} options={{ headerShown: false }} />
          <Stack.Screen name="NotificationsSettings" component={NotificationsSettingsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="NotificationSound" component={BaseScreen} initialParams={{ title: 'Notification Sound' }} options={{ headerShown: false }} />
          <Stack.Screen name="ThemePicker" component={ThemeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AccentColor" component={BaseScreen} initialParams={{ title: 'Accent Color' }} options={{ headerShown: false }} />
          <Stack.Screen name="HelpFAQ" component={HelpFAQScreen} options={{ headerShown: false }} />
          <Stack.Screen name="About" component={AboutScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}