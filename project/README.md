# Polish University Search App

A React Native (Expo) application that helps students find Polish universities and calculate their qualification chances based on matura exam results.

## Features

### 🎓 University Database
- **Auto-compiled University List**: Scrapes fresh data from study.gov.pl and Indian Embassy Warsaw
- **Live Course Catalogue**: Fetches undergraduate courses with tuition, duration, and language info
- **Offline Caching**: 24-hour cache with background refresh

### 📊 Matura Calculator
- **Requirements Parser**: Extracts matura requirements from course pages
- **Results Calculator**: Enter your matura scores to see qualified programs
- **Smart Scoring**: Highlights "Top-tier" programs (QS ≤ 600) you qualify for
- **Fit Score**: Shows how far above minimum requirements you are

### 🏆 University Rankings
- **QS Rankings Integration**: Automatically tags universities with QS 2025 ranks
- **Tier System**: 
  - Top-tier: QS rank ≤ 600
  - National-tier: Perspektywy top-20
  - Standard: All others

### 🔍 Search & Filter
- **Real-time Search**: University name, city, course name
- **Advanced Filters**: Field of study, tuition range, language, prestige tier
- **Offline Search**: Uses Fuse.js for fast local search

## Technical Architecture

### Frontend (React Native + Expo)
- **Navigation**: React Navigation 6
- **State Management**: React hooks + AsyncStorage
- **Search**: Fuse.js for fuzzy search
- **UI Components**: Custom components with modern design

### Data Sources
- **Universities**: study.gov.pl + Indian Embassy Warsaw list
- **Courses**: University websites + Shiksha Poland
- **Rankings**: QS World Rankings + Perspektywy (Polish rankings)
- **Requirements**: Course-specific matura requirements

### Data Flow
1. **Scraping Service**: Fetches fresh data every 24h
2. **Data Service**: Manages caching and qualification calculations  
3. **UI Components**: Display universities, courses, and results
4. **Calculator**: Processes matura results against requirements

## Installation

```bash
# Install dependencies
npm install

# Start the development server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android
```

## Usage

### 1. Browse Universities
- View all Polish universities with rankings and course counts
- Filter by tier (Top-tier, National-tier, Standard)
- Search by name, city, or course

### 2. Use Matura Calculator
- Tap the calculator button
- Add your matura subjects with levels (basic/extended) and scores
- Get instant qualification results

### 3. View Results
- See all programs you qualify for
- Highlighted top-tier opportunities
- Sorted by fit score (how far above minimum)

### 4. Explore Details
- Tap any university for detailed information
- View all available courses
- See specific matura requirements

## Data Structure

```typescript
interface University {
  id: string;
  name: string;
  city: string;
  logo: string;
  homepage: string;
  qsRank?: number;
  tier: 'Top-tier' | 'National-tier' | 'Standard';
  type: 'public' | 'private';
  courses: Course[];
}

interface Course {
  id: string;
  name: string;
  lang: string;
  durationYears: number;
  tuitionPLN: number;
  mode: 'full-time' | 'part-time';
  requirements: MaturaRequirement[];
  field: string;
}

interface MaturaRequirement {
  subject: string;
  level: 'basic' | 'extended';
  minPercent: number;
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Disclaimer

This app scrapes publicly available data for educational purposes. University information and requirements may change - always verify with official sources before making decisions.