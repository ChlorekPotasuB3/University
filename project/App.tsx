import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SelectionProvider } from './src/context/SelectionContext';
import { StatusBar } from 'expo-status-bar';

// MainApp component now only sets up the providers and navigator
function MainApp() {
  const { paperTheme, isDark } = useTheme();

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </PaperProvider>
  );
}

// The main App component wraps everything in the ThemeProvider
export default function App() {
  return (
    <SelectionProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </SelectionProvider>
  );
}