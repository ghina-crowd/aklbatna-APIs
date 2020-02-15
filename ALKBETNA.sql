-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 15, 2020 at 06:57 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.2.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ALKBETNA`
--

-- --------------------------------------------------------

--
-- Table structure for table `Banner`
--

CREATE TABLE `Banner` (
  `banner_id` int(225) NOT NULL,
  `image` varchar(225) NOT NULL,
  `description_ar` text DEFAULT '',
  `description_en` text NOT NULL DEFAULT '',
  `url` varchar(225) NOT NULL,
  `redirect` varchar(225) NOT NULL,
  `button` varchar(225) NOT NULL,
  `active` int(100) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Banner`
--

INSERT INTO `Banner` (`banner_id`, `image`, `description_ar`, `description_en`, `url`, `redirect`, `button`, `active`) VALUES
(2, '/images/1580978896423.jpg', '', '', '-', 'www.google.com', '1', 1),
(3, '/images/1581141980266.png', 'description_ar', 'description_en', '-', 'www.google.com', '1', 1);

-- --------------------------------------------------------

--
-- Table structure for table `Category`
--

CREATE TABLE `Category` (
  `category_id` int(225) NOT NULL,
  `name_ar` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `active` int(100) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Category`
--

INSERT INTO `Category` (`category_id`, `name_ar`, `name_en`, `image`, `active`) VALUES
(2, 'Pakistani Kitchen', 'Pakistani Kitchen', '/images/1580988418401.png', 1),
(3, 'INDIAN Kitchen', 'INDIAN Kitchen', '/images/1580988418417.jpg', 1),
(4, 'IRANI Kitchen', 'IRANI KITCHEN', '/images/1580988418434.jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `Contact`
--

CREATE TABLE `Contact` (
  `contact_id` int(11) NOT NULL,
  `name` varchar(225) NOT NULL,
  `email` varchar(225) NOT NULL,
  `message` text NOT NULL,
  `active` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Contact`
--

INSERT INTO `Contact` (`contact_id`, `name`, `email`, `message`, `active`) VALUES
(1, 'Muhammad', 'geeksera.online@gmail.com', 'china', 1),
(2, 'Muhammad', 'geeksera.online@gmail.com', 'china', 1);

-- --------------------------------------------------------

--
-- Table structure for table `Favourite`
--

CREATE TABLE `Favourite` (
  `favourite_id` int(225) NOT NULL,
  `user_id` int(225) NOT NULL,
  `meal_id` int(255) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `Kitchen`
--

CREATE TABLE `Kitchen` (
  `kitchen_id` int(225) NOT NULL,
  `category_id` int(225) NOT NULL,
  `user_id` int(225) NOT NULL,
  `image` varchar(225) NOT NULL,
  `name_ar` varchar(225) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `description_ar` text NOT NULL,
  `description_en` text NOT NULL,
  `final_rate` int(100) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `served_count` int(100) NOT NULL,
  `active` int(100) NOT NULL DEFAULT 1,
  `featured` int(100) NOT NULL DEFAULT 0,
  `final_order_pakaging_rate` int(225) NOT NULL DEFAULT 0,
  `final_value_rate` int(225) NOT NULL DEFAULT 0,
  `final_delivery_rate` int(225) NOT NULL DEFAULT 0,
  `final_quality_rate` int(225) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Kitchen`
--

INSERT INTO `Kitchen` (`kitchen_id`, `category_id`, `user_id`, `image`, `name_ar`, `name_en`, `description_ar`, `description_en`, `final_rate`, `start_time`, `end_time`, `served_count`, `active`, `featured`, `final_order_pakaging_rate`, `final_value_rate`, `final_delivery_rate`, `final_quality_rate`) VALUES
(1, 2, 1, '/images/1580971097562.jpg', 'HABIBAI RESTURENT', 'HABIBAI RESTURENT', 'Qui amet ad ad elit amet aliqua cupidatat adipisicing. Lorem duis consectetur ullamco quis commodo tempor officia excepteur. Officia labore esse elit et elit. Cillum ad dolor nulla irure aute duis. Sunt dolore aliquip do ex veniam nulla.\n', 'Qui amet ad ad elit amet aliqua cupidatat adipisicing. Lorem duis consectetur ullamco quis commodo tempor officia excepteur. Officia labore esse elit et elit. Cillum ad dolor nulla irure aute duis. Sunt dolore aliquip do ex veniam nulla.\n', 4, '11:00:00', '22:00:00', 0, 1, 0, 4, 4, 5, 4),
(3, 2, 1, '/images/1580971097562.jpg', 'ASHER CAFE', 'ASHER CAFE', 'Qui amet ad ad elit amet aliqua cupidatat adipisicing. Lorem duis consectetur ullamco quis commodo tempor officia excepteur. Officia labore esse elit et elit. Cillum ad dolor nulla irure aute duis. Sunt dolore aliquip do ex veniam nulla.\n', 'Qui amet ad ad elit amet aliqua cupidatat adipisicing. Lorem duis consectetur ullamco quis commodo tempor officia excepteur. Officia labore esse elit et elit. Cillum ad dolor nulla irure aute duis. Sunt dolore aliquip do ex veniam nulla.\n', 3, '10:00:00', '24:00:00', 0, 1, 1, 3, 0, 4, 3),
(4, 4, 1, '/images/1580971097562.jpg', 'CHAYEE WALA 1', 'CHAYEE WALA 1', 'Qui amet ad ad elit amet aliqua cupidatat adipisicing. Lorem duis consectetur ullamco quis commodo tempor officia excepteur. Officia labore esse elit et elit. Cillum ad dolor nulla irure aute duis. Sunt dolore aliquip do ex veniam nulla.\n', 'Qui amet ad ad elit amet aliqua cupidatat adipisicing. Lorem duis consectetur ullamco quis commodo tempor officia excepteur. Officia labore esse elit et elit. Cillum ad dolor nulla irure aute duis. Sunt dolore aliquip do ex veniam nulla.\n', 0, '10:00:00', '24:00:00', 0, 1, 0, 0, 0, 0, 0),
(5, 4, 1, '/images/1580971097562.jpg', 'CHAYEE WALA 2', 'CHAYEE WALA 2', 'Qui amet ad ad elit amet aliqua cupidatat adipisicing. Lorem duis consectetur ullamco quis commodo tempor officia excepteur. Officia labore esse elit et elit. Cillum ad dolor nulla irure aute duis. Sunt dolore aliquip do ex veniam nulla.\n', 'Qui amet ad ad elit amet aliqua cupidatat adipisicing. Lorem duis consectetur ullamco quis commodo tempor officia excepteur. Officia labore esse elit et elit. Cillum ad dolor nulla irure aute duis. Sunt dolore aliquip do ex veniam nulla.\n', 0, '10:00:00', '24:00:00', 0, 1, 1, 0, 0, 0, 0),
(6, 4, 1, '/images/1580971097562.jpg', 'CHAYEE WALA 3', 'CHAYEE WALA 3', 'Qui  ad ad elit amet aliqua cupidatat adipisicing. Lorem duis consectetur ullamco quis commodo tempor officia excepteur. Officia labore esse elit et elit. Cillum ad dolor nulla irure aute duis. Sunt dolore aliquip do ex veniam nulla.\n', 'Qui amet ad ad elit amet aliqua cupidatat adipisicing. Lorem duis consectetur ullamco quis commodo tempor officia excepteur. Officia labore esse elit et elit. Cillum ad dolor nulla irure aute duis. Sunt dolore aliquip do ex veniam nulla.\n', 0, '10:00:00', '24:00:00', 0, 1, 0, 0, 0, 0, 0),
(7, 4, 1, '/images/1580971097562.jpg', 'CHAYEE WALA', 'CHAYEE WALA', 'Qui ad ad elit amet aliqua cupidatat adipisicing. Lorem duis consectetur ullamco quis commodo tempor officia excepteur. Officia labore esse elit et elit. Cillum ad dolor nulla irure aute duis. Sunt dolore aliquip do ex veniam nulla.\n', 'Qui amet ad ad elit amet aliqua cupidatat adipisicing. Lorem duis consectetur ullamco quis commodo tempor officia excepteur. Officia labore esse elit et elit. Cillum ad dolor nulla irure aute duis. Sunt dolore aliquip do ex veniam nulla.\n', 0, '10:00:00', '24:00:00', 0, 1, 1, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `Meals`
--

CREATE TABLE `Meals` (
  `meal_id` int(225) NOT NULL,
  `menu_id` int(225) NOT NULL,
  `category_id` int(100) NOT NULL,
  `kitchen_id` int(100) NOT NULL,
  `name_ar` varchar(225) NOT NULL,
  `name_en` varchar(225) NOT NULL,
  `description_ar` text NOT NULL DEFAULT '',
  `description_en` text NOT NULL DEFAULT '',
  `image` varchar(225) NOT NULL,
  `type` int(10) NOT NULL,
  `price` int(100) NOT NULL,
  `price_monthly` int(150) NOT NULL,
  `price_weekly` int(100) NOT NULL,
  `total_served` int(225) NOT NULL,
  `active` int(100) NOT NULL DEFAULT 1,
  `featured` int(225) NOT NULL DEFAULT 0,
  `final_rate` int(100) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Meals`
--

INSERT INTO `Meals` (`meal_id`, `menu_id`, `category_id`, `kitchen_id`, `name_ar`, `name_en`, `description_ar`, `description_en`, `image`, `type`, `price`, `price_monthly`, `price_weekly`, `total_served`, `active`, `featured`, `final_rate`) VALUES
(2, 1, 2, 4, 'Soupe', 'Soupe', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', '/images/1580986894247.jpg', 2, 100, 150, 50, 0, 1, 1, 0),
(3, 5, 3, 5, 'Soupe', 'Soupe', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', '/images/1580986894198.jpg', 3, 89, 120, 45, 0, 1, 1, 0),
(4, 6, 4, 6, 'Soupe', 'Soupe', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', '/images/1580986894171.jpg', 2, 10, 100, 41, 12, 1, 1, 0),
(5, 1, 3, 4, 'Hot And Sour Soup', 'Hot And Sour Soup', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', '/images/1580975656044.jpg', 2, 10, 100, 40, 0, 1, 0, 0),
(6, 1, 3, 4, 'Szechuan Shrimp And Chicken Wontons', 'Szechuan Shrimp And Chicken Wontons', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', '/images/1580986894128.jpg', 2, 10, 100, 40, 0, 1, 1, 0),
(7, 1, 3, 4, 'Chicken Fillet Egg Fried Rice', 'Chicken Fillet Egg Fried Rice', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', '/images/1580986894122.jpg', 2, 10, 100, 40, 0, 1, 1, 5),
(8, 1, 3, 4, 'Clean Cut (Classic Flavor)', 'Clean Cut (Classic Flavor)', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', '/images/1580986894128.jpg', 2, 10, 100, 40, 2, 1, 0, 0),
(9, 1, 3, 4, 'lean Cut (Classic Flavor)', 'lean Cut (Classic Flavor)', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', '/images/1580986894279.jpg', 2, 10, 100, 40, 0, 1, 1, 2),
(10, 1, 3, 4, 'Coca-Cola', 'Coca-Cola', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', '/images/1580986894165.jpg', 3, 10, 100, 40, 0, 1, 1, 0),
(11, 1, 3, 4, 'Coca-Cola Light', 'Coca-Cola Light', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', '/images/1580975656044.jpg', 3, 10, 100, 40, 0, 1, 1, 0),
(12, 1, 3, 4, 'Coca-Cola Zero', 'Coca-Cola Zero', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', '/images/1580986894285.jpg', 3, 10, 100, 40, 0, 1, 1, 0),
(13, 1, 3, 4, 'Fanta', 'Fanta', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', '/images/1580986894285.jpg', 3, 10, 100, 40, 0, 1, 0, 0),
(14, 1, 3, 4, 'Sprite', 'Sprite', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', 'images/1580986894165.jpg', 3, 10, 100, 40, 0, 1, 0, 0),
(15, 1, 3, 4, '8 Pieces Baked Chicken Wings', '8 Pieces Baked Chicken Wings', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', '/images/1580986894115.jpg', 1, 10, 100, 40, 656, 1, 1, 0),
(16, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', 'Cillum esse et consequat in pariatur id ea adipisicing aliqua sunt. Mollit cupidatat proident quis elit eiusmod eu amet nulla anim incididunt consequat fugiat sint. Ullamco cupidatat dolore officia est incididunt amet nulla deserunt. Excepteur ut incididunt ullamco velit deserunt eu ut id ipsum ullamco ut laboris.                 ', '/images/1580986894059.jpg', 1, 10, 100, 40, 0, 1, 0, 4),
(17, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 0, 0),
(18, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 0, 0),
(19, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 0, 0),
(20, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 0, 0),
(21, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 0, 0),
(22, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 0, 0),
(23, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 0, 0),
(24, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 0, 0),
(25, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 2, 10, 100, 40, 0, 1, 0, 0),
(26, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 2, 10, 100, 40, 0, 1, 0, 0),
(27, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 2, 10, 100, 40, 0, 1, 0, 0),
(28, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 2, 10, 100, 40, 0, 1, 0, 0),
(29, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 2, 10, 100, 40, 0, 1, 0, 0),
(30, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 2, 10, 100, 40, 0, 1, 0, 0),
(31, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 2, 10, 100, 40, 0, 1, 0, 0),
(32, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 2, 10, 100, 40, 0, 1, 0, 0),
(33, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 3, 10, 100, 40, 0, 1, 0, 0),
(34, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 3, 10, 100, 40, 0, 1, 0, 0),
(35, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 3, 10, 100, 40, 0, 1, 0, 0),
(36, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 3, 10, 100, 40, 0, 1, 0, 0),
(37, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 3, 10, 100, 40, 0, 1, 0, 0),
(38, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 3, 10, 100, 40, 0, 1, 0, 0),
(39, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 4, 10, 100, 40, 0, 1, 0, 0),
(40, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 4, 10, 100, 40, 0, 1, 0, 0),
(41, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 4, 10, 100, 40, 0, 1, 0, 0),
(42, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 4, 10, 100, 40, 0, 1, 0, 0),
(43, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 4, 10, 100, 40, 0, 1, 0, 0),
(44, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 4, 10, 100, 40, 0, 1, 0, 0),
(45, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 4, 10, 100, 40, 0, 1, 0, 0),
(46, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 4, 10, 100, 40, 0, 1, 0, 0),
(47, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 4, 10, 100, 40, 0, 1, 0, 0),
(48, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 4, 10, 100, 40, 0, 1, 0, 0),
(49, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 4, 10, 100, 40, 0, 1, 0, 0),
(50, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 0, 0),
(51, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 0, 0),
(52, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 1, 0),
(53, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 0, 0),
(54, 1, 3, 4, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 0, 0),
(55, 1, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 0, 0),
(56, 1, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 0, 0),
(57, 1, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 0, 0),
(58, 1, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 1, 0),
(59, 1, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 0, 0),
(60, 1, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 0, 0),
(61, 1, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 1, 0),
(62, 1, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 0, 0),
(63, 1, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 1, 0),
(64, 1, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 1, 0),
(65, 1, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 1, 0),
(66, 1, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 1, 0),
(67, 2, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 1, 0),
(68, 2, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 1, 0),
(69, 2, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 1, 0),
(70, 2, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 1, 0),
(71, 2, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 1, 0),
(72, 2, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 1, 0),
(73, 3, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 1, 0),
(74, 3, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 1, 0),
(75, 3, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 1, 0),
(76, 3, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 1, 0),
(77, 3, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 1, 0),
(78, 3, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 1, 0),
(79, 3, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 1, 0),
(80, 3, 4, 5, '16 Pieces Baked Chicken Wings', '16 Pieces Baked Chicken Wings', '', '', '/images/1580975656044.jpg', 1, 10, 100, 40, 0, 1, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `Menu`
--

CREATE TABLE `Menu` (
  `menu_id` int(225) NOT NULL,
  `kitchen_id` int(225) NOT NULL,
  `name_ar` varchar(225) NOT NULL,
  `name_en` varchar(225) NOT NULL,
  `active` int(100) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Menu`
--

INSERT INTO `Menu` (`menu_id`, `kitchen_id`, `name_ar`, `name_en`, `active`) VALUES
(1, 1, 'Lahori', 'lahori', 1),
(2, 1, 'Mutton', 'Mutton', 1),
(3, 1, 'Chiken', 'Chiken', 1),
(5, 4, 'Lahori', 'lahori', 1),
(6, 5, 'Lahori', 'lahori', 1);

-- --------------------------------------------------------

--
-- Table structure for table `Reviews`
--

CREATE TABLE `Reviews` (
  `review_id` int(225) NOT NULL,
  `user_id` int(225) NOT NULL,
  `kitchen_id` int(225) DEFAULT NULL,
  `meal_id` int(225) DEFAULT NULL,
  `comment` text NOT NULL,
  `quality_rate` int(225) NOT NULL DEFAULT 0,
  `order_pakaging_rate` int(10) DEFAULT 0,
  `value_rate` int(10) NOT NULL DEFAULT 0,
  `delivery_rate` int(10) NOT NULL DEFAULT 0,
  `final_rate` int(100) NOT NULL DEFAULT 0,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `active` int(100) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Reviews`
--

INSERT INTO `Reviews` (`review_id`, `user_id`, `kitchen_id`, `meal_id`, `comment`, `quality_rate`, `order_pakaging_rate`, `value_rate`, `delivery_rate`, `final_rate`, `date`, `active`) VALUES
(1214, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-08 12:02:56', 0),
(1215, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-08 12:03:30', 0),
(1216, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-08 12:03:33', 0),
(1217, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-08 12:03:33', 0),
(1218, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-08 12:03:50', 0),
(1219, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-08 12:03:51', 0),
(1220, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-08 12:03:58', 0),
(1221, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-08 12:04:00', 0),
(1222, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-08 12:04:00', 0),
(1223, 1, NULL, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-08 12:04:56', 0),
(1224, 1, NULL, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-08 12:05:26', 0),
(1225, 1, NULL, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-08 12:05:27', 0),
(1226, 1, NULL, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-08 12:05:28', 0),
(1227, 1, NULL, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-08 12:05:28', 0),
(1228, 1, NULL, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-08 12:05:29', 0),
(1229, 1, NULL, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-08 12:05:41', 0),
(1230, 1, NULL, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-08 12:05:43', 0),
(1231, 1, NULL, 7, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 0, 0, 0, 0, 5, '2020-02-08 12:14:14', 0),
(1232, 1, NULL, 16, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 0, 0, 0, 0, 5, '2020-02-08 12:15:10', 0),
(1233, 1, NULL, 16, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 0, 0, 0, 0, 4, '2020-02-08 12:15:20', 0),
(1234, 1, NULL, 16, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 0, 0, 0, 0, 4, '2020-02-08 12:15:26', 0),
(1235, 1, NULL, 16, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 0, 0, 0, 0, 4, '2020-02-08 12:15:27', 0),
(1236, 1, NULL, 16, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 0, 0, 0, 0, 4, '2020-02-08 12:15:28', 0),
(1237, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-11 08:14:07', 0),
(1238, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-11 08:14:57', 0),
(1239, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-11 08:14:57', 0),
(1240, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-11 08:14:58', 0),
(1241, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-11 08:15:02', 0),
(1242, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-11 08:15:03', 0),
(1243, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-11 08:15:39', 0),
(1244, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-11 08:15:54', 0),
(1245, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-11 08:16:10', 0),
(1246, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-11 08:16:16', 0),
(1247, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-11 08:16:17', 0),
(1248, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-11 08:16:19', 0),
(1249, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-11 08:16:20', 0),
(1250, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-11 08:16:21', 0),
(1251, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-11 08:16:21', 0),
(1252, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-11 08:16:22', 0),
(1253, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-11 08:16:22', 0),
(1254, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-11 08:16:23', 0),
(1255, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-11 08:16:23', 0),
(1256, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-11 08:17:02', 0),
(1257, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-11 08:17:03', 0),
(1258, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 4, 4, 3, 5, 4, '2020-02-11 08:17:04', 0),
(1259, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 1, 1, 1, 1, 1, '2020-02-11 08:17:21', 0),
(1260, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 1, 1, 1, 1, 1, '2020-02-11 08:19:12', 0),
(1261, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 1, 1, 1, 1, 1, '2020-02-11 08:20:02', 0),
(1262, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 1, 1, 1, 1, 1, '2020-02-11 08:20:03', 0),
(1263, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 1, 1, 1, 1, 1, '2020-02-11 08:20:04', 0),
(1264, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 1, 1, 1, 1, 1, '2020-02-11 08:20:05', 0),
(1265, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 1, 1, 1, 1, 1, '2020-02-11 08:21:25', 0),
(1266, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 1, 1, 1, 1, 1, '2020-02-11 08:22:44', 0),
(1267, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 1, 1, 1, 1, 1, '2020-02-11 08:22:47', 0),
(1268, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 1, 1, 1, 1, 1, '2020-02-11 08:23:10', 0),
(1269, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 1, 1, 1, 1, 1, '2020-02-11 08:23:14', 0),
(1270, 1, 3, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 1, 1, 0, 1, 1, '2020-02-11 08:23:22', 0),
(1271, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 1, 1, 0, 1, 1, '2020-02-11 08:23:36', 0),
(1272, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 1, 1, 0, 1, 1, '2020-02-11 08:23:38', 0),
(1273, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 1, 1, 0, 1, 1, '2020-02-11 08:23:39', 0),
(1274, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 1, 1, 0, 1, 1, '2020-02-11 08:23:40', 0),
(1275, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 1, 1, 0, 1, 1, '2020-02-11 08:23:41', 0),
(1276, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 1, 1, 0, 1, 1, '2020-02-11 08:23:42', 0),
(1277, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 1, 1, 0, 1, 1, '2020-02-11 08:23:42', 0),
(1278, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 1, 1, 0, 1, 1, '2020-02-11 08:23:43', 0),
(1279, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 1, 1, 0, 1, 1, '2020-02-11 08:23:43', 0),
(1280, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:08', 0),
(1281, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:08', 0),
(1282, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:09', 0),
(1283, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:10', 0),
(1284, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:11', 0),
(1285, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:12', 0),
(1286, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:13', 0),
(1287, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:14', 0),
(1288, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:14', 0),
(1289, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:15', 0),
(1290, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:15', 0),
(1291, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:23', 0),
(1292, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:23', 0),
(1293, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:35', 0),
(1294, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:36', 0),
(1295, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:36', 0),
(1296, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:38', 0),
(1297, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:38', 0),
(1298, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:40', 0),
(1299, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:41', 0),
(1300, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:41', 0),
(1301, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:42', 0),
(1302, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:42', 0),
(1303, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:43', 0),
(1304, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:44', 0),
(1305, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:44', 0),
(1306, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:46', 0),
(1307, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:46', 0),
(1308, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:46', 0),
(1309, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:49', 0),
(1310, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:49', 0),
(1311, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:50', 0),
(1312, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:50', 0),
(1313, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:51', 0),
(1314, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:51', 0),
(1315, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:51', 0),
(1316, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:52', 0),
(1317, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:24:53', 0),
(1318, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:27:08', 0),
(1319, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:27:08', 0),
(1320, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:27:09', 0),
(1321, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:27:10', 0),
(1322, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:27:14', 0),
(1323, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:27:15', 0),
(1324, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:27:15', 0),
(1325, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:27:16', 0),
(1326, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:27:16', 0),
(1327, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:27:17', 0),
(1328, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:27:17', 0),
(1329, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:27:18', 0),
(1330, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:27:18', 0),
(1331, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:27:18', 0),
(1332, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:27:19', 0),
(1333, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:27:19', 0),
(1334, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:27:19', 0),
(1335, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:27:22', 0),
(1336, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:27:22', 0),
(1337, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:27:22', 0),
(1338, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:27:54', 0),
(1339, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:27:55', 0),
(1340, 1, 1, NULL, 'Qui amet ad ad elit amet aliqua cupidatat adipisicing.\n', 5, 5, 5, 5, 5, '2020-02-11 08:29:19', 0);

-- --------------------------------------------------------

--
-- Table structure for table `Types`
--

CREATE TABLE `Types` (
  `type_id` int(225) NOT NULL,
  `name_ar` varchar(225) NOT NULL,
  `name_en` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Types`
--

INSERT INTO `Types` (`type_id`, `name_ar`, `name_en`) VALUES
(1, 'NON VEG', 'NON VEG'),
(2, 'VEG', 'VEG'),
(3, 'CHICKEN', 'CHICKEN'),
(4, 'MUTTON', 'MUTTON'),
(5, 'Cool Drinks', 'Cool Drinks');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(225) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `profile` varchar(225) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `password` text NOT NULL,
  `user_type` varchar(225) NOT NULL,
  `otp` int(100) DEFAULT NULL,
  `active` int(100) NOT NULL DEFAULT 1,
  `joining_date` varchar(255) NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `profile`, `email`, `phone`, `password`, `user_type`, `otp`, `active`, `joining_date`) VALUES
(1, 'Sawera ', 'Asif', NULL, 'mhd.asif@crowd-ae.com', '123456789', '$2a$08$wDtrA8Sxoq8Y0p1zecIWFO5RngH5vWdMDTloboIZEmebkliv/eW.W', 'normal', 1375, 1, '2020-02-01 07:53:51'),
(2, 'muhamad', 'asif', NULL, 'geeks@gmail.com', '03473999070', '$2a$08$tYeu8poEPIe.6rNQsDUSk.mdxirY9kJf0RAfEEKB2ik65lAVu8/oy', 'normal', 9589, 0, '2020-02-09 11:30:32'),
(6, 'Asif', 'Shafee', 'http://graph.facebook.com/1085825375115459/picture?type=large&height=320&width=420', 'geeksera.online@gmail.com', NULL, '$2a$08$2bi4MIprZWeSX.xS0iAMVuHNpgOZge1ZNLlyQfqlbA5cwE/yHCR8.', 'normal', NULL, 1, '2020-02-13 06:52:01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Banner`
--
ALTER TABLE `Banner`
  ADD PRIMARY KEY (`banner_id`);

--
-- Indexes for table `Category`
--
ALTER TABLE `Category`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `Contact`
--
ALTER TABLE `Contact`
  ADD PRIMARY KEY (`contact_id`);

--
-- Indexes for table `Favourite`
--
ALTER TABLE `Favourite`
  ADD PRIMARY KEY (`favourite_id`);

--
-- Indexes for table `Kitchen`
--
ALTER TABLE `Kitchen`
  ADD PRIMARY KEY (`kitchen_id`);

--
-- Indexes for table `Meals`
--
ALTER TABLE `Meals`
  ADD PRIMARY KEY (`meal_id`);

--
-- Indexes for table `Menu`
--
ALTER TABLE `Menu`
  ADD PRIMARY KEY (`menu_id`);

--
-- Indexes for table `Reviews`
--
ALTER TABLE `Reviews`
  ADD PRIMARY KEY (`review_id`);

--
-- Indexes for table `Types`
--
ALTER TABLE `Types`
  ADD PRIMARY KEY (`type_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Banner`
--
ALTER TABLE `Banner`
  MODIFY `banner_id` int(225) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Category`
--
ALTER TABLE `Category`
  MODIFY `category_id` int(225) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Contact`
--
ALTER TABLE `Contact`
  MODIFY `contact_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Favourite`
--
ALTER TABLE `Favourite`
  MODIFY `favourite_id` int(225) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `Kitchen`
--
ALTER TABLE `Kitchen`
  MODIFY `kitchen_id` int(225) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `Meals`
--
ALTER TABLE `Meals`
  MODIFY `meal_id` int(225) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT for table `Menu`
--
ALTER TABLE `Menu`
  MODIFY `menu_id` int(225) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Reviews`
--
ALTER TABLE `Reviews`
  MODIFY `review_id` int(225) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1341;

--
-- AUTO_INCREMENT for table `Types`
--
ALTER TABLE `Types`
  MODIFY `type_id` int(225) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(225) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
