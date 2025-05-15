import TopicCard from '@/components/TopicCard';
import Link from 'next/link';

const topics = [
  'Pacaran',
  'Pernikahan',
  'Persahabatan',
  'Teman Kantor',
  'Saudara Kandung'
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="block text-center hover:opacity-80 transition-opacity">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Topik Bicara
          </h1>
        </Link>
        <p className="text-xl text-center text-gray-600 mb-12">
          Pilih topik untuk memulai percakapan yang bermakna
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <TopicCard key={topic} topic={topic} />
          ))}
        </div>
      </div>
    </main>
  );
}
