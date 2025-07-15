import React, { useState, useEffect } from 'react';
// @ts-ignore: No type declarations for NetInfo
import NetInfo from '@react-native-community/netinfo';
import { Banner } from 'react-native-paper';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { Button, Chip } from 'react-native-paper';
import { SearchBar } from '../components/SearchBar';
import { UniversityCard } from '../components/UniversityCard';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { FilterChip } from '../components/FilterChip';
import { CalculatorModal } from './CalculatorModal';
import { SplashScreen } from './SplashScreen';
import { University, MaturaResult } from '../types';
import { DataService } from '../services/dataService';
import { colors, spacing, typography, shadows } from '../theme';
import Fuse from 'fuse.js';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [calculatorVisible, setCalculatorVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [bannerVisible, setBannerVisible] = useState(false);

  const dataService = DataService.getInstance();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: { isConnected: boolean | null }) => {
      setIsConnected(!!state.isConnected);
      setBannerVisible(!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadUniversities();
  }, []);

  useEffect(() => {
    filterUniversities();
  }, [universities, searchQuery, selectedFilters]);

  const loadUniversities = async (forceRefresh = false) => {
    try {
      setLoading(true);
      const data = await dataService.getUniversities(forceRefresh);
      setUniversities(data);
    } catch (error) {
      console.error('Error loading universities:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterUniversities = () => {
    let filtered = universities;

    // Apply filters
    if (selectedFilters.length > 0) {
      filtered = filtered.filter(uni => 
        selectedFilters.includes('all') || 
        selectedFilters.includes(String(uni.tier || '')) ||
        selectedFilters.includes(String(uni.type || ''))
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const fuse = new Fuse(filtered, {
        keys: ['name', 'city', 'courses.name'],
        threshold: 0.3,
      });
      const searchResults = fuse.search(searchQuery);
      filtered = searchResults.map(result => result.item);
    }

    setFilteredUniversities(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUniversities(true);
  };

  const handleOpenCalculator = () => {
    setCalculatorVisible(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches(prev => [query.trim(), ...prev.slice(0, 2)]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleUniversityPress = (university: University) => {
    navigation.navigate('Detail', { university });
  };

  const handleCalculate = (maturaResults: MaturaResult[]) => {
    setCalculatorVisible(false);
    navigation.navigate('Results', { maturaResults });
  };

  // Modern top-tier carousel using UniversityCard
  const renderTopTierCarousel = () => {
    if (searchQuery.trim()) return null;
    
    const topTierUnis = universities
      .filter(uni => uni.tier === 'Top-tier')
      .slice(0, 5);
    
    if (topTierUnis.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏆 Top-Tier Universities</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
          {topTierUnis.map((university) => (
            <View key={university.id} style={{ marginRight: 24, width: 350, maxWidth: 400 }}>
              <UniversityCard university={{...university, logo: String(university.logo || ''), city: String(university.city || ''), type: String(university.type || '')}} onPress={() => handleUniversityPress(university)} />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderRecentSearches = () => {
    if (searchQuery.trim() || recentSearches.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📚 Recent Searches</Text>
        {recentSearches.map((search, index) => (
          <TouchableOpacity
            key={index}
            style={styles.recentItem}
            onPress={() => setSearchQuery(search)}
          >
            <Text style={styles.recentText}>{search}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderFilters = () => {
    const filters = ['Top-tier', 'National-tier', 'Standard', 'public', 'private'];
    
    return (
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filtersRow}>
            {filters.map((filter) => (
              <FilterChip
                key={filter}
                label={filter}
                selected={selectedFilters.includes(filter)}
                onPress={() => toggleFilter(filter)}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  if (loading) {
    return <SplashScreen onLoadComplete={() => setLoading(false)} />;
  }

  return (
    <View style={styles.container}>
      <Banner
        visible={bannerVisible}
        actions={[]}
        icon="wifi-off"
        style={{ backgroundColor: '#fffbe8', borderBottomColor: '#ffbe3b', borderBottomWidth: 1 }}
      >
        You are offline. Showing cached data.
      </Banner>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        stickyHeaderIndices={[0]}
      >
        <View style={styles.stickyHeader}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            onClear={clearSearch}
          />
        </View>

        {renderFilters()}
        <View style={{ paddingHorizontal: 16, marginTop: 8, marginBottom: 8 }}>
          <Button mode="contained" icon="calculator" onPress={handleOpenCalculator} style={{ borderRadius: 24 }}>
            Open Calculator
          </Button>
        </View>
        {renderTopTierCarousel()}
        {renderRecentSearches()}

        {searchQuery.trim() || selectedFilters.length > 0 ? (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>
              Results ({filteredUniversities.length})
            </Text>
            {filteredUniversities.map((university) => {
              // Create tags for each university
              const tags: string[] = [];
              if (university.type) tags.push(university.type);
              if (university.public !== undefined)
                tags.push(university.public ? 'public' : 'private');
              if (university.qs2026 && university.qs2026 <= 10) tags.push('Top 10');
              return (
                <View key={university.id} style={{ marginBottom: 32 }}>
                  <UniversityCard
                    university={university}
                    onPress={() => handleUniversityPress(university)}
                  />
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
                    {tags.map(tag => (
                      <Chip key={tag} style={{ marginRight: 8, marginBottom: 4 }}>{tag}</Chip>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        ) : null}
      </ScrollView>

      <CalculatorModal
        visible={calculatorVisible}
        onClose={() => setCalculatorVisible(false)}
        onCalculate={handleCalculate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral200,
  },
  scrollView: {
    flex: 1,
  },
  stickyHeader: {
    backgroundColor: colors.neutral200,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    ...shadows.small,
  },
  filtersContainer: {
    backgroundColor: colors.neutral100,
    paddingVertical: spacing.sm,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
  },
  section: {
    backgroundColor: colors.neutral100,
    marginBottom: spacing.sm,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.neutral800,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  horizontalList: {
    paddingHorizontal: spacing.md,
  },
  recentItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral300,
  },
  recentText: {
    ...typography.body,
    color: colors.neutral800,
  },
  resultsSection: {
    backgroundColor: colors.neutral100,
    paddingTop: spacing.md,
  },
  resultsTitle: {
    ...typography.h2,
    color: colors.neutral800,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
});