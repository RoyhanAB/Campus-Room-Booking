-- =====================================
-- SEED DATA: fakultas
-- =====================================
INSERT INTO fakultas (fakultas_name, lokasi) VALUES
('Fakultas Teknik', 'Gedung A Kampus Utama'),
('Fakultas Ilmu Komputer', 'Gedung B Kampus Utama'),
('Fakultas Ekonomi dan Bisnis', 'Gedung C Kampus Utama'),
('Fakultas Hukum', 'Gedung D Kampus Barat'),
('Fakultas Kedokteran', 'Gedung E Kampus Timur');

-- =====================================
-- SEED DATA: users
-- password hanya contoh plaintext
-- =====================================
INSERT INTO users (user_id, password, user_name, role) VALUES
('USR001', 'pass123', 'Ahmad Fauzi', 'mahasiswa'),
('USR002', 'pass123', 'Siti Rahma', 'mahasiswa'),
('USR003', 'pass123', 'Budi Santoso', 'mahasiswa'),
('USR004', 'pass123', 'Dewi Lestari', 'dosen'),
('USR005', 'pass123', 'Rizky Hidayat', 'dosen'),
('ADM001', 'admin123', 'Admin Teknik', 'admin_fakultas'),
('ADM002', 'admin123', 'Admin Ilkom', 'admin_fakultas'),
('ADM003', 'admin123', 'Admin FEB', 'admin_fakultas'),
('ADM004', 'admin123', 'Admin Hukum', 'admin_fakultas'),
('ADM005', 'admin123', 'Admin Kedokteran', 'admin_fakultas');

-- =====================================
-- SEED DATA: profiles
-- =====================================
INSERT INTO profiles (user_id, jurusan, angkatan) VALUES
('USR001', 'Teknik Informatika', '2023'),
('USR002', 'Sistem Informasi', '2022'),
('USR003', 'Teknik Sipil', '2021'),
('USR004', 'Teknik Mesin', '2019'),
('USR005', 'Manajemen', '2018'),
('ADM001', 'Teknik Industri', '2015'),
('ADM002', 'Informatika', '2014'),
('ADM003', 'Akuntansi', '2016'),
('ADM004', 'Ilmu Hukum', '2013'),
('ADM005', 'Kedokteran Umum', '2012');

-- =====================================
-- SEED DATA: admin_fakultas
-- =====================================
INSERT INTO admin_fakultas (user_id, fakultas_id) VALUES
('ADM001', 1),
('ADM002', 2),
('ADM003', 3),
('ADM004', 4),
('ADM005', 5);

-- =====================================
-- SEED DATA: buildings
-- =====================================
INSERT INTO buildings (fakultas_id, building_name, floor) VALUES
(1, 'Gedung Teknik Utama', 5),
(1, 'Laboratorium Teknik', 3),
(2, 'Gedung Komputer Pusat', 6),
(2, 'Lab Programming Center', 4),
(3, 'Gedung FEB A', 4),
(3, 'Gedung FEB B', 3),
(4, 'Gedung Hukum Utama', 4),
(5, 'Gedung Medical Center', 8);

-- =====================================
-- SEED DATA: rooms
-- =====================================
INSERT INTO rooms (room_id, building_id, floor, number, kapasitas, deskripsi, foto) VALUES
('R001', 1, 1, 101, 40, 'Ruang kelas dasar teknik', 'room101.jpg'),
('R002', 1, 2, 201, 35, 'Ruang seminar teknik', 'room201.jpg'),
('R003', 2, 1, 102, 25, 'Lab praktikum mesin', 'lab102.jpg'),
('R004', 3, 2, 202, 50, 'Lab komputer AI', 'lab202.jpg'),
('R005', 3, 3, 301, 45, 'Lab jaringan komputer', 'lab301.jpg'),
('R006', 4, 1, 103, 30, 'Lab coding dasar', 'lab103.jpg'),
('R007', 5, 2, 204, 60, 'Ruang konferensi bisnis', 'biz204.jpg'),
('R008', 6, 1, 105, 55, 'Ruang akuntansi', 'acc105.jpg'),
('R009', 7, 3, 303, 70, 'Ruang sidang hukum', 'law303.jpg'),
('R010', 8, 4, 401, 80, 'Ruang seminar kedokteran', 'med401.jpg');

-- =====================================
-- SEED DATA: schedules
-- =====================================
INSERT INTO schedules (room_id, user_id, schedule_name, tanggal_dimulai, tanggal_selesai) VALUES
('R001', 'USR001', 'Kuliah Algoritma', '2026-05-10 08:00:00', '2026-05-10 10:00:00'),
('R002', 'USR002', 'Seminar Robotika', '2026-05-10 13:00:00', '2026-05-10 15:00:00'),
('R004', 'USR001', 'Workshop AI', '2026-05-11 09:00:00', '2026-05-11 12:00:00'),
('R005', 'USR003', 'Pelatihan Cisco', '2026-05-11 13:00:00', '2026-05-11 16:00:00'),
('R007', 'USR005', 'Seminar Bisnis Digital', '2026-05-12 10:00:00', '2026-05-12 12:00:00'),
('R009', 'USR004', 'Moot Court Practice', '2026-05-13 08:00:00', '2026-05-13 11:00:00'),
('R010', 'USR005', 'Seminar Kesehatan', '2026-05-14 09:00:00', '2026-05-14 12:00:00');

-- =====================================
-- SEED DATA: peminjaman
-- =====================================
INSERT INTO peminjaman (
    room_id,
    user_id,
    nama_kegiatan,
    tanggal_dimulai,
    tanggal_selesai,
    deskripsi,
    jumlah_peserta,
    dokumen,
    status
) VALUES
('R001', 'USR001', 'Belajar Kelompok TI', '2026-05-15 08:00:00', '2026-05-15 11:00:00', 'Diskusi proyek basis data', 20, 'proposal_kelompok.pdf', 'approved'),
('R004', 'USR002', 'Hackathon Kampus', '2026-05-16 08:00:00', '2026-05-16 18:00:00', 'Kompetisi coding mahasiswa', 45, 'hackathon.pdf', 'pending'),
('R007', 'USR005', 'Seminar Startup', '2026-05-17 09:00:00', '2026-05-17 13:00:00', 'Pembahasan startup digital', 50, 'startup.docx', 'approved'),
('R009', 'USR004', 'Simulasi Sidang', '2026-05-18 10:00:00', '2026-05-18 14:00:00', 'Latihan sidang mahasiswa hukum', 60, 'sidang.pdf', 'pending'),
('R010', 'USR003', 'Penyuluhan Kesehatan', '2026-05-19 08:00:00', '2026-05-19 12:00:00', 'Kegiatan kesehatan masyarakat', 75, 'health.pdf', 'approved');