-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 01 Feb 2026 pada 17.34
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hris_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `attendance`
--

CREATE TABLE `attendance` (
  `id` int(10) UNSIGNED NOT NULL,
  `employee_id` int(10) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `check_in` datetime DEFAULT NULL,
  `check_out` datetime DEFAULT NULL,
  `type` enum('present','annual_leave','sick_leave','absent') DEFAULT 'present',
  `status_approve` enum('waiting','approved','rejected') DEFAULT 'waiting',
  `work_hours` int(10) UNSIGNED DEFAULT NULL,
  `location_name` varchar(150) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `lat` decimal(10,8) DEFAULT NULL,
  `lng` decimal(11,8) DEFAULT NULL,
  `proof_url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `attendance`
--

INSERT INTO `attendance` (`id`, `employee_id`, `date`, `check_in`, `check_out`, `type`, `status_approve`, `work_hours`, `location_name`, `address`, `lat`, `lng`, `proof_url`, `created_at`, `updated_at`) VALUES
(1, 8, '2026-02-01', '2026-02-01 23:11:15', NULL, 'present', 'waiting', NULL, 'cm labs', 'Jalan Soka, Lowokwaru, Kota Malang, Jawa Timur, Jawa, 65122, Indonesia', -7.95451709, 112.63286591, NULL, '2026-02-01 23:11:15', '2026-02-01 23:11:15'),
(2, 5, '2026-02-01', NULL, NULL, 'annual_leave', 'waiting', NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-01 23:15:32', '2026-02-01 23:15:32'),
(3, 9, '2026-02-01', '2026-02-01 23:22:12', NULL, 'present', 'waiting', NULL, 'cmlabs', 'cmlabs Malang, 9, Jalan Seruni, Lowokwaru, Kota Malang, Jawa Timur, Jawa, 65122, Indonesia', -7.95468710, 112.63220072, NULL, '2026-02-01 23:22:12', '2026-02-01 23:22:12');

-- --------------------------------------------------------

--
-- Struktur dari tabel `companies`
--

CREATE TABLE `companies` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `companies`
--

INSERT INTO `companies` (`id`, `name`, `username`, `address`, `created_at`, `updated_at`) VALUES
(3, 'TechCorp', NULL, NULL, '2026-01-09 07:30:58', '2026-01-09 07:30:58'),
(4, 'Perbarindo', NULL, NULL, '2026-01-09 08:32:59', '2026-01-09 08:32:59'),
(6, 'Azure', NULL, NULL, '2026-02-01 21:10:16', '2026-02-01 21:10:16');

-- --------------------------------------------------------

--
-- Struktur dari tabel `employees`
--

CREATE TABLE `employees` (
  `id` int(10) UNSIGNED NOT NULL,
  `company_id` int(10) UNSIGNED NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `branch` varchar(100) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `grade` varchar(50) DEFAULT NULL,
  `employment_status` enum('tetap','kontrak','magang','outsourcing','resign') DEFAULT NULL,
  `nik` varchar(30) DEFAULT NULL,
  `education` varchar(100) DEFAULT NULL,
  `place_of_birth` varchar(100) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `bank_account_number` varchar(50) DEFAULT NULL,
  `bank_account_holder` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `employees`
--

INSERT INTO `employees` (`id`, `company_id`, `first_name`, `last_name`, `gender`, `phone`, `branch`, `position`, `grade`, `employment_status`, `nik`, `education`, `place_of_birth`, `date_of_birth`, `bank_name`, `bank_account_number`, `bank_account_holder`, `created_at`, `updated_at`, `email`) VALUES
(5, 6, 'Putri', 'Alya', 'female', '123456', 'Jombang', 'Karyawan', 'B', 'magang', '123456', 'SMK', 'Surabaya', '2002-04-17', 'BCA', '123456', 'Putri', '2026-02-01 22:16:37', '2026-02-01 22:16:37', 'putri@gmail.com'),
(8, 6, 'Raka', 'Dion', 'male', '123', 'Jakarta', 'Karyawan', 'A', 'tetap', '123', 'SMA/SMK', 'Jombang', '1998-06-16', '123', '123', 'Raka', '2026-02-01 22:35:59', '2026-02-01 22:35:59', 'raka@gmail.com'),
(9, 6, 'Lukman', 'Aji', 'male', '123', 'Jaksel', 'Manager', 'A', 'tetap', '123', 'D3', 'Jakarta', '2000-06-07', 'BNI', '123', 'Lukman', '2026-02-01 22:45:55', '2026-02-01 22:45:55', 'lukman@gmail.com');

-- --------------------------------------------------------

--
-- Struktur dari tabel `packages`
--

CREATE TABLE `packages` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `price_per_user` decimal(12,2) NOT NULL,
  `duration_months` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `min_employees` int(10) UNSIGNED DEFAULT NULL,
  `max_employees` int(10) UNSIGNED DEFAULT NULL,
  `level` enum('standard','premium','ultra') NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `packages`
--

INSERT INTO `packages` (`id`, `name`, `description`, `price_per_user`, `duration_months`, `min_employees`, `max_employees`, `level`, `created_at`, `updated_at`) VALUES
(1, 'Standard', 'This package for up to 50 employee', 15000.00, 1, 1, 50, 'standard', '2026-02-01 22:13:04', '2026-02-01 22:13:04'),
(2, 'Premium', 'This package for up to 100 employee', 12000.00, 1, 51, 100, 'premium', '2026-02-01 22:13:04', '2026-02-01 22:13:04'),
(3, 'Ultra', 'This package for up to 150 employee', 19000.00, 1, 101, 150, 'ultra', '2026-02-01 22:13:04', '2026-02-01 22:13:04');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data untuk tabel `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20260103000130-add-email-to-employee.js'),
('20260107012850-update-user-role-enum.js'),
('20260109064337-add-duration-months-to-packages.js');

-- --------------------------------------------------------

--
-- Struktur dari tabel `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` int(10) UNSIGNED NOT NULL,
  `company_id` int(10) UNSIGNED NOT NULL,
  `package_id` int(10) UNSIGNED NOT NULL,
  `billing_period` enum('single','monthly') NOT NULL,
  `team_size_group` varchar(20) DEFAULT NULL,
  `num_employees` int(10) UNSIGNED NOT NULL,
  `price_per_user` decimal(12,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `tax` decimal(12,2) NOT NULL,
  `total` decimal(12,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('active','expired','pending') DEFAULT 'pending',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `company_id`, `package_id`, `billing_period`, `team_size_group`, `num_employees`, `price_per_user`, `subtotal`, `tax`, `total`, `start_date`, `end_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 6, 3, 'monthly', '101-150', 120, 19000.00, 2280000.00, 250800.00, 2530800.00, '2026-02-01', '2026-03-01', 'active', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin_system','admin_company','user') NOT NULL DEFAULT 'user',
  `employee_id` int(10) UNSIGNED DEFAULT NULL,
  `company_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `phone`, `password`, `role`, `employee_id`, `company_id`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'TechCorp', 'techcorp@gmail.com', NULL, '$2b$10$IccXdncKMkMW.n2ezrDPv.NIGFCxZzQF9UGoh5PgUHI6a4Y8VLVRm', 'admin_company', NULL, 3, '2026-01-09 07:30:58', '2026-01-09 07:30:58'),
(2, 'Admin', 'Perbarindo', 'perbarindo@gmail.com', NULL, '$2b$10$pEZ/O0Z9Th2mtMxANdavxOMa.2lOFAuzMP4ghFU5CCslI7SRhnPDm', 'admin_company', NULL, 4, '2026-01-09 08:32:59', '2026-01-09 08:32:59'),
(4, 'Admin', 'Azure', 'azure@gmail.com', NULL, '$2b$10$x3ZiYoBbkEuXsOAV4m8Vs.AX9ug87YLCRaxyPecXYxSF9g4g2vaVi', 'admin_company', NULL, 6, '2026-02-01 21:10:16', '2026-02-01 21:10:16'),
(5, 'Putri', 'Alya', 'putri@gmail.com', NULL, '$2b$10$XY2YBGaG/zyRjDy8zqALLudmiRtVULk39kiXhc3CvUAJbLlUEsWMy', 'user', 5, 6, '2026-02-01 22:16:37', '2026-02-01 22:16:37'),
(8, 'Raka', 'Dion', 'raka@gmail.com', NULL, '$2b$10$iJNbhmWHr7lSJUoshhU9zewXq0whX7WsVoMlPS6VHUzqdX8r7fKi.', 'user', 8, 6, '2026-02-01 22:35:59', '2026-02-01 22:35:59'),
(9, 'Lukman', 'Aji', 'lukman@gmail.com', NULL, '$2b$10$UWJokd2EyHLugx.486O6XODxzfulTOEUhvchML/DhSLjZ89L6S32K', 'user', 9, 6, '2026-02-01 22:45:55', '2026-02-01 22:45:55');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indeks untuk tabel `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `username_34` (`username`),
  ADD UNIQUE KEY `username_35` (`username`),
  ADD UNIQUE KEY `username_36` (`username`),
  ADD UNIQUE KEY `username_37` (`username`),
  ADD UNIQUE KEY `username_38` (`username`),
  ADD UNIQUE KEY `username_39` (`username`),
  ADD UNIQUE KEY `username_40` (`username`),
  ADD UNIQUE KEY `username_41` (`username`),
  ADD UNIQUE KEY `username_42` (`username`),
  ADD UNIQUE KEY `username_43` (`username`),
  ADD UNIQUE KEY `username_44` (`username`),
  ADD UNIQUE KEY `username_45` (`username`),
  ADD UNIQUE KEY `username_46` (`username`),
  ADD UNIQUE KEY `username_47` (`username`),
  ADD UNIQUE KEY `username_48` (`username`),
  ADD UNIQUE KEY `username_49` (`username`),
  ADD UNIQUE KEY `username_50` (`username`),
  ADD UNIQUE KEY `username_51` (`username`),
  ADD UNIQUE KEY `username_52` (`username`),
  ADD UNIQUE KEY `username_53` (`username`),
  ADD UNIQUE KEY `username_54` (`username`),
  ADD UNIQUE KEY `username_55` (`username`),
  ADD UNIQUE KEY `username_56` (`username`),
  ADD UNIQUE KEY `username_57` (`username`),
  ADD UNIQUE KEY `username_58` (`username`),
  ADD UNIQUE KEY `username_59` (`username`),
  ADD UNIQUE KEY `username_60` (`username`),
  ADD UNIQUE KEY `username_61` (`username`),
  ADD UNIQUE KEY `username_62` (`username`),
  ADD UNIQUE KEY `username_63` (`username`),
  ADD UNIQUE KEY `unique_username` (`username`),
  ADD UNIQUE KEY `username_2` (`username`),
  ADD UNIQUE KEY `username_3` (`username`),
  ADD UNIQUE KEY `username_4` (`username`),
  ADD UNIQUE KEY `username_5` (`username`),
  ADD UNIQUE KEY `username_6` (`username`),
  ADD UNIQUE KEY `username_7` (`username`),
  ADD UNIQUE KEY `username_8` (`username`),
  ADD UNIQUE KEY `username_9` (`username`),
  ADD UNIQUE KEY `username_10` (`username`),
  ADD UNIQUE KEY `username_11` (`username`),
  ADD UNIQUE KEY `username_12` (`username`),
  ADD UNIQUE KEY `username_13` (`username`),
  ADD UNIQUE KEY `username_14` (`username`);

--
-- Indeks untuk tabel `employees`
--
ALTER TABLE `employees`
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
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD KEY `company_id` (`company_id`);

--
-- Indeks untuk tabel `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indeks untuk tabel `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `package_id` (`package_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `email_32` (`email`),
  ADD UNIQUE KEY `email_33` (`email`),
  ADD UNIQUE KEY `email_34` (`email`),
  ADD UNIQUE KEY `email_35` (`email`),
  ADD UNIQUE KEY `email_36` (`email`),
  ADD UNIQUE KEY `email_37` (`email`),
  ADD UNIQUE KEY `email_38` (`email`),
  ADD UNIQUE KEY `email_39` (`email`),
  ADD UNIQUE KEY `email_40` (`email`),
  ADD UNIQUE KEY `email_41` (`email`),
  ADD UNIQUE KEY `email_42` (`email`),
  ADD UNIQUE KEY `email_43` (`email`),
  ADD UNIQUE KEY `email_44` (`email`),
  ADD UNIQUE KEY `email_45` (`email`),
  ADD UNIQUE KEY `email_46` (`email`),
  ADD UNIQUE KEY `email_47` (`email`),
  ADD UNIQUE KEY `email_48` (`email`),
  ADD UNIQUE KEY `email_49` (`email`),
  ADD UNIQUE KEY `email_50` (`email`),
  ADD UNIQUE KEY `email_51` (`email`),
  ADD UNIQUE KEY `email_52` (`email`),
  ADD UNIQUE KEY `email_53` (`email`),
  ADD UNIQUE KEY `email_54` (`email`),
  ADD UNIQUE KEY `email_55` (`email`),
  ADD UNIQUE KEY `email_56` (`email`),
  ADD UNIQUE KEY `email_57` (`email`),
  ADD UNIQUE KEY `email_58` (`email`),
  ADD UNIQUE KEY `email_59` (`email`),
  ADD UNIQUE KEY `email_60` (`email`),
  ADD UNIQUE KEY `email_61` (`email`),
  ADD UNIQUE KEY `email_62` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD KEY `company_id` (`company_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `companies`
--
ALTER TABLE `companies`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `packages`
--
ALTER TABLE `packages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_ibfk_125` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subscriptions_ibfk_126` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
