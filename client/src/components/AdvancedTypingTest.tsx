import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  RotateCcw, 
  Settings, 
  BarChart3, 
  Target, 
  Clock, 
  Zap,
  CheckCircle,
  XCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';

interface TypingStats {
  wpm: number;
  accuracy: number;
  errors: number;
  timeElapsed: number;
  charactersTyped: number;
  charactersCorrect: number;
}

interface TestResult {
  wpm: number;
  accuracy: number;
  errors: number;
  timeElapsed: number;
  timestamp: Date;
}

const TEXT_SOURCES = {
  quotes: [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "In the middle of difficulty lies opportunity. - Albert Einstein",
    "The best way to predict the future is to invent it. - Alan Kay",
    "Life is what happens when you're busy making other plans. - John Lennon",
    "The journey of a thousand miles begins with one step. - Lao Tzu",
    "Believe you can and you're halfway there. - Theodore Roosevelt"
  ],
  programming: [
    "const express = require('express'); const app = express(); app.listen(3000, () => console.log('Server running'));",
    "function fibonacci(n) { if (n <= 1) return n; return fibonacci(n-1) + fibonacci(n-2); }",
    "const React = require('react'); const Component = () => { return <div>Hello World</div>; };",
    "async function fetchData() { try { const response = await fetch('/api/data'); return response.json(); } catch (error) { console.error(error); } }",
    "class Database { constructor() { this.connection = null; } async connect() { this.connection = await createConnection(); } }"
  ],
  lorem: [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  ]
};

const AdvancedTypingTest: React.FC = () => {
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
  const [textSource, setTextSource] = useState<'quotes' | 'programming' | 'lorem'>('quotes');
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wpmHistory, setWpmHistory] = useState<{time: number, wpm: number}[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getRandomText = useCallback(() => {
    const texts = TEXT_SOURCES[textSource];
    return texts[Math.floor(Math.random() * texts.length)];
  }, [textSource]);

  const startTest = () => {
    const newText = getRandomText();
    setCurrentText(newText);
    setUserInput('');
    setIsTestActive(true);
    setStartTime(Date.now());
    setStats({
      wpm: 0,
      accuracy: 100,
      errors: 0,
      timeElapsed: 0,
      charactersTyped: 0,
      charactersCorrect: 0
    });
    setWpmHistory([]);
    setShowResults(false);
    setShowConfetti(false);
    
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Start interval for real-time stats
    intervalRef.current = setInterval(() => {
      if (startTime) {
        const timeElapsed = (Date.now() - startTime) / 1000;
        setStats(prev => ({ ...prev, timeElapsed }));
      }
    }, 100);
  };

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
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
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
    setUserInput(value);
    
    if (!isTestActive && value.length === 1) {
      setIsTestActive(true);
      setStartTime(Date.now());
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
  };

  const completeTest = () => {
    setIsTestActive(false);
    setShowResults(true);
    setShowConfetti(true);
    
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
        timestamp: new Date()
      };
      
      setTestResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
      
      // Show toast notification
      if (finalStats.wpm >= 60) {
        toast.success(`Excellent! ${finalStats.wpm} WPM with ${finalStats.accuracy}% accuracy!`, {
          icon: '🏆',
          duration: 4000
        });
      } else if (finalStats.wpm >= 40) {
        toast.success(`Good job! ${finalStats.wpm} WPM with ${finalStats.accuracy}% accuracy!`, {
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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">Advanced Typing Test</h1>
          <p className="text-gray-600">Improve your typing speed and accuracy</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Typing Area */}
          <div className="lg:col-span-2">
            <motion.div 
              className="glass rounded-2xl p-8 shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {/* Text Source Selector */}
              <div className="flex gap-2 mb-6">
                {(['quotes', 'programming', 'lorem'] as const).map((source) => (
                  <button
                    key={source}
                    onClick={() => setTextSource(source)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      textSource === source
                        ? 'bg-primary-500 text-white shadow-lg'
                        : 'bg-white/50 text-gray-700 hover:bg-white/70'
                    }`}
                  >
                    {source.charAt(0).toUpperCase() + source.slice(1)}
                  </button>
                ))}
              </div>

              {/* Test Text Display */}
              <div className="mb-6">
                <div className="text-lg leading-relaxed text-gray-800 bg-white/50 rounded-lg p-6 min-h-[120px]">
                  {currentText.split('').map((char, index) => {
                    let className = 'text-gray-400';
                    if (index < userInput.length) {
                      className = userInput[index] === char ? 'text-success-600' : 'text-error-600 bg-error-100';
                    }
                    return (
                      <span key={index} className={className}>
                        {char}
                      </span>
                    );
                  })}
                  {userInput.length < currentText.length && (
                    <span className="typing-cursor text-primary-500">|</span>
                  )}
                </div>
              </div>

              {/* Input Field */}
              <div className="mb-6">
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  disabled={!isTestActive || showResults}
                  placeholder={isTestActive ? "Start typing..." : "Click Start to begin"}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors disabled:bg-gray-100"
                />
              </div>

              {/* Control Buttons */}
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startTest}
                  className="flex items-center gap-2 px-6 py-3 bg-success-500 text-white rounded-lg font-medium hover:bg-success-600 transition-colors"
                >
                  <Play size={20} />
                  Start Test
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetTest}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw size={20} />
                  Reset
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Stats Panel */}
          <div className="space-y-6">
            {/* Real-time Stats */}
            <motion.div 
              className="glass rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 size={24} />
                Live Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">WPM</span>
                  <span className="text-2xl font-bold text-primary-600">{stats.wpm}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Accuracy</span>
                  <span className="text-2xl font-bold text-success-600">{stats.accuracy}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Errors</span>
                  <span className="text-2xl font-bold text-error-600">{stats.errors}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Time</span>
                  <span className="text-lg font-medium text-gray-800">
                    {Math.floor(stats.timeElapsed)}s
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Historical Stats */}
            <motion.div 
              className="glass rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp size={24} />
                Statistics
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average WPM</span>
                  <span className="text-xl font-bold text-primary-600">{averageWpm}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Best WPM</span>
                  <span className="text-xl font-bold text-success-600">{bestWpm}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tests Taken</span>
                  <span className="text-xl font-bold text-gray-800">{testResults.length}</span>
                </div>
              </div>
            </motion.div>

            {/* WPM Chart */}
            {wpmHistory.length > 1 && (
              <motion.div 
                className="glass rounded-2xl p-6 shadow-xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-semibold mb-4">WPM Progress</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={wpmHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="wpm" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </div>
        </div>

        {/* Recent Results */}
        {testResults.length > 0 && (
          <motion.div 
            className="mt-8 glass rounded-2xl p-6 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award size={24} />
              Recent Results
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testResults.slice(0, 6).map((result, index) => (
                <motion.div
                  key={index}
                  className="bg-white/50 rounded-lg p-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">
                      {result.timestamp.toLocaleDateString()}
                    </span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      result.wpm >= 60 ? 'bg-success-100 text-success-700' :
                      result.wpm >= 40 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {result.wpm} WPM
                    </span>
                  </div>
                  <div className="text-lg font-bold text-primary-600">{result.wpm} WPM</div>
                  <div className="text-sm text-gray-600">{result.accuracy}% accuracy</div>
                  <div className="text-sm text-gray-600">{Math.floor(result.timeElapsed)}s</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdvancedTypingTest; 