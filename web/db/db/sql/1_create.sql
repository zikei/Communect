--
-- データベース: `communect`
--
CREATE DATABASE IF NOT EXISTS `communect` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `communect`;

-- --------------------------------------------------------

--
-- テーブルの構造 `user`
--

CREATE TABLE `user` (
  `userId` char(36) NOT NULL,
  `userName` varchar(50) NOT NULL UNIQUE,
  `nickname` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(50) NOT NULL,
  `apikey` varchar(64) NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- テーブルの構造 `talk`
--

CREATE TABLE `talk` (
  `talkId` char(36) NOT NULL,
  `talkTitle` varchar(50) NOT NULL,
  `talkType` enum('GROUP','INDIVIDUAL') NOT NULL,
  PRIMARY KEY (`talkId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- テーブルの構造 `notice_group`
--

CREATE TABLE `notice_group` (
  `noticeGroupId` char(36) NOT NULL,
  `aboveId` char(36),
  `groupTitle` varchar(50) NOT NULL,
  PRIMARY KEY (`noticeGroupId`),
  FOREIGN KEY (`aboveId`) REFERENCES `notice_group` (`noticeGroupId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- テーブルの構造 `user_group`
--

CREATE TABLE `user_group` (
  `userGroupId` char(36) NOT NULL,
  `noticeGroupId` char(36) NOT NULL,
  `userId` char(36) NOT NULL,
  `nickname` varchar(50) DEFAULT NULL,
  `role` enum('HIGH','MEDIUM','LOW','SAFE','NONE') NOT NULL,
  `subGroupCreateAuthority` boolean NOT NULL,
  `groupAdmin` boolean NOT NULL,
  PRIMARY KEY (`userGroupId`),
  FOREIGN KEY (`noticeGroupId`) REFERENCES `notice_group` (`noticeGroupId`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- テーブルの構造 `group_talk`
--

CREATE TABLE `group_talk` (
  `talkId` char(36) NOT NULL,
  `noticeGroupId` char(36) NOT NULL,
  PRIMARY KEY (`talkId`),
  FOREIGN KEY (`talkId`) REFERENCES `talk` (`talkId`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`noticeGroupId`) REFERENCES `notice_group` (`noticeGroupId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- テーブルの構造 `individual_talk`
--

CREATE TABLE `individual_talk` (
  `individualTalkId` char(36) NOT NULL,
  `talkId` char(36) NOT NULL,
  `userId` char(36) NOT NULL,
  PRIMARY KEY (`individualTalkId`),
  FOREIGN KEY (`talkId`) REFERENCES `talk` (`talkId`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- テーブルの構造 `message`
--

CREATE TABLE `message` (
  `messageId` char(36) NOT NULL,
  `talkId` char(36) NOT NULL,
  `userId` char(36) NOT NULL,
  `message` varchar(500) NOT NULL,
  `createTime` datetime NOT NULL,
  PRIMARY KEY (`messageId`),
  FOREIGN KEY (`talkId`) REFERENCES `talk` (`talkId`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- テーブルの構造 `contact`
--

CREATE TABLE `contact` (
  `contactId` char(36) NOT NULL,
  `noticeGroupId` char(36) NOT NULL,
  `userId` char(36) NOT NULL,
  `message` varchar(500) NOT NULL,
  `contactType` enum('CHOICE','CONFIRM','INFORM') NOT NULL,
  `importance` enum('HIGH','MEDIUM','LOW','SAFE') NOT NULL,
  `createTime` datetime NOT NULL,
  PRIMARY KEY (`contactId`),
  FOREIGN KEY (`noticeGroupId`) REFERENCES `notice_group` (`noticeGroupId`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- テーブルの構造 `reaction`
--

CREATE TABLE `reaction` (
  `reactionId` char(36) NOT NULL,
  `contactId` char(36) NOT NULL,
  `userId` char(36) NOT NULL,
  `reactionTime` datetime NOT NULL,
  PRIMARY KEY (`reactionId`),
  FOREIGN KEY (`contactId`) REFERENCES `contact` (`contactId`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- テーブルの構造 `choicecontact`
--

CREATE TABLE `choicecontact` (
  `choiceContactId` char(36) NOT NULL,
  `contactId` char(36) NOT NULL,
  `choices` varchar(100) NOT NULL,
  PRIMARY KEY (`choiceContactId`),
  FOREIGN KEY (`contactId`) REFERENCES `contact` (`contactId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- テーブルの構造 `choicereaction`
--

CREATE TABLE `choicereaction` (
  `reactionId` char(36) NOT NULL,
  `choiceContactId` char(36) NOT NULL,
  PRIMARY KEY (`reactionId`),
  FOREIGN KEY (`reactionId`) REFERENCES `reaction` (`reactionId`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`choiceContactId`) REFERENCES `choicecontact` (`choiceContactId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
