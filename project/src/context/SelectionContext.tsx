import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Course } from '../types';

// Define the shape of the context
interface SelectionContextType {
  selectedCourses: Course[];
  addCourse: (course: Course) => void;
  removeCourse: (courseId: string) => void;
  isCourseSelected: (courseId: string) => boolean;
  clearSelections: () => void;
}

// Create the context with a default undefined value
const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

// Create a provider component
export const SelectionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  const addCourse = (course: Course) => {
    setSelectedCourses(prev => [...prev, course]);
  };

  const removeCourse = (courseId: string) => {
    setSelectedCourses(prev => prev.filter(c => c.id !== courseId));
  };

  const isCourseSelected = (courseId: string) => {
    return selectedCourses.some(c => c.id === courseId);
  };

  const clearSelections = () => {
    setSelectedCourses([]);
  };

  return (
    <SelectionContext.Provider value={{ selectedCourses, addCourse, removeCourse, isCourseSelected, clearSelections }}>
      {children}
    </SelectionContext.Provider>
  );
};

// Create a custom hook for easy consumption of the context
export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
};
