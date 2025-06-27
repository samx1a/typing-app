import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// In-memory storage (replace with database in production)
interface User {
  id: string;
  name: string;
  email: string;
  testResults: TestResult[];
  settings: UserSettings;
}

interface TestResult {
  id: string;
  wpm: number;
  accuracy: number;
  errors: number;
  timeElapsed: number;
  textSource: string;
  timestamp: Date;
}

interface UserSettings {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  showCursor: boolean;
  fontSize: 'small' | 'medium' | 'large';
  autoStart: boolean;
}

const users: Map<string, User> = new Map();
const leaderboard: TestResult[] = [];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// User management
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const newUser: User = {
    id: userId,
    name,
    email,
    testResults: [],
    settings: {
      theme: 'light',
      soundEnabled: true,
      showCursor: true,
      fontSize: 'medium',
      autoStart: false
    }
  };

  users.set(userId, newUser);
  
  res.status(201).json({
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      settings: newUser.settings
    }
  });
});

// Test results
app.post('/api/test-results', (req, res) => {
  const { userId, wpm, accuracy, errors, timeElapsed, textSource } = req.body;
  
  if (!userId || !users.has(userId)) {
    return res.status(404).json({ error: 'User not found' });
  }

  const testResult: TestResult = {
    id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    wpm,
    accuracy,
    errors,
    timeElapsed,
    textSource,
    timestamp: new Date()
  };

  const user = users.get(userId)!;
  user.testResults.push(testResult);
  
  // Add to leaderboard
  leaderboard.push(testResult);
  leaderboard.sort((a, b) => b.wpm - a.wpm);
  
  // Keep only top 100 results
  if (leaderboard.length > 100) {
    leaderboard.splice(100);
  }

  // Emit real-time update
  io.emit('newTestResult', { testResult, leaderboard: leaderboard.slice(0, 10) });

  res.status(201).json({ testResult });
});

// Get user statistics
app.get('/api/users/:userId/stats', (req, res) => {
  const { userId } = req.params;
  
  if (!users.has(userId)) {
    return res.status(404).json({ error: 'User not found' });
  }

  const user = users.get(userId)!;
  const testResults = user.testResults;

  if (testResults.length === 0) {
    return res.json({
      totalTests: 0,
      averageWpm: 0,
      bestWpm: 0,
      averageAccuracy: 0,
      totalTime: 0,
      recentResults: []
    });
  }

  const averageWpm = Math.round(
    testResults.reduce((sum, result) => sum + result.wpm, 0) / testResults.length
  );
  
  const bestWpm = Math.max(...testResults.map(result => result.wpm));
  
  const averageAccuracy = Math.round(
    testResults.reduce((sum, result) => sum + result.accuracy, 0) / testResults.length
  );
  
  const totalTime = testResults.reduce((sum, result) => sum + result.timeElapsed, 0);

  res.json({
    totalTests: testResults.length,
    averageWpm,
    bestWpm,
    averageAccuracy,
    totalTime,
    recentResults: testResults.slice(-10).reverse()
  });
});

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
  const { limit = 10 } = req.query;
  const topResults = leaderboard.slice(0, Number(limit));
  
  res.json({
    leaderboard: topResults,
    totalResults: leaderboard.length
  });
});

// Update user settings
app.put('/api/users/:userId/settings', (req, res) => {
  const { userId } = req.params;
  const settings = req.body;
  
  if (!users.has(userId)) {
    return res.status(404).json({ error: 'User not found' });
  }

  const user = users.get(userId)!;
  user.settings = { ...user.settings, ...settings };
  
  res.json({ settings: user.settings });
});

// Get user settings
app.get('/api/users/:userId/settings', (req, res) => {
  const { userId } = req.params;
  
  if (!users.has(userId)) {
    return res.status(404).json({ error: 'User not found' });
  }

  const user = users.get(userId)!;
  res.json({ settings: user.settings });
});

// Analytics endpoints
app.get('/api/analytics/global', (req, res) => {
  const allResults = Array.from(users.values()).flatMap(user => user.testResults);
  
  if (allResults.length === 0) {
    return res.json({
      totalTests: 0,
      averageWpm: 0,
      totalUsers: users.size,
      popularSources: []
    });
  }

  const averageWpm = Math.round(
    allResults.reduce((sum, result) => sum + result.wpm, 0) / allResults.length
  );

  const sourceCounts = allResults.reduce((acc, result) => {
    acc[result.textSource] = (acc[result.textSource] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const popularSources = Object.entries(sourceCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([source, count]) => ({ source, count }));

  res.json({
    totalTests: allResults.length,
    averageWpm,
    totalUsers: users.size,
    popularSources
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  socket.on('typingStart', (data) => {
    socket.broadcast.emit('userTyping', data);
  });

  socket.on('typingComplete', (data) => {
    socket.broadcast.emit('userCompleted', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app; 