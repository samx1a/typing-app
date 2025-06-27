import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Palette, Keyboard, Volume2, Eye, Moon, Sun } from 'lucide-react';

interface SettingsProps {
  onSettingsChange: (settings: any) => void;
}

const Settings: React.FC<SettingsProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState({
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

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">Settings</h1>
          <p className="text-gray-600">Customize your typing experience</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Appearance Settings */}
          <motion.div 
            className="glass rounded-2xl p-6 shadow-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Palette size={24} />
              Appearance
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Theme</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSettingChange('theme', 'light')}
                    className={`p-2 rounded-lg ${settings.theme === 'light' ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}
                  >
                    <Sun size={20} />
                  </button>
                  <button
                    onClick={() => handleSettingChange('theme', 'dark')}
                    className={`p-2 rounded-lg ${settings.theme === 'dark' ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}
                  >
                    <Moon size={20} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Font Size</span>
                <select
                  value={settings.fontSize}
                  onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Show Cursor</span>
                <button
                  onClick={() => handleSettingChange('showCursor', !settings.showCursor)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.showCursor ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.showCursor ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Typing Settings */}
          <motion.div 
            className="glass rounded-2xl p-6 shadow-xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Keyboard size={24} />
              Typing Options
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Auto Start</span>
                <button
                  onClick={() => handleSettingChange('autoStart', !settings.autoStart)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.autoStart ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.autoStart ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Show Timer</span>
                <button
                  onClick={() => handleSettingChange('showTimer', !settings.showTimer)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.showTimer ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.showTimer ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Show WPM</span>
                <button
                  onClick={() => handleSettingChange('showWpm', !settings.showWpm)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.showWpm ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.showWpm ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Show Accuracy</span>
                <button
                  onClick={() => handleSettingChange('showAccuracy', !settings.showAccuracy)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.showAccuracy ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.showAccuracy ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Show Errors</span>
                <button
                  onClick={() => handleSettingChange('showErrors', !settings.showErrors)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.showErrors ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.showErrors ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Audio Settings */}
          <motion.div 
            className="glass rounded-2xl p-6 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Volume2 size={24} />
              Audio
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Sound Effects</span>
                <button
                  onClick={() => handleSettingChange('soundEnabled', !settings.soundEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.soundEnabled ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Keyboard Shortcuts */}
          <motion.div 
            className="glass rounded-2xl p-6 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Keyboard size={24} />
              Keyboard Shortcuts
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-2 bg-white/50 rounded">
                <span className="text-gray-700">Start Test</span>
                <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Space</kbd>
              </div>
              <div className="flex justify-between items-center p-2 bg-white/50 rounded">
                <span className="text-gray-700">Reset Test</span>
                <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Esc</kbd>
              </div>
              <div className="flex justify-between items-center p-2 bg-white/50 rounded">
                <span className="text-gray-700">Toggle Settings</span>
                <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl + ,</kbd>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Save Button */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            Save Settings
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings; 