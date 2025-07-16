import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Button, Chip } from 'react-native-paper';
import { Course, University, MaturaRequirement } from '../types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type CourseDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;

export const CourseDetailScreen: React.FC<CourseDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { course, university } = route.params;

  const openHomepage = () => {
    if (university.homepage) {
      Linking.openURL(university.homepage);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.universityName}>{university.name}</Text>
        <Text style={styles.courseName}>{course.name}</Text>
        <Button
          mode="contained"
          onPress={openHomepage}
          style={styles.homepageButton}
        >
          Visit University Homepage
        </Button>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Requirements</Text>
        {course.requirements?.map((req: MaturaRequirement, index: number) => (
          <View key={index} style={styles.requirement}>
            <Chip style={styles.chip}>
              {req.subject} ({req.level})
            </Chip>
            <Text style={styles.requirementPercent}>
              Minimum: {req.minPercent}%
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Information</Text>
        <Text style={styles.infoText}>
          {course.description || 'No additional information available.'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back to University</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  universityName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  courseName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  homepageButton: {
    marginTop: 8,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  chip: {
    marginRight: 12,
  },
  requirementPercent: {
    fontSize: 16,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
  },
  backButton: {
    padding: 16,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
});
