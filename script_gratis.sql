-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 12, 2025 at 01:21 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `script_gratis`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateAnalyticsSummary` ()   BEGIN
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
END$$

--
-- Functions
--
CREATE DEFINER=`root`@`localhost` FUNCTION `GetPopularityScore` (`script_downloads` INT, `script_views` INT, `script_rating` DECIMAL(3,2)) RETURNS DECIMAL(10,2) DETERMINISTIC READS SQL DATA BEGIN
    DECLARE popularity_score DECIMAL(10,2);
    SET popularity_score = (script_downloads * 2) + script_views + (script_rating * 100);
    RETURN popularity_score;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `analytics_summary`
--

CREATE TABLE `analytics_summary` (
  `id` int(11) NOT NULL,
  `total_scripts` int(11) DEFAULT 0,
  `total_downloads` int(11) DEFAULT 0,
  `total_views` int(11) DEFAULT 0,
  `avg_rating` decimal(3,2) DEFAULT 0.00,
  `most_popular_category` varchar(50) DEFAULT NULL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `analytics_summary`
--

INSERT INTO `analytics_summary` (`id`, `total_scripts`, `total_downloads`, `total_views`, `avg_rating`, `most_popular_category`, `last_updated`) VALUES
(1, 2, 0, 0, 0.00, 'UI', '2025-07-12 09:50:51');

-- --------------------------------------------------------

--
-- Stand-in structure for view `category_analytics`
-- (See below for the actual view)
--
CREATE TABLE `category_analytics` (
`category` enum('UI','SFX','Special')
,`total_scripts` bigint(21)
,`total_downloads` decimal(32,0)
,`total_views` decimal(32,0)
,`avg_rating` decimal(7,6)
,`avg_popularity_score` decimal(14,6)
,`max_downloads` int(11)
,`min_downloads` int(11)
);

-- --------------------------------------------------------

--
-- Table structure for table `daily_stats`
--

CREATE TABLE `daily_stats` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `new_scripts` int(11) DEFAULT 0,
  `total_downloads` int(11) DEFAULT 0,
  `total_views` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `daily_stats`
--

INSERT INTO `daily_stats` (`id`, `date`, `new_scripts`, `total_downloads`, `total_views`, `created_at`) VALUES
(1, '2025-07-04', 6, 2, 0, '2025-07-03 21:06:41'),
(5, '2025-07-12', 0, 0, 0, '2025-07-12 09:43:59');

-- --------------------------------------------------------

--
-- Table structure for table `scripts`
--

CREATE TABLE `scripts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` enum('UI','SFX','Special') NOT NULL,
  `thumbnail` text DEFAULT NULL,
  `download_url` text NOT NULL,
  `downloads` int(11) DEFAULT 0,
  `views` int(11) DEFAULT 0,
  `rating` decimal(3,2) DEFAULT 0.00,
  `rating_count` int(11) DEFAULT 0,
  `file_size_mb` decimal(10,2) DEFAULT 0.00,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `is_popular` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scripts`
--

INSERT INTO `scripts` (`id`, `title`, `category`, `thumbnail`, `download_url`, `downloads`, `views`, `rating`, `rating_count`, `file_size_mb`, `tags`, `is_popular`, `created_at`, `updated_at`) VALUES
(8, 'Ganti nama', 'UI', 'https://i.imgur.com/0lJKoxG.png', 'https://i.imgur.com/0lJKoxG.png', 0, 0, 0.00, 0, 0.00, '[]', 0, '2025-07-12 09:00:36', '2025-07-12 09:43:59'),
(9, 'Ganti Nama 2', 'SFX', 'https://i.imgur.com/0lJKoxG.png', 'https://i.imgur.com/0lJKoxG.png', 0, 0, 0.00, 0, 0.00, '[]', 0, '2025-07-12 09:50:13', '2025-07-12 09:50:51');

--
-- Triggers `scripts`
--
DELIMITER $$
CREATE TRIGGER `update_analytics_after_script_change` AFTER UPDATE ON `scripts` FOR EACH ROW BEGIN
    CALL UpdateAnalyticsSummary();
    
    -- Update daily stats
    INSERT INTO daily_stats (date, total_downloads, total_views) 
    VALUES (CURDATE(), 
            (SELECT SUM(downloads) FROM scripts),
            (SELECT SUM(views) FROM scripts))
    ON DUPLICATE KEY UPDATE
        total_downloads = VALUES(total_downloads),
        total_views = VALUES(total_views);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `script_stats`
-- (See below for the actual view)
--
CREATE TABLE `script_stats` (
`id` int(11)
,`title` varchar(255)
,`category` enum('UI','SFX','Special')
,`thumbnail` text
,`download_url` text
,`downloads` int(11)
,`views` int(11)
,`rating` decimal(3,2)
,`rating_count` int(11)
,`file_size_mb` decimal(10,2)
,`tags` longtext
,`is_popular` tinyint(1)
,`created_at` timestamp
,`updated_at` timestamp
,`popularity_score` decimal(10,2)
,`download_performance` varchar(6)
,`days_since_created` int(7)
);

-- --------------------------------------------------------

--
-- Table structure for table `website_settings`
--

CREATE TABLE `website_settings` (
  `id` int(11) NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `website_settings`
--

INSERT INTO `website_settings` (`id`, `setting_key`, `setting_value`, `created_at`, `updated_at`) VALUES
(1, 'site_logo', 'https://i.imgur.com/8fYOFN3.png', '2025-07-05 07:00:26', '2025-07-12 09:42:18'),
(2, 'site_name', 'Contoh Website', '2025-07-05 07:00:26', '2025-07-12 09:40:54'),
(7, 'enable_parallax', 'true', '2025-07-05 07:51:34', '2025-07-07 04:22:43'),
(8, 'site_background', 'https://i.imgur.com/0lJKoxG.png', '2025-07-05 07:55:39', '2025-07-12 09:01:58'),
(10, 'background_overlay_opacity', '0.25', '2025-07-05 07:58:38', '2025-07-05 08:54:15');

-- --------------------------------------------------------

--
-- Structure for view `category_analytics`
--
DROP TABLE IF EXISTS `category_analytics`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `category_analytics`  AS SELECT `scripts`.`category` AS `category`, count(0) AS `total_scripts`, sum(`scripts`.`downloads`) AS `total_downloads`, sum(`scripts`.`views`) AS `total_views`, avg(`scripts`.`rating`) AS `avg_rating`, avg(`GetPopularityScore`(`scripts`.`downloads`,`scripts`.`views`,`scripts`.`rating`)) AS `avg_popularity_score`, max(`scripts`.`downloads`) AS `max_downloads`, min(`scripts`.`downloads`) AS `min_downloads` FROM `scripts` GROUP BY `scripts`.`category` ;

-- --------------------------------------------------------

--
-- Structure for view `script_stats`
--
DROP TABLE IF EXISTS `script_stats`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `script_stats`  AS SELECT `s`.`id` AS `id`, `s`.`title` AS `title`, `s`.`category` AS `category`, `s`.`thumbnail` AS `thumbnail`, `s`.`download_url` AS `download_url`, `s`.`downloads` AS `downloads`, `s`.`views` AS `views`, `s`.`rating` AS `rating`, `s`.`rating_count` AS `rating_count`, `s`.`file_size_mb` AS `file_size_mb`, `s`.`tags` AS `tags`, `s`.`is_popular` AS `is_popular`, `s`.`created_at` AS `created_at`, `s`.`updated_at` AS `updated_at`, `GetPopularityScore`(`s`.`downloads`,`s`.`views`,`s`.`rating`) AS `popularity_score`, CASE WHEN `s`.`downloads` > (select avg(`scripts`.`downloads`) from `scripts`) THEN 'High' WHEN `s`.`downloads` > (select avg(`scripts`.`downloads`) from `scripts`) * 0.5 THEN 'Medium' ELSE 'Low' END AS `download_performance`, to_days(curdate()) - to_days(cast(`s`.`created_at` as date)) AS `days_since_created` FROM `scripts` AS `s` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `analytics_summary`
--
ALTER TABLE `analytics_summary`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `daily_stats`
--
ALTER TABLE `daily_stats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `date` (`date`);

--
-- Indexes for table `scripts`
--
ALTER TABLE `scripts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_scripts_category` (`category`),
  ADD KEY `idx_scripts_popular` (`is_popular`),
  ADD KEY `idx_scripts_created_at` (`created_at`),
  ADD KEY `idx_scripts_rating` (`rating`),
  ADD KEY `idx_scripts_views` (`views`);

--
-- Indexes for table `website_settings`
--
ALTER TABLE `website_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`),
  ADD KEY `idx_website_settings_key` (`setting_key`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `analytics_summary`
--
ALTER TABLE `analytics_summary`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `daily_stats`
--
ALTER TABLE `daily_stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `scripts`
--
ALTER TABLE `scripts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `website_settings`
--
ALTER TABLE `website_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
