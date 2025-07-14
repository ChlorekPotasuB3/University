import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { TierBadge } from './TierBadge';
import { colors, spacing, typography, shadows } from '../theme';
import { University } from '../types';

interface HorizontalCardProps {
  university: University;
  onPress: () => void;
}

export const HorizontalCard: React.FC<HorizontalCardProps> = ({ university, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        {university.logo ? (
          <Image source={{ uri: university.logo }} style={styles.logo} />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>🎓</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>{university.name}</Text>
        <Text style={styles.city}>{university.city}</Text>
        
        {university.qsRank && (
          <Text style={styles.rank}>QS #{university.qsRank}</Text>
        )}
        
        <View style={styles.badgeContainer}>
          <TierBadge tier={university.tier} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 120,
    height: 150,
    backgroundColor: colors.neutral100,
    borderRadius: 12,
    marginRight: spacing.md,
    ...shadows.medium,
  },
  imageContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    padding: spacing.sm,
    justifyContent: 'space-between',
  },
  name: {
    ...typography.small,
    fontWeight: '600',
    color: colors.neutral800,
    textAlign: 'center',
  },
  city: {
    ...typography.micro,
    color: colors.neutral600,
    textAlign: 'center',
  },
  rank: {
    ...typography.micro,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
  badgeContainer: {
    alignItems: 'center',
  },
});