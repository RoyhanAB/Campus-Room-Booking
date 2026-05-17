-- =====================================
-- MIGRATION: Add missing columns
-- Jalankan di Supabase SQL Editor
-- =====================================

-- 1. Tambah kolom yang kurang di tabel peminjaman
ALTER TABLE peminjaman 
  ADD COLUMN IF NOT EXISTS alasan_penolakan TEXT,
  ADD COLUMN IF NOT EXISTS approved_by VARCHAR(50),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP;

-- 2. Hash semua password yang masih plain text
-- PENTING: Jalankan ini SETELAH deploy code baru
-- Password baru akan otomatis di-hash oleh aplikasi
-- Password lama tetap bisa dipakai (login mendukung both format)

-- 3. Tambah tabel audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(50) NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tambah tabel system_settings
CREATE TABLE IF NOT EXISTS system_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Insert default settings
INSERT INTO system_settings (key, value) VALUES
  ('jam_operasional', '{"buka": "07:00", "tutup": "21:00"}'::jsonb),
  ('max_durasi_booking', '{"jam": 8}'::jsonb),
  ('max_booking_per_minggu', '{"limit": 5}'::jsonb),
  ('maintenance_mode', '{"active": false, "message": ""}'::jsonb)
ON CONFLICT (key) DO NOTHING;
