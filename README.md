# Topik Bicara

Topik Bicara adalah permainan kartu percakapan interaktif yang membantu memulai percakapan yang bermakna dengan teman, pasangan, atau keluarga melalui pertanyaan-pertanyaan menarik berdasarkan topik pilihan.

## 🌟 Fitur

- 💬 Berbagai topik percakapan:
  - Pacaran
  - Pernikahan
  - Persahabatan
  - Teman Kantor
  - Saudara Kandung
- 🎯 Pertanyaan acak untuk setiap topik
- 🎨 Desain modern dan responsif
- ⚡ Performa cepat dengan Next.js
- 🔄 Animasi halus dengan Framer Motion

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animasi
- [Supabase](https://supabase.com/) - Database

## 🚀 Development

1. Clone repository:
   ```bash
   git clone https://github.com/yourusername/topik-bicara.git
   cd topik-bicara
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Buat file `.env.local` dan isi dengan kredensial Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Jalankan development server:
   ```bash
   npm run dev
   ```

5. Buka [http://localhost:3000](http://localhost:3000)

## 📝 Database Schema

```sql
create table questions (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  question text not null
);
```

## 📄 License

MIT License - Lihat [LICENSE](LICENSE) untuk informasi lebih lanjut.

## 👤 Author

**@idearik**

- Website: [idearik.com](https://idearik.com)
- GitHub: [@idearik](https://github.com/idearik)

## 🤝 Contributing

Kontribusi, issues, dan feature requests sangat diterima!
