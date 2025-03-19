-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 17, 2024 at 09:24 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rent-car`
--

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `logo_url` varchar(250) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `logo_url`, `created_at`, `updated_at`) VALUES
(1, 'Toyota', '/uploads/brands/logo-1733826699904-150315689.png', '2024-11-19 15:40:05', '2024-12-10 10:31:39'),
(2, 'Honda', '/uploads/brands/logo-1733826639544-824518576.png', '2024-11-19 15:40:05', '2024-12-10 10:30:39'),
(3, 'BMW', '/uploads/brands/logo-1733826579724-567418146.png', '2024-11-19 15:40:05', '2024-12-10 10:29:39'),
(4, 'Mercedes', '/uploads/brands/logo-1733826518788-383065622.png', '2024-11-19 15:40:05', '2024-12-10 10:28:38'),
(5, 'Audi', '/uploads/brands/logo-1733826480844-583209384.jpg', '2024-11-19 15:40:05', '2024-12-10 10:28:00'),
(6, 'Ford', '/uploads/brands/logo-1733826382325-629689794.png', '2024-11-19 15:40:05', '2024-12-10 10:26:22'),
(7, 'Tesla', '/uploads/brands/logo-1733826239419-826772353.png', '2024-11-19 15:40:05', '2024-12-10 10:23:59'),
(8, 'Porsche', '/uploads/brands/logo-1733826173222-645659393.png', '2024-11-19 15:40:05', '2024-12-10 10:22:53'),
(9, 'Lexus', '/uploads/brands/logo-1733826084061-352529288.png', '2024-11-19 15:40:05', '2024-12-10 10:21:24'),
(10, 'Volvo', '/uploads/brands/logo-1733826026239-452347583.png', '2024-11-19 15:40:05', '2024-12-10 10:20:26');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `vehicle_type_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `vehicle_type_id`, `name`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Economy', 'Budget-friendly vehicles', 'active', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(2, 7, 'Premium', 'High-end luxury vehicles', 'active', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(3, 2, 'Family', 'Spacious family-friendly vehicles', 'active', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(4, 1, 'Business', 'Professional transportation', 'active', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(5, 5, 'Adventure', 'Vehicles for outdoor activities', 'active', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(6, 8, 'Sports', 'Performance-oriented vehicles', 'active', '2024-11-19 15:40:05', '2024-11-19 15:40:05');

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` int(11) NOT NULL,
  `code` varchar(20) NOT NULL,
  `type` enum('percentage','fixed') NOT NULL DEFAULT 'percentage',
  `value` decimal(10,2) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `min_rental_days` int(11) NOT NULL DEFAULT 1,
  `max_rental_days` int(11) DEFAULT NULL,
  `usage_limit` int(11) NOT NULL DEFAULT 1,
  `used_count` int(11) NOT NULL DEFAULT 0,
  `vehicle_type_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `min_amount` decimal(10,2) DEFAULT NULL,
  `max_discount_amount` decimal(10,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive','expired') NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupons`
--

INSERT INTO `coupons` (`id`, `code`, `type`, `value`, `start_date`, `end_date`, `min_rental_days`, `max_rental_days`, `usage_limit`, `used_count`, `vehicle_type_id`, `category_id`, `brand_id`, `min_amount`, `max_discount_amount`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 'NEWUSER25', 'percentage', 25.00, '2024-11-19 15:40:05', '2025-02-19 15:40:05', 2, NULL, 100, 0, NULL, NULL, NULL, 100.00, 250.00, 'New user discount - 25% off your first rental', 'active', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(2, 'PREMIUM50', 'percentage', 50.00, '2024-11-19 15:40:05', '2025-02-19 15:40:05', 3, NULL, 50, 0, NULL, 2, NULL, 300.00, 500.00, '50% off premium vehicle rentals', 'active', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(3, 'SUMMER100', 'fixed', 100.00, '2024-11-19 15:40:05', '2025-02-19 15:40:05', 3, NULL, 200, 0, NULL, NULL, NULL, 200.00, NULL, 'Summer special - $100 off', 'active', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(4, 'FAMILY30', 'percentage', 30.00, '2024-11-19 15:40:05', '2025-02-19 15:40:05', 5, 15, 100, 0, NULL, 3, NULL, 250.00, 400.00, 'Family vacation discount - 30% off', 'active', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(5, 'BMW20', 'percentage', 20.00, '2024-11-19 15:40:05', '2025-02-19 15:40:05', 2, NULL, 75, 0, NULL, NULL, 3, 150.00, 300.00, '20% off BMW rentals', 'active', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(6, 'SUV35', 'percentage', 35.00, '2024-11-19 15:40:05', '2025-02-19 15:40:05', 3, NULL, 150, 0, 2, NULL, NULL, 200.00, 450.00, '35% off SUV rentals', 'active', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(7, 'ttt', 'fixed', 34.00, '2024-11-22 04:03:00', '2024-11-22 04:03:00', 1, NULL, 2, 0, NULL, NULL, NULL, 0.00, NULL, NULL, 'active', '2024-11-21 04:03:30', '2024-11-21 04:03:30'),
(9, 'uuuuu', 'fixed', 34.00, '2024-11-22 04:03:00', '2024-11-22 04:03:00', 1, NULL, 2, 0, NULL, NULL, NULL, 0.00, NULL, NULL, 'active', '2024-11-21 04:04:14', '2024-11-21 04:04:14'),
(10, 'ewrwer', 'fixed', 34.00, '2024-11-22 04:41:00', '2024-11-30 04:41:00', 1, NULL, 1, 0, 7, 5, 9, NULL, NULL, '', 'active', '2024-11-21 04:42:42', '2024-11-21 04:42:42'),
(13, 'Mos12', 'fixed', 34.00, '2024-11-27 04:41:00', '2024-12-04 04:41:00', 1, NULL, 1, 0, 7, 5, 9, NULL, NULL, '', 'active', '2024-11-21 04:57:53', '2024-11-21 04:57:53'),
(14, 'Mos123', 'fixed', 34.00, '2024-11-27 04:41:00', '2024-12-04 04:41:00', 1, NULL, 1, 0, 7, 5, 9, NULL, NULL, '', 'active', '2024-11-21 04:59:14', '2024-11-21 04:59:14');

-- --------------------------------------------------------

--
-- Table structure for table `features`
--

CREATE TABLE `features` (
  `id` int(11) NOT NULL,
  `vehicle_type_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `icon` varchar(250) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `features`
--

INSERT INTO `features` (`id`, `vehicle_type_id`, `name`, `icon`, `created_at`, `updated_at`) VALUES
(1, 1, 'Air Conditioning', 'fa-snowflake', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(2, 1, 'GPS Navigation', 'fa-map-marker', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(3, 1, 'Bluetooth', 'fa-bluetooth', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(4, 7, 'Leather Seats', 'fa-chair', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(5, 7, 'Sunroof', 'fa-sun', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(6, 1, 'Backup Camera', 'fa-camera', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(7, 2, 'Third Row Seating', 'fa-users', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(8, 2, 'Roof Rack', 'fa-luggage-cart', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(9, 7, 'Premium Audio', 'fa-music', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(10, 1, 'Keyless Entry', 'fa-key', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(11, 1, 'Cruise Control', 'fa-tachometer-alt', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(12, 7, 'Lane Departure Warning', 'fa-road', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(13, 7, 'Blind Spot Monitor', 'fa-eye', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(14, 1, 'Apple CarPlay', 'fa-apple', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(15, 1, 'Android Auto', 'fa-android', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(16, 5, 'hhhh', '/uploads/features/icon-1732156608039-245041889.png', '2024-11-20 12:14:41', '2024-11-21 02:36:48');

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `size` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `display` tinyint(1) DEFAULT 1,
  `icon` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `my_fields`
--

CREATE TABLE `my_fields` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `custom_fields` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`custom_fields`)),
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `my_fields`
--

INSERT INTO `my_fields` (`id`, `name`, `custom_fields`, `user_id`, `created_at`, `updated_at`) VALUES
(2, 'hero_section', '\"[{\\\"key\\\":\\\"title1\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Your Journey Begins\\\"},{\\\"key\\\":\\\"title2\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"With The Perfect Car\\\"},{\\\"key\\\":\\\"description\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Discover our premium selection of vehicles. From luxury to economy, find your perfect ride for any occasion.\\\"},{\\\"key\\\":\\\"browse_button_text\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Browse Available Cars\\\"},{\\\"key\\\":\\\"browse_button_url\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"/vehicles\\\"},{\\\"key\\\":\\\"total_cars\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"1000+\\\"},{\\\"key\\\":\\\"happy_customers\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"10,000+\\\"},{\\\"key\\\":\\\"client_rating\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"4.8/5\\\"}]\"', NULL, '2024-12-09 03:49:30', '2024-12-09 03:49:30'),
(3, 'vehicle_features', '\"[{\\\"key\\\":\\\"icon\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Car\\\"},{\\\"key\\\":\\\"title\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Wide Selection\\\"},{\\\"key\\\":\\\"description\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Choose from our extensive fleet of vehicles for any occasion\\\"},{\\\"key\\\":\\\"color\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"bg-blue-50\\\"},{\\\"key\\\":\\\"iconColor\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"text-blue-500\\\"}]\"', NULL, '2024-12-09 04:05:39', '2024-12-09 04:05:39'),
(4, 'vehicle_features', '\"[{\\\"key\\\":\\\"icon\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Shield\\\"},{\\\"key\\\":\\\"title\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Safe & Secure\\\"},{\\\"key\\\":\\\"description\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"All vehicles are regularly maintained and fully insured\\\"},{\\\"key\\\":\\\"color\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"bg-green-50\\\"},{\\\"key\\\":\\\"iconColor\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"text-green-500\\\"}]\"', NULL, '2024-12-09 04:07:29', '2024-12-09 04:07:29'),
(5, 'vehicle_features', '\"[{\\\"key\\\":\\\"icon\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Clock\\\"},{\\\"key\\\":\\\"title\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"24/7 Support\\\"},{\\\"key\\\":\\\"description\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Round-the-clock customer service for peace of mind\\\"},{\\\"key\\\":\\\"color\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"bg-red-50\\\"},{\\\"key\\\":\\\"iconColor\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"text-red-500\\\"}]\"', NULL, '2024-12-09 04:09:08', '2024-12-09 04:09:08'),
(6, 'vehicle_features', '\"[{\\\"key\\\":\\\"icon\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Star\\\"},{\\\"key\\\":\\\"title\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Top Rated Service\\\"},{\\\"key\\\":\\\"description\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Consistently rated 5 stars by our satisfied customers\\\"},{\\\"key\\\":\\\"color\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"bg-red-50\\\"},{\\\"key\\\":\\\"iconColor\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"text-red-500\\\"}]\"', NULL, '2024-12-09 04:11:19', '2024-12-09 04:11:19'),
(7, 'vehicle_features', '\"[{\\\"key\\\":\\\"icon\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Wallet\\\"},{\\\"key\\\":\\\"title\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Best Price Guarantee\\\"},{\\\"key\\\":\\\"description\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Competitive rates with no hidden fees or charges\\\"},{\\\"key\\\":\\\"color\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"bg-yellow-50\\\"},{\\\"key\\\":\\\"iconColor\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"text-yellow-500\\\"}]\"', NULL, '2024-12-09 04:12:19', '2024-12-09 04:12:19'),
(8, 'vehicle_features', '\"[{\\\"key\\\":\\\"icon\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Award\\\"},{\\\"key\\\":\\\"title\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Premium Quality\\\"},{\\\"key\\\":\\\"description\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Luxury and comfort guaranteed with every rental\\\"},{\\\"key\\\":\\\"color\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"bg-indigo-50\\\"},{\\\"key\\\":\\\"iconColor\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"text-indigo-500\\\"}]\"', NULL, '2024-12-09 04:13:23', '2024-12-09 04:13:23'),
(9, 'popular_vehicles', '\"[{\\\"key\\\":\\\"id\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"name\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Tesla Model S\\\"},{\\\"key\\\":\\\"category\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Electric\\\"},{\\\"key\\\":\\\"price\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"199\\\"},{\\\"key\\\":\\\"rating\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"4.9\\\"},{\\\"key\\\":\\\"image\\\",\\\"type\\\":\\\"image\\\",\\\"imagePath\\\":\\\"custom/customFields[5][image]-1733718220191-932280579.webp\\\"}]\"', NULL, '2024-12-09 04:23:40', '2024-12-09 04:23:40'),
(10, 'popular_vehicles', '\"[{\\\"key\\\":\\\"id\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"name\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"BMW 7 Series\\\"},{\\\"key\\\":\\\"category\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Luxury\\\"},{\\\"key\\\":\\\"price\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"299\\\"},{\\\"key\\\":\\\"rating\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"4.8\\\"},{\\\"key\\\":\\\"image\\\",\\\"type\\\":\\\"image\\\",\\\"imagePath\\\":\\\"custom/customFields[5][image]-1733718427953-223241542.avif\\\"}]\"', NULL, '2024-12-09 04:27:07', '2024-12-09 04:27:07'),
(11, 'popular_vehicles', '\"[{\\\"key\\\":\\\"id\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"name\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Range Rover Sport\\\"},{\\\"key\\\":\\\"category\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"SUV\\\"},{\\\"key\\\":\\\"price\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"249\\\"},{\\\"key\\\":\\\"rating\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"4.7\\\"},{\\\"key\\\":\\\"image\\\",\\\"type\\\":\\\"image\\\",\\\"imagePath\\\":\\\"custom/customFields[5][image]-1733718910268-535626631.avif\\\"}]\"', NULL, '2024-12-09 04:33:13', '2024-12-09 04:35:10'),
(12, 'testimonials', '\"[{\\\"key\\\":\\\"id\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"name\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Sarah Johnson\\\"},{\\\"key\\\":\\\"role\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Business Executive\\\"},{\\\"key\\\":\\\"image\\\",\\\"type\\\":\\\"image\\\",\\\"imagePath\\\":\\\"custom/customFields[3][image]-1733722473947-42156568.avif\\\"},{\\\"key\\\":\\\"quote\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"The service was exceptional! The car was in perfect condition and the rental process was smooth and hassle-free.\\\"},{\\\"key\\\":\\\"rating\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"5\\\"}]\"', NULL, '2024-12-09 05:34:33', '2024-12-09 05:34:33'),
(13, 'testimonials', '\"[{\\\"key\\\":\\\"id\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"name\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Michael Chen\\\"},{\\\"key\\\":\\\"role\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Travel Blogger\\\"},{\\\"key\\\":\\\"image\\\",\\\"type\\\":\\\"image\\\",\\\"imagePath\\\":\\\"custom/customFields[3][image]-1733722572218-750082644.avif\\\"},{\\\"key\\\":\\\"quote\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Best car rental experience I\'ve had. The vehicle selection is amazing and the staff is incredibly helpful.\\\"},{\\\"key\\\":\\\"rating\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"5\\\"}]\"', NULL, '2024-12-09 05:36:12', '2024-12-09 05:36:12'),
(14, 'testimonials', '\"[{\\\"key\\\":\\\"id\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"name\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Emma Davis\\\"},{\\\"key\\\":\\\"role\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Photographer\\\"},{\\\"key\\\":\\\"image\\\",\\\"type\\\":\\\"image\\\",\\\"imagePath\\\":\\\"custom/customFields[3][image]-1733722687425-757906918.avif\\\"},{\\\"key\\\":\\\"quote\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Fantastic service and beautiful cars. Made my vacation even more special with their premium vehicle selection.\\\"},{\\\"key\\\":\\\"rating\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"5\\\"}]\"', NULL, '2024-12-09 05:38:07', '2024-12-09 05:38:07'),
(15, 'cta_section', '\"[{\\\"key\\\":\\\"title\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Ready to Start Your Journey?\\\"},{\\\"key\\\":\\\"description\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Experience the freedom of premium car rental services. Book your perfect ride today!\\\"},{\\\"key\\\":\\\"browse_button_text\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Browse Vehicles\\\"},{\\\"key\\\":\\\"browse_button_url\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"/vehicles\\\"},{\\\"key\\\":\\\"contact_button_text\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"Contact Us\\\"},{\\\"key\\\":\\\"contact_button_url\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"/contact\\\"},{\\\"key\\\":\\\"phone_number\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"+1 (555) 123-4566\\\"},{\\\"key\\\":\\\"email\\\",\\\"type\\\":\\\"content\\\",\\\"value\\\":\\\"support@rentacar.com\\\"},{\\\"key\\\":\\\"background_image\\\",\\\"type\\\":\\\"image\\\",\\\"imagePath\\\":\\\"custom/customFields[8][image]-1733736079957-548582037.avif\\\"}]\"', NULL, '2024-12-09 09:21:19', '2024-12-09 09:21:19');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_number` varchar(50) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `pickup_location` text NOT NULL,
  `dropoff_location` text NOT NULL,
  `status` enum('pending','confirmed','in_progress','completed','cancelled') DEFAULT 'pending',
  `total_amount` decimal(10,2) NOT NULL,
  `payment_status` enum('pending','partial','paid','refunded') DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `special_requests` text DEFAULT NULL,
  `driver_required` tinyint(1) DEFAULT 0,
  `insurance_required` tinyint(1) DEFAULT 0,
  `cancellation_reason` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `payment_intent_id` varchar(255) DEFAULT NULL,
  `vendor_id` int(11) DEFAULT NULL,
  `vendor_user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `order_number`, `start_date`, `end_date`, `pickup_location`, `dropoff_location`, `status`, `total_amount`, `payment_status`, `payment_method`, `special_requests`, `driver_required`, `insurance_required`, `cancellation_reason`, `notes`, `created_at`, `updated_at`, `payment_intent_id`, `vendor_id`, `vendor_user_id`) VALUES
(29, 5, '20241125-1261', '2024-11-27 00:00:00', '2024-11-30 00:00:00', 'Dhaka', 'kasba', 'pending', 0.00, 'pending', 'cash', NULL, 0, 1, NULL, 'yes', '2024-11-25 09:08:24', '2024-11-25 09:08:24', NULL, NULL, NULL),
(30, 5, '20241125-4837', '2024-11-27 00:00:00', '2024-11-30 00:00:00', 'Dhaka', 'kasba', 'pending', 0.00, 'pending', 'cash', NULL, 0, 1, NULL, 'yes', '2024-11-25 09:08:24', '2024-11-25 09:08:24', NULL, NULL, NULL),
(31, 5, '20241125-2324', '2024-11-26 00:00:00', '2024-11-30 00:00:00', 'Dhaka', 'kasba', 'confirmed', 0.00, 'pending', 'cash', NULL, 0, 1, NULL, 'ertert', '2024-11-25 09:15:14', '2024-11-26 04:16:19', NULL, NULL, NULL),
(32, 5, '20241125-7019', '2024-11-26 00:00:00', '2024-11-30 00:00:00', 'Dhaka', 'kasba', 'cancelled', 0.00, 'pending', 'cash', NULL, 0, 1, 'Cancelled by user', 'ertert', '2024-11-25 09:17:43', '2024-11-25 09:47:33', NULL, NULL, NULL),
(33, 5, '20241125-5197', '2024-11-26 00:00:00', '2024-11-30 00:00:00', 'Dhaka', 'kasba', 'pending', 0.00, 'pending', 'cash', NULL, 0, 1, NULL, 'ertert', '2024-11-25 09:17:43', '2024-11-25 09:17:43', NULL, NULL, NULL),
(34, 5, '20241125-8370', '2024-11-27 00:00:00', '2024-11-30 00:00:00', 'DD', 'MM', 'pending', 0.00, 'pending', 'cash', NULL, 0, 1, NULL, 'dsfgdsfg', '2024-11-25 16:24:32', '2024-11-25 16:24:32', NULL, NULL, NULL),
(35, 5, '20241125-1868', '2024-11-28 00:00:00', '2024-11-30 00:00:00', 'CH', 'MM', 'confirmed', 130.00, 'pending', 'card', NULL, 0, 0, NULL, '', '2024-11-25 16:57:01', '2024-11-26 04:05:13', NULL, NULL, NULL),
(36, 5, '20241125-8613', '2024-11-27 00:00:00', '2024-11-30 00:00:00', 'CH', 'MM', 'pending', 195.00, 'pending', 'card', NULL, 0, 0, NULL, '', '2024-11-25 16:57:01', '2024-11-25 16:57:01', NULL, NULL, NULL),
(37, 5, '20241130-8872', '2024-12-01 00:00:00', '2024-12-04 00:00:00', 'Dhaka', 'kasba', 'pending', 270.00, 'pending', 'cash', NULL, 0, 1, NULL, 'yse yes', '2024-11-30 11:49:51', '2024-11-30 11:49:51', NULL, NULL, 11),
(38, 5, '20241130-2169', '2024-12-14 00:00:00', '2024-12-22 00:00:00', 'Dhaka', 'kasba', 'cancelled', 1600.00, 'pending', 'cash', NULL, 1, 1, NULL, 'just use', '2024-11-30 12:06:30', '2024-12-10 14:11:22', NULL, NULL, 12),
(39, 12, '20241210-2400', '2024-12-12 00:00:00', '2024-12-14 00:00:00', 'Dhaka', 'kasba', 'pending', 120.00, 'pending', 'cash', NULL, 0, 1, NULL, 'just', '2024-12-10 14:00:22', '2024-12-10 14:00:22', NULL, NULL, 11),
(40, 12, '20241210-2355', '2024-12-12 00:00:00', '2024-12-14 00:00:00', 'Dhaka', 'kasba', 'pending', 150.00, 'pending', 'cash', NULL, 0, 1, NULL, 'just', '2024-12-10 14:00:22', '2024-12-10 14:00:22', NULL, NULL, 11),
(41, 12, '20241210-2671', '2024-12-12 00:00:00', '2024-12-14 00:00:00', 'Dhaka', 'kasba', 'confirmed', 200.00, 'pending', 'cash', NULL, 0, 1, NULL, 'just', '2024-12-10 14:00:22', '2024-12-10 14:10:42', NULL, NULL, 12),
(42, 12, '20241210-7762', '2024-12-12 00:00:00', '2024-12-14 00:00:00', 'Dhaka', 'kasba', 'confirmed', 190.00, 'pending', 'cash', NULL, 0, 1, NULL, 'just', '2024-12-10 14:00:22', '2024-12-10 14:11:17', NULL, NULL, 12),
(43, 12, '20241210-8510', '2024-12-12 00:00:00', '2024-12-14 00:00:00', 'Dhaka', 'kasba', 'pending', 350.00, 'pending', 'cash', NULL, 0, 1, NULL, 'just', '2024-12-10 14:00:22', '2024-12-10 14:00:22', NULL, NULL, 11);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `vehicle_type_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `rate_type` enum('hourly','daily','weekly','monthly') NOT NULL DEFAULT 'daily',
  `rate_amount` decimal(10,2) NOT NULL,
  `total_units` int(11) NOT NULL COMMENT 'Number of hours/days/weeks/months based on rate_type',
  `subtotal` decimal(10,2) NOT NULL,
  `insurance_fee` decimal(10,2) DEFAULT 0.00,
  `driver_fee` decimal(10,2) DEFAULT 0.00,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `vehicle_id`, `vehicle_type_id`, `quantity`, `rate_type`, `rate_amount`, `total_units`, `subtotal`, `insurance_fee`, `driver_fee`, `status`, `created_at`, `updated_at`) VALUES
(25, 30, 18, 2, 1, 'daily', 95.00, 3, 285.00, 0.00, 0.00, 'pending', '2024-11-25 09:08:24', '2024-11-25 09:08:24'),
(26, 29, 21, 2, 1, 'daily', 90.00, 3, 270.00, 0.00, 0.00, 'pending', '2024-11-25 09:08:24', '2024-11-25 09:08:24'),
(27, 31, 14, 1, 1, 'daily', 60.00, 4, 240.00, 0.00, 0.00, 'confirmed', '2024-11-25 09:15:14', '2024-11-26 04:16:19'),
(28, 32, 14, 1, 1, 'daily', 60.00, 4, 240.00, 0.00, 0.00, 'pending', '2024-11-25 09:17:43', '2024-11-25 09:17:43'),
(29, 33, 13, 1, 1, 'daily', 65.00, 4, 260.00, 0.00, 0.00, 'pending', '2024-11-25 09:17:43', '2024-11-25 09:17:43'),
(30, 34, 14, 1, 1, 'daily', 60.00, 3, 180.00, 0.00, 0.00, 'pending', '2024-11-25 16:24:32', '2024-11-25 16:24:32'),
(31, 35, 13, 1, 1, 'daily', 65.00, 2, 130.00, 0.00, 0.00, 'confirmed', '2024-11-25 16:57:01', '2024-11-26 04:05:13'),
(32, 36, 13, 1, 1, 'daily', 65.00, 3, 195.00, 0.00, 0.00, 'pending', '2024-11-25 16:57:01', '2024-11-25 16:57:01'),
(33, 37, 21, 2, 1, 'daily', 90.00, 3, 270.00, 0.00, 0.00, 'pending', '2024-11-30 11:49:51', '2024-11-30 11:49:51'),
(34, 38, 24, 6, 1, 'daily', 100.00, 8, 800.00, 0.00, 800.00, 'cancelled', '2024-11-30 12:06:30', '2024-12-10 14:11:22'),
(35, 39, 14, 1, 1, 'daily', 60.00, 2, 120.00, 0.00, 0.00, 'pending', '2024-12-10 14:00:22', '2024-12-10 14:00:22'),
(36, 40, 12, 1, 1, 'daily', 75.00, 2, 150.00, 0.00, 0.00, 'pending', '2024-12-10 14:00:22', '2024-12-10 14:00:22'),
(37, 41, 11, 8, 1, 'daily', 100.00, 2, 200.00, 0.00, 0.00, 'confirmed', '2024-12-10 14:00:22', '2024-12-10 14:10:42'),
(38, 42, 18, 2, 1, 'daily', 95.00, 2, 190.00, 0.00, 0.00, 'confirmed', '2024-12-10 14:00:22', '2024-12-10 14:11:17'),
(39, 43, 17, 4, 1, 'daily', 175.00, 2, 350.00, 0.00, 0.00, 'pending', '2024-12-10 14:00:22', '2024-12-10 14:00:22');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `mobile` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `gender` varchar(100) DEFAULT NULL,
  `mobile_otp` varchar(100) DEFAULT NULL,
  `role` enum('user','vendor','admin') DEFAULT 'user',
  `active` tinyint(1) DEFAULT 1,
  `login_attempts` int(11) DEFAULT NULL,
  `login_attempts_date` datetime DEFAULT NULL,
  `expiry` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `avatar`, `mobile`, `first_name`, `last_name`, `gender`, `mobile_otp`, `role`, `active`, `login_attempts`, `login_attempts_date`, `expiry`, `created_at`, `updated_at`) VALUES
(1, 'My admin', 'user@gmail.com', '$2a$10$Y2E0aNQbadvqNG.FOuy6I.xFl9oDPHIhMa5Pf9aTD5FfAHuAZR07i', NULL, '123254646', NULL, NULL, NULL, NULL, 'admin', 1, 0, NULL, NULL, '2024-10-08 09:33:54', '2024-12-01 03:18:48'),
(2, 'moshiur rahman', 'mos@gmail.com', '$2a$10$N0ImazEJ/7VNCw3QVWdztO8HwVVrGcBM.Ngd4J.jI4uq37YkBlaGG', 'avatars/1729446806951-0101111.jpg', '31654645', NULL, NULL, NULL, NULL, 'vendor', 1, 0, NULL, NULL, '2024-10-09 05:26:48', '2024-10-29 04:20:37'),
(3, 'dfd', 'user2@gmail.com', '12345678', 'avatars/1728640743160-5STiPdKDSgmrD7T76QQ03WZyk5MxsYy3AyYPgUcN.png', '165465631', NULL, NULL, NULL, NULL, 'user', 1, NULL, NULL, NULL, '2024-10-11 09:59:03', '2024-10-11 09:59:03'),
(4, 'Moshiur Rahman', 'user5@gmail.com', '$2a$10$izgw1zGjKF4w11nKyUVuOecwsdlWeHs0s9Q3UNktAVkOFn5TttuCa', NULL, '1324523452345234', NULL, NULL, 'male', NULL, 'admin', 1, 2, '2024-11-24 15:33:41', NULL, '2024-11-17 04:35:58', '2024-11-24 15:33:41'),
(5, 'Moshiur Rahman', 'user9@gmail.com', '$2a$10$jxUyyFMk4FeMCy.LAmhmZOqGoMv6K5MIiiXisbPM.PI9JF1sdkNo.', NULL, '01723386083', 'Moshiur', 'Rahman', 'male', NULL, 'user', 1, NULL, NULL, NULL, '2024-11-17 07:15:33', '2024-12-10 14:33:28'),
(6, 'Mos Ra', 'fa@gmail.com', '$2a$10$e.ZzeLZJ.kHz66oGori2NOWJBe9XPklCGWyKLp1K8for44i05qSmu', NULL, '0172338600', 'Mos', 'Ra', 'male', NULL, 'vendor', 1, 0, NULL, NULL, '2024-11-18 10:18:11', '2024-11-19 04:20:03'),
(7, 'Mos RR', 'rr@gmial.com', '$2a$10$i1cxPiaHWYk6t/ZHT/apo.q7IOha00OLA77SsclJ1SfpNZoyOmO/6', NULL, '0172338644', 'Mos', 'RR', 'male', NULL, 'user', 1, NULL, NULL, NULL, '2024-11-19 06:09:44', '2024-11-19 06:09:44'),
(8, 'Mos RR', 'uservn@gmail.com', '$2a$10$O0B3Fac2u.piLJWkb/Gy5eunDZFKLZPNshzLkGIr3jctLXTtVydli', NULL, '0172338608', 'Mos', 'RR', 'male', '7014', 'vendor', 1, 0, NULL, NULL, '2024-11-27 04:04:13', '2024-11-27 10:27:29'),
(9, 'Moshiur Rahman', 'fa444@gmail.com', '$2a$10$SOf.7XQo3hRsUDBbhdq9ZeWnx8ktvkB/iAQ2NycEAzZTSwP/hXvV2', NULL, '01724008829', 'Moshiur', 'Rahman', 'male', NULL, 'user', 1, NULL, NULL, NULL, '2024-11-27 15:50:06', '2024-11-27 15:50:40'),
(10, 'Mos RR', 'faraz@gmail.com', '$2a$10$StP/LO6BOpC0p8bs5riK0uqDOZsQ0fsq7jencpghgWk6TGyca206i', NULL, '0123658745', 'Mos', 'RR', 'male', NULL, 'vendor', 1, 0, NULL, NULL, '2024-11-30 12:00:03', '2024-11-30 12:00:53'),
(11, 'Vendor 1 RR', 'vendor1@gmail.com', '$2a$10$wUNW.cQZxv5IfqaLA4R/OO4mv8jdZz9AI0lbF4YiGgsYYUXoVvhs.', NULL, '1234567891', 'Vendor 1', 'RR', 'male', NULL, 'vendor', 1, NULL, NULL, NULL, '2024-12-10 13:00:39', '2024-12-10 13:00:39'),
(12, 'Vendor2 RR', 'vendor2@gmail.com', '$2a$10$bS0K0T7MGunWD7bcuNnEfeY9fM9Y99U2Zq1g.6VRBZs4qftqlBbSK', NULL, '3216549874', 'Vendor2', 'RR', 'male', NULL, 'vendor', 1, 0, NULL, NULL, '2024-12-10 13:01:28', '2024-12-10 13:57:57');

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `id` int(11) NOT NULL,
  `vehicle_type_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `vendor_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `number_plate` varchar(20) NOT NULL,
  `model_year` int(11) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `engine_capacity` varchar(50) DEFAULT NULL,
  `fuel_type` enum('Petrol','Diesel','Electric','Hybrid','CNG') NOT NULL,
  `transmission_type` enum('Manual','Automatic','CVT') NOT NULL,
  `mileage` decimal(5,2) DEFAULT NULL,
  `seating_capacity` int(11) DEFAULT NULL,
  `bike_type` enum('Standard','Cruiser','Sports','Touring','Scooter') DEFAULT NULL,
  `engine_cc` int(11) DEFAULT NULL,
  `starter_type` enum('Kick','Self','Both') DEFAULT NULL,
  `status` enum('Available','Booked','Maintenance','Inactive') NOT NULL DEFAULT 'Available',
  `hourly_rate` decimal(10,2) DEFAULT NULL,
  `daily_rate` decimal(10,2) DEFAULT NULL,
  `weekly_rate` decimal(10,2) DEFAULT NULL,
  `monthly_rate` decimal(10,2) DEFAULT NULL,
  `security_deposit` decimal(10,2) DEFAULT NULL,
  `minimum_rental_period` int(11) DEFAULT NULL,
  `with_driver_available` tinyint(1) DEFAULT 0,
  `driver_name` varchar(100) DEFAULT NULL,
  `driver_phone` varchar(15) DEFAULT NULL,
  `driver_license_number` varchar(50) DEFAULT NULL,
  `driver_rate_per_day` decimal(10,2) DEFAULT NULL,
  `registration_expiry` datetime DEFAULT NULL,
  `insurance_expiry` datetime DEFAULT NULL,
  `last_maintenance_date` datetime DEFAULT NULL,
  `next_maintenance_due` datetime DEFAULT NULL,
  `current_location_address` text NOT NULL,
  `pickup_location` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `total_bookings` int(11) DEFAULT 0,
  `total_revenue` decimal(12,2) DEFAULT 0.00,
  `average_rating` decimal(3,2) DEFAULT 0.00,
  `total_kilometers` decimal(10,2) DEFAULT 0.00,
  `main_image` varchar(255) DEFAULT NULL COMMENT 'Main display image URL for the vehicle',
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array of image URLs ["url1", "url2", ...]' CHECK (json_valid(`images`)),
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array of feature name and icon [{"feature1":"icon1"}, {"feature2":"icon2"}, ...]' CHECK (json_valid(`features`)),
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `vendor_user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`id`, `vehicle_type_id`, `category_id`, `brand_id`, `vendor_id`, `name`, `number_plate`, `model_year`, `color`, `engine_capacity`, `fuel_type`, `transmission_type`, `mileage`, `seating_capacity`, `bike_type`, `engine_cc`, `starter_type`, `status`, `hourly_rate`, `daily_rate`, `weekly_rate`, `monthly_rate`, `security_deposit`, `minimum_rental_period`, `with_driver_available`, `driver_name`, `driver_phone`, `driver_license_number`, `driver_rate_per_day`, `registration_expiry`, `insurance_expiry`, `last_maintenance_date`, `next_maintenance_due`, `current_location_address`, `pickup_location`, `city`, `state`, `latitude`, `longitude`, `total_bookings`, `total_revenue`, `average_rating`, `total_kilometers`, `main_image`, `images`, `features`, `created_at`, `updated_at`, `vendor_user_id`) VALUES
(11, 8, 6, 10, 1, 'Moshiur change ', '3434', 2000, 'blue', '200', 'Petrol', 'Manual', 30.00, 6, NULL, NULL, NULL, 'Available', 10.00, 100.00, 700.00, 1000.00, 200.00, 1, 0, NULL, NULL, NULL, 0.00, NULL, NULL, NULL, NULL, 'Bangladesh', 'T est', 'sdf', 'bbaria', 0.00000000, 0.00000000, 0, 0.00, 0.00, 0.00, '/uploads/vehicles/main-1733824253656-585005261.avif', '\"[\\\"/uploads/vehicles/additional-1732351051125-401780572.png\\\",\\\"/uploads/vehicles/additional-1732351051125-121577667.png\\\",\\\"/uploads/vehicles/additional-1732351051126-789251769.png\\\"]\"', '[]', '2024-11-23 08:37:31', '2024-12-10 09:50:53', 12),
(12, 1, 1, 1, 1, 'Toyota Camry', 'ABC123', 2023, 'Silver', '2500', 'Petrol', 'Automatic', 25.50, 5, NULL, NULL, NULL, 'Available', 10.00, 75.00, 450.00, 1800.00, 500.00, 1, 0, NULL, NULL, NULL, 0.00, NULL, NULL, NULL, NULL, '123 Main St, City', '123 Main St, City', 'New York', 'NY', 0.00000000, 0.00000000, 0, 0.00, 0.00, 0.00, '/uploads/vehicles/main-1732357682793-375771245.png', NULL, '[\"Bluetooth\",\"Backup Camera\",\"Cruise Control\"]', '2024-11-23 16:26:16', '2024-11-23 10:28:02', 11),
(13, 1, 1, 2, 1, 'Honda Civic', 'XYZ789', 2023, 'Blue', '1800', 'Petrol', 'Automatic', 30.20, 5, NULL, NULL, NULL, 'Available', 8.00, 65.00, 390.00, 1560.00, 400.00, 1, 1, 'Moshiur', '123456', '13213694614', 150.00, NULL, NULL, NULL, NULL, '456 Oak St, City', '456 Oak St, City', 'Los Angeles', 'CA', 0.00000000, 0.00000000, 0, 0.00, 0.00, 0.00, '/uploads/vehicles/main-1733824215773-574736337.avif', NULL, '[\"Apple CarPlay\",\"Android Auto\",\"Lane Departure Warning\"]', '2024-11-23 16:26:16', '2024-12-10 09:50:15', 11),
(14, 1, 2, 5, 1, 'Ford Focus', 'DEF456', 2022, 'Red', '2000', 'Petrol', 'Manual', 28.70, 5, NULL, NULL, NULL, 'Available', 7.50, 60.00, 360.00, 1440.00, 400.00, 1, 0, NULL, NULL, NULL, 0.00, NULL, NULL, NULL, NULL, '789 Pine St, City', '789 Pine St, City', 'Chicago', 'IL', 0.00000000, 0.00000000, 0, 0.00, 0.00, 0.00, '/uploads/vehicles/main-1733824170588-459047646.avif', NULL, '[\"Turbo Engine\",\"Sport Mode\",\"Premium Audio\"]', '2024-11-23 16:26:16', '2024-12-10 09:49:30', 11),
(15, 2, 3, 5, 1, 'Ford Escape', 'GHI789', 2023, 'White', '2500', 'Hybrid', 'Automatic', 24.30, 5, NULL, NULL, NULL, 'Available', 10.00, 85.00, 510.00, 2040.00, 600.00, 1, 0, NULL, NULL, NULL, 0.00, NULL, NULL, NULL, NULL, '321 Elm St, City', '321 Elm St, City', 'Houston', 'TX', 0.00000000, 0.00000000, 0, 0.00, 0.00, 0.00, '/uploads/vehicles/main-1733824145798-231869853.avif', NULL, '[\"Panoramic Roof\",\"Navigation\",\"Wireless Charging\"]', '2024-11-23 16:26:16', '2024-12-10 09:49:05', 11),
(16, 3, 4, 4, 1, 'Mercedes-Benz GLS', 'JKL012', 2023, 'Black', '3000', 'Petrol', 'Automatic', 20.10, 7, NULL, NULL, NULL, 'Available', 18.75, 150.00, 900.00, 3600.00, 1000.00, 1, 0, NULL, NULL, NULL, 0.00, NULL, NULL, NULL, NULL, '654 Maple St, City', '654 Maple St, City', 'Miami', 'FL', 0.00000000, 0.00000000, 0, 0.00, 0.00, 0.00, '/uploads/vehicles/main-1733824123349-237501077.avif', NULL, '[\"Premium Leather\",\"360 Camera\",\"Air Suspension\"]', '2024-11-23 16:26:16', '2024-12-10 09:48:43', 11),
(17, 4, 6, 3, 1, 'BMW 7 Series', 'MNO345', 2023, 'Gray', '3000', 'Petrol', 'Automatic', 22.40, 5, NULL, NULL, NULL, 'Available', 21.88, 175.00, 1050.00, 4200.00, 1200.00, 1, 0, NULL, NULL, NULL, 0.00, NULL, NULL, NULL, NULL, '987 Cedar St, City', '987 Cedar St, City', 'Boston', 'MA', 0.00000000, 0.00000000, 0, 0.00, 0.00, 0.00, '/uploads/vehicles/main-1733824101658-106477763.avif', NULL, '[\"Executive Package\",\"Massage Seats\",\"Night Vision\"]', '2024-11-23 16:26:16', '2024-12-10 09:48:21', 11),
(18, 2, 5, 1, 1, 'Toyota Sienna', 'PQR678', 2023, 'Silver', '2500', 'Hybrid', 'Automatic', 26.80, 8, NULL, NULL, NULL, 'Available', 11.88, 95.00, 570.00, 2280.00, 700.00, 1, 1, 'Marsh', '123456', '13213694613', 100.00, NULL, NULL, NULL, NULL, '147 Birch St, City', '147 Birch St, City', 'Seattle', 'WA', 0.00000000, 0.00000000, 0, 0.00, 0.00, 0.00, '/uploads/vehicles/main-1733824057777-780769333.avif', NULL, '[\"Power Sliding Doors\",\"Rear Entertainment\",\"3-Zone Climate\"]', '2024-11-23 16:26:16', '2024-12-10 09:47:37', 12),
(19, 1, 1, 2, 1, 'Honda Accord', 'STU901', 2023, 'Black', '2000', 'Hybrid', 'Automatic', 29.50, 5, NULL, NULL, NULL, 'Available', 10.00, 80.00, 480.00, 1920.00, 500.00, 1, 0, NULL, NULL, NULL, 0.00, NULL, NULL, NULL, NULL, '258 Walnut St, City', '258 Walnut St, City', 'Denver', 'CO', 0.00000000, 0.00000000, 0, 0.00, 0.00, 0.00, '/uploads/vehicles/main-1733824012232-321793395.avif', NULL, '[\"Head-Up Display\",\"Ventilated Seats\",\"Bose Audio\"]', '2024-11-23 16:26:16', '2024-12-10 09:46:52', 12),
(20, 4, 6, 4, 1, 'Mercedes-Benz S-Class', 'VWX234', 2023, 'Diamond White', '3000', 'Petrol', 'Automatic', 21.20, 5, NULL, NULL, NULL, 'Available', 25.00, 200.00, 1200.00, 4800.00, 1500.00, 1, 1, 'Marsh', '123456', '13213694613', 0.00, NULL, NULL, NULL, NULL, '369 Pine St, City', '369 Pine St, City', 'San Francisco', 'CA', 0.00000000, 0.00000000, 0, 0.00, 0.00, 0.00, '/uploads/vehicles/main-1733823911346-402680797.avif', NULL, '[\"Executive Rear Seats\",\"Burmester 4D Sound\",\"Digital Light\"]', '2024-11-23 16:26:16', '2024-12-10 09:46:05', 12),
(21, 2, 3, 5, 1, 'Ford Bronco Sport', 'YZA567', 2023, 'Cyber Orange', '2500', 'Petrol', 'Automatic', 23.60, 5, NULL, NULL, NULL, 'Available', 11.25, 90.00, 540.00, 2160.00, 600.00, 1, 1, 'Jhon', '123456', '132136946525', 100.00, NULL, NULL, NULL, NULL, '480 Oak St, City', '480 Oak St, City', 'Portland', 'OR', 0.00000000, 0.00000000, 0, 0.00, 0.00, 0.00, '/uploads/vehicles/main-1733823860617-212704940.avif', NULL, '[\"Off-Road Capability\",\"Trail Control\",\"GOAT Modes\"]', '2024-11-23 16:26:16', '2024-12-10 09:44:20', 12),
(23, 7, 5, 8, 1, 'Honda car', 'ABC1235', 2020, 'blue', 'ENG123456', 'Diesel', 'Automatic', 20.00, 8, NULL, NULL, NULL, 'Available', 10.00, 200.00, 800.00, 6000.00, 0.00, 1, 1, 'Jhon', '123456', '13213694613', 100.00, NULL, NULL, NULL, NULL, 'Location', 'Pickup Location', 'Usa', 'NY', 0.00000000, 0.00000000, 0, 0.00, 0.00, 0.00, '/uploads/vehicles/main-1733823763655-399135045.avif', '\"[\\\"/uploads/vehicles/additional-1732680759706-973752365.png\\\",\\\"/uploads/vehicles/additional-1732680759707-928976464.png\\\",\\\"/uploads/vehicles/additional-1732680759707-458529518.png\\\"]\"', '[]', '2024-11-27 04:12:39', '2024-12-10 09:42:43', 12),
(24, 6, 4, 5, 1, 'Just test', '5968754', 2020, 'Silver', '2500', 'Petrol', 'Manual', 20.00, 6, NULL, NULL, NULL, 'Available', 10.00, 100.00, 600.00, 6000.00, 20.00, 1, 1, 'Moshiur', 'Rdddd', '13213694614', 100.00, NULL, NULL, NULL, NULL, 'mahari', 'kasba', 'New York', 'bbaria', 0.00000000, 0.00000000, 0, 0.00, 0.00, 0.00, '/uploads/vehicles/main-1732968225539-29109852.png', '\"[\\\"/uploads/vehicles/additional-1732968225540-468997467.png\\\",\\\"/uploads/vehicles/additional-1732968225540-606891262.png\\\",\\\"/uploads/vehicles/additional-1732968225541-316598856.png\\\",\\\"/uploads/vehicles/additional-1732968225541-469976150.png\\\",\\\"/uploads/vehicles/additional-1732968225541-825699804.png\\\"]\"', '[]', '2024-11-30 12:03:45', '2024-11-30 12:03:45', 12);

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_features`
--

CREATE TABLE `vehicle_features` (
  `id` int(11) NOT NULL,
  `vehicle_id` int(11) DEFAULT NULL,
  `feature_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_images`
--

CREATE TABLE `vehicle_images` (
  `id` int(11) NOT NULL,
  `vehicle_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `image_type` enum('exterior','interior','document') DEFAULT 'exterior',
  `is_primary` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicle_images`
--

INSERT INTO `vehicle_images` (`id`, `vehicle_id`, `image_url`, `image_type`, `is_primary`, `created_at`, `updated_at`) VALUES
(31, 12, '/uploads/vehicles/additional-1732357682793-800134874.png', 'exterior', 0, '2024-11-23 10:28:02', '2024-11-23 10:28:02'),
(32, 12, '/uploads/vehicles/additional-1732357682793-720374951.png', 'exterior', 0, '2024-11-23 10:28:02', '2024-11-23 10:28:02'),
(33, 12, '/uploads/vehicles/additional-1732357682794-677631122.png', 'exterior', 0, '2024-11-23 10:28:02', '2024-11-23 10:28:02'),
(34, 12, '/uploads/vehicles/additional-1732357682794-333469063.png', 'exterior', 0, '2024-11-23 10:28:02', '2024-11-23 10:28:02'),
(47, 24, '/uploads/vehicles/additional-1732968225540-468997467.png', 'exterior', 0, '2024-11-30 12:03:45', '2024-11-30 12:03:45'),
(48, 24, '/uploads/vehicles/additional-1732968225540-606891262.png', 'exterior', 0, '2024-11-30 12:03:45', '2024-11-30 12:03:45'),
(49, 24, '/uploads/vehicles/additional-1732968225541-316598856.png', 'exterior', 0, '2024-11-30 12:03:45', '2024-11-30 12:03:45'),
(50, 24, '/uploads/vehicles/additional-1732968225541-469976150.png', 'exterior', 0, '2024-11-30 12:03:45', '2024-11-30 12:03:45'),
(51, 24, '/uploads/vehicles/additional-1732968225541-825699804.png', 'exterior', 0, '2024-11-30 12:03:45', '2024-11-30 12:03:45'),
(52, 23, '/uploads/vehicles/additional-1733823763683-42032198.avif', 'exterior', 0, '2024-12-10 09:42:43', '2024-12-10 09:42:43'),
(53, 23, '/uploads/vehicles/additional-1733823763684-659555884.avif', 'exterior', 0, '2024-12-10 09:42:43', '2024-12-10 09:42:43'),
(54, 23, '/uploads/vehicles/additional-1733823763685-5994277.avif', 'exterior', 0, '2024-12-10 09:42:43', '2024-12-10 09:42:43'),
(55, 23, '/uploads/vehicles/additional-1733823763685-422781083.avif', 'exterior', 0, '2024-12-10 09:42:43', '2024-12-10 09:42:43'),
(56, 21, '/uploads/vehicles/additional-1733823860630-128920970.avif', 'exterior', 0, '2024-12-10 09:44:20', '2024-12-10 09:44:20'),
(57, 21, '/uploads/vehicles/additional-1733823860630-709895210.avif', 'exterior', 0, '2024-12-10 09:44:20', '2024-12-10 09:44:20'),
(58, 21, '/uploads/vehicles/additional-1733823860631-216968374.avif', 'exterior', 0, '2024-12-10 09:44:20', '2024-12-10 09:44:20'),
(59, 21, '/uploads/vehicles/additional-1733823860631-45422022.avif', 'exterior', 0, '2024-12-10 09:44:20', '2024-12-10 09:44:20'),
(60, 20, '/uploads/vehicles/additional-1733823911354-442095055.avif', 'exterior', 0, '2024-12-10 09:45:11', '2024-12-10 09:45:11'),
(61, 20, '/uploads/vehicles/additional-1733823911354-581143321.avif', 'exterior', 0, '2024-12-10 09:45:11', '2024-12-10 09:45:11'),
(62, 20, '/uploads/vehicles/additional-1733823911355-743399544.avif', 'exterior', 0, '2024-12-10 09:45:11', '2024-12-10 09:45:11'),
(63, 20, '/uploads/vehicles/additional-1733823911355-290926859.avif', 'exterior', 0, '2024-12-10 09:45:11', '2024-12-10 09:45:11'),
(64, 19, '/uploads/vehicles/additional-1733824012232-108997704.avif', 'exterior', 0, '2024-12-10 09:46:52', '2024-12-10 09:46:52'),
(65, 19, '/uploads/vehicles/additional-1733824012233-428687709.avif', 'exterior', 0, '2024-12-10 09:46:52', '2024-12-10 09:46:52'),
(66, 19, '/uploads/vehicles/additional-1733824012233-284659057.avif', 'exterior', 0, '2024-12-10 09:46:52', '2024-12-10 09:46:52'),
(67, 19, '/uploads/vehicles/additional-1733824012233-319758589.avif', 'exterior', 0, '2024-12-10 09:46:52', '2024-12-10 09:46:52'),
(68, 18, '/uploads/vehicles/additional-1733824057778-632073190.avif', 'exterior', 0, '2024-12-10 09:47:37', '2024-12-10 09:47:37'),
(69, 18, '/uploads/vehicles/additional-1733824057778-703909614.avif', 'exterior', 0, '2024-12-10 09:47:37', '2024-12-10 09:47:37'),
(70, 18, '/uploads/vehicles/additional-1733824057778-601473277.avif', 'exterior', 0, '2024-12-10 09:47:37', '2024-12-10 09:47:37'),
(71, 17, '/uploads/vehicles/additional-1733824101658-402972805.avif', 'exterior', 0, '2024-12-10 09:48:21', '2024-12-10 09:48:21'),
(72, 17, '/uploads/vehicles/additional-1733824101659-577181332.avif', 'exterior', 0, '2024-12-10 09:48:21', '2024-12-10 09:48:21'),
(73, 17, '/uploads/vehicles/additional-1733824101659-832871334.avif', 'exterior', 0, '2024-12-10 09:48:21', '2024-12-10 09:48:21'),
(74, 17, '/uploads/vehicles/additional-1733824101659-526534408.avif', 'exterior', 0, '2024-12-10 09:48:21', '2024-12-10 09:48:21'),
(75, 16, '/uploads/vehicles/additional-1733824123350-955139793.avif', 'exterior', 0, '2024-12-10 09:48:43', '2024-12-10 09:48:43'),
(76, 16, '/uploads/vehicles/additional-1733824123350-37492246.avif', 'exterior', 0, '2024-12-10 09:48:43', '2024-12-10 09:48:43'),
(77, 16, '/uploads/vehicles/additional-1733824123351-536361629.avif', 'exterior', 0, '2024-12-10 09:48:43', '2024-12-10 09:48:43'),
(78, 16, '/uploads/vehicles/additional-1733824123351-995159446.avif', 'exterior', 0, '2024-12-10 09:48:43', '2024-12-10 09:48:43'),
(79, 15, '/uploads/vehicles/additional-1733824145798-93045809.avif', 'exterior', 0, '2024-12-10 09:49:05', '2024-12-10 09:49:05'),
(80, 15, '/uploads/vehicles/additional-1733824145799-544231851.avif', 'exterior', 0, '2024-12-10 09:49:05', '2024-12-10 09:49:05'),
(81, 15, '/uploads/vehicles/additional-1733824145799-247369604.avif', 'exterior', 0, '2024-12-10 09:49:05', '2024-12-10 09:49:05'),
(82, 14, '/uploads/vehicles/additional-1733824170589-682565557.avif', 'exterior', 0, '2024-12-10 09:49:30', '2024-12-10 09:49:30'),
(83, 14, '/uploads/vehicles/additional-1733824170589-522542759.avif', 'exterior', 0, '2024-12-10 09:49:30', '2024-12-10 09:49:30'),
(84, 14, '/uploads/vehicles/additional-1733824170590-123581672.avif', 'exterior', 0, '2024-12-10 09:49:30', '2024-12-10 09:49:30'),
(85, 14, '/uploads/vehicles/additional-1733824170590-350762697.avif', 'exterior', 0, '2024-12-10 09:49:30', '2024-12-10 09:49:30'),
(86, 13, '/uploads/vehicles/additional-1733824215774-809019092.avif', 'exterior', 0, '2024-12-10 09:50:15', '2024-12-10 09:50:15'),
(87, 13, '/uploads/vehicles/additional-1733824215775-402920750.avif', 'exterior', 0, '2024-12-10 09:50:15', '2024-12-10 09:50:15'),
(88, 13, '/uploads/vehicles/additional-1733824215775-691864860.avif', 'exterior', 0, '2024-12-10 09:50:15', '2024-12-10 09:50:15'),
(89, 13, '/uploads/vehicles/additional-1733824215775-921157270.avif', 'exterior', 0, '2024-12-10 09:50:15', '2024-12-10 09:50:15'),
(90, 11, '/uploads/vehicles/additional-1733824253663-578414072.avif', 'exterior', 0, '2024-12-10 09:50:53', '2024-12-10 09:50:53'),
(91, 11, '/uploads/vehicles/additional-1733824253664-460991200.avif', 'exterior', 0, '2024-12-10 09:50:53', '2024-12-10 09:50:53'),
(92, 11, '/uploads/vehicles/additional-1733824253664-834841873.avif', 'exterior', 0, '2024-12-10 09:50:53', '2024-12-10 09:50:53'),
(93, 11, '/uploads/vehicles/additional-1733824253665-159288352.avif', 'exterior', 0, '2024-12-10 09:50:53', '2024-12-10 09:50:53');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_types`
--

CREATE TABLE `vehicle_types` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(250) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicle_types`
--

INSERT INTO `vehicle_types` (`id`, `name`, `description`, `icon`, `created_at`, `updated_at`) VALUES
(1, 'Sedan', 'A comfortable passenger car with separate trunk', 'fa-car', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(2, 'SUV', 'Sport Utility Vehicle with high ground clearance', 'fa-truck', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(3, 'Hatchback', 'Compact car with rear door that opens upwards', 'fa-car-side', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(4, 'Convertible', 'Car with retractable roof', 'fa-car-side', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(5, 'Pickup', 'Vehicle with an open cargo area', 'fa-truck-pickup', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(6, 'Van', 'Large vehicle for transporting people or cargo', 'fa-shuttle-van', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(7, 'Luxury', 'Premium vehicles with high-end features', 'fa-car-side', '2024-11-19 15:40:05', '2024-11-19 15:40:05'),
(8, 'Sports', 'High-performance vehicles', 'fa-car-side', '2024-11-19 15:40:05', '2024-11-19 15:40:05');

-- --------------------------------------------------------

--
-- Table structure for table `vendors`
--

CREATE TABLE `vendors` (
  `id` int(11) NOT NULL,
  `company_name` varchar(100) NOT NULL,
  `contact_person` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `alternate_phone` varchar(20) DEFAULT NULL,
  `address` text NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `gst_number` varchar(15) DEFAULT NULL,
  `pan_number` varchar(10) DEFAULT NULL,
  `bank_account_number` varchar(50) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `ifsc_code` varchar(20) DEFAULT NULL,
  `commission_percentage` decimal(5,2) DEFAULT NULL,
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  `agreement_start_date` datetime DEFAULT NULL,
  `agreement_end_date` datetime DEFAULT NULL,
  `kyc_verified` tinyint(1) DEFAULT 0,
  `rating` decimal(2,1) DEFAULT NULL,
  `total_vehicles` int(11) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vendors`
--

INSERT INTO `vendors` (`id`, `company_name`, `contact_person`, `email`, `phone`, `alternate_phone`, `address`, `city`, `state`, `pincode`, `gst_number`, `pan_number`, `bank_account_number`, `bank_name`, `ifsc_code`, `commission_percentage`, `status`, `agreement_start_date`, `agreement_end_date`, `kyc_verified`, `rating`, `total_vehicles`, `created_at`, `updated_at`) VALUES
(1, 'test', 'tee', 'user@gmail.com', '3453453453245', '', 'Addsdfas', 'dhaka', 'bbaria', '345345', '131313131313112', '4646465463', '34534534654', 'dfg', '45646465464564', 0.00, 'active', '2024-11-21 00:00:00', '2024-11-24 00:00:00', 0, NULL, -1, '2024-11-21 05:56:42', '2024-11-26 05:11:03'),
(2, 'sdfasdfsd', 'werwerr', 'user2@gmail.com', '3453453453249', '', 'fqadfsasdfsdf', 'dhaka', 'bbaria', '3453434', '234234324324343', '2342342323', '2342342342', 'asdfasdfasdf', '234234234234', 4.00, 'inactive', '2024-11-20 00:00:00', '2024-11-24 00:00:00', 1, NULL, 2, '2024-11-21 06:13:28', '2024-11-22 05:30:44');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD UNIQUE KEY `name_8` (`name`),
  ADD UNIQUE KEY `name_9` (`name`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_name_vehicle_type_unique` (`name`,`vehicle_type_id`),
  ADD KEY `vehicle_type_id` (`vehicle_type_id`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD UNIQUE KEY `code_2` (`code`),
  ADD UNIQUE KEY `code_3` (`code`),
  ADD UNIQUE KEY `code_4` (`code`),
  ADD UNIQUE KEY `code_5` (`code`),
  ADD UNIQUE KEY `code_6` (`code`),
  ADD UNIQUE KEY `code_7` (`code`),
  ADD UNIQUE KEY `code_8` (`code`),
  ADD UNIQUE KEY `code_9` (`code`),
  ADD UNIQUE KEY `code_10` (`code`),
  ADD KEY `vehicle_type_id` (`vehicle_type_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `brand_id` (`brand_id`);

--
-- Indexes for table `features`
--
ALTER TABLE `features`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vehicle_type_id` (`vehicle_type_id`);

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `my_fields`
--
ALTER TABLE `my_fields`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD UNIQUE KEY `order_number_2` (`order_number`),
  ADD UNIQUE KEY `order_number_3` (`order_number`),
  ADD UNIQUE KEY `order_number_4` (`order_number`),
  ADD UNIQUE KEY `order_number_5` (`order_number`),
  ADD UNIQUE KEY `order_number_6` (`order_number`),
  ADD UNIQUE KEY `order_number_7` (`order_number`),
  ADD UNIQUE KEY `order_number_8` (`order_number`),
  ADD UNIQUE KEY `order_number_9` (`order_number`),
  ADD UNIQUE KEY `order_number_10` (`order_number`),
  ADD KEY `idx_order_status` (`status`),
  ADD KEY `idx_order_dates` (`start_date`,`end_date`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `vehicle_id` (`vehicle_id`),
  ADD KEY `vehicle_type_id` (`vehicle_type_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `mobile` (`mobile`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `mobile_2` (`mobile`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `mobile_3` (`mobile`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `mobile_4` (`mobile`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `mobile_5` (`mobile`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `mobile_6` (`mobile`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `mobile_7` (`mobile`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `mobile_8` (`mobile`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `mobile_9` (`mobile`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `mobile_10` (`mobile`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `mobile_11` (`mobile`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `number_plate` (`number_plate`),
  ADD UNIQUE KEY `number_plate_2` (`number_plate`),
  ADD UNIQUE KEY `number_plate_3` (`number_plate`),
  ADD UNIQUE KEY `number_plate_4` (`number_plate`),
  ADD UNIQUE KEY `number_plate_5` (`number_plate`),
  ADD UNIQUE KEY `number_plate_6` (`number_plate`),
  ADD UNIQUE KEY `number_plate_7` (`number_plate`),
  ADD UNIQUE KEY `number_plate_8` (`number_plate`),
  ADD UNIQUE KEY `number_plate_9` (`number_plate`),
  ADD UNIQUE KEY `number_plate_10` (`number_plate`),
  ADD KEY `idx_vehicle_status` (`status`),
  ADD KEY `idx_vehicle_city_state` (`city`,`state`),
  ADD KEY `idx_vehicle_vendor` (`vendor_id`),
  ADD KEY `idx_vehicle_type_category` (`vehicle_type_id`,`category_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `brand_id` (`brand_id`);

--
-- Indexes for table `vehicle_features`
--
ALTER TABLE `vehicle_features`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vehicle_id` (`vehicle_id`),
  ADD KEY `feature_id` (`feature_id`);

--
-- Indexes for table `vehicle_images`
--
ALTER TABLE `vehicle_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vehicle_id` (`vehicle_id`);

--
-- Indexes for table `vehicle_types`
--
ALTER TABLE `vehicle_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vendors`
--
ALTER TABLE `vendors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `gst_number` (`gst_number`),
  ADD UNIQUE KEY `pan_number` (`pan_number`),
  ADD UNIQUE KEY `gst_number_2` (`gst_number`),
  ADD UNIQUE KEY `pan_number_2` (`pan_number`),
  ADD UNIQUE KEY `gst_number_3` (`gst_number`),
  ADD UNIQUE KEY `pan_number_3` (`pan_number`),
  ADD UNIQUE KEY `gst_number_4` (`gst_number`),
  ADD UNIQUE KEY `pan_number_4` (`pan_number`),
  ADD UNIQUE KEY `gst_number_5` (`gst_number`),
  ADD UNIQUE KEY `pan_number_5` (`pan_number`),
  ADD UNIQUE KEY `gst_number_6` (`gst_number`),
  ADD UNIQUE KEY `pan_number_6` (`pan_number`),
  ADD UNIQUE KEY `gst_number_7` (`gst_number`),
  ADD UNIQUE KEY `pan_number_7` (`pan_number`),
  ADD UNIQUE KEY `gst_number_8` (`gst_number`),
  ADD UNIQUE KEY `pan_number_8` (`pan_number`),
  ADD UNIQUE KEY `gst_number_9` (`gst_number`),
  ADD UNIQUE KEY `pan_number_9` (`pan_number`),
  ADD UNIQUE KEY `gst_number_10` (`gst_number`),
  ADD UNIQUE KEY `pan_number_10` (`pan_number`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `features`
--
ALTER TABLE `features`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `my_fields`
--
ALTER TABLE `my_fields`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `vehicle_features`
--
ALTER TABLE `vehicle_features`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vehicle_images`
--
ALTER TABLE `vehicle_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT for table `vehicle_types`
--
ALTER TABLE `vehicle_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `vendors`
--
ALTER TABLE `vendors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `coupons`
--
ALTER TABLE `coupons`
  ADD CONSTRAINT `coupons_ibfk_28` FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_types` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_29` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_30` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `features`
--
ALTER TABLE `features`
  ADD CONSTRAINT `features_ibfk_1` FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_types` (`id`);

--
-- Constraints for table `menus`
--
ALTER TABLE `menus`
  ADD CONSTRAINT `menus_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `menus` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_28` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_29` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_30` FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_types` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD CONSTRAINT `vehicles_ibfk_37` FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `vehicles_ibfk_38` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `vehicles_ibfk_39` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `vehicles_ibfk_40` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `vehicle_features`
--
ALTER TABLE `vehicle_features`
  ADD CONSTRAINT `vehicle_features_ibfk_19` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `vehicle_features_ibfk_20` FOREIGN KEY (`feature_id`) REFERENCES `features` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `vehicle_images`
--
ALTER TABLE `vehicle_images`
  ADD CONSTRAINT `vehicle_images_ibfk_1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
