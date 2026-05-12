# Peminjaman Ruangan Kampus UNTIRTA 🏛️

Aplikasi web untuk sistem manajemen peminjaman ruangan kampus. Memisahkan peran antara Mahasiswa (peminjam) dan Admin Fakultas (pengelola).

## Fitur Utama ✨

- **Autentikasi & Role-Based Access Control**: Login memisahkan rute `/admin` dan `/` (user). Rute dilindungi menggunakan Middleware Next.js.
- **User Dashboard**: Mahasiswa dapat melihat daftar ruangan, detail ruangan, serta mengajukan form peminjaman ruangan sesuai jadwal.
- **Admin Panel**: Admin memiliki kontrol penuh (CRUD) untuk menambah, mengedit, menghapus ruangan, serta menyetujui (Approve) atau menolak (Reject) pengajuan dari mahasiswa.
- **Optimistic UI**: Aksi seperti Approve/Reject pada tabel peminjaman terasa instan berkat React 19 `useOptimistic`.
- **URL Search Persistence**: Pencarian ruangan dan histori tersimpan di URL (contoh: `?q=R002`), sehingga hasil pencarian tidak hilang saat *refresh*.
- **Skeleton Loading**: Perpindahan antar rute terasa lebih *smooth* dengan *shimmer effect* (Skeleton Loading) saat data sedang diambil.

## Tech Stack 🛠️

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: Vanilla CSS Modules (tanpa framework tambahan, sesuai *requirement*)
- **Database & Storage**: [Supabase](https://supabase.com/) (PostgreSQL & Bucket untuk gambar ruangan)
- **Icons**: [Lucide React](https://lucide.dev/)

## Cara Menjalankan di Lokal 🚀

1. Pastikan Anda telah menginstal Node.js versi 18+.
2. *Clone* repository ini.
3. Install semua *dependencies*:
   ```bash
   npm install
   ```
4. Copy file `.env.example` menjadi `.env` lalu isi *credentials* Supabase Anda:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://<PROJECT_ID>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_ANON_KEY>
   ```
5. Jalankan *development server*:
   ```bash
   npm run dev
   ```
6. Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### Akun Testing (Seed Data)
- **Admin**: `ADM001` (Password: `admin123`)
- **Mahasiswa**: `USR001` (Password: `pass123`)

## Deployment 🌐
Aplikasi ini dioptimalkan untuk di-deploy di [Vercel](https://vercel.com). Pastikan Anda memasukkan *Environment Variables* Supabase di *dashboard* Vercel sebelum melakukan *build*.
