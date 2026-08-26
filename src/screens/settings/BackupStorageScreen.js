// src/screens/settings/BackupStorageScreen.js
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
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');
const STORAGE_KEY = 'backup_settings';

export default function BackupStorageScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const [settings, setSettings] = useState({
    autoDownloadImages: true,
    autoDownloadVideos: false,
    autoDownloadAudio: true,
    backupFrequency: 'weekly',
    lastBackup: 'Yesterday, 10:30 AM',
  });
  const [storageUsage, setStorageUsage] = useState({
    chats: 12.5,
    media: 45.8,
    cache: 8.2,
    total: 66.5,
  });
  const [frequencyModalVisible, setFrequencyModalVisible] = useState(false);

  const bgColor = theme?.background || '#0a0e1a';
  const textColor = theme?.textPrimary || '#ffffff';
  const secondaryText = theme?.textSecondary || '#a0a0b0';
  const borderColor = theme?.border || 'rgba(255,255,255,0.08)';
  const cardColor = theme?.surface || 'rgba(255,255,255,0.06)';
  const brandColor = theme?.primary || '#1a4b8c';
  const accentColor = theme?.secondary || '#6c5ce7';
  const goldAccent = theme?.accent || '#de994a';

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.warn('Failed to load backup settings', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.warn('Failed to save backup settings', error);
    }
  };

  const toggleSetting = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const setBackupFrequency = (frequency) => {
    const newSettings = { ...settings, backupFrequency: frequency };
    setSettings(newSettings);
    saveSettings(newSettings);
    setFrequencyModalVisible(false);
  };

  const handleBackupNow = () => {
    Alert.alert('Backup Started', 'Your chat data is being backed up...');
    setTimeout(() => {
      Alert.alert('Backup Complete', 'Your data has been backed up successfully.');
      const newSettings = { ...settings, lastBackup: 'Just now' };
      setSettings(newSettings);
      saveSettings(newSettings);
    }, 1500);
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will remove cached media files. Your chats will not be affected.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => {
            setStorageUsage(prev => ({ ...prev, cache: 0, total: prev.total - prev.cache }));
            Alert.alert('Cache Cleared', 'Cache has been cleared successfully.');
          }
        },
      ]
    );
  };

  const renderToggleRow = (label, key, icon, description) => {
    const isEnabled = settings[key] ?? false;
    return (
      <View style={[styles.toggleRow, { borderBottomColor: borderColor }]}>
        <View style={styles.toggleLabel}>
          <Ionicons name={icon} size={18} color={accentColor} style={styles.toggleIcon} />
          <View style={styles.toggleTextContainer}>
            <Text style={[styles.toggleText, { color: textColor }]}>{label}</Text>
            {description && <Text style={[styles.toggleDescription, { color: secondaryText }]}>{description}</Text>}
          </View>
        </View>
        <Switch
          value={isEnabled}
          onValueChange={() => toggleSetting(key)}
          trackColor={{ false: '#3a3a5a', true: brandColor }}
          thumbColor={isEnabled ? '#ffffff' : '#f4f3f4'}
          ios_backgroundColor="#3a3a5a"
        />
      </View>
    );
  };

  const renderStorageItem = (label, value, icon, color) => (
    <View style={[styles.storageItem, { borderBottomColor: borderColor }]}>
      <View style={styles.storageLeft}>
        <View style={[styles.storageIcon, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={16} color={color} />
        </View>
        <Text style={[styles.storageLabel, { color: textColor }]}>{label}</Text>
      </View>
      <Text style={[styles.storageValue, { color: secondaryText }]}>{value} MB</Text>
    </View>
  );

  const getFrequencyLabel = (freq) => {
    switch (freq) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return 'Weekly';
    }
  };

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
        <Text style={[styles.headerTitle, { color: textColor }]}>Backup & Storage</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Ionicons name="cloud-outline" size={18} color={goldAccent} style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: secondaryText }]}>
            Manage your data, backups, and storage usage.
          </Text>
        </View>

        {/* Storage Usage */}
        <View style={[styles.card, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: secondaryText }]}>Storage Usage</Text>
            <Text style={[styles.storageTotal, { color: textColor }]}>
              {storageUsage.total.toFixed(1)} MB
            </Text>
          </View>
          {renderStorageItem('Chats', storageUsage.chats, 'chatbubbles-outline', brandColor)}
          {renderStorageItem('Media', storageUsage.media, 'image-outline', accentColor)}
          {renderStorageItem('Cache', storageUsage.cache, 'trash-outline', goldAccent)}
          
          <TouchableOpacity style={[styles.clearCacheBtn, { borderColor: borderColor }]} onPress={handleClearCache}>
            <Ionicons name="trash-outline" size={16} color="#c0392b" />
            <Text style={[styles.clearCacheText, { color: '#c0392b' }]}>Clear Cache</Text>
          </TouchableOpacity>
        </View>

        {/* Auto-Download */}
        <View style={[styles.card, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Text style={[styles.cardTitle, { color: secondaryText }]}>Auto-Download</Text>
          {renderToggleRow('Images', 'autoDownloadImages', 'image-outline', 'Download images automatically')}
          {renderToggleRow('Videos', 'autoDownloadVideos', 'videocam-outline', 'Download videos automatically')}
          {renderToggleRow('Audio', 'autoDownloadAudio', 'musical-notes-outline', 'Download audio files automatically')}
        </View>

        {/* Backup */}
        <View style={[styles.card, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: secondaryText }]}>Backup</Text>
            <Text style={[styles.lastBackupText, { color: secondaryText }]}>
              Last: {settings.lastBackup}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.optionRow, { borderBottomColor: borderColor }]}
            onPress={() => setFrequencyModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="calendar-outline" size={18} color={accentColor} style={styles.optionIcon} />
              <Text style={[styles.optionText, { color: textColor }]}>Frequency</Text>
            </View>
            <View style={styles.optionRight}>
              <Text style={[styles.optionValue, { color: secondaryText }]}>
                {getFrequencyLabel(settings.backupFrequency)}
              </Text>
              <Ionicons name="chevron-forward-outline" size={16} color={secondaryText} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.backupNowBtn, { backgroundColor: brandColor }]}
            onPress={handleBackupNow}
            activeOpacity={0.8}
          >
            <Ionicons name="cloud-upload-outline" size={18} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={styles.backupNowText}>Backup Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ─── Frequency Modal ────────────────────────────────── */}
      <Modal
        transparent
        animationType="fade"
        visible={frequencyModalVisible}
        onRequestClose={() => setFrequencyModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setFrequencyModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1e1e30' : '#ffffff', borderColor: borderColor }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Backup Frequency</Text>

            {['daily', 'weekly', 'monthly'].map((freq) => {
              const isSelected = settings.backupFrequency === freq;
              const label = freq.charAt(0).toUpperCase() + freq.slice(1);
              return (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.modalOption,
                    isSelected && {
                      backgroundColor: isDark ? 'rgba(108,92,231,0.2)' : 'rgba(108,92,231,0.08)',
                      borderColor: accentColor,
                      borderWidth: 1.5,
                    },
                  ]}
                  onPress={() => setBackupFrequency(freq)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.modalOptionText, { color: isSelected ? accentColor : textColor }]}>
                    {label}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color={accentColor} />
                  )}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setFrequencyModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={[styles.modalCancelText, { color: secondaryText }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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

  // Info Card
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
  },
  infoIcon: { marginRight: 10 },
  infoText: { flex: 1, fontSize: 13, lineHeight: 18, opacity: 0.7 },

  // Cards
  card: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    paddingTop: 6,
    opacity: 0.6,
  },

  // Storage
  storageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  storageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storageIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  storageLabel: { fontSize: 14, fontWeight: '500' },
  storageValue: { fontSize: 13, fontWeight: '500' },
  storageTotal: { fontSize: 14, fontWeight: '700' },
  clearCacheBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  clearCacheText: { fontSize: 13, fontWeight: '600', marginLeft: 6 },

  // Toggle Row
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  toggleLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleIcon: { marginRight: 12 },
  toggleTextContainer: { flex: 1 },
  toggleText: { fontSize: 15, fontWeight: '500' },
  toggleDescription: { fontSize: 12, opacity: 0.6, marginTop: 1 },

  // Option Row
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  optionIcon: { marginRight: 12 },
  optionText: { fontSize: 15, fontWeight: '500' },
  optionRight: { flexDirection: 'row', alignItems: 'center' },
  optionValue: { fontSize: 14, marginRight: 6, opacity: 0.7 },

  // Backup Now
  backupNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  backupNowText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
  lastBackupText: { fontSize: 12, opacity: 0.6 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalContent: {
    width: width * 0.85,
    maxWidth: 340,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  modalOptionText: { fontSize: 15, fontWeight: '600' },
  modalCancel: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalCancelText: { fontSize: 15, fontWeight: '500' },
});