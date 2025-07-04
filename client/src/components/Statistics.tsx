import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { Calendar, TrendingUp, Target, Clock, BarChart3, Download, Trash2, RefreshCw, User, BookOpen } from 'lucide-react';
import { TestResult, storage } from '../services/storage';
import { AppSettings } from '../services/storage';
import { useAuth } from '../services/auth';
import { supabase, UserStats } from '../services/supabaseClient';
import { getUserVocabStats } from '../services/adaptiveVocab';
import toast from 'react-hot-toast';

interface StatisticsProps {
  appSettings: AppSettings;
}

const Statistics: React.FC<StatisticsProps> = ({ appSettings }) => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [userVocabStats, setUserVocabStats] = useState<{
    total: number;
    mastered: number;
    learning: number;
    review: number;
    new: number;
  } | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user, timeRange]);

  const loadData = async () => {
    setIsLoading(true);
    
    try {
      // Load local test results
      const localResults = storage.getTestResults();
      setTestResults(localResults);
      
      // Load user-specific data if logged in
      if (user) {
        await loadUserData();
      } else {
        setUserStats([]);
        setUserVocabStats(null);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserData = async () => {
    if (!user) return;

    try {
      // Load user stats from Supabase
      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (statsError) {
        console.error('Error loading user stats:', statsError);
      } else {
        setUserStats(stats || []);
      }

      // Load user vocabulary stats
      const vocabStats = await getUserVocabStats(user.id);
      setUserVocabStats(vocabStats);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Use user stats if available, otherwise fall back to local stats
  const activeResults = (user ? userStats : testResults) as (TestResult | UserStats)[];

  const filteredResults = activeResults.filter(result => {
    const resultDate = new Date(result.timestamp);
    const now = new Date();
    
    switch (timeRange) {
      case 'week':
        return resultDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return resultDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case 'all':
        return true;
      default:
        return true;
    }
  });

  const averageWpm = filteredResults.length > 0 
    ? Math.round(filteredResults.reduce((sum, result) => sum + result.wpm, 0) / filteredResults.length)
    : 0;

  const bestWpm = filteredResults.length > 0 
    ? Math.max(...filteredResults.map(result => result.wpm))
    : 0;

  const totalTests = filteredResults.length;
  const totalTime = filteredResults.reduce((sum, result) => sum + result.timeElapsed, 0);

  // Chart data
  const wpmProgressData = filteredResults.slice(-20).map((result, index) => ({
    test: index + 1,
    wpm: result.wpm,
    accuracy: result.accuracy,
    date: new Date(result.timestamp).toLocaleDateString()
  }));

  const accuracyDistribution = [
    { name: '90-100%', value: filteredResults.filter(r => r.accuracy >= 90).length, color: '#10b981' },
    { name: '80-89%', value: filteredResults.filter(r => r.accuracy >= 80 && r.accuracy < 90).length, color: '#3b82f6' },
    { name: '70-79%', value: filteredResults.filter(r => r.accuracy >= 70 && r.accuracy < 80).length, color: '#f59e0b' },
    { name: '<70%', value: filteredResults.filter(r => r.accuracy < 70).length, color: '#ef4444' },
  ];

  const wpmDistribution = [
    { range: '0-30', count: filteredResults.filter(r => r.wpm <= 30).length },
    { range: '31-50', count: filteredResults.filter(r => r.wpm > 30 && r.wpm <= 50).length },
    { range: '51-70', count: filteredResults.filter(r => r.wpm > 50 && r.wpm <= 70).length },
    { range: '71-90', count: filteredResults.filter(r => r.wpm > 70 && r.wpm <= 90).length },
    { range: '90+', count: filteredResults.filter(r => r.wpm > 90).length },
  ];

  const handleExportData = () => {
    try {
      const data = storage.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `typing-stats-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Statistics exported successfully!');
    } catch (error) {
      toast.error('Failed to export statistics');
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all test data? This cannot be undone.')) {
      storage.clearTestResults();
      loadData();
      toast.success('Test data cleared');
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 text-gray-400" size={32} />
          <p className="text-gray-500 dark:text-gray-400">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-sans text-gray-900 dark:text-gray-100 mb-2">Statistics</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {user ? 'Your personal typing progress and performance' : 'Your typing progress and performance'}
          </p>
          {user && (
            <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
              <User size={14} className="inline mr-1" />
              Signed in as {user.email}
            </div>
          )}
        </div>

        {/* User Vocabulary Stats */}
        {user && userVocabStats && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg border border-blue-200 dark:border-blue-700"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen size={20} className="text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">Vocabulary Progress</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userVocabStats.total}</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Total Words</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{userVocabStats.mastered}</div>
                <div className="text-sm text-green-700 dark:text-green-300">Mastered</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{userVocabStats.learning}</div>
                <div className="text-sm text-yellow-700 dark:text-yellow-300">Learning</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{userVocabStats.review}</div>
                <div className="text-sm text-orange-700 dark:text-orange-300">To Review</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1 rounded-full text-sm font-mono border transition-colors ${timeRange === 'week' ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 rounded-full text-sm font-mono border transition-colors ${timeRange === 'month' ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1 rounded-full text-sm font-mono border transition-colors ${timeRange === 'all' ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              All Time
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-mono border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Download size={14} />
              Export
            </button>
            <button
              onClick={handleClearData}
              className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-mono border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 size={14} />
              Clear Data
            </button>
          </div>
        </div>

        {/* Key Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col items-center">
            <TrendingUp className="text-blue-500 mb-2" size={24} />
            <div className="text-xs text-gray-500 mb-1">Average WPM</div>
            <div className="font-mono text-2xl text-gray-900 dark:text-gray-100">{averageWpm}</div>
          </div>
          <div className="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col items-center">
            <Target className="text-green-500 mb-2" size={24} />
            <div className="text-xs text-gray-500 mb-1">Best WPM</div>
            <div className="font-mono text-2xl text-gray-900 dark:text-gray-100">{bestWpm}</div>
          </div>
          <div className="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col items-center">
            <BarChart3 className="text-purple-500 mb-2" size={24} />
            <div className="text-xs text-gray-500 mb-1">Tests Taken</div>
            <div className="font-mono text-2xl text-gray-900 dark:text-gray-100">{totalTests}</div>
          </div>
          <div className="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col items-center">
            <Clock className="text-orange-500 mb-2" size={24} />
            <div className="text-xs text-gray-500 mb-1">Total Time</div>
            <div className="font-mono text-lg text-gray-900 dark:text-gray-100">{formatTime(totalTime)}</div>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6"
          >
            <div className="text-sm text-gray-500 mb-4">WPM Progress (Last 20 Tests)</div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={wpmProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="test" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: appSettings.theme === 'dark' ? '#374151' : '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    color: appSettings.theme === 'dark' ? '#f3f4f6' : '#374151'
                  }}
                />
                <Line type="monotone" dataKey="wpm" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6"
          >
            <div className="text-sm text-gray-500 mb-4">Accuracy Distribution</div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={accuracyDistribution.filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {accuracyDistribution.filter(d => d.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: appSettings.theme === 'dark' ? '#374151' : '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    color: appSettings.theme === 'dark' ? '#f3f4f6' : '#374151'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* WPM Distribution Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 mb-8"
        >
          <div className="text-sm text-gray-500 mb-4">WPM Distribution</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={wpmDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: appSettings.theme === 'dark' ? '#374151' : '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  color: appSettings.theme === 'dark' ? '#f3f4f6' : '#374151'
                }}
              />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Results */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6"
        >
          <div className="text-sm text-gray-500 mb-4">Recent Results</div>
          {filteredResults.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredResults.slice(0, 12).map((result, idx) => (
                <div key={idx} className="px-3 py-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-mono text-gray-700 dark:text-gray-200">
                  <div className="font-semibold">{result.wpm} WPM</div>
                  <div>{result.accuracy}%</div>
                  <div className="text-gray-500">{Math.floor(result.timeElapsed)}s</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Calendar size={48} className="mx-auto mb-4 opacity-50" />
              <p>No test results found for this time period.</p>
              <p className="text-sm">Start typing to see your statistics!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Statistics; 