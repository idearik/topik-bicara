import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

if (!supabaseServiceKey) {
  console.warn('Warning: SUPABASE_SERVICE_ROLE_KEY is not set. Admin functionality will be limited.');
}

// Log the URL and client configuration (but not the keys for security)
console.log('Supabase Configuration:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  hasServiceKey: !!supabaseServiceKey
});

// Public client
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

// Admin client with service role (only used in admin routes)
export const adminSupabase = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

console.log('Supabase Clients Initialized:', {
  hasPublicClient: !!supabase,
  hasAdminClient: !!adminSupabase,
  adminClientHasServiceRole: adminSupabase?.auth.admin !== undefined
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
    
    // Get all questions for the topic
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .eq('topic', topic);

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

    if (!questions || questions.length === 0) {
      console.log('No questions found for topic:', topic);
      return null;
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