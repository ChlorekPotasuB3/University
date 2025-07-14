import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Course, University } from '../types';

interface CourseCardProps {
  course: Course;
  university: University;
  onPress: () => void;
  qualified?: boolean;
  fitScore?: number;
}

export const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  university, 
  onPress, 
  qualified,
  fitScore 
}) => {
  const formatTuition = (tuition: number) => {
    if (tuition === 0) return 'Free';
    return `${tuition.toLocaleString()} PLN/year`;
  };

  return (
    <TouchableOpacity style={[
      styles.card,
      qualified === true && styles.qualifiedCard,
      qualified === false && styles.notQualifiedCard
    ]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.courseName} numberOfLines={2}>
            {course.name}
          </Text>
          <Text style={styles.universityName}>{university.name}</Text>
        </View>
        
        {qualified !== undefined && (
          <View style={[
            styles.statusBadge,
            qualified ? styles.qualifiedBadge : styles.notQualifiedBadge
          ]}>
            <Text style={styles.statusText}>
              {qualified ? '✓' : '✗'}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Language:</Text>
          <Text style={styles.detailValue}>{course.lang}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Duration:</Text>
          <Text style={styles.detailValue}>{course.durationYears} years</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tuition:</Text>
          <Text style={styles.detailValue}>{formatTuition(course.tuitionPLN)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Mode:</Text>
          <Text style={styles.detailValue}>{course.mode}</Text>
        </View>
        
        {fitScore !== undefined && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fit Score:</Text>
            <Text style={styles.detailValue}>{fitScore.toFixed(1)}%</Text>
          </View>
        )}
      </View>
      
      {course.requirements.length > 0 && (
        <View style={styles.requirements}>
          <Text style={styles.requirementsTitle}>Requirements:</Text>
          {course.requirements.slice(0, 3).map((req, index) => (
            <Text key={index} style={styles.requirement}>
              • {req.subject} ({req.level}): {req.minPercent}%
            </Text>
          ))}
          {course.requirements.length > 3 && (
            <Text style={styles.moreRequirements}>
              +{course.requirements.length - 3} more...
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  qualifiedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  notQualifiedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  universityName: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  qualifiedBadge: {
    backgroundColor: '#4CAF50',
  },
  notQualifiedBadge: {
    backgroundColor: '#F44336',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  requirements: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  requirement: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  moreRequirements: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
  },
});