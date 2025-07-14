import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface SplashScreenProps {
  onLoadComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onLoadComplete }) => {
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      onLoadComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onLoadComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>🇵🇱</Text>
        <Text style={styles.title}>PolandUniFinder</Text>
        <Text style={styles.subtitle}>Find your perfect Polish university</Text>
        
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading universities...</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.neutral800,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.neutral600,
    marginBottom: spacing.xl,
  },
  loaderContainer: {
    alignItems: 'center',
  },
  loadingText: {
    ...typography.small,
    color: colors.neutral600,
    marginTop: spacing.md,
  },
});