import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { University } from '../types/index';
import { colors, spacing, typography, shadows } from '../theme';

interface UniversityCardProps {
  university: University;
  onPress: () => void;
}

export const UniversityCard: React.FC<UniversityCardProps> = ({ university, onPress }) => {
  // Use the scraped logo if available, otherwise use a placeholder
  const logoUri = university.logo || 'https://via.placeholder.com/150';

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={{ uri: logoUri }} style={styles.logo} resizeMode="contain" />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>{university.name}</Text>
        <Text style={styles.city}>{university.city}</Text>
        <View style={styles.tierBadge}>
          <Text style={styles.tierText}>{university.tier || 'N/A'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.neutral100,
    borderRadius: 16,
    marginBottom: spacing.md,
    ...shadows.medium,
    overflow: 'hidden',
  },
  logoContainer: {
    width: 100,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral200, // A light background for the logo
    padding: spacing.sm,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  name: {
    ...typography.h3,
    color: colors.neutral800,
    marginBottom: spacing.xs,
  },
  city: {
    ...typography.body,
    color: colors.neutral600,
    marginBottom: spacing.sm,
  },
  tierBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  tierText: {
    ...typography.small,
    color: colors.neutral100,
    fontWeight: 'bold',
  },
});
