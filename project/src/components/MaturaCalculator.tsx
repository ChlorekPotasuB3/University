import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { MaturaResult } from '../types';

interface MaturaCalculatorProps {
  visible: boolean;
  onClose: () => void;
  onCalculate: (results: MaturaResult[]) => void;
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

export const MaturaCalculator: React.FC<MaturaCalculatorProps> = ({
  visible,
  onClose,
  onCalculate,
}) => {
  const [results, setResults] = useState<MaturaResult[]>([]);

  const addResult = () => {
    setResults([...results, { subject: '', level: 'basic', percent: 0 }]);
  };

  const updateResult = (index: number, field: keyof MaturaResult, value: any) => {
    const newResults = [...results];
    newResults[index] = { ...newResults[index], [field]: value };
    setResults(newResults);
  };

  const removeResult = (index: number) => {
    setResults(results.filter((_, i) => i !== index));
  };

  const handleCalculate = () => {
    const validResults = results.filter(r => r.subject && r.percent > 0);
    
    if (validResults.length === 0) {
      Alert.alert('Error', 'Please add at least one matura result');
      return;
    }

    onCalculate(validResults);
    onClose();
  };

  const reset = () => {
    setResults([]);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Matura Calculator</Text>
          <TouchableOpacity onPress={reset}>
            <Text style={styles.resetButton}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.description}>
            Enter your matura exam results to see which university programs you qualify for.
          </Text>

          {results.map((result, index) => (
            <View key={index} style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>Subject {index + 1}</Text>
                <TouchableOpacity onPress={() => removeResult(index)}>
                  <Text style={styles.removeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Subject</Text>
                <View style={styles.subjectButtons}>
                  {SUBJECTS.map((subject) => (
                    <TouchableOpacity
                      key={subject}
                      style={[
                        styles.subjectButton,
                        result.subject === subject && styles.selectedSubjectButton,
                      ]}
                      onPress={() => updateResult(index, 'subject', subject)}
                    >
                      <Text
                        style={[
                          styles.subjectButtonText,
                          result.subject === subject && styles.selectedSubjectButtonText,
                        ]}
                      >
                        {subject}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Level</Text>
                <View style={styles.levelButtons}>
                  <TouchableOpacity
                    style={[
                      styles.levelButton,
                      result.level === 'basic' && styles.selectedLevelButton,
                    ]}
                    onPress={() => updateResult(index, 'level', 'basic')}
                  >
                    <Text
                      style={[
                        styles.levelButtonText,
                        result.level === 'basic' && styles.selectedLevelButtonText,
                      ]}
                    >
                      Basic
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.levelButton,
                      result.level === 'extended' && styles.selectedLevelButton,
                    ]}
                    onPress={() => updateResult(index, 'level', 'extended')}
                  >
                    <Text
                      style={[
                        styles.levelButtonText,
                        result.level === 'extended' && styles.selectedLevelButtonText,
                      ]}
                    >
                      Extended
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Score (%)</Text>
                <TextInput
                  style={styles.percentInput}
                  value={result.percent.toString()}
                  onChangeText={(text) => {
                    const percent = parseInt(text) || 0;
                    updateResult(index, 'percent', Math.min(100, Math.max(0, percent)));
                  }}
                  keyboardType="numeric"
                  placeholder="0-100"
                />
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.addButton} onPress={addResult}>
            <Text style={styles.addButtonText}>+ Add Subject</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.calculateButton, results.length === 0 && styles.disabledButton]}
            onPress={handleCalculate}
            disabled={results.length === 0}
          >
            <Text style={styles.calculateButtonText}>Calculate Qualifications</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cancelButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  resetButton: {
    fontSize: 16,
    color: '#FF3B30',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  removeButton: {
    fontSize: 18,
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  subjectButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
  },
  selectedSubjectButton: {
    backgroundColor: '#007AFF',
  },
  subjectButtonText: {
    fontSize: 14,
    color: '#333',
  },
  selectedSubjectButtonText: {
    color: '#fff',
  },
  levelButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  levelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  selectedLevelButton: {
    backgroundColor: '#007AFF',
  },
  levelButtonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedLevelButtonText: {
    color: '#fff',
  },
  percentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#34C759',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  calculateButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  calculateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});