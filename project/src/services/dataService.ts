import AsyncStorage from '@react-native-async-storage/async-storage';
import { University, UniversityData, MaturaResult, QualificationResult } from '../types';

const STORAGE_KEY = 'university_data';
const LAST_UPDATE_KEY = 'last_update';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export class DataService {
  private static instance: DataService;
  
  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  async getUniversities(forceRefresh = false): Promise<University[]> {
    try {
      const lastUpdate = await AsyncStorage.getItem(LAST_UPDATE_KEY);
      const now = Date.now();
      
      if (!forceRefresh && lastUpdate && (now - parseInt(lastUpdate)) < CACHE_DURATION) {
        const cachedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (cachedData) {
          const data: UniversityData = JSON.parse(cachedData);
          return data.unis;
        }
      }

      // For now, return mock data until scraping is properly implemented
      const universities = this.getMockData();
      
      // Cache the data
      const dataToCache: UniversityData = {
        unis: universities,
        lastUpdated: new Date().toISOString()
      };
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToCache));
      await AsyncStorage.setItem(LAST_UPDATE_KEY, now.toString());
      
      return universities;
    } catch (error) {
      console.error('Error getting universities:', error);
      return [];
    }
  }

  private getMockData(): University[] {
    return [
      {
        id: 'pw-edu-pl',
        name: 'Politechnika Warszawska',
        city: 'Warsaw',
        logo: '',
        homepage: 'https://pw.edu.pl',
        qsRank: 527,
        tier: 'Top-tier',
        type: 'public',
        courses: [
          {
            id: 'pw-cs',
            name: 'Computer Science',
            lang: 'English',
            durationYears: 3.5,
            tuitionPLN: 21000,
            mode: 'full-time',
            field: 'Computer Science',
            requirements: [
              { subject: 'Matematyka', level: 'extended', minPercent: 30 },
              { subject: 'Informatyka', level: 'basic', minPercent: 30 }
            ]
          }
        ]
      },
      {
        id: 'uj-edu-pl',
        name: 'Uniwersytet Jagielloński',
        city: 'Krakow',
        logo: '',
        homepage: 'https://uj.edu.pl',
        qsRank: 415,
        tier: 'Top-tier',
        type: 'public',
        courses: [
          {
            id: 'uj-med',
            name: 'Medicine',
            lang: 'English',
            durationYears: 6,
            tuitionPLN: 72000,
            mode: 'full-time',
            field: 'Medicine',
            requirements: [
              { subject: 'Biologia', level: 'extended', minPercent: 50 },
              { subject: 'Chemia', level: 'extended', minPercent: 50 }
            ]
          }
        ]
      },
      {
        id: 'agh-edu-pl',
        name: 'Akademia Górniczo-Hutnicza',
        city: 'Krakow',
        logo: '',
        homepage: 'https://agh.edu.pl',
        perspektywRank: 3,
        tier: 'National-tier',
        type: 'public',
        courses: [
          {
            id: 'agh-eng',
            name: 'Mining Engineering',
            lang: 'Polish',
            durationYears: 3.5,
            tuitionPLN: 0,
            mode: 'full-time',
            field: 'Engineering',
            requirements: [
              { subject: 'Matematyka', level: 'extended', minPercent: 40 },
              { subject: 'Fizyka', level: 'basic', minPercent: 30 }
            ]
          }
        ]
      }
    ];
  }

  private determineTier(qsRank?: number, perspektywRank?: number): 'Top-tier' | 'National-tier' | 'Standard' {
    if (qsRank && qsRank <= 600) {
      return 'Top-tier';
    }
    
    if (perspektywRank && perspektywRank <= 20) {
      return 'National-tier';
    }
    
    return 'Standard';
  }

  calculateQualifications(maturaResults: MaturaResult[], universities: University[]): QualificationResult[] {
    const results: QualificationResult[] = [];

    universities.forEach(university => {
      university.courses.forEach(course => {
        const qualified = this.checkQualification(maturaResults, course.requirements);
        const fitScore = this.calculateFitScore(maturaResults, course.requirements);

        results.push({
          course,
          university,
          qualified,
          fitScore
        });
      });
    });

    // Sort by fit score (descending) and qualification status
    return results.sort((a, b) => {
      if (a.qualified !== b.qualified) {
        return a.qualified ? -1 : 1;
      }
      return b.fitScore - a.fitScore;
    });
  }

  private checkQualification(maturaResults: MaturaResult[], requirements: any[]): boolean {
    return requirements.every(req => {
      const result = maturaResults.find(r => 
        r.subject.toLowerCase() === req.subject.toLowerCase() && 
        r.level === req.level
      );
      
      return result && result.percent >= req.minPercent;
    });
  }

  private calculateFitScore(maturaResults: MaturaResult[], requirements: any[]): number {
    let totalScore = 0;
    let validRequirements = 0;

    requirements.forEach(req => {
      const result = maturaResults.find(r => 
        r.subject.toLowerCase() === req.subject.toLowerCase() && 
        r.level === req.level
      );
      
      if (result) {
        totalScore += Math.max(0, result.percent - req.minPercent);
        validRequirements++;
      }
    });

    return validRequirements > 0 ? totalScore / validRequirements : 0;
  }
}