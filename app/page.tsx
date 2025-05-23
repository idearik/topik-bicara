import TopicCard from '@/components/TopicCard';
import Link from 'next/link';

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

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              #JawabJujur
            </h1>
          </Link>
          <p className="text-xl text-gray-600 mb-4">
            Buka obrolan. Buka hati.
          </p>
          <div className="space-x-6">
            <Link
              href="/cara-bermain"
              className="inline-flex items-center text-purple-600 hover:text-purple-700 text-sm"
            >
              <span className="mr-1">📖</span>
              Cara Bermain
            </Link>
            <Link
              href="/submit"
              className="inline-flex items-center text-purple-600 hover:text-purple-700 text-sm"
            >
              <span className="mr-1">✨</span>
              Kirim Pertanyaan
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <TopicCard 
              key={topic} 
              topic={topic} 
              isHighlighted={topic === 'Kencan Pertama' || topic === 'Diri Sendiri' || topic === 'Quarter Life Crisis'}
              highlightLabel={
                topic === 'Kencan Pertama' 
                  ? '✨ Topik Baru' 
                  : topic === 'Quarter Life Crisis'
                    ? '🎯 Must Try'
                    : '🔥 Populer'
              }
              highlightEmoji={
                topic === 'Kencan Pertama'
                  ? '✨'
                  : topic === 'Quarter Life Crisis'
                    ? '🎯'
                    : '🔥'
              }
            />
          ))}
        </div>
      </div>
    </main>
  );
}
