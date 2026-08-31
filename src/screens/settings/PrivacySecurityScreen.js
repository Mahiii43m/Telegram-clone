// src/screens/settings/PrivacySecurityScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';

const STORAGE_KEY = 'privacy_preferences';

export default function PrivacySecurityScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const [preferences, setPreferences] = useState({
    lastSeen: true,
    readReceipts: true,
    onlineStatus: true,
    profilePhoto: true,
    twoFactorAuth: false,
  });
  const [blockedUsers] = useState(['User1', 'User2']);

  const bgColor = theme?.background || '#0a0e1a';
  const textColor = theme?.textPrimary || '#ffffff';
  const secondaryText = theme?.textSecondary || '#a0a0b0';
  const borderColor = theme?.border || 'rgba(255,255,255,0.08)';
  const cardColor = theme?.surface || 'rgba(255,255,255,0.06)';
  const brandColor = theme?.primary || '#1a4b8c';
  const accentColor = theme?.secondary || '#6c5ce7';
  const goldAccent = theme?.accent || '#de994a';

  const [activeSessions] = useState([
    { device: 'iPhone 15 Pro', location: 'Addis Ababa', lastActive: 'Now' },
    { device: 'MacBook Pro', location: 'Addis Ababa', lastActive: '2 hours ago' },
  ]);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setPreferences(JSON.parse(saved));
      }
    } catch (error) {
      console.warn('Failed to load privacy preferences', error);
    }
  };

  const savePreferences = async (newPrefs) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
    } catch (error) {
      console.warn('Failed to save privacy preferences', error);
    }
  };

  const togglePreference = (key) => {
    const newPrefs = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPrefs);
    savePreferences(newPrefs);
  };

  const renderToggleRow = (label, key, icon, description) => (
    <View style={[styles.toggleRow, { borderBottomColor: borderColor }]}>
      <View style={styles.toggleLabel}>
        {icon && <Ionicons name={icon} size={20} color={secondaryText} style={styles.toggleIcon} />}
        <View>
          <Text style={[styles.toggleText, { color: textColor }]}>{label}</Text>
          {description && <Text style={[styles.toggleDescription, { color: secondaryText }]}>{description}</Text>}
        </View>
      </View>
      <Switch
        value={preferences[key] ?? false}
        onValueChange={() => togglePreference(key)}
        trackColor={{ false: '#3a3a5a', true: brandColor }}
        thumbColor={preferences[key] ? '#ffffff' : '#f4f3f4'}
        ios_backgroundColor="#3a3a5a"
      />
    </View>
  );

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleBlockedUsers = () => {
    Alert.alert('Blocked Users', blockedUsers.length > 0 ? blockedUsers.join('\n') : 'No users blocked.');
  };

  const handleDownloadData = () => {
    Alert.alert('Download My Data', 'Your data export is being prepared. You will receive a download link shortly.');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Account Deleted', 'Your account has been scheduled for deletion.') },
      ]
    );
  };

  const renderSecurityStatus = () => (
    <View style={[styles.securityStatus, { backgroundColor: cardColor, borderColor: borderColor }]}>
      <View style={styles.securityStatusLeft}>
        <Ionicons name="shield-checkmark-outline" size={24} color="#34c759" />
        <Text style={[styles.securityStatusTitle, { color: textColor }]}>Your account is secure</Text>
      </View>
      <View style={styles.securityStatusBadge}>
        <Text style={[styles.securityStatusText, { color: '#34c759' }]}>Active</Text>
      </View>
    </View>
  );

  const renderSessionItem = (session, index) => (
    <View key={index} style={[styles.sessionItem, { borderBottomColor: borderColor }]}>
      <View style={styles.sessionLeft}>
        <Ionicons name="phone-portrait-outline" size={20} color={accentColor} style={styles.sessionIcon} />
        <View>
          <Text style={[styles.sessionDevice, { color: textColor }]}>{session.device}</Text>
          <Text style={[styles.sessionLocation, { color: secondaryText }]}>{session.location} • {session.lastActive}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.sessionAction}>
        <Text style={[styles.sessionActionText, { color: accentColor }]}>Revoke</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <LinearGradient
        colors={isDark ? ['#0a0e1a', '#1a2a4a'] : ['#f5f3ff', '#e0d5ff']}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back-outline" size={28} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Privacy & Security</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Ionicons name="shield-checkmark-outline" size={28} color={goldAccent} style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: secondaryText }]}>
            Control your privacy and security settings. Changes are saved automatically.
          </Text>
        </View>

        {/* Security Status */}
        {renderSecurityStatus()}

        {/* Privacy Section */}
        <View style={[styles.section, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Text style={[styles.sectionTitle, { color: secondaryText }]}>Privacy</Text>
          {renderToggleRow('Last Seen', 'lastSeen', 'time-outline', 'Show when you were last active')}
          {renderToggleRow('Read Receipts', 'readReceipts', 'checkmark-done-outline', 'Show when you\'ve read messages')}
          {renderToggleRow('Online Status', 'onlineStatus', 'radio-button-on-outline', 'Show when you\'re online')}
          {renderToggleRow('Profile Photo', 'profilePhoto', 'image-outline', 'Allow others to see your photo')}
        </View>

        {/* Security Section */}
        <View style={[styles.section, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Text style={[styles.sectionTitle, { color: secondaryText }]}>Security</Text>
          {renderToggleRow('Two‑Factor Authentication', 'twoFactorAuth', 'lock-closed-outline', 'Add an extra layer of security')}
          <TouchableOpacity style={[styles.optionRow, { borderBottomColor: borderColor }]} onPress={handleChangePassword}>
            <View style={styles.toggleLabel}>
              <Ionicons name="key-outline" size={20} color={secondaryText} style={styles.toggleIcon} />
              <Text style={[styles.toggleText, { color: textColor }]}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color={secondaryText} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionRow, { borderBottomColor: borderColor }]} onPress={handleBlockedUsers}>
            <View style={styles.toggleLabel}>
              <Ionicons name="ban-outline" size={20} color={secondaryText} style={styles.toggleIcon} />
              <Text style={[styles.toggleText, { color: textColor }]}>Blocked Users</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color={secondaryText} />
          </TouchableOpacity>
        </View>

        {/* Active Sessions */}
        <View style={[styles.section, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Text style={[styles.sectionTitle, { color: secondaryText }]}>Active Sessions</Text>
          {activeSessions.map((session, index) => renderSessionItem(session, index))}
          <TouchableOpacity style={styles.optionRow}>
            <View style={styles.toggleLabel}>
              <Ionicons name="refresh-outline" size={20} color={secondaryText} style={styles.toggleIcon} />
              <Text style={[styles.toggleText, { color: textColor }]}>Log Out All Devices</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color={secondaryText} />
          </TouchableOpacity>
        </View>

        {/* Data & Privacy */}
        <View style={[styles.section, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Text style={[styles.sectionTitle, { color: secondaryText }]}>Data & Privacy</Text>
          <TouchableOpacity style={[styles.optionRow, { borderBottomColor: borderColor }]} onPress={handleDownloadData}>
            <View style={styles.toggleLabel}>
              <Ionicons name="download-outline" size={20} color={secondaryText} style={styles.toggleIcon} />
              <Text style={[styles.toggleText, { color: textColor }]}>Download My Data</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color={secondaryText} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionRow, { borderBottomColor: borderColor }]} onPress={handleDeleteAccount}>
            <View style={styles.toggleLabel}>
              <Ionicons name="trash-outline" size={20} color="#c0392b" style={styles.toggleIcon} />
              <Text style={[styles.toggleText, { color: '#c0392b' }]}>Delete Account</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color={secondaryText} />
          </TouchableOpacity>
        </View>

        {/* Security Tips */}
        <View style={[styles.tipsCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Text style={[styles.tipsTitle, { color: textColor }]}>🛡️ Security Tips</Text>
          <Text style={[styles.tipItem, { color: secondaryText }]}>• Use a strong, unique password</Text>
          <Text style={[styles.tipItem, { color: secondaryText }]}>• Enable two‑factor authentication</Text>
          <Text style={[styles.tipItem, { color: secondaryText }]}>• Review your active sessions regularly</Text>
          <Text style={[styles.tipItem, { color: secondaryText }]}>• Never share your verification codes</Text>
        </View>

        {/* Encryption Card */}
        <View style={[styles.encryptionCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Ionicons name="lock-closed-outline" size={22} color={accentColor} style={styles.encryptionIcon} />
          <View>
            <Text style={[styles.encryptionTitle, { color: textColor }]}>End‑to‑End Encryption</Text>
            <Text style={[styles.encryptionText, { color: secondaryText }]}>
              All messages are encrypted. Only you and the recipient can read them.
            </Text>
          </View>
        </View>
      </ScrollView>
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
  headerTitle: { fontSize: 20, fontWeight: '700', flex: 1, textAlign: 'center' },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  infoIcon: { marginRight: 12 },
  infoText: { flex: 1, fontSize: 14, lineHeight: 20, opacity: 0.8 },
  securityStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  securityStatusLeft: { flexDirection: 'row', alignItems: 'center' },
  securityStatusTitle: { fontSize: 16, fontWeight: '600', marginLeft: 10 },
  securityStatusBadge: { backgroundColor: '#34c75920', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  securityStatusText: { fontSize: 13, fontWeight: '600' },
  section: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5, marginBottom: 6, paddingTop: 8 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  toggleLabel: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  toggleIcon: { marginRight: 12 },
  toggleText: { fontSize: 16, fontWeight: '500' },
  toggleDescription: { fontSize: 12, opacity: 0.6, marginTop: 2 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  sessionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  sessionIcon: { marginRight: 12 },
  sessionDevice: { fontSize: 15, fontWeight: '500' },
  sessionLocation: { fontSize: 12, opacity: 0.6, marginTop: 2 },
  sessionAction: { padding: 6 },
  sessionActionText: { fontSize: 14, fontWeight: '600' },
  tipsCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  tipsTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  tipItem: { fontSize: 14, opacity: 0.7, paddingVertical: 3 },
  encryptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  encryptionIcon: { marginRight: 14 },
  encryptionTitle: { fontSize: 16, fontWeight: '600' },
  encryptionText: { fontSize: 13, opacity: 0.6, marginTop: 2 },
});