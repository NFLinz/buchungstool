-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 07, 2018 at 09:48 PM
-- Server version: 10.1.29-MariaDB
-- PHP Version: 7.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `buchungstool`
--

-- --------------------------------------------------------

--
-- Table structure for table `buchung`
--

CREATE TABLE `buchung` (
  `buchungID` int(10) UNSIGNED NOT NULL,
  `buchenderID` int(10) UNSIGNED DEFAULT NULL,
  `huetteID` int(10) UNSIGNED DEFAULT NULL,
  `zimmerID` int(10) UNSIGNED NOT NULL,
  `erwachsene` int(10) UNSIGNED NOT NULL,
  `kinder` int(10) UNSIGNED NOT NULL,
  `checkinDatum` date NOT NULL,
  `checkoutDatum` date NOT NULL,
  `buchungsDatum` datetime NOT NULL,
  `zahlungsDatum` date DEFAULT NULL,
  `zahlungsartID` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `buchung`
--

INSERT INTO `buchung` (`buchungID`, `buchenderID`, `huetteID`, `zimmerID`, `erwachsene`, `kinder`, `checkinDatum`, `checkoutDatum`, `buchungsDatum`, `zahlungsDatum`, `zahlungsartID`) VALUES
(1, 1, 1, 1, 2, 2, '2018-08-04', '2018-08-11', '2018-07-28 00:00:00', '2018-07-28', 1),
(2, 1, 1, 2, 1, 0, '2018-08-22', '2018-08-28', '2018-07-28 00:00:00', '2018-07-28', 1),
(3, 1, 1, 1, 3, 1, '2018-08-14', '2018-08-16', '2018-08-01 00:00:00', '2018-08-02', 1);

-- --------------------------------------------------------

--
-- Table structure for table `huette`
--

CREATE TABLE `huette` (
  `huetteID` int(10) UNSIGNED NOT NULL,
  `paechterID` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `adresse` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `plz` int(10) UNSIGNED NOT NULL,
  `ort` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `plaetze` int(10) UNSIGNED NOT NULL,
  `telefonnummer` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `mail` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `preis` int(10) UNSIGNED NOT NULL,
  `imageurl` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `huette`
--

INSERT INTO `huette` (`huetteID`, `paechterID`, `name`, `adresse`, `plz`, `ort`, `plaetze`, `telefonnummer`, `mail`, `preis`, `imageurl`) VALUES
(1, 1, 'Rohrauerhaus', 'Grünau 40', 4582, 'Spital/Pyhrn', 10, '+43 (0) 7563 660', 'rohrauerhaus@naturfreunde.at', 37, 'http://www.rohrauerhaus.at/wp-content/uploads/2016/07/P1010402V.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `paechter`
--

CREATE TABLE `paechter` (
  `paechterID` int(10) UNSIGNED NOT NULL,
  `mail` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `passwort` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `telefonnummer` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `vorname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `nachname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `paechter`
--

INSERT INTO `paechter` (`paechterID`, `mail`, `passwort`, `telefonnummer`, `vorname`, `nachname`, `created`) VALUES
(1, 'a@a.com', '123', '066012345678', 'Max', 'Mustermann', '2018-07-10 11:12:29');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userID` int(10) UNSIGNED NOT NULL,
  `vorname` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `nachname` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `geburtsdatum` date NOT NULL,
  `adresse` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `plz` int(10) UNSIGNED NOT NULL,
  `ort` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `telefonnummer` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `mail` varchar(70) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userID`, `vorname`, `nachname`, `geburtsdatum`, `adresse`, `plz`, `ort`, `telefonnummer`, `mail`) VALUES
(1, 'Jakob', 'Spirk', '0000-00-00', 'Tirol 1', 2929, 'Zirl', '066012345678', 'jakob@spirk.at');

-- --------------------------------------------------------

--
-- Table structure for table `zahlungsart`
--

CREATE TABLE `zahlungsart` (
  `zahlungsartID` int(11) UNSIGNED NOT NULL,
  `name` varchar(60) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `zahlungsart`
--

INSERT INTO `zahlungsart` (`zahlungsartID`, `name`) VALUES
(1, 'Zahlung auf Rechnung (inkl. Anzahlung)');

-- --------------------------------------------------------

--
-- Table structure for table `zimmer`
--

CREATE TABLE `zimmer` (
  `zimmerID` int(10) UNSIGNED NOT NULL,
  `zimmerkategorieID` int(10) UNSIGNED NOT NULL,
  `huetteID` int(10) UNSIGNED NOT NULL,
  `plaetze` int(10) UNSIGNED NOT NULL,
  `bezeichnung` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `zimmer`
--

INSERT INTO `zimmer` (`zimmerID`, `zimmerkategorieID`, `huetteID`, `plaetze`, `bezeichnung`) VALUES
(1, 1, 1, 4, 'Zimmer 1'),
(2, 1, 1, 3, 'Zimmer 2');

-- --------------------------------------------------------

--
-- Table structure for table `zimmerkategorie`
--

CREATE TABLE `zimmerkategorie` (
  `zimmerkategorieID` int(10) UNSIGNED NOT NULL,
  `name` varchar(70) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `zimmerkategorie`
--

INSERT INTO `zimmerkategorie` (`zimmerkategorieID`, `name`) VALUES
(1, 'Standard'),
(2, 'Komfort'),
(3, 'Lager'),
(4, 'Hütte');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `buchung`
--
ALTER TABLE `buchung`
  ADD PRIMARY KEY (`buchungID`),
  ADD KEY `buchenderID` (`buchenderID`),
  ADD KEY `huetteID` (`huetteID`),
  ADD KEY `zahlungsartID` (`zahlungsartID`),
  ADD KEY `zimmerID` (`zimmerID`);

--
-- Indexes for table `huette`
--
ALTER TABLE `huette`
  ADD PRIMARY KEY (`huetteID`),
  ADD UNIQUE KEY `mail` (`mail`),
  ADD KEY `paechterID` (`paechterID`);

--
-- Indexes for table `paechter`
--
ALTER TABLE `paechter`
  ADD PRIMARY KEY (`paechterID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userID`);

--
-- Indexes for table `zahlungsart`
--
ALTER TABLE `zahlungsart`
  ADD PRIMARY KEY (`zahlungsartID`);

--
-- Indexes for table `zimmer`
--
ALTER TABLE `zimmer`
  ADD PRIMARY KEY (`zimmerID`),
  ADD KEY `zimmerkategorieID` (`zimmerkategorieID`),
  ADD KEY `huetteID` (`huetteID`);

--
-- Indexes for table `zimmerkategorie`
--
ALTER TABLE `zimmerkategorie`
  ADD PRIMARY KEY (`zimmerkategorieID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `buchung`
--
ALTER TABLE `buchung`
  MODIFY `buchungID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `huette`
--
ALTER TABLE `huette`
  MODIFY `huetteID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `paechter`
--
ALTER TABLE `paechter`
  MODIFY `paechterID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `zahlungsart`
--
ALTER TABLE `zahlungsart`
  MODIFY `zahlungsartID` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `zimmer`
--
ALTER TABLE `zimmer`
  MODIFY `zimmerID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `zimmerkategorie`
--
ALTER TABLE `zimmerkategorie`
  MODIFY `zimmerkategorieID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `buchung`
--
ALTER TABLE `buchung`
  ADD CONSTRAINT `buchung_ibfk_1` FOREIGN KEY (`buchenderID`) REFERENCES `user` (`userID`),
  ADD CONSTRAINT `buchung_ibfk_2` FOREIGN KEY (`huetteID`) REFERENCES `huette` (`huetteID`),
  ADD CONSTRAINT `buchung_ibfk_3` FOREIGN KEY (`zahlungsartID`) REFERENCES `zahlungsart` (`zahlungsartID`),
  ADD CONSTRAINT `buchung_ibfk_4` FOREIGN KEY (`zimmerID`) REFERENCES `zimmer` (`zimmerID`);

--
-- Constraints for table `huette`
--
ALTER TABLE `huette`
  ADD CONSTRAINT `huette_ibfk_1` FOREIGN KEY (`paechterID`) REFERENCES `paechter` (`paechterID`);

--
-- Constraints for table `zimmer`
--
ALTER TABLE `zimmer`
  ADD CONSTRAINT `zimmer_ibfk_1` FOREIGN KEY (`zimmerkategorieID`) REFERENCES `zimmerkategorie` (`zimmerkategorieID`),
  ADD CONSTRAINT `zimmer_ibfk_2` FOREIGN KEY (`huetteID`) REFERENCES `huette` (`huetteID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
