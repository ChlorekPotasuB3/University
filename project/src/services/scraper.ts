import axios from 'axios';
import * as cheerio from 'cheerio';
import { University, Course, MaturaRequirement } from '../types';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export class UniversityScraper {
  private static instance: UniversityScraper;
  
  static getInstance(): UniversityScraper {
    if (!UniversityScraper.instance) {
      UniversityScraper.instance = new UniversityScraper();
    }
    return UniversityScraper.instance;
  }

  async scrapeStudyGovPl(): Promise<Partial<University>[]> {
    try {
      const response = await axios.get('https://study.gov.pl/higher-education-institutions');
      const $ = cheerio.load(response.data);
      const universities: Partial<University>[] = [];

      $('.institution-item').each((index, element) => {
        const $el = $(element);
        const name = $el.find('.institution-name').text().trim();
        const city = $el.find('.institution-city').text().trim();
        const homepage = $el.find('a').attr('href') || '';
        const logo = $el.find('img').attr('src') || '';

        if (name && city) {
          universities.push({
            id: this.generateId(name),
            name,
            city,
            homepage,
            logo,
            type: this.determineType(name),
            courses: []
          });
        }
      });

      return universities;
    } catch (error) {
      console.error('Error scraping study.gov.pl:', error);
      return [];
    }
  }

  async scrapeIndianEmbassyList(): Promise<Partial<University>[]> {
    try {
      const response = await axios.get('https://www.indianembassywarsaw.gov.in/page/list-poland/');
      const $ = cheerio.load(response.data);
      const universities: Partial<University>[] = [];

      $('table tr').each((index, element) => {
        if (index === 0) return; // Skip header
        
        const $el = $(element);
        const cells = $el.find('td');
        
        if (cells.length >= 3) {
          const name = $(cells[0]).text().trim();
          const city = $(cells[1]).text().trim();
          const homepage = $(cells[2]).find('a').attr('href') || $(cells[2]).text().trim();

          if (name && city) {
            universities.push({
              id: this.generateId(name),
              name,
              city,
              homepage,
              type: this.determineType(name),
              courses: []
            });
          }
        }
      });

      return universities;
    } catch (error) {
      console.error('Error scraping Indian Embassy list:', error);
      return [];
    }
  }

  async scrapeQSRankings(): Promise<Map<string, number>> {
    try {
      const response = await axios.get('https://www.topuniversities.com/where-to-study/europe/poland/guide');
      const $ = cheerio.load(response.data);
      const rankings = new Map<string, number>();

      $('.ranking-item, .university-item').each((index, element) => {
        const $el = $(element);
        const name = $el.find('.university-name, .name').text().trim();
        const rankText = $el.find('.rank, .ranking').text().trim();
        const rank = parseInt(rankText.replace(/[^\d]/g, ''));

        if (name && !isNaN(rank)) {
          rankings.set(this.normalizeUniversityName(name), rank);
        }
      });

      return rankings;
    } catch (error) {
      console.error('Error scraping QS rankings:', error);
      return new Map();
    }
  }

  async scrapePerspektywRankings(): Promise<Map<string, number>> {
    try {
      // This would need to be updated with the actual Perspektywy ranking URL
      const rankings = new Map<string, number>();
      
      // Mock data for now - replace with actual scraping
      const mockRankings = [
        'Uniwersytet Warszawski',
        'Uniwersytet Jagielloński',
        'Politechnika Warszawska',
        'Akademia Górniczo-Hutnicza',
        'Uniwersytet Wrocławski'
      ];

      mockRankings.forEach((name, index) => {
        rankings.set(this.normalizeUniversityName(name), index + 1);
      });

      return rankings;
    } catch (error) {
      console.error('Error scraping Perspektywy rankings:', error);
      return new Map();
    }
  }

  async scrapeCourses(university: University): Promise<Course[]> {
    try {
      // This would scrape each university's course pages
      // For now, returning mock data structure
      const courses: Course[] = [];
      
      const response = await axios.get(`${university.homepage}/studia-i-stopnia`);
      const $ = cheerio.load(response.data);

      $('.course-item, .study-program').each((index, element) => {
        const $el = $(element);
        const name = $el.find('.course-name, .program-name').text().trim();
        const lang = $el.find('.language').text().includes('English') ? 'English' : 'Polish';
        const tuitionText = $el.find('.tuition, .fee').text();
        const tuitionPLN = this.extractTuition(tuitionText);

        if (name) {
          courses.push({
            id: this.generateId(`${university.id}-${name}`),
            name,
            lang,
            durationYears: 3.5,
            tuitionPLN,
            mode: 'full-time',
            field: this.determineField(name),
            requirements: this.parseRequirements($el.find('.requirements').text())
          });
        }
      });

      return courses;
    } catch (error) {
      console.error(`Error scraping courses for ${university.name}:`, error);
      return [];
    }
  }

  private parseRequirements(requirementsText: string): MaturaRequirement[] {
    const requirements: MaturaRequirement[] = [];
    
    // Parse requirements like "Matematyka – poziom rozszerzony min 30%"
    const patterns = [
      /(\w+)\s*[–-]\s*poziom\s+(rozszerzony|podstawowy)\s+min\s+(\d+)%/gi,
      /(\w+)\s*\(poziom\s+(rozszerzony|podstawowy)\)\s*[–-]\s*(\d+)%/gi
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(requirementsText)) !== null) {
        requirements.push({
          subject: match[1].trim(),
          level: match[2] === 'rozszerzony' ? 'extended' : 'basic',
          minPercent: parseInt(match[3])
        });
      }
    });

    return requirements;
  }

  private generateId(name: string): string {
    return name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private normalizeUniversityName(name: string): string {
    return name.toLowerCase()
      .replace(/university|uniwersytet|politechnika|akademia/gi, '')
      .trim();
  }

  private determineType(name: string): 'public' | 'private' {
    const publicKeywords = ['uniwersytet', 'politechnika', 'akademia', 'wyższa szkoła'];
    const privateKeywords = ['prywatna', 'niepubliczna', 'wyższa szkoła biznesu'];
    
    const lowerName = name.toLowerCase();
    
    if (privateKeywords.some(keyword => lowerName.includes(keyword))) {
      return 'private';
    }
    
    return 'public'; // Default to public
  }

  private determineField(courseName: string): string {
    const fields = {
      'Computer Science': ['computer', 'informatyka', 'programming', 'software'],
      'Engineering': ['engineering', 'inżynieria', 'technical', 'techniczny'],
      'Medicine': ['medicine', 'medical', 'medycyna', 'health'],
      'Business': ['business', 'management', 'ekonomia', 'finance'],
      'Arts': ['art', 'sztuka', 'design', 'creative']
    };

    const lowerCourseName = courseName.toLowerCase();
    
    for (const [field, keywords] of Object.entries(fields)) {
      if (keywords.some(keyword => lowerCourseName.includes(keyword))) {
        return field;
      }
    }
    
    return 'Other';
  }

  private extractTuition(tuitionText: string): number {
    const match = tuitionText.match(/(\d+(?:\s*\d+)*)/);
    return match ? parseInt(match[1].replace(/\s/g, '')) : 0;
  }
}