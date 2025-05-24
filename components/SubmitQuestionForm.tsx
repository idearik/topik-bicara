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
const MAX_CREDIT_LENGTH = 50;

export default function SubmitQuestionForm() {
  const [question, setQuestion] = useState('');
  const [topic, setTopic] = useState('');
  const [authorCredit, setAuthorCredit] = useState('');
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
    console.log('Submitting question:', { question, topic, authorCredit });

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

    if (authorCredit && authorCredit.length > MAX_CREDIT_LENGTH) {
      setError(`Nama/handle tidak boleh lebih dari ${MAX_CREDIT_LENGTH} karakter`);
      return;
    }

    if (containsInappropriateWords(question)) {
      setError('Pertanyaan mengandung kata-kata yang tidak pantas');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Inserting question into Supabase...');
      const { data, error: submitError } = await supabase
        .from('question_submissions')
        .insert([
          {
            question: question.trim(),
            topic,
            author_credit: authorCredit.trim() || null
          }
        ])
        .select();

      if (submitError) {
        console.error('Submit error details:', {
          message: submitError.message,
          code: submitError.code,
          details: submitError.details,
          hint: submitError.hint
        });
        throw submitError;
      }

      console.log('Question submitted successfully:', data);
      setShowSuccess(true);
      setQuestion('');
      setTopic('');
      setAuthorCredit('');
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Submit error:', err);
      setError('Gagal mengirim pertanyaan. Silakan coba lagi.');
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px] text-gray-900"
              placeholder="Tulis pertanyaanmu di sini..."
              maxLength={MAX_QUESTION_LENGTH}
              required
            />
            <div className="absolute bottom-2 right-2 text-sm text-gray-500">
              {question.length}/{MAX_QUESTION_LENGTH}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="authorCredit" className="block text-sm font-medium text-gray-700 mb-2">
            Nama/Handle Social Media (Opsional)
          </label>
          <div className="relative">
            <input
              type="text"
              id="authorCredit"
              value={authorCredit}
              onChange={(e) => setAuthorCredit(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="Contoh: @johndoe atau John D."
              maxLength={MAX_CREDIT_LENGTH}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              {authorCredit.length}/{MAX_CREDIT_LENGTH}
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Jika diisi, namamu akan muncul sebagai kredit di pertanyaan yang kamu ajukan
          </p>
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