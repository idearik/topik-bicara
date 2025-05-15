'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface TopicCardProps {
  topic: string;
}

export default function TopicCard({ topic }: TopicCardProps) {
  return (
    <Link href={`/main?topic=${encodeURIComponent(topic)}`}>
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 text-center">{topic}</h2>
      </motion.div>
    </Link>
  );
} 