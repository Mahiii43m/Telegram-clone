import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function SettingsScreen({ navigation }) {
  const { logout } = useAuth();
  const { colors, theme } = useTheme();

  // ✅ Fallback colors if theme is not loaded
  const bgColor = colors?.background || '#ffffff';
  const textColor = colors?.text || '#1a1a1a';
  const borderColor = colors?.border || '#e0e0e0';
  const primaryColor = colors?.primary || '#1B5674';
  const surfaceColor = colors?.surface || '#f5f5f5';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: surfaceColor, borderBottomColor: borderColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backArrow, { color: primaryColor }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Settings Options */}
      <View style={styles.content}>
        <TouchableOpacity style={[styles.option, { borderBottomColor: borderColor }]}>
          <Text style={[styles.optionText, { color: textColor }]}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, { borderBottomColor: borderColor }]}>
          <Text style={[styles.optionText, { color: textColor }]}>Privacy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, { borderBottomColor: borderColor }]}>
          <Text style={[styles.optionText, { color: textColor }]}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, { borderBottomColor: borderColor }]}>
          <Text style={[styles.optionText, { color: textColor }]}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.option, { borderBottomColor: borderColor }]}>
          <Text style={[styles.optionText, { color: textColor }]}>dark mode</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.option, { borderBottomColor: borderColor }]}
          onPress={() => {
            Alert.alert('Theme', 'Theme toggle coming soon!');
          }}
        >
          <Text style={[styles.optionText, { color: textColor }]}>Theme</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Logout', style: 'destructive', onPress: logout }
            ]
          );
        }}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
    width: 40,
  },
  backArrow: {
    fontSize: 28,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
  },
  logoutButton: {
    margin: 20,
    padding: 16,
    backgroundColor: '#cf1508',
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});