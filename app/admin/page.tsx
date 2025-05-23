'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Submission {
  id: string;
  question: string;
  topic: string;
  created_at: string;
  author_credit?: string | null;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated]);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('question_submissions')
        .select('*')
        .eq('approved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setError('');
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to verify password');
    }
  };

  const handleApprove = async (submission: Submission) => {
    try {
      setActionInProgress(submission.id);
      setError('');

      // First, insert into questions table
      const { error: insertError } = await supabase
        .from('questions')
        .insert([
          {
            question: submission.question,
            topic: submission.topic,
            is_user_submitted: true,
            author_credit: submission.author_credit
          }
        ]);

      if (insertError) {
        console.error('Error inserting into questions:', insertError);
        throw new Error('Failed to add question');
      }

      // Then, delete from submissions table
      const { error: deleteError } = await supabase
        .from('question_submissions')
        .delete()
        .eq('id', submission.id);

      if (deleteError) {
        console.error('Error deleting submission:', deleteError);
        throw new Error('Failed to delete submission');
      }

      // Refresh the submissions list
      await fetchSubmissions();
    } catch (err) {
      console.error('Error approving submission:', err);
      setError('Failed to approve submission');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setActionInProgress(id);
      setError('');

      const { error } = await supabase
        .from('question_submissions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting submission:', error);
        throw error;
      }

      // Refresh the submissions list
      await fetchSubmissions();
    } catch (err) {
      console.error('Error rejecting submission:', err);
      setError('Failed to reject submission');
    } finally {
      setActionInProgress(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Question Submissions</h2>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-purple-600 hover:text-purple-700"
            >
              Logout
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-md">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No pending submissions
            </div>
          ) : (
            <div className="space-y-6">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="border border-gray-200 rounded-lg p-6 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{submission.question}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Topic: {submission.topic}
                      </p>
                      {submission.author_credit && (
                        <p className="text-sm text-gray-500">
                          Author: {submission.author_credit}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        Submitted: {new Date(submission.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="space-x-3">
                      <button
                        onClick={() => handleApprove(submission)}
                        disabled={actionInProgress === submission.id}
                        className={`px-4 py-2 text-white rounded-md transition-colors ${
                          actionInProgress === submission.id
                            ? 'bg-green-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {actionInProgress === submission.id ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(submission.id)}
                        disabled={actionInProgress === submission.id}
                        className={`px-4 py-2 text-white rounded-md transition-colors ${
                          actionInProgress === submission.id
                            ? 'bg-red-400 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        {actionInProgress === submission.id ? 'Processing...' : 'Reject'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 