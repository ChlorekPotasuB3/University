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
  logo: string;
  homepage: string;
  qsRank?: number;
  perspektywRank?: number;
  tier: 'Top-tier' | 'National-tier' | 'Standard';
  type: 'public' | 'private';
  courses: Course[];
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