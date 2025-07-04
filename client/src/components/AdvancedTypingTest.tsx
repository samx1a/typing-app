import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  RotateCcw, 
  Volume2,
  VolumeX
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import { textGenerator } from '../services/textGenerator';
import { vocabularyGenerator, VocabularyWord } from '../services/vocabularyGenerator';
import { soundEffects } from '../services/soundEffects';
import { storage, TestResult, AppSettings } from '../services/storage';
import { useAuth } from '../services/auth';
import { getNextVocabWord, updateVocabProgress, getUserVocabStats } from '../services/adaptiveVocab';
import VocabularyDisplay from './VocabularyDisplay';

interface TypingStats {
  wpm: number;
  accuracy: number;
  errors: number;
  timeElapsed: number;
  charactersTyped: number;
  charactersCorrect: number;
}

interface AdvancedTypingTestProps {
  appSettings: AppSettings;
}

const AdvancedTypingTest: React.FC<AdvancedTypingTestProps> = ({ appSettings }) => {
  const { user } = useAuth();
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isTestActive, setIsTestActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    errors: 0,
    timeElapsed: 0,
    charactersTyped: 0,
    charactersCorrect: 0
  });
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wpmHistory, setWpmHistory] = useState<{time: number, wpm: number}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTextSource, setCurrentTextSource] = useState(appSettings.textSource);
  const [currentVocabularyWord, setCurrentVocabularyWord] = useState<VocabularyWord | null>(null);
  const [showVocabularyDisplay, setShowVocabularyDisplay] = useState(false);
  const [userVocabStats, setUserVocabStats] = useState<{
    total: number;
    mastered: number;
    learning: number;
    review: number;
    new: number;
  } | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Font size class for typing area
  let fontSizeClass = 'text-2xl';
  if (appSettings.fontSize === 'small') fontSizeClass = 'text-lg';
  else if (appSettings.fontSize === 'large') fontSizeClass = 'text-4xl';

  // Load test results on mount
  useEffect(() => {
    const results = storage.getTestResults();
    setTestResults(results);
  }, []);

  // Load user vocabulary stats when user changes
  useEffect(() => {
    if (user) {
      loadUserVocabStats();
    } else {
      setUserVocabStats(null);
    }
  }, [user]);

  const loadUserVocabStats = async () => {
    if (!user) return;
    
    try {
      const stats = await getUserVocabStats(user.id);
      setUserVocabStats(stats);
    } catch (error) {
      console.error('Error loading user vocab stats:', error);
    }
  };

  // Update sound effects when settings change
  useEffect(() => {
    soundEffects.setEnabled(appSettings.soundEnabled);
    soundEffects.setVolume(appSettings.soundVolume);
  }, [appSettings.soundEnabled, appSettings.soundVolume]);

  // Focus input when test starts or when not showing results
  useEffect(() => {
    if (isTestActive && !showResults && !isLoading) {
      inputRef.current?.focus();
    }
  }, [isTestActive, showResults, isLoading]);

  const fetchRandomText = useCallback(async () => {
    setIsLoading(true);
    try {
      let text: string;
      let vocabularyWord: VocabularyWord | null = null;

      if (appSettings.textSource === 'vocabulary') {
        if (user) {
          // Use adaptive vocabulary for logged-in users
          const nextWord = await getNextVocabWord(user.id);
          if (nextWord) {
            // Find the word in our vocabulary generator
            const allWords = vocabularyGenerator['vocabularyWords'] || [];
            const wordData = allWords.find(w => w.word === nextWord);
            if (wordData) {
              vocabularyWord = wordData;
              // Generate text with this specific word
              const result = await vocabularyGenerator.generateVocabularyText({
                difficulty: appSettings.vocabularyDifficulty || 'mixed',
                category: appSettings.vocabularyCategory,
                length: appSettings.textLength
              });
              text = result.text;
              setCurrentVocabularyWord(vocabularyWord);
            } else {
              // Fallback to random word
              const result = await vocabularyGenerator.generateVocabularyText({
                difficulty: appSettings.vocabularyDifficulty || 'mixed',
                category: appSettings.vocabularyCategory,
                length: appSettings.textLength
              });
              text = result.text;
              vocabularyWord = result.word;
              setCurrentVocabularyWord(vocabularyWord);
            }
          } else {
            // Fallback to random word
            const result = await vocabularyGenerator.generateVocabularyText({
              difficulty: appSettings.vocabularyDifficulty || 'mixed',
              category: appSettings.vocabularyCategory,
              length: appSettings.textLength
            });
            text = result.text;
            vocabularyWord = result.word;
            setCurrentVocabularyWord(vocabularyWord);
          }
        } else {
          // For non-logged-in users, use regular vocabulary generation
          const result = await vocabularyGenerator.generateVocabularyText({
            difficulty: appSettings.vocabularyDifficulty || 'mixed',
            category: appSettings.vocabularyCategory,
            length: appSettings.textLength
          });
          text = result.text;
          vocabularyWord = result.word;
          setCurrentVocabularyWord(vocabularyWord);
        }
      } else {
        // Generate regular text
        text = await textGenerator.generateText({
          source: appSettings.textSource,
          length: appSettings.textLength,
          language: 'english'
        });
        setCurrentVocabularyWord(null);
      }

      setCurrentText(text);
      setCurrentTextSource(appSettings.textSource);
    } catch (error) {
      console.error('Failed to fetch text:', error);
      toast.error('Failed to load text. Please try again.');
      // Fallback text
      setCurrentText('The quick brown fox jumps over the lazy dog.');
      setCurrentVocabularyWord(null);
    } finally {
      setIsLoading(false);
    }
  }, [appSettings.textSource, appSettings.textLength, appSettings.vocabularyDifficulty, appSettings.vocabularyCategory, user]);

  // Load text on component mount
  useEffect(() => {
    fetchRandomText();
  }, [fetchRandomText]);

  const resetTest = () => {
    setIsTestActive(false);
    setUserInput('');
    setStartTime(null);
    setStats({
      wpm: 0,
      accuracy: 100,
      errors: 0,
      timeElapsed: 0,
      charactersTyped: 0,
      charactersCorrect: 0
    });
    setShowResults(false);
    setShowConfetti(false);
    setShowVocabularyDisplay(false);
    setWpmHistory([]);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Focus input after reset
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const calculateStats = useCallback((input: string) => {
    if (!startTime) return;

    const timeElapsed = (Date.now() - startTime) / 1000;
    const minutes = timeElapsed / 60;
    
    // Calculate WPM (words per minute)
    const wordsTyped = input.length / 5;
    const wpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0;
    
    // Calculate accuracy
    let correct = 0;
    let errors = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === currentText[i]) {
        correct++;
      } else {
        errors++;
      }
    }
    
    const accuracy = input.length > 0 ? Math.round((correct / input.length) * 100) : 100;
    
    return {
      wpm,
      accuracy,
      errors,
      timeElapsed,
      charactersTyped: input.length,
      charactersCorrect: correct
    };
  }, [startTime, currentText]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const previousLength = userInput.length;
    
    setUserInput(value);
    
    // Start timer on first keystroke
    if (!isTestActive && value.length === 1) {
      setIsTestActive(true);
      setStartTime(Date.now());
      soundEffects.playTestStart();
    }
    
    // Play sound effects
    if (value.length > previousLength) {
      // Check if the new character is correct
      const newChar = value[value.length - 1];
      const expectedChar = currentText[value.length - 1];
      
      if (newChar === expectedChar) {
        soundEffects.playKeyPress();
      } else {
        soundEffects.playKeyError();
      }
    }
    
    const newStats = calculateStats(value);
    if (newStats) {
      setStats(newStats);
      
      // Update WPM history for chart
      if (newStats.wpm > 0) {
        setWpmHistory(prev => [...prev, { time: newStats.timeElapsed, wpm: newStats.wpm }]);
      }
    }
    
    // Check if test is complete
    if (value === currentText) {
      completeTest();
    }

    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const completeTest = async () => {
    setIsTestActive(false);
    setShowResults(true);
    setShowConfetti(true);
    
    // Show vocabulary display if it's a vocabulary test
    if (appSettings.textSource === 'vocabulary' && currentVocabularyWord) {
      setShowVocabularyDisplay(true);
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    const finalStats = calculateStats(userInput);
    if (finalStats) {
      const result: TestResult = {
        wpm: finalStats.wpm,
        accuracy: finalStats.accuracy,
        errors: finalStats.errors,
        timeElapsed: finalStats.timeElapsed,
        timestamp: new Date(),
        textSource: currentTextSource,
        textLength: appSettings.textLength,
        charactersTyped: finalStats.charactersTyped,
        charactersCorrect: finalStats.charactersCorrect
      };
      
      // Save to storage
      storage.saveTestResult(result);
      storage.updateStats(result);
      
      // Update user vocabulary progress if logged in and it's a vocabulary test
      if (user && appSettings.textSource === 'vocabulary' && currentVocabularyWord) {
        try {
          await updateVocabProgress(user.id, currentVocabularyWord.word, finalStats.accuracy === 100);
          // Reload user vocab stats
          await loadUserVocabStats();
        } catch (error) {
          console.error('Error updating vocab progress:', error);
        }
      }
      
      // Update local state
      setTestResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
      
      // Play completion sound
      soundEffects.playTestComplete();
      
      // Show toast notification
      if (appSettings.textSource === 'vocabulary' && currentVocabularyWord) {
        if (user) {
          toast.success(`Great job! You learned "${currentVocabularyWord.word}" while typing! 📚`, {
            icon: '🎓',
            duration: 5000
          });
        } else {
          toast.success(`Great job! You practiced "${currentVocabularyWord.word}"! Sign in to track your progress! 📚`, {
            icon: '🎓',
            duration: 5000
          });
        }
      } else if (finalStats.wpm >= 80) {
        toast.success(`Incredible! ${finalStats.wpm} WPM with ${finalStats.accuracy}% accuracy! 🚀`, {
          icon: '🏆',
          duration: 5000
        });
      } else if (finalStats.wpm >= 60) {
        toast.success(`Excellent! ${finalStats.wpm} WPM with ${finalStats.accuracy}% accuracy! 🎯`, {
          icon: '⭐',
          duration: 4000
        });
      } else if (finalStats.wpm >= 40) {
        toast.success(`Good job! ${finalStats.wpm} WPM with ${finalStats.accuracy}% accuracy! 👍`, {
          icon: '👍',
          duration: 3000
        });
      } else {
        toast.success(`Test completed! ${finalStats.wpm} WPM with ${finalStats.accuracy}% accuracy!`, {
          duration: 2000
        });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      resetTest();
    }
  };

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const currentInterval = intervalRef.current;
      if (currentInterval) {
        clearInterval(currentInterval);
      }
    };
  }, []);

  const averageWpm = testResults.length > 0 
    ? Math.round(testResults.reduce((sum, result) => sum + result.wpm, 0) / testResults.length)
    : 0;

  const bestWpm = testResults.length > 0 
    ? Math.max(...testResults.map(result => result.wpm))
    : 0;

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      {/* User Vocabulary Stats */}
      {user && userVocabStats && appSettings.textSource === 'vocabulary' && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="text-sm text-blue-800 dark:text-blue-200 text-center">
            <span className="font-semibold">Your Progress:</span> {userVocabStats.mastered} mastered • {userVocabStats.learning} learning • {userVocabStats.review} to review
          </div>
        </div>
      )}
      
      {/* Text Source Display */}
      {currentTextSource && (
        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Source: {textGenerator.getSources().find(s => s.id === currentTextSource)?.name || currentTextSource}
          {currentVocabularyWord && (
            <span className="ml-2 text-blue-500">
              • Learning: {currentVocabularyWord.word}
            </span>
          )}
        </div>
      )}

      {/* Typing area */}
      <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center">
        {isLoading ? (
          <div className="w-full min-h-[80px] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-2"></div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Loading text...</p>
            </div>
          </div>
        ) : (
          <div
            className={`w-full min-h-[80px] font-mono text-gray-800 dark:text-gray-100 bg-transparent outline-none select-none text-center tracking-wide ${fontSizeClass} relative leading-relaxed`}
            tabIndex={0}
            onClick={() => inputRef.current?.focus()}
            style={{ letterSpacing: '0.04em' }}
          >
            <div className="inline-block relative">
              {/* Render the text as a single line of spans, with inline cursor */}
              {currentText.split('').map((char, idx) => {
                // Insert the cursor right before the next character to type
                if (
                  idx === userInput.length &&
                  isTestActive &&
                  !showResults &&
                  appSettings.showCursor
                ) {
                  return (
                    <React.Fragment key={idx}>
                      <span
                        className="blinking-cursor"
                        style={{
                          display: 'inline-block',
                          width: '1.5px',
                          height: '1em',
                          background: 'currentColor',
                          verticalAlign: 'bottom',
                          marginRight: '-1.5px',
                          position: 'relative',
                        }}
                      />
                      <span
                        className={
                          'text-gray-400'
                        }
                      >
                        {char}
                      </span>
                    </React.Fragment>
                  );
                }
                // Normal character rendering
                return (
                  <span
                    key={idx}
                    className={
                      idx < userInput.length
                        ? userInput[idx] === char
                          ? 'text-gray-900 dark:text-gray-100 border-b-2 border-gray-300 dark:border-gray-700'
                          : 'text-red-500 bg-red-50 dark:bg-red-900/30 underline decoration-red-500'
                        : 'text-gray-400'
                    }
                  >
                    {char}
                  </span>
                );
              })}
              {/* If cursor is at the end of the text, render it after the last character */}
              {userInput.length === currentText.length && isTestActive && !showResults && appSettings.showCursor && (
                <span
                  className="blinking-cursor"
                  style={{
                    display: 'inline-block',
                    width: '1.5px',
                    height: '1em',
                    background: 'currentColor',
                    verticalAlign: 'bottom',
                    marginRight: '-1.5px',
                    position: 'relative',
                  }}
                />
              )}
            </div>
          </div>
        )}
        
        {/* Invisible input for typing */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={showResults || isLoading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-default"
          autoFocus
          spellCheck={false}
          tabIndex={-1}
        />
      </div>

      {/* Stats row */}
      <div className="flex flex-row items-center justify-center gap-8 mt-8 mb-4 text-base font-medium text-gray-700 dark:text-gray-300">
        {appSettings.showWpm && (
          <div>WPM <span className="font-mono text-lg text-gray-900 dark:text-gray-100">{stats.wpm}</span></div>
        )}
        {appSettings.showAccuracy && (
          <div>Accuracy <span className="font-mono text-lg text-gray-900 dark:text-gray-100">{stats.accuracy}%</span></div>
        )}
        {appSettings.showErrors && (
          <div>Errors <span className="font-mono text-lg text-gray-900 dark:text-gray-100">{stats.errors}</span></div>
        )}
        {appSettings.showTimer && (
          <div>Time <span className="font-mono text-lg text-gray-900 dark:text-gray-100">{Math.floor(stats.timeElapsed)}s</span></div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={resetTest}
          className="px-4 py-2 rounded-full text-sm font-mono border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Reset
        </button>
        <button
          onClick={() => soundEffects.setEnabled(!appSettings.soundEnabled)}
          className={`px-4 py-2 rounded-full text-sm font-mono border border-gray-200 dark:border-gray-700 transition-colors flex items-center gap-2 ${
            appSettings.soundEnabled 
              ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800' 
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          {appSettings.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          Sound
        </button>
      </div>

      {/* Vocabulary Display */}
      {currentVocabularyWord && (
        <VocabularyDisplay 
          word={currentVocabularyWord} 
          isVisible={showVocabularyDisplay} 
        />
      )}

      {/* Results and charts */}
      {testResults.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl mt-8"
        >
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex flex-col gap-1">
              <div className="text-sm text-gray-500">Average WPM</div>
              <div className="font-mono text-lg text-gray-900 dark:text-gray-100">{averageWpm}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm text-gray-500">Best WPM</div>
              <div className="font-mono text-lg text-gray-900 dark:text-gray-100">{bestWpm}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm text-gray-500">Tests Taken</div>
              <div className="font-mono text-lg text-gray-900 dark:text-gray-100">{testResults.length}</div>
            </div>
          </div>
          
          {/* WPM Chart */}
          {wpmHistory.length > 1 && (
            <div className="mt-6">
              <div className="text-sm text-gray-500 mb-2">WPM Progress</div>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={wpmHistory} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: appSettings.theme === 'dark' ? '#374151' : '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      color: appSettings.theme === 'dark' ? '#f3f4f6' : '#374151'
                    }}
                  />
                  <Line type="monotone" dataKey="wpm" stroke="#6366f1" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          
          {/* Recent Results */}
          <div className="mt-6">
            <div className="text-sm text-gray-500 mb-2">Recent Results</div>
            <div className="flex flex-wrap gap-2">
              {testResults.slice(0, 6).map((result, idx) => (
                <div key={idx} className="px-3 py-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-mono text-gray-700 dark:text-gray-200">
                  <span>{result.wpm} WPM</span> · <span>{result.accuracy}%</span> · <span>{Math.floor(result.timeElapsed)}s</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdvancedTypingTest; 