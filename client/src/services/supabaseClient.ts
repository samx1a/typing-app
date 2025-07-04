import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project URL and anon key
// You can get these from your Supabase dashboard
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project-id.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript
export interface UserVocabProgress {
  id?: number;
  user_id: string;
  word: string;
  status: 'new' | 'learning' | 'mastered' | 'review';
  last_practiced: string;
  next_review: string;
  correct_count: number;
  incorrect_count: number;
  created_at?: string;
}

export interface UserStats {
  id?: number;
  user_id: string;
  wpm: number;
  accuracy: number;
  errors: number;
  timeElapsed: number;
  text_source: string;
  text_length: string;
  characters_typed: number;
  characters_correct: number;
  timestamp: string;
  created_at?: string;
} 