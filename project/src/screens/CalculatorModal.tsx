import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaturaRow } from '../components/MaturaRow';
import { colors, spacing, typography, shadows } from '../theme';
import { MaturaResult, Course } from '../types/index';
import { useSelection } from '../context/SelectionContext';

interface CalculatorModalProps {
  visible: boolean;
  onClose: () => void;
  onCalculate: (results: MaturaResult[], selectedCourses: Course[]) => void;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({
  visible,
  onClose,
  onCalculate,
}) => {
  const { selectedCourses, clearSelections } = useSelection();
  const [results, setResults] = useState<MaturaResult[]>([
    { subject: '', level: 'basic', percent: 0 },
  ]);

  const addSubject = () => {
    setResults([...results, { subject: '', level: 'basic', percent: 0 }]);
  };

  const updateResult = (index: number, field: keyof MaturaResult, value: any) => {
    const newResults = [...results];
    newResults[index] = { ...newResults[index], [field]: value };
    setResults(newResults);
  };

  const deleteResult = (index: number) => {
    if (results.length > 1) {
      setResults(results.filter((_, i) => i !== index));
    }
  };

  const handleCalculate = () => {
    if (selectedCourses.length === 0) {
      // Optionally, show an alert to the user
      alert('Please select at least one course to calculate your results.');
      return;
    }
    const validResults = results.filter((r) => r.subject && r.percent > 0);
    onCalculate(validResults, selectedCourses);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Matura Calculator</Text>
          <View style={styles.selectionInfo}>
            <Text style={styles.selectionText}>
              {selectedCourses.length} course(s) selected
            </Text>
            <TouchableOpacity onPress={clearSelections}>
              <Text style={styles.clearButton}>Clear</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.neutral800} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.description}>
            Add your matura exam results to see which programs you qualify for.
          </Text>

          {results.map((result, index) => (
            <MaturaRow
              key={index}
              result={result}
              onChange={(field, value) => updateResult(index, field, value)}
              onDelete={() => deleteResult(index)}
            />
          ))}

          <TouchableOpacity style={styles.addButton} onPress={addSubject}>
            <Ionicons name="add" size={20} color={colors.primary} />
            <Text style={styles.addButtonText}>Add Subject</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
            <Text style={styles.calculateButtonText}>CALCULATE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.neutral100,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral300,
  },
  title: {
    ...typography.h2,
    color: colors.neutral800,
  },
  selectionInfo: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.md,
  },
  selectionText: {
    ...typography.small,
    color: colors.neutral600,
  },
  clearButton: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  closeButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.neutral600,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral100,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  addButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.neutral100,
    borderTopWidth: 1,
    borderTopColor: colors.neutral300,
  },
  calculateButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.medium,
  },
  calculateButtonText: {
    ...typography.body,
    color: colors.neutral100,
    fontWeight: '700',
  },
});