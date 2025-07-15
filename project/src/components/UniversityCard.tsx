import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { University } from '../types';

interface UniversityCardProps {
  university: University;
  onPress: () => void;
}

export const UniversityCard: React.FC<UniversityCardProps> = ({ university, onPress }) => {
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

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        {typeof university.logo === 'string' && university.logo.trim().length > 0 ? (
          <Image source={{ uri: String(university.logo || '') }} style={styles.logo} />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>🎓</Text>
          </View>
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.universityName} numberOfLines={2}>
            {university.name}
          </Text>
          <Text style={styles.city}>{String(university.city || '')}</Text>
        </View>
        <View style={[styles.tierBadge, { backgroundColor: getTierColor(String(university.tier || '')) }]}>
          <Text style={styles.tierIcon}>{getTierIcon(String(university.tier || ''))}</Text>
        </View>
      </View>
      
      <View style={styles.info}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Type:</Text>
          <Text style={styles.infoValue}>{String(university.type || '')}</Text>
        </View>
        
        {university.qsRank && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>QS Rank:</Text>
            <Text style={styles.infoValue}>#{university.qsRank}</Text>
          </View>
        )}
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Courses:</Text>
          <Text style={styles.infoValue}>{university.courses.length}</Text>
        </View>
        
        <View style={styles.rankingsRow}>
          {university.qsRank && (
            <View style={styles.rankingBadge}>
              <Text style={styles.rankingText}>QS {university.qsRank}</Text>
            </View>
          )}
          {university.usNewsRank && (
            <View style={styles.rankingBadge}>
              <Text style={styles.rankingText}>US News {university.usNewsRank}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    marginVertical: 16,
    marginHorizontal: 24,
    shadowColor: '#1a237e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.13,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#e3e6f0',
    transitionProperty: 'box-shadow, border-color',
    transitionDuration: '0.2s',
  },
  cardHover: {
    shadowColor: '#3949ab',
    shadowOpacity: 0.20,
    borderColor: '#90caf9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 20,
    backgroundColor: '#f5f6fa',
    borderWidth: 1,
    borderColor: '#c5cae9',
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    borderWidth: 1,
    borderColor: '#c5cae9',
  },
  logoText: {
    fontSize: 32,
    color: '#7986cb',
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  universityName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#23234c',
    marginBottom: 4,
    fontFamily: 'Inter, Arial, sans-serif',
  },
  city: {
    fontSize: 16,
    color: '#7c7c8a',
    fontFamily: 'Inter, Arial, sans-serif',
  },
  homepageBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
    marginTop: 6,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  homepageText: {
    color: '#1976d2',
    fontSize: 13,
    marginLeft: 4,
    fontWeight: '500',
  },
  tierBadge: {
    minWidth: 48,
    minHeight: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 14,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#e3e6f0',
    shadowColor: '#3949ab',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  tierIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tierText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#23234c',
    marginTop: 2,
    textAlign: 'center',
  },
  info: {
    borderTopWidth: 1,
    borderTopColor: '#e3e6f0',
    paddingTop: 16,
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 15,
    color: '#6c7aa0',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#23234c',
  },
  rankingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 2,
  },
  rankingBadge: {
    backgroundColor: '#f8bbd0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  rankingText: {
    fontSize: 13,
    color: '#ad1457',
    fontWeight: '600',
  },
});