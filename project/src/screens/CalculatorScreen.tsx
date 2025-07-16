import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const CalculatorScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matura Calculator</Text>
      <Text style={styles.subtitle}>This feature is under construction.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
