import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Topik Bicara - Permainan Kartu Percakapan",
  description: "Mulai percakapan yang bermakna dengan teman, pasangan, atau keluarga melalui pertanyaan-pertanyaan menarik berdasarkan topik pilihan.",
  keywords: "topik bicara, kartu percakapan, permainan percakapan, conversation starter, relationship game",
  openGraph: {
    title: "Topik Bicara - Permainan Kartu Percakapan",
    description: "Mulai percakapan yang bermakna dengan teman, pasangan, atau keluarga.",
    url: "https://topikbicara.com",
    siteName: "Topik Bicara",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {children}
        <footer className="py-8 text-center text-gray-600 text-sm">
          <p>
            © 2025 Topik Bicara. Project by{' '}
            <a
              href="https://idearik.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 underline"
            >
              @idearik
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
