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
  const [showPassModal, setShowPassModal] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(true);
    setTimeout(() => {
      onNext();
      setIsFlipped(false);
    }, 400);
  };

  return (
    <>
      <motion.div
        key={question.id}
        className="relative w-full max-w-2xl mx-auto perspective"
        style={{ perspective: '1000px' }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 w-full transform-style-3d"
          initial={false}
          animate={{
            rotateY: isFlipped ? 180 : 0,
            opacity: isFlipped ? 0 : 1,
          }}
          transition={{
            duration: 0.4,
            ease: "easeInOut"
          }}
          style={{
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden'
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <ProgressBar 
              current={currentQuestion} 
              total={totalQuestions} 
            />
            
            <h2 className="text-2xl md:text-3xl font-medium text-gray-800 text-center mb-8">
              {question.question}
            </h2>
            
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-[#B5EAD7] text-gray-700 rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow"
                onClick={handleNext}
              >
                Pertanyaan Berikutnya
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-[#FFB7B2] text-gray-700 rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow"
                onClick={() => setShowPassModal(true)}
              >
                Lewati
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showPassModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black"
              onClick={() => setShowPassModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 pointer-events-auto shadow-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Apakah kamu yakin ingin melewati pertanyaan ini?
                </h3>
                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    onClick={() => setShowPassModal(false)}
                  >
                    Batal
                  </button>
                  <button
                    className="px-4 py-2 bg-[#FFB7B2] text-gray-700 rounded hover:bg-[#ffa19a] transition-colors shadow-md"
                    onClick={() => {
                      setShowPassModal(false);
                      onPass();
                    }}
                  >
                    Ya, Lewati
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 