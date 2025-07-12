-- Pastikan menggunakan database yang benar
USE script_gratis;

-- Buat tabel untuk settings website
CREATE TABLE IF NOT EXISTS website_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default logo setting
INSERT INTO website_settings (setting_key, setting_value) VALUES 
('site_logo', '/placeholder.svg?height=40&width=40')
ON DUPLICATE KEY UPDATE setting_value = setting_value;

-- Insert default site name
INSERT INTO website_settings (setting_key, setting_value) VALUES 
('site_name', 'Script Gratis')
ON DUPLICATE KEY UPDATE setting_value = setting_value;

-- Tambahkan setting untuk background image setelah site_name
INSERT INTO website_settings (setting_key, setting_value) VALUES 
('site_background', '')
ON DUPLICATE KEY UPDATE setting_value = setting_value;

-- Tambahkan setting untuk background overlay opacity
INSERT INTO website_settings (setting_key, setting_value) VALUES 
('background_overlay_opacity', '0.7')
ON DUPLICATE KEY UPDATE setting_value = setting_value;

-- Tambahkan setting untuk enable/disable parallax
INSERT INTO website_settings (setting_key, setting_value) VALUES 
('enable_parallax', 'true')
ON DUPLICATE KEY UPDATE setting_value = setting_value;

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_website_settings_key ON website_settings(setting_key);

-- Tampilkan hasil
SELECT 'Website settings table created successfully!' as status;
SELECT * FROM website_settings;
