import { supabase, UserVocabProgress } from './supabaseClient';
import { vocabularyGenerator } from './vocabularyGenerator';

// Get the next best word for a user to practice
export async function getNextVocabWord(userId: string): Promise<string | null> {
  try {
    // First, try to get words that need review (due for review or learning)
    const { data: reviewWords, error: reviewError } = await supabase
      .from('user_vocab_progress')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['learning', 'review'])
      .lte('next_review', new Date().toISOString())
      .order('next_review', { ascending: true })
      .limit(1);

    if (reviewError) {
      console.error('Error fetching review words:', reviewError);
      return null;
    }

    if (reviewWords && reviewWords.length > 0) {
      return reviewWords[0].word;
    }

    // If no words need review, get a new word
    const { data: newWords, error: newError } = await supabase
      .from('user_vocab_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'new')
      .limit(1);

    if (newError) {
      console.error('Error fetching new words:', newError);
      return null;
    }

    if (newWords && newWords.length > 0) {
      return newWords[0].word;
    }

    // If no words in database, get a random word and add it
    const randomWord = vocabularyGenerator.getRandomWord();
    await addNewWordForUser(userId, randomWord.word);
    return randomWord.word;

  } catch (error) {
    console.error('Error in getNextVocabWord:', error);
    return null;
  }
}

// Add a new word to user's vocabulary list
export async function addNewWordForUser(userId: string, word: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('user_vocab_progress')
      .insert({
        user_id: userId,
        word,
        status: 'new',
        last_practiced: new Date().toISOString(),
        next_review: new Date().toISOString(),
        correct_count: 0,
        incorrect_count: 0
      });

    if (error) {
      console.error('Error adding new word:', error);
    }
  } catch (error) {
    console.error('Error in addNewWordForUser:', error);
  }
}

// Update user's progress on a word
export async function updateVocabProgress(
  userId: string, 
  word: string, 
  correct: boolean
): Promise<void> {
  try {
    // Get current progress
    const { data: currentProgress, error: fetchError } = await supabase
      .from('user_vocab_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('word', word)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching current progress:', fetchError);
      return;
    }

    // Calculate new values
    const correctCount = (currentProgress?.correct_count || 0) + (correct ? 1 : 0);
    const incorrectCount = (currentProgress?.incorrect_count || 0) + (correct ? 0 : 1);
    
    let status: 'new' | 'learning' | 'mastered' | 'review' = 'new';
    let nextReviewDays = 1;

    if (currentProgress) {
      // Determine status based on performance
      if (correctCount >= 3 && correctCount > incorrectCount) {
        status = 'mastered';
        nextReviewDays = 7; // Review mastered words weekly
      } else if (correct) {
        status = 'learning';
        nextReviewDays = 2; // Review learning words every 2 days
      } else {
        status = 'review';
        nextReviewDays = 1; // Review failed words daily
      }
    } else {
      // First time seeing this word
      status = correct ? 'learning' : 'review';
      nextReviewDays = correct ? 2 : 1;
    }

    // Calculate next review date
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + nextReviewDays);

    // Update or insert progress
    const { error: upsertError } = await supabase
      .from('user_vocab_progress')
      .upsert({
        user_id: userId,
        word,
        status,
        last_practiced: new Date().toISOString(),
        next_review: nextReview.toISOString(),
        correct_count: correctCount,
        incorrect_count: incorrectCount
      });

    if (upsertError) {
      console.error('Error updating vocab progress:', upsertError);
    }

  } catch (error) {
    console.error('Error in updateVocabProgress:', error);
  }
}

// Get user's vocabulary statistics
export async function getUserVocabStats(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_vocab_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching vocab stats:', error);
      return null;
    }

    const stats = {
      total: data?.length || 0,
      mastered: data?.filter(w => w.status === 'mastered').length || 0,
      learning: data?.filter(w => w.status === 'learning').length || 0,
      review: data?.filter(w => w.status === 'review').length || 0,
      new: data?.filter(w => w.status === 'new').length || 0
    };

    return stats;
  } catch (error) {
    console.error('Error in getUserVocabStats:', error);
    return null;
  }
}

// Get words due for review
export async function getWordsDueForReview(userId: string): Promise<UserVocabProgress[]> {
  try {
    const { data, error } = await supabase
      .from('user_vocab_progress')
      .select('*')
      .eq('user_id', userId)
      .lte('next_review', new Date().toISOString())
      .order('next_review', { ascending: true });

    if (error) {
      console.error('Error fetching words due for review:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getWordsDueForReview:', error);
    return [];
  }
} 