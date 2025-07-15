import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  FlatList,
} from 'react-native';
import { CourseCard } from '../components/CourseCard';
import { University } from '../types';

interface UniversityDetailScreenProps {
  navigation: any;
  route: {
    params: {
      university: University;
    };
  };
}

export const UniversityDetailScreen: React.FC<UniversityDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { university } = route.params;

  const openWebsite = () => {
    Linking.openURL(university.homepage ?? 'https://google.com');
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Top-tier': return '#FFD700';
      case 'National-tier': return '#C0C0C0';
      default: return '#CD7F32';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Top-tier': return '🏆';
      case 'National-tier': return '🥈';
      default: return '🏅';
    }
  };

  const renderCourseCard = ({ item }: { item: any }) => (
    <CourseCard
      course={item}
      university={university}
      onPress={() => navigation.navigate('CourseDetail', { 
        course: item, 
        university 
      })}
    />
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.universityInfo}>
          <View style={styles.logoSection}>
            {typeof university.logo === 'string' && university.logo.trim().length > 0 ? (
              <Image source={{ uri: String(university.logo ?? '') }} style={styles.logo} />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>🎓</Text>
              </View>
            )}
            <View style={[styles.tierBadge, { backgroundColor: getTierColor(String(university.tier || '')) }]}>
              <Text style={styles.tierIcon}>{getTierIcon(String(university.tier || ''))}</Text>
            </View>
          </View>

          <Text style={styles.universityName}>{university.name}</Text>
          <Text style={styles.city}>{university.city}</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Type</Text>
              <Text style={styles.infoValue}>{university.type}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Tier</Text>
              <Text style={styles.infoValue}>{university.tier}</Text>
            </View>
            
            {university.qsRank && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>QS Rank</Text>
                <Text style={styles.infoValue}>#{university.qsRank}</Text>
              </View>
            )}
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Courses</Text>
              <Text style={styles.infoValue}>{university.courses.length}</Text>
            </View>
          </View>

          {university.homepage && (
            <TouchableOpacity style={styles.websiteButton} onPress={openWebsite}>
              <Text style={styles.websiteButtonText}>Visit Website</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.coursesSection}>
          <Text style={styles.sectionTitle}>Available Courses</Text>
          
          {university.courses.length > 0 ? (
            <FlatList
              data={university.courses}
              renderItem={renderCourseCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.coursesList}
            />
          ) : (
            <View style={styles.emptyCoursesContainer}>
              <Text style={styles.emptyCoursesText}>
                No course information available yet.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  universityInfo: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logoSection: {
    position: 'relative',
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 40,
  },
  tierBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  tierIcon: {
    fontSize: 16,
  },
  universityName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  city: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  infoItem: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  websiteButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  websiteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  coursesSection: {
    flex: 1,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  coursesList: {
    paddingBottom: 20,
  },
  emptyCoursesContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyCoursesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});