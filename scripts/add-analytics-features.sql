-- Tambah kolom baru untuk analytics
ALTER TABLE scripts 
ADD COLUMN views INT DEFAULT 0 AFTER downloads,
ADD COLUMN rating DECIMAL(3,2) DEFAULT 0.00 AFTER views,
ADD COLUMN rating_count INT DEFAULT 0 AFTER rating,
ADD COLUMN file_size_mb DECIMAL(10,2) DEFAULT 0.00 AFTER rating_count,
ADD COLUMN tags JSON AFTER file_size_mb;

-- Update data yang sudah ada dengan nilai random untuk demo
UPDATE scripts SET 
  views = FLOOR(RAND() * 5000) + downloads,
  rating = ROUND(3.5 + (RAND() * 1.5), 2),
  rating_count = FLOOR(RAND() * 100) + 10,
  file_size_mb = ROUND(0.5 + (RAND() * 50), 2),
  tags = JSON_ARRAY(
    CASE 
      WHEN category = 'UI' THEN 'responsive'
      WHEN category = 'SFX' THEN 'high-quality'
      ELSE 'animation'
    END,
    'free',
    'popular'
  );

-- Buat tabel untuk analytics summary
CREATE TABLE IF NOT EXISTS analytics_summary (
  id INT AUTO_INCREMENT PRIMARY KEY,
  total_scripts INT DEFAULT 0,
  total_downloads INT DEFAULT 0,
  total_views INT DEFAULT 0,
  avg_rating DECIMAL(3,2) DEFAULT 0.00,
  most_popular_category VARCHAR(50),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Buat tabel untuk daily stats
CREATE TABLE IF NOT EXISTS daily_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  new_scripts INT DEFAULT 0,
  total_downloads INT DEFAULT 0,
  total_views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial analytics summary
INSERT INTO analytics_summary (
  total_scripts,
  total_downloads, 
  total_views,
  avg_rating,
  most_popular_category
) VALUES (
  (SELECT COUNT(*) FROM scripts),
  (SELECT SUM(downloads) FROM scripts),
  (SELECT SUM(views) FROM scripts),
  (SELECT AVG(rating) FROM scripts),
  (SELECT category FROM scripts GROUP BY category ORDER BY COUNT(*) DESC LIMIT 1)
);

-- Insert today's stats
INSERT INTO daily_stats (date, new_scripts, total_downloads, total_views) 
VALUES (
  CURDATE(),
  (SELECT COUNT(*) FROM scripts WHERE DATE(created_at) = CURDATE()),
  (SELECT SUM(downloads) FROM scripts),
  (SELECT SUM(views) FROM scripts)
) ON DUPLICATE KEY UPDATE
  total_downloads = VALUES(total_downloads),
  total_views = VALUES(total_views);

-- Stored Procedure untuk update analytics
DELIMITER //
CREATE PROCEDURE UpdateAnalyticsSummary()
BEGIN
    UPDATE analytics_summary SET
        total_scripts = (SELECT COUNT(*) FROM scripts),
        total_downloads = (SELECT SUM(downloads) FROM scripts),
        total_views = (SELECT SUM(views) FROM scripts),
        avg_rating = (SELECT AVG(rating) FROM scripts),
        most_popular_category = (
            SELECT category 
            FROM scripts 
            GROUP BY category 
            ORDER BY SUM(downloads + views) DESC 
            LIMIT 1
        ),
        last_updated = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- Function untuk mendapatkan popularity score
DELIMITER //
CREATE FUNCTION GetPopularityScore(script_downloads INT, script_views INT, script_rating DECIMAL(3,2))
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE popularity_score DECIMAL(10,2);
    SET popularity_score = (script_downloads * 2) + script_views + (script_rating * 100);
    RETURN popularity_score;
END //
DELIMITER ;

-- View untuk script statistics
CREATE VIEW script_stats AS
SELECT 
    s.*,
    GetPopularityScore(s.downloads, s.views, s.rating) as popularity_score,
    CASE 
        WHEN s.downloads > (SELECT AVG(downloads) FROM scripts) THEN 'High'
        WHEN s.downloads > (SELECT AVG(downloads) FROM scripts) * 0.5 THEN 'Medium'
        ELSE 'Low'
    END as download_performance,
    DATEDIFF(CURRENT_DATE, DATE(s.created_at)) as days_since_created
FROM scripts s;

-- View untuk category analytics
CREATE VIEW category_analytics AS
SELECT 
    category,
    COUNT(*) as total_scripts,
    SUM(downloads) as total_downloads,
    SUM(views) as total_views,
    AVG(rating) as avg_rating,
    AVG(GetPopularityScore(downloads, views, rating)) as avg_popularity_score,
    MAX(downloads) as max_downloads,
    MIN(downloads) as min_downloads
FROM scripts 
GROUP BY category;

-- Trigger untuk auto-update analytics saat ada perubahan
DELIMITER //
CREATE TRIGGER update_analytics_after_script_change
AFTER UPDATE ON scripts
FOR EACH ROW
BEGIN
    CALL UpdateAnalyticsSummary();
    
    -- Update daily stats
    INSERT INTO daily_stats (date, total_downloads, total_views) 
    VALUES (CURDATE(), 
            (SELECT SUM(downloads) FROM scripts),
            (SELECT SUM(views) FROM scripts))
    ON DUPLICATE KEY UPDATE
        total_downloads = VALUES(total_downloads),
        total_views = VALUES(total_views);
END //
DELIMITER ;

-- Index untuk performa query analytics
CREATE INDEX idx_scripts_rating ON scripts(rating DESC);
CREATE INDEX idx_scripts_views ON scripts(views DESC);
CREATE INDEX idx_scripts_popularity ON scripts((downloads * 2 + views));
CREATE INDEX idx_daily_stats_date ON daily_stats(date DESC);
