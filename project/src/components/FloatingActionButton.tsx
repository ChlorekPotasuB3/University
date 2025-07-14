import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, shadows } from '../theme';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: string;
  label?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon = 'calculator',
  label = 'Enter Matura Results',
}) => {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <Ionicons name={icon as any} size={24} color={colors.neutral100} />
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.accent,
    borderRadius: 28,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.large,
  },
  label: {
    color: colors.neutral100,
    fontWeight: '600',
    marginLeft: spacing.sm,
    fontSize: 14,
  },
});