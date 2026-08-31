// src/screens/settings/NotificationsSettingsScreen.js
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

const STORAGE_KEY = 'notification_preferences';

const DIVISIONS = ['Space Science', 'Geospatial', 'Research', 'Operations'];

export default function NotificationsSettingsScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const [preferences, setPreferences] = useState({
    pushEnabled: true,
    messageNotifications: true,
    groupNotifications: true,
    announcementNotifications: true,
    sound: true,
    vibrate: true,
    showPreview: true,
    urgentPriority: true,
    dailyDigest: false,
    quietHours: false,
    quietHourStart: '22:00',
    quietHourEnd: '06:00',
    eventReminders: true,
    divisionNotifications: {
      'Space Science': true,
      'Geospatial': true,
      'Research': true,
      'Operations': true,
    },
  });

  const bgColor = theme?.background || '#0a0e1a';
  const textColor = theme?.textPrimary || '#ffffff';
  const secondaryText = theme?.textSecondary || '#a0a0b0';
  const borderColor = theme?.border || 'rgba(255,255,255,0.08)';
  const cardColor = theme?.surface || 'rgba(255,255,255,0.06)';
  const brandColor = theme?.primary || '#1a4b8c';
  const accentColor = theme?.secondary || '#6c5ce7';
  const goldAccent = theme?.accent || '#de994a';

  // Load saved preferences
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults to handle new fields
        setPreferences(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.warn('Failed to load notification preferences', error);
    }
  };

  const savePreferences = async (newPrefs) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
    } catch (error) {
      console.warn('Failed to save notification preferences', error);
    }
  };

  const togglePreference = (key) => {
    const newPrefs = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPrefs);
    savePreferences(newPrefs);
  };

  const toggleDivision = (division) => {
    const newDivisions = { ...preferences.divisionNotifications };
    newDivisions[division] = !newDivisions[division];
    const newPrefs = { ...preferences, divisionNotifications: newDivisions };
    setPreferences(newPrefs);
    savePreferences(newPrefs);
  };

  const renderToggleRow = (label, key, icon) => (
    <View style={[styles.toggleRow, { borderBottomColor: borderColor }]}>
      <View style={styles.toggleLabel}>
        {icon && <Ionicons name={icon} size={20} color={secondaryText} style={styles.toggleIcon} />}
        <Text style={[styles.toggleText, { color: textColor }]}>{label}</Text>
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

  const renderDivisionToggle = (division) => (
    <View style={[styles.toggleRow, { borderBottomColor: borderColor, paddingLeft: 24 }]}>
      <View style={styles.toggleLabel}>
        <Ionicons name="radio-button-on-outline" size={16} color={accentColor} style={styles.toggleIcon} />
        <Text style={[styles.toggleText, { color: textColor }]}>{division}</Text>
      </View>
      <Switch
        value={preferences.divisionNotifications?.[division] ?? true}
        onValueChange={() => toggleDivision(division)}
        trackColor={{ false: '#3a3a5a', true: brandColor }}
        thumbColor={preferences.divisionNotifications?.[division] ? '#ffffff' : '#f4f3f4'}
        ios_backgroundColor="#3a3a5a"
      />
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
        <Text style={[styles.headerTitle, { color: textColor }]}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.infoCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Ionicons name="notifications-outline" size={28} color={goldAccent} style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: secondaryText }]}>
            Manage how and when you receive notifications. Changes are saved automatically.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Text style={[styles.sectionTitle, { color: secondaryText }]}>General</Text>
          {renderToggleRow('Push Notifications', 'pushEnabled', 'notifications-outline')}
        </View>

        <View style={[styles.section, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Text style={[styles.sectionTitle, { color: secondaryText }]}>Notification Types</Text>
          {renderToggleRow('Messages', 'messageNotifications', 'chatbubble-outline')}
          {renderToggleRow('Groups & Departments', 'groupNotifications', 'people-outline')}
          {renderToggleRow('SSGI Announcements', 'announcementNotifications', 'megaphone-outline')}
          {renderToggleRow('🚨 Urgent Priority', 'urgentPriority', 'alert-circle-outline')}
          {renderToggleRow('📅 Event Reminders', 'eventReminders', 'calendar-outline')}
        </View>

        <View style={[styles.section, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Text style={[styles.sectionTitle, { color: secondaryText }]}>Divisions</Text>
          <Text style={[styles.sectionSubtitle, { color: secondaryText }]}>
            Choose which divisions you want to hear from
          </Text>
          {DIVISIONS.map((div) => renderDivisionToggle(div))}
        </View>

        <View style={[styles.section, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Text style={[styles.sectionTitle, { color: secondaryText }]}>Sound & Vibration</Text>
          {renderToggleRow('Sound', 'sound', 'musical-note-outline')}
          {renderToggleRow('Vibrate', 'vibrate', 'phone-portrait-outline')}
        </View>

        <View style={[styles.section, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Text style={[styles.sectionTitle, { color: secondaryText }]}>Advanced</Text>
          {renderToggleRow('Daily Digest (8:00 AM)', 'dailyDigest', 'time-outline')}
          {renderToggleRow('Quiet Hours (22:00 – 06:00)', 'quietHours', 'moon-outline')}
          {renderToggleRow('Show message preview', 'showPreview', 'eye-outline')}
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
    marginBottom: 20,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  section: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
    paddingTop: 8,
  },
  sectionSubtitle: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  toggleLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleIcon: {
    marginRight: 12,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
  },
});