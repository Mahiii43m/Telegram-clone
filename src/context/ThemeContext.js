import React, { createContext, useState, useContext } from 'react';

// Define your color themes
export const LightTheme = {
  primary: '#FF6B35',
  primaryDark: '#E85D2C',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  textPrimary: '#000000',
  textSecondary: '#666666',
  textMuted: '#999999',
  border: '#E0E0E0',
  shadow: 'rgba(0,0,0,0.1)',
  statusBar: 'dark-content',
};

export const DarkTheme = {
  primary: '#FF6B35',
  primaryDark: '#E85D2C',
  background: '#0A0A1A',
  surface: 'rgba(255,255,255,0.08)',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.7)',
  textMuted: 'rgba(255,255,255,0.5)',
  border: 'rgba(255,255,255,0.1)',
  shadow: 'rgba(255,107,53,0.3)',
  statusBar: 'light-content',
};

// Create the Context
const ThemeContext = createContext();

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true); // Default to dark mode

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

// Custom hook to use the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};