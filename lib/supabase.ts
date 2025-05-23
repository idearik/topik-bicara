import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Log the URL (but not the key for security)
console.log('Initializing Supabase client with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
});

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return !!session;
  } catch (err) {
    console.error('Error checking authentication:', err);
    return false;
  }
};

export type Question = {
  id: string;
  topic: string;
  question: string;
  is_user_submitted?: boolean;
  author_credit?: string | null;
};

const SHOWN_QUESTIONS_KEY = 'shown_questions';

function getShownQuestions(topic: string): string[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(`${SHOWN_QUESTIONS_KEY}_${topic}`);
  return stored ? JSON.parse(stored) : [];
}

function addShownQuestion(topic: string, questionId: string) {
  if (typeof window === 'undefined') return;
  const shown = getShownQuestions(topic);
  shown.push(questionId);
  localStorage.setItem(`${SHOWN_QUESTIONS_KEY}_${topic}`, JSON.stringify(shown));
}

function resetShownQuestions(topic: string) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`${SHOWN_QUESTIONS_KEY}_${topic}`);
}

export async function getTotalQuestions(topic: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('topic', topic);

    if (error) {
      console.error('Error getting total questions:', error);
      return 0;
    }

    return count || 0;
  } catch (e) {
    console.error('Unexpected error getting total questions:', e);
    return 0;
  }
}

export async function getRandomQuestion(topic: string): Promise<Question | null> {
  try {
    console.log('Fetching question for topic:', topic);
    
    const { data: userSubmittedData, error } = await supabase
      .from('questions')
      .select('*, question_submissions!inner(approved)')
      .eq('topic', topic)
      .eq('question_submissions.approved', true);

    if (error) {
      console.error('Error fetching questions:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        topic
      });
      return null;
    }

    let questions;
    if (!userSubmittedData || userSubmittedData.length === 0) {
      // Try fetching without the join to get non-user-submitted questions
      const { data: regularData, error: regularError } = await supabase
        .from('questions')
        .select('*')
        .eq('topic', topic);

      if (regularError || !regularData || regularData.length === 0) {
        console.log('No questions found for topic:', topic);
        return null;
      }

      questions = regularData.map(q => ({ ...q, is_user_submitted: false }));
    } else {
      // Mark questions as user submitted
      questions = userSubmittedData.map(q => ({ ...q, is_user_submitted: true }));
    }

    // Get shown questions for this topic
    const shownQuestions = getShownQuestions(topic);
    
    // Filter out questions that have been shown
    const availableQuestions = questions.filter(q => !shownQuestions.includes(q.id));
    
    // If all questions have been shown, reset the tracking and use all questions
    if (availableQuestions.length === 0) {
      console.log('All questions shown, resetting tracking for topic:', topic);
      resetShownQuestions(topic);
      const randomIndex = Math.floor(Math.random() * questions.length);
      const randomQuestion = questions[randomIndex];
      addShownQuestion(topic, randomQuestion.id);
      return randomQuestion;
    }
    
    // Get a random question from the available questions
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const randomQuestion = availableQuestions[randomIndex];
    
    // Track this question as shown
    addShownQuestion(topic, randomQuestion.id);

    console.log('Successfully fetched random question for topic:', topic);
    return randomQuestion;
  } catch (e) {
    console.error('Unexpected error:', e);
    return null;
  }
} 