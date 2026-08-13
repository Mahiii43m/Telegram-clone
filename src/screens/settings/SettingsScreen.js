import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
  Switch,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const LOGO_IMAGE = require('../../../assets/icon.png');

export default function SettingsScreen({ navigation }) {
  const { logout, user } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  // Theme colors
  const bgColor = theme?.background || '#0a0e1a';
  const textColor = theme?.textPrimary || '#ffffff';
  const secondaryText = theme?.textSecondary || '#a0a0b0';
  const borderColor = theme?.border || 'rgba(255,255,255,0.08)';
  const cardColor = theme?.surface || 'rgba(255,255,255,0.06)';
  const brandColor = theme?.primary || '#1a4b8c';       // Royal Blue
  const accentColor = theme?.secondary || '#6c5ce7';    // Space Purple
  const goldAccent = theme?.accent || '#de994a';        // Earth Gold

  const navigateTo = (screen) => {
    try {
      const routes = navigation.getState()?.routes.map(r => r.name) || [];
      if (routes.includes(screen)) {
        navigation.navigate(screen);
      } else {
        Alert.alert(screen, 'Coming soon! 🚀');
      }
    } catch {
      Alert.alert('Coming soon', 'This feature is on its way!');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleToggleDarkMode = () => {
    toggleTheme();
  };

  const renderSectionHeader = (title) => (
    <View style={styles.sectionHeaderContainer}>
      <Text style={[styles.sectionHeader, { color: secondaryText }]}>{title}</Text>
    </View>
  );

  const renderNavItem = (label, screenName, iconName) => (
    <TouchableOpacity
      style={[styles.option, { backgroundColor: cardColor }]}
      onPress={() => navigateTo(screenName)}
      activeOpacity={0.6}
    >
      <View style={styles.optionLeft}>
        <Ionicons name={iconName} size={20} color={accentColor} style={styles.optionIcon} />
        <Text style={[styles.optionText, { color: textColor }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={18} color={secondaryText} />
    </TouchableOpacity>
  );

  const renderToggleItem = (label, value, onToggle, iconName) => (
    <View style={[styles.option, { backgroundColor: cardColor }]}>
      <View style={styles.optionLeft}>
        <Ionicons name={iconName} size={20} color={accentColor} style={styles.optionIcon} />
        <Text style={[styles.optionText, { color: textColor }]}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#3a3a5a', true: brandColor }}
        thumbColor={value ? '#ffffff' : '#f4f3f4'}
        ios_backgroundColor="#3a3a5a"
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />

      <LinearGradient
        colors={isDark ? ['#0a0e1a', '#1a2a4a'] : ['#f5f3ff', '#e0d5ff']}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back-outline" size={28} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={[styles.profileCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
        <View style={styles.avatarContainer}>
          <Image source={LOGO_IMAGE} style={styles.avatarLogo} resizeMode="contain" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: textColor }]}>
            {user?.name || 'Orbit User'}
          </Text>
          <Text style={[styles.profileEmail, { color: secondaryText }]}>
            {user?.email || 'orbiting@chat.com'}
          </Text>
        </View>
        <TouchableOpacity style={styles.editIcon}>
          <Ionicons name="pencil-outline" size={20} color={secondaryText} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {renderSectionHeader('PROFILE & ACCOUNT')}
        {renderNavItem('Account', 'Account', 'person-outline')}
        {renderNavItem('Privacy & Security', 'PrivacySecurity', 'lock-closed-outline')}
        {renderNavItem('Devices', 'Devices', 'phone-portrait-outline')}

        {renderSectionHeader('CHATS & MESSAGES')}
        {renderNavItem('Chats', 'Chats', 'chatbubbles-outline')}
        {renderNavItem('Message Settings', 'MessageSettings', 'settings-outline')}
        {renderNavItem('Backup & Storage', 'BackupStorage', 'cloud-outline')}

        {renderSectionHeader('NOTIFICATIONS & SOUNDS')}
        {renderNavItem('Notifications', 'Notifications', 'notifications-outline')}
        {renderNavItem('Notification Sound', 'NotificationSound', 'musical-notes-outline')}

        {renderSectionHeader('APPEARANCE')}
        {renderNavItem('Theme', 'ThemePicker', 'color-palette-outline')}
        {renderToggleItem('Dark Mode', isDark, handleToggleDarkMode, 'moon-outline')}
        {renderNavItem('Accent Color', 'AccentColor', 'color-filter-outline')}

        {renderSectionHeader('SUPPORT & ABOUT')}
        {renderNavItem('Help & FAQ', 'HelpFAQ', 'help-circle-outline')}
        {renderNavItem('About Orbit Chat', 'About', 'information-circle-outline')}

        <View style={{ height: 20 }} />
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
        <Ionicons name="log-out-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: secondaryText }]}>
          Orbit Chat v1.0.0
        </Text>
        <Text style={[styles.footerSubtext, { color: secondaryText }]}>
          Secure Communication for Space & Geospatial Teams
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: { padding: 4, width: 40 },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
    flex: 1,
    textAlign: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileInfo: { flex: 1, marginLeft: 14 },
  profileName: {
    fontSize: 17,
    fontWeight: '600',
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  editIcon: { padding: 8 },
  scrollContent: { paddingBottom: 10 },
  sectionHeaderContainer: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginVertical: 2,
    borderRadius: 12,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: { marginRight: 14 },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    padding: 16,
    backgroundColor: '#c0392b',
    borderRadius: 14,
    marginTop: 0,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.6,
  },
  footerSubtext: {
    fontSize: 11,
    marginTop: 2,
    opacity: 0.4,
  },
});