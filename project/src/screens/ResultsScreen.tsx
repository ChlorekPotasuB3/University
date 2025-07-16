import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { CourseCard } from '../components/CourseCard';
import { MaturaResult, QualificationResult, University } from '../types';
import { DataService } from '../services/dataService';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type ResultsScreenProps = NativeStackScreenProps<RootStackParamList, 'Results'>;

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ navigation, route }) => {
  const [results, setResults] = useState<QualificationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'qualified' | 'top-tier'>('qualified');
  
  const { maturaResults } = route.params;
  const dataService = DataService.getInstance();

  useEffect(() => {
    calculateResults();
  }, []);

  const calculateResults = async () => {
    try {
      setLoading(true);
      const universities = await dataService.getUniversities();
      const qualificationResults = dataService.calculateQualifications(maturaResults, universities);
      setResults(qualificationResults);
    } catch (error) {
      console.error('Error calculating results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredResults = () => {
    switch (filter) {
      case 'qualified':
        return results.filter(r => r.qualified);
      case 'top-tier':
        return results.filter(r => r.qualified && r.university.tier === 'Top-tier');
      default:
        return results;
    }
  };

  const getStats = () => {
    const qualified = results.filter(r => r.qualified).length;
    const topTier = results.filter(r => r.qualified && r.university.tier === 'Top-tier').length;
    const total = results.length;
    
    return { qualified, topTier, total };
  };

  const renderResultCard = ({ item }: { item: QualificationResult }) => (
    <CourseCard
      course={item.course}
      university={item.university}
      qualified={item.qualified}
      fitScore={item.fitScore}
      onPress={() => navigation.navigate('CourseDetail', { 
        course: item.course, 
        university: item.university 
      })}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Calculating your qualifications...</Text>
      </View>
    );
  }

  const stats = getStats();
  const filteredResults = getFilteredResults();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Results</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.qualified}</Text>
          <Text style={styles.statLabel}>Qualified</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, styles.topTierNumber]}>{stats.topTier}</Text>
          <Text style={styles.statLabel}>Top-Tier</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      <View style={styles.filterSection}>
        {[
          { key: 'qualified', label: 'Qualified', count: stats.qualified },
          { key: 'top-tier', label: 'Top-Tier', count: stats.topTier },
          { key: 'all', label: 'All', count: stats.total },
        ].map((filterOption) => (
          <TouchableOpacity
            key={filterOption.key}
            style={[
              styles.filterButton,
              filter === filterOption.key && styles.selectedFilterButton,
            ]}
            onPress={() => setFilter(filterOption.key as any)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === filterOption.key && styles.selectedFilterButtonText,
              ]}
            >
              {filterOption.label} ({filterOption.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredResults}
        renderItem={renderResultCard}
        keyExtractor={(item) => `${item.university.id}-${item.course.id}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {filter === 'qualified' 
                ? "No qualified programs found. Try adjusting your matura results."
                : "No programs match the current filter."
              }
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  statsSection: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  topTierNumber: {
    color: '#FFD700',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  filterSection: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  selectedFilterButton: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#333',
  },
  selectedFilterButtonText: {
    color: '#fff',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});