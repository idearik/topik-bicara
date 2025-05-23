'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const topics = [
  'Kencan Pertama',
  'Pacaran',
  'LDR',
  'Pernikahan',
  'Persahabatan',
  'Teman Kantor',
  'Saudara Kandung',
  'Diri Sendiri',
  'Tempat Nongkrong',
  'Masa Kecil',
  'Quarter Life Crisis',
  'Reuni Sekolah'
];

const MAX_QUESTION_LENGTH = 150;

export default function SubmitQuestionForm() {
  const [question, setQuestion] = useState('');
  const [topic, setTopic] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // Basic word filter - can be expanded
  const inappropriateWords = ['kasar', 'jelek', 'bodoh', 'tolol', 'script', 'alert', '<script>'];
  
  const containsInappropriateWords = (text: string) => {
    const lowerText = text.toLowerCase();
    return inappropriateWords.some(word => lowerText.includes(word.toLowerCase()));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!question.trim()) {
      setError('Pertanyaan tidak boleh kosong');
      return;
    }

    if (!topic) {
      setError('Pilih topik terlebih dahulu');
      return;
    }

    if (question.length > MAX_QUESTION_LENGTH) {
      setError(`Pertanyaan tidak boleh lebih dari ${MAX_QUESTION_LENGTH} karakter`);
      return;
    }

    if (containsInappropriateWords(question)) {
      setError('Pertanyaan mengandung kata-kata yang tidak pantas');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: submitError } = await supabase
        .from('question_submissions')
        .insert([
          {
            question: question.trim(),
            topic,
            approved: false
          }
        ]);

      if (submitError) throw submitError;

      setShowSuccess(true);
      setQuestion('');
      setTopic('');
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (err) {
      setError('Gagal mengirim pertanyaan. Silakan coba lagi.');
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Kirim Pertanyaan Baru</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
            Topik
          </label>
          <select
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="">Pilih Topik</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
            Pertanyaan
          </label>
          <div className="relative">
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px]"
              placeholder="Tulis pertanyaanmu di sini..."
              maxLength={MAX_QUESTION_LENGTH}
              required
            />
            <div className="absolute bottom-2 right-2 text-sm text-gray-500">
              {question.length}/{MAX_QUESTION_LENGTH}
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        {showSuccess && (
          <div className="bg-green-50 text-green-800 p-4 rounded-md">
            Terima kasih! Kami akan mereview pertanyaanmu segera.
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-md text-white font-medium 
            ${isSubmitting 
              ? 'bg-purple-400 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700'
            } transition-colors`}
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Pertanyaan'}
        </button>
      </form>
    </div>
  );
} 