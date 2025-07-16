import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { MaturaResult } from '../types/index';
import { colors, spacing, typography } from '../theme';

interface MaturaRowProps {
  result: MaturaResult;
  onChange: (field: keyof MaturaResult, value: string | number) => void;
  onDelete: () => void;
}

export const MaturaRow: React.FC<MaturaRowProps> = ({ result, onChange, onDelete }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Subject (e.g. Math)"
        value={result.subject}
        onChangeText={(text) => onChange('subject', text)}
        placeholderTextColor={colors.neutral600}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={result.level}
          onValueChange={(itemValue) => onChange('level', itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Basic" value="basic" />
          <Picker.Item label="Extended" value="extended" />
        </Picker>
      </View>
      <TextInput
        style={styles.inputPercent}
        placeholder="%"
        value={result.percent > 0 ? String(result.percent) : ''}
        onChangeText={(text) => onChange('percent', Number(text) || 0)}
        keyboardType="numeric"
        placeholderTextColor={colors.neutral600}
      />
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={22} color={colors.neutral600} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.neutral100,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  input: {
    flex: 1,
    ...typography.body,
    height: 48,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.neutral200,
    borderRadius: 8,
    color: colors.neutral800,
  },
  pickerContainer: {
    height: 48,
    width: 120,
    backgroundColor: colors.neutral200,
    borderRadius: 8,
    marginLeft: spacing.sm,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    color: colors.neutral800,
  },
  inputPercent: {
    ...typography.body,
    height: 48,
    width: 60,
    textAlign: 'center',
    backgroundColor: colors.neutral200,
    borderRadius: 8,
    marginLeft: spacing.sm,
    color: colors.neutral800,
  },
  deleteButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
});
