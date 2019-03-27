-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 27. Mrz 2019 um 22:33
-- Server-Version: 10.1.29-MariaDB
-- PHP-Version: 7.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `buchungstool`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `buchung`
--

CREATE TABLE `buchung` (
  `buchungID` int(10) UNSIGNED NOT NULL,
  `huetteID` int(10) UNSIGNED DEFAULT NULL,
  `anrede` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `firmenname` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `erwachseneMitglieder` int(10) UNSIGNED NOT NULL,
  `jugendlicheMitglieder` int(10) UNSIGNED NOT NULL,
  `kinderMitglieder` int(10) UNSIGNED NOT NULL,
  `erwachseneNichtMitglieder` int(10) UNSIGNED NOT NULL,
  `jugendlicheNichtMitglieder` int(10) UNSIGNED NOT NULL,
  `kinderNichtMitglieder` int(10) UNSIGNED NOT NULL,
  `checkinDatum` date NOT NULL,
  `checkoutDatum` date NOT NULL,
  `buchungsDatum` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `preis` decimal(5,2) UNSIGNED NOT NULL,
  `anzahlung` decimal(5,2) UNSIGNED NOT NULL,
  `preisErwachsene` decimal(5,2) UNSIGNED NOT NULL,
  `preisJugendliche` decimal(5,2) UNSIGNED NOT NULL,
  `preisKinder` decimal(5,2) UNSIGNED NOT NULL,
  `freiplaetzeErwMitglied` int(5) UNSIGNED NOT NULL,
  `freiplaetzeJgdMitglied` int(5) UNSIGNED NOT NULL,
  `freiplaetzeKindMitglied` int(5) UNSIGNED NOT NULL,
  `freiplaetzeErwNichtMitglied` int(5) UNSIGNED NOT NULL,
  `freiplaetzeJgdNichtMitglied` int(5) UNSIGNED NOT NULL,
  `freiplaetzeKindNichtMitglied` int(5) UNSIGNED NOT NULL,
  `sonderrabatt` decimal(5,2) UNSIGNED NOT NULL,
  `zahlungsDatum` date DEFAULT NULL,
  `zahlungsartID` int(10) UNSIGNED DEFAULT NULL,
  `verpflegung` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `bvorname` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `bnachname` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `bgeburtsdatum` date DEFAULT NULL,
  `badresse` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `bplz` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `bort` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `btelefonnummer` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `bmail` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `bmitglied` tinyint(1) DEFAULT NULL,
  `bemerkung` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `bestaetigt` tinyint(1) NOT NULL DEFAULT '0',
  `rgversendet` tinyint(1) NOT NULL DEFAULT '0',
  `bezahlt` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `buchung`
--

INSERT INTO `buchung` (`buchungID`, `huetteID`, `anrede`, `firmenname`, `erwachseneMitglieder`, `jugendlicheMitglieder`, `kinderMitglieder`, `erwachseneNichtMitglieder`, `jugendlicheNichtMitglieder`, `kinderNichtMitglieder`, `checkinDatum`, `checkoutDatum`, `buchungsDatum`, `preis`, `anzahlung`, `preisErwachsene`, `preisJugendliche`, `preisKinder`, `freiplaetzeErwMitglied`, `freiplaetzeJgdMitglied`, `freiplaetzeKindMitglied`, `freiplaetzeErwNichtMitglied`, `freiplaetzeJgdNichtMitglied`, `freiplaetzeKindNichtMitglied`, `sonderrabatt`, `zahlungsDatum`, `zahlungsartID`, `verpflegung`, `bvorname`, `bnachname`, `bgeburtsdatum`, `badresse`, `bplz`, `bort`, `btelefonnummer`, `bmail`, `bmitglied`, `bemerkung`, `bestaetigt`, `rgversendet`, `bezahlt`) VALUES
(2, 1, 'Firma', 'kj', 2, 2, 0, 1, 2, 0, '2019-03-28', '2019-03-31', '2019-03-25 12:12:28', '515.40', '0.00', '30.00', '1.00', '0.00', 0, 0, 0, 0, 0, 0, '100.00', '2019-03-25', 1, '0', 'Daniela', 'Bucher', '0000-00-00', '', '', '', '999', 'nftestkunde@gmail.com', 0, '', 1, 1, 1),
(3, 1, 'Herr', '', 1, 0, 0, 1, 1, 0, '2019-03-13', '2019-03-15', '2019-03-25 12:35:22', '135.60', '0.00', '0.00', '0.00', '0.00', 0, 0, 0, 0, 0, 0, '0.00', '2019-03-25', 1, '2', 'Max', 'Mustermann', '1996-08-08', 'Musterstraße 3', '4020', 'Linz', '0668737448', 'nftestkunde@gmail.com', 1, '', 1, 0, 0),
(4, 1, 'Herr', '', 1, 1, 1, 1, 1, 1, '2019-03-05', '2019-03-06', '2019-03-25 15:49:18', '72.00', '0.00', '0.00', '0.00', '0.00', 0, 0, 0, 0, 0, 0, '0.00', '2019-03-25', 1, '0', 'Markus', 'Testkunde', '0000-00-00', 'kjkj', '88', '88', '88', 'nftestkunde@gmail.com', 0, '', 0, 0, 0),
(5, 1, 'Herr', '', 2, 0, 0, 0, 1, 0, '2019-03-08', '2019-03-09', '2019-03-25 19:23:34', '65.10', '18.00', '19.00', '12.00', '0.00', 1, 0, 0, 0, 0, 0, '2.00', '2019-03-25', 1, '0', 'Maria', 'Musterfrau', '0000-00-00', 'jj', 'jj', 'jj', 'jj', 'nftestkunde@gmail.com', 0, '', 0, 0, 0),
(9, 1, 'Herr', '', 0, 0, 0, 1, 0, 0, '2019-03-15', '2019-03-16', '2019-03-26 12:00:29', '32.00', '16.00', '20.00', '12.00', '0.00', 0, 0, 0, 0, 0, 0, '0.00', '2019-03-26', 1, 'Halbpension', 'John', 'Doe', '1999-08-08', '8', '8', '8', '8', '8', 0, '', 0, 0, 0),
(14, 1, '', '', 0, 0, 0, 3, 0, 0, '2019-03-20', '2019-03-22', '2019-03-26 13:15:33', '64.00', '81.00', '16.00', '12.00', '0.00', 0, 0, 0, 1, 0, 0, '0.00', '2019-03-26', 1, 'Halbpension', 'Toni', 'Testmann', '1985-08-08', 'Teststraße 4', '4020', 'Linz', '06607834221', 'nftestkunde@gmail.com', 0, '', 1, 1, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `huette`
--

CREATE TABLE `huette` (
  `huetteID` int(10) UNSIGNED NOT NULL,
  `paechtername` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `adresse` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `plz` int(10) UNSIGNED NOT NULL,
  `ort` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `plaetze` int(10) UNSIGNED NOT NULL,
  `telefonnummer` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `mail` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `website` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `kontoinhaber` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `IBAN` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `BIC` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `imageurl` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `logourl` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `fruehstueckspreis` decimal(4,2) NOT NULL,
  `halbpensionspreis` decimal(4,2) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `huette`
--

INSERT INTO `huette` (`huetteID`, `paechtername`, `name`, `adresse`, `plz`, `ort`, `plaetze`, `telefonnummer`, `mail`, `website`, `kontoinhaber`, `IBAN`, `BIC`, `imageurl`, `logourl`, `fruehstueckspreis`, `halbpensionspreis`) VALUES
(1, 'Matthias Hummel', 'Rohrauerhaus', 'Grünau 40', 4582, 'Spital/Pyhrn', 10, '+43 (0)7563 / 660', 'nftestpaechter@gmail.com', 'www.rohrauerhaus.at', 'Matthias Markus Hummel', 'AT90 2032 0321 0039 7425', 'ASPKAT2LXXX', 'http://www.rohrauerhaus.at/wp-content/uploads/2016/07/P1010402V.jpg', 'http://www.rohrauerhaus.at/wp-content/uploads/2016/05/logo_rohrauerhaus.png', '7.00', '12.00');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mitreisender`
--

CREATE TABLE `mitreisender` (
  `mitreisenderID` int(10) UNSIGNED NOT NULL,
  `buchungID` int(10) UNSIGNED NOT NULL,
  `vorname` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `nachname` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `geburtsdatum` date NOT NULL,
  `mitglied` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `mitreisender`
--

INSERT INTO `mitreisender` (`mitreisenderID`, `buchungID`, `vorname`, `nachname`, `geburtsdatum`, `mitglied`) VALUES
(1, 3, 'Max', 'Muster', '1999-08-08', 0),
(2, 3, 'Maria', 'Muster', '2009-08-08', 0),
(6, 9, '', '', '0000-00-00', 0),
(9, 14, 'Testy2', 'Nachname', '1999-08-08', 0),
(10, 14, 'Testy1', 'Nachname', '1999-08-08', 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `paechter`
--

CREATE TABLE `paechter` (
  `paechterID` int(10) UNSIGNED NOT NULL,
  `huetteID` int(10) UNSIGNED NOT NULL,
  `mail` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `passwort` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `telefonnummer` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `vorname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `nachname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `paechter`
--

INSERT INTO `paechter` (`paechterID`, `huetteID`, `mail`, `passwort`, `telefonnummer`, `vorname`, `nachname`, `created`) VALUES
(1, 1, 'a@a.com', '123', '066012345678', 'Max', 'Mustermann', '2018-11-30 19:37:15');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `rechnung`
--

CREATE TABLE `rechnung` (
  `rechnungID` int(10) UNSIGNED NOT NULL,
  `huetteID` int(10) UNSIGNED NOT NULL,
  `buchungID` int(10) UNSIGNED NOT NULL,
  `datum` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `rechnung`
--

INSERT INTO `rechnung` (`rechnungID`, `huetteID`, `buchungID`, `datum`) VALUES
(1, 1, 2, '2019-03-25'),
(2, 1, 5, '2019-03-25'),
(4, 1, 4, '2019-03-25'),
(6, 1, 14, '2019-03-26');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `sperrtag`
--

CREATE TABLE `sperrtag` (
  `sperrtagID` int(11) NOT NULL,
  `huetteID` int(10) UNSIGNED NOT NULL,
  `startDatum` date NOT NULL,
  `endDatum` date NOT NULL,
  `info` varchar(120) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `sperrtag`
--

INSERT INTO `sperrtag` (`sperrtagID`, `huetteID`, `startDatum`, `endDatum`, `info`) VALUES
(2, 1, '2018-12-24', '2018-12-27', 'Weihnachten'),
(3, 1, '2019-01-06', '2019-01-06', 'Hl. drei Könige'),
(4, 1, '2018-12-08', '2018-12-08', 'Mariä Empfängnis'),
(5, 1, '2019-01-10', '2019-01-15', 'Urlaub');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `zahlungsart`
--

CREATE TABLE `zahlungsart` (
  `zahlungsartID` int(11) UNSIGNED NOT NULL,
  `name` varchar(60) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `zahlungsart`
--

INSERT INTO `zahlungsart` (`zahlungsartID`, `name`) VALUES
(1, 'Zahlung auf Rechnung (inkl. Anzahlung)');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `zimmer`
--

CREATE TABLE `zimmer` (
  `zimmerID` int(10) UNSIGNED NOT NULL,
  `zimmerkategorieID` int(10) UNSIGNED NOT NULL,
  `huetteID` int(10) UNSIGNED NOT NULL,
  `plaetze` int(10) UNSIGNED NOT NULL,
  `preisErw` decimal(4,2) NOT NULL,
  `preisJgd` decimal(4,2) NOT NULL,
  `bezeichnung` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `zimmer`
--

INSERT INTO `zimmer` (`zimmerID`, `zimmerkategorieID`, `huetteID`, `plaetze`, `preisErw`, `preisJgd`, `bezeichnung`) VALUES
(1, 1, 1, 4, '20.00', '12.00', 'Zimmer unten'),
(2, 1, 1, 3, '20.00', '12.00', 'Zimmer oben'),
(3, 2, 1, 3, '30.00', '22.00', 'Panoramazimmer'),
(4, 3, 1, 20, '22.00', '12.00', 'Lager');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `zimmerkategorie`
--

CREATE TABLE `zimmerkategorie` (
  `zimmerkategorieID` int(10) UNSIGNED NOT NULL,
  `name` varchar(70) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `zimmerkategorie`
--

INSERT INTO `zimmerkategorie` (`zimmerkategorieID`, `name`) VALUES
(1, 'Standard'),
(2, 'Komfort'),
(3, 'Lager'),
(4, 'Hütte');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `zimmerzuteilung`
--

CREATE TABLE `zimmerzuteilung` (
  `zimmerzuteilungID` int(10) UNSIGNED NOT NULL,
  `buchungID` int(10) UNSIGNED NOT NULL,
  `zimmerID` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `zimmerzuteilung`
--

INSERT INTO `zimmerzuteilung` (`zimmerzuteilungID`, `buchungID`, `zimmerID`) VALUES
(2, 2, 1),
(3, 2, 2),
(4, 3, 4),
(5, 4, 1),
(6, 4, 2),
(7, 5, 1),
(9, 9, 1),
(14, 14, 1);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `buchung`
--
ALTER TABLE `buchung`
  ADD PRIMARY KEY (`buchungID`),
  ADD KEY `huetteID` (`huetteID`),
  ADD KEY `zahlungsartID` (`zahlungsartID`);

--
-- Indizes für die Tabelle `huette`
--
ALTER TABLE `huette`
  ADD PRIMARY KEY (`huetteID`),
  ADD UNIQUE KEY `mail` (`mail`);

--
-- Indizes für die Tabelle `mitreisender`
--
ALTER TABLE `mitreisender`
  ADD PRIMARY KEY (`mitreisenderID`),
  ADD KEY `mitreisender_ibfk_1` (`buchungID`);

--
-- Indizes für die Tabelle `paechter`
--
ALTER TABLE `paechter`
  ADD PRIMARY KEY (`paechterID`),
  ADD KEY `huetteID` (`huetteID`);

--
-- Indizes für die Tabelle `rechnung`
--
ALTER TABLE `rechnung`
  ADD PRIMARY KEY (`rechnungID`),
  ADD KEY `huetteIDforeignKey` (`huetteID`),
  ADD KEY `buchungIDforeignKey` (`buchungID`);

--
-- Indizes für die Tabelle `sperrtag`
--
ALTER TABLE `sperrtag`
  ADD PRIMARY KEY (`sperrtagID`),
  ADD KEY `huetteID` (`huetteID`);

--
-- Indizes für die Tabelle `zahlungsart`
--
ALTER TABLE `zahlungsart`
  ADD PRIMARY KEY (`zahlungsartID`);

--
-- Indizes für die Tabelle `zimmer`
--
ALTER TABLE `zimmer`
  ADD PRIMARY KEY (`zimmerID`),
  ADD KEY `zimmerkategorieID` (`zimmerkategorieID`),
  ADD KEY `huetteID` (`huetteID`);

--
-- Indizes für die Tabelle `zimmerkategorie`
--
ALTER TABLE `zimmerkategorie`
  ADD PRIMARY KEY (`zimmerkategorieID`);

--
-- Indizes für die Tabelle `zimmerzuteilung`
--
ALTER TABLE `zimmerzuteilung`
  ADD PRIMARY KEY (`zimmerzuteilungID`),
  ADD KEY `zimmerID` (`zimmerID`),
  ADD KEY `zimmerzuteilung_ibfk_1` (`buchungID`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `buchung`
--
ALTER TABLE `buchung`
  MODIFY `buchungID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT für Tabelle `huette`
--
ALTER TABLE `huette`
  MODIFY `huetteID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `mitreisender`
--
ALTER TABLE `mitreisender`
  MODIFY `mitreisenderID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT für Tabelle `paechter`
--
ALTER TABLE `paechter`
  MODIFY `paechterID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `rechnung`
--
ALTER TABLE `rechnung`
  MODIFY `rechnungID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT für Tabelle `sperrtag`
--
ALTER TABLE `sperrtag`
  MODIFY `sperrtagID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT für Tabelle `zahlungsart`
--
ALTER TABLE `zahlungsart`
  MODIFY `zahlungsartID` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `zimmer`
--
ALTER TABLE `zimmer`
  MODIFY `zimmerID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `zimmerkategorie`
--
ALTER TABLE `zimmerkategorie`
  MODIFY `zimmerkategorieID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `zimmerzuteilung`
--
ALTER TABLE `zimmerzuteilung`
  MODIFY `zimmerzuteilungID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `buchung`
--
ALTER TABLE `buchung`
  ADD CONSTRAINT `buchung_ibfk_2` FOREIGN KEY (`huetteID`) REFERENCES `huette` (`huetteID`),
  ADD CONSTRAINT `buchung_ibfk_3` FOREIGN KEY (`zahlungsartID`) REFERENCES `zahlungsart` (`zahlungsartID`);

--
-- Constraints der Tabelle `mitreisender`
--
ALTER TABLE `mitreisender`
  ADD CONSTRAINT `mitreisender_ibfk_1` FOREIGN KEY (`buchungID`) REFERENCES `buchung` (`buchungID`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `paechter`
--
ALTER TABLE `paechter`
  ADD CONSTRAINT `paechter_ibfk_1` FOREIGN KEY (`huetteID`) REFERENCES `huette` (`huetteID`);

--
-- Constraints der Tabelle `rechnung`
--
ALTER TABLE `rechnung`
  ADD CONSTRAINT `buchungIDforeignKey` FOREIGN KEY (`buchungID`) REFERENCES `buchung` (`buchungID`) ON DELETE CASCADE,
  ADD CONSTRAINT `huetteIDforeignKey` FOREIGN KEY (`huetteID`) REFERENCES `huette` (`huetteID`);

--
-- Constraints der Tabelle `sperrtag`
--
ALTER TABLE `sperrtag`
  ADD CONSTRAINT `sperrtag_ibfk_1` FOREIGN KEY (`huetteID`) REFERENCES `huette` (`huetteID`);

--
-- Constraints der Tabelle `zimmer`
--
ALTER TABLE `zimmer`
  ADD CONSTRAINT `zimmer_ibfk_1` FOREIGN KEY (`zimmerkategorieID`) REFERENCES `zimmerkategorie` (`zimmerkategorieID`),
  ADD CONSTRAINT `zimmer_ibfk_2` FOREIGN KEY (`huetteID`) REFERENCES `huette` (`huetteID`);

--
-- Constraints der Tabelle `zimmerzuteilung`
--
ALTER TABLE `zimmerzuteilung`
  ADD CONSTRAINT `zimmerzuteilung_ibfk_1` FOREIGN KEY (`buchungID`) REFERENCES `buchung` (`buchungID`) ON DELETE CASCADE,
  ADD CONSTRAINT `zimmerzuteilung_ibfk_2` FOREIGN KEY (`zimmerID`) REFERENCES `zimmer` (`zimmerID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
