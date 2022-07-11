-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 11, 2022 at 11:53 AM
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
(1, 'None', '2022-05-26 08:41:07', 1, NULL, NULL),
(2, 'Administrator', '2022-05-26 08:41:19', 1, NULL, NULL),
(3, 'Information Technology', '2022-05-26 08:41:30', 1, NULL, NULL),
(4, 'Accounts', '2022-05-26 08:43:01', 1, NULL, NULL),
(5, 'Human Resources', '2022-05-26 08:44:51', 1, NULL, NULL),
(6, 'Quality Assurance', '2022-05-26 08:46:08', 1, NULL, NULL),
(7, 'Compliance', '2022-05-26 08:47:16', 1, NULL, NULL),
(8, 'Security', '2022-05-28 19:50:51', 1, NULL, NULL),
(9, 'Treasury', '2022-05-28 20:48:42', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `designations`
--

CREATE TABLE `designations` (
  `id` int(11) NOT NULL,
  `designation_name` varchar(50) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `designations`
--

INSERT INTO `designations` (`id`, `designation_name`, `created_by`, `created_at`, `updated_by`, `updated_at`) VALUES
(1, 'None', 1, '2022-07-03 09:04:19', NULL, NULL),
(2, 'Administrator', 1, '2022-07-03 09:05:07', NULL, NULL),
(3, 'Software Engineer', 1, '2022-07-03 09:05:07', NULL, NULL),
(4, 'Web Designer', 1, '2022-07-03 09:05:07', NULL, NULL),
(5, 'Quality Assurance', 1, '2022-07-03 09:05:07', NULL, NULL),
(6, 'Team Leader', 1, '2022-07-03 09:05:07', NULL, NULL),
(7, 'Project Manager', 1, '2022-07-03 09:05:07', NULL, NULL),
(8, 'Director', 1, '2022-07-03 09:05:07', NULL, NULL),
(9, 'Chief Executive Officer', 1, '2022-07-03 09:05:07', NULL, NULL),
(10, 'Chief Technology Officer', 1, '2022-07-03 09:05:07', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `shift_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `designation_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email_id` varchar(40) NOT NULL,
  `password` varchar(200) NOT NULL,
  `dob` date DEFAULT NULL,
  `gender` enum('Male','Female') NOT NULL DEFAULT 'Male',
  `contact_no` varchar(15) NOT NULL,
  `address` varchar(100) NOT NULL,
  `photo` varchar(200) NULL,
  `join_date` date NOT NULL DEFAULT '1980-01-01',
  `agreement_type` enum('None','Contract','Probation','Temporary','Permanent') NOT NULL,
  `created_at` datetime NOT NULL,
  `created_by` int(11) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `leave_master`
--

INSERT INTO `employees` (`id`, `shift_id`, `department_id`, `role_id`, `designation_id`, `full_name`, `email_id`, `password`, `dob`, `contact_no`, `address`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 2, 2, 2, 2, 'Admin', 'admin@gmail.com', '$2a$08$u1hbs7m.vRBqkm5HvcgXP.x8A6lT2ynZ4EIv2YcpdfcVjZwBTmt0.', '2000-06-01', '9813123456', 'Satdobato', '2022-06-14 13:45:28', 1, NULL, NULL);

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
(1, 0, 'None', '2022-06-14 14:41:39', 1, NULL, NULL),
(2, 0, 'Admin', '2022-06-14 14:41:45', 1, NULL, NULL),
(3, 0, 'HR', '2022-06-14 14:47:45', 1, NULL, NULL),
(4, 0, 'Manager', '2022-06-14 14:49:05', 1, NULL, NULL),
(5, 3, 'Supervisor', '2022-06-14 14:49:48', 1, NULL, NULL),
(6, 4, 'Employee', '2022-06-14 14:55:46', 1, NULL, NULL),
(7, 0, 'Executive Director', '2022-06-23 08:54:05', 1, NULL, NULL),
(8, 4, 'Trainee', '2022-06-23 08:54:16', 1, NULL, NULL),
(9, 4, 'Intership', '2022-06-23 08:54:28', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `shifts`
--

CREATE TABLE `shifts` (
  `id` int(11) NOT NULL,
  `shift_name` enum('None','Regular','Morning','Evening','Night') NOT NULL,
  `start_week_day` enum('None','Sunday','Monday') NOT NULL,
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
(1, 'None', 'None', 0, 0, '2022-05-25 23:44:04', 1, NULL, NULL),
(2, 'Regular', 'Sunday', 1, 2, '2022-05-25 23:44:04', 1, NULL, NULL),
(3, 'Morning', 'Monday', 0, 1, '2022-05-25 23:49:16', 1, NULL, NULL),
(4, 'Evening', 'Sunday', 0, 3, '2022-05-25 23:50:24', 1, NULL, NULL),
(5, 'Night', 'Monday', 1, 2, '2022-05-25 23:50:56', 1, NULL, NULL);

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
-- Indexes for table `designations`
--
ALTER TABLE `designations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_employee_department` (`department_id`),
  ADD KEY `fk_employees_shifts` (`shift_id`),
  ADD KEY `fk_employee_role` (`role_id`),
  ADD KEY `fk_employee_designation` (`designation_id`);

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
-- AUTO_INCREMENT for table `designations`
--
ALTER TABLE `designations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  ADD CONSTRAINT `fk_employee_designation` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON DELETE CASCADE,
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
