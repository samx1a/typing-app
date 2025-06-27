# SpeedType - Advanced Typing Test Platform

A modern, full-stack typing test application built with React, TypeScript, Node.js, and Express. Features real-time analytics, beautiful UI, and comprehensive performance tracking.

![SpeedType Demo](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)

## 🚀 Live Demo

[View Live Demo](https://your-deployment-url.com)

## ✨ Features

### 🎯 Core Typing Features
- **Real-time WPM calculation** with accurate word-per-minute tracking
- **Live accuracy monitoring** with character-by-character feedback
- **Multiple text sources**: Inspirational quotes, programming code, Lorem ipsum
- **Auto-completion detection** with confetti celebration
- **Keyboard shortcuts** for quick navigation (Space to start, Esc to reset)
- **Error highlighting** with visual feedback

### 📊 Advanced Analytics
- **Comprehensive statistics dashboard** with interactive charts
- **Historical performance tracking** with detailed metrics
- **WPM progress visualization** using Recharts
- **Accuracy distribution analysis**
- **Performance trends** over time
- **Best scores and averages** tracking
- **Global leaderboard** with real-time updates

### 🎨 Modern UI/UX
- **Glass morphism design** with beautiful gradients
- **Smooth animations** using Framer Motion
- **Responsive design** that works on all devices
- **Dark/Light theme support**
- **Customizable settings** for personalized experience
- **Toast notifications** for user feedback
- **Loading states** and error handling

### 🔧 Technical Features
- **Full-stack TypeScript** for type safety
- **Real-time updates** with Socket.IO
- **RESTful API** with comprehensive endpoints
- **Component-based architecture** for maintainability
- **Performance optimized** with efficient re-renders
- **Production-ready** with proper error handling

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Recharts** - Interactive charts and graphs
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications
- **React Confetti** - Celebration effects

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **TypeScript** - Type safety
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Morgan** - HTTP request logging

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Nodemon** - Development server
- **TypeScript Compiler** - Type checking

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/typing-app.git
   cd typing-app
   ```

2. **Install dependencies**
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # In server directory
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start development servers**
   ```bash
   # Terminal 1 - Start backend server
   cd server
   npm run dev
   
   # Terminal 2 - Start frontend
   cd client
   npm start
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

## 🎯 Usage

### Typing Test
1. Navigate to the typing test page
2. Select your preferred text source (Quotes, Programming, or Lorem)
3. Click "Start Test" or begin typing to automatically start
4. Type the displayed text as accurately as possible
5. View real-time statistics (WPM, accuracy, errors)
6. Complete the test to see your results and celebrate!

### Statistics Dashboard
- View your typing performance over time
- Analyze WPM trends and accuracy distribution
- Track your best scores and improvements
- Monitor total time spent practicing

### Settings
- Customize theme (light/dark)
- Adjust font size and display options
- Toggle sound effects and visual feedback
- Configure keyboard shortcuts

## 🏗️ Project Structure

```
typing-app/
├── client/                 # React frontend
│   ├── public/            # Static files
│   │   ├── components/    # React components
│   │   │   ├── AdvancedTypingTest.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── Statistics.tsx
│   │   │   └── Settings.tsx
│   │   ├── App.tsx        # Main app component
│   │   └── index.tsx      # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── server/                # Node.js backend
│   ├── src/
│   │   └── index.ts       # Express server
│   ├── package.json
│   └── tsconfig.json
├── README.md
└── package.json
```

## 🚀 Deployment

### Frontend Deployment (Vercel - Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   cd client
   vercel --prod
   ```

### Backend Deployment (Railway/Render)

1. **Set environment variables**
   - `PORT`: 5000
   - `NODE_ENV`: production
   - `CLIENT_URL`: Your frontend URL

2. **Deploy**
   ```bash
   cd server
   npm run build
   npm start
   ```

### Alternative Platforms

- **Frontend**: Netlify, GitHub Pages, AWS S3
- **Backend**: Heroku, DigitalOcean, AWS EC2

## 📊 API Documentation

### Endpoints

#### Health Check
```
GET /api/health
```

#### User Management
```
POST /api/users
GET /api/users/:userId/stats
PUT /api/users/:userId/settings
GET /api/users/:userId/settings
```

#### Test Results
```
POST /api/test-results
GET /api/leaderboard
```

#### Analytics
```
GET /api/analytics/global
```

### WebSocket Events

- `connection` - User connects
- `joinRoom` - Join typing room
- `typingStart` - User starts typing
- `typingComplete` - User completes test
- `newTestResult` - New result added to leaderboard

## 🧪 Testing

```bash
# Run frontend tests
cd client
npm test

# Run backend tests
cd server
npm test

# Run all tests
npm run test:all
```

## 🔧 Development

### Available Scripts

#### Frontend (client/)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

#### Backend (server/)
- `npm run dev` - Start development server
- `npm run build` - Build TypeScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Component-based architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- Styling by [Tailwind CSS](https://tailwindcss.com/)
- Backend by [Express.js](https://expressjs.com/)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/typing-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/typing-app/discussions)
- **Email**: your.email@example.com

---

**Built with ❤️ for typing enthusiasts everywhere!**

⭐ **Star this repository if you found it helpful!** 