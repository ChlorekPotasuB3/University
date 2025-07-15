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
        <View style={styles.headerModern}>
          <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
            <Text style={styles.cancelButtonModern}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.titleModern}>🧮 Matura Calculator</Text>
          <TouchableOpacity onPress={reset} style={styles.headerBtn}>
            <Text style={styles.resetButtonModern}>Reset</Text>
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

          <TouchableOpacity style={styles.addButtonModern} onPress={addResult}>
            <Text style={styles.addButtonTextModern}>+ Add Subject</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footerModern}>
          <TouchableOpacity
            style={[styles.calculateButtonModern, results.length === 0 && styles.disabledButtonModern]}
            onPress={handleCalculate}
            disabled={results.length === 0}
          >
            <Text style={styles.calculateButtonTextModern}>Calculate Qualifications</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fb',
  },
  headerModern: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
    backgroundColor: '#17452A',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  titleModern: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1.1,
  },
  headerBtn: {
    padding: 6,
    borderRadius: 8,
  },
  cancelButtonModern: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#B7CBB0',
    borderRadius: 7,
  },
  resetButtonModern: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#e49b7a',
    borderRadius: 7,
  },
  content: {
    flex: 1,
    padding: 18,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#17452A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 7,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#D0E8D0',
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