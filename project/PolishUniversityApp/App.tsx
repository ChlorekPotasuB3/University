import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import uniData from './assets/data/universities.json';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>🇵🇱 Polish Universities</Text>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {uniData.map((uni) => (
          <View key={uni.id} style={styles.card}>
            <Text style={styles.uniName}>{uni.name}</Text>
            <Text style={styles.uniMeta}>{uni.city} • {uni.type} • {uni.public ? 'Public' : 'Private'}</Text>
            <Text style={styles.uniRank}>QS 2025: <Text style={{fontWeight:'bold'}}>{uni.qs2025}</Text> | {uni.tier}</Text>
            <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(uni.homepage)}>
              <Text style={styles.buttonText}>Visit Homepage</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fb',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 48,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a237e',
    letterSpacing: 1.2,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    width: 340,
    marginVertical: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.09,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  uniName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#263238',
    marginBottom: 4,
  },
  uniMeta: {
    fontSize: 15,
    color: '#607d8b',
    marginBottom: 2,
  },
  uniRank: {
    fontSize: 14,
    color: '#3949ab',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
