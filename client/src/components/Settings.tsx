import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Download, 
  Upload, 
  Trash2, 
  Volume2, 
  VolumeX,
  Monitor,
  Smartphone,
  Type,
  BookOpen,
  Target,
  Lightbulb,
  Award
} from 'lucide-react';
import { AppSettings } from '../services/storage';
import { textGenerator } from '../services/textGenerator';
import { vocabularyGenerator } from '../services/vocabularyGenerator';
import toast from 'react-hot-toast';

interface SettingsProps {
  currentSettings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ currentSettings, onSettingsChange }) => {
  const [settings, setSettings] = useState<AppSettings>(currentSettings);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings]);

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleThemeChange = (theme: 'light' | 'dark') => {
    handleSettingChange('theme', theme);
  };

  const handleSoundToggle = () => {
    handleSettingChange('soundEnabled', !settings.soundEnabled);
  };

  const handleVolumeChange = (volume: number) => {
    handleSettingChange('soundVolume', volume);
  };

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    handleSettingChange('fontSize', size);
  };

  const handleTextSourceChange = (source: string) => {
    handleSettingChange('textSource', source);
  };

  const handleTextLengthChange = (length: 'short' | 'medium' | 'long') => {
    handleSettingChange('textLength', length);
  };

  const handleVocabularyDifficultyChange = (difficulty: 'easy' | 'medium' | 'hard' | 'mixed') => {
    handleSettingChange('vocabularyDifficulty', difficulty);
  };

  const handleVocabularyCategoryChange = (category: string) => {
    handleSettingChange('vocabularyCategory', category);
  };

  const handleExportData = () => {
    try {
      const data = {
        settings: settings,
        timestamp: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `typing-app-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Settings exported successfully!');
    } catch (error) {
      toast.error('Failed to export settings');
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.settings) {
          onSettingsChange(data.settings);
          toast.success('Settings imported successfully!');
        } else {
          toast.error('Invalid settings file');
        }
      } catch (error) {
        toast.error('Failed to import settings');
      }
    };
    reader.readAsText(file);
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
      const defaultSettings: AppSettings = {
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
      };
      onSettingsChange(defaultSettings);
      toast.success('Settings reset to default');
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <Target size={16} />;
      case 'medium': return <Lightbulb size={16} />;
      case 'hard': return <Award size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'typing', label: 'Typing', icon: Type },
    { id: 'vocabulary', label: 'Vocabulary', icon: BookOpen },
    { id: 'data', label: 'Data', icon: Download }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-sans text-gray-900 dark:text-gray-100 mb-2">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">Customize your typing experience</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors border ${
                  isActive 
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600' 
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Theme */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Theme</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                      settings.theme === 'light'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-center">
                      <Monitor className="mx-auto mb-2 text-gray-600 dark:text-gray-400" size={24} />
                      <div className="font-medium text-gray-900 dark:text-gray-100">Light</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                      settings.theme === 'dark'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-center">
                      <Smartphone className="mx-auto mb-2 text-gray-600 dark:text-gray-400" size={24} />
                      <div className="font-medium text-gray-900 dark:text-gray-100">Dark</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Sound Settings */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Sound</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">Sound Effects</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Play sounds while typing</div>
                    </div>
                    <button
                      onClick={handleSoundToggle}
                      className={`p-2 rounded-lg transition-colors ${
                        settings.soundEnabled
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                      }`}
                    >
                      {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                  </div>
                  
                  {settings.soundEnabled && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Volume</span>
                        <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                          {Math.round(settings.soundVolume * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.soundVolume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Display Settings */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Display</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">Show Cursor</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Display typing cursor</div>
                    </div>
                    <button
                      onClick={() => handleSettingChange('showCursor', !settings.showCursor)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        settings.showCursor
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {settings.showCursor ? 'On' : 'Off'}
                    </button>
                  </div>

                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100 mb-2">Font Size</div>
                    <div className="flex gap-2">
                      {(['small', 'medium', 'large'] as const).map((size) => (
                        <button
                          key={size}
                          onClick={() => handleFontSizeChange(size)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            settings.fontSize === size
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {size.charAt(0).toUpperCase() + size.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Typing Settings */}
          {activeTab === 'typing' && (
            <div className="space-y-6">
              {/* Text Source */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Text Source</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {textGenerator.getSources().map((source) => (
                    <button
                      key={source.id}
                      onClick={() => handleTextSourceChange(source.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-colors ${
                        settings.textSource === source.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="font-medium text-gray-900 dark:text-gray-100">{source.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{source.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Length */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Text Length</h3>
                <div className="flex gap-3">
                  {(['short', 'medium', 'long'] as const).map((length) => (
                    <button
                      key={length}
                      onClick={() => handleTextLengthChange(length)}
                      className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                        settings.textLength === length
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-medium text-gray-900 dark:text-gray-100 capitalize">{length}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {length === 'short' ? '~50 chars' : length === 'medium' ? '~150 chars' : '~300 chars'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats Display */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Display Stats</h3>
                <div className="space-y-3">
                  {[
                    { key: 'showWpm', label: 'WPM', description: 'Words per minute' },
                    { key: 'showAccuracy', label: 'Accuracy', description: 'Typing accuracy percentage' },
                    { key: 'showErrors', label: 'Errors', description: 'Number of mistakes' },
                    { key: 'showTimer', label: 'Timer', description: 'Elapsed time' }
                  ].map((stat) => (
                    <div key={stat.key} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{stat.label}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{stat.description}</div>
                      </div>
                      <button
                        onClick={() => handleSettingChange(stat.key as keyof AppSettings, !settings[stat.key as keyof AppSettings])}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          settings[stat.key as keyof AppSettings]
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {settings[stat.key as keyof AppSettings] ? 'On' : 'Off'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Vocabulary Settings */}
          {activeTab === 'vocabulary' && (
            <div className="space-y-6">
              {/* Vocabulary Difficulty */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Word Difficulty</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['easy', 'medium', 'hard', 'mixed'] as const).map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => handleVocabularyDifficultyChange(difficulty)}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        settings.vocabularyDifficulty === difficulty
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="text-center">
                        <div className="flex justify-center mb-2">
                          {getDifficultyIcon(difficulty)}
                        </div>
                        <div className="font-medium text-gray-900 dark:text-gray-100 capitalize">{difficulty}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {difficulty === 'easy' ? 'Beginner' : 
                           difficulty === 'medium' ? 'Intermediate' : 
                           difficulty === 'hard' ? 'Advanced' : 'All Levels'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Vocabulary Categories */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Word Categories</h3>
                <div className="mb-4">
                  <button
                    onClick={() => handleVocabularyCategoryChange('')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      !settings.vocabularyCategory
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    All Categories
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {vocabularyGenerator.getCategories().map((category) => (
                    <button
                      key={category}
                      onClick={() => handleVocabularyCategoryChange(category)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        settings.vocabularyCategory === category
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vocabulary Info */}
              <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">About Vocabulary Builder</h3>
                <div className="space-y-3 text-blue-800 dark:text-blue-200">
                  <p>• Practice typing with uncommon words to expand your vocabulary</p>
                  <p>• Each test includes the word definition and example sentence</p>
                  <p>• Choose difficulty levels and categories to focus your learning</p>
                  <p>• Track your progress while improving both typing and vocabulary</p>
                </div>
              </div>
            </div>
          )}

          {/* Data Management */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Data Management</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">Export Settings</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Download your settings as a file</div>
                    </div>
                    <button
                      onClick={handleExportData}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Download size={16} />
                      Export
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">Import Settings</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Load settings from a file</div>
                    </div>
                    <label className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
                      <Upload size={16} />
                      Import
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportData}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">Reset Settings</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Restore default settings</div>
                    </div>
                    <button
                      onClick={handleResetSettings}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Settings; 