// src/screens/settings/ChatSettingsScreen.js
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
const STORAGE_KEY = 'chat_settings';

export default function ChatSettingsScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const [settings, setSettings] = useState({
    fontSize: 'medium',
    enterToSend: true,
    doubleTapReply: true,
    showPreviews: true,
    wallpaper: 'default',
  });
  const [modalVisible, setModalVisible] = useState(false);

  const bgColor = theme?.background || '#0a0e1a';
  const textColor = theme?.textPrimary || '#ffffff';
  const secondaryText = theme?.textSecondary || '#a0a0b0';
  const borderColor = theme?.border || 'rgba(255,255,255,0.08)';
  const cardColor = theme?.surface || 'rgba(255,255,255,0.06)';
  const brandColor = theme?.primary || '#1a4b8c';
  const accentColor = theme?.secondary || '#6c5ce7';
  const goldAccent = theme?.accent || '#de994a';
  const modalBg = isDark ? '#1e1e30' : '#ffffff';

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
      console.warn('Failed to load chat settings', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.warn('Failed to save chat settings', error);
    }
  };

  const toggleSetting = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const setFontSize = (size) => {
    const newSettings = { ...settings, fontSize: size };
    setSettings(newSettings);
    saveSettings(newSettings);
    setModalVisible(false);
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

  const chooseWallpaper = () => {
    Alert.alert('Choose Wallpaper', 'Select a wallpaper for your chats.', [
      { text: 'Default', onPress: () => updateWallpaper('default') },
      { text: 'Dark', onPress: () => updateWallpaper('dark') },
      { text: 'Light', onPress: () => updateWallpaper('light') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const updateWallpaper = (wallpaper) => {
    const newSettings = { ...settings, wallpaper };
    setSettings(newSettings);
    saveSettings(newSettings);
    Alert.alert('Wallpaper Updated', `Chat wallpaper set to ${wallpaper}.`);
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
        <Text style={[styles.headerTitle, { color: textColor }]}>Chats</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.infoCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Ionicons name="chatbubbles-outline" size={18} color={goldAccent} style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: secondaryText }]}>
            Customise your chat experience. Changes are saved automatically.
          </Text>
        </View>

        {/* Font Size */}
        <View style={[styles.card, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Text style={[styles.cardTitle, { color: secondaryText }]}>Font Size</Text>
          <TouchableOpacity
            style={[styles.optionRow, { borderBottomColor: borderColor }]}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="text-outline" size={18} color={accentColor} style={styles.optionIcon} />
              <Text style={[styles.optionText, { color: textColor }]}>Chat Font Size</Text>
            </View>
            <View style={styles.optionRight}>
              <Text style={[styles.optionValue, { color: secondaryText }]}>
                {settings.fontSize === 'small' ? 'Small' : settings.fontSize === 'medium' ? 'Medium' : 'Large'}
              </Text>
              <Ionicons name="chevron-forward-outline" size={16} color={secondaryText} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Behavior */}
        <View style={[styles.card, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Text style={[styles.cardTitle, { color: secondaryText }]}>Behavior</Text>
          {renderToggleRow('Enter to Send', 'enterToSend', 'return-down-back-outline', 'Press Enter to send a message')}
          {renderToggleRow('Double‑tap to Reply', 'doubleTapReply', 'hand-left-outline', 'Double‑tap a message to reply')}
          {renderToggleRow('Show Message Previews', 'showPreviews', 'eye-outline', 'Show message preview in chat list')}
        </View>

        {/* Wallpaper */}
        <View style={[styles.card, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Text style={[styles.cardTitle, { color: secondaryText }]}>Wallpaper</Text>
          <TouchableOpacity
            style={[styles.optionRow, { borderBottomColor: borderColor }]}
            onPress={chooseWallpaper}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="image-outline" size={18} color={goldAccent} style={styles.optionIcon} />
              <Text style={[styles.optionText, { color: textColor }]}>Chat Wallpaper</Text>
            </View>
            <View style={styles.optionRight}>
              <Text style={[styles.optionValue, { color: secondaryText }]}>
                {settings.wallpaper === 'default' ? 'Default' : settings.wallpaper === 'dark' ? 'Dark' : 'Light'}
              </Text>
              <Ionicons name="chevron-forward-outline" size={16} color={secondaryText} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: modalBg, borderColor: borderColor }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Select Font Size</Text>

            {['Small', 'Medium', 'Large'].map((label) => {
              const size = label.toLowerCase();
              const isSelected = settings.fontSize === size;
              return (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.modalOption,
                    isSelected && {
                      backgroundColor: isDark ? 'rgba(108,92,231,0.2)' : 'rgba(108,92,231,0.08)',
                      borderColor: accentColor,
                      borderWidth: 1.5,
                    },
                  ]}
                  onPress={() => setFontSize(size)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      { color: isSelected ? accentColor : textColor },
                      size === 'small' && { fontSize: 15 },
                      size === 'medium' && { fontSize: 18 },
                      size === 'large' && { fontSize: 22 },
                    ]}
                  >
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
              onPress={() => setModalVisible(false)}
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

  card: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 2,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
    paddingTop: 6,
    opacity: 0.6,
  },

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
  modalOptionText: { fontWeight: '600' },
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