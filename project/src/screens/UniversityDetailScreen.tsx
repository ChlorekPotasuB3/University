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
import { Chip } from 'react-native-paper';
import * as WebBrowser from 'expo-web-browser';
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

  const openPdf = (url: string | undefined) => {
    if (!url) return;
    WebBrowser.openBrowserAsync(url);
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
          {/* Tags/Chips */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 8 }}>
            {university.type && (
              <Chip style={{ marginRight: 8, marginBottom: 4 }}>{university.type}</Chip>
            )}
            {university.public !== undefined && (
              <Chip style={{ marginRight: 8, marginBottom: 4 }}>{university.public ? 'public' : 'private'}</Chip>
            )}
            {university.qs2026 && university.qs2026 <= 10 && (
              <Chip style={{ marginRight: 8, marginBottom: 4 }}>Top 10</Chip>
            )}
          </View>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Type</Text>
              <Text style={styles.infoValue}>{university.type}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Tier</Text>
              <Text style={styles.infoValue}>{university.tier}</Text>
            </View>
            
            {/* Rankings Section */}
            <View style={styles.rankingsSection}>
              <Text style={styles.sectionTitle}>Rankings</Text>
              {university.qs2026 && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>QS 2026</Text>
                  <Text style={styles.infoValue}>{university.qs2026}</Text>
                </View>
              )}
              {university.the2024 && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>THE 2024</Text>
                  <Text style={styles.infoValue}>{university.the2024}</Text>
                </View>
              )}
              {university.edurank2025 && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>EduRank 2025</Text>
                  <Text style={styles.infoValue}>{university.edurank2025}</Text>
                </View>
              )}
              {university.perspektywy2025 && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Perspektywy 2025</Text>
                  <Text style={styles.infoValue}>{university.perspektywy2025}</Text>
                </View>
              )}
              {university.tier && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Tier</Text>
                  <Text style={styles.infoValue}>{university.tier}</Text>
                </View>
              )}
              {university.przelicznikiPdfUrl && (
                <TouchableOpacity onPress={() => openPdf(university.przelicznikiPdfUrl)}>
                  <Text style={styles.link}>📄 Przeliczniki maturalne</Text>
                </TouchableOpacity>
              )}
            </View>
            
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
  rankingsSection: {
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f0f4ff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  coursesSection: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  coursesList: {
    paddingBottom: 16,
  },
  emptyCoursesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  emptyCoursesText: {
    color: '#888',
    fontSize: 16,
  },
  websiteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  websiteButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 12,
    marginBottom: 8,
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
});