# Database Migration - Alasan Penolakan

## ⚠️ PENTING: Jalankan SQL ini di Supabase SQL Editor

Untuk mengaktifkan fitur **Alasan Penolakan**, Anda perlu menambahkan kolom baru ke tabel `peminjaman`.

### SQL Migration

```sql
-- Tambah kolom alasan_penolakan ke tabel peminjaman
ALTER TABLE peminjaman 
ADD COLUMN IF NOT EXISTS alasan_penolakan TEXT;

-- Tambah comment untuk dokumentasi
COMMENT ON COLUMN peminjaman.alasan_penolakan IS 'Alasan penolakan peminjaman (hanya diisi jika status = ditolak)';
```

### Cara Menjalankan:

1. Buka Supabase Dashboard
2. Pilih project Anda
3. Klik **SQL Editor** di sidebar
4. Copy-paste SQL di atas
5. Klik **Run** atau tekan `Ctrl+Enter`

### Verifikasi:

Setelah menjalankan migration, cek apakah kolom sudah ada:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'peminjaman' 
  AND column_name = 'alasan_penolakan';
```

Harusnya return:
```
column_name         | data_type | is_nullable
--------------------|-----------|------------
alasan_penolakan    | text      | YES
```

---

## ✅ Fitur yang Sudah Diimplementasikan

### 1. **Alasan Penolakan** ⭐⭐⭐⭐

**Backend:**
- ✅ Update `Peminjaman` type dengan field `alasan_penolakan`
- ✅ Update `updatePeminjamanStatus()` function untuk menerima parameter alasan
- ✅ Update `rejectPeminjamanAction()` server action

**Frontend Admin:**
- ✅ Modal dialog untuk input alasan penolakan
- ✅ 6 pilihan alasan umum (radio buttons)
- ✅ Option "Lainnya" dengan textarea custom
- ✅ Validation: wajib pilih/tulis alasan sebelum reject
- ✅ UI modern dengan gradient yellow theme

**Frontend User:**
- ✅ Tampilkan alasan penolakan di history page
- ✅ Styling khusus dengan red theme untuk rejection reason
- ✅ Hanya muncul jika status = ditolak

**Alasan Umum yang Tersedia:**
1. Ruangan sudah dibooking di waktu yang sama
2. Dokumen pendukung tidak lengkap
3. Kegiatan tidak sesuai dengan fungsi ruangan
4. Kapasitas peserta melebihi kapasitas ruangan
5. Waktu peminjaman terlalu singkat/panjang
6. Lainnya (tulis manual)

---

## 🎯 Next Steps

Setelah migration berhasil, fitur ini siap digunakan!

**Testing Checklist:**
- [ ] Admin bisa reject dengan memilih alasan
- [ ] Admin bisa reject dengan menulis alasan custom
- [ ] User bisa lihat alasan penolakan di history
- [ ] Alasan tersimpan di database
- [ ] Modal bisa dibuka dan ditutup dengan baik

**Fitur Selanjutnya yang Bisa Diimplementasikan:**
- [ ] Conflict Detection (cek bentrok jadwal)
- [ ] Room Selector Autocomplete
- [ ] Dashboard Stats & Analytics
- [ ] Export to PDF
- [ ] Email Notifications
