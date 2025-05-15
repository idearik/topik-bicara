import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Log the URL (but not the key for security)
console.log('Initializing Supabase client with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Question = {
  id: string;
  topic: string;
  question: string;
};

export async function getRandomQuestion(topic: string): Promise<Question | null> {
  try {
    console.log('Fetching question for topic:', topic);
    
    // Simple health check first
    const { data: healthCheck, error: healthError } = await supabase
      .from('questions')
      .select('id')
      .limit(1);

    if (healthError) {
      console.error('Connection health check failed:', {
        message: healthError.message,
        code: healthError.code,
        details: healthError.details,
        hint: healthError.hint
      });
      return null;
    }

    console.log('Health check passed, found records:', healthCheck?.length);

    // Get all questions for the topic
    const { data, error } = await supabase
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

    if (!data || data.length === 0) {
      console.log('No questions found for topic:', topic);
      return null;
    }

    // Get a random question from the results
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomQuestion = data[randomIndex];

    console.log('Successfully fetched random question for topic:', topic);
    return randomQuestion;
  } catch (e) {
    console.error('Unexpected error:', e);
    return null;
  }
} 