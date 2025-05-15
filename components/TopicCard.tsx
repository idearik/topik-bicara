'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface TopicCardProps {
  topic: string;
  isHighlighted?: boolean;
  highlightLabel?: string;
  highlightEmoji?: string;
}

export default function TopicCard({ 
  topic, 
  isHighlighted = false,
  highlightLabel = "✨ Topik Baru",
  highlightEmoji = "✨"
}: TopicCardProps) {
  return (
    <Link href={`/main?topic=${encodeURIComponent(topic)}`}>
      <motion.div
        className={`rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all ${
          isHighlighted 
            ? 'bg-gradient-to-r from-pink-100 to-purple-100 border-2 border-purple-200' 
            : 'bg-white'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className={`text-xl font-semibold text-center ${
          isHighlighted ? 'text-purple-800' : 'text-gray-800'
        }`}>
          {topic}
          {isHighlighted && (
            <span className="block text-sm font-normal text-purple-600 mt-1">
              {highlightLabel}
            </span>
          )}
        </h2>
      </motion.div>
    </Link>
  );
} 