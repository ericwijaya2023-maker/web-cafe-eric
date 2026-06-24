-- Database: web_cafe_eric
-- MariaDB SQL Dump

CREATE DATABASE IF NOT EXISTS web_cafe_eric;
USE web_cafe_eric;

-- Table users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('kasir', 'admin', 'developer') NOT NULL,
  nama VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- Table menu
CREATE TABLE IF NOT EXISTS menu (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  kategori ENUM('makanan', 'minuman') NOT NULL,
  harga DECIMAL(10,2) NOT NULL,
  gambar VARCHAR(255) DEFAULT NULL,
  deskripsi TEXT DEFAULT NULL,
  status ENUM('tersedia', 'habis') DEFAULT 'tersedia',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- Table orders
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  no_meja VARCHAR(10) DEFAULT NULL,
  tipe ENUM('dine_in', 'take_away') NOT NULL DEFAULT 'dine_in',
  status ENUM('pending', 'diproses', 'selesai', 'dibayar') DEFAULT 'pending',
  total DECIMAL(10,2) DEFAULT 0,
  user_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- Table order_items
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  menu_id INT NOT NULL,
  qty INT NOT NULL DEFAULT 1,
  harga DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- Table payments
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL UNIQUE,
  metode ENUM('tunai', 'non_tunai') NOT NULL,
  jumlah_bayar DECIMAL(10,2) NOT NULL,
  kembalian DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- Seed data: Password menggunakan bcrypt dari 'password123'
INSERT INTO users (username, password, role, nama) VALUES
('admin', '$2b$10$uYjqVVzAbitUoan0th3l/eehiNhdWLUKi3MRXyUi7k4olGn.0XYnO', 'admin', 'Admin Cafe'),
('kasir1', '$2b$10$uYjqVVzAbitUoan0th3l/eehiNhdWLUKi3MRXyUi7k4olGn.0XYnO', 'kasir', 'Kasir Satu'),
('developer', '$2b$10$uYjqVVzAbitUoan0th3l/eehiNhdWLUKi3MRXyUi7k4olGn.0XYnO', 'developer', 'Developer');

-- Seed menu data
INSERT INTO menu (nama, kategori, harga, deskripsi, gambar, status) VALUES
('Kopi Hitam', 'minuman', 15000, 'Kopi hitam pilihan dengan rasa autentik', '/images/menu/kopi-hitam.svg', 'tersedia'),
('Cafe Latte', 'minuman', 25000, 'Espresso dengan susu steamed creamy', '/images/menu/cafe-latte.svg', 'tersedia'),
('Matcha Latte', 'minuman', 28000, 'Matcha premium dengan susu segar', '/images/menu/matcha-latte.svg', 'tersedia'),
('Jus Jeruk', 'minuman', 18000, 'Jeruk segar diperas langsung', '/images/menu/jus-jeruk.svg', 'tersedia'),
('Nasi Goreng', 'makanan', 35000, 'Nasi goreng spesial dengan telur', '/images/menu/nasi-goreng.svg', 'tersedia'),
('Mie Goreng', 'makanan', 30000, 'Mie goreng dengan sayuran segar', '/images/menu/mie-goreng.svg', 'tersedia'),
('Chicken Katsu', 'makanan', 38000, 'Ayam katsu crispy dengan saus spesial', '/images/menu/chicken-katsu.svg', 'tersedia'),
('French Fries', 'makanan', 20000, 'Kentang goreng renyah', '/images/menu/french-fries.svg', 'tersedia'),
('Spaghetti Bolognese', 'makanan', 42000, 'Spaghetti dengan saus daging sapi', '/images/menu/spaghetti.svg', 'tersedia'),
('Mango Smoothie', 'minuman', 30000, 'Smoothie mangga segar dengan yogurt', '/images/menu/mango-smoothie.svg', 'tersedia'),
('Croissant', 'makanan', 22000, 'Croissant pastry butter Prancis', '/images/menu/croissant.svg', 'tersedia'),
('Espresso', 'minuman', 18000, 'Espresso shot double', '/images/menu/espresso.svg', 'tersedia');
