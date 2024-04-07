-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 29, 2023 at 04:39 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `restapi`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id_admin` int(11) NOT NULL,
  `nama_admin` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(225) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` enum('Aktif','Tidak Aktif') NOT NULL,
  `foto` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id_admin`, `nama_admin`, `username`, `email`, `password`, `status`, `foto`) VALUES
(1, 'Admin 1', 'admin1', 'admin1@gmail.com', '1877fcc1b7ec74e144d319929edb40a9', 'Aktif', 'test1.jpg'),
(2, 'Admin 2', 'admin2', 'admin2@gmail.com', 'c4b6689bc98f1efd066ecc2081f18364', 'Aktif', 'test1.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `akses_token`
--

CREATE TABLE `akses_token` (
  `id_akses_token` int(11) NOT NULL,
  `id_alluser` int(11) NOT NULL,
  `token_akses` text NOT NULL,
  `ip_address` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `akses_token`
--

INSERT INTO `akses_token` (`id_akses_token`, `id_alluser`, `token_akses`, `ip_address`) VALUES
(1, 4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjo0LCJ1c2VybmFtZSI6Im1vYmlsZSIsImVtYWlsIjoibW9iaWxlQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiZDNiOTliZmM2ZjdhOGM4YmYxMWMyZTFjODM0YzI1YzEiLCJyb2xlIjoxLCJ0Z2xfZGFmdGFyIjoiMjAyMy0xMS0yN1QxNzowMDowMC4wMDBaIn1dLCJpYXQiOjE3MDExNjQyNTAsImV4cCI6MTcwMTE2NjY1MH0.YpPswOw-toc-VetP1vsGv7Hmr3YiydQ2ByLvGcMUKoY', '192.168.100.22'),
(2, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTE2NDI5NCwiZXhwIjoxNzAxMTY2Njk0fQ.F_RCEpVcbEFBoL1jToPM30ewWAmlSN3QqxJyJTjEqOI', '192.168.100.22'),
(3, 4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjo0LCJ1c2VybmFtZSI6Im1vYmlsZSIsImVtYWlsIjoibW9iaWxlQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiZDNiOTliZmM2ZjdhOGM4YmYxMWMyZTFjODM0YzI1YzEiLCJyb2xlIjoxLCJ0Z2xfZGFmdGFyIjoiMjAyMy0xMS0yN1QxNzowMDowMC4wMDBaIn1dLCJpYXQiOjE3MDExNjQzNTgsImV4cCI6MTcwMTE2Njc1OH0.5n-UwJ82Y--rO97ky3A5_fCFLlnh9HuTF4FZ8YUt_vY', '192.168.100.22'),
(4, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTIzODk0MSwiZXhwIjoxNzAxMjQxMzQxfQ.zX7FIVF8erQ3zZe7yUslpf2QZHx1RaEN6bGyytewJmQ', '192.168.100.22'),
(5, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTIzOTYwMiwiZXhwIjoxNzAxMjQyMDAyfQ.K8P2105ggwFNXTt5SRiaP3L_U0f3JwCI7HCv55WbQ6s', '192.168.100.22'),
(6, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTIzOTYzMywiZXhwIjoxNzAxMjQyMDMzfQ.q8-hjWGhbSyfIV4yUMAF4MNCmq2Mpinl4uYsfICnCpk', '192.168.100.22'),
(7, 4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjo0LCJ1c2VybmFtZSI6Im1vYmlsZSIsImVtYWlsIjoibW9iaWxlQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiZDNiOTliZmM2ZjdhOGM4YmYxMWMyZTFjODM0YzI1YzEiLCJyb2xlIjoxLCJ0Z2xfZGFmdGFyIjoiMjAyMy0xMS0yN1QxNzowMDowMC4wMDBaIn1dLCJpYXQiOjE3MDEyMzk4MTcsImV4cCI6MTcwMTI0MjIxN30.OL3nLBQhVZBB9Wepzes9TLHM1ITr1p1vb40AH4PJGCM', '192.168.100.22'),
(8, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI0MDM2OSwiZXhwIjoxNzAxMjQyNzY5fQ.nSQQEXCao3ARtZ2k5N139GUTtRh_z9pXDS_VhJUh--I', '192.168.100.22'),
(9, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI0MTMyOCwiZXhwIjoxNzAxMjQzNzI4fQ.GNLM1ox32xJ9VaxlX50G5W3GTqDcNajGWwE3Xj3-0go', '192.168.100.22'),
(10, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI0MTM2OSwiZXhwIjoxNzAxMjQzNzY5fQ.d-z8iAJFkYWRWsWwmfX457LKKV_cpoZWlcr7WUKb1dc', '192.168.100.22'),
(11, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoyLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAyIiwiZW1haWwiOiJtYWhhc2lzd2EyQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiIwMTQ4NGM3OTE0NWM1NTllZTZlM2M5NzkwYmE2YTFiYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI0MTQwOCwiZXhwIjoxNzAxMjQzODA4fQ.4WDquqaFMpq_ZAZnli8oNFrz-y04dEqqC3RyhYPU9Mw', '192.168.100.22'),
(12, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoyLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAyIiwiZW1haWwiOiJtYWhhc2lzd2EyQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiIwMTQ4NGM3OTE0NWM1NTllZTZlM2M5NzkwYmE2YTFiYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI0MTQ1MCwiZXhwIjoxNzAxMjQzODUwfQ.oQnTJcrmvmKXXYbPxq_uibHoXQU1U_qq1IYW91QiRl8', '192.168.100.22'),
(13, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI0MjAwMCwiZXhwIjoxNzAxMjQ0NDAwfQ.5wPEmZn8bxcaQ0hdfizUDalZwPSd3_G0iaFw9BJ0bIg', '192.168.100.22'),
(14, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI0MjA0MywiZXhwIjoxNzAxMjQ0NDQzfQ.1q8agyWMhTlc2enx8bm2zVcBu7LlsSt8JgXrbXJ6va4', '192.168.100.22'),
(15, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI0MjEwMSwiZXhwIjoxNzAxMjQ0NTAxfQ.jZB-Zw08v-Rp93lp3qeGlvn9JaHMUgH10_BGe54G__s', '192.168.100.22'),
(16, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoyLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAyIiwiZW1haWwiOiJtYWhhc2lzd2EyQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiIwMTQ4NGM3OTE0NWM1NTllZTZlM2M5NzkwYmE2YTFiYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI0MjE4NCwiZXhwIjoxNzAxMjQ0NTg0fQ.FJ0BJW1o_IiX4AhK5yaqIDRphnrSdeGHmHp8oeILXpY', '192.168.100.22'),
(17, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI0MjY5MCwiZXhwIjoxNzAxMjQ1MDkwfQ.gVyeG1D43IRvVZqpTKkMnRLvm3Pk2qhWScxT8gmo01Q', '192.168.100.22'),
(18, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI0MzI1MywiZXhwIjoxNzAxMjQ1NjUzfQ.J4Erq_Ms5PW7D_Y-liJCb05DC4mN7w09ZG4sAvhnzwY', '192.168.100.22'),
(19, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoyLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAyIiwiZW1haWwiOiJtYWhhc2lzd2EyQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiIwMTQ4NGM3OTE0NWM1NTllZTZlM2M5NzkwYmE2YTFiYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI0MzMyMSwiZXhwIjoxNzAxMjQ1NzIxfQ.b-mo_n6C7yEb6FgzdB_PsX5dxpJHu1sCl2WrcrkOGLY', '192.168.100.22'),
(20, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI0NDQ0MiwiZXhwIjoxNzAxMjQ2ODQyfQ.19gcQkBEXdWis4d1r0G6hgDF_ryZr-tu7boScGkgE40', '192.168.100.22'),
(21, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI0NDUwNiwiZXhwIjoxNzAxMjQ2OTA2fQ.RgqFlBIqbpqThiI3cfyZZF3kWpabElFhnPX1wRiWq6M', '192.168.100.22'),
(22, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjo4LCJ1c2VybmFtZSI6IkFkbWluIDIiLCJlbWFpbCI6ImFkbWluMkBnbWFpbC5jb20iLCJwYXNzd29yZCI6ImM0YjY2ODliYzk4ZjFlZmQwNjZlY2MyMDgxZjE4MzY0Iiwicm9sZSI6MSwidGdsX2RhZnRhciI6IjIwMjMtMTEtMjdUMTc6MDA6MDAuMDAwWiJ9XSwiaWF0IjoxNzAxMjQ1MDg0LCJleHAiOjE3MDEyNDc0ODR9.rfq917kjESuwA9aFrdGuIxTi_Ze-u8wexxyd9YeYDI8', '192.168.100.22'),
(23, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI0NTI5MywiZXhwIjoxNzAxMjQ3NjkzfQ.q8ThGUM7OY9oWD7_BVY2wljJz9-2Zm4F48Zxh0Fiz40', '192.168.100.22'),
(24, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjo4LCJ1c2VybmFtZSI6IkFkbWluIDIiLCJlbWFpbCI6ImFkbWluMkBnbWFpbC5jb20iLCJwYXNzd29yZCI6ImM0YjY2ODliYzk4ZjFlZmQwNjZlY2MyMDgxZjE4MzY0Iiwicm9sZSI6MSwidGdsX2RhZnRhciI6IjIwMjMtMTEtMjdUMTc6MDA6MDAuMDAwWiJ9XSwiaWF0IjoxNzAxMjQ1NDM3LCJleHAiOjE3MDEyNDc4Mzd9.m3DjoKJ06b5kr8Hsop9LRHRLX9C4hjS2bIPV-TNw1HU', '192.168.100.22'),
(25, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI0NTQ4OSwiZXhwIjoxNzAxMjQ3ODg5fQ.fT9YClpMtAEBNG1v7wM0ObrpZuNEeXcxGAlFL4czNnc', '192.168.100.22'),
(26, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI0ODE1NSwiZXhwIjoxNzAxMjUwNTU1fQ.QI2jQrUipFTuImJ59xkKsyWx5W8utyW0fa3MmssVsUc', '192.168.100.22'),
(27, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI0ODE2NCwiZXhwIjoxNzAxMjUwNTY0fQ.Nh0tYhqR6gfjhObLIV5s0GiWy5j5fiug1ywqFt-UXfk', '192.168.100.22'),
(28, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI0ODMwMywiZXhwIjoxNzAxMjUwNzAzfQ.qaQwh06lcWp6JKSbkAxVPpJVO_PUJ8tZyJo9gub5Wds', '192.168.100.22'),
(29, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI0ODg2MSwiZXhwIjoxNzAxMjUxMjYxfQ.IZe49byyvUsxHq-0HJ85rsWixq_ynsvMOD2lQ-cVelk', '192.168.100.22'),
(30, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI0ODkwMiwiZXhwIjoxNzAxMjUxMzAyfQ.epGilIk0JQz2QcuX0xDq5Evj4NzpiN9hKCDIaJFStCE', '192.168.100.22'),
(31, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI0ODkwOSwiZXhwIjoxNzAxMjUxMzA5fQ.CnUTLAui1PAlAo210nJpMMu60A7Sl9N9EFAX6FAtO5s', '192.168.100.22'),
(32, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoyLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAyIiwiZW1haWwiOiJtYWhhc2lzd2EyQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiIwMTQ4NGM3OTE0NWM1NTllZTZlM2M5NzkwYmE2YTFiYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI0ODkyMywiZXhwIjoxNzAxMjUxMzIzfQ.xhmyViZFipREd9KMF_zYkGmfvmmh_gM-ZcQR7ViQtyY', '192.168.100.22'),
(33, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI1OTc2MSwiZXhwIjoxNzAxMjYyMTYxfQ.1eI7-5g5MetL74x9onpYcxXlt4jObDb1iAPONfit-R0', '192.168.100.22'),
(34, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI2MTQ4OSwiZXhwIjoxNzAxMjYzODg5fQ.llYM97M8ihj_J9dD8GandYlZ4f_IGvZ5eiNLlZx0Obk', '192.168.100.22'),
(35, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI2NDE0NCwiZXhwIjoxNzAxMjY2NTQ0fQ.TTxqsYdzBmoT1yx1x5XkfmCKc1oPLio9I3u23QbfmP0', '192.168.100.22'),
(36, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjo3LCJ1c2VybmFtZSI6IkFkbWluIDEiLCJlbWFpbCI6ImFkbWluMUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IjE4NzdmY2MxYjdlYzc0ZTE0NGQzMTk5MjllZGI0MGE5Iiwicm9sZSI6MSwidGdsX2RhZnRhciI6IjIwMjMtMTEtMjdUMTc6MDA6MDAuMDAwWiJ9XSwiaWF0IjoxNzAxMjY1ODkyLCJleHAiOjE3MDEyNjgyOTJ9.qvhdpCg-2nQF2UQiFadvgO0SueY0QU3wp-deJO2qAfc', '192.168.100.22'),
(37, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjo3LCJ1c2VybmFtZSI6IkFkbWluIDEiLCJlbWFpbCI6ImFkbWluMUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IjE4NzdmY2MxYjdlYzc0ZTE0NGQzMTk5MjllZGI0MGE5Iiwicm9sZSI6MSwidGdsX2RhZnRhciI6IjIwMjMtMTEtMjdUMTc6MDA6MDAuMDAwWiJ9XSwiaWF0IjoxNzAxMjY1OTAyLCJleHAiOjE3MDEyNjgzMDJ9.C0_LaRQLdhsjB9uHmoo0ObW3st65FEJxjpvJQLQYQfI', '192.168.100.22'),
(38, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjo3LCJ1c2VybmFtZSI6IkFkbWluIDEiLCJlbWFpbCI6ImFkbWluMUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IjE4NzdmY2MxYjdlYzc0ZTE0NGQzMTk5MjllZGI0MGE5Iiwicm9sZSI6MSwidGdsX2RhZnRhciI6IjIwMjMtMTEtMjdUMTc6MDA6MDAuMDAwWiJ9XSwiaWF0IjoxNzAxMjY1OTI0LCJleHAiOjE3MDEyNjgzMjR9.m-9GlLS-O8ee9oB52nBUK4hXefljr7zPGj2femAzqgs', '192.168.100.22'),
(39, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjo3LCJ1c2VybmFtZSI6IkFkbWluIDEiLCJlbWFpbCI6ImFkbWluMUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IjE4NzdmY2MxYjdlYzc0ZTE0NGQzMTk5MjllZGI0MGE5Iiwicm9sZSI6MSwidGdsX2RhZnRhciI6IjIwMjMtMTEtMjdUMTc6MDA6MDAuMDAwWiJ9XSwiaWF0IjoxNzAxMjY2ODc1LCJleHAiOjE3MDEyNjkyNzV9.yJAhkpbv90bE7iC2eXFgMb_fS_hY3e9F2Uj1lhLBopU', '192.168.100.22'),
(40, 6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjo2LCJ1c2VybmFtZSI6IlByb2YuIEpvaG5zb24iLCJlbWFpbCI6ImpvaG5zb25AZXhhbXBsZS5jb20iLCJwYXNzd29yZCI6ImUyNzg4OTI2YTQ4NGRhYzAwMDM3YjZmOWEzYjU5MDllIiwicm9sZSI6MiwidGdsX2RhZnRhciI6IjIwMjMtMTEtMjdUMTc6MDA6MDAuMDAwWiJ9XSwiaWF0IjoxNzAxMjY4MDMzLCJleHAiOjE3MDEyNzA0MzN9.B7S7VC3jRoQR5gHwvFc3WYojIgSqdAnQpCS94NJmfxQ', '192.168.100.22'),
(41, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9hbGx1c2VyIjoxLCJ1c2VybmFtZSI6Ik1haGFzaXN3YSAxIiwiZW1haWwiOiJtYWhhc2lzd2ExQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiI4ZWFjMzU3Njg0ZWI4YzM2NTEzMjM1YzdlNzdiZmRmYiIsInJvbGUiOjMsInRnbF9kYWZ0YXIiOiIyMDIzLTExLTI3VDE3OjAwOjAwLjAwMFoifV0sImlhdCI6MTcwMTI3MTA5MSwiZXhwIjoxNzAxMjczNDkxfQ.ql1RbTCF4-0t0oh5jpk_fktzwSVw87Nog8ZWML4zyiU', '192.168.100.22');

-- --------------------------------------------------------

--
-- Table structure for table `alluser`
--

CREATE TABLE `alluser` (
  `id_alluser` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int(2) NOT NULL,
  `tgl_daftar` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alluser`
--

INSERT INTO `alluser` (`id_alluser`, `username`, `email`, `password`, `role`, `tgl_daftar`) VALUES
(1, 'Mahasiswa 1', 'mahasiswa1@example.com', '8eac357684eb8c36513235c7e77bfdfb', 3, '2023-11-28'),
(2, 'Mahasiswa 2', 'mahasiswa2@example.com', '01484c79145c559ee6e3c9790ba6a1bb', 3, '2023-11-28'),
(4, 'mobile', 'mobile@gmail.com', 'd3b99bfc6f7a8c8bf11c2e1c834c25c1', 1, '2023-11-28'),
(5, 'Dr. Smith', 'smith@example.com', '18a5db9c0fe37cd78cf75d9b94182c28', 2, '2023-11-28'),
(6, 'Prof. Johnson', 'johnson@example.com', 'e2788926a484dac00037b6f9a3b5909e', 2, '2023-11-28'),
(7, 'Admin 1', 'admin1@gmail.com', '1877fcc1b7ec74e144d319929edb40a9', 1, '2023-11-28'),
(8, 'Admin 2', 'admin2@gmail.com', 'c4b6689bc98f1efd066ecc2081f18364', 1, '2023-11-28');

-- --------------------------------------------------------

--
-- Table structure for table `dosen`
--

CREATE TABLE `dosen` (
  `id_dosen` int(11) NOT NULL,
  `nip` varchar(16) NOT NULL,
  `nama_dosen` varchar(255) NOT NULL,
  `jk` enum('Laki-laki','Perempuan') NOT NULL,
  `alamat` varchar(255) DEFAULT NULL,
  `foto` varchar(255) NOT NULL,
  `status` enum('Aktif','Tidak Aktif') NOT NULL,
  `notlp` char(13) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dosen`
--

INSERT INTO `dosen` (`id_dosen`, `nip`, `nama_dosen`, `jk`, `alamat`, `foto`, `status`, `notlp`, `email`, `password`) VALUES
(1, '1234567890123456', 'Dr. Smith', 'Laki-laki', 'Jl. Dosen No. 1', 'test1.jpg', 'Aktif', '081234567890', 'smith@example.com', '18a5db9c0fe37cd78cf75d9b94182c28'),
(2, '9876543210987654', 'Prof. Johnson', 'Laki-laki', 'Jl. Dosen No. 2', 'test1.jpg', 'Aktif', '081234567890', 'johnson@example.com', 'e2788926a484dac00037b6f9a3b5909e');

-- --------------------------------------------------------

--
-- Table structure for table `jadwal`
--

CREATE TABLE `jadwal` (
  `id_jadwal` int(11) NOT NULL,
  `id_dosen_jadwal` int(11) NOT NULL,
  `id_mahasiswa_jadwal` int(11) NOT NULL,
  `id_matakuliah_jadwal` int(11) NOT NULL,
  `semester` int(11) NOT NULL,
  `hari` enum('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu') NOT NULL,
  `jam_mulai` time NOT NULL,
  `jam_selesai` time NOT NULL,
  `id_ruangan_jadwal` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jadwal`
--

INSERT INTO `jadwal` (`id_jadwal`, `id_dosen_jadwal`, `id_mahasiswa_jadwal`, `id_matakuliah_jadwal`, `semester`, `hari`, `jam_mulai`, `jam_selesai`, `id_ruangan_jadwal`) VALUES
(1, 1, 1, 1, 1, 'Senin', '08:00:00', '10:00:00', 1),
(2, 2, 2, 2, 1, 'Selasa', '10:30:00', '12:30:00', 2),
(3, 1, 2, 2, 4, 'Jumat', '10:36:26', '12:36:26', 1),
(4, 1, 2, 1, 3, 'Kamis', '03:22:18', '11:40:01', 1),
(5, 2, 2, 2, 6, 'Selasa', '10:30:00', '12:30:00', 2);

-- --------------------------------------------------------

--
-- Table structure for table `kelas`
--

CREATE TABLE `kelas` (
  `id_kelas` int(11) NOT NULL,
  `nama_kelas` varchar(255) NOT NULL,
  `angkatan` year(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kelas`
--

INSERT INTO `kelas` (`id_kelas`, `nama_kelas`, `angkatan`) VALUES
(1, 'TI-01', '2021'),
(2, 'SI-02', '2022'),
(3, 'SI-03', '2022');

-- --------------------------------------------------------

--
-- Table structure for table `mahasiswa`
--

CREATE TABLE `mahasiswa` (
  `id_mahasiswa` int(11) NOT NULL,
  `npm` varchar(10) NOT NULL,
  `nama_mahasiswa` varchar(255) NOT NULL,
  `jk` enum('Laki-laki','Perempuan') NOT NULL,
  `alamat` varchar(255) NOT NULL,
  `foto` varchar(255) NOT NULL,
  `status` enum('Aktif','Tidak Aktif') NOT NULL,
  `notlp` char(13) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `id_kelas` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mahasiswa`
--

INSERT INTO `mahasiswa` (`id_mahasiswa`, `npm`, `nama_mahasiswa`, `jk`, `alamat`, `foto`, `status`, `notlp`, `email`, `password`, `id_kelas`) VALUES
(1, '2224568888', 'Mahasiswa 1', 'Laki-laki', 'Jl. Contoh No. 123', 'test1.jpg', 'Aktif', '081234567890', 'mahasiswa1@example.com', '8eac357684eb8c36513235c7e77bfdfb', 2),
(2, '2224568889', 'Mahasiswa 2', 'Laki-laki', 'Jl. Contoh No. 123', 'test1.jpg', 'Aktif', '081234567890', 'mahasiswa2@example.com', '01484c79145c559ee6e3c9790ba6a1bb', 1);

-- --------------------------------------------------------

--
-- Table structure for table `matakuliah`
--

CREATE TABLE `matakuliah` (
  `id_matakuliah` int(11) NOT NULL,
  `kode_matakuliah` varchar(10) NOT NULL,
  `nama_matakuliah` varchar(255) NOT NULL,
  `sks` int(11) NOT NULL,
  `foto` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `matakuliah`
--

INSERT INTO `matakuliah` (`id_matakuliah`, `kode_matakuliah`, `nama_matakuliah`, `sks`, `foto`) VALUES
(1, 'MK001', 'Matematika Dasar', 4, 'test1.jpg'),
(2, 'MK002', 'Pemrograman Java', 4, 'test1.jpg'),
(3, 'MK003', 'Pemrograman Web', 4, 'test1.jpg'),
(4, 'MK004', 'Statistika', 1, 'test1.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `presensi`
--

CREATE TABLE `presensi` (
  `id_presensi` int(11) NOT NULL,
  `id_jadwal` int(11) NOT NULL,
  `waktu` datetime NOT NULL,
  `lokasi` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `presensi`
--

INSERT INTO `presensi` (`id_presensi`, `id_jadwal`, `waktu`, `lokasi`) VALUES
(1, 1, '2023-11-19 09:00:00', 'Aula Utama'),
(2, 2, '2023-11-20 11:00:00', 'Ruang Meeting'),
(3, 1, '2023-11-19 17:19:50', 'm df'),
(4, 3, '2023-11-19 17:21:11', ' dcsd'),
(5, 4, '2023-11-19 17:23:01', 'fsdd'),
(6, 2, '0000-00-00 00:00:00', 'jogja');

-- --------------------------------------------------------

--
-- Table structure for table `ruangan`
--

CREATE TABLE `ruangan` (
  `id_ruangan` int(11) NOT NULL,
  `gedung` varchar(255) NOT NULL,
  `lantai` varchar(255) NOT NULL,
  `ruangan` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ruangan`
--

INSERT INTO `ruangan` (`id_ruangan`, `gedung`, `lantai`, `ruangan`) VALUES
(1, 'A', '1', '101'),
(2, 'B', '2', '202'),
(3, '2', '2', '202');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id_admin`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `akses_token`
--
ALTER TABLE `akses_token`
  ADD PRIMARY KEY (`id_akses_token`),
  ADD KEY `id_admin` (`id_alluser`);

--
-- Indexes for table `alluser`
--
ALTER TABLE `alluser`
  ADD PRIMARY KEY (`id_alluser`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `dosen`
--
ALTER TABLE `dosen`
  ADD PRIMARY KEY (`id_dosen`),
  ADD UNIQUE KEY `nip` (`nip`);

--
-- Indexes for table `jadwal`
--
ALTER TABLE `jadwal`
  ADD PRIMARY KEY (`id_jadwal`),
  ADD KEY `id_dosen_jadwal` (`id_dosen_jadwal`),
  ADD KEY `id_mahasiswa_jadwal` (`id_mahasiswa_jadwal`),
  ADD KEY `id_matakuliah_jadwal` (`id_matakuliah_jadwal`),
  ADD KEY `id_ruangan_jadwal` (`id_ruangan_jadwal`);

--
-- Indexes for table `kelas`
--
ALTER TABLE `kelas`
  ADD PRIMARY KEY (`id_kelas`);

--
-- Indexes for table `mahasiswa`
--
ALTER TABLE `mahasiswa`
  ADD PRIMARY KEY (`id_mahasiswa`),
  ADD UNIQUE KEY `npm` (`npm`),
  ADD KEY `id_kelas` (`id_kelas`);

--
-- Indexes for table `matakuliah`
--
ALTER TABLE `matakuliah`
  ADD PRIMARY KEY (`id_matakuliah`),
  ADD UNIQUE KEY `kode_matakuliah` (`kode_matakuliah`);

--
-- Indexes for table `presensi`
--
ALTER TABLE `presensi`
  ADD PRIMARY KEY (`id_presensi`),
  ADD KEY `id_jadwal` (`id_jadwal`);

--
-- Indexes for table `ruangan`
--
ALTER TABLE `ruangan`
  ADD PRIMARY KEY (`id_ruangan`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `akses_token`
--
ALTER TABLE `akses_token`
  MODIFY `id_akses_token` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `alluser`
--
ALTER TABLE `alluser`
  MODIFY `id_alluser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `dosen`
--
ALTER TABLE `dosen`
  MODIFY `id_dosen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `jadwal`
--
ALTER TABLE `jadwal`
  MODIFY `id_jadwal` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `kelas`
--
ALTER TABLE `kelas`
  MODIFY `id_kelas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `mahasiswa`
--
ALTER TABLE `mahasiswa`
  MODIFY `id_mahasiswa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `matakuliah`
--
ALTER TABLE `matakuliah`
  MODIFY `id_matakuliah` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `presensi`
--
ALTER TABLE `presensi`
  MODIFY `id_presensi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `ruangan`
--
ALTER TABLE `ruangan`
  MODIFY `id_ruangan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `akses_token`
--
ALTER TABLE `akses_token`
  ADD CONSTRAINT `akses_token_ibfk_1` FOREIGN KEY (`id_alluser`) REFERENCES `alluser` (`id_alluser`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `jadwal`
--
ALTER TABLE `jadwal`
  ADD CONSTRAINT `jadwal_ibfk_1` FOREIGN KEY (`id_dosen_jadwal`) REFERENCES `dosen` (`id_dosen`),
  ADD CONSTRAINT `jadwal_ibfk_2` FOREIGN KEY (`id_mahasiswa_jadwal`) REFERENCES `mahasiswa` (`id_mahasiswa`),
  ADD CONSTRAINT `jadwal_ibfk_3` FOREIGN KEY (`id_matakuliah_jadwal`) REFERENCES `matakuliah` (`id_matakuliah`),
  ADD CONSTRAINT `jadwal_ibfk_4` FOREIGN KEY (`id_ruangan_jadwal`) REFERENCES `ruangan` (`id_ruangan`);

--
-- Constraints for table `mahasiswa`
--
ALTER TABLE `mahasiswa`
  ADD CONSTRAINT `mahasiswa_ibfk_1` FOREIGN KEY (`id_kelas`) REFERENCES `kelas` (`id_kelas`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `presensi`
--
ALTER TABLE `presensi`
  ADD CONSTRAINT `presensi_ibfk_1` FOREIGN KEY (`id_jadwal`) REFERENCES `jadwal` (`id_jadwal`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
