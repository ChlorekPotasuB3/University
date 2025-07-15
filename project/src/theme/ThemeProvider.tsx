import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { colors, darkColors } from './index';

interface ThemeContextProps {
  isDark: boolean;
  toggle: () => void;
  paperTheme: typeof MD3LightTheme;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  const LightTheme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...colors,
      background: colors.neutral200,
      surface: colors.neutral100,
      primary: colors.primary,
      secondary: colors.accent,
    },
  };

  const DarkTheme = {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      ...darkColors,
      background: darkColors.neutral100,
      surface: darkColors.neutral200,
      primary: darkColors.primary,
      secondary: darkColors.accent,
    },
  };

  const paperTheme = isDark ? DarkTheme : LightTheme;
  const toggle = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggle, paperTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
