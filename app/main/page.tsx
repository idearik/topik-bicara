'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import QuestionCard from '@/components/QuestionCard';
import { getRandomQuestion, Question } from '@/lib/supabase';
import { motion } from 'framer-motion';

export default function MainPage() {
  const searchParams = useSearchParams();
  const [topic, setTopic] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTopic(searchParams?.get('topic') || '');
  }, [searchParams]);

  const fetchNewQuestion = async () => {
    setLoading(true);
    const question = await getRandomQuestion(topic);
    setCurrentQuestion(question);
    setLoading(false);
  };

  useEffect(() => {
    if (topic) {
      fetchNewQuestion();
    }
  }, [topic]);

  if (!topic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Topik tidak dipilih</h1>
          <Link
            href="/"
            className="text-purple-600 hover:text-purple-700 underline"
          >
            Kembali ke pilihan topik
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Topik Bicara
            </h1>
          </Link>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-700 capitalize"
          >
            {topic}
          </motion.h2>
        </div>

        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-purple-600 hover:text-purple-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Kembali ke Pilihan Topik
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800" />
          </div>
        ) : currentQuestion ? (
          <QuestionCard
            question={currentQuestion}
            onNext={fetchNewQuestion}
            onPass={fetchNewQuestion}
          />
        ) : (
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-4">
              Tidak ada pertanyaan tersedia untuk topik ini.
            </p>
            <Link
              href="/"
              className="text-purple-600 hover:text-purple-700 underline"
            >
              Coba topik lain
            </Link>
          </div>
        )}
      </div>
    </main>
  );
} 