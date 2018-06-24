CREATE DATABASE `qhighschool` /*!40100 DEFAULT CHARACTER SET utf8 */;

CREATE TABLE `assessment` (
  `studentId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `assesment` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`studentId`,`courseId`),
  KEY `courseId_idx` (`courseId`),
  CONSTRAINT `courseId` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `studentId` FOREIGN KEY (`studentId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `attendee` (
  `studentId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`studentId`,`courseId`),
  KEY `course_idx` (`courseId`),
  CONSTRAINT `crs` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `student` FOREIGN KEY (`studentId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `choice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `studentId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `firstchoice_idx` (`courseId`),
  KEY `choiceToUserId_idx` (`studentId`),
  CONSTRAINT `choiceToCourseId` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `choiceToUserId` FOREIGN KEY (`studentId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8;

CREATE TABLE `course` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subjectId` int(11) DEFAULT NULL,
  `name` varchar(64) NOT NULL,
  `description` mediumtext,
  `teacherId` int(11) DEFAULT NULL,
  `period` int(11) DEFAULT NULL,
  `schoolYear` varchar(45) DEFAULT NULL,
  `day` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `subject_idx` (`subjectId`),
  KEY `teacher_idx` (`teacherId`),
  CONSTRAINT `subject` FOREIGN KEY (`subjectId`) REFERENCES `subject` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `teacher` FOREIGN KEY (`teacherId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

CREATE TABLE `lesson` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseId` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `day` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `course_idx` (`courseId`),
  CONSTRAINT `course` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `loggedin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(64) NOT NULL,
  PRIMARY KEY (`id`,`token`),
  UNIQUE KEY `email_UNIQUE` (`token`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  CONSTRAINT `userId` FOREIGN KEY (`id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

CREATE TABLE `subject` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `description` mediumtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

CREATE TABLE `presence` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lessonId` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `lesson_idx` (`lessonId`),
  KEY `student_idx` (`studentId`),
  CONSTRAINT `lessonId` FOREIGN KEY (`lessonId`) REFERENCES `lesson` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `stdnt` FOREIGN KEY (`studentId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `user` (
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
