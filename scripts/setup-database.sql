-- Buat database
CREATE DATABASE IF NOT EXISTS script_gratis;
USE script_gratis;

-- Buat table scripts
CREATE TABLE IF NOT EXISTS scripts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category ENUM('UI', 'SFX', 'Special') NOT NULL,
  thumbnail TEXT,
  download_url TEXT NOT NULL,
  downloads INT DEFAULT 0,
  is_popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert data awal
INSERT INTO scripts (title, category, thumbnail, download_url, downloads, is_popular) VALUES
('Modern Login Form UI', 'UI', '/placeholder.svg?height=200&width=300', 'https://example.com/script1.zip', 1250, TRUE),
('Button Click Sound Effect', 'SFX', '/placeholder.svg?height=200&width=300', 'https://example.com/script2.zip', 890, FALSE),
('Particle Animation System', 'Special', '/placeholder.svg?height=200&width=300', 'https://example.com/script3.zip', 2100, TRUE),
('Dashboard Template', 'UI', '/placeholder.svg?height=200&width=300', 'https://example.com/script4.zip', 1680, TRUE),
('Notification Sound Pack', 'SFX', '/placeholder.svg?height=200&width=300', 'https://example.com/script5.zip', 750, FALSE),
('Loading Spinner Collection', 'Special', '/placeholder.svg?height=200&width=300', 'https://example.com/script6.zip', 1420, FALSE);

-- Index untuk performa
CREATE INDEX idx_scripts_category ON scripts(category);
CREATE INDEX idx_scripts_popular ON scripts(is_popular);
CREATE INDEX idx_scripts_created_at ON scripts(created_at DESC);
