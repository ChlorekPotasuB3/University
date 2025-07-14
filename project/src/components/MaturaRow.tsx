import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, shadows } from '../theme';
import { MaturaResult } from '../types';

interface MaturaRowProps {
  result: MaturaResult;
  onChange: (field: keyof MaturaResult, value: any) => void;
  onDelete: () => void;
}

const SUBJECTS = [
  'Matematyka',
  'Język polski',
  'Język angielski',
  'Język niemiecki',
  'Fizyka',
  'Chemia',
  'Biologia',
  'Geografia',
  'Historia',
  'Wiedza o społeczeństwie',
  'Informatyka',
];

export const MaturaRow: React.FC<MaturaRowProps> = ({ result, onChange, onDelete }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Subject</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={result.subject}
              onValueChange={(value) => onChange('subject', value)}
              style={styles.pickerStyle}
            >
              <Picker.Item label="Select subject..." value="" />
              {SUBJECTS.map((subject) => (
                <Picker.Item key={subject} label={subject} value={subject} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Level</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={result.level}
              onValueChange={(value) => onChange('level', value)}
              style={styles.pickerStyle}
            >
              <Picker.Item label="Basic" value="basic" />
              <Picker.Item label="Extended" value="extended" />
            </Picker>
          </View>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Score (%)</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={result.percent}
              onValueChange={(value) => onChange('percent', value)}
              style={styles.pickerStyle}
            >
              {Array.from({ length: 21 }, (_, i) => i * 5).map((percent) => (
                <Picker.Item key={percent} label={`${percent}%`} value={percent} />
              ))}
            </Picker>
          </View>
        </View>

        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={20} color={colors.accent} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral100,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  pickerContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  label: {
    ...typography.small,
    color: colors.neutral600,
    marginBottom: spacing.xs,
  },
  picker: {
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: 8,
    backgroundColor: colors.neutral200,
  },
  pickerStyle: {
    height: 40,
  },
  deleteButton: {
    padding: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
});