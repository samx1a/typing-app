export interface VocabularyWord {
  word: string;
  definition: string;
  example: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface VocabularyOptions {
  difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
  category?: string;
  length?: 'short' | 'medium' | 'long';
}

class VocabularyGeneratorService {
  private readonly vocabularyWords: VocabularyWord[] = [
    // Easy uncommon words
    {
      word: "serendipity",
      definition: "finding something good without looking for it",
      example: "Meeting my best friend at that coffee shop was pure serendipity.",
      difficulty: "easy",
      category: "luck"
    },
    {
      word: "ubiquitous",
      definition: "seeming to be everywhere at the same time",
      example: "Smartphones have become ubiquitous in modern society.",
      difficulty: "easy",
      category: "presence"
    },
    {
      word: "ephemeral",
      definition: "lasting for a very short time",
      example: "The beauty of cherry blossoms is ephemeral, lasting only a few days.",
      difficulty: "easy",
      category: "time"
    },
    {
      word: "mellifluous",
      definition: "sounding sweet and smooth, like honey",
      example: "Her mellifluous voice made the song even more beautiful.",
      difficulty: "easy",
      category: "sound"
    },
    {
      word: "perspicacious",
      definition: "having a clear understanding of things",
      example: "The detective's perspicacious observations helped solve the case.",
      difficulty: "easy",
      category: "intelligence"
    },
    {
      word: "quintessential",
      definition: "the perfect example of something",
      example: "This restaurant is the quintessential Italian dining experience.",
      difficulty: "easy",
      category: "perfection"
    },
    {
      word: "eloquent",
      definition: "speaking in a clear and beautiful way",
      example: "Her eloquent speech moved everyone in the audience.",
      difficulty: "easy",
      category: "speech"
    },
    {
      word: "resilient",
      definition: "able to recover quickly from difficult situations",
      example: "Children are surprisingly resilient when facing challenges.",
      difficulty: "easy",
      category: "strength"
    },
    {
      word: "authentic",
      definition: "genuine and real, not fake",
      example: "The restaurant serves authentic Mexican cuisine.",
      difficulty: "easy",
      category: "truth"
    },
    {
      word: "innovative",
      definition: "introducing new ideas or methods",
      example: "The company's innovative approach changed the industry.",
      difficulty: "easy",
      category: "creativity"
    },

    // Medium difficulty words
    {
      word: "egregious",
      definition: "something that's outrageously bad or shocking",
      example: "The company's egregious mistake cost them millions of dollars.",
      difficulty: "medium",
      category: "bad"
    },
    {
      word: "pragmatic",
      definition: "dealing with things in a practical way",
      example: "We need a pragmatic solution to this complex problem.",
      difficulty: "medium",
      category: "practical"
    },
    {
      word: "diligent",
      definition: "working hard and being careful about details",
      example: "The diligent student always completed her homework on time.",
      difficulty: "medium",
      category: "work"
    },
    {
      word: "concise",
      definition: "saying what you need to say in few words",
      example: "Please give me a concise summary of the meeting.",
      difficulty: "medium",
      category: "communication"
    },
    {
      word: "versatile",
      definition: "able to do many different things well",
      example: "This versatile tool can be used for multiple purposes.",
      difficulty: "medium",
      category: "ability"
    },
    {
      word: "profound",
      definition: "having deep meaning or importance",
      example: "The book had a profound impact on my thinking.",
      difficulty: "medium",
      category: "depth"
    },
    {
      word: "tenacious",
      definition: "not giving up easily, holding on tightly",
      example: "Her tenacious spirit helped her overcome many obstacles.",
      difficulty: "medium",
      category: "persistence"
    },
    {
      word: "astute",
      definition: "clever and good at understanding situations",
      example: "The astute businessman saw the opportunity before others did.",
      difficulty: "medium",
      category: "intelligence"
    },
    {
      word: "eloquent",
      definition: "speaking in a clear and beautiful way",
      example: "His eloquent words inspired the entire crowd.",
      difficulty: "medium",
      category: "speech"
    },
    {
      word: "resilient",
      definition: "able to bounce back from difficult situations",
      example: "The resilient community rebuilt after the natural disaster.",
      difficulty: "medium",
      category: "strength"
    },

    // Hard difficulty words
    {
      word: "surreptitious",
      definition: "done secretly, trying not to be noticed",
      example: "He made a surreptitious glance at his watch during the meeting.",
      difficulty: "hard",
      category: "secrecy"
    },
    {
      word: "ubiquitous",
      definition: "present everywhere at the same time",
      example: "The ubiquitous nature of social media affects everyone's daily life.",
      difficulty: "hard",
      category: "presence"
    },
    {
      word: "perspicacious",
      definition: "having a keen understanding and insight",
      example: "The perspicacious analyst predicted the market crash months in advance.",
      difficulty: "hard",
      category: "intelligence"
    },
    {
      word: "mellifluous",
      definition: "sweet and smooth sounding, like flowing honey",
      example: "The mellifluous tones of the violin filled the concert hall.",
      difficulty: "hard",
      category: "sound"
    },
    {
      word: "quintessential",
      definition: "representing the most perfect example of a quality",
      example: "This painting is the quintessential representation of the Romantic era.",
      difficulty: "hard",
      category: "perfection"
    },
    {
      word: "ephemeral",
      definition: "lasting for a very brief period of time",
      example: "The ephemeral beauty of the sunset lasted only a few minutes.",
      difficulty: "hard",
      category: "time"
    },
    {
      word: "serendipitous",
      definition: "occurring or discovered by chance in a happy way",
      example: "Their serendipitous meeting at the airport led to a lifelong friendship.",
      difficulty: "hard",
      category: "luck"
    },
    {
      word: "eloquent",
      definition: "fluent and persuasive in speech or writing",
      example: "The eloquent speaker captivated the audience with her powerful words.",
      difficulty: "hard",
      category: "speech"
    },
    {
      word: "resilient",
      definition: "able to withstand or recover quickly from difficult conditions",
      example: "The resilient ecosystem adapted to the changing climate.",
      difficulty: "hard",
      category: "strength"
    },
    {
      word: "authentic",
      definition: "genuine and original, not a copy or imitation",
      example: "The authentic manuscript revealed new insights about the author's life.",
      difficulty: "hard",
      category: "truth"
    }
  ];

  private readonly categories = [
    "intelligence", "speech", "strength", "time", "sound", "perfection", 
    "luck", "truth", "creativity", "practical", "work", "communication", 
    "ability", "depth", "persistence", "bad", "presence", "secrecy"
  ];

  getCategories(): string[] {
    return this.categories;
  }

  async generateVocabularyText(options: VocabularyOptions = {}): Promise<{
    text: string;
    word: VocabularyWord;
    explanation: string;
  }> {
    const { difficulty = 'mixed', category, length = 'medium' } = options;

    // Filter words based on difficulty and category
    let filteredWords = this.vocabularyWords;
    
    if (difficulty !== 'mixed') {
      filteredWords = filteredWords.filter(word => word.difficulty === difficulty);
    }
    
    if (category) {
      filteredWords = filteredWords.filter(word => word.category === category);
    }

    if (filteredWords.length === 0) {
      filteredWords = this.vocabularyWords; // Fallback to all words
    }

    // Select a random word
    const randomWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    
    // Create text based on length
    let text: string;
    let explanation: string;

    switch (length) {
      case 'short':
        text = randomWord.example;
        explanation = `${randomWord.word}: ${randomWord.definition}`;
        break;
      case 'long':
        text = `${randomWord.example} The word "${randomWord.word}" means ${randomWord.definition}. This ${randomWord.difficulty} vocabulary word is often used in ${randomWord.category}-related contexts.`;
        explanation = `${randomWord.word}: ${randomWord.definition}`;
        break;
      default: // medium
        text = `${randomWord.example} The word "${randomWord.word}" means ${randomWord.definition}.`;
        explanation = `${randomWord.word}: ${randomWord.definition}`;
        break;
    }

    return {
      text: text.trim(),
      word: randomWord,
      explanation
    };
  }

  async generateVocabularySet(count: number = 5, options: VocabularyOptions = {}): Promise<{
    text: string;
    words: VocabularyWord[];
    explanations: string[];
  }> {
    const words: VocabularyWord[] = [];
    const explanations: string[] = [];
    let fullText = '';

    for (let i = 0; i < count; i++) {
      const result = await this.generateVocabularyText(options);
      words.push(result.word);
      explanations.push(result.explanation);
      
      if (i > 0) fullText += ' ';
      fullText += result.text;
    }

    return {
      text: fullText,
      words,
      explanations
    };
  }

  getRandomWord(): VocabularyWord {
    return this.vocabularyWords[Math.floor(Math.random() * this.vocabularyWords.length)];
  }

  searchWords(query: string): VocabularyWord[] {
    const lowercaseQuery = query.toLowerCase();
    return this.vocabularyWords.filter(word => 
      word.word.toLowerCase().includes(lowercaseQuery) ||
      word.definition.toLowerCase().includes(lowercaseQuery) ||
      word.category.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export const vocabularyGenerator = new VocabularyGeneratorService(); 