-- =====================================
-- TABLE: fakultas
-- =====================================
CREATE TABLE fakultas (
    fakultas_id SERIAL PRIMARY KEY,
    fakultas_name VARCHAR(100) NOT NULL,
    lokasi VARCHAR(255)
);

-- =====================================
-- TABLE: users
-- =====================================
CREATE TABLE users (
    user_id VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- =====================================
-- TABLE: profiles
-- =====================================
CREATE TABLE profiles (
    user_id VARCHAR(50) PRIMARY KEY,
    jurusan VARCHAR(100),
    angkatan VARCHAR(20),
    CONSTRAINT fk_profile_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =====================================
-- TABLE: admin_fakultas
-- Helper table untuk admin fakultas
-- Satu user admin hanya terhubung ke satu fakultas
-- =====================================
CREATE TABLE admin_fakultas (
    user_id VARCHAR(50) PRIMARY KEY,
    fakultas_id INT NOT NULL,
    CONSTRAINT fk_admin_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_admin_fakultas
        FOREIGN KEY (fakultas_id)
        REFERENCES fakultas(fakultas_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =====================================
-- TABLE: buildings
-- =====================================
CREATE TABLE buildings (
    building_id SERIAL PRIMARY KEY,
    fakultas_id INT NOT NULL,
    building_name VARCHAR(100) NOT NULL,
    floor INT NOT NULL,
    CONSTRAINT fk_building_fakultas
        FOREIGN KEY (fakultas_id)
        REFERENCES fakultas(fakultas_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =====================================
-- TABLE: rooms
-- =====================================
CREATE TABLE rooms (
    room_id VARCHAR(50) PRIMARY KEY,
    building_id INT NOT NULL,
    floor INT NOT NULL,
    number INT NOT NULL,
    kapasitas INT NOT NULL,
    deskripsi TEXT,
    foto TEXT,
    CONSTRAINT fk_room_building
        FOREIGN KEY (building_id)
        REFERENCES buildings(building_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =====================================
-- TABLE: schedules
-- =====================================
CREATE TABLE schedules (
    schedule_id SERIAL PRIMARY KEY,
    room_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    schedule_name VARCHAR(150) NOT NULL,
    tanggal_dimulai TIMESTAMP NOT NULL,
    tanggal_selesai TIMESTAMP NOT NULL,
    CONSTRAINT fk_schedule_room
        FOREIGN KEY (room_id)
        REFERENCES rooms(room_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_schedule_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =====================================
-- TABLE: peminjaman
-- =====================================
CREATE TABLE peminjaman (
    peminjaman_id SERIAL PRIMARY KEY,
    room_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    nama_kegiatan VARCHAR(150) NOT NULL,
    tanggal_dimulai TIMESTAMP NOT NULL,
    tanggal_selesai TIMESTAMP NOT NULL,
    deskripsi TEXT,
    jumlah_peserta INT,
    dokumen TEXT,
    status VARCHAR(50) DEFAULT 'menunggu',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT fk_peminjaman_room
        FOREIGN KEY (room_id)
        REFERENCES rooms(room_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_peminjaman_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);