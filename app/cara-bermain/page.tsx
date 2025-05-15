'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  {
    title: 'Pilih Topik',
    description: 'Mulai dengan pilih satu topik yang ingin dibahas, seperti Pacaran, Keluarga, atau Kencan Pertama.',
    icon: '🎯'
  },
  {
    title: 'Baca Pertanyaan',
    description: 'Setelah pilih topik, pertanyaan akan muncul secara acak.\n\nPertanyaannya bisa lucu, dalam, atau bikin mikir. Jawab sejujurnya!',
    icon: '💭'
  },
  {
    title: 'Pilih Next atau Pass',
    description: 'Next untuk lanjut ke pertanyaan berikutnya.\n\nPass kalau kamu gak mau jawab. Tapi bakal muncul konfirmasi dulu, biar yakin.',
    icon: '➡️'
  },
  {
    title: 'Lanjutkan Sampai Selesai',
    description: 'Satu sesi berisi sekitar 20–25 pertanyaan.\n\nGak ada poin, gak ada menang/kalah.\n\nTujuannya cuma satu: ngobrol lebih jujur dan seru.',
    icon: '🎉'
  }
];

export default function CaraBermain() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="block text-center hover:opacity-80 transition-opacity mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            #JawabJujur
          </h1>
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Cara Bermain #JawabJujur
          </h2>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-purple-100 rounded-full">
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 whitespace-pre-line">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
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
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 