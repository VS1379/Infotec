-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-11-2024 a las 22:04:09
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `infotec`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bancos`
--

CREATE TABLE `bancos` (
  `IdBanco` int(2) NOT NULL,
  `Nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `bancos`
--

INSERT INTO `bancos` (`IdBanco`, `Nombre`) VALUES
(1, 'Santander'),
(2, 'Banco del Sur'),
(3, 'Banco Del Norte'),
(4, 'Supervielle'),
(5, 'ICBC');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `ID_Cliente` int(4) UNSIGNED NOT NULL,
  `DNI` int(8) UNSIGNED NOT NULL,
  `CUIT` char(11) NOT NULL,
  `NOMBRE` varchar(40) NOT NULL,
  `DIRECCION` varchar(50) NOT NULL,
  `TELEFONO` varchar(20) DEFAULT NULL,
  `CORREO` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`ID_Cliente`, `DNI`, `CUIT`, `NOMBRE`, `DIRECCION`, `TELEFONO`, `CORREO`) VALUES
(1, 23456789, '20345678901', 'Juan Perez', 'Av. Siempre Viva 123', '1234-5678', 'juan.perez@email.com'),
(2, 34567890, '20345678902', 'Maria Gomez', 'Calle Falsa 456', '2345-6789', 'maria.gomez@email.com'),
(28, 43552311, '22445523118', 'Oscar Alfin', 'Avenida San Pablo 485', '03805710201', 'asda@gmail.com'),
(41, 12345678, '00123456789', 'Gustavo Gostozo', 'Calle Verdadera 66 Pje', '3804-112233', 'gustavoABC@yahoo.com'),
(42, 44123456, '23441234569', 'Armando Paredes', 'Avenida Constructor 88', '3804-112233', 'armandopp22@yahoo.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cobros`
--

CREATE TABLE `cobros` (
  `IDCobro` int(11) NOT NULL,
  `NroFacv` int(12) NOT NULL,
  `FechaCobro` date NOT NULL,
  `Monto` decimal(6,2) NOT NULL,
  `Tipo` tinyint(4) NOT NULL,
  `NroCheque` int(8) DEFAULT NULL,
  `IdBanco` int(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cobros`
--

INSERT INTO `cobros` (`IDCobro`, `NroFacv`, `FechaCobro`, `Monto`, `Tipo`, `NroCheque`, `IdBanco`) VALUES
(9, 15, '2024-12-08', 135.00, 1, 0, 0),
(10, 18, '2024-12-05', 969.00, 1, 0, 0),
(11, 19, '2024-11-20', 600.00, 2, 0, 0),
(12, 25, '2024-12-04', 2158.00, 3, 79845, 1),
(13, 0, '0000-00-00', -11.00, 4, 0, 0),
(14, 19, '2024-11-20', 0.00, 2, 0, 0),
(15, 19, '2024-11-20', 0.00, 2, 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_facturas_compra`
--

CREATE TABLE `detalle_facturas_compra` (
  `NroFacc` bigint(12) NOT NULL,
  `IDHard` int(4) NOT NULL,
  `PrecioUnitario` decimal(10,2) NOT NULL,
  `Cantidad` int(4) NOT NULL,
  `PrecioTotal` decimal(10,2) NOT NULL,
  `IVA` decimal(2,2) NOT NULL,
  `PrecioIVA` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_facturas_venta`
--

CREATE TABLE `detalle_facturas_venta` (
  `NroFacv` bigint(12) NOT NULL,
  `IDHard` int(4) NOT NULL,
  `PrecioUnitario` decimal(10,2) NOT NULL,
  `Cantidad` int(4) NOT NULL,
  `PrecioTotal` decimal(10,2) NOT NULL,
  `IVA` decimal(2,2) NOT NULL,
  `PrecioIVA` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_facturas_venta`
--

INSERT INTO `detalle_facturas_venta` (`NroFacv`, `IDHard`, `PrecioUnitario`, `Cantidad`, `PrecioTotal`, `IVA`, `PrecioIVA`) VALUES
(15, 4, 90.55, 1, 90.55, 0.00, 90.55),
(15, 33, 44.00, 1, 44.00, 0.00, 44.00),
(18, 2, 703.57, 1, 703.57, 0.00, 703.57),
(18, 14, 265.85, 1, 265.85, 0.00, 265.85),
(19, 2, 703.57, 2, 1407.14, 0.00, 1407.14),
(19, 3, 59.93, 2, 119.86, 0.00, 119.86),
(24, 1, 115.00, 1, 115.00, 0.00, 115.00),
(25, 1, 115.00, 1, 115.00, 0.99, 117.30),
(25, 2, 703.57, 1, 703.57, 0.99, 717.64),
(25, 14, 265.85, 1, 265.85, 0.99, 271.17);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pedidos`
--

CREATE TABLE `detalle_pedidos` (
  `IDPedido` int(4) NOT NULL,
  `IDHard` int(4) NOT NULL,
  `Cantidad` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_pedidos`
--

INSERT INTO `detalle_pedidos` (`IDPedido`, `IDHard`, `Cantidad`) VALUES
(9, 1, 1),
(10, 1, 1),
(10, 2, 1),
(10, 14, 1),
(11, 3, 2),
(11, 4, 2),
(12, 1, 1),
(12, 2, 1),
(12, 3, 1),
(13, 2, 50),
(13, 3, 2),
(14, 9, 2),
(14, 22, 5),
(15, 1, 1),
(16, 4, 50),
(16, 5, 2),
(16, 14, 2),
(16, 25, 2),
(16, 33, 21),
(17, 3, 1),
(18, 4, 11),
(18, 5, 44),
(19, 9, 10),
(19, 30, 10),
(20, 13, 1),
(21, 1, 1),
(22, 4, 1),
(22, 33, 1),
(23, 2, 3),
(23, 26, 2),
(24, 19, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facturas_compra`
--

CREATE TABLE `facturas_compra` (
  `NroFacc` bigint(12) NOT NULL,
  `IDProveedor` int(4) NOT NULL,
  `Fecha` date NOT NULL,
  `MontoTotal` decimal(10,2) NOT NULL,
  `FormaDePago` tinyint(1) NOT NULL CHECK (`FormaDePago` in (1,2,3)),
  `NroCheque` int(8) DEFAULT NULL,
  `Serie` char(2) DEFAULT NULL,
  `IdBanco` int(2) DEFAULT NULL,
  `NroCta` bigint(12) DEFAULT NULL,
  `TipoCta` tinyint(1) DEFAULT NULL CHECK (`TipoCta` in (1,2,3))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facturas_venta`
--

CREATE TABLE `facturas_venta` (
  `NroFacv` bigint(12) NOT NULL,
  `IDCliente` int(4) NOT NULL,
  `IDPedido` int(4) NOT NULL,
  `Fecha` date NOT NULL,
  `MontoTotal` decimal(10,2) NOT NULL,
  `FormaDePago` tinyint(1) NOT NULL CHECK (`FormaDePago` in (1,2,3,4)),
  `CantidadDeCuotas` int(2) DEFAULT NULL,
  `PeriodoDeCuotas` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `facturas_venta`
--

INSERT INTO `facturas_venta` (`NroFacv`, `IDCliente`, `IDPedido`, `Fecha`, `MontoTotal`, `FormaDePago`, `CantidadDeCuotas`, `PeriodoDeCuotas`) VALUES
(15, 44123456, 22, '2024-11-20', 134.55, 1, 0, 'mensual'),
(18, 34567890, 10, '2024-11-20', 969.42, 1, 0, 'mensual'),
(19, 23456789, 12, '2024-11-20', 1527.00, 2, 3, 'mensual'),
(24, 23456789, 9, '2024-11-20', 115.00, 1, 1, 'mensual'),
(25, 34567890, 10, '2024-11-20', 1106.11, 3, 0, 'mensual');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `hardware`
--

CREATE TABLE `hardware` (
  `ID_Hard` int(4) UNSIGNED NOT NULL,
  `ID_Tipohard` int(2) UNSIGNED NOT NULL,
  `ID_Marca` int(2) UNSIGNED NOT NULL,
  `CARACTERISTICAS` varchar(100) NOT NULL,
  `PRECIO_UNITARIO` decimal(7,2) UNSIGNED NOT NULL,
  `UNIDADES_DISPONIBLES` int(3) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `hardware`
--

INSERT INTO `hardware` (`ID_Hard`, `ID_Tipohard`, `ID_Marca`, `CARACTERISTICAS`, `PRECIO_UNITARIO`, `UNIDADES_DISPONIBLES`) VALUES
(1, 1, 1, 'Placa Base ATX con soporte para procesadores Intel y AMD, 4 puertos USB 3.0', 115.00, 96),
(2, 2, 2, 'Tarjeta Gráfica 8GB GDDR6, PCI Express 4.0, DirectX 12', 703.57, 5),
(3, 3, 3, 'Memoria RAM DDR4 de 16GB, 3200MHz, CL16', 59.93, 28),
(4, 4, 4, 'Disco Duro SSD de 1TB, 550MB/s, SATA III', 90.55, 100),
(5, 5, 5, 'Fuente de Poder de 650W, 80 Plus Gold, modular', 75.51, 43),
(6, 6, 6, 'Impresora láser, color, conexión WiFi', 447.86, 20),
(7, 7, 7, 'Webcam 1080p, micrófono integrado, enfoque automático', 83.08, 12),
(8, 8, 8, 'Auriculares inalámbricos, sonido envolvente, batería de 20h', 191.51, 7),
(9, 9, 9, 'Proyector LED, resolución 1080p, conexión HDMI', 692.81, 164),
(10, 10, 10, 'Docking Station USB-C, compatible con múltiples dispositivos', 148.87, 9),
(11, 11, 11, 'Almacenamiento Externo 1TB, USB 3.0', 91.80, 45),
(12, 12, 12, 'Router WiFi 6, velocidad 3000 Mbps', 101.31, 16),
(13, 13, 13, 'Tarjeta Gráfica 4GB, ideal para juegos', 345.02, 6),
(14, 14, 14, 'CPU Intel Core i7, 8 núcleos', 265.85, 4),
(15, 15, 15, 'Disco Duro SSD 512GB, velocidad 550MB/s', 99.30, 8),
(16, 6, 6, 'Impresora térmica, alta velocidad, conexión USB', 388.89, 15),
(17, 6, 9, 'Impresora de inyección, calidad fotográfica, WiFi', 238.81, 11),
(18, 7, 8, 'Webcam 720p, micrófono dual, clip universal', 59.98, 6),
(19, 8, 7, 'Auriculares con micrófono, cancelación de ruido', 114.74, 18),
(20, 9, 10, 'Proyector portátil, resolución 720p, HDMI', 517.85, 6),
(21, 10, 11, 'Docking Station con múltiples puertos USB', 148.92, 22),
(22, 11, 12, 'Almacenamiento Externo 2TB, USB 3.0', 90.14, 9),
(23, 12, 13, 'Router 4G, alta velocidad, hasta 150 Mbps', 89.62, 23),
(24, 13, 14, 'Tarjeta Gráfica 8GB, para juegos de alta resolución', 429.14, 9),
(25, 14, 15, 'CPU AMD Ryzen 5, 6 núcleos', 154.75, 8),
(26, 15, 10, 'Disco Duro SSD 1TB, velocidad 550MB/s', 82.01, 55),
(27, 6, 8, 'Impresora de etiquetas, alta velocidad', 111.65, 22),
(28, 7, 6, 'Webcam 1080p, ideal para streaming', 87.79, 66),
(29, 8, 9, 'Auriculares de diadema, sonido premium', 99.88, 15),
(30, 9, 4, 'Proyector de corta distancia, 1080p', 545.64, 264),
(31, 2, 2, 'RTX 4090 SUPER 500w', 999.00, 34),
(33, 4, 41, 'DISCO DURO PNY Sata 4200rpm', 44.00, 19),
(34, 1, 1, 'SUPER SUPER', 22.00, 19);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marca`
--

CREATE TABLE `marca` (
  `ID_Marca` int(2) UNSIGNED NOT NULL,
  `DESCRIPCION` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `marca`
--

INSERT INTO `marca` (`ID_Marca`, `DESCRIPCION`) VALUES
(1, 'ASUS'),
(2, 'Gigabyte'),
(3, 'Corsair'),
(4, 'Samsung'),
(5, 'Seagate'),
(6, 'HP'),
(7, 'Logitech'),
(8, 'Corsair'),
(9, 'BenQ'),
(10, 'Seagate'),
(11, 'Asus'),
(12, 'Samsung'),
(13, 'NVIDIA'),
(14, 'Intel'),
(15, 'Western Digital'),
(41, 'PNY');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `IDPedido` int(4) NOT NULL,
  `IDCliente` int(4) NOT NULL,
  `FechaHora` datetime NOT NULL,
  `Condicion` tinyint(1) NOT NULL CHECK (`Condicion` in (0,1,2,3)),
  `TipoPedido` tinyint(1) NOT NULL CHECK (`TipoPedido` in (1,2,3))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`IDPedido`, `IDCliente`, `FechaHora`, `Condicion`, `TipoPedido`) VALUES
(9, 23456789, '2024-10-15 23:49:00', 2, 2),
(10, 34567890, '2024-10-16 23:50:00', 2, 3),
(11, 43552311, '2024-10-08 23:56:00', 2, 1),
(12, 23456789, '2024-10-15 23:57:00', 2, 1),
(13, 23456789, '2024-10-24 16:54:00', 1, 1),
(14, 34567890, '2024-10-10 16:56:00', 2, 1),
(15, 43552311, '2024-10-16 16:57:00', 0, 1),
(16, 23456789, '2024-10-16 16:57:00', 0, 1),
(17, 23456789, '2024-10-16 20:24:00', 2, 1),
(18, 43552311, '2024-10-16 20:26:00', 2, 1),
(19, 12345678, '2024-11-01 23:01:00', 0, 1),
(20, 44123456, '2024-11-19 22:22:00', 1, 1),
(21, 44123456, '2024-11-19 22:25:00', 1, 1),
(22, 44123456, '2024-11-29 22:28:00', 2, 1),
(23, 44123456, '2030-06-25 16:33:00', 1, 1),
(24, 44123456, '2025-12-01 16:38:00', 1, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `ID_Proveedor` int(4) UNSIGNED NOT NULL,
  `CUIT` char(11) NOT NULL,
  `NOMBRE` varchar(40) NOT NULL,
  `DIRECCION` varchar(50) NOT NULL,
  `TELEFONO` varchar(20) DEFAULT NULL,
  `CORREO` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`ID_Proveedor`, `CUIT`, `NOMBRE`, `DIRECCION`, `TELEFONO`, `CORREO`) VALUES
(1, '20345678903', 'Proveedor 1 S.A.', 'Av. Central 789', '3456-7890', 'contacto@proveedor1.com'),
(2, '20345678904', 'Proveedor 2 S.A.', 'Calle Luna 101', '4567-8901', 'info@proveedor2.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `socios`
--

CREATE TABLE `socios` (
  `ID_Socio` int(4) UNSIGNED NOT NULL,
  `DNI` int(8) UNSIGNED NOT NULL,
  `APELLIDO_NOMBRE` varchar(40) NOT NULL,
  `DIRECCION` varchar(50) NOT NULL,
  `TELEFONO` varchar(20) DEFAULT NULL,
  `CORREO` varchar(255) DEFAULT NULL,
  `SOCIO_GERENTE` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `socios`
--

INSERT INTO `socios` (`ID_Socio`, `DNI`, `APELLIDO_NOMBRE`, `DIRECCION`, `TELEFONO`, `CORREO`, `SOCIO_GERENTE`) VALUES
(1, 45678901, 'Pedro Lopez', 'Calle del Sol 202', '5678-9012', 'pedro.lopez@email.com', 1),
(2, 56789012, 'Ana Martinez', 'Av. del Parque 303', '6789-0123', 'ana.martinez@email.com', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_hardware`
--

CREATE TABLE `tipo_hardware` (
  `ID_Tipohard` int(2) UNSIGNED NOT NULL,
  `DESCRIPCION` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipo_hardware`
--

INSERT INTO `tipo_hardware` (`ID_Tipohard`, `DESCRIPCION`) VALUES
(1, 'Placa Base'),
(2, 'Tarjeta Gráfica'),
(3, 'Memoria RAM'),
(4, 'Disco Duro'),
(5, 'Fuente de Poder'),
(6, 'Impresora Multifuncional'),
(7, 'Webcam'),
(8, 'Auriculares'),
(9, 'Proyector'),
(10, 'Docking Station'),
(11, 'Almacenamiento Externo'),
(12, 'Router'),
(13, 'Tarjeta Gráfica'),
(14, 'CPU'),
(15, 'Disco Duro SSD'),
(16, 'Tornillo de Gabinete');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `bancos`
--
ALTER TABLE `bancos`
  ADD PRIMARY KEY (`IdBanco`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`ID_Cliente`);

--
-- Indices de la tabla `cobros`
--
ALTER TABLE `cobros`
  ADD PRIMARY KEY (`IDCobro`);

--
-- Indices de la tabla `detalle_facturas_compra`
--
ALTER TABLE `detalle_facturas_compra`
  ADD PRIMARY KEY (`NroFacc`,`IDHard`);

--
-- Indices de la tabla `detalle_facturas_venta`
--
ALTER TABLE `detalle_facturas_venta`
  ADD PRIMARY KEY (`NroFacv`,`IDHard`);

--
-- Indices de la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  ADD PRIMARY KEY (`IDPedido`,`IDHard`);

--
-- Indices de la tabla `facturas_compra`
--
ALTER TABLE `facturas_compra`
  ADD PRIMARY KEY (`NroFacc`);

--
-- Indices de la tabla `facturas_venta`
--
ALTER TABLE `facturas_venta`
  ADD PRIMARY KEY (`NroFacv`),
  ADD KEY `IDPedido` (`IDPedido`);

--
-- Indices de la tabla `hardware`
--
ALTER TABLE `hardware`
  ADD PRIMARY KEY (`ID_Hard`),
  ADD KEY `ID_Tipohard` (`ID_Tipohard`),
  ADD KEY `ID_Marca` (`ID_Marca`);

--
-- Indices de la tabla `marca`
--
ALTER TABLE `marca`
  ADD PRIMARY KEY (`ID_Marca`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`IDPedido`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`ID_Proveedor`);

--
-- Indices de la tabla `socios`
--
ALTER TABLE `socios`
  ADD PRIMARY KEY (`ID_Socio`);

--
-- Indices de la tabla `tipo_hardware`
--
ALTER TABLE `tipo_hardware`
  ADD PRIMARY KEY (`ID_Tipohard`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `bancos`
--
ALTER TABLE `bancos`
  MODIFY `IdBanco` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `ID_Cliente` int(4) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT de la tabla `cobros`
--
ALTER TABLE `cobros`
  MODIFY `IDCobro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `detalle_facturas_venta`
--
ALTER TABLE `detalle_facturas_venta`
  MODIFY `NroFacv` bigint(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `facturas_venta`
--
ALTER TABLE `facturas_venta`
  MODIFY `NroFacv` bigint(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `hardware`
--
ALTER TABLE `hardware`
  MODIFY `ID_Hard` int(4) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `marca`
--
ALTER TABLE `marca`
  MODIFY `ID_Marca` int(2) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `IDPedido` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `ID_Proveedor` int(4) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `socios`
--
ALTER TABLE `socios`
  MODIFY `ID_Socio` int(4) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tipo_hardware`
--
ALTER TABLE `tipo_hardware`
  MODIFY `ID_Tipohard` int(2) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_facturas_compra`
--
ALTER TABLE `detalle_facturas_compra`
  ADD CONSTRAINT `detalle_facturas_compra_ibfk_1` FOREIGN KEY (`NroFacc`) REFERENCES `facturas_compra` (`NroFacc`);

--
-- Filtros para la tabla `detalle_facturas_venta`
--
ALTER TABLE `detalle_facturas_venta`
  ADD CONSTRAINT `detalle_facturas_venta_ibfk_1` FOREIGN KEY (`NroFacv`) REFERENCES `facturas_venta` (`NroFacv`);

--
-- Filtros para la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  ADD CONSTRAINT `detalle_pedidos_ibfk_1` FOREIGN KEY (`IDPedido`) REFERENCES `pedidos` (`IDPedido`);

--
-- Filtros para la tabla `facturas_venta`
--
ALTER TABLE `facturas_venta`
  ADD CONSTRAINT `facturas_venta_ibfk_1` FOREIGN KEY (`IDPedido`) REFERENCES `pedidos` (`IDPedido`);

--
-- Filtros para la tabla `hardware`
--
ALTER TABLE `hardware`
  ADD CONSTRAINT `hardware_ibfk_1` FOREIGN KEY (`ID_Tipohard`) REFERENCES `tipo_hardware` (`ID_Tipohard`),
  ADD CONSTRAINT `hardware_ibfk_2` FOREIGN KEY (`ID_Marca`) REFERENCES `marca` (`ID_Marca`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
