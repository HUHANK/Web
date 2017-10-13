/*
Navicat MySQL Data Transfer

Source Server         : 36mysql
Source Server Version : 50719
Source Host           : 10.10.14.36:3306
Source Database       : weekreportsys

Target Server Type    : MYSQL
Target Server Version : 50719
File Encoding         : 65001

Date: 2017-10-13 17:10:56
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for department
-- ----------------------------
DROP TABLE IF EXISTS `department`;
CREATE TABLE `department` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL DEFAULT '',
  `manager` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for dict
-- ----------------------------
DROP TABLE IF EXISTS `dict`;
CREATE TABLE `dict` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `title` int(11) NOT NULL DEFAULT '0',
  `parent` int(11) NOT NULL DEFAULT '0',
  `isRoot` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for dictionary
-- ----------------------------
DROP TABLE IF EXISTS `dictionary`;
CREATE TABLE `dictionary` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `DIC_TYPE` int(11) NOT NULL COMMENT '0:表字段说明；1:表字段包含的值',
  `TABLE_NAME` varchar(64) NOT NULL DEFAULT '',
  `COL_NAME` varchar(64) NOT NULL DEFAULT '',
  `NOTE` varchar(1024) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for session
-- ----------------------------
DROP TABLE IF EXISTS `session`;
CREATE TABLE `session` (
  `id` char(36) NOT NULL,
  `uname` varchar(16) DEFAULT NULL,
  `login_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `UID` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `UNAME` varchar(12) NOT NULL,
  `UPWD` varchar(32) NOT NULL DEFAULT '123456',
  `LAST_LOGIN_TIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `NOTE` varchar(128) NOT NULL,
  PRIMARY KEY (`UID`),
  UNIQUE KEY `index` (`UNAME`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user_work
-- ----------------------------
DROP TABLE IF EXISTS `user_work`;
CREATE TABLE `user_work` (
  `UID` int(11) unsigned NOT NULL,
  `WID` int(11) NOT NULL,
  `YEAR` int(11) NOT NULL,
  `WEEK` int(11) NOT NULL,
  PRIMARY KEY (`WID`,`UID`,`YEAR`,`WEEK`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for work_detail
-- ----------------------------
DROP TABLE IF EXISTS `work_detail`;
CREATE TABLE `work_detail` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `System` varchar(36) NOT NULL,
  `Module` varchar(36) NOT NULL,
  `Type` varchar(12) NOT NULL DEFAULT '' COMMENT '类型',
  `TraceNo` varchar(32) NOT NULL DEFAULT '' COMMENT '跟踪号',
  `Detail` varchar(512) NOT NULL DEFAULT '' COMMENT '工作内容',
  `Property` varchar(12) NOT NULL DEFAULT '' COMMENT '性质',
  `ProgressRate` int(11) NOT NULL DEFAULT '0',
  `StartDate` char(10) NOT NULL DEFAULT '',
  `NeedDays` double NOT NULL DEFAULT '0',
  `AddDate` char(8) NOT NULL,
  `EditDate` char(8) NOT NULL,
  `ExpireDate` char(8) NOT NULL DEFAULT '',
  `Note` varchar(512) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=535 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for xgroup
-- ----------------------------
DROP TABLE IF EXISTS `xgroup`;
CREATE TABLE `xgroup` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL DEFAULT '',
  `manager` int(10) unsigned NOT NULL,
  `depart_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for xholiday
-- ----------------------------
DROP TABLE IF EXISTS `xholiday`;
CREATE TABLE `xholiday` (
  `date` char(8) NOT NULL,
  PRIMARY KEY (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
