# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization and enter project details
4. Wait for the project to be created

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy your Project URL and anon public key
3. Create a `.env` file in the `client` directory with:

```
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Set Up Database Tables

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Create user vocabulary progress table
CREATE TABLE user_vocab_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('new', 'learning', 'mastered', 'review')),
  last_practiced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_review TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  correct_count INTEGER DEFAULT 0,
  incorrect_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, word)
);

-- Create user stats table
CREATE TABLE user_stats (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  wpm INTEGER NOT NULL,
  accuracy INTEGER NOT NULL,
  errors INTEGER NOT NULL,
  time_elapsed REAL NOT NULL,
  text_source TEXT NOT NULL,
  text_length TEXT NOT NULL,
  characters_typed INTEGER NOT NULL,
  characters_correct INTEGER NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_vocab_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for user_vocab_progress
CREATE POLICY "Users can view their own vocab progress" ON user_vocab_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vocab progress" ON user_vocab_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vocab progress" ON user_vocab_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for user_stats
CREATE POLICY "Users can view their own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_vocab_progress_user_id ON user_vocab_progress(user_id);
CREATE INDEX idx_user_vocab_progress_status ON user_vocab_progress(status);
CREATE INDEX idx_user_vocab_progress_next_review ON user_vocab_progress(next_review);
CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX idx_user_stats_timestamp ON user_stats(timestamp);
```

## 4. Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure your site URL (e.g., `http://localhost:3000` for development)
3. Add any additional redirect URLs you need
4. Optionally configure email templates

## 5. Test the Setup

1. Start your development server: `npm start`
2. Try signing up with a new account
3. Test the vocabulary learning feature
4. Check that your progress is being saved

## Features Enabled

With this setup, your typing app now has:

- ✅ User authentication (sign up/sign in/sign out)
- ✅ Adaptive vocabulary learning
- ✅ Progress tracking per user
- ✅ Spaced repetition algorithm
- ✅ User-specific statistics
- ✅ Secure data storage

## Troubleshooting

- **"Invalid API key"**: Double-check your `.env` file and restart the dev server
- **"Table doesn't exist"**: Make sure you ran all the SQL commands
- **"RLS policy violation"**: Check that the RLS policies are correctly set up
- **"User not authenticated"**: Ensure the user is signed in before accessing protected features 