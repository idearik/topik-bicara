import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "#JawabJujur - Permainan Kartu Percakapan",
  description: "Buka obrolan. Buka hati. Mulai percakapan yang bermakna dengan teman, pasangan, atau keluarga melalui pertanyaan-pertanyaan menarik.",
  keywords: "jawab jujur, kartu percakapan, permainan percakapan, conversation starter, relationship game",
  openGraph: {
    title: "#JawabJujur - Permainan Kartu Percakapan",
    description: "Buka obrolan. Buka hati.",
    url: "https://topikbicara.com",
    siteName: "#JawabJujur",
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
            © 2025 #JawabJujur. Project by{' '}
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
        <Analytics />
      </body>
    </html>
  );
}
