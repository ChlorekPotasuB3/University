import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { TierBadge } from './TierBadge';
import { colors, spacing, typography, shadows } from '../theme';
import { University } from '../types';

interface UniCardProps {
  university: University;
  onPress: () => void;
  matchingCourses?: string[];
}

export const UniCard: React.FC<UniCardProps> = ({ university, onPress, matchingCourses = [] }) => {
  const formatTuition = (courses: any[]) => {
    if (courses.length === 0) return 'N/A';
    const minTuition = Math.min(...courses.map(c => c.tuitionPLN).filter(t => t > 0));
    return minTuition === Infinity ? 'Free' : `From ${minTuition.toLocaleString()} PLN`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          {university.logo ? (
            <Image source={{ uri: university.logo }} style={styles.logo} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>🎓</Text>
            </View>
          )}
        </View>
        
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={2}>{university.name}</Text>
            <TierBadge tier={university.tier} />
          </View>
          
          <Text style={styles.location}>{university.city} • {university.type}</Text>
          <Text style={styles.tuition}>{formatTuition(university.courses)}</Text>
        </View>
      </View>
      
      {matchingCourses.length > 0 && (
        <View style={styles.coursesSection}>
          <Text style={styles.coursesTitle}>Matching courses:</Text>
          {matchingCourses.slice(0, 3).map((course, index) => (
            <Text key={index} style={styles.courseItem}>• {course}</Text>
          ))}
          {matchingCourses.length > 3 && (
            <Text style={styles.moreText}>+{matchingCourses.length - 3} more</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral100,
    borderRadius: 12,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    ...shadows.small,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  logoContainer: {
    marginRight: spacing.md,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.neutral200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
  },
  headerContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.body,
    fontWeight: '600',
    color: colors.neutral800,
    flex: 1,
    marginRight: spacing.sm,
  },
  location: {
    ...typography.small,
    color: colors.neutral600,
    marginBottom: spacing.xs,
  },
  tuition: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '500',
  },
  coursesSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral300,
  },
  coursesTitle: {
    ...typography.small,
    fontWeight: '600',
    color: colors.neutral800,
    marginBottom: spacing.xs,
  },
  courseItem: {
    ...typography.small,
    color: colors.neutral600,
    marginBottom: 2,
  },
  moreText: {
    ...typography.small,
    color: colors.neutral600,
    fontStyle: 'italic',
  },
});