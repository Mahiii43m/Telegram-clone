import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, THEME_PRESETS } from '../../context/ThemeContext';
import { SPACING, RADIUS } from '../../constants/typography';

const ACCENT_COLORS = ['#de994a', '#f0c040', '#fd79a8', '#00b894', '#0984e3', '#6c5ce7'];

export default function ThemeScreen({ navigation }) {
  const {
    theme,
    isDark,
    themeMode,
    preset,
    accentColor,
    setTheme,
    setThemePreset,
    setCustomAccent,
  } = useTheme();

  const bgColor = theme?.background || '#0a0e1a';
  const textColor = theme?.textPrimary || '#ffffff';
  const secondaryText = theme?.textSecondary || '#a0a0b0';
  const borderColor = theme?.border || 'rgba(255,255,255,0.08)';
  const cardColor = theme?.surface || 'rgba(255,255,255,0.06)';
  const brandColor = theme?.primary || '#1a4b8c';
  const accent = theme?.accent || '#de994a';

  const presets = Object.entries(THEME_PRESETS);

  // ─── Mode Handlers ──────────────────────────────────────────
  const handleModeSelect = (mode) => setTheme(mode);
  const handlePresetSelect = (key) => setThemePreset(key);
  const handleAccentSelect = (color) => setCustomAccent(color);
  const resetAccent = () => setCustomAccent(null);

  // ─── Mode Icons ─────────────────────────────────────────────
  const getModeIcon = (mode) => {
    switch (mode) {
      case 'light': return 'sunny-outline';
      case 'dark': return 'moon-outline';
      case 'system': return 'phone-portrait-outline';
      default: return 'ellipse-outline';
    }
  };

  // ─── Live Preview ──────────────────────────────────────────
  const PreviewCard = () => (
    <View style={[styles.previewCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
      <Text style={[styles.previewTitle, { color: textColor }]}>Live Preview</Text>
      <View style={[styles.previewChat, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f0f0f5' }]}>
        <View style={[styles.previewBubble, styles.previewBubbleSent, { backgroundColor: brandColor }]}>
          <Text style={[styles.previewBubbleText, { color: theme.bubbleSentText }]}>Hello!</Text>
        </View>
        <View style={[styles.previewBubble, styles.previewBubbleReceived, { backgroundColor: theme.bubbleReceived }]}>
          <Text style={[styles.previewBubbleText, { color: theme.bubbleReceivedText }]}>Hi there!</Text>
        </View>
      </View>
      <View style={styles.previewMeta}>
        <Text style={[styles.previewMetaText, { color: secondaryText }]}>
          {isDark ? '🌙 Dark' : '☀️ Light'} • {THEME_PRESETS[preset]?.name || 'SSGI Blue'}
        </Text>
        {accentColor && (
          <Text style={[styles.previewMetaText, { color: secondaryText }]}>
            Accent: {accentColor.toUpperCase()}
          </Text>
        )}
      </View>
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
        <Text style={[styles.headerTitle, { color: textColor }]}>Theme</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <PreviewCard />

        {/* ─── Mode Selection ──────────────────────────────── */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: secondaryText }]}>Mode</Text>
          <View style={styles.modeOptions}>
            {['light', 'dark', 'system'].map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.modeChip,
                  themeMode === mode && { backgroundColor: accent, borderColor: accent },
                  { borderColor: borderColor },
                ]}
                onPress={() => handleModeSelect(mode)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={getModeIcon(mode)}
                  size={18}
                  color={themeMode === mode ? '#ffffff' : secondaryText}
                  style={styles.modeIcon}
                />
                <Text
                  style={[
                    styles.modeChipText,
                    { color: themeMode === mode ? '#ffffff' : secondaryText },
                  ]}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ─── Theme Presets ────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: secondaryText }]}>Theme Presets</Text>
          <View style={styles.presetGrid}>
            {presets.map(([key, p]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.presetCard,
                  { backgroundColor: cardColor, borderColor: borderColor },
                  preset === key && [styles.presetCardActive, { borderColor: accent }],
                ]}
                onPress={() => handlePresetSelect(key)}
                activeOpacity={0.8}
              >
                <View style={[styles.presetHeader, { backgroundColor: p.primary }]} />
                <View style={styles.presetBody}>
                  <Text style={[styles.presetName, { color: textColor }]}>{p.name}</Text>
                  {preset === key && (
                    <View style={[styles.presetCheck, { backgroundColor: accent }]}>
                      <Ionicons name="checkmark" size={12} color="#ffffff" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ─── Accent Color Picker ─────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.accentHeader}>
            <Text style={[styles.sectionLabel, { color: secondaryText }]}>Accent Color</Text>
            {accentColor && (
              <TouchableOpacity onPress={resetAccent} style={styles.resetAccentBtn}>
                <Text style={[styles.resetAccentText, { color: accent }]}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.accentRow}>
            {ACCENT_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.accentCircle,
                  { backgroundColor: color },
                  (accent === color) && styles.accentCircleSelected,
                ]}
                onPress={() => handleAccentSelect(color)}
                activeOpacity={0.7}
              >
                {(accent === color) && (
                  <Ionicons name="checkmark" size={14} color="#ffffff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ─── Footer Note ──────────────────────────────────── */}
        <View style={styles.noteContainer}>
          <Ionicons name="information-circle-outline" size={18} color={secondaryText} />
          <Text style={[styles.noteText, { color: secondaryText }]}>
            Changes are saved automatically.
          </Text>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // ─── Preview ──────────────────────────────────────────────
  previewCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  previewChat: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  previewBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    marginVertical: 4,
    maxWidth: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  previewBubbleSent: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 6,
  },
  previewBubbleReceived: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  previewBubbleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  previewMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  previewMetaText: {
    fontSize: 12,
    opacity: 0.6,
  },

  // ─── Section ──────────────────────────────────────────────
  section: {
    width: '100%',
    marginBottom: 22,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 10,
  },

  // ─── Mode Chips ────────────────────────────────────────────
  modeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  modeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  modeIcon: {
    marginRight: 6,
  },
  modeChipText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // ─── Presets ──────────────────────────────────────────────
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  presetCard: {
    width: '48%',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  presetCardActive: {
    borderWidth: 2,
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  presetHeader: {
    height: 44,
    width: '100%',
  },
  presetBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  presetName: {
    fontSize: 14,
    fontWeight: '600',
  },
  presetCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  // ─── Accent Colors ────────────────────────────────────────
  accentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resetAccentBtn: {
    padding: 4,
  },
  resetAccentText: {
    fontSize: 13,
    fontWeight: '600',
  },
  accentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  accentCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  accentCircleSelected: {
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },

  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  noteText: {
    marginLeft: 8,
    fontSize: 13,
    opacity: 0.6,
  },
});