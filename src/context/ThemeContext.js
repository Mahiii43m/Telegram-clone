import React, { createContext, useState, useContext } from 'react';

export const LightTheme = {
  primary: '#1a4b8c',
  secondary: '#6c5ce7',
  accent: '#de994a',
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
  // Light mode message bubbles
  bubbleSent: '#1a4b8c',
  bubbleReceived: '#e8e8ed',
  bubbleSentText: '#ffffff',
  bubbleReceivedText: '#1a1a2e',
};

export const DarkTheme = {
  // 🪐 Cosmic Colors
  primary: '#60a5fa',           // Bright sky blue
  secondary: '#a78bfa',         // Soft purple
  accent: '#fbbf24',            // Warm gold (stars)
  
  // 🌌 Glass background
  background: '#0f0e17',        // Deep cosmic void
  surface: 'rgba(255,255,255,0.04)',
  card: 'rgba(255,255,255,0.06)',
  
  // ✨ Crisp text
  textPrimary: '#f8fafc',       // Bright white (not gray)
  textSecondary: '#cbd5e1',     // Light gray-blue
  textMuted: '#94a3b8',         // Muted blue-gray
  
  // 🪟 Glass borders
  border: 'rgba(255,255,255,0.08)',
  shadow: 'rgba(96, 165, 250, 0.15)',
  
  // ✨ Glowing badges
  badgeBackground: 'rgba(167, 139, 250, 0.2)',
  badgeText: '#a78bfa',
  unreadBackground: '#60a5fa',
  unreadText: '#ffffff',
  
  // 💬 Glass message bubbles
  bubbleSent: 'rgba(96, 165, 250, 0.25)',      // Glass blue
  bubbleReceived: 'rgba(255,255,255,0.08)',    // Glass white
  bubbleSentText: '#f8fafc',
  bubbleReceivedText: '#f8fafc',
  
  // 🌟 Glow effects
  glowColor: 'rgba(96, 165, 250, 0.15)',
  
  statusBar: 'light-content',
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
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