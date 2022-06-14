-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 14, 2022 at 06:30 AM
-- Server version: 10.4.18-MariaDB
-- PHP Version: 7.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `attendance`
--

DELIMITER $$
--
-- Functions
--
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_dateFormat` (`date` DATETIME) RETURNS VARCHAR(25) CHARSET utf8mb4 BEGIN DECLARE sql_var varchar(1000); set sql_var = (SELECT DATE_FORMAT(date, '%Y-%m-%d') AS CONVERTED_DATETIME); return sql_var; END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_dateTimeFormat` (`date` DATETIME) RETURNS VARCHAR(25) CHARSET utf8mb4 BEGIN
DECLARE sql_var varchar(1000);
set sql_var = (SELECT DATE_FORMAT(date, '%Y-%m-%d %h:%i:%s %p') AS CONVERTED_DATETIME);
return sql_var;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `attendance_logs`
--

CREATE TABLE `attendance_logs` (
  `log_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `in_time` datetime DEFAULT NULL,
  `out_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `department_name` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `created_by` int(11) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `department_name`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'Administrator123', '2022-05-26 08:41:19', 1, NULL, NULL),
(2, 'Information Technology', '2022-05-26 08:41:30', 1, NULL, NULL),
(3, 'Accounts', '2022-05-26 08:43:01', 1, NULL, NULL),
(4, 'Human Resources', '2022-05-26 08:44:51', 1, NULL, NULL),
(5, 'Quality Assurance', '2022-05-26 08:46:08', 1, NULL, NULL),
(6, 'Compliance 123', '2022-05-26 08:47:16', 1, NULL, NULL),
(7, 'Security', '2022-05-28 19:50:51', 1, NULL, NULL),
(8, 'Treasury', '2022-05-28 20:48:42', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `shift_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email_id` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `dob` date DEFAULT NULL,
  `contact_no` varchar(15) NOT NULL,
  `address` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL,
  `created_by` int(11) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `shift_id`, `full_name`, `email_id`, `password`, `dob`, `contact_no`, `address`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 6, 'Deep Shrestha', 'deepshrestha83@gmail', '$2a$08$AZKtiLnouopF4', '1983-07-28', '9851181046', 'Gwarko, Bafal', '2022-06-14 09:18:50', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `shifts`
--

CREATE TABLE `shifts` (
  `id` int(11) NOT NULL,
  `shift_name` enum('Regular','Morning','Evening','Night') NOT NULL,
  `start_week_day` enum('Sunday','Monday') NOT NULL,
  `allow_overtime` tinyint(1) DEFAULT NULL,
  `start_overtime` smallint(6) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `created_by` smallint(6) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` smallint(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `shifts`
--

INSERT INTO `shifts` (`id`, `shift_name`, `start_week_day`, `allow_overtime`, `start_overtime`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(6, 'Regular', 'Sunday', 1, 2, '2022-05-25 23:44:04', 1, NULL, NULL),
(7, 'Morning', 'Monday', 0, 1, '2022-05-25 23:49:16', 1, NULL, NULL),
(8, 'Evening', 'Sunday', 1, 3, '2022-05-25 23:50:24', 1, NULL, NULL),
(9, 'Night', 'Monday', 1, 2, '2022-05-25 23:50:56', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `working_days`
--

CREATE TABLE `working_days` (
  `id` int(11) NOT NULL,
  `working_day` varchar(10) NOT NULL,
  `start_time` varchar(10) NOT NULL,
  `end_time` varchar(10) NOT NULL,
  `created_at` datetime NOT NULL,
  `created_by` smallint(6) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` smallint(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `working_days`
--

INSERT INTO `working_days` (`id`, `working_day`, `start_time`, `end_time`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'Sunday', '9:30 AM', '6:00 PM', '2022-05-27 17:28:22', 1, NULL, NULL),
(2, 'Monday', '9:00 AM', '6:00 PM', '2022-05-27 17:29:43', 1, NULL, NULL),
(3, 'Tuesday', '9:30 AM', '06:30 PM', '2022-05-27 17:30:13', 1, NULL, NULL),
(4, 'Wednesday', '9:30 AM', '05:30 PM', '2022-05-27 17:30:33', 1, NULL, NULL),
(5, 'Thursday', '9:30 AM', '6:00 PM', '2022-05-27 17:30:59', 1, NULL, NULL),
(6, 'Friday', '9:30 AM', '2:30 PM', '2022-05-27 17:31:23', 1, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance_logs`
--
ALTER TABLE `attendance_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `fk_employees_attendance_logs` (`employee_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_employees_shifts` (`shift_id`);

--
-- Indexes for table `shifts`
--
ALTER TABLE `shifts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `working_days`
--
ALTER TABLE `working_days`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance_logs`
--
ALTER TABLE `attendance_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `shifts`
--
ALTER TABLE `shifts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `working_days`
--
ALTER TABLE `working_days`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance_logs`
--
ALTER TABLE `attendance_logs`
  ADD CONSTRAINT `fk_employees_attendance_logs` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `fk_employees_shifts` FOREIGN KEY (`shift_id`) REFERENCES `shifts` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
