import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Award, 
  Calendar,
  Clock,
  Zap,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface TestResult {
  wpm: number;
  accuracy: number;
  errors: number;
  timeElapsed: number;
  timestamp: Date;
  textSource: string;
}

const Statistics: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  // Mock data for demonstration
  useEffect(() => {
    const mockData: TestResult[] = [
      { wpm: 65, accuracy: 98, errors: 2, timeElapsed: 45, timestamp: new Date(Date.now() - 86400000), textSource: 'quotes' },
      { wpm: 58, accuracy: 95, errors: 5, timeElapsed: 52, timestamp: new Date(Date.now() - 172800000), textSource: 'programming' },
      { wpm: 72, accuracy: 99, errors: 1, timeElapsed: 38, timestamp: new Date(Date.now() - 259200000), textSource: 'quotes' },
      { wpm: 45, accuracy: 92, errors: 8, timeElapsed: 65, timestamp: new Date(Date.now() - 345600000), textSource: 'lorem' },
      { wpm: 68, accuracy: 97, errors: 3, timeElapsed: 42, timestamp: new Date(Date.now() - 432000000), textSource: 'programming' },
      { wpm: 55, accuracy: 94, errors: 6, timeElapsed: 48, timestamp: new Date(Date.now() - 518400000), textSource: 'quotes' },
      { wpm: 78, accuracy: 100, errors: 0, timeElapsed: 35, timestamp: new Date(Date.now() - 604800000), textSource: 'quotes' },
    ];
    setTestResults(mockData);
  }, []);

  const averageWpm = testResults.length > 0 
    ? Math.round(testResults.reduce((sum, result) => sum + result.wpm, 0) / testResults.length)
    : 0;

  const bestWpm = testResults.length > 0 
    ? Math.max(...testResults.map(result => result.wpm))
    : 0;

  const averageAccuracy = testResults.length > 0 
    ? Math.round(testResults.reduce((sum, result) => sum + result.accuracy, 0) / testResults.length)
    : 0;

  const totalTests = testResults.length;
  const totalTime = testResults.reduce((sum, result) => sum + result.timeElapsed, 0);

  // Chart data
  const wpmProgressData = testResults.map((result, index) => ({
    test: index + 1,
    wpm: result.wpm,
    accuracy: result.accuracy
  }));

  const accuracyDistribution = [
    { name: '90-100%', value: testResults.filter(r => r.accuracy >= 90).length },
    { name: '80-89%', value: testResults.filter(r => r.accuracy >= 80 && r.accuracy < 90).length },
    { name: '70-79%', value: testResults.filter(r => r.accuracy >= 70 && r.accuracy < 80).length },
    { name: '<70%', value: testResults.filter(r => r.accuracy < 70).length },
  ];

  const sourceDistribution = [
    { name: 'Quotes', value: testResults.filter(r => r.textSource === 'quotes').length },
    { name: 'Programming', value: testResults.filter(r => r.textSource === 'programming').length },
    { name: 'Lorem', value: testResults.filter(r => r.textSource === 'lorem').length },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">Statistics Dashboard</h1>
          <p className="text-gray-600">Track your typing progress and performance</p>
        </motion.div>

        {/* Time Range Selector */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex gap-2 bg-white/50 rounded-lg p-1">
            {(['week', 'month', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  timeRange === range
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-white/70'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            className="glass rounded-2xl p-6 shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average WPM</p>
                <p className="text-2xl font-bold text-primary-600">{averageWpm}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="glass rounded-2xl p-6 shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-success-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Best WPM</p>
                <p className="text-2xl font-bold text-success-600">{bestWpm}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="glass rounded-2xl p-6 shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Accuracy</p>
                <p className="text-2xl font-bold text-yellow-600">{averageAccuracy}%</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="glass rounded-2xl p-6 shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tests Taken</p>
                <p className="text-2xl font-bold text-purple-600">{totalTests}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* WPM Progress Chart */}
          <motion.div 
            className="glass rounded-2xl p-6 shadow-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={24} />
              WPM Progress
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={wpmProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="test" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="wpm" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Accuracy Distribution */}
          <motion.div 
            className="glass rounded-2xl p-6 shadow-xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target size={24} />
              Accuracy Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={accuracyDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {accuracyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Text Source Distribution */}
          <motion.div 
            className="glass rounded-2xl p-6 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award size={24} />
              Text Source Usage
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sourceDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Performance Summary */}
          <motion.div 
            className="glass rounded-2xl p-6 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock size={24} />
              Performance Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                <span className="text-gray-600">Total Time Typing</span>
                <span className="font-semibold">{Math.floor(totalTime / 60)}m {totalTime % 60}s</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                <span className="text-gray-600">Average Test Duration</span>
                <span className="font-semibold">{Math.round(totalTime / totalTests)}s</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                <span className="text-gray-600">Improvement Rate</span>
                <span className="font-semibold text-success-600">+12%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                <span className="text-gray-600">Consistency Score</span>
                <span className="font-semibold text-primary-600">85%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div 
          className="glass rounded-2xl p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar size={24} />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {testResults.slice(0, 5).map((result, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-4 bg-white/50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    result.wpm >= 60 ? 'bg-success-500' :
                    result.wpm >= 40 ? 'bg-yellow-500' : 'bg-error-500'
                  }`} />
                  <div>
                    <p className="font-medium">{result.wpm} WPM</p>
                    <p className="text-sm text-gray-600">{result.textSource}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{result.accuracy}% accuracy</p>
                  <p className="text-sm text-gray-600">{Math.floor(result.timeElapsed)}s</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Statistics; 