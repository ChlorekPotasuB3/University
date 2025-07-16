import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, Chip, Checkbox } from 'react-native-paper';
import { Course, University } from '../types';
import { useSelection } from '../context/SelectionContext';
import { colors, typography, spacing } from '../theme';

interface CourseCardProps {
  course: Course;
  university: University;
  onPress: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, university, onPress }) => {
  const { addCourse, removeCourse, isCourseSelected } = useSelection();
  const isSelected = isCourseSelected(course.id);

  const handleSelect = () => {
    if (isSelected) {
      removeCourse(course.id);
    } else {
      // Ensure the course object passed to context has all required fields
      const courseToAdd = { ...course, universityName: university.name };
      addCourse(courseToAdd);
    }
  };

  // Use a placeholder logo if the course or university logo is missing
  const logoUri = course.logo || university.logo || 'https://via.placeholder.com/100';

  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={onPress} style={styles.touchableHeader}>
        <View style={styles.header}>
          <Image source={{ uri: logoUri }} style={styles.logo} />
          <View style={styles.headerText}>
            <Text style={styles.title} numberOfLines={2}>{course.title}</Text>
            <Text style={styles.universityName}>{university.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
      
      <Card.Content>
        <View style={styles.chipContainer}>
          {course.studyFormat?.map((format: any) => (
            <Chip key={format.slug} style={styles.chip} textStyle={styles.chipText}>{format.title}</Chip>
          ))}
          {course.studyPace?.map((pace: any) => (
            <Chip key={pace.slug} style={styles.chip} textStyle={styles.chipText}>{pace.title}</Chip>
          ))}
        </View>
        <Text style={styles.description} numberOfLines={3}>
          {course.shortDescription || 'No description available.'}
        </Text>
      </Card.Content>

      <Card.Actions style={styles.actions}>
        <TouchableOpacity style={styles.selectButton} onPress={handleSelect}>
          <Checkbox.Android status={isSelected ? 'checked' : 'unchecked'} color={colors.primary} />
          <Text style={styles.selectText}>Select for Calculator</Text>
        </TouchableOpacity>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    backgroundColor: colors.neutral100,
    borderRadius: 12,
    overflow: 'hidden',
  },
  touchableHeader: {
    // No specific styles needed, just for the ripple effect
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: spacing.md,
    backgroundColor: colors.neutral200, // Placeholder background
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...typography.h2, // Adjusted for likely theme structure
    fontSize: 16,
    color: colors.neutral800,
  },
  universityName: {
    ...typography.body,
    color: colors.neutral600,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  chip: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.neutral200, // Adjusted for likely theme structure
  },
  chipText: {
    color: colors.neutral800, // Adjusted for likely theme structure
  },
  description: {
    ...typography.body,
    color: colors.neutral600, // Adjusted for likely theme structure
    lineHeight: 20,
  },
  actions: {
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral200,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  selectText: {
    ...typography.small, // Adjusted for likely theme structure
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: spacing.xs,
  },
});
