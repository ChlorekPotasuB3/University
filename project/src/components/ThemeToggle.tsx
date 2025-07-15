import React from 'react';
import { Switch } from 'react-native-paper';
import { useTheme } from '../theme/ThemeProvider';

export const ThemeToggle = () => {
  const { isDark, toggle } = useTheme();
  return <Switch value={isDark} onValueChange={toggle} color="#2563EB" />;
};
