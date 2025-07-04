import React from 'react';
import { Moon, Sun, Keyboard, BarChart3, Settings, Github } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange, theme, onThemeChange }) => {
  const navItems = [
    { id: 'typing', label: 'Typing', icon: Keyboard },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="w-full border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-5xl mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 select-none">
          <span className="font-mono text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-100">type</span>
        </div>
        {/* Nav */}
        <div className="flex gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1 transition-colors border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400
                  ${isActive ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>
        {/* Theme toggle & GitHub */}
        <div className="flex items-center gap-2">
          <button
            aria-label="Toggle theme"
            onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Github size={18} />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 