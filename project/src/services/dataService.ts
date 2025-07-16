import AsyncStorage from '@react-native-async-storage/async-storage';
import { University, UniversityData, MaturaResult, QualificationResult, Course } from '../types';
import * as universityData from '../../assets/data/universities.json';
import * as courseData from '../../assets/data/courses.json';

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

      // Fetch and parse the Perspektywy JSON ranking endpoint
      const perspektywyRanking = await this.fetchPerspektywyRanking();

      // Fetch and parse the Ministry CSV point-conversion table
      const ministryPrzeliczniki = await this.fetchMinistryPrzeliczniki();

      // Load static data from JSON files
      let universities: University[] = JSON.parse(JSON.stringify(universityData));
      const courses: Course[] = JSON.parse(JSON.stringify(courseData)).courses;

      // Create a map of courses by university ID for efficient merging
      const coursesMap = new Map<string, Course[]>();
      courses.forEach(course => {
        // Assuming course has a universityId property
        const uniId = (course as any).universityId;
        if (uniId) {
            if (!coursesMap.has(uniId)) {
                coursesMap.set(uniId, []);
            }
            coursesMap.get(uniId)?.push(course);
        }
      });

      // Merge courses into universities
      universities.forEach(uni => {
        if (coursesMap.has(uni.id)) {
            uni.courses = coursesMap.get(uni.id) || [];
        }
      });

      // Map Perspektywy ranking by university ID or name
      const perspektywyMap = new Map();
      perspektywyRanking.forEach((item: any) => {
        perspektywyMap.set((item.id || item.name || '').toLowerCase(), item);
      });

      // Group Ministry przeliczniki by university_code and field_code
      const przelicznikiMap = new Map();
      ministryPrzeliczniki.forEach((row: any) => {
        const key = `${row.university_code}|${row.field_code}`;
        if (!przelicznikiMap.has(key)) przelicznikiMap.set(key, []);
        przelicznikiMap.get(key).push(row);
      });

      // If you need to merge additional data from Perspektywy or Ministry, do it here using the new fields only
      // For now, we assume getMockData() is the source of truth and fields are already up to date
      // If you want to enrich courses with Ministry requirements, do so below if courses exist
      universities = universities.map(u => {
        if (u.courses && Array.isArray(u.courses)) {
          u.courses = u.courses.map(c => {
            const przeliczniki = przelicznikiMap.get(`${u.id}|${c.id}`) || [];
            if (przeliczniki.length > 0) {
              c.requirements = przeliczniki.map((row: any) => ({
                subject: row.matura_subject,
                level: row.level === 'rozszerzony' ? 'extended' : 'basic',
                minPercent: Math.round((row.weight_factor || 0) * 100)
              }));
            }
            return c;
          });
        }
        return u;
      });

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



  // Fetch and parse the Perspektywy JSON ranking endpoint
  async fetchPerspektywyRanking() {
    try {
      const response = await fetch('https://raw.githubusercontent.com/perspektywy/rankingi/main/uczelnie2024.json');
      if (!response.ok) throw new Error('Failed to fetch Perspektywy ranking');
      const data = await response.json();
      // Data is an array of universities with codes, names, and ranks
      return data;
    } catch (e) {
      console.error('Error fetching Perspektywy ranking:', e);
      return [];
    }
  }

  // Fetch and parse the Ministry CSV point-conversion table
  async fetchMinistryPrzeliczniki() {
    try {
      const response = await fetch('https://rekrutacja.perspektywy.pl/export/przeliczniki.csv');
      if (!response.ok) throw new Error('Failed to fetch Ministry CSV');
      const csvText = await response.text();
      // Parse CSV: university_code, field_code, matura_subject, level, weight_factor
      const lines = csvText.split('\n').filter(Boolean);
      const header = lines[0].split(',');
      const rows = lines.slice(1).map(line => {
        const cols = line.split(',');
        return {
          university_code: cols[0],
          field_code: cols[1],
          matura_subject: cols[2],
          level: cols[3],
          weight_factor: parseFloat(cols[4])
        };
      });
      return rows;
    } catch (e) {
      console.error('Error fetching Ministry przeliczniki:', e);
      return [];
    }
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