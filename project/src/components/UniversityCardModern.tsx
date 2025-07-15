import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native';

interface University {
  id: string;
  name: string;
  city: string;
  homepage?: string;
  type: string;
  public?: boolean;
  qs2025?: number;
  tier?: string;
  qsRank?: number;
  theRank?: number;
  edurank?: number;
  perspektywRank?: number;
  usNewsRank?: number;
  courses?: string[];
}

interface UniversityCardProps {
  university: University;
  onPressHomepage: (homepage?: string) => void;
}

export const UniversityCardModern: React.FC<UniversityCardProps> = ({ university, onPressHomepage }) => {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 32, 900);

  return (
    <View style={[styles.card, { width: cardWidth }]}>  
      <View style={styles.headerRow}>
        <Text style={styles.name}>{university.name}</Text>
        <View style={[styles.tier, university.tier === 'Top-tier' ? styles.tierTop : styles.tierNational]}>
          <Text style={styles.tierText}>{university.tier ?? 'N/A'}</Text>
        </View>
      </View>
      <Text style={styles.meta}>{university.city} • {university.type} • {university.public ? 'Public' : 'Private'}</Text>
      <View style={styles.rankingRow}>
        <RankingBadge label="QS 2025" value={university.qs2025} />
        <RankingBadge label="QS" value={university.qsRank} />
        <RankingBadge label="THE" value={university.theRank} />
        <RankingBadge label="EduRank" value={university.edurank} />
        <RankingBadge label="Perspektyw" value={university.perspektywRank} />
        <RankingBadge label="US News" value={university.usNewsRank} />
      </View>
      {university.courses && university.courses.length > 0 && (
        <View style={styles.coursesWrap}>
          <Text style={styles.coursesTitle}>Courses:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{flexDirection:'row',gap:8}}>
            {university.courses.map((course, idx) => (
              <View key={idx} style={styles.courseBubble}>
                <Text style={styles.courseText}>{course}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={() => onPressHomepage(university.homepage)}>
        <Text style={styles.buttonText}>Visit Homepage</Text>
      </TouchableOpacity>
    </View>
  );
};

const RankingBadge = ({ label, value }: { label: string; value?: number }) => (
  <View style={styles.rankBadge}>
    <Text style={styles.rankBadgeLabel}>{label}</Text>
    <Text style={styles.rankBadgeValue}>{value ?? 'N/A'}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 26,
    marginVertical: 14,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#e2e8e4',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1b2e1a',
    flex: 1,
    marginRight: 8,
  },
  tier: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierTop: {
    backgroundColor: '#17452A',
  },
  tierNational: {
    backgroundColor: '#B7CBB0',
  },
  tierText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  meta: {
    color: '#3b5c47',
    fontSize: 16,
    marginBottom: 2,
  },
  rankingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 10,
  },
  rankBadge: {
    backgroundColor: '#D0E8D0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 5,
  },
  rankBadgeLabel: {
    color: '#17452A',
    fontSize: 11,
    fontWeight: '700',
  },
  rankBadgeValue: {
    color: '#17452A',
    fontSize: 13,
    fontWeight: 'bold',
  },
  coursesWrap: {
    marginTop: 10,
    marginBottom: 2,
  },
  coursesTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#17452A',
    marginBottom: 3,
  },
  courseBubble: {
    backgroundColor: '#B7CBB0',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 4,
    marginBottom: 3,
  },
  courseText: {
    color: '#17452A',
    fontWeight: '600',
    fontSize: 13,
  },
  button: {
    backgroundColor: '#17452A',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 22,
    alignSelf: 'flex-end',
    marginTop: 18,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
