// Defines the structure for a single subject requirement for a course
export interface MaturaRequirement {
  subject: string;
  level: 'basic' | 'extended';
  minPercent: number;
}

// Defines the structure for a course
export interface Course {
  id: string;
  title: string;
  universityId?: string; // The ID of the university this course belongs to
  universityName?: string; // Added during mapping
  logo?: string; // URL to the course or institution logo
  shortDescription?: string;
  studyFormat?: { title: string; slug: string }[];
  studyPace?: { title: string; slug: string }[];
  requirements?: MaturaRequirement[];
  // Any other fields from the scraped data can be added here
  [key: string]: any; 
}

// Defines the structure for a university
export interface University {
  id: string;
  name: string;
  city: string;
  homepage?: string;
  type?: string;
  public?: boolean;
  qs2026?: number | string;
  the2024?: string;
  edurank2025?: number;
  perspektywy2025?: number;
  tier?: string;
  przelicznikiPdfUrl?: string;
  logo?: string; // URL to the university logo
  courses: Course[];
}

// Defines the structure for the data cached in AsyncStorage
export interface UniversityData {
  unis: University[];
  lastUpdated: string;
}

// Defines the user's input for the calculator
export interface MaturaResult {
  subject: string;
  level: 'basic' | 'extended';
  percent: number;
}

// Defines the result of the qualification calculation for a single course
export interface QualificationResult {
  course: Course;
  university: University;
  qualified: boolean;
  fitScore: number;
}

// Defines the navigation stack parameters
export type RootStackParamList = {
  Home: undefined;
  Detail: { university: University };
  CourseDetail: { course: Course; university: University };
  Results: { maturaResults: MaturaResult[] };
};
