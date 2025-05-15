'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Question } from '@/lib/supabase';

interface QuestionCardProps {
  question: Question;
  onNext: () => void;
  onPass: () => void;
}

export default function QuestionCard({ question, onNext, onPass }: QuestionCardProps) {
  const [showPassModal, setShowPassModal] = useState(false);

  return (
    <>
      <motion.div
        key={question.id}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl md:text-3xl font-medium text-gray-800 text-center mb-8">
          {question.question}
        </h2>
        
        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium"
            onClick={onNext}
          >
            Pertanyaan Berikutnya
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium"
            onClick={() => setShowPassModal(true)}
          >
            Lewati
          </motion.button>
        </div>
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
              <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 pointer-events-auto">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Apakah kamu yakin ingin melewati pertanyaan ini?
                </h3>
                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                    onClick={() => setShowPassModal(false)}
                  >
                    Batal
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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