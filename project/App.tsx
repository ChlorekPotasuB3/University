import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Linking, Alert, Text } from 'react-native';
import { Provider as PaperProvider, Switch, Appbar, FAB, Button, Text as PaperText } from 'react-native-paper';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import uniDataRaw from './PolishUniversityApp/assets/data/universities.json';
import { Hero } from './src/components/Hero';
import { SearchBar } from './src/components/SearchBar';
import { UniversityCardModern } from './src/components/UniversityCardModern';
import { MaturaCalculator } from './src/components/MaturaCalculator';

interface University {
  id: string;
  name: string;
  city: string;
  homepage?: string;
  type: string;
  public?: boolean;
  qs2025?: number;
  tier?: string;
}

const uniData: University[] = uniDataRaw as University[];

export default function App() {
  const [search, setSearch] = useState('');
  const [calculatorVisible, setCalculatorVisible] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const theme = isDark
    ? { ...DarkTheme, colors: { ...DarkTheme.colors, primary: '#2563EB' } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, primary: '#2563EB' } };

  const openHomepage = (homepage?: string) => {
    if (homepage && typeof homepage === 'string' && homepage.trim().length > 0) {
      Linking.openURL(homepage).catch(() => {
        Alert.alert('Could not open homepage');
      });
    } else {
      Alert.alert('Homepage not available');
    }
  };

  const filtered = uniData.filter(uni =>
    uni.name.toLowerCase().includes(search.toLowerCase()) ||
    uni.city.toLowerCase().includes(search.toLowerCase()) ||
    (uni.type && uni.type.toLowerCase().includes(search.toLowerCase()))
  );

  function HeaderRight({ isDark, toggle }: { isDark: boolean; toggle: () => void }) {
    return (
      <Appbar.Header>
        <Appbar.Content title="PolandUniFinder" />
        <Switch value={isDark} onValueChange={toggle} color="#2563EB" />
      </Appbar.Header>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <HeaderRight isDark={isDark} toggle={() => setIsDark(!isDark)} />
          <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
            <Hero />
            <View style={styles.searchWrap}>
              <SearchBar
                value={search}
                onChangeText={setSearch}
                placeholder="Search university or city..."
                onClear={() => setSearch('')}
              />
            </View>
            <Text style={styles.sectionTitle}>Universities</Text>
            <View style={styles.listWrap}>
              {filtered.length === 0 ? (
                <Text style={styles.noResults}>No universities found.</Text>
              ) : (
                filtered.map(uni => (
                  <UniversityCardModern
                    key={uni.id}
                    university={uni}
                    onPressHomepage={openHomepage}
                  />
                ))
              )}
            </View>
          </ScrollView>
          <FAB
            style={styles.fab}
            icon="calculator"
            label="Calculator"
            onPress={() => setCalculatorVisible(true)}
            color="#fff"
          />
          <MaturaCalculator
            visible={calculatorVisible}
            onClose={() => setCalculatorVisible(false)}
            onCalculate={() => setCalculatorVisible(false)}
          />
          <StatusBar style="auto" />
        </View>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    marginTop: -28,
    marginBottom: 12,
    paddingHorizontal: 18,
    zIndex: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#17452A',
    marginLeft: 24,
    marginBottom: 8,
    marginTop: 8,
  },
  listWrap: {
    paddingBottom: 32,
  },
  noResults: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 30,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#17452A',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 28,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 7,
    zIndex: 10,
  },
  fabText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1.1,
  },
});