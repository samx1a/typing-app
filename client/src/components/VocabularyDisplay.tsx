import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, Lightbulb, Award } from 'lucide-react';
import { VocabularyWord } from '../services/vocabularyGenerator';

interface VocabularyDisplayProps {
  word: VocabularyWord;
  isVisible: boolean;
}

const VocabularyDisplay: React.FC<VocabularyDisplayProps> = ({ word, isVisible }) => {
  if (!isVisible) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'hard': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto mt-8 p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BookOpen size={24} className="text-blue-500" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            New Word Learned!
          </h3>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          You just practiced typing with an uncommon word
        </p>
      </div>

      <div className="space-y-4">
        {/* Word and Difficulty */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {word.word}
          </h2>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(word.difficulty)}`}>
            {getDifficultyIcon(word.difficulty)}
            <span className="capitalize">{word.difficulty}</span>
          </div>
        </div>

        {/* Definition */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Definition
          </h4>
          <p className="text-gray-900 dark:text-gray-100 text-lg">
            {word.definition}
          </p>
        </div>

        {/* Example */}
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
            Example Sentence
          </h4>
          <p className="text-blue-900 dark:text-blue-100 text-lg italic">
            "{word.example}"
          </p>
        </div>

        {/* Category */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Category: <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">{word.category}</span></span>
          <span>Keep practicing to expand your vocabulary!</span>
        </div>
      </div>
    </motion.div>
  );
};

export default VocabularyDisplay; 