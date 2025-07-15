import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import uniDataRaw from './assets/data/universities.json';

// Type for university if available
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

// Type-safe data
const uniData: University[] = uniDataRaw as University[];

export default function App() {
  const openHomepage = (homepage?: string) => {
    if (homepage && typeof homepage === 'string' && homepage.trim().length > 0) {
      Linking.openURL(homepage).catch(() => {
        Alert.alert('Could not open homepage');
      });
    } else {
      Alert.alert('Homepage not available');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🇵🇱 Polish Universities</Text>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {uniData.map((uni) => (
          <View key={uni.id} style={styles.card}>
            <Text style={styles.uniName}>{uni.name}</Text>
            <Text style={styles.uniMeta}>{String(uni.city || '')} • {String(uni.type || '')} • {uni.public ? 'Public' : 'Private'}</Text>
            <Text style={styles.uniRank}>QS 2025: <Text style={{fontWeight:'bold'}}>{uni.qs2025 ?? 'N/A'}</Text> | {uni.tier ?? 'N/A'}</Text>
            <TouchableOpacity style={styles.button} onPress={() => openHomepage(uni.homepage)}>
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
