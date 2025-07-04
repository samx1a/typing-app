import React, { useState } from 'react';
import { useAuth } from '../services/auth';
import { User, LogIn, LogOut, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AuthPanel() {
  const { user, supabase } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Signed in successfully!');
        setEmail('');
        setPassword('');
        setShowAuthForm(false);
      }
    } catch (error) {
      toast.error('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Account created! Please check your email to verify your account.');
        setEmail('');
        setPassword('');
        setShowAuthForm(false);
      }
    } catch (error) {
      toast.error('An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Signed out successfully!');
      }
    } catch (error) {
      toast.error('An error occurred during sign out');
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <User size={16} className="text-blue-500" />
          <span className="font-mono text-gray-700 dark:text-gray-300">
            {user.email}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-mono border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    );
  }

  if (showAuthForm) {
    return (
      <div className="flex items-center gap-2">
        <form onSubmit={handleSignIn} className="flex items-center gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="px-3 py-1 rounded-full text-sm font-mono border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength={6}
            className="px-3 py-1 rounded-full text-sm font-mono border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-mono bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <LogIn size={14} />
            Sign In
          </button>
          <button
            type="button"
            onClick={handleSignUp}
            disabled={isLoading}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-mono bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            <UserPlus size={14} />
            Sign Up
          </button>
        </form>
        <button
          onClick={() => setShowAuthForm(false)}
          className="px-2 py-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowAuthForm(true)}
      className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-mono border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <LogIn size={14} />
      Sign In
    </button>
  );
} 