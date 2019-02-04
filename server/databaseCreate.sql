-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: qhighschool
-- ------------------------------------------------------
-- Server version	5.7.16-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subjectId` int(11) DEFAULT NULL,
  `name` varchar(128) NOT NULL,
  `description` mediumtext,
  `remarks` mediumtext,
  `studyTime` double DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `subject_idx` (`subjectId`),
  CONSTRAINT `subject` FOREIGN KEY (`subjectId`) REFERENCES `school_subject` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (12,8,'Webdesignddd','Je leert hier een responsive website te ontddwikkelen met opmaak van menu, tdddekst, plaatjes, filmpjes en lay-out van de website. Tevens leer je de basics van Javascript. Je leert ook om je website online te zetten tedddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd','sdfsdf',24,NULL,'2018-12-27 15:53:28'),(13,8,'Introductie Informatica','Tijdens deze module ontdek je of het vak informatica iets voor jou is. Met behulp van Arduino leer je de basisprincipes van programmeren en pas je deze toe op een project van jouw keuze. ','',24,NULL,NULL),(14,8,'Basis van Programmeren','Het ontwikkelen van een aantal programma’s met een programmeertaal naar keuze (Scratch, Visual Basic, C#, Python). Je begint het programmeren te leren aan de hand van oefenprogramma’s die steeds wat moeilijker worden in opbouw. Je leert dit a.d.h.v. eigen materiaal docent en video’s.','',24,NULL,NULL),(15,8,'Keuzemodules','Keuze uit: 1)	Programmeren met Microbit 2)	Mediawijsheid','',24,NULL,NULL),(16,8,'Databases en SQL','Je leert hier om een complete database te ontwerpen en te gebruiken. Gegevens opvragen uit jouw database gaat met de vraagtaal SQL. Dat leer je ook. Ontwikkel een database die jij interessant of leuk vindt.','a',24,NULL,'2018-12-05 17:25:43'),(17,8,'Gamemaking','Tijdens deze module bedenk en maak je je eigen computergame. met Gamemaker of Unity (naar keuze). Voor Unity is een goede grafische kaart nodig.','',24,NULL,NULL),(18,8,'Programmeren met Python','De programmeertaal Python wordt veel gebruikt op de universiteit voor het verwerken van grote aantallen gegevens (veelal statistische gegevens).','',24,NULL,NULL),(19,8,'Visueel programmeren met Java','Je leert hier visueel te programmeren met Greenfoot. Visueel betekent dat je direct kunt zien wat het resultaat is van je code. Greenfoot is gebaseerd op de programmeertaal Java.','',24,NULL,NULL),(20,8,'Cryptografie','Hier leer je over diverse versleutelingstechnieken zoals Caesar, Vigenère, RSA en brute force attack. Hier zit vrij veel wiskunde in (modulorekenen en het algoritme van Euclides).','',24,NULL,NULL),(21,8,'Object georiënteerd programmeren',' Het objectgeoriënteerd programmeren leer je hier met Java of met C# (naar keuze).','',24,NULL,NULL),(22,8,'Artificial Intelligence','Wanneer apparatuur of software reageert op data of signalen uit de omgeving en op basis daarvan zelfstandig beslissingen neemt, spreken we over artificial intelligence ofwel kunstmatige intelligentie. Tijdens deze module maak je kennis met de (on)mogelijkheden van kunstmatige intelligentie.','',24,NULL,NULL),(23,9,'Wijsgerige Antropologie','In deze module staat de vraag centraal: wat is de mens? We gaan in op het (vermeende) verschil tussen mens en dier en tussen mens en machine, bespreken het monisme en dualisme (hebben we een ziel of immateriële geest?) en onderzoeken het concept van de vrije wil. Voordat we ons in de filosofie bezig kunnen houden met andere onderwerpen, zullen we eerst fundamenteel moeten nadenken over wie of wat we menen te zijn.\nsdf\nsd\nfsd\nsdsd\nsd','',24,NULL,NULL),(24,9,'Wijsgerige Ethiek','Wat is een goed leven? Wat is een goede handeling? En wat is een goed mens? De wijsgerige ethiek is de stroming die bekijkt waar we het over hebben als we spreken over goed en kwaad. We bespreken stromingen als het utilitarisme en de deontologie, die beide regels proberen te geven voor goed handelen, maar ook de deugdethiek, die zich richt op het goede leven. Dit vergelijken we met denkers als Nietzsche, die stelling neemt tegen de idee van een gemeenschappelijke moraal. Tijdens deze module leer je ethische discussies beter te begrijpen en je eigen opvattingen beter onderbouwd uit te drukken.','',24,NULL,NULL),(26,9,'Filosofische vaardigheden','Filosoferen vereist helder nadenken, het vermogen om hoofd- en bijzaken te onderscheiden en de openheid om een onderwerp vanuit meer perspectieven te bekijken. Binnen het vak filosofie worden dan ook deze vaardigheden aangeleerd. Je leert een tekst te begrijpen en te analyseren, zelf filosofische argumenten uit te pluizen en te creëren en deze argumenten op een overtuigende manier te brengen.','Minimaal 1 module filosofie eerder gevolgd hebben',24,NULL,NULL),(27,9,'Sociaal politieke filosofie','Binnen deze vorm van filosofie nemen we de samenleving onder de loep. Wat is een goede samenleving, en zijn wij eigenlijk wel zo geschikt om samen te leven? In hoeverre mag de staat de vrijheden van het individu inperken om de gemeenschap te beschermen? Het begrip ‘vrijheid’ speelt hier een grote rol, evenals ‘macht’ en ‘gelijkheid’. Ook kijken we naar de wijze waarop de media en de politiek ons buiten ons weten, kunnen beïnvloeden. ','Module Antropologie óf Ethiek (ook op ELO)',24,NULL,NULL),(28,9,'Wat is een persoon en waar ben ik?','Het examenonderwerp in havo 5 is: “Ik. Filosofie van het Zelf”. Dit is een onderdeel van de wijsgerige antropologie. Wat ben je als je “jezelf niet meer bent”? Hoe kennen we onszelf? Wat is ons authentieke zelf en wat is de invloed van de omgeving hierop? Deze vragen behandelen we in het examenonderwerp. We bespreken filosofen als John Locke, David Hume en Daniel Dennett en gaan in op relevante vragen uit de wijsgerige antropologie, maar ook uit andere domeinen van de filosofie.','Alle verplichte examenmodules',24,NULL,NULL),(29,9,'Jezelf kennen en jezelf zijn','Deze tweede examenmodule behandelt de vraag naar zelfkennis: hoe kennen we onszelf eigenlijk? Kunnen anderen je beter kennen dan jij jezelf kent? We kijken ook naar authenticiteit: wat betekent het eigenlijk om “jezelf” te zijn? Bepaal je zelf wat je eigenlijk wilt, of wordt dit bepaald door je omgeving en je opvoeding? Hier bespreken we filosofen als Ludwig Wittgenstein, Jean-Jacques Rouseau, Jean-Paul Sartre, Charles Taylor en anderen.','Alle verplichte examenmodules',24,NULL,NULL),(30,9,'Jezelf bepalen en zelfverbetering','In deze derde en laatste examenmodule kijken we naar wat het betekent om autonoom te zijn. Kun je authentieke of “echte” keuzes maken als je niet onafhankelijk bent van anderen? Is het eigenlijk wel mogelijk om echt los van de invloed van anderen te zijn? We bespreken ook de laatste technieken van mensverbetering: van computerchips in je hoofd tot je telefoon als een onderdeel van je identiteit. Ben je niet een deel van jezelf kwijt als je je telefoon hebt verloren? We bespreken filosofen als John Stuart Mill, Catriona MacKenzie en Alan Buchanan.','Alle verplichte examenmodules',24,NULL,NULL),(31,9,'Scepticisme op scherp gesteld en de buitenwereld op de helling','Weten we wel iets zeker? Het lijkt een vreemde vraag, maar toch is dit de vraag die ten grondslag ligt aan het scepticisme. In deze eerste examenmodule behandelen we de redenen om fundamenteel aan alles te twijfelen en de verschillende soorten scepticisme. We betwijfelen of we onze waarneming kunnen vertrouwen en wat de redenen kunnen zijn om aan te nemen dat de wereld die wij zien wel bestaat (of niet). We behandelen hierbij filosofen als René Descartes, David Hume, George Berkeley, Immanuel Kant en anderen.','Alle verplichte examenmodules',24,NULL,NULL),(32,9,'De mogelijkheid van kennis','Wat betekent het als we zeggen dat we iets weten of kennen? Kan ik weten dat de Mont Blanc 4811 meter hoog is, ook al heb ik die berg niet zelf gemeten? Stel dat ik Arthur een koekje zie stelen, maar ik vergis me en denk dat hij Bob heet, weet ik dan dat Bob een koekje heeft gestolen? En kan ik zeggen dat ik weet dat er een God bestaat (of niet bestaat)? In deze tweede examenmodule behandelen we de vraag naar de mogelijkheid van kennis: waar moet een uitspraak aan voldoen om gezien te worden als kennis? We behandelen hierbij filosofen als Plato, Charles Peirce, Edmund Gettier, John Austin en anderen.','Alle verplichte examenmodules',24,NULL,NULL),(33,9,'De intieme en ondoordringbare belevingswereld en wereldbeelden op de helling','Hoe weet ik dat je geen robot bent die doet alsof je een mens bent, zoals in de serie “Westworld”? Zulke robots zijn perfecte kopieën van mensen, maar beleven ze de wereld ook zoals mensen doen? We zullen in deze laatste examenmodule ingaan op dit soort vragen. Wat is het bewustzijn? Hebben we wel onmiddellijk toegang tot ons bewustzijn, of kennen we onszelf alleen maar door onze gedachten en ons gedrag waar te nemen? We gaan in deze module ook in op de vraag hoe sceptisch we nou eigenlijk moeten zijn in het dagelijks leven. Het gaat een beetje ver om aan alles te twijfelen… Maar hoe weet je dan wel waar je sceptisch over moet zijn? We behandelen hierbij filosofen als Ludwig Wittgenstein, René Descartes, Karl Popper, Thomas Kuhn en anderen.','Alle verplichte examenmodules',24,NULL,NULL),(34,10,'Levensvragen en levenswijsheid','test','sdfsdsdf',34342,NULL,'2018-12-27 15:53:50'),(35,9,'Wereldverbeteraars','De beroemde denker Karl Marx schreef in 1845: ‘Filosofen hebben de wereld slechts verschillend geïnterpreteerd; het komt erop aan haar te veranderen’. Deze module neemt Marx’ activerende uitspraak als uitgangspunt. Jullie denken niet alleen kritisch na over ‘de wereld’, maar zoeken ook naar verbeteringen en beschrijven deze in je eigen manifest. Dit mag, afhankelijk van je interesse, zowel gaan over politieke of economische ‘wereldproblemen’, als over problemen in je eigen ‘leefwereld’, maar het moet in alle gevallen wel filosofisch beargumenteerd worden. Deze module is bijzonder geschikt voor jonge idealisten.  ','',24,NULL,NULL),(36,10,'Combinatoriek en Kansrekening','Combinatoriek en Kansrekening vindt zijn oorsprong in gokspelletjes, honderden jaren geleden, maar is een serieuze wetenschap geworden met heel verrassende resultaten. We spelen een spelletje. Jij gooit als eerste met twee dobbelstenen. Gooi je in totaal zes ogen, dan heb je gewonnen. Zo niet, dan mag je tegenstander gooien. Die wint als hij totaal zeven ogen gooit. Zo niet, dan mag jij weer, enz. Wie heeft de grootste kans om te winnen? Probeer het maar eens uit! En wist je bijvoorbeeld dat de kans dat er op een voetbalveld twee mensen op dezelfde dag jarig zijn, groter is dan 50%? En dat terwijl er slechts 23 personen rondlopen (vergeet de scheidsrechter niet!) en een jaar maar liefst 365 dagen telt.','Wiskunde B in je pakket',24,NULL,NULL),(37,10,'Complexe getallen','Bij Complexe getallen maken we het nog bonter. Het kwadraat van een positief getal is positief, nietwaar? Het kwadraat van een negatief getal is positief, toch? Dus een kwadraat is nooit negatief? Fout! We gaan rekenen met getallen waarvan het kwadraat wel negatief is. We kunnen dan ook wortels trekken uit negatieve getallen. Het lijkt waanzin, maar het is één van de meest fascinerende en belangrijke onderdelen van de wiskunde, met talloze toepassingen binnen en buiten de wiskunde. Deins je niet terug voor een compleet nieuw en complex avontuur, dan is deze module op je lijf geschreven.','Wiskunde B in je pakket',24,NULL,NULL);
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_group`
--

DROP TABLE IF EXISTS `course_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseId` int(11) NOT NULL,
  `day` varchar(45) DEFAULT NULL,
  `period` int(11) DEFAULT NULL,
  `schoolYear` varchar(45) DEFAULT NULL,
  `enrollableFor` mediumtext,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `status` varchar(45) DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `groupToCourse_idx` (`courseId`),
  CONSTRAINT `course_group_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_group`
--

LOCK TABLES `course_group` WRITE;
/*!40000 ALTER TABLE `course_group` DISABLE KEYS */;
INSERT INTO `course_group` VALUES (49,12,'woensdag',3,'2018/2019','t',NULL,'2018-12-27 15:53:28','active'),(50,12,'donderdag',3,'2018/2019','fsdf',NULL,'2018-12-27 15:46:03','active'),(51,14,'maandag',3,'2018/2019','HAVO 4, VWO 4',NULL,NULL,'active'),(52,14,'woensdag',4,'2018/2019','HAVO 4, VWO 4',NULL,NULL,'active'),(53,15,'maandag',4,'2018/2019','HAVO 4, VWO 4',NULL,NULL,'active'),(54,16,'donderdag',1,'2018/2019','HAVO 5, VWO 6',NULL,'2018-12-27 15:14:21','active'),(55,17,'donderdag',4,'2018/2019','HAVO 5, VWO 6',NULL,NULL,'active'),(56,18,'donderdag',3,'2018/2019','HAVO 5, VWO 6',NULL,NULL,'active'),(57,19,'maandag',1,'2018/2019','VWO 5',NULL,NULL,'active'),(58,20,'woensdag',2,'2018/2019','VWO 5',NULL,NULL,'active'),(59,21,'woensdag',3,'2018/2019','VWO 5',NULL,NULL,'active'),(60,22,'woensdag',4,'2018/2019','VWO 5',NULL,NULL,'active'),(61,23,'woensdag',1,'2018/2019','HAVO 4, VWO 4, VWO 5',NULL,NULL,'active'),(62,24,'woensdag',2,'2018/2019','HAVO 4, VWO 4, VWO 5 d',NULL,'2018-12-27 15:12:24','active'),(63,26,'woensdag',3,'2018/2019','HAVO 4, VWO 4, VWO 5',NULL,NULL,'active'),(64,27,'woensdag',4,'2018/2019','HAVO 4, VWO 4, VWO 5',NULL,NULL,'active'),(65,28,'woensdag',1,'2018/2019','HAVO 5',NULL,NULL,'active'),(66,29,'woensdag',2,'2018/2019','HAVO 5',NULL,NULL,'active'),(67,30,'woensdag',3,'2018/2019','HAVO 5',NULL,NULL,'active'),(68,31,'maandag',1,'2018/2019','VWO 6',NULL,NULL,'active'),(69,32,'maandag',2,'2018/2019','VWO 6',NULL,NULL,'active'),(70,33,'maandag',3,'2018/2019','VWO 6',NULL,NULL,'active'),(71,34,'donderdag',1,'2018/2019','HAVO 4, VWO 4, VWO 5',NULL,'2018-12-27 15:53:54','active'),(72,35,'woensdag',2,'2018/2019','HAVO 4, VWO 4, VWO 5',NULL,NULL,'active'),(73,23,'woensdag',3,'2018/2019','HAVO 4, VWO 4, VWO 5',NULL,NULL,'active'),(74,24,'woensdag',4,'2018/2019','HAVO 4, VWO 4, VWO 5',NULL,NULL,'active'),(75,36,'dinsdag',1,'2018/2019','HAVO 4, VWO 4, VWO 5',NULL,NULL,'active'),(76,37,'donderdag',2,'2018/2019','HAVO 4, VWO 4, VWO 5',NULL,NULL,'active');
/*!40000 ALTER TABLE `course_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollment`
--

DROP TABLE IF EXISTS `enrollment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `enrollment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `courseGroupId` int(11) NOT NULL,
  `accepted` varchar(45) DEFAULT 'true',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `choiceToUserId_idx` (`userId`),
  KEY `enrollmentToGroupId_idx` (`courseGroupId`),
  CONSTRAINT `enrollment.ibfk_1` FOREIGN KEY (`courseGroupId`) REFERENCES `course_group` (`id`),
  CONSTRAINT `enrollment.ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user_data` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollment`
--

LOCK TABLES `enrollment` WRITE;
/*!40000 ALTER TABLE `enrollment` DISABLE KEYS */;
INSERT INTO `enrollment` VALUES (2,13,49,'true',NULL,NULL);
/*!40000 ALTER TABLE `enrollment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evaluation`
--

DROP TABLE IF EXISTS `evaluation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `evaluation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `type` varchar(45) DEFAULT 'decimal',
  `assesment` varchar(45) DEFAULT NULL,
  `explanation` mediumtext,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `updatedByIp` varchar(45) DEFAULT NULL,
  `updatedByUserId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`,`userId`,`courseId`),
  KEY `evaluationToUser_idx` (`userId`),
  KEY `evaluationToCourse_idx` (`courseId`),
  KEY `evaluation_ibfk_3_idx` (`updatedByUserId`),
  CONSTRAINT `evaluation_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user_data` (`id`),
  CONSTRAINT `evaluation_ibfk_2` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`),
  CONSTRAINT `evaluation_ibfk_3` FOREIGN KEY (`updatedByUserId`) REFERENCES `user_data` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluation`
--

LOCK TABLES `evaluation` WRITE;
/*!40000 ALTER TABLE `evaluation` DISABLE KEYS */;
INSERT INTO `evaluation` VALUES (10,13,12,'decimal',NULL,NULL,NULL,NULL,NULL,NULL),(11,17,12,'decimal','6',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `evaluation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lesson`
--

DROP TABLE IF EXISTS `lesson`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lesson` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseGroupId` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `kind` varchar(45) DEFAULT NULL,
  `activities` mediumtext,
  `numberInBlock` int(11) DEFAULT NULL,
  `subject` mediumtext,
  `presence` varchar(45) DEFAULT 'required',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `lessonToGroupId_idx` (`courseGroupId`),
  CONSTRAINT `lesson_ibfk_1` FOREIGN KEY (`courseGroupId`) REFERENCES `course_group` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2022 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lesson`
--

LOCK TABLES `lesson` WRITE;
/*!40000 ALTER TABLE `lesson` DISABLE KEYS */;
INSERT INTO `lesson` VALUES (1806,49,'2019-01-16','Introductie van de module veel meer tekstddd','Kennismaken en voorkennis testend dtestt sdfsdf',1,'Wat is ee sf sdjflkajs f\nsdaf sdas lfjslaf\n saldfjlsaj fsda dd\nfsdaf','required',NULL,NULL),(1807,49,'2019-01-23','','',2,NULL,'required',NULL,NULL),(1808,49,'2019-01-30','','',3,NULL,'required',NULL,NULL),(1809,49,'2019-02-06','','',4,NULL,'required',NULL,NULL),(1810,49,'2019-02-13','','',5,NULL,'required',NULL,NULL),(1811,49,'2019-02-20','','',6,NULL,'required',NULL,NULL),(1812,49,'2019-03-06','','',7,NULL,'required',NULL,NULL),(1813,50,'2019-01-24','','',1,NULL,'required',NULL,NULL),(1814,50,'2019-01-31','','',2,NULL,'required',NULL,NULL),(1815,50,'2019-02-07','','',3,NULL,'required',NULL,NULL),(1816,50,'2019-02-14','','',4,NULL,'required',NULL,NULL),(1817,50,'2019-02-21','','',5,NULL,'required',NULL,NULL),(1818,50,'2019-02-28','','',6,NULL,'required',NULL,NULL),(1819,50,'2019-03-14','','',7,NULL,'required',NULL,NULL),(1820,50,'2019-03-21','','',8,NULL,'required',NULL,NULL),(1821,51,'2019-01-21','','',1,NULL,'required',NULL,NULL),(1822,51,'2019-01-28','','',2,NULL,'required',NULL,NULL),(1823,51,'2019-02-04','','',3,NULL,'required',NULL,NULL),(1824,51,'2019-02-11','','',4,NULL,'required',NULL,NULL),(1825,51,'2019-02-18','','',5,NULL,'required',NULL,NULL),(1826,51,'2019-02-25','','',6,NULL,'required',NULL,NULL),(1827,51,'2019-03-11','','',7,NULL,'required',NULL,NULL),(1828,51,'2019-03-18','','',8,NULL,'required',NULL,NULL),(1829,52,'2019-04-03','','',1,NULL,'required',NULL,NULL),(1830,52,'2019-04-10','','',2,NULL,'required',NULL,NULL),(1831,52,'2019-04-17','','',3,NULL,'required',NULL,NULL),(1832,52,'2019-05-08','','',4,NULL,'required',NULL,NULL),(1833,52,'2019-05-15','','',5,NULL,'required',NULL,NULL),(1834,52,'2019-05-22','','',6,NULL,'required',NULL,NULL),(1835,52,'2019-05-29','','',7,NULL,'required',NULL,NULL),(1836,52,'2019-06-05','','',8,NULL,'required',NULL,NULL),(1837,53,'2019-04-01','','',1,NULL,'required',NULL,NULL),(1838,53,'2019-04-08','','',2,NULL,'required',NULL,NULL),(1839,53,'2019-04-15','','',3,NULL,'required',NULL,NULL),(1840,53,'2019-05-06','','',4,NULL,'required',NULL,NULL),(1841,53,'2019-05-13','','',5,NULL,'required',NULL,NULL),(1842,53,'2019-05-20','','',6,NULL,'required',NULL,NULL),(1843,53,'2019-05-27','','',7,NULL,'required',NULL,NULL),(1844,53,'2019-06-03','','',8,NULL,'required',NULL,NULL),(1845,54,'2018-08-30','','',1,'test test123  dsfs','required',NULL,'2018-12-27 15:14:21'),(1846,54,'2018-09-06','','',2,NULL,'required',NULL,'2018-12-27 15:14:21'),(1847,54,'2018-09-13','','',3,NULL,'required',NULL,'2018-12-27 15:14:21'),(1848,54,'2018-09-20','','',4,NULL,'required',NULL,'2018-12-27 15:14:21'),(1849,54,'2018-09-27','','',5,NULL,'required',NULL,'2018-12-27 15:14:21'),(1850,54,'2018-10-04','','',6,NULL,'required',NULL,'2018-12-27 15:14:21'),(1851,54,'2018-10-11','','',7,NULL,'required',NULL,'2018-12-27 15:14:21'),(1852,55,'2019-04-04','','',1,NULL,'required',NULL,NULL),(1853,55,'2019-04-11','','',2,NULL,'required',NULL,NULL),(1854,55,'2019-04-18','','',3,NULL,'required',NULL,NULL),(1855,55,'2019-05-09','','',4,NULL,'required',NULL,NULL),(1856,55,'2019-05-16','','',5,NULL,'required',NULL,NULL),(1857,55,'2019-05-23','','',6,NULL,'required',NULL,NULL),(1858,55,'2019-05-30','','',7,NULL,'required',NULL,NULL),(1859,55,'2019-06-06','','',8,NULL,'required',NULL,NULL),(1860,56,'2019-01-24','','',1,NULL,'required',NULL,NULL),(1861,56,'2019-01-31','','',2,NULL,'required',NULL,NULL),(1862,56,'2019-02-07','','',3,NULL,'required',NULL,NULL),(1863,56,'2019-02-14','','',4,NULL,'required',NULL,NULL),(1864,56,'2019-02-21','','',5,NULL,'required',NULL,NULL),(1865,56,'2019-02-28','','',6,NULL,'required',NULL,NULL),(1866,56,'2019-03-14','','',7,NULL,'required',NULL,NULL),(1867,56,'2019-03-21','','',8,NULL,'required',NULL,NULL),(1868,57,'2018-08-27','','',1,NULL,'required',NULL,NULL),(1869,57,'2018-09-03','','',2,NULL,'required',NULL,NULL),(1870,57,'2018-09-10','','',3,NULL,'required',NULL,NULL),(1871,57,'2018-09-17','','',4,NULL,'required',NULL,NULL),(1872,57,'2018-09-24','','',5,NULL,'required',NULL,NULL),(1873,57,'2018-10-01','','',6,NULL,'required',NULL,NULL),(1874,57,'2018-10-08','','',7,NULL,'required',NULL,NULL),(1875,58,'2018-11-07','','',1,NULL,'required',NULL,NULL),(1876,58,'2018-11-14','','',2,NULL,'required',NULL,NULL),(1877,58,'2018-11-21','','',3,NULL,'required',NULL,NULL),(1878,58,'2018-11-28','','',4,NULL,'required',NULL,NULL),(1879,58,'2018-12-05','','',5,NULL,'required',NULL,NULL),(1880,58,'2018-12-12','','',6,NULL,'required',NULL,NULL),(1881,58,'2018-12-19','','',7,NULL,'required',NULL,NULL),(1882,58,'2019-01-09','','',8,NULL,'required',NULL,NULL),(1883,59,'2019-01-23','','',1,NULL,'required',NULL,NULL),(1884,59,'2019-01-30','','',2,NULL,'required',NULL,NULL),(1885,59,'2019-02-06','','',3,NULL,'required',NULL,NULL),(1886,59,'2019-02-13','','',4,NULL,'required',NULL,NULL),(1887,59,'2019-02-20','','',5,NULL,'required',NULL,NULL),(1888,59,'2019-02-27','','',6,NULL,'required',NULL,NULL),(1889,59,'2019-03-13','','',7,NULL,'required',NULL,NULL),(1890,59,'2019-03-20','','',8,NULL,'required',NULL,NULL),(1891,60,'2019-04-03','','',1,NULL,'required',NULL,NULL),(1892,60,'2019-04-10','','',2,NULL,'required',NULL,NULL),(1893,60,'2019-04-17','','',3,NULL,'required',NULL,NULL),(1894,60,'2019-05-08','','',4,NULL,'required',NULL,NULL),(1895,60,'2019-05-15','','',5,NULL,'required',NULL,NULL),(1896,60,'2019-05-22','','',6,NULL,'required',NULL,NULL),(1897,60,'2019-05-29','','',7,NULL,'required',NULL,NULL),(1898,60,'2019-06-05','','',8,NULL,'required',NULL,NULL),(1899,61,'2018-08-29','','',1,NULL,'required',NULL,NULL),(1900,61,'2018-09-05','','',2,NULL,'required',NULL,NULL),(1901,61,'2018-09-12','','',3,NULL,'required',NULL,NULL),(1902,61,'2018-09-19','','',4,NULL,'required',NULL,NULL),(1903,61,'2018-09-26','','',5,NULL,'required',NULL,NULL),(1904,61,'2018-10-03','','',6,NULL,'required',NULL,NULL),(1905,61,'2018-10-10','','',7,NULL,'required',NULL,NULL),(1906,62,'2018-11-07','','',1,NULL,'required',NULL,'2018-12-27 15:12:24'),(1907,62,'2018-11-14','','',2,NULL,'required',NULL,'2018-12-27 15:12:24'),(1908,62,'2018-11-21','','',3,NULL,'required',NULL,'2018-12-27 15:12:24'),(1909,62,'2018-11-28','','',4,NULL,'required',NULL,'2018-12-27 15:12:24'),(1910,62,'2018-12-05','','',5,NULL,'required',NULL,'2018-12-27 15:12:24'),(1911,62,'2018-12-12','','',6,NULL,'required',NULL,'2018-12-27 15:12:24'),(1912,62,'2018-12-19','','',7,NULL,'required',NULL,'2018-12-27 15:12:24'),(1913,62,'2019-01-02','','',8,NULL,'required',NULL,'2018-12-27 15:12:24'),(1914,63,'2019-01-23','','',1,NULL,'required',NULL,NULL),(1915,63,'2019-01-30','','',2,NULL,'required',NULL,NULL),(1916,63,'2019-02-06','','',3,NULL,'required',NULL,NULL),(1917,63,'2019-02-13','','',4,NULL,'required',NULL,NULL),(1918,63,'2019-02-20','','',5,NULL,'required',NULL,NULL),(1919,63,'2019-02-27','','',6,NULL,'required',NULL,NULL),(1920,63,'2019-03-13','','',7,NULL,'required',NULL,NULL),(1921,63,'2019-03-20','','',8,NULL,'required',NULL,NULL),(1922,64,'2019-04-03','','',1,NULL,'required',NULL,NULL),(1923,64,'2019-04-10','','',2,NULL,'required',NULL,NULL),(1924,64,'2019-04-17','','',3,NULL,'required',NULL,NULL),(1925,64,'2019-05-08','','',4,NULL,'required',NULL,NULL),(1926,64,'2019-05-15','','',5,NULL,'required',NULL,NULL),(1927,64,'2019-05-22','','',6,NULL,'required',NULL,NULL),(1928,64,'2019-05-29','','',7,NULL,'required',NULL,NULL),(1929,64,'2019-06-05','','',8,NULL,'required',NULL,NULL),(1930,65,'2018-08-29','','',1,NULL,'required',NULL,NULL),(1931,65,'2018-09-05','','',2,NULL,'required',NULL,NULL),(1932,65,'2018-09-12','','',3,NULL,'required',NULL,NULL),(1933,65,'2018-09-19','','',4,NULL,'required',NULL,NULL),(1934,65,'2018-09-26','','',5,NULL,'required',NULL,NULL),(1935,65,'2018-10-03','','',6,NULL,'required',NULL,NULL),(1936,65,'2018-10-10','','',7,NULL,'required',NULL,NULL),(1937,66,'2018-11-07','','',1,NULL,'required',NULL,NULL),(1938,66,'2018-11-14','','',2,NULL,'required',NULL,NULL),(1939,66,'2018-11-21','','',3,NULL,'required',NULL,NULL),(1940,66,'2018-11-28','','',4,NULL,'required',NULL,NULL),(1941,66,'2018-12-05','','',5,NULL,'required',NULL,NULL),(1942,66,'2018-12-12','','',6,NULL,'required',NULL,NULL),(1943,66,'2018-12-19','','',7,NULL,'required',NULL,NULL),(1944,66,'2019-01-09','','',8,NULL,'required',NULL,NULL),(1945,67,'2019-01-23','','',1,NULL,'required',NULL,NULL),(1946,67,'2019-01-30','','',2,NULL,'required',NULL,NULL),(1947,67,'2019-02-06','','',3,NULL,'required',NULL,NULL),(1948,67,'2019-02-13','','',4,NULL,'required',NULL,NULL),(1949,67,'2019-02-20','','',5,NULL,'required',NULL,NULL),(1950,67,'2019-02-27','','',6,NULL,'required',NULL,NULL),(1951,67,'2019-03-13','','',7,NULL,'required',NULL,NULL),(1952,67,'2019-03-20','','',8,NULL,'required',NULL,NULL),(1953,68,'2018-08-27','','',1,NULL,'required',NULL,NULL),(1954,68,'2018-09-03','','',2,NULL,'required',NULL,NULL),(1955,68,'2018-09-10','','',3,NULL,'required',NULL,NULL),(1956,68,'2018-09-17','','',4,NULL,'required',NULL,NULL),(1957,68,'2018-09-24','','',5,NULL,'required',NULL,NULL),(1958,68,'2018-10-01','','',6,NULL,'required',NULL,NULL),(1959,68,'2018-10-08','','',7,NULL,'required',NULL,NULL),(1960,69,'2018-11-05','','',1,NULL,'required',NULL,NULL),(1961,69,'2018-11-12','','',2,NULL,'required',NULL,NULL),(1962,69,'2018-11-19','','',3,NULL,'required',NULL,NULL),(1963,69,'2018-11-26','','',4,NULL,'required',NULL,NULL),(1964,69,'2018-12-03','','',5,NULL,'required',NULL,NULL),(1965,69,'2018-12-10','','',6,NULL,'required',NULL,NULL),(1966,69,'2018-12-17','','',7,NULL,'required',NULL,NULL),(1967,69,'2019-01-07','','',8,NULL,'required',NULL,NULL),(1968,70,'2019-01-21','','',1,NULL,'required',NULL,NULL),(1969,70,'2019-01-28','','',2,NULL,'required',NULL,NULL),(1970,70,'2019-02-04','','',3,NULL,'required',NULL,NULL),(1971,70,'2019-02-11','','',4,NULL,'required',NULL,NULL),(1972,70,'2019-02-18','','',5,NULL,'required',NULL,NULL),(1973,70,'2019-02-25','','',6,NULL,'required',NULL,NULL),(1974,70,'2019-03-11','','',7,NULL,'required',NULL,NULL),(1975,70,'2019-03-18','','',8,NULL,'required',NULL,NULL),(1976,71,'2018-08-30','','',1,NULL,'required',NULL,'2018-12-27 15:53:54'),(1977,71,'2018-09-06','','',2,NULL,'required',NULL,'2018-12-27 15:53:54'),(1978,71,'2018-09-13','','',3,NULL,'required',NULL,'2018-12-27 15:53:54'),(1979,71,'2018-09-20','','',4,NULL,'required',NULL,'2018-12-27 15:53:54'),(1980,71,'2018-09-27','','',5,NULL,'required',NULL,'2018-12-27 15:53:54'),(1981,71,'2018-10-04','','',6,NULL,'required',NULL,'2018-12-27 15:53:54'),(1982,71,'2018-10-11','','',7,NULL,'required',NULL,'2018-12-27 15:53:54'),(1983,72,'2018-11-07','','',1,NULL,'required',NULL,NULL),(1984,72,'2018-11-14','','',2,NULL,'required',NULL,NULL),(1985,72,'2018-11-21','','',3,NULL,'required',NULL,NULL),(1986,72,'2018-11-28','','',4,NULL,'required',NULL,NULL),(1987,72,'2018-12-05','','',5,NULL,'required',NULL,NULL),(1988,72,'2018-12-12','','',6,NULL,'required',NULL,NULL),(1989,72,'2018-12-19','','',7,NULL,'required',NULL,NULL),(1990,72,'2019-01-09','','',8,NULL,'required',NULL,NULL),(1991,73,'2019-01-23','','',1,NULL,'required',NULL,NULL),(1992,73,'2019-01-30','','',2,NULL,'required',NULL,NULL),(1993,73,'2019-02-06','','',3,NULL,'required',NULL,NULL),(1994,73,'2019-02-13','','',4,NULL,'required',NULL,NULL),(1995,73,'2019-02-20','','',5,NULL,'required',NULL,NULL),(1996,73,'2019-02-27','','',6,NULL,'required',NULL,NULL),(1997,73,'2019-03-13','','',7,NULL,'required',NULL,NULL),(1998,73,'2019-03-20','','',8,NULL,'required',NULL,NULL),(1999,74,'2019-04-03','','',1,NULL,'required',NULL,NULL),(2000,74,'2019-04-10','','',2,NULL,'required',NULL,NULL),(2001,74,'2019-04-17','','',3,NULL,'required',NULL,NULL),(2002,74,'2019-05-08','','',4,NULL,'required',NULL,NULL),(2003,74,'2019-05-15','','',5,NULL,'required',NULL,NULL),(2004,74,'2019-05-22','','',6,NULL,'required',NULL,NULL),(2005,74,'2019-05-29','','',7,NULL,'required',NULL,NULL),(2006,74,'2019-06-05','','',8,NULL,'required',NULL,NULL),(2007,75,'2018-08-28','','',1,NULL,'required',NULL,NULL),(2008,75,'2018-09-04','','',2,NULL,'required',NULL,NULL),(2009,75,'2018-09-11','','',3,NULL,'required',NULL,NULL),(2010,75,'2018-09-18','','',4,NULL,'required',NULL,NULL),(2011,75,'2018-09-25','','',5,NULL,'required',NULL,NULL),(2012,75,'2018-10-02','','',6,NULL,'required',NULL,NULL),(2013,75,'2018-10-09','','',7,NULL,'required',NULL,NULL),(2014,76,'2018-11-08','','',1,NULL,'required',NULL,NULL),(2015,76,'2018-11-15','','',2,NULL,'required',NULL,NULL),(2016,76,'2018-11-22','','',3,NULL,'required',NULL,NULL),(2017,76,'2018-11-29','','',4,NULL,'required',NULL,NULL),(2018,76,'2018-12-06','','',5,NULL,'required',NULL,NULL),(2019,76,'2018-12-13','','',6,NULL,'required',NULL,NULL),(2020,76,'2018-12-20','','',7,NULL,'required',NULL,NULL),(2021,76,'2019-01-10','','',8,NULL,'required',NULL,NULL);
/*!40000 ALTER TABLE `lesson` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loggedin`
--

DROP TABLE IF EXISTS `loggedin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `loggedin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `token` varchar(64) NOT NULL,
  `active` bit(1) DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`token`),
  KEY `userId` (`userId`),
  CONSTRAINT `userId` FOREIGN KEY (`userId`) REFERENCES `user_data` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loggedin`
--

LOCK TABLES `loggedin` WRITE;
/*!40000 ALTER TABLE `loggedin` DISABLE KEYS */;
INSERT INTO `loggedin` VALUES (43,13,'c1b34166-5702-4c07-b64a-3ae4c9934047','\0','213.127.243.178','2018-08-17 11:52:03',NULL),(44,13,'ddd3b539-fc98-4a79-aa89-81ed19553b83','\0','194.171.170.16','2018-08-28 10:50:14',NULL),(45,13,'2e2419ef-6ae5-4d29-a2d3-8f50e499cc84','\0','213.127.243.178','2018-08-31 13:33:12',NULL),(46,13,'db9c835a-f064-4e1e-af27-4cb675e3dd07','\0','213.127.243.178','2018-09-08 10:20:23',NULL),(47,13,'376894c7-99cc-42ea-a180-80abf2c0cdc8','\0','213.127.243.178','2018-09-09 19:45:14',NULL),(48,13,'3da28fc8-60c3-496c-b7ae-6735ddaf5fb0','','213.127.243.178','2018-09-29 15:34:19',NULL),(49,16,'28c68f16-9daf-4850-9d8a-faf69722d73b','\0','213.127.243.178','2018-10-07 21:13:00',NULL),(50,17,'bee90d22-9e6d-4e91-912f-f551e6c1530c','\0','213.127.243.178','2018-10-21 21:13:36','2018-12-28 09:14:44'),(51,16,'ce8e6a12-037f-482c-a8e9-d69b12b60d1c','\0','213.127.243.178','2018-10-21 21:15:03',NULL),(52,17,'3f96ef13-bba0-49bd-aaa9-3ab8e1bdd84f','\0','213.127.243.178','2018-10-21 21:36:45','2018-12-28 09:14:44'),(53,16,'3b5de797-b5de-4fd6-9d4a-b55eac1174e6','\0','213.127.243.178','2018-10-21 21:45:20',NULL),(54,17,'96ec552a-02c5-4745-a040-3fdf2e6841e3','\0','213.127.243.178','2018-10-21 21:49:15','2018-12-28 09:14:44'),(55,17,'4ca0481a-338e-4938-9cbb-fcc32b48a44c','\0','213.127.243.178','2018-10-25 20:04:04','2018-12-28 09:14:44'),(56,17,'459257d9-2ea5-4d4d-8d91-c0320d876729','\0','213.127.243.178','2018-10-25 20:17:20','2018-12-28 09:14:44'),(57,17,'9944bf33-76da-4971-8ada-7380e87c3e8d','\0','213.127.243.178','2018-10-25 20:22:46','2018-12-28 09:14:44'),(58,17,'7d819bbe-2142-41ac-aade-575e4458ac34','\0','213.127.243.178','2018-10-25 20:33:02','2018-12-28 09:14:44'),(59,17,'921a758b-270b-49c2-b6a2-36c9da36b0c9','\0','213.127.243.178','2018-11-03 11:36:21','2018-12-28 09:14:44'),(60,17,'b459b337-1d18-4023-bdbe-4c6efbaa0a2c','\0','213.127.243.178','2018-11-03 11:46:32','2018-12-28 09:14:44'),(61,16,'9dac4dc0-c98e-4a29-bc86-b3212c0ec7d0','\0','213.127.243.178','2018-11-03 12:52:20',NULL),(62,17,'bc62df2e-6448-4842-b00a-1dc89662591e','\0','213.127.243.178','2018-11-03 12:54:13','2018-12-28 09:14:44'),(63,17,'e97ba84a-adc0-49ca-baff-a680af906623','\0','213.127.243.178','2018-11-10 17:00:00','2018-12-28 09:14:44'),(64,17,'cfa4eca7-06b8-4771-8299-bdd140d04d06','\0','213.127.243.178','2018-11-17 17:07:16','2018-12-28 09:14:44'),(65,17,'e24f9a79-76f0-4566-91e3-ab90a96eea17','\0','213.127.243.178','2018-11-17 17:42:37','2018-12-28 09:14:44'),(66,16,'b5cf6bb1-4a5e-4480-9381-e9d905b1af28','\0','213.127.243.178','2018-11-17 19:55:18',NULL),(67,17,'c0df13ed-ed84-4a9e-ae7c-ff187b3acec1','\0','213.127.243.178','2018-11-18 09:38:48','2018-12-28 09:14:44'),(68,17,'efb089a9-ffb8-4537-bc13-4511a1005316','\0','213.127.243.178','2018-11-18 10:49:33','2018-12-28 09:14:44'),(69,16,'271687d5-a659-4840-ad20-9d8cf28ad03f','\0','213.127.243.178','2018-11-18 11:12:57',NULL),(70,17,'c6aea87f-868f-4c20-9fd4-40e6aee64a01','\0','213.127.243.178','2018-11-18 11:21:19','2018-12-28 09:14:44'),(71,16,'ced7077c-93c5-4e82-8bce-51bd1e4a192d','\0','213.127.243.178','2018-11-18 11:22:01',NULL),(72,17,'93f31d80-23f6-4e2b-bb5f-3c9b23893a7b','\0','213.127.243.178','2018-11-18 11:26:29','2018-12-28 09:14:44'),(73,16,'e03fc855-2307-48d3-bf99-aa3b30a1585b','\0','213.127.243.178','2018-11-18 11:32:53',NULL),(74,17,'828c71f0-fe9a-43fa-a225-3a7cc001620a','\0','213.127.243.178','2018-11-22 20:31:43','2018-12-28 09:14:44'),(75,17,'9f6977e2-7d58-45ec-8a0f-345ba2a8f3f3','\0','213.127.243.178','2018-11-22 20:32:40','2018-12-28 09:14:44'),(76,16,'3ae183ce-ecf1-45f8-b31b-b8dfc20c8dff','\0','213.127.243.178','2018-11-30 20:47:17',NULL),(77,17,'3f2fe9f9-6049-40c3-afac-ede61e57e3ab','\0','213.127.243.178','2018-11-30 21:33:41','2018-12-28 09:14:44'),(78,16,'fd474074-73e6-4819-a1c8-6a2b1b23af02','\0','213.127.243.178','2018-12-02 14:57:59',NULL),(79,17,'1357db9f-0351-4272-a20a-4f88d613439c','\0','213.127.243.178','2018-12-04 20:10:11','2018-12-28 09:14:44'),(80,17,'414f063c-ede4-4cab-8018-7d82457d22e6','\0','213.127.243.178','2018-12-05 15:22:55','2018-12-28 09:14:44'),(81,16,'1d6d83ed-97b0-46eb-929e-02ecfa7d9495','\0','213.127.243.178','2018-12-05 17:00:13',NULL),(82,17,'51ee2386-318e-405c-a668-f2770c738b4c','\0','213.127.243.178','2018-12-05 17:13:33','2018-12-28 09:14:44'),(83,16,'4504ba9c-a5fb-4de4-b8f1-97993b21ceb5','','213.127.243.178','2018-12-09 10:13:13',NULL),(84,17,'ca5a28e1-0c86-40c6-bf8b-cdbf6a3d844e','\0','213.127.243.178','2018-12-09 10:18:57','2018-12-28 09:14:44'),(89,18,'22c1527a-24db-4020-b255-0ea857c96a40','','213.127.243.178','2018-12-27 15:43:19','2018-12-27 15:43:19'),(90,17,'f21ed175-bd53-43eb-8c37-edc2b7ac3fe1','\0','213.127.243.178','2018-12-27 15:45:18','2018-12-28 09:14:44'),(91,17,'2cf33a3f-860e-4ac7-b745-b9bdbb7693f0','','213.127.243.178','2018-12-28 09:14:44','2018-12-28 09:14:44');
/*!40000 ALTER TABLE `loggedin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `priority` text,
  `scope` text,
  `message` text,
  `type` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user_data` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `priority` varchar(45) NOT NULL,
  `scope` varchar(128) NOT NULL,
  `message` mediumtext,
  `type` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`,`userId`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `participant`
--

DROP TABLE IF EXISTS `participant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `participant` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `courseGroupId` int(11) NOT NULL,
  `participatingRole` varchar(45) DEFAULT 'student',
  `status` varchar(45) NOT NULL DEFAULT 'active',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `attendeeToGroupId_idx` (`courseGroupId`),
  KEY `attendeeToUserId_idx` (`userId`),
  CONSTRAINT `attendeeToGroupId` FOREIGN KEY (`courseGroupId`) REFERENCES `course_group` (`id`),
  CONSTRAINT `attendeeToUserId` FOREIGN KEY (`userId`) REFERENCES `user_data` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participant`
--

LOCK TABLES `participant` WRITE;
/*!40000 ALTER TABLE `participant` DISABLE KEYS */;
INSERT INTO `participant` VALUES (2,14,49,'teacher','active',NULL,NULL),(3,16,49,'teacher','active',NULL,NULL),(12,13,49,'teacher','active',NULL,NULL),(13,17,49,'teacher','active',NULL,NULL);
/*!40000 ALTER TABLE `participant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `presence`
--

DROP TABLE IF EXISTS `presence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `presence` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lessonId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `status` varchar(45) DEFAULT 'present',
  `explanation` mediumtext,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `lesson_idx` (`lessonId`),
  KEY `student_idx` (`userId`),
  CONSTRAINT `presence_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user_data` (`id`),
  CONSTRAINT `presence_ibfk_2` FOREIGN KEY (`lessonId`) REFERENCES `lesson` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `presence`
--

LOCK TABLES `presence` WRITE;
/*!40000 ALTER TABLE `presence` DISABLE KEYS */;
INSERT INTO `presence` VALUES (65,1806,13,'present',NULL,NULL,'2018-12-09 09:19:23'),(66,1807,13,'present',NULL,NULL,NULL),(67,1808,13,'present',NULL,NULL,NULL),(68,1809,13,'present',NULL,NULL,NULL),(69,1810,13,'present',NULL,NULL,NULL),(70,1811,13,'present',NULL,NULL,NULL),(71,1812,13,'present',NULL,NULL,NULL);
/*!40000 ALTER TABLE `presence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `school_subject`
--

DROP TABLE IF EXISTS `school_subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `school_subject` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `description` mediumtext,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `school_subject`
--

LOCK TABLES `school_subject` WRITE;
/*!40000 ALTER TABLE `school_subject` DISABLE KEYS */;
INSERT INTO `school_subject` VALUES (8,'Informatica',NULL,NULL,NULL),(9,'Filosofie',NULL,NULL,NULL),(10,'Wiskunde D',NULL,NULL,NULL);
/*!40000 ALTER TABLE `school_subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_data`
--

DROP TABLE IF EXISTS `user_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(64) NOT NULL,
  `role` varchar(16) NOT NULL,
  `school` varchar(45) DEFAULT NULL,
  `firstName` varchar(64) DEFAULT NULL,
  `lastName` varchar(64) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `level` varchar(45) DEFAULT NULL,
  `preferedEmail` varchar(64) DEFAULT NULL,
  `profile` varchar(45) DEFAULT NULL,
  `phoneNumber` varchar(45) DEFAULT NULL,
  `displayName` varchar(64) DEFAULT NULL,
  `createIp` varchar(45) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_data`
--

LOCK TABLES `user_data` WRITE;
/*!40000 ALTER TABLE `user_data` DISABLE KEYS */;
INSERT INTO `user_data` VALUES (11,'CCM111395@candea.nl','teacher','Beekdal','aa','a',NULL,NULL,NULL,NULL,NULL,'aaaa',NULL,NULL,NULL),(12,'filosofiedocent!!!','teacher','Beekdal','bb','b',NULL,NULL,NULL,NULL,NULL,'bbbb',NULL,NULL,NULL),(13,'BD024027@ll.beekdallyceum.nl','teacher','Beekdal','cc','b',4,'HAVO','dsdfsd@gmail.com','EM','0636403434','cccc','213.127.243.178','2018-08-17 11:52:03',NULL),(14,'FILOSOFIEDOCENT 2','teacher','Beekdal','dd','b',NULL,NULL,NULL,NULL,NULL,'dddd',NULL,NULL,NULL),(15,'WISKUNDE D DOCENT','teacher','Gymnasium Arnhem','ee','b',NULL,NULL,NULL,NULL,NULL,'eee',NULL,NULL,NULL),(16,'CC114792@ll.candea.nl','student','Candea College','Marloes','Bronsveld',6,'VWO','sdsd@gmail.comd','NG','0316265566','Bronsveld, Marloes','213.127.243.178','2018-10-07 21:13:00','2018-12-05 16:10:45'),(17,'CBM017392@quadraam.nl','admin','Centraal Bureau','Steven','Bronsveld',5,'HAVO','test@gmail.com','NT','0123123456','Bronsveld, Steven','213.127.243.178','2018-10-21 21:13:36','2018-12-27 15:14:08'),(18,'CBM0172@quadraam.nl','teacher','d','d','Bronsveld',NULL,NULL,'CBM017392@quadraam.nl',NULL,NULL,'Bronsveld, Steven','213.127.243.178','2018-12-27 15:43:19','2018-12-27 15:43:19');
/*!40000 ALTER TABLE `user_data` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-12-28 10:23:03
