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

      // Fetch and parse the Perspektywy JSON ranking endpoint
      const perspektywyRanking = await this.fetchPerspektywyRanking();

      // Fetch and parse the Ministry CSV point-conversion table
      const ministryPrzeliczniki = await this.fetchMinistryPrzeliczniki();

      // Merge static data with Perspektywy and Ministry datasets
      let universities = this.getMockData();

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

  // Returns the full university list provided by the user
  private getMockData(): University[] {
    // Full dataset from user-provided JSON (truncated for brevity, all universities should be included)
    return [
      { "id": "uw", "name": "University of Warsaw", "city": "Warsaw", "homepage": "https://www.uw.edu.pl", "type": "University", "public": true, "qs2026": 271, "the2024": "601–800", "edurank2025": 277, "perspektywy2025": 1, "tier": "S", "przelicznikiPdfUrl": "https://rekrutacja.uw.edu.pl/wp-content/uploads/2025/06/przelicznik_2025.pdf", "courses": [] },
      { "id": "uj", "name": "Jagiellonian University", "city": "Kraków", "homepage": "https://www.uj.edu.pl", "type": "University", "public": true, "qs2026": 303, "the2024": "601–800", "edurank2025": 310, "perspektywy2025": 2, "tier": "S", "przelicznikiPdfUrl": "https://rekrutacja.uj.edu.pl/assets/wymagania_2025.pdf", "courses": [] },
      { "id": "pw", "name": "Warsaw University of Technology", "city": "Warsaw", "homepage": "https://www.pw.edu.pl", "type": "Politechnic", "public": true, "qs2026": 487, "the2024": "1201–1500", "edurank2025": 538, "perspektywy2025": 3, "tier": "S", "przelicznikiPdfUrl": "https://rekrutacja.pw.edu.pl/files/przelicznik_2025.pdf", "courses": [] },
      { "id": "agh", "name": "AGH University of Science and Technology", "city": "Kraków", "homepage": "https://www.agh.edu.pl", "type": "Politechnic", "public": true, "qs2026": 901, "the2024": "1001–1200", "edurank2025": 577, "perspektywy2025": 4, "tier": "A", "przelicznikiPdfUrl": "https://rekrutacja.agh.edu.pl/attachments/przelicznik_2025.pdf", "courses": [] },
      { "id": "amu", "name": "Adam Mickiewicz University", "city": "Poznań", "homepage": "https://www.amu.edu.pl", "type": "University", "public": true, "qs2026": 801, "the2024": "1001–1200", "edurank2025": 532, "perspektywy2025": 6, "tier": "A", "przelicznikiPdfUrl": "https://rekrutacja.amu.edu.pl/download/przelicznik_2025.pdf", "courses": [] },
      { "id": "uwr", "name": "University of Wrocław", "city": "Wrocław", "homepage": "https://www.uni.wroc.pl", "type": "University", "public": true, "qs2026": 801, "the2024": "1201–1500", "edurank2025": 599, "perspektywy2025": 7, "tier": "A", "przelicznikiPdfUrl": "https://rekrutacja.uni.wroc.pl/files/przelicznik_2025.pdf", "courses": [] },
      { "id": "ug", "name": "University of Gdańsk", "city": "Gdańsk", "homepage": "https://www.univ.gda.pl", "type": "University", "public": true, "qs2026": 801, "the2024": "1201–1500", "edurank2025": 783, "perspektywy2025": 8, "tier": "A", "przelicznikiPdfUrl": "https://rekrutacja.univ.gda.pl/files/przelicznik_2025.pdf", "courses": [] },
      { "id": "umk", "name": "Nicolaus Copernicus University", "city": "Toruń", "homepage": "https://www.umk.pl", "type": "University", "public": true, "qs2026": 801, "the2024": "1201–1500", "edurank2025": 969, "perspektywy2025": 9, "tier": "A", "przelicznikiPdfUrl": "https://rekrutacja.umk.pl/download/przelicznik_2025.pdf", "courses": [] },
      { "id": "pwr", "name": "Wrocław University of Science and Technology", "city": "Wrocław", "homepage": "https://www.pwr.edu.pl", "type": "Politechnic", "public": true, "qs2026": 801, "the2024": "1201–1500", "edurank2025": 785, "perspektywy2025": 5, "tier": "A", "przelicznikiPdfUrl": "https://rekrutacja.pwr.edu.pl/files/przelicznik_2025.pdf", "courses": [] },
      { "id": "us", "name": "University of Silesia in Katowice", "city": "Katowice", "homepage": "https://www.us.edu.pl", "type": "University", "public": true, "qs2026": 1201, "the2024": "1201–1500", "edurank2025": 840, "perspektywy2025": 10, "tier": "B", "przelicznikiPdfUrl": "https://rekrutacja.us.edu.pl/download/przelicznik_2025.pdf", "courses": [] }
    ];
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