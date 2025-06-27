import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Navigation from './components/Navigation';
import AdvancedTypingTest from './components/AdvancedTypingTest';
import Statistics from './components/Statistics';
import Settings from './components/Settings';

function App() {
  const [currentPage, setCurrentPage] = useState('typing');
  const [appSettings, setAppSettings] = useState({
    theme: 'light',
    soundEnabled: true,
    showCursor: true,
    fontSize: 'medium',
    autoStart: false,
    showTimer: true,
    showWpm: true,
    showAccuracy: true,
    showErrors: true,
  });

  const renderPage = () => {
    switch (currentPage) {
      case 'typing':
        return <AdvancedTypingTest />;
      case 'stats':
        return <Statistics />;
      case 'settings':
        return <Settings onSettingsChange={setAppSettings} />;
      default:
        return <AdvancedTypingTest />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <div className="container mx-auto px-4 py-8">
        <Navigation 
          currentPage={currentPage} 
          onPageChange={setCurrentPage} 
        />
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
