-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 06-06-2025 a las 02:39:34
-- Versión del servidor: 8.0.30
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `library`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `autores`
--

CREATE TABLE `autores` (
  `id` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `autores`
--

INSERT INTO `autores` (`id`, `nombre`, `created_at`) VALUES
(1, 'Sara Sanchez', '2025-05-22 19:47:30'),
(2, 'Alejandro garcia', '2025-05-22 20:50:42'),
(3, 'Vanessa Rodriguez', '2025-05-22 23:55:22'),
(4, 'Camilo Benitez', '2025-05-22 23:56:01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `backup_books`
--

CREATE TABLE `backup_books` (
  `id` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `editorial_id` int DEFAULT NULL,
  `categoria` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `autor_id` int DEFAULT NULL,
  `categoria_id` int DEFAULT NULL,
  `isbn` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `num_paginas` int DEFAULT NULL,
  `anio_publicacion` int DEFAULT NULL,
  `num_ejemplares` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `backup_books`
--

INSERT INTO `backup_books` (`id`, `name`, `created_at`, `updated_at`, `editorial_id`, `categoria`, `autor_id`, `categoria_id`, `isbn`, `num_paginas`, `anio_publicacion`, `num_ejemplares`) VALUES
(22, 'aaaa', '2025-05-23 00:58:10', '2025-06-03 20:47:05', 6, NULL, 4, 4, '4444', 3, 777, 17);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `books`
--

CREATE TABLE `books` (
  `id` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `editorial_id` int DEFAULT NULL,
  `categoria` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `autor_id` int DEFAULT NULL,
  `categoria_id` int DEFAULT NULL,
  `isbn` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `num_paginas` int DEFAULT NULL,
  `anio_publicacion` int DEFAULT NULL,
  `num_ejemplares` int DEFAULT NULL,
  `foto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `books`
--

INSERT INTO `books` (`id`, `name`, `created_at`, `updated_at`, `editorial_id`, `categoria`, `autor_id`, `categoria_id`, `isbn`, `num_paginas`, `anio_publicacion`, `num_ejemplares`, `foto`) VALUES
(13, 'la loba y la vaca ', '2025-05-10 00:19:34', '2025-06-06 01:34:20', 6, NULL, 4, 4, '14876543', 15, 2017, 18, NULL),
(16, 'El puma', '2025-05-12 22:29:58', '2025-06-06 01:34:29', 4, NULL, 2, 1, '14222', 3, 2019, 10, NULL),
(21, 'El abrigo del tio', '2025-05-23 00:02:26', '2025-06-06 01:34:37', 4, NULL, 2, 3, '65432', 4, 2016, 12, NULL),
(22, 'High Hopes', '2025-05-23 00:58:10', '2025-06-06 01:26:09', 6, NULL, 4, 4, '4444', 3, 2019, 14, NULL),
(23, 'La ardilla', '2025-06-06 01:36:20', '2025-06-06 01:36:20', 5, NULL, 4, 3, '876543', 12, 2018, 16, NULL),
(24, 'la burbuja', '2025-06-06 01:36:52', '2025-06-06 02:35:19', 6, NULL, 1, 1, '765432', 2, 17, 16, '1749177319776-960390442.jpeg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `created_at`) VALUES
(1, 'Infantil', '2025-05-22 19:55:04'),
(2, 'Comedia', '2025-05-22 23:57:55'),
(3, 'Investigación', '2025-05-22 23:58:12'),
(4, 'Narrativa', '2025-05-22 23:59:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `editoriales`
--

CREATE TABLE `editoriales` (
  `id` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `editoriales`
--

INSERT INTO `editoriales` (`id`, `nombre`, `created_at`) VALUES
(4, 'Norma', '2025-05-22 21:21:21'),
(5, 'Milano', '2025-05-22 23:59:37'),
(6, 'Modrics', '2025-05-23 00:00:09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prestamos`
--

CREATE TABLE `prestamos` (
  `id` int NOT NULL,
  `id_usuario` int NOT NULL,
  `id_libro` int NOT NULL,
  `fecha_prestamo` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_devolucion` datetime DEFAULT NULL,
  `estado` enum('activo','devuelto','vencido') DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `prestamos`
--

INSERT INTO `prestamos` (`id`, `id_usuario`, `id_libro`, `fecha_prestamo`, `fecha_devolucion`, `estado`) VALUES
(2, 25, 22, '2025-06-03 13:29:18', '2025-06-05 13:54:53', 'devuelto'),
(3, 25, 22, '2025-06-03 15:15:41', '2025-06-03 15:47:05', 'devuelto'),
(4, 25, 22, '2025-06-03 15:15:57', '2025-06-03 15:47:00', 'devuelto'),
(5, 25, 22, '2025-06-03 15:16:12', '2025-06-03 15:46:36', 'devuelto'),
(6, 25, 22, '2025-06-03 15:16:13', '2025-06-03 15:44:08', 'devuelto'),
(7, 26, 22, '2025-06-03 15:44:11', '2025-06-03 15:46:27', 'devuelto'),
(8, 26, 22, '2025-06-03 15:44:11', '2025-06-03 15:44:21', 'devuelto'),
(9, 25, 22, '2025-06-05 12:52:19', '2025-06-05 13:54:53', 'devuelto'),
(10, 25, 22, '2025-06-05 12:56:10', '2025-06-05 13:54:53', 'devuelto'),
(11, 25, 22, '2025-06-05 13:19:04', '2025-06-05 13:54:52', 'devuelto'),
(12, 25, 22, '2025-06-05 13:27:49', '2025-06-05 13:54:52', 'devuelto'),
(13, 25, 22, '2025-06-05 13:27:50', '2025-06-05 13:54:52', 'devuelto'),
(14, 25, 22, '2025-06-05 13:34:21', '2025-06-05 13:54:52', 'devuelto'),
(15, 25, 22, '2025-06-05 13:39:46', '2025-06-05 13:54:51', 'devuelto'),
(16, 25, 22, '2025-06-05 13:56:36', '2025-06-05 13:57:27', 'devuelto'),
(17, 25, 16, '2025-06-05 14:09:00', NULL, 'activo'),
(18, 25, 16, '2025-06-05 14:15:16', NULL, 'activo'),
(19, 25, 16, '2025-06-05 14:17:51', NULL, 'activo'),
(20, 25, 22, '2025-06-05 20:04:47', NULL, 'activo'),
(21, 25, 22, '2025-06-05 20:26:04', NULL, 'activo'),
(22, 25, 22, '2025-06-05 20:26:06', NULL, 'activo'),
(23, 25, 22, '2025-06-05 20:26:09', NULL, 'activo'),
(24, 25, 16, '2025-06-05 20:26:23', NULL, 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('SvEEsvgSu3XsvjRgY90RpAJVeOOihRMv', 1749184690, '{\"cookie\":{\"originalMaxAge\":7200000,\"expires\":\"2025-06-06T04:37:55.009Z\",\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"userId\":26,\"username\":\"matthias\",\"role\":\"Administrador\"}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `role` enum('Usuario','Administrador') NOT NULL DEFAULT 'Usuario'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `created_at`, `role`) VALUES
(1, 'andres', '$2b$10$3XHGOOUrW2YQ9EoancOF2e8F9Wmh7SWSHwO/JVvLKC4jUZBscyvIu', '2025-05-22 20:46:25', 'Administrador'),
(25, 'alejandra', '$2b$10$/aaeZqnNckKMJEK81uLJI.XdpBsv3by8uHmOa9hiTSFwBzOiiBgXO', '2025-06-03 16:37:35', 'Usuario'),
(26, 'matthias', '$2b$10$MPUQPuiHpx6cV4K.JABx.uat9P6xh6Elf0scuScJ3oa9KMmpw6wku', '2025-06-03 16:37:56', 'Administrador');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `autores`
--
ALTER TABLE `autores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `backup_books`
--
ALTER TABLE `backup_books`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `editoriales`
--
ALTER TABLE `editoriales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `prestamos`
--
ALTER TABLE `prestamos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_libro` (`id_libro`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `autores`
--
ALTER TABLE `autores`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `backup_books`
--
ALTER TABLE `backup_books`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `books`
--
ALTER TABLE `books`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `editoriales`
--
ALTER TABLE `editoriales`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `prestamos`
--
ALTER TABLE `prestamos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `prestamos`
--
ALTER TABLE `prestamos`
  ADD CONSTRAINT `prestamos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `prestamos_ibfk_2` FOREIGN KEY (`id_libro`) REFERENCES `books` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
