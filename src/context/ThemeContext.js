import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Theme Presets ──────────────────────────────────────────
export const THEME_PRESETS = {
  ssgiBlue: {
    name: 'SSGI Blue',
    primary: '#1a4b8c',
    secondary: '#6c5ce7',
    accent: '#de994a',
  },
  gold: {
    name: 'Gold',
    primary: '#b8860b',
    secondary: '#daa520',
    accent: '#f0c040',
  },
  purple: {
    name: 'Purple',
    primary: '#6c5ce7',
    secondary: '#a29bfe',
    accent: '#fd79a8',
  },
  deepSpace: {
    name: 'Deep Space',
    primary: '#0f0e17',
    secondary: '#1a1a2e',
    accent: '#6c5ce7',
  },
};

// ─── Base Color Schemes ────────────────────────────────────
export const LightTheme = {
  background: '#f0f2f5',
  surface: '#ffffff',
  card: '#ffffff',
  textPrimary: '#1a1a2e',
  textSecondary: '#4a4a5a',
  textMuted: '#8a8a9a',
  border: '#e8e8ed',
  shadow: 'rgba(0,0,0,0.08)',
  badgeBackground: 'rgba(108, 92, 231, 0.12)',
  badgeText: '#6c5ce7',
  unreadBackground: '#1a4b8c',
  unreadText: '#ffffff',
  statusBar: 'dark-content',
  bubbleSentText: '#ffffff',
  bubbleReceivedText: '#1a1a2e',
};

export const DarkTheme = {
  background: '#0f0e17',
  surface: 'rgba(255,255,255,0.04)',
  card: 'rgba(255,255,255,0.06)',
  textPrimary: '#f8fafc',
  textSecondary: '#cbd5e1',
  textMuted: '#94a3b8',
  border: 'rgba(255,255,255,0.08)',
  shadow: 'rgba(96, 165, 250, 0.15)',
  badgeBackground: 'rgba(167, 139, 250, 0.2)',
  badgeText: '#a78bfa',
  unreadBackground: '#60a5fa',
  unreadText: '#ffffff',
  statusBar: 'light-content',
  bubbleSentText: '#f8fafc',
  bubbleReceivedText: '#f8fafc',
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const deviceColorScheme = useColorScheme();

  // ─── State ──────────────────────────────────────────────────
  const [themeMode, setThemeMode] = useState('system'); // 'light' | 'dark' | 'system'
  const [preset, setPreset] = useState('ssgiBlue');
  const [accentColor, setAccentColor] = useState(null); // if set, overrides preset accent

  // ─── Computed colors ──────────────────────────────────────
  const baseColors = themeMode === 'system' 
    ? (deviceColorScheme === 'dark' ? DarkTheme : LightTheme)
    : (themeMode === 'dark' ? DarkTheme : LightTheme);

  const isDark = themeMode === 'system' 
    ? deviceColorScheme === 'dark' 
    : themeMode === 'dark';

  const presetColors = THEME_PRESETS[preset] || THEME_PRESETS.ssgiBlue;
  const primary = presetColors.primary;
  const secondary = presetColors.secondary;
  const accent = accentColor || presetColors.accent;

  const theme = {
    ...baseColors,
    primary,
    secondary,
    accent,
    bubbleSent: primary,
    bubbleReceived: isDark ? 'rgba(255,255,255,0.08)' : '#e8e8ed',
  };

  // ─── Persistence ───────────────────────────────────────────
  useEffect(() => {
    loadPreferences();
  }, []);

  useEffect(() => {
    savePreferences();
  }, [themeMode, preset, accentColor]);

  const loadPreferences = async () => {
    try {
      const saved = await AsyncStorage.getItem('theme_prefs');
      if (saved) {
        const prefs = JSON.parse(saved);
        if (prefs.themeMode) setThemeMode(prefs.themeMode);
        if (prefs.preset) setPreset(prefs.preset);
        if (prefs.accentColor) setAccentColor(prefs.accentColor);
      }
    } catch (error) {
      console.warn('Failed to load theme preferences', error);
    }
  };

  const savePreferences = async () => {
    try {
      await AsyncStorage.setItem('theme_prefs', JSON.stringify({
        themeMode,
        preset,
        accentColor,
      }));
    } catch (error) {
      console.warn('Failed to save theme preferences', error);
    }
  };

  const setTheme = (mode) => setThemeMode(mode);
  const setThemePreset = (p) => setPreset(p);
  const setCustomAccent = (color) => setAccentColor(color);

  return (
    <ThemeContext.Provider value={{
      theme,
      isDark,
      themeMode,
      preset,
      accentColor,
      setTheme,
      setThemePreset,
      setCustomAccent,
      toggleTheme: () => setThemeMode(prev => prev === 'dark' ? 'light' : 'dark'),
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};