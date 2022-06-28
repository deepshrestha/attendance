-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 28, 2022 at 07:04 AM
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
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_dateFormat` (`date` DATETIME) RETURNS VARCHAR(25) CHARSET utf8mb4 BEGIN 
DECLARE sql_var varchar(1000); 
set sql_var = (SELECT DATE_FORMAT(date, '%Y-%m-%d') AS CONVERTED_DATETIME); 
return sql_var; 
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_dateTimeFormat` (`date` DATETIME) RETURNS VARCHAR(25) CHARSET utf8mb4 BEGIN DECLARE sql_var varchar(1000); set sql_var = (SELECT DATE_FORMAT(date, '%Y-%m-%d %h:%i:%s %p') AS CONVERTED_DATETIME); return sql_var; END$$

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
(1, 'Administrator', '2022-05-26 08:41:19', 1, NULL, NULL),
(2, 'Information Technology', '2022-05-26 08:41:30', 1, NULL, NULL),
(3, 'Accounts', '2022-05-26 08:43:01', 1, NULL, NULL),
(4, 'Human Resources', '2022-05-26 08:44:51', 1, NULL, NULL),
(5, 'Quality Assurance', '2022-05-26 08:46:08', 1, NULL, NULL),
(6, 'Compliance', '2022-05-26 08:47:16', 1, NULL, NULL),
(7, 'Security', '2022-05-28 19:50:51', 1, NULL, NULL),
(8, 'Treasury', '2022-05-28 20:48:42', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `shift_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email_id` varchar(40) NOT NULL,
  `password` varchar(200) NOT NULL,
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

INSERT INTO `employees` (`id`, `shift_id`, `department_id`, `role_id`, `full_name`, `email_id`, `password`, `dob`, `contact_no`, `address`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 6, 1, 1, 'Admin', 'admin@gmail.com', '$2a$08$u1hbs7m.vRBqkm5HvcgXP.x8A6lT2ynZ4EIv2YcpdfcVjZwBTmt0.', '2000-06-01', '9813123456', 'Satdobato', '2022-06-14 13:45:28', 1, NULL, NULL),
(2, 6, 2, 3, 'Pranaya Raghubanshi', 'praghubanshi12@gmail.com', '$2a$08$u1hbs7m.vRBqkm5HvcgXP.x8A6lT2ynZ4EIv2YcpdfcVjZwBTmt0.', '1997-06-29', '9813815037', 'Kupondole, Lalitpur', '2022-06-14 17:35:50', 1, NULL, NULL),
(3, 6, 2, 5, 'Binit Shrestha', 'binit@gmail.com', '$2a$08$XiO40UoqLdawnvjofJDsYOQ7mFgdJRkmWpx6iTMVeHsS0aKLD3vGq', '1991-06-17', '9841562738', 'Babarmahal', '2022-06-17 22:41:06', 1, NULL, NULL),
(4, 6, 2, 4, 'Hari Shrestha', 'haritest@gmail.com', '$2a$08$0FZ21N3Fwo9KGzoAjpIkQe6rbH/tCkAz2.OGgX1fjZqNN5th.4Lg2', '1978-10-10', '9851090896', 'Pulchowk', '2022-06-17 22:43:42', 1, NULL, NULL),
(5, 6, 2, 4, 'Yogesh Karki', 'yogeshtest@gmail.com', '$2a$08$yZ4gGuS808ugqJNdV9TiP.OoCoTlwY/hixf2A1XslglcDTq9uCtym', '1999-06-18', '9841567867', 'Test', '2022-06-18 14:56:12', 1, NULL, NULL),
(6, 6, 1, 6, 'Dixanta Bahadur Shrestha', 'dixanta@gmail.com', '$2a$08$Aa0uyV400Rchzb3RJCmTIO93jya0APd6tJl0vK0mSaTWfsNZ3zlAK', '1982-08-12', '9849056900', 'Kumaripati', '2022-06-23 09:09:31', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `holidays`
--

CREATE TABLE `holidays` (
  `id` int(11) NOT NULL,
  `holiday_name` varchar(100) NOT NULL,
  `holiday_date` date NOT NULL,
  `remaining_days` int(11) DEFAULT NULL,
  `category` enum('national','regional') DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `created_by` int(11) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `holidays`
--

INSERT INTO `holidays` (`id`, `holiday_name`, `holiday_date`, `remaining_days`, `category`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'Nepali New Year', '2022-04-14', NULL, 'national', '2022-06-24 01:24:24', 1, NULL, NULL),
(2, 'Ubhauli Parba', '2022-05-16', NULL, 'regional', '2022-06-24 01:24:24', 1, NULL, NULL),
(3, 'Buddha Jayanti', '2022-05-16', NULL, 'national', '2022-06-24 01:24:24', 1, NULL, NULL),
(4, 'Republic Day', '2022-05-29', NULL, '', '2022-06-24 01:24:24', 1, NULL, NULL),
(5, 'Janai Purnima', '2022-08-12', NULL, 'national', '2022-06-24 01:24:24', 1, NULL, NULL),
(6, 'Raksha Bandhan', '2022-08-12', NULL, 'national', '2022-06-24 01:24:24', 1, NULL, NULL),
(7, 'Gaijatra (KTM valley only)', '2022-08-12', NULL, '', '2022-06-24 01:24:24', 1, NULL, NULL),
(8, 'Shree Krishna Janmasthami Brata', '2022-08-19', NULL, 'national', '2022-06-24 01:24:24', 1, NULL, NULL),
(9, 'Indra Jatra (KTM valley only)', '2022-09-09', NULL, '', '2022-06-24 01:24:24', 1, NULL, NULL),
(10, 'Constitution Day', '2022-09-19', NULL, '', '2022-06-24 01:24:24', 1, NULL, NULL),
(11, 'Ghatasthapana', '2022-09-26', NULL, 'national', '2022-06-24 01:24:24', 1, NULL, NULL),
(12, 'Phulpati', '2022-10-02', NULL, 'national', '2022-06-24 01:24:24', 1, NULL, NULL),
(13, 'Mahaastami', '2022-10-03', NULL, 'national', '2022-06-24 01:24:24', 1, NULL, NULL),
(14, 'Mahanawami', '2022-10-04', NULL, 'national', '2022-06-24 01:24:24', 1, NULL, NULL),
(15, 'Vijaya Dashami (Bada Dashain)', '2022-10-05', NULL, 'national', '2022-06-24 01:24:24', 1, NULL, NULL),
(16, 'Laxmi Puja', '2022-10-24', NULL, 'national', '2022-06-24 01:24:25', 1, NULL, NULL),
(17, 'Gai Tihar', '2022-10-25', NULL, '', '2022-06-24 01:24:25', 1, NULL, NULL),
(18, 'Gobardhan Pooja', '2022-10-26', NULL, '', '2022-06-24 01:24:25', 1, NULL, NULL),
(19, 'Nepal Sambat Starts', '2022-10-26', NULL, 'national', '2022-06-24 01:24:25', 1, NULL, NULL),
(20, 'Mha Pooja', '2022-10-26', NULL, 'regional', '2022-06-24 01:24:25', 1, NULL, NULL),
(21, 'Bhai Tika (Kija Puja)', '2022-10-27', NULL, 'national', '2022-06-24 01:24:25', 1, NULL, NULL),
(22, 'Chhath Parba', '2022-10-30', NULL, 'regional', '2022-06-24 01:24:25', 1, NULL, NULL),
(23, 'Guru Nanak Jayanti (Sikh only)', '2022-11-08', NULL, '', '2022-06-24 01:24:25', 1, NULL, NULL),
(24, 'Yomari Punhi', '2022-12-08', NULL, 'regional', '2022-06-24 01:24:25', 1, NULL, NULL),
(25, 'Christmas (Christian only)', '2022-12-25', NULL, 'regional', '2022-06-24 01:24:25', 1, NULL, NULL),
(26, 'Tamu Lhosar', '2022-12-30', NULL, 'regional', '2022-06-24 01:24:25', 1, NULL, NULL),
(27, 'Sonam Lhosar', '2023-01-22', NULL, 'regional', '2022-06-24 01:24:25', 1, NULL, NULL),
(28, 'Maha Shivaratri', '2023-02-18', NULL, 'national', '2022-06-24 01:24:25', 1, NULL, NULL),
(29, 'Gyalpo Lhosar', '2023-02-21', NULL, 'regional', '2022-06-24 01:24:25', 1, NULL, NULL),
(30, 'Pahadma Holi', '2023-03-06', NULL, 'national', '2022-06-24 01:24:25', 1, NULL, NULL),
(31, 'Terai Holi', '2023-03-07', NULL, 'regional', '2022-06-24 01:24:26', 1, NULL, NULL),
(32, 'Ghode Jatra (KTM valley only)', '2023-03-21', NULL, '', '2022-06-24 01:24:26', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `leave_master`
--

CREATE TABLE `leave_master` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `leave_days` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `leave_master`
--

INSERT INTO `leave_master` (`id`, `name`, `leave_days`, `created_by`, `created_at`, `updated_by`, `updated_at`) VALUES
(1, 'Annual Leave', 15, 1, '2022-06-16 09:00:25', NULL, NULL),
(2, 'Sick Leave', 12, 1, '2022-06-16 09:00:48', NULL, NULL),
(3, 'Casual Leave', 12, 1, '2022-06-16 09:00:57', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `leave_request`
--

CREATE TABLE `leave_request` (
  `id` int(11) NOT NULL,
  `leave_master_id` int(11) NOT NULL,
  `requested_by` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `leave_count_days` int(11) NOT NULL,
  `requested_to` varchar(20) NOT NULL,
  `requested_at` datetime NOT NULL,
  `remarks` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `leave_request`
--

INSERT INTO `leave_request` (`id`, `leave_master_id`, `requested_by`, `start_date`, `end_date`, `leave_count_days`, `requested_to`, `requested_at`, `remarks`) VALUES
(1, 3, 3, '2022-06-27', '2022-06-28', 2, '4', '2022-06-27 19:30:13', 'Tested'),
(3, 3, 3, '2022-07-04', '2022-07-05', 2, '4', '2022-06-28 01:00:32', ''),
(4, 3, 3, '2022-07-11', '2022-07-18', 8, '4', '2022-06-28 01:03:50', 'Tested');

-- --------------------------------------------------------

--
-- Table structure for table `leave_request_detail`
--

CREATE TABLE `leave_request_detail` (
  `leave_request_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  `status_date` datetime NOT NULL,
  `leave_processed_by` int(11) NOT NULL,
  `remarks` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `leave_request_detail`
--

INSERT INTO `leave_request_detail` (`leave_request_id`, `status_id`, `status_date`, `leave_processed_by`, `remarks`) VALUES
(1, 1, '2022-06-28 00:59:40', 4, ''),
(3, 1, '2022-06-28 01:02:43', 4, ''),
(4, 2, '2022-06-28 01:04:10', 4, '');

-- --------------------------------------------------------

--
-- Table structure for table `leave_status`
--

CREATE TABLE `leave_status` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `leave_status`
--

INSERT INTO `leave_status` (`id`, `name`, `created_by`, `created_at`, `updated_by`, `updated_at`) VALUES
(1, 'Approved', 1, '2022-06-16 09:01:26', NULL, NULL),
(2, 'Rejected', 1, '2022-06-16 09:01:35', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `role_name` varchar(30) NOT NULL,
  `created_at` datetime NOT NULL,
  `created_by` int(11) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `parent_id`, `role_name`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 6, 'Admin', '2022-06-14 14:41:45', 1, NULL, NULL),
(2, 0, 'HR', '2022-06-14 14:47:45', 1, NULL, NULL),
(3, 0, 'Manager', '2022-06-14 14:49:05', 1, NULL, NULL),
(4, 3, 'Supervisor', '2022-06-14 14:49:48', 1, NULL, NULL),
(5, 4, 'Employee', '2022-06-14 14:55:46', 1, NULL, NULL),
(6, 0, 'Executive Director', '2022-06-23 08:54:05', 1, NULL, NULL);

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
(8, 'Evening', 'Sunday', 0, 3, '2022-05-25 23:50:24', 1, NULL, NULL),
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
  ADD UNIQUE KEY `email_id` (`email_id`),
  ADD KEY `fk_employee_department` (`department_id`),
  ADD KEY `fk_employees_shifts` (`shift_id`),
  ADD KEY `fk_employee_role` (`role_id`);

--
-- Indexes for table `holidays`
--
ALTER TABLE `holidays`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leave_master`
--
ALTER TABLE `leave_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leave_request`
--
ALTER TABLE `leave_request`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_leave_request_master` (`leave_master_id`);

--
-- Indexes for table `leave_request_detail`
--
ALTER TABLE `leave_request_detail`
  ADD PRIMARY KEY (`leave_request_id`,`status_id`),
  ADD KEY `fk_leave_status_request_dtl` (`status_id`);

--
-- Indexes for table `leave_status`
--
ALTER TABLE `leave_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `holidays`
--
ALTER TABLE `holidays`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `leave_master`
--
ALTER TABLE `leave_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `leave_request`
--
ALTER TABLE `leave_request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `leave_status`
--
ALTER TABLE `leave_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `shifts`
--
ALTER TABLE `shifts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `working_days`
--
ALTER TABLE `working_days`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance_logs`
--
ALTER TABLE `attendance_logs`
  ADD CONSTRAINT `fk_employees_attendance_logs` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `fk_employee_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_employee_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_employees_shifts` FOREIGN KEY (`shift_id`) REFERENCES `shifts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `leave_request`
--
ALTER TABLE `leave_request`
  ADD CONSTRAINT `fk_leave_request_master` FOREIGN KEY (`leave_master_id`) REFERENCES `leave_master` (`id`);

--
-- Constraints for table `leave_request_detail`
--
ALTER TABLE `leave_request_detail`
  ADD CONSTRAINT `fk_leave_request_dtl` FOREIGN KEY (`leave_request_id`) REFERENCES `leave_request` (`id`),
  ADD CONSTRAINT `fk_leave_status_request_dtl` FOREIGN KEY (`status_id`) REFERENCES `leave_status` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
