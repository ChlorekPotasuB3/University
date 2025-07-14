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
        {university.logo ? (
          <Image source={{ uri: university.logo }} style={styles.logo} />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>🎓</Text>
          </View>
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.universityName} numberOfLines={2}>
            {university.name}
          </Text>
          <Text style={styles.city}>{university.city}</Text>
        </View>
        <View style={[styles.tierBadge, { backgroundColor: getTierColor(university.tier) }]}>
          <Text style={styles.tierIcon}>{getTierIcon(university.tier)}</Text>
        </View>
      </View>
      
      <View style={styles.info}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Type:</Text>
          <Text style={styles.infoValue}>{university.type}</Text>
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
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  logoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 24,
  },
  headerInfo: {
    flex: 1,
  },
  universityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  city: {
    fontSize: 14,
    color: '#666',
  },
  tierBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tierIcon: {
    fontSize: 20,
  },
  info: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});