-- =====================================
-- SEED: Super Admin User
-- Jalankan di Supabase SQL Editor
-- =====================================

-- 1. Tambahkan user super admin
INSERT INTO users (user_id, password, user_name, role) VALUES
('SA001', 'super123', 'Super Admin', 'super_admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin', user_name = 'Super Admin';

-- 2. Tambahkan profile untuk super admin
INSERT INTO profiles (user_id, jurusan, angkatan) VALUES
('SA001', 'Administrator', '2020')
ON CONFLICT (user_id) DO NOTHING;
