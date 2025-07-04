import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Navigation from './components/Navigation';
import AdvancedTypingTest from './components/AdvancedTypingTest';
import Statistics from './components/Statistics';
import Settings from './components/Settings';
import { AppSettings, storage } from './services/storage';
import { soundEffects } from './services/soundEffects';
import { AuthProvider } from './services/auth';
import AuthPanel from './components/AuthPanel';

function App() {
  const [currentPage, setCurrentPage] = useState('typing');
  const [appSettings, setAppSettings] = useState<AppSettings>({
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
    soundVolume: 0.3,
    vocabularyDifficulty: 'mixed',
    vocabularyCategory: undefined
  });

  // Load settings from storage on mount
  useEffect(() => {
    const savedSettings = storage.getSettings();
    setAppSettings(savedSettings);
  }, []);

  // Apply theme and sound settings
  useEffect(() => {
    if (appSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [appSettings.theme]);

  useEffect(() => {
    soundEffects.setEnabled(appSettings.soundEnabled);
    soundEffects.setVolume(appSettings.soundVolume);
  }, [appSettings.soundEnabled, appSettings.soundVolume]);

  const handleSettingsChange = (newSettings: AppSettings) => {
    setAppSettings(newSettings);
    storage.saveSettings(newSettings);
  };

  const handleThemeChange = (theme: 'light' | 'dark') => {
    const newSettings = { ...appSettings, theme };
    setAppSettings(newSettings);
    storage.saveSettings(newSettings);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'typing':
        return <AdvancedTypingTest appSettings={appSettings} />;
      case 'stats':
        return <Statistics appSettings={appSettings} />;
      case 'settings':
        return <Settings onSettingsChange={handleSettingsChange} currentSettings={appSettings} />;
      default:
        return <AdvancedTypingTest appSettings={appSettings} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: appSettings.theme === 'dark' ? '#374151' : '#ffffff',
              color: appSettings.theme === 'dark' ? '#f3f4f6' : '#374151',
              border: `1px solid ${appSettings.theme === 'dark' ? '#4b5563' : '#e5e7eb'}`,
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <Navigation 
              currentPage={currentPage} 
              onPageChange={setCurrentPage} 
              theme={appSettings.theme}
              onThemeChange={handleThemeChange}
            />
            <AuthPanel />
          </div>
          {renderPage()}
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
