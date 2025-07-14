import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface TierBadgeProps {
  tier: 'Top-tier' | 'National-tier' | 'Standard';
}

export const TierBadge: React.FC<TierBadgeProps> = ({ tier }) => {
  const getBadgeStyle = () => {
    switch (tier) {
      case 'Top-tier':
        return { backgroundColor: colors.accent, icon: '👑' };
      case 'National-tier':
        return { backgroundColor: colors.warning, icon: '⭐' };
      default:
        return { backgroundColor: colors.neutral600, icon: '●' };
    }
  };

  const badgeStyle = getBadgeStyle();

  return (
    <View style={[styles.badge, { backgroundColor: badgeStyle.backgroundColor }]}>
      <Text style={styles.icon}>{badgeStyle.icon}</Text>
      <Text style={styles.text}>{tier}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  icon: {
    fontSize: 12,
    marginRight: spacing.xs,
  },
  text: {
    ...typography.micro,
    color: colors.neutral100,
    fontWeight: '600',
  },
});