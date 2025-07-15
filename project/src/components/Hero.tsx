import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Hero: React.FC = () => (
  <View style={styles.hero}>
    <Text style={styles.headline}>Find Your Dream Polish University</Text>
    <Text style={styles.tagline}>
      Compare, calculate, and explore top Polish universities in one place.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    backgroundColor: '#17452A',
    paddingTop: 48,
    paddingBottom: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headline: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  tagline: {
    color: '#D0E8D0',
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 16,
    marginTop: 2,
  },
});
