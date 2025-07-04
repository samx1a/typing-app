import { vocabularyGenerator, VocabularyOptions } from './vocabularyGenerator';

export interface TextSource {
  id: string;
  name: string;
  description: string;
  category: 'quotes' | 'programming' | 'lorem' | 'words' | 'sentences' | 'vocabulary';
}

export interface TextGeneratorOptions {
  source?: string;
  length?: 'short' | 'medium' | 'long';
  language?: 'english' | 'programming';
  vocabularyOptions?: VocabularyOptions;
}

class TextGeneratorService {
  private readonly sources: TextSource[] = [
    { id: 'quotes', name: 'Quotes', description: 'Famous quotes and sayings', category: 'quotes' },
    { id: 'programming', name: 'Programming', description: 'Code snippets and technical text', category: 'programming' },
    { id: 'lorem', name: 'Lorem Ipsum', description: 'Classic Lorem Ipsum text', category: 'lorem' },
    { id: 'words', name: 'Common Words', description: 'Frequently used English words', category: 'words' },
    { id: 'sentences', name: 'Sentences', description: 'Natural English sentences', category: 'sentences' },
    { id: 'vocabulary', name: 'Vocabulary Builder', description: 'Learn uncommon words while typing', category: 'vocabulary' }
  ];

  private readonly quotes = [
    "The only way to do great work is to love what you do.",
    "Life is what happens when you're busy making other plans.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The only limit to our realization of tomorrow will be our doubts of today.",
    "In the middle of difficulty lies opportunity.",
    "The best way to predict the future is to invent it.",
    "Don't watch the clock; do what it does. Keep going.",
    "The journey of a thousand miles begins with one step.",
    "What you get by achieving your goals is not as important as what you become by achieving your goals.",
    "The mind is everything. What you think you become.",
    "Quality is not an act, it is a habit.",
    "The only person you are destined to become is the person you decide to be.",
    "Your time is limited, don't waste it living someone else's life.",
    "The greatest glory in living lies not in never falling, but in rising every time we fall."
  ];

  private readonly programmingTexts = [
    "function calculateFibonacci(n) { if (n <= 1) return n; return calculateFibonacci(n - 1) + calculateFibonacci(n - 2); }",
    "const express = require('express'); const app = express(); app.get('/', (req, res) => { res.send('Hello World!'); });",
    "class User { constructor(name, email) { this.name = name; this.email = email; } getInfo() { return this.name + ' (' + this.email + ')'; } }",
    "async function fetchData(url) { try { const response = await fetch(url); const data = await response.json(); return data; } catch (error) { console.error('Error:', error); } }",
    "const numbers = [1, 2, 3, 4, 5]; const doubled = numbers.map(n => n * 2); const sum = numbers.reduce((acc, n) => acc + n, 0);",
    "interface Config { apiKey: string; baseUrl: string; timeout: number; } const config: Config = { apiKey: 'abc123', baseUrl: 'https://api.example.com', timeout: 5000 };",
    "useEffect(() => { const timer = setTimeout(() => { setCount(count + 1); }, 1000); return () => clearTimeout(timer); }, [count]);",
    "const Button = ({ children, onClick, disabled = false }) => { return <button onClick={onClick} disabled={disabled}>{children}</button>; };",
    "SELECT users.name, orders.total FROM users JOIN orders ON users.id = orders.user_id WHERE orders.status = 'completed';",
    "def fibonacci(n): if n <= 1: return n return fibonacci(n-1) + fibonacci(n-2) result = fibonacci(10)"
  ];

  private readonly loremTexts = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."
  ];

  private readonly commonWords = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
    "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
    "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"
  ];

  private readonly sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "How vexingly quick daft zebras jump!",
    "The five boxing wizards jump quickly.",
    "Sphinx of black quartz, judge my vow.",
    "Bright vixens jump; dozy fowl quack.",
    "Quick wafting zephyrs vex bold Jim.",
    "The jay, pig, fox, zebra and my wolves quack!",
    "Blowzy night-frumps vex'd Jack Q.",
    "Glum Schwartzkopf was vex'd by NJ IQ.",
    "The quick brown fox jumps over the lazy dog while the cat sleeps peacefully.",
    "Programming is the art of telling another human being what one wants the computer to do.",
    "The best way to predict the future is to implement it.",
    "Code is read much more often than it is written.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand."
  ];

  getSources(): TextSource[] {
    return this.sources;
  }

  async generateText(options: TextGeneratorOptions = {}): Promise<string> {
    const { source = 'quotes', length = 'medium', language = 'english', vocabularyOptions } = options;

    try {
      // Handle vocabulary source
      if (source === 'vocabulary') {
        const result = await vocabularyGenerator.generateVocabularyText({
          difficulty: vocabularyOptions?.difficulty || 'mixed',
          category: vocabularyOptions?.category,
          length: vocabularyOptions?.length || length
        });
        return result.text;
      }

      // Try to fetch from external API first
      if (source === 'quotes' && language === 'english') {
        const apiText = await this.fetchFromAPI();
        if (apiText) {
          return this.formatText(apiText, length);
        }
      }

      // Fallback to local text sources
      return this.getLocalText(source, length);
    } catch (error) {
      console.warn('Failed to fetch from API, using local text:', error);
      return this.getLocalText(source, length);
    }
  }

  private async fetchFromAPI(): Promise<string | null> {
    try {
      // Try multiple APIs for better reliability
      const apis = [
        'https://api.quotable.io/random',
        'https://zenquotes.io/api/random',
        'https://api.goprogram.ai/inspiration'
      ];

      for (const api of apis) {
        try {
          const response = await fetch(api, { 
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            signal: AbortSignal.timeout(3000) // 3 second timeout
          });
          
          if (response.ok) {
            const data = await response.json();
            
            // Handle different API response formats
            if (data.content) return data.content;
            if (data.quote) return data.quote;
            if (data.q) return data.q;
            if (data.text) return data.text;
            if (typeof data === 'string') return data;
          }
        } catch (error) {
          console.warn(`API ${api} failed:`, error);
          continue;
        }
      }
      
      return null;
    } catch (error) {
      console.warn('All APIs failed:', error);
      return null;
    }
  }

  private getLocalText(source: string, length: 'short' | 'medium' | 'long'): string {
    let textArray: string[];
    
    switch (source) {
      case 'quotes':
        textArray = this.quotes;
        break;
      case 'programming':
        textArray = this.programmingTexts;
        break;
      case 'lorem':
        textArray = this.loremTexts;
        break;
      case 'words':
        textArray = this.commonWords;
        break;
      case 'sentences':
        textArray = this.sentences;
        break;
      default:
        textArray = this.quotes;
    }

    // Select random text based on length
    const randomIndex = Math.floor(Math.random() * textArray.length);
    let text = textArray[randomIndex];

    // Adjust length if needed
    if (source === 'words') {
      const wordCount = length === 'short' ? 20 : length === 'medium' ? 50 : 100;
      const shuffled = [...this.commonWords].sort(() => 0.5 - Math.random());
      text = shuffled.slice(0, wordCount).join(' ');
    }

    return this.formatText(text, length);
  }

  private formatText(text: string, length: 'short' | 'medium' | 'long'): string {
    // Clean up the text
    text = text.replace(/\s+/g, ' ').trim();
    
    // Adjust length if needed
    const words = text.split(' ');
    const targetWords = length === 'short' ? 15 : length === 'medium' ? 30 : 60;
    
    if (words.length > targetWords) {
      text = words.slice(0, targetWords).join(' ');
    }
    
    return text;
  }
}

export const textGenerator = new TextGeneratorService(); 