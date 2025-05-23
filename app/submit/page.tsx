import SubmitQuestionForm from '@/components/SubmitQuestionForm';
import Link from 'next/link';

export default function SubmitPage() {
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
            Kirim Pertanyaanmu
          </p>
        </div>

        <SubmitQuestionForm />

        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-purple-600 hover:text-purple-700 underline"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
} 