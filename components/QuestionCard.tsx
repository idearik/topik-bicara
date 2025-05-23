'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Question } from '@/lib/supabase';
import ProgressBar from './ProgressBar';

interface QuestionCardProps {
  question: Question;
  onNext: () => void;
  onPass: () => void;
  currentQuestion: number;
  totalQuestions: number;
}

export default function QuestionCard({ 
  question, 
  onNext, 
  onPass, 
  currentQuestion,
  totalQuestions 
}: QuestionCardProps) {
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handlePassClick = () => {
    setShowConfirmPass(true);
  };

  const handleConfirmPass = () => {
    setShowConfirmPass(false);
    onPass();
  };

  const handleCancelPass = () => {
    setShowConfirmPass(false);
  };

  return (
    <div className="perspective">
      <AnimatePresence mode="wait">
        {showConfirmPass ? (
          <motion.div
            key="confirm"
            initial={{ rotateY: 180, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -180, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="transform-style-3d backface-hidden"
          >
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Yakin mau skip pertanyaan ini?
              </h3>
              <div className="space-x-4">
                <button
                  onClick={handleConfirmPass}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Ya, Skip
                </button>
                <button
                  onClick={handleCancelPass}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Tidak
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="question"
            initial={{ rotateY: -180, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 180, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="transform-style-3d backface-hidden"
          >
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="relative">
                {question.is_user_submitted && (
                  <div className="absolute -top-2 -right-2 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-purple-400">
                    ✨ User Submitted
                    {question.author_credit && (
                      <span className="ml-1">by {question.author_credit}</span>
                    )}
                  </div>
                )}
                <h2 className="text-xl md:text-2xl font-semibold mb-8 text-gray-800">
                  {question.question}
                </h2>
              </div>

              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={handlePassClick}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Pass
                </button>
                <button
                  onClick={onNext}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Next
                </button>
              </div>

              <div className="mt-8">
                <ProgressBar current={currentQuestion} total={totalQuestions} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 