export interface MaturaRequirement {
  subject: string;
  level: 'basic' | 'extended';
  minPercent: number;
}

export interface Course {
  id: string;
  name: string;
  lang: string;
  durationYears: number;
  tuitionPLN: number;
  tuitionEUR?: number;
  mode: 'full-time' | 'part-time';
  requirements: MaturaRequirement[];
  field: string;
}

export interface University {
  id: string;
  name: string;
  city: string;
  homepage: string;
  type: string; // e.g., 'University', 'Politechnic', etc.
  public?: boolean;
  qs2026?: number;
  the2024?: string;
  edurank2025?: number;
  perspektywy2025?: number;
  tier?: string; // e.g., 'S', 'A', 'B', 'C', 'D'
  przelicznikiPdfUrl?: string;
  logo?: string;
  // Legacy/compatibility fields for UI
  qsRank?: number;
  theRank?: string;
  edurank?: number;
  perspektywRank?: number;
  usNewsRank?: number;
  courses: Course[]; // Always defined, never undefined
}

export interface UniversityData {
  unis: University[];
  lastUpdated: string;
}

export interface MaturaResult {
  subject: string;
  level: 'basic' | 'extended';
  percent: number;
}

export interface QualificationResult {
  course: Course;
  university: University;
  fitScore: number;
  qualified: boolean;
}