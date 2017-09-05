/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50527
Source Host           : localhost:3306
Source Database       : weekreportsys

Target Server Type    : MYSQL
Target Server Version : 50527
File Encoding         : 65001

Date: 2017-09-05 17:41:13
*/

SET FOREIGN_KEY_CHECKS=0;

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
-- Records of dictionary
-- ----------------------------
INSERT INTO `dictionary` VALUES ('1', '0', 'user', 'LAST_LOGIN_TIME', '最新登录时间');
INSERT INTO `dictionary` VALUES ('2', '0', 'user', 'NOTE', '真实姓名');
INSERT INTO `dictionary` VALUES ('3', '0', 'user', 'UID', '用户ID');
INSERT INTO `dictionary` VALUES ('4', '0', 'user', 'UNAME', '登录名');
INSERT INTO `dictionary` VALUES ('5', '0', 'user', 'UPWD', '登录密码');
INSERT INTO `dictionary` VALUES ('6', '0', 'work_detail', 'Detail', '工作详情');
INSERT INTO `dictionary` VALUES ('7', '0', 'work_detail', 'id', 'ID');
INSERT INTO `dictionary` VALUES ('8', '0', 'work_detail', 'NeedDays', '后续人日');
INSERT INTO `dictionary` VALUES ('9', '0', 'work_detail', 'Note', '备注说明');
INSERT INTO `dictionary` VALUES ('10', '0', 'work_detail', 'ProgressRate', '工作进度');
INSERT INTO `dictionary` VALUES ('11', '0', 'work_detail', 'Property', '性质');
INSERT INTO `dictionary` VALUES ('12', '0', 'work_detail', 'StartDate', '开始日期');
INSERT INTO `dictionary` VALUES ('13', '0', 'work_detail', 'SysModule', '系统(模块)');
INSERT INTO `dictionary` VALUES ('14', '0', 'work_detail', 'TraceNo', '跟踪号');
INSERT INTO `dictionary` VALUES ('15', '0', 'work_detail', 'Type', '类型');
INSERT INTO `dictionary` VALUES ('16', '0', 'work_detail', '', '工作详细表');
INSERT INTO `dictionary` VALUES ('17', '0', 'user', '', '用户表');
INSERT INTO `dictionary` VALUES ('18', '0', 'user_work', '', '用户工作关联表');
INSERT INTO `dictionary` VALUES ('19', '0', 'user_work', 'UID', '用户ID');
INSERT INTO `dictionary` VALUES ('20', '0', 'user_work', 'WID', '工作ID');
INSERT INTO `dictionary` VALUES ('21', '0', 'user_work', 'YEAR', '年');
INSERT INTO `dictionary` VALUES ('22', '0', 'user_work', 'WEEK', '周');
INSERT INTO `dictionary` VALUES ('23', '1', 'work_detail', 'SysModule', '集中交易核心系统,');
INSERT INTO `dictionary` VALUES ('24', '1', 'work_detail', 'Type', '');
INSERT INTO `dictionary` VALUES ('25', '1', 'work_detail', 'Property', '');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `UID` int(11) NOT NULL AUTO_INCREMENT,
  `UNAME` varchar(12) NOT NULL,
  `UPWD` varchar(32) NOT NULL,
  `LAST_LOGIN_TIME` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `NOTE` varchar(128) NOT NULL,
  PRIMARY KEY (`UID`),
  UNIQUE KEY `index` (`UNAME`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'admin', 'admin', '2017-09-05 11:15:40', '测试用户');

-- ----------------------------
-- Table structure for user_work
-- ----------------------------
DROP TABLE IF EXISTS `user_work`;
CREATE TABLE `user_work` (
  `UID` int(11) NOT NULL,
  `WID` int(11) NOT NULL,
  `YEAR` int(11) NOT NULL,
  `WEEK` int(11) NOT NULL,
  PRIMARY KEY (`WID`,`UID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_work
-- ----------------------------

-- ----------------------------
-- Table structure for work_detail
-- ----------------------------
DROP TABLE IF EXISTS `work_detail`;
CREATE TABLE `work_detail` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `SysModule` varchar(40) NOT NULL DEFAULT '' COMMENT '系统模块',
  `Type` varchar(12) NOT NULL DEFAULT '' COMMENT '类型',
  `TraceNo` varchar(12) NOT NULL DEFAULT '' COMMENT '跟踪号',
  `Detail` varchar(512) NOT NULL DEFAULT '' COMMENT '工作内容',
  `Property` varchar(12) NOT NULL DEFAULT '' COMMENT '性质',
  `ProgressRate` int(11) NOT NULL DEFAULT '0',
  `StartDate` varchar(16) NOT NULL DEFAULT '',
  `NeedDays` double NOT NULL DEFAULT '0',
  `Note` varchar(512) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of work_detail
-- ----------------------------
