import React from 'react';
import { motion } from 'framer-motion';
import { Keyboard, BarChart3, Settings, Github, Zap } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const navItems = [
    { id: 'typing', label: 'Typing Test', icon: Keyboard },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <motion.nav 
      className="glass rounded-2xl p-4 shadow-xl mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">SpeedType</h1>
            <p className="text-xs text-gray-500">Advanced Typing Platform</p>
          </div>
        </motion.div>

        {/* Navigation Items */}
        <div className="flex gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-white/50 text-gray-700 hover:bg-white/70'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={18} />
                {item.label}
              </motion.button>
            );
          })}
        </div>

        {/* GitHub Link */}
        <motion.a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Github size={20} className="text-gray-700" />
        </motion.a>
      </div>
    </motion.nav>
  );
};

export default Navigation; 