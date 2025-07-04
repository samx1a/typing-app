export interface AppSettings {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  showCursor: boolean;
  fontSize: 'small' | 'medium' | 'large';
  autoStart: boolean;
  showTimer: boolean;
  showWpm: boolean;
  showAccuracy: boolean;
  showErrors: boolean;
  textSource: string;
  textLength: 'short' | 'medium' | 'long';
  soundVolume: number;
  vocabularyDifficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
  vocabularyCategory?: string;
}

export interface TestResult {
  wpm: number;
  accuracy: number;
  errors: number;
  timeElapsed: number;
  timestamp: Date;
  textSource: string;
  textLength: string;
  charactersTyped: number;
  charactersCorrect: number;
}

class StorageService {
  private readonly SETTINGS_KEY = 'typing-app-settings';
  private readonly RESULTS_KEY = 'typing-app-results';
  private readonly STATS_KEY = 'typing-app-stats';

  // Default settings
  private readonly defaultSettings: AppSettings = {
    theme: 'light',
    soundEnabled: true,
    showCursor: true,
    fontSize: 'medium',
    autoStart: false,
    showTimer: true,
    showWpm: true,
    showAccuracy: true,
    showErrors: true,
    textSource: 'quotes',
    textLength: 'medium',
    soundVolume: 0.3
  };

  // Settings methods
  getSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(this.SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to handle missing properties
        return { ...this.defaultSettings, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load settings:', error);
    }
    return { ...this.defaultSettings };
  }

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save settings:', error);
    }
  }

  // Test results methods
  getTestResults(): TestResult[] {
    try {
      const stored = localStorage.getItem(this.RESULTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        return parsed.map((result: any) => ({
          ...result,
          timestamp: new Date(result.timestamp)
        }));
      }
    } catch (error) {
      console.warn('Failed to load test results:', error);
    }
    return [];
  }

  saveTestResult(result: TestResult): void {
    try {
      const results = this.getTestResults();
      results.unshift(result);
      
      // Keep only the last 100 results
      const limitedResults = results.slice(0, 100);
      
      localStorage.setItem(this.RESULTS_KEY, JSON.stringify(limitedResults));
    } catch (error) {
      console.warn('Failed to save test result:', error);
    }
  }

  clearTestResults(): void {
    try {
      localStorage.removeItem(this.RESULTS_KEY);
    } catch (error) {
      console.warn('Failed to clear test results:', error);
    }
  }

  // Statistics methods
  getStats() {
    try {
      const stored = localStorage.getItem(this.STATS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load stats:', error);
    }
    return {
      totalTests: 0,
      totalTime: 0,
      averageWpm: 0,
      bestWpm: 0,
      averageAccuracy: 0,
      totalCharacters: 0,
      totalErrors: 0
    };
  }

  updateStats(result: TestResult): void {
    try {
      const results = this.getTestResults();
      
      // Recalculate all stats
      const newStats = {
        totalTests: results.length,
        totalTime: results.reduce((sum, r) => sum + r.timeElapsed, 0),
        averageWpm: results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.wpm, 0) / results.length) : 0,
        bestWpm: results.length > 0 ? Math.max(...results.map(r => r.wpm)) : 0,
        averageAccuracy: results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.accuracy, 0) / results.length) : 0,
        totalCharacters: results.reduce((sum, r) => sum + r.charactersTyped, 0),
        totalErrors: results.reduce((sum, r) => sum + r.errors, 0)
      };
      
      localStorage.setItem(this.STATS_KEY, JSON.stringify(newStats));
    } catch (error) {
      console.warn('Failed to update stats:', error);
    }
  }

  // Utility methods
  clearAllData(): void {
    try {
      localStorage.removeItem(this.SETTINGS_KEY);
      localStorage.removeItem(this.RESULTS_KEY);
      localStorage.removeItem(this.STATS_KEY);
    } catch (error) {
      console.warn('Failed to clear data:', error);
    }
  }

  exportData(): string {
    try {
      const data = {
        settings: this.getSettings(),
        results: this.getTestResults(),
        stats: this.getStats(),
        exportDate: new Date().toISOString()
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.warn('Failed to export data:', error);
      return '';
    }
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.settings) {
        this.saveSettings(data.settings);
      }
      
      if (data.results) {
        localStorage.setItem(this.RESULTS_KEY, JSON.stringify(data.results));
      }
      
      if (data.stats) {
        localStorage.setItem(this.STATS_KEY, JSON.stringify(data.stats));
      }
      
      return true;
    } catch (error) {
      console.warn('Failed to import data:', error);
      return false;
    }
  }
}

export const storage = new StorageService(); 