import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('medisure-theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('medisure-theme', isDarkMode ? 'dark' : 'light');
    
    // Apply theme to document root
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      // Light mode colors
      light: {
        primary: '#3b82f6',
        secondary: '#10b981',
        background: '#ffffff',
        surface: '#f8fafc',
        surfaceVariant: '#f1f5f9',
        text: {
          primary: '#1f2937',
          secondary: '#6b7280',
          accent: '#3b82f6'
        },
        border: '#e5e7eb',
        shadow: 'rgba(0, 0, 0, 0.1)',
        gradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)'
      },
      // Dark mode colors
      dark: {
        primary: '#60a5fa',
        secondary: '#34d399',
        background: '#111827',
        surface: '#1f2937',
        surfaceVariant: '#374151',
        text: {
          primary: '#f9fafb',
          secondary: '#d1d5db',
          accent: '#60a5fa'
        },
        border: '#4b5563',
        shadow: 'rgba(0, 0, 0, 0.3)',
        gradient: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)'
      }
    }
  };

  const currentColors = isDarkMode ? theme.colors.dark : theme.colors.light;

  return (
    <ThemeContext.Provider value={{ ...theme, currentColors }}>
      {children}
    </ThemeContext.Provider>
  );
};