import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { University, MaturaResult } from '../types'; // Import types

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { UniversityDetailScreen } from '../screens/UniversityDetailScreen';
import { CalculatorScreen } from '../screens/CalculatorScreen';
import { ResultsScreen } from '../screens/ResultsScreen';
import { CourseDetailScreen } from '../screens/CourseDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Home: undefined;
  Detail: { university: University };
  CourseDetail: { course: any; university: University };
  Calculator: undefined;
  Results: { maturaResults: MaturaResult[] };
};

export const AppNavigator: React.FC = () => {
  const { paperTheme } = useTheme();

  return (
    <NavigationContainer theme={paperTheme as any}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: paperTheme.colors.primary,
          },
          headerTintColor: paperTheme.colors.onPrimary,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'PolandUniFinder' }}
        />
        <Stack.Screen 
          name="Detail" 
          component={UniversityDetailScreen} 
          options={{ title: 'University Details' }}
        />
        <Stack.Screen 
          name="CourseDetail" 
          component={CourseDetailScreen} 
          options={{ title: 'Course Details' }}
        />
        <Stack.Screen 
          name="Calculator" 
          component={CalculatorScreen} 
          options={{ title: 'Matura Calculator' }}
        />
        <Stack.Screen 
          name="Results" 
          component={ResultsScreen} 
          options={{ title: 'Calculation Results' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
