/*
Navicat MySQL Data Transfer

Source Server         : 36mysql
Source Server Version : 50719
Source Host           : 10.10.14.36:3306
Source Database       : weekreportsys

Target Server Type    : MYSQL
Target Server Version : 50719
File Encoding         : 65001

Date: 2017-11-03 16:56:35
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for dbf_columns
-- ----------------------------
DROP TABLE IF EXISTS `dbf_columns`;
CREATE TABLE `dbf_columns` (
  `TABLE_ID` int(11) NOT NULL,
  `COL_NAME` varchar(32) NOT NULL,
  `COL_TYPE` varchar(16) DEFAULT NULL,
  `COL_LENGTH` varchar(8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dbf_columns
-- ----------------------------

-- ----------------------------
-- Table structure for dbf_data_type
-- ----------------------------
DROP TABLE IF EXISTS `dbf_data_type`;
CREATE TABLE `dbf_data_type` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` char(2) NOT NULL,
  `NOTE` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dbf_data_type
-- ----------------------------
INSERT INTO `dbf_data_type` VALUES ('1', 'C', '字符');
INSERT INTO `dbf_data_type` VALUES ('2', 'N', '数值');
INSERT INTO `dbf_data_type` VALUES ('3', 'I', '整型');
INSERT INTO `dbf_data_type` VALUES ('4', 'F', '浮点数');
INSERT INTO `dbf_data_type` VALUES ('5', 'B', '双精度');
INSERT INTO `dbf_data_type` VALUES ('6', 'Y', '货币');
INSERT INTO `dbf_data_type` VALUES ('7', 'L', '逻辑');
INSERT INTO `dbf_data_type` VALUES ('8', 'D', '日期');
INSERT INTO `dbf_data_type` VALUES ('9', 'T', '日期时间');
INSERT INTO `dbf_data_type` VALUES ('10', 'M', '备注');
INSERT INTO `dbf_data_type` VALUES ('11', 'G', '通用');

-- ----------------------------
-- Table structure for dbf_table
-- ----------------------------
DROP TABLE IF EXISTS `dbf_table`;
CREATE TABLE `dbf_table` (
  `ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `NAME` varchar(32) DEFAULT NULL,
  `TYPE` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0：显示顶级菜单（SCHEMA），1：显示下级菜单（TABLE）',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dbf_table
-- ----------------------------
INSERT INTO `dbf_table` VALUES ('1', 'DBF文件', '0');

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
-- Records of department
-- ----------------------------
INSERT INTO `department` VALUES ('1', '开发一部', '3');

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
-- Records of dict
-- ----------------------------
INSERT INTO `dict` VALUES ('1', '系统', '0', '0', '1');
INSERT INTO `dict` VALUES ('2', '类型', '0', '0', '1');
INSERT INTO `dict` VALUES ('3', '性质', '0', '0', '1');
INSERT INTO `dict` VALUES ('34', '监管需求', '0', '2', '0');
INSERT INTO `dict` VALUES ('35', '业务需求', '0', '2', '0');
INSERT INTO `dict` VALUES ('36', '内部优化', '0', '2', '0');
INSERT INTO `dict` VALUES ('38', '数据维护', '0', '2', '0');
INSERT INTO `dict` VALUES ('39', '项目管理', '0', '2', '0');
INSERT INTO `dict` VALUES ('40', '培训准备', '0', '2', '0');
INSERT INTO `dict` VALUES ('42', '在线问题', '0', '2', '0');
INSERT INTO `dict` VALUES ('44', '升级', '0', '2', '0');
INSERT INTO `dict` VALUES ('46', '单元测试', '0', '3', '0');
INSERT INTO `dict` VALUES ('47', '开发', '0', '3', '0');
INSERT INTO `dict` VALUES ('48', '设计', '0', '3', '0');
INSERT INTO `dict` VALUES ('49', '复读', '0', '3', '0');
INSERT INTO `dict` VALUES ('50', '测试沟通', '0', '3', '0');
INSERT INTO `dict` VALUES ('51', '问题排查', '0', '3', '0');
INSERT INTO `dict` VALUES ('54', '需求确认', '0', '3', '0');
INSERT INTO `dict` VALUES ('56', '整理文档', '0', '3', '0');
INSERT INTO `dict` VALUES ('58', '进度跟踪', '0', '3', '0');
INSERT INTO `dict` VALUES ('85', '集中交易', '0', '1', '0');
INSERT INTO `dict` VALUES ('86', '信用交易', '0', '1', '0');
INSERT INTO `dict` VALUES ('87', '信用管理', '0', '1', '0');
INSERT INTO `dict` VALUES ('88', '人行征信', '0', '1', '0');
INSERT INTO `dict` VALUES ('89', '融出资金债权', '0', '1', '0');
INSERT INTO `dict` VALUES ('90', '周边模块', '0', '1', '0');
INSERT INTO `dict` VALUES ('91', '小工具', '0', '1', '0');
INSERT INTO `dict` VALUES ('92', 'QFII订单系统', '0', '1', '0');
INSERT INTO `dict` VALUES ('93', '培训', '0', '1', '0');
INSERT INTO `dict` VALUES ('94', '管理系统', '0', '87', '0');
INSERT INTO `dict` VALUES ('95', '股票质押', '0', '87', '0');
INSERT INTO `dict` VALUES ('96', '约定购回', '0', '87', '0');
INSERT INTO `dict` VALUES ('97', '股权激励', '0', '87', '0');
INSERT INTO `dict` VALUES ('98', '报盘', '0', '90', '0');
INSERT INTO `dict` VALUES ('99', 'SPX网关', '0', '90', '0');
INSERT INTO `dict` VALUES ('100', 'CFMAKE', '0', '90', '0');
INSERT INTO `dict` VALUES ('101', '银证前置', '0', '90', '0');
INSERT INTO `dict` VALUES ('102', '中登前置', '0', '90', '0');
INSERT INTO `dict` VALUES ('103', '市场信息转换', '0', '90', '0');
INSERT INTO `dict` VALUES ('104', '行情转换', '0', '90', '0');
INSERT INTO `dict` VALUES ('105', '行情服务器', '0', '90', '0');
INSERT INTO `dict` VALUES ('106', 'OFS日终处理平台', '0', '90', '0');
INSERT INTO `dict` VALUES ('107', 'hiswitchbu', '0', '90', '0');
INSERT INTO `dict` VALUES ('108', 'KSTP', '0', '92', '0');
INSERT INTO `dict` VALUES ('109', 'UGFIX', '0', '92', '0');
INSERT INTO `dict` VALUES ('110', 'TPCTS', '0', '92', '0');
INSERT INTO `dict` VALUES ('111', 'EMS', '0', '92', '0');
INSERT INTO `dict` VALUES ('114', '通讯互联网关', '0', '90', '0');

-- ----------------------------
-- Table structure for session
-- ----------------------------
DROP TABLE IF EXISTS `session`;
CREATE TABLE `session` (
  `id` char(36) NOT NULL,
  `uname` varchar(16) DEFAULT NULL,
  `login_time` int(11) DEFAULT NULL,
  `login_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of session
-- ----------------------------
INSERT INTO `session` VALUES ('0521cce9-8854-4050-a8aa-354ee89bbf7b', 'hyl', '1509524352', '2017-11-01 16:19:11');
INSERT INTO `session` VALUES ('0f9128a1-141c-4e2c-aeea-9fbb19fcce63', 'js', '1509608078', '2017-11-02 15:34:37');
INSERT INTO `session` VALUES ('1c9f848f-5d91-4ec5-85d6-5cdc2e7252fd', 'lc', '1509611450', '2017-11-02 16:30:50');
INSERT INTO `session` VALUES ('2275a73f-4c5e-4617-bd5d-ac51baf69365', 'hyl', '1509525062', '2017-11-01 16:33:27');
INSERT INTO `session` VALUES ('3093648f-eaef-4203-8234-db38a73089b6', 'lwx', '1509674983', '2017-11-03 10:09:42');
INSERT INTO `session` VALUES ('3bd97c7e-7715-4249-9cef-7a5d67d37f14', 'xjj', '1509599287', '2017-11-02 13:08:06');
INSERT INTO `session` VALUES ('3e1c5bb3-6e87-4162-8dd5-6e3b16044c4d', 'zmh', '1509610286', '2017-11-02 16:11:25');
INSERT INTO `session` VALUES ('45220e24-b0dc-4f81-ba46-34f7b88df78d', 'hyl', '1509411537', '2017-10-31 08:58:56');
INSERT INTO `session` VALUES ('465ba204-921c-4c21-ad3f-d2194c7a6e85', 'hyl', '1509694300', '2017-11-03 15:31:40');
INSERT INTO `session` VALUES ('46e56e2c-597e-4d64-a243-ce25e982956b', 'lwx', '1509599379', '2017-11-02 13:09:39');
INSERT INTO `session` VALUES ('4a892f53-51fc-4871-84c1-8a5799a2e40f', 'zyz', '1509496639', '2017-11-01 08:37:19');
INSERT INTO `session` VALUES ('4abc61ff-da4b-442e-914a-66580ce9a837', 'dl', '1509610185', '2017-11-02 16:09:44');
INSERT INTO `session` VALUES ('54c9a06e-ad2a-4c91-bdb5-25bc954dfa82', 'czy', '1509672933', '2017-11-03 09:35:32');
INSERT INTO `session` VALUES ('566f12ee-77ec-4868-99fc-f36e0e30d6c7', 'sl', '1509687101', '2017-11-03 13:31:41');
INSERT INTO `session` VALUES ('5d7429e6-89a0-4d51-97b1-baa98914d0d0', 'zhw', '1509521846', '2017-11-01 15:37:25');
INSERT INTO `session` VALUES ('5d74a8af-2c78-4e3f-8a51-6138e8af7678', 'zmh', '1509603912', '2017-11-02 14:25:12');
INSERT INTO `session` VALUES ('5e46b6d8-3f6a-457f-9dd3-199edb2a2701', 'hyl', '1509524661', '2017-11-01 16:24:21');
INSERT INTO `session` VALUES ('64bbd874-a1be-4b52-a893-e1d0028d25bd', 'zxx', '1509599361', '2017-11-02 13:09:20');
INSERT INTO `session` VALUES ('672ed114-0283-4394-8ca8-92fc293a0a2d', 'km', '1509609913', '2017-11-02 16:05:13');
INSERT INTO `session` VALUES ('69741d6e-5a70-47b2-91c8-548b0afd9eaa', 'hyl', '1509585202', '2017-11-02 09:13:21');
INSERT INTO `session` VALUES ('6b9188bd-6e31-49e3-b5dc-84ed58fe7047', 'hyl', '1509530171', '2017-11-01 17:56:11');
INSERT INTO `session` VALUES ('6c68d13e-0a20-46d2-a1cf-71a34414af05', 'sl', '1509687604', '2017-11-03 13:40:04');
INSERT INTO `session` VALUES ('79842649-9b29-4650-9254-17bd2181071b', 'qwj', '1509611595', '2017-11-02 16:33:15');
INSERT INTO `session` VALUES ('7aab77b2-8cb3-46e8-aaab-8854f7e56cac', 'hyl', '1509525817', '2017-11-01 16:43:36');
INSERT INTO `session` VALUES ('7d195f9a-e3e8-44a3-b783-eee2bca026b7', 'hyl', '1509442244', '2017-10-31 17:30:44');
INSERT INTO `session` VALUES ('86262a73-e22c-440d-abb3-97a7b1987b8a', 'zsj', '1509669466', '2017-11-03 08:37:45');
INSERT INTO `session` VALUES ('8be8a815-7940-4c65-ae76-9133d5f247f0', 'xjf', '1509669800', '2017-11-03 08:43:19');
INSERT INTO `session` VALUES ('96ef6547-e956-4555-aa77-7dd9c552c8ef', 'ckx', '1509608188', '2017-11-02 15:36:28');
INSERT INTO `session` VALUES ('a12c6bb8-a138-43dd-bd64-45315ce3be3b', 'zhw', '1509672885', '2017-11-03 09:34:44');
INSERT INTO `session` VALUES ('a145b128-1cf8-4c78-8908-44147e8c70a2', 'lwx', '1509611253', '2017-11-02 16:27:32');
INSERT INTO `session` VALUES ('a3a1ab1e-c1ef-403c-af72-95920b74576b', 'ly', '1509602237', '2017-11-02 13:57:17');
INSERT INTO `session` VALUES ('b31e79a2-c418-43a7-96b8-06e031e4ee35', 'zwg', '1509670540', '2017-11-03 08:55:40');
INSERT INTO `session` VALUES ('b70f1a66-d0d7-43cc-8976-59c58b4bb4cc', 'zfg', '1509679895', '2017-11-03 11:31:35');
INSERT INTO `session` VALUES ('b79d3d76-ed8c-416e-855a-a3f46fd20d00', 'xjf', '1509605210', '2017-11-02 14:46:50');
INSERT INTO `session` VALUES ('b8b10883-bd49-4171-bb26-28dca21ff22b', 'ww', '1509599844', '2017-11-02 13:17:23');
INSERT INTO `session` VALUES ('b90d5916-b8f2-4d34-9cd2-eb5b848f3553', 'qwj', '1509429450', '2017-10-31 13:57:29');
INSERT INTO `session` VALUES ('b9c873b6-5f7d-4198-8847-38d455e9cb6a', 'sl', '1509687425', '2017-11-03 13:37:05');
INSERT INTO `session` VALUES ('bc9ac3c5-b22f-426d-849a-711e98f6db56', 'xjj', '1509688955', '2017-11-03 14:02:34');
INSERT INTO `session` VALUES ('c50b8d43-e61b-4f54-896a-6338c97e0f8d', 'hyl', '1509525685', '2017-11-01 16:41:25');
INSERT INTO `session` VALUES ('c98eea3e-8ee1-449b-9f4b-8716c186c52a', 'cdz', '1509600874', '2017-11-02 13:34:34');
INSERT INTO `session` VALUES ('d30e226a-8a99-46b5-8515-7347ba053a80', 'dwb', '1509600194', '2017-11-02 13:23:13');
INSERT INTO `session` VALUES ('d8dabc35-6361-443a-856b-511eedfbada0', 'hyl', '1509609930', '2017-11-02 16:05:30');
INSERT INTO `session` VALUES ('d928e30d-3009-4e62-9c35-4af9eab5209b', 'hyl', '1509524619', '2017-11-01 16:23:38');
INSERT INTO `session` VALUES ('f1ab0bb6-6616-4e65-b637-8627dd2190f6', 'zyz', '1509583787', '2017-11-02 08:49:46');
INSERT INTO `session` VALUES ('fd524d93-ef56-47b2-b6b7-ac6129f16989', 'het', '1509603458', '2017-11-02 14:17:37');
INSERT INTO `session` VALUES ('fed4c979-c139-4fbe-8dd1-a568a0c5b55a', 'zyz', '1509361957', '2017-10-30 19:12:37');

-- ----------------------------
-- Table structure for sys_param
-- ----------------------------
DROP TABLE IF EXISTS `sys_param`;
CREATE TABLE `sys_param` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ParamCode` char(4) NOT NULL,
  `ParamName` varchar(256) DEFAULT NULL,
  `ParamValue` varchar(128) NOT NULL,
  `Note` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_param
-- ----------------------------
INSERT INTO `sys_param` VALUES ('1', '0001', '系统当前周期', '2017,44', '用于判断系统是否调整到下周');
INSERT INTO `sys_param` VALUES ('2', '0002', '转下周时间点', '5,12', '参数：1，星期几；2，时间（小时）');

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
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('3', '16', 'zyz', '026159ab', '2017-11-02 08:49:46', '周尤珠');
INSERT INTO `user` VALUES ('4', '12', 'czy', '123456', '2017-11-03 09:38:57', '曹卓娅');
INSERT INTO `user` VALUES ('5', '13', 'zhw', '123456', '2017-11-03 09:34:44', '张华伟');
INSERT INTO `user` VALUES ('6', '12', 'sl', '123456', '2017-11-03 13:40:04', '隋亮');
INSERT INTO `user` VALUES ('7', '12', 'hyl', '123456', '2017-11-03 15:31:40', '胡有亮');
INSERT INTO `user` VALUES ('8', '12', 'zfg', '123456', '2017-11-03 11:31:35', '郑发桂');
INSERT INTO `user` VALUES ('9', '13', 'zxx', '123456', '2017-11-02 13:09:20', '张修兴');
INSERT INTO `user` VALUES ('10', '13', 'lwx', '123456', '2017-11-03 10:09:42', '李武需');
INSERT INTO `user` VALUES ('11', '13', 'qwj', '123456', '2017-11-02 16:33:15', '乔伟健');
INSERT INTO `user` VALUES ('12', '15', 'lc', 'ustc0310', '2017-11-02 16:30:50', '李昶');
INSERT INTO `user` VALUES ('13', '15', 'dwb', '123456', '2017-11-02 13:23:13', '端伟彬');
INSERT INTO `user` VALUES ('14', '0', 'wht', '123456', '2017-10-12 15:30:19', '王洪涛');
INSERT INTO `user` VALUES ('15', '15', 'xjf', '456123', '2017-11-03 08:43:19', '徐剑锋');
INSERT INTO `user` VALUES ('16', '12', 'cdz', '123456', '2017-11-02 13:34:34', '陈岱宗');
INSERT INTO `user` VALUES ('17', '15', 'ckx', '123456', '2017-11-02 15:36:28', '陈凯祥');
INSERT INTO `user` VALUES ('18', '15', 'ww', '123456', '2017-11-02 13:17:23', '王伟');
INSERT INTO `user` VALUES ('19', '14', 'het', '123456', '2017-11-02 14:17:37', '胡二涛');
INSERT INTO `user` VALUES ('20', '14', 'ly', '123456', '2017-11-02 13:57:17', '刘阳');
INSERT INTO `user` VALUES ('22', '13', 'zxk', '123456', '2017-09-11 16:12:08', '张新昆');
INSERT INTO `user` VALUES ('23', '13', 'zwg', '123456', '2017-11-03 08:55:40', '周万庚');
INSERT INTO `user` VALUES ('24', '14', 'zsj', '123456', '2017-11-03 08:37:45', '朱沈杰');
INSERT INTO `user` VALUES ('25', '13', 'dl', '123456', '2017-11-02 16:09:44', '丁力');
INSERT INTO `user` VALUES ('26', '15', 'js', '123456', '2017-11-02 15:34:37', '贾森');
INSERT INTO `user` VALUES ('27', '14', 'xjj', '123456', '2017-11-03 14:02:34', '徐晶晶');
INSERT INTO `user` VALUES ('28', '13', 'zmh', '123456', '2017-11-02 16:11:25', '战明浩');
INSERT INTO `user` VALUES ('29', '0', 'wdc', '123456', '2017-10-27 15:08:27', '王德成');
INSERT INTO `user` VALUES ('30', '15', 'km', '123456', '2017-11-02 16:05:13', '孔明');

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
-- Records of user_work
-- ----------------------------
INSERT INTO `user_work` VALUES ('27', '12', '2017', '38');
INSERT INTO `user_work` VALUES ('7', '62', '2017', '38');
INSERT INTO `user_work` VALUES ('7', '63', '2017', '38');
INSERT INTO `user_work` VALUES ('9', '106', '2017', '38');
INSERT INTO `user_work` VALUES ('9', '107', '2017', '38');
INSERT INTO `user_work` VALUES ('9', '108', '2017', '38');
INSERT INTO `user_work` VALUES ('9', '109', '2017', '38');
INSERT INTO `user_work` VALUES ('9', '112', '2017', '38');
INSERT INTO `user_work` VALUES ('9', '113', '2017', '38');
INSERT INTO `user_work` VALUES ('9', '114', '2017', '39');
INSERT INTO `user_work` VALUES ('9', '115', '2017', '39');
INSERT INTO `user_work` VALUES ('9', '116', '2017', '39');
INSERT INTO `user_work` VALUES ('27', '117', '2017', '38');
INSERT INTO `user_work` VALUES ('10', '118', '2017', '38');
INSERT INTO `user_work` VALUES ('10', '119', '2017', '38');
INSERT INTO `user_work` VALUES ('10', '120', '2017', '38');
INSERT INTO `user_work` VALUES ('10', '122', '2017', '38');
INSERT INTO `user_work` VALUES ('16', '123', '2017', '38');
INSERT INTO `user_work` VALUES ('16', '124', '2017', '38');
INSERT INTO `user_work` VALUES ('16', '125', '2017', '38');
INSERT INTO `user_work` VALUES ('16', '126', '2017', '38');
INSERT INTO `user_work` VALUES ('7', '127', '2017', '39');
INSERT INTO `user_work` VALUES ('19', '128', '2017', '37');
INSERT INTO `user_work` VALUES ('25', '129', '2017', '38');
INSERT INTO `user_work` VALUES ('19', '130', '2017', '37');
INSERT INTO `user_work` VALUES ('19', '131', '2017', '37');
INSERT INTO `user_work` VALUES ('27', '133', '2017', '38');
INSERT INTO `user_work` VALUES ('16', '134', '2017', '38');
INSERT INTO `user_work` VALUES ('16', '136', '2017', '39');
INSERT INTO `user_work` VALUES ('23', '137', '2017', '38');
INSERT INTO `user_work` VALUES ('16', '138', '2017', '39');
INSERT INTO `user_work` VALUES ('6', '139', '2017', '38');
INSERT INTO `user_work` VALUES ('23', '140', '2017', '38');
INSERT INTO `user_work` VALUES ('16', '141', '2017', '39');
INSERT INTO `user_work` VALUES ('23', '142', '2017', '38');
INSERT INTO `user_work` VALUES ('23', '143', '2017', '38');
INSERT INTO `user_work` VALUES ('6', '144', '2017', '38');
INSERT INTO `user_work` VALUES ('25', '145', '2017', '38');
INSERT INTO `user_work` VALUES ('6', '146', '2017', '38');
INSERT INTO `user_work` VALUES ('6', '147', '2017', '38');
INSERT INTO `user_work` VALUES ('25', '148', '2017', '38');
INSERT INTO `user_work` VALUES ('6', '149', '2017', '38');
INSERT INTO `user_work` VALUES ('25', '152', '2017', '39');
INSERT INTO `user_work` VALUES ('6', '154', '2017', '39');
INSERT INTO `user_work` VALUES ('6', '155', '2017', '39');
INSERT INTO `user_work` VALUES ('25', '156', '2017', '39');
INSERT INTO `user_work` VALUES ('28', '157', '2017', '38');
INSERT INTO `user_work` VALUES ('28', '158', '2017', '38');
INSERT INTO `user_work` VALUES ('28', '159', '2017', '38');
INSERT INTO `user_work` VALUES ('20', '160', '2017', '37');
INSERT INTO `user_work` VALUES ('28', '161', '2017', '37');
INSERT INTO `user_work` VALUES ('20', '162', '2017', '38');
INSERT INTO `user_work` VALUES ('20', '163', '2017', '37');
INSERT INTO `user_work` VALUES ('28', '164', '2017', '37');
INSERT INTO `user_work` VALUES ('20', '165', '2017', '37');
INSERT INTO `user_work` VALUES ('20', '166', '2017', '37');
INSERT INTO `user_work` VALUES ('20', '167', '2017', '35');
INSERT INTO `user_work` VALUES ('20', '168', '2017', '35');
INSERT INTO `user_work` VALUES ('20', '169', '2017', '37');
INSERT INTO `user_work` VALUES ('4', '170', '2017', '38');
INSERT INTO `user_work` VALUES ('10', '171', '2017', '39');
INSERT INTO `user_work` VALUES ('10', '172', '2017', '39');
INSERT INTO `user_work` VALUES ('10', '173', '2017', '39');
INSERT INTO `user_work` VALUES ('28', '174', '2017', '38');
INSERT INTO `user_work` VALUES ('20', '176', '2017', '38');
INSERT INTO `user_work` VALUES ('20', '177', '2017', '38');
INSERT INTO `user_work` VALUES ('28', '178', '2017', '39');
INSERT INTO `user_work` VALUES ('28', '179', '2017', '39');
INSERT INTO `user_work` VALUES ('20', '180', '2017', '38');
INSERT INTO `user_work` VALUES ('28', '181', '2017', '39');
INSERT INTO `user_work` VALUES ('20', '182', '2017', '39');
INSERT INTO `user_work` VALUES ('20', '183', '2017', '39');
INSERT INTO `user_work` VALUES ('20', '184', '2017', '39');
INSERT INTO `user_work` VALUES ('24', '185', '2017', '38');
INSERT INTO `user_work` VALUES ('24', '186', '2017', '38');
INSERT INTO `user_work` VALUES ('24', '187', '2017', '38');
INSERT INTO `user_work` VALUES ('24', '189', '2017', '38');
INSERT INTO `user_work` VALUES ('24', '191', '2017', '38');
INSERT INTO `user_work` VALUES ('24', '192', '2017', '38');
INSERT INTO `user_work` VALUES ('24', '193', '2017', '38');
INSERT INTO `user_work` VALUES ('24', '194', '2017', '38');
INSERT INTO `user_work` VALUES ('24', '195', '2017', '38');
INSERT INTO `user_work` VALUES ('24', '196', '2017', '39');
INSERT INTO `user_work` VALUES ('19', '197', '2017', '38');
INSERT INTO `user_work` VALUES ('19', '202', '2017', '37');
INSERT INTO `user_work` VALUES ('27', '203', '2017', '38');
INSERT INTO `user_work` VALUES ('27', '204', '2017', '38');
INSERT INTO `user_work` VALUES ('19', '210', '2017', '38');
INSERT INTO `user_work` VALUES ('15', '211', '2017', '32');
INSERT INTO `user_work` VALUES ('15', '212', '2017', '38');
INSERT INTO `user_work` VALUES ('15', '214', '2017', '38');
INSERT INTO `user_work` VALUES ('15', '215', '2017', '38');
INSERT INTO `user_work` VALUES ('15', '216', '2017', '38');
INSERT INTO `user_work` VALUES ('15', '217', '2017', '39');
INSERT INTO `user_work` VALUES ('15', '219', '2017', '39');
INSERT INTO `user_work` VALUES ('5', '224', '2017', '38');
INSERT INTO `user_work` VALUES ('5', '225', '2017', '38');
INSERT INTO `user_work` VALUES ('5', '227', '2017', '38');
INSERT INTO `user_work` VALUES ('11', '228', '2017', '38');
INSERT INTO `user_work` VALUES ('11', '229', '2017', '38');
INSERT INTO `user_work` VALUES ('11', '230', '2017', '39');
INSERT INTO `user_work` VALUES ('4', '231', '2017', '38');
INSERT INTO `user_work` VALUES ('4', '232', '2017', '38');
INSERT INTO `user_work` VALUES ('5', '236', '2017', '38');
INSERT INTO `user_work` VALUES ('5', '241', '2017', '39');
INSERT INTO `user_work` VALUES ('8', '242', '2017', '37');
INSERT INTO `user_work` VALUES ('27', '243', '2017', '39');
INSERT INTO `user_work` VALUES ('27', '247', '2017', '39');
INSERT INTO `user_work` VALUES ('8', '248', '2017', '38');
INSERT INTO `user_work` VALUES ('27', '250', '2017', '39');
INSERT INTO `user_work` VALUES ('8', '254', '2017', '38');
INSERT INTO `user_work` VALUES ('19', '258', '2017', '39');
INSERT INTO `user_work` VALUES ('10', '259', '2017', '39');
INSERT INTO `user_work` VALUES ('10', '260', '2017', '39');
INSERT INTO `user_work` VALUES ('16', '280', '2017', '39');
INSERT INTO `user_work` VALUES ('16', '281', '2017', '39');
INSERT INTO `user_work` VALUES ('16', '282', '2017', '41');
INSERT INTO `user_work` VALUES ('16', '284', '2017', '43');
INSERT INTO `user_work` VALUES ('16', '284', '2017', '44');
INSERT INTO `user_work` VALUES ('16', '284', '2017', '45');
INSERT INTO `user_work` VALUES ('16', '287', '2017', '43');
INSERT INTO `user_work` VALUES ('16', '287', '2017', '44');
INSERT INTO `user_work` VALUES ('16', '287', '2017', '45');
INSERT INTO `user_work` VALUES ('19', '288', '2017', '39');
INSERT INTO `user_work` VALUES ('19', '289', '2017', '39');
INSERT INTO `user_work` VALUES ('19', '290', '2017', '41');
INSERT INTO `user_work` VALUES ('19', '290', '2017', '42');
INSERT INTO `user_work` VALUES ('19', '290', '2017', '43');
INSERT INTO `user_work` VALUES ('13', '291', '2017', '39');
INSERT INTO `user_work` VALUES ('16', '292', '2017', '43');
INSERT INTO `user_work` VALUES ('16', '292', '2017', '44');
INSERT INTO `user_work` VALUES ('16', '292', '2017', '45');
INSERT INTO `user_work` VALUES ('13', '294', '2017', '41');
INSERT INTO `user_work` VALUES ('16', '295', '2017', '43');
INSERT INTO `user_work` VALUES ('16', '295', '2017', '44');
INSERT INTO `user_work` VALUES ('16', '295', '2017', '45');
INSERT INTO `user_work` VALUES ('16', '296', '2017', '43');
INSERT INTO `user_work` VALUES ('16', '296', '2017', '44');
INSERT INTO `user_work` VALUES ('16', '296', '2017', '45');
INSERT INTO `user_work` VALUES ('9', '297', '2017', '39');
INSERT INTO `user_work` VALUES ('9', '298', '2017', '39');
INSERT INTO `user_work` VALUES ('9', '299', '2017', '41');
INSERT INTO `user_work` VALUES ('9', '299', '2017', '42');
INSERT INTO `user_work` VALUES ('27', '300', '2017', '39');
INSERT INTO `user_work` VALUES ('27', '301', '2017', '41');
INSERT INTO `user_work` VALUES ('10', '302', '2017', '41');
INSERT INTO `user_work` VALUES ('10', '302', '2017', '42');
INSERT INTO `user_work` VALUES ('10', '302', '2017', '43');
INSERT INTO `user_work` VALUES ('11', '303', '2017', '41');
INSERT INTO `user_work` VALUES ('17', '304', '2017', '39');
INSERT INTO `user_work` VALUES ('27', '305', '2017', '41');
INSERT INTO `user_work` VALUES ('27', '305', '2017', '42');
INSERT INTO `user_work` VALUES ('27', '305', '2017', '43');
INSERT INTO `user_work` VALUES ('27', '305', '2017', '44');
INSERT INTO `user_work` VALUES ('27', '305', '2017', '45');
INSERT INTO `user_work` VALUES ('18', '306', '2017', '39');
INSERT INTO `user_work` VALUES ('18', '307', '2017', '39');
INSERT INTO `user_work` VALUES ('10', '308', '2017', '41');
INSERT INTO `user_work` VALUES ('10', '308', '2017', '42');
INSERT INTO `user_work` VALUES ('10', '309', '2017', '41');
INSERT INTO `user_work` VALUES ('10', '309', '2017', '42');
INSERT INTO `user_work` VALUES ('25', '310', '2017', '39');
INSERT INTO `user_work` VALUES ('17', '311', '2017', '39');
INSERT INTO `user_work` VALUES ('25', '312', '2017', '41');
INSERT INTO `user_work` VALUES ('25', '312', '2017', '42');
INSERT INTO `user_work` VALUES ('25', '312', '2017', '43');
INSERT INTO `user_work` VALUES ('25', '312', '2017', '44');
INSERT INTO `user_work` VALUES ('25', '312', '2017', '45');
INSERT INTO `user_work` VALUES ('17', '315', '2017', '39');
INSERT INTO `user_work` VALUES ('24', '316', '2017', '41');
INSERT INTO `user_work` VALUES ('24', '316', '2017', '42');
INSERT INTO `user_work` VALUES ('24', '316', '2017', '43');
INSERT INTO `user_work` VALUES ('24', '316', '2017', '44');
INSERT INTO `user_work` VALUES ('24', '317', '2017', '39');
INSERT INTO `user_work` VALUES ('15', '318', '2017', '39');
INSERT INTO `user_work` VALUES ('6', '319', '2017', '39');
INSERT INTO `user_work` VALUES ('28', '320', '2017', '39');
INSERT INTO `user_work` VALUES ('18', '321', '2017', '39');
INSERT INTO `user_work` VALUES ('15', '322', '2017', '39');
INSERT INTO `user_work` VALUES ('25', '323', '2017', '41');
INSERT INTO `user_work` VALUES ('25', '323', '2017', '43');
INSERT INTO `user_work` VALUES ('28', '324', '2017', '39');
INSERT INTO `user_work` VALUES ('28', '325', '2017', '39');
INSERT INTO `user_work` VALUES ('6', '326', '2017', '39');
INSERT INTO `user_work` VALUES ('24', '327', '2017', '41');
INSERT INTO `user_work` VALUES ('24', '327', '2017', '42');
INSERT INTO `user_work` VALUES ('24', '327', '2017', '43');
INSERT INTO `user_work` VALUES ('24', '327', '2017', '44');
INSERT INTO `user_work` VALUES ('24', '327', '2017', '45');
INSERT INTO `user_work` VALUES ('24', '328', '2017', '41');
INSERT INTO `user_work` VALUES ('24', '328', '2017', '42');
INSERT INTO `user_work` VALUES ('24', '328', '2017', '43');
INSERT INTO `user_work` VALUES ('24', '328', '2017', '44');
INSERT INTO `user_work` VALUES ('24', '328', '2017', '45');
INSERT INTO `user_work` VALUES ('18', '329', '2017', '41');
INSERT INTO `user_work` VALUES ('18', '329', '2017', '42');
INSERT INTO `user_work` VALUES ('18', '329', '2017', '43');
INSERT INTO `user_work` VALUES ('28', '331', '2017', '39');
INSERT INTO `user_work` VALUES ('24', '332', '2017', '41');
INSERT INTO `user_work` VALUES ('24', '332', '2017', '42');
INSERT INTO `user_work` VALUES ('24', '332', '2017', '43');
INSERT INTO `user_work` VALUES ('24', '332', '2017', '44');
INSERT INTO `user_work` VALUES ('24', '332', '2017', '45');
INSERT INTO `user_work` VALUES ('18', '333', '2017', '41');
INSERT INTO `user_work` VALUES ('18', '333', '2017', '43');
INSERT INTO `user_work` VALUES ('24', '334', '2017', '41');
INSERT INTO `user_work` VALUES ('24', '334', '2017', '42');
INSERT INTO `user_work` VALUES ('24', '334', '2017', '43');
INSERT INTO `user_work` VALUES ('24', '334', '2017', '44');
INSERT INTO `user_work` VALUES ('24', '334', '2017', '45');
INSERT INTO `user_work` VALUES ('6', '335', '2017', '39');
INSERT INTO `user_work` VALUES ('28', '336', '2017', '41');
INSERT INTO `user_work` VALUES ('28', '337', '2017', '41');
INSERT INTO `user_work` VALUES ('28', '337', '2017', '42');
INSERT INTO `user_work` VALUES ('28', '337', '2017', '43');
INSERT INTO `user_work` VALUES ('6', '338', '2017', '39');
INSERT INTO `user_work` VALUES ('6', '339', '2017', '41');
INSERT INTO `user_work` VALUES ('6', '339', '2017', '43');
INSERT INTO `user_work` VALUES ('6', '339', '2017', '44');
INSERT INTO `user_work` VALUES ('6', '339', '2017', '45');
INSERT INTO `user_work` VALUES ('5', '340', '2017', '39');
INSERT INTO `user_work` VALUES ('6', '341', '2017', '41');
INSERT INTO `user_work` VALUES ('6', '341', '2017', '42');
INSERT INTO `user_work` VALUES ('6', '341', '2017', '43');
INSERT INTO `user_work` VALUES ('6', '341', '2017', '44');
INSERT INTO `user_work` VALUES ('6', '341', '2017', '45');
INSERT INTO `user_work` VALUES ('15', '342', '2017', '39');
INSERT INTO `user_work` VALUES ('5', '343', '2017', '39');
INSERT INTO `user_work` VALUES ('15', '344', '2017', '39');
INSERT INTO `user_work` VALUES ('20', '345', '2017', '39');
INSERT INTO `user_work` VALUES ('8', '346', '2017', '39');
INSERT INTO `user_work` VALUES ('5', '351', '2017', '39');
INSERT INTO `user_work` VALUES ('20', '352', '2017', '41');
INSERT INTO `user_work` VALUES ('15', '353', '2017', '41');
INSERT INTO `user_work` VALUES ('5', '356', '2017', '39');
INSERT INTO `user_work` VALUES ('15', '357', '2017', '41');
INSERT INTO `user_work` VALUES ('15', '357', '2017', '42');
INSERT INTO `user_work` VALUES ('8', '358', '2017', '39');
INSERT INTO `user_work` VALUES ('5', '359', '2017', '39');
INSERT INTO `user_work` VALUES ('20', '360', '2017', '41');
INSERT INTO `user_work` VALUES ('5', '361', '2017', '41');
INSERT INTO `user_work` VALUES ('5', '361', '2017', '42');
INSERT INTO `user_work` VALUES ('5', '361', '2017', '43');
INSERT INTO `user_work` VALUES ('7', '362', '2017', '41');
INSERT INTO `user_work` VALUES ('7', '362', '2017', '42');
INSERT INTO `user_work` VALUES ('7', '362', '2017', '43');
INSERT INTO `user_work` VALUES ('7', '362', '2017', '44');
INSERT INTO `user_work` VALUES ('5', '363', '2017', '41');
INSERT INTO `user_work` VALUES ('5', '363', '2017', '42');
INSERT INTO `user_work` VALUES ('5', '363', '2017', '43');
INSERT INTO `user_work` VALUES ('7', '366', '2017', '41');
INSERT INTO `user_work` VALUES ('7', '366', '2017', '42');
INSERT INTO `user_work` VALUES ('6', '367', '2017', '41');
INSERT INTO `user_work` VALUES ('6', '367', '2017', '42');
INSERT INTO `user_work` VALUES ('17', '368', '2017', '39');
INSERT INTO `user_work` VALUES ('17', '369', '2017', '39');
INSERT INTO `user_work` VALUES ('17', '370', '2017', '39');
INSERT INTO `user_work` VALUES ('17', '371', '2017', '39');
INSERT INTO `user_work` VALUES ('17', '372', '2017', '39');
INSERT INTO `user_work` VALUES ('17', '373', '2017', '39');
INSERT INTO `user_work` VALUES ('12', '374', '2017', '39');
INSERT INTO `user_work` VALUES ('12', '375', '2017', '39');
INSERT INTO `user_work` VALUES ('12', '376', '2017', '43');
INSERT INTO `user_work` VALUES ('4', '378', '2017', '39');
INSERT INTO `user_work` VALUES ('4', '379', '2017', '39');
INSERT INTO `user_work` VALUES ('23', '380', '2017', '39');
INSERT INTO `user_work` VALUES ('4', '381', '2017', '39');
INSERT INTO `user_work` VALUES ('23', '382', '2017', '39');
INSERT INTO `user_work` VALUES ('23', '383', '2017', '39');
INSERT INTO `user_work` VALUES ('23', '384', '2017', '39');
INSERT INTO `user_work` VALUES ('23', '385', '2017', '39');
INSERT INTO `user_work` VALUES ('23', '386', '2017', '41');
INSERT INTO `user_work` VALUES ('23', '386', '2017', '43');
INSERT INTO `user_work` VALUES ('23', '386', '2017', '44');
INSERT INTO `user_work` VALUES ('23', '386', '2017', '45');
INSERT INTO `user_work` VALUES ('26', '387', '2017', '39');
INSERT INTO `user_work` VALUES ('4', '388', '2017', '41');
INSERT INTO `user_work` VALUES ('4', '388', '2017', '42');
INSERT INTO `user_work` VALUES ('4', '388', '2017', '43');
INSERT INTO `user_work` VALUES ('4', '388', '2017', '44');
INSERT INTO `user_work` VALUES ('3', '389', '2017', '39');
INSERT INTO `user_work` VALUES ('26', '390', '2017', '41');
INSERT INTO `user_work` VALUES ('26', '391', '2017', '41');
INSERT INTO `user_work` VALUES ('3', '412', '2017', '41');
INSERT INTO `user_work` VALUES ('3', '413', '2017', '41');
INSERT INTO `user_work` VALUES ('3', '414', '2017', '41');
INSERT INTO `user_work` VALUES ('3', '415', '2017', '41');
INSERT INTO `user_work` VALUES ('3', '422', '2017', '41');
INSERT INTO `user_work` VALUES ('3', '428', '2017', '41');
INSERT INTO `user_work` VALUES ('3', '428', '2017', '43');
INSERT INTO `user_work` VALUES ('3', '428', '2017', '44');
INSERT INTO `user_work` VALUES ('3', '428', '2017', '45');
INSERT INTO `user_work` VALUES ('9', '457', '2017', '41');
INSERT INTO `user_work` VALUES ('9', '457', '2017', '42');
INSERT INTO `user_work` VALUES ('9', '457', '2017', '43');
INSERT INTO `user_work` VALUES ('9', '457', '2017', '44');
INSERT INTO `user_work` VALUES ('9', '457', '2017', '45');
INSERT INTO `user_work` VALUES ('10', '458', '2017', '41');
INSERT INTO `user_work` VALUES ('10', '458', '2017', '42');
INSERT INTO `user_work` VALUES ('8', '461', '2017', '41');
INSERT INTO `user_work` VALUES ('10', '462', '2017', '42');
INSERT INTO `user_work` VALUES ('9', '463', '2017', '41');
INSERT INTO `user_work` VALUES ('9', '463', '2017', '43');
INSERT INTO `user_work` VALUES ('9', '463', '2017', '44');
INSERT INTO `user_work` VALUES ('9', '463', '2017', '45');
INSERT INTO `user_work` VALUES ('9', '464', '2017', '42');
INSERT INTO `user_work` VALUES ('9', '465', '2017', '42');
INSERT INTO `user_work` VALUES ('9', '465', '2017', '43');
INSERT INTO `user_work` VALUES ('8', '466', '2017', '41');
INSERT INTO `user_work` VALUES ('8', '466', '2017', '43');
INSERT INTO `user_work` VALUES ('16', '467', '2017', '41');
INSERT INTO `user_work` VALUES ('16', '468', '2017', '41');
INSERT INTO `user_work` VALUES ('16', '469', '2017', '41');
INSERT INTO `user_work` VALUES ('16', '469', '2017', '43');
INSERT INTO `user_work` VALUES ('16', '469', '2017', '44');
INSERT INTO `user_work` VALUES ('16', '470', '2017', '41');
INSERT INTO `user_work` VALUES ('16', '470', '2017', '43');
INSERT INTO `user_work` VALUES ('16', '470', '2017', '44');
INSERT INTO `user_work` VALUES ('16', '470', '2017', '45');
INSERT INTO `user_work` VALUES ('8', '471', '2017', '42');
INSERT INTO `user_work` VALUES ('8', '471', '2017', '43');
INSERT INTO `user_work` VALUES ('8', '472', '2017', '42');
INSERT INTO `user_work` VALUES ('8', '472', '2017', '43');
INSERT INTO `user_work` VALUES ('20', '473', '2017', '41');
INSERT INTO `user_work` VALUES ('6', '474', '2017', '42');
INSERT INTO `user_work` VALUES ('6', '474', '2017', '43');
INSERT INTO `user_work` VALUES ('4', '475', '2017', '41');
INSERT INTO `user_work` VALUES ('4', '475', '2017', '43');
INSERT INTO `user_work` VALUES ('4', '475', '2017', '44');
INSERT INTO `user_work` VALUES ('4', '476', '2017', '41');
INSERT INTO `user_work` VALUES ('25', '477', '2017', '41');
INSERT INTO `user_work` VALUES ('25', '477', '2017', '43');
INSERT INTO `user_work` VALUES ('4', '478', '2017', '41');
INSERT INTO `user_work` VALUES ('4', '479', '2017', '42');
INSERT INTO `user_work` VALUES ('4', '479', '2017', '43');
INSERT INTO `user_work` VALUES ('4', '479', '2017', '44');
INSERT INTO `user_work` VALUES ('13', '480', '2017', '41');
INSERT INTO `user_work` VALUES ('13', '480', '2017', '43');
INSERT INTO `user_work` VALUES ('13', '481', '2017', '42');
INSERT INTO `user_work` VALUES ('4', '482', '2017', '42');
INSERT INTO `user_work` VALUES ('4', '482', '2017', '43');
INSERT INTO `user_work` VALUES ('4', '482', '2017', '44');
INSERT INTO `user_work` VALUES ('4', '483', '2017', '42');
INSERT INTO `user_work` VALUES ('4', '483', '2017', '43');
INSERT INTO `user_work` VALUES ('4', '483', '2017', '44');
INSERT INTO `user_work` VALUES ('19', '484', '2017', '41');
INSERT INTO `user_work` VALUES ('15', '485', '2017', '41');
INSERT INTO `user_work` VALUES ('15', '485', '2017', '42');
INSERT INTO `user_work` VALUES ('19', '486', '2017', '41');
INSERT INTO `user_work` VALUES ('15', '487', '2017', '41');
INSERT INTO `user_work` VALUES ('19', '488', '2017', '41');
INSERT INTO `user_work` VALUES ('15', '489', '2017', '41');
INSERT INTO `user_work` VALUES ('19', '490', '2017', '42');
INSERT INTO `user_work` VALUES ('19', '490', '2017', '43');
INSERT INTO `user_work` VALUES ('19', '490', '2017', '44');
INSERT INTO `user_work` VALUES ('19', '490', '2017', '45');
INSERT INTO `user_work` VALUES ('17', '491', '2017', '41');
INSERT INTO `user_work` VALUES ('17', '491', '2017', '43');
INSERT INTO `user_work` VALUES ('17', '492', '2017', '41');
INSERT INTO `user_work` VALUES ('17', '493', '2017', '41');
INSERT INTO `user_work` VALUES ('17', '493', '2017', '42');
INSERT INTO `user_work` VALUES ('17', '493', '2017', '43');
INSERT INTO `user_work` VALUES ('17', '494', '2017', '43');
INSERT INTO `user_work` VALUES ('17', '495', '2017', '42');
INSERT INTO `user_work` VALUES ('17', '495', '2017', '43');
INSERT INTO `user_work` VALUES ('17', '496', '2017', '42');
INSERT INTO `user_work` VALUES ('17', '496', '2017', '43');
INSERT INTO `user_work` VALUES ('17', '497', '2017', '41');
INSERT INTO `user_work` VALUES ('17', '497', '2017', '43');
INSERT INTO `user_work` VALUES ('27', '498', '2017', '41');
INSERT INTO `user_work` VALUES ('27', '498', '2017', '42');
INSERT INTO `user_work` VALUES ('27', '499', '2017', '41');
INSERT INTO `user_work` VALUES ('27', '499', '2017', '42');
INSERT INTO `user_work` VALUES ('27', '499', '2017', '43');
INSERT INTO `user_work` VALUES ('16', '500', '2017', '42');
INSERT INTO `user_work` VALUES ('8', '501', '2017', '42');
INSERT INTO `user_work` VALUES ('18', '502', '2017', '42');
INSERT INTO `user_work` VALUES ('18', '502', '2017', '43');
INSERT INTO `user_work` VALUES ('18', '502', '2017', '44');
INSERT INTO `user_work` VALUES ('18', '502', '2017', '45');
INSERT INTO `user_work` VALUES ('5', '504', '2017', '41');
INSERT INTO `user_work` VALUES ('5', '505', '2017', '41');
INSERT INTO `user_work` VALUES ('5', '506', '2017', '41');
INSERT INTO `user_work` VALUES ('5', '507', '2017', '41');
INSERT INTO `user_work` VALUES ('5', '508', '2017', '42');
INSERT INTO `user_work` VALUES ('5', '508', '2017', '43');
INSERT INTO `user_work` VALUES ('5', '508', '2017', '44');
INSERT INTO `user_work` VALUES ('5', '508', '2017', '45');
INSERT INTO `user_work` VALUES ('5', '509', '2017', '42');
INSERT INTO `user_work` VALUES ('5', '509', '2017', '43');
INSERT INTO `user_work` VALUES ('5', '509', '2017', '44');
INSERT INTO `user_work` VALUES ('5', '509', '2017', '45');
INSERT INTO `user_work` VALUES ('3', '511', '2017', '41');
INSERT INTO `user_work` VALUES ('3', '511', '2017', '42');
INSERT INTO `user_work` VALUES ('3', '511', '2017', '43');
INSERT INTO `user_work` VALUES ('3', '511', '2017', '44');
INSERT INTO `user_work` VALUES ('3', '511', '2017', '45');
INSERT INTO `user_work` VALUES ('24', '513', '2017', '41');
INSERT INTO `user_work` VALUES ('12', '514', '2017', '41');
INSERT INTO `user_work` VALUES ('12', '514', '2017', '42');
INSERT INTO `user_work` VALUES ('12', '514', '2017', '43');
INSERT INTO `user_work` VALUES ('12', '515', '2017', '41');
INSERT INTO `user_work` VALUES ('26', '517', '2017', '41');
INSERT INTO `user_work` VALUES ('26', '518', '2017', '42');
INSERT INTO `user_work` VALUES ('26', '518', '2017', '43');
INSERT INTO `user_work` VALUES ('26', '518', '2017', '44');
INSERT INTO `user_work` VALUES ('26', '518', '2017', '45');
INSERT INTO `user_work` VALUES ('26', '519', '2017', '42');
INSERT INTO `user_work` VALUES ('26', '519', '2017', '43');
INSERT INTO `user_work` VALUES ('26', '519', '2017', '44');
INSERT INTO `user_work` VALUES ('26', '519', '2017', '45');
INSERT INTO `user_work` VALUES ('20', '520', '2017', '42');
INSERT INTO `user_work` VALUES ('20', '520', '2017', '43');
INSERT INTO `user_work` VALUES ('23', '521', '2017', '41');
INSERT INTO `user_work` VALUES ('23', '521', '2017', '43');
INSERT INTO `user_work` VALUES ('23', '522', '2017', '41');
INSERT INTO `user_work` VALUES ('23', '523', '2017', '41');
INSERT INTO `user_work` VALUES ('23', '523', '2017', '43');
INSERT INTO `user_work` VALUES ('23', '523', '2017', '44');
INSERT INTO `user_work` VALUES ('23', '523', '2017', '45');
INSERT INTO `user_work` VALUES ('11', '524', '2017', '42');
INSERT INTO `user_work` VALUES ('11', '525', '2017', '42');
INSERT INTO `user_work` VALUES ('11', '525', '2017', '43');
INSERT INTO `user_work` VALUES ('3', '526', '2017', '41');
INSERT INTO `user_work` VALUES ('3', '527', '2017', '41');
INSERT INTO `user_work` VALUES ('3', '528', '2017', '41');
INSERT INTO `user_work` VALUES ('3', '528', '2017', '42');
INSERT INTO `user_work` VALUES ('3', '528', '2017', '43');
INSERT INTO `user_work` VALUES ('3', '528', '2017', '44');
INSERT INTO `user_work` VALUES ('3', '528', '2017', '45');
INSERT INTO `user_work` VALUES ('11', '530', '2017', '41');
INSERT INTO `user_work` VALUES ('11', '531', '2017', '41');
INSERT INTO `user_work` VALUES ('11', '532', '2017', '42');
INSERT INTO `user_work` VALUES ('11', '532', '2017', '43');
INSERT INTO `user_work` VALUES ('3', '533', '2017', '41');
INSERT INTO `user_work` VALUES ('3', '533', '2017', '42');
INSERT INTO `user_work` VALUES ('3', '535', '2017', '42');
INSERT INTO `user_work` VALUES ('3', '536', '2017', '42');
INSERT INTO `user_work` VALUES ('3', '537', '2017', '42');
INSERT INTO `user_work` VALUES ('3', '538', '2017', '42');
INSERT INTO `user_work` VALUES ('3', '538', '2017', '43');
INSERT INTO `user_work` VALUES ('3', '538', '2017', '44');
INSERT INTO `user_work` VALUES ('7', '543', '2017', '42');
INSERT INTO `user_work` VALUES ('3', '544', '2017', '42');
INSERT INTO `user_work` VALUES ('3', '544', '2017', '43');
INSERT INTO `user_work` VALUES ('3', '544', '2017', '44');
INSERT INTO `user_work` VALUES ('3', '544', '2017', '45');
INSERT INTO `user_work` VALUES ('9', '545', '2017', '42');
INSERT INTO `user_work` VALUES ('9', '545', '2017', '43');
INSERT INTO `user_work` VALUES ('9', '546', '2017', '42');
INSERT INTO `user_work` VALUES ('9', '547', '2017', '42');
INSERT INTO `user_work` VALUES ('24', '548', '2017', '42');
INSERT INTO `user_work` VALUES ('9', '549', '2017', '42');
INSERT INTO `user_work` VALUES ('24', '550', '2017', '42');
INSERT INTO `user_work` VALUES ('24', '551', '2017', '42');
INSERT INTO `user_work` VALUES ('24', '552', '2017', '42');
INSERT INTO `user_work` VALUES ('9', '553', '2017', '42');
INSERT INTO `user_work` VALUES ('9', '553', '2017', '43');
INSERT INTO `user_work` VALUES ('9', '553', '2017', '44');
INSERT INTO `user_work` VALUES ('9', '553', '2017', '45');
INSERT INTO `user_work` VALUES ('9', '554', '2017', '43');
INSERT INTO `user_work` VALUES ('9', '554', '2017', '44');
INSERT INTO `user_work` VALUES ('28', '555', '2017', '42');
INSERT INTO `user_work` VALUES ('28', '556', '2017', '42');
INSERT INTO `user_work` VALUES ('28', '557', '2017', '42');
INSERT INTO `user_work` VALUES ('28', '558', '2017', '42');
INSERT INTO `user_work` VALUES ('28', '559', '2017', '42');
INSERT INTO `user_work` VALUES ('27', '560', '2017', '42');
INSERT INTO `user_work` VALUES ('27', '560', '2017', '43');
INSERT INTO `user_work` VALUES ('27', '560', '2017', '44');
INSERT INTO `user_work` VALUES ('27', '560', '2017', '45');
INSERT INTO `user_work` VALUES ('6', '563', '2017', '42');
INSERT INTO `user_work` VALUES ('6', '564', '2017', '42');
INSERT INTO `user_work` VALUES ('6', '564', '2017', '43');
INSERT INTO `user_work` VALUES ('19', '565', '2017', '42');
INSERT INTO `user_work` VALUES ('6', '566', '2017', '42');
INSERT INTO `user_work` VALUES ('6', '566', '2017', '43');
INSERT INTO `user_work` VALUES ('6', '567', '2017', '42');
INSERT INTO `user_work` VALUES ('6', '567', '2017', '43');
INSERT INTO `user_work` VALUES ('11', '568', '2017', '42');
INSERT INTO `user_work` VALUES ('11', '568', '2017', '43');
INSERT INTO `user_work` VALUES ('13', '569', '2017', '42');
INSERT INTO `user_work` VALUES ('18', '570', '2017', '42');
INSERT INTO `user_work` VALUES ('18', '570', '2017', '43');
INSERT INTO `user_work` VALUES ('18', '570', '2017', '44');
INSERT INTO `user_work` VALUES ('18', '571', '2017', '42');
INSERT INTO `user_work` VALUES ('13', '572', '2017', '43');
INSERT INTO `user_work` VALUES ('13', '572', '2017', '44');
INSERT INTO `user_work` VALUES ('25', '573', '2017', '42');
INSERT INTO `user_work` VALUES ('25', '573', '2017', '43');
INSERT INTO `user_work` VALUES ('16', '574', '2017', '42');
INSERT INTO `user_work` VALUES ('16', '574', '2017', '43');
INSERT INTO `user_work` VALUES ('16', '575', '2017', '42');
INSERT INTO `user_work` VALUES ('16', '575', '2017', '43');
INSERT INTO `user_work` VALUES ('16', '576', '2017', '42');
INSERT INTO `user_work` VALUES ('15', '577', '2017', '43');
INSERT INTO `user_work` VALUES ('15', '577', '2017', '44');
INSERT INTO `user_work` VALUES ('15', '577', '2017', '45');
INSERT INTO `user_work` VALUES ('20', '578', '2017', '42');
INSERT INTO `user_work` VALUES ('20', '578', '2017', '43');
INSERT INTO `user_work` VALUES ('20', '580', '2017', '43');
INSERT INTO `user_work` VALUES ('15', '581', '2017', '42');
INSERT INTO `user_work` VALUES ('15', '581', '2017', '43');
INSERT INTO `user_work` VALUES ('15', '581', '2017', '44');
INSERT INTO `user_work` VALUES ('10', '582', '2017', '43');
INSERT INTO `user_work` VALUES ('15', '583', '2017', '42');
INSERT INTO `user_work` VALUES ('15', '583', '2017', '43');
INSERT INTO `user_work` VALUES ('15', '583', '2017', '44');
INSERT INTO `user_work` VALUES ('15', '584', '2017', '42');
INSERT INTO `user_work` VALUES ('25', '585', '2017', '42');
INSERT INTO `user_work` VALUES ('25', '585', '2017', '43');
INSERT INTO `user_work` VALUES ('12', '586', '2017', '42');
INSERT INTO `user_work` VALUES ('12', '586', '2017', '43');
INSERT INTO `user_work` VALUES ('12', '586', '2017', '44');
INSERT INTO `user_work` VALUES ('12', '586', '2017', '45');
INSERT INTO `user_work` VALUES ('8', '587', '2017', '42');
INSERT INTO `user_work` VALUES ('8', '588', '2017', '42');
INSERT INTO `user_work` VALUES ('8', '589', '2017', '42');
INSERT INTO `user_work` VALUES ('5', '590', '2017', '42');
INSERT INTO `user_work` VALUES ('5', '590', '2017', '43');
INSERT INTO `user_work` VALUES ('17', '591', '2017', '42');
INSERT INTO `user_work` VALUES ('4', '592', '2017', '42');
INSERT INTO `user_work` VALUES ('23', '593', '2017', '42');
INSERT INTO `user_work` VALUES ('23', '594', '2017', '42');
INSERT INTO `user_work` VALUES ('17', '595', '2017', '42');
INSERT INTO `user_work` VALUES ('23', '596', '2017', '42');
INSERT INTO `user_work` VALUES ('23', '597', '2017', '42');
INSERT INTO `user_work` VALUES ('23', '597', '2017', '43');
INSERT INTO `user_work` VALUES ('17', '598', '2017', '42');
INSERT INTO `user_work` VALUES ('23', '599', '2017', '42');
INSERT INTO `user_work` VALUES ('23', '599', '2017', '43');
INSERT INTO `user_work` VALUES ('17', '600', '2017', '42');
INSERT INTO `user_work` VALUES ('4', '601', '2017', '42');
INSERT INTO `user_work` VALUES ('4', '601', '2017', '43');
INSERT INTO `user_work` VALUES ('4', '601', '2017', '44');
INSERT INTO `user_work` VALUES ('4', '601', '2017', '45');
INSERT INTO `user_work` VALUES ('23', '602', '2017', '42');
INSERT INTO `user_work` VALUES ('23', '602', '2017', '43');
INSERT INTO `user_work` VALUES ('23', '602', '2017', '44');
INSERT INTO `user_work` VALUES ('23', '602', '2017', '45');
INSERT INTO `user_work` VALUES ('17', '603', '2017', '42');
INSERT INTO `user_work` VALUES ('4', '604', '2017', '43');
INSERT INTO `user_work` VALUES ('4', '604', '2017', '44');
INSERT INTO `user_work` VALUES ('4', '604', '2017', '45');
INSERT INTO `user_work` VALUES ('17', '605', '2017', '42');
INSERT INTO `user_work` VALUES ('23', '606', '2017', '43');
INSERT INTO `user_work` VALUES ('23', '606', '2017', '44');
INSERT INTO `user_work` VALUES ('23', '606', '2017', '45');
INSERT INTO `user_work` VALUES ('4', '607', '2017', '43');
INSERT INTO `user_work` VALUES ('4', '607', '2017', '44');
INSERT INTO `user_work` VALUES ('4', '607', '2017', '45');
INSERT INTO `user_work` VALUES ('17', '608', '2017', '42');
INSERT INTO `user_work` VALUES ('4', '609', '2017', '43');
INSERT INTO `user_work` VALUES ('4', '609', '2017', '44');
INSERT INTO `user_work` VALUES ('4', '609', '2017', '45');
INSERT INTO `user_work` VALUES ('4', '610', '2017', '42');
INSERT INTO `user_work` VALUES ('26', '612', '2017', '42');
INSERT INTO `user_work` VALUES ('26', '612', '2017', '43');
INSERT INTO `user_work` VALUES ('26', '613', '2017', '43');
INSERT INTO `user_work` VALUES ('26', '613', '2017', '44');
INSERT INTO `user_work` VALUES ('26', '613', '2017', '45');
INSERT INTO `user_work` VALUES ('26', '614', '2017', '43');
INSERT INTO `user_work` VALUES ('26', '615', '2017', '43');
INSERT INTO `user_work` VALUES ('26', '615', '2017', '44');
INSERT INTO `user_work` VALUES ('26', '615', '2017', '45');
INSERT INTO `user_work` VALUES ('5', '616', '2017', '43');
INSERT INTO `user_work` VALUES ('5', '626', '2017', '43');
INSERT INTO `user_work` VALUES ('5', '627', '2017', '43');
INSERT INTO `user_work` VALUES ('5', '628', '2017', '43');
INSERT INTO `user_work` VALUES ('5', '628', '2017', '44');
INSERT INTO `user_work` VALUES ('5', '628', '2017', '45');
INSERT INTO `user_work` VALUES ('3', '631', '2017', '43');
INSERT INTO `user_work` VALUES ('3', '631', '2017', '44');
INSERT INTO `user_work` VALUES ('3', '631', '2017', '45');
INSERT INTO `user_work` VALUES ('3', '632', '2017', '43');
INSERT INTO `user_work` VALUES ('9', '634', '2017', '43');
INSERT INTO `user_work` VALUES ('9', '635', '2017', '43');
INSERT INTO `user_work` VALUES ('9', '636', '2017', '43');
INSERT INTO `user_work` VALUES ('9', '636', '2017', '44');
INSERT INTO `user_work` VALUES ('9', '636', '2017', '45');
INSERT INTO `user_work` VALUES ('9', '637', '2017', '43');
INSERT INTO `user_work` VALUES ('9', '637', '2017', '44');
INSERT INTO `user_work` VALUES ('9', '637', '2017', '45');
INSERT INTO `user_work` VALUES ('9', '638', '2017', '43');
INSERT INTO `user_work` VALUES ('9', '638', '2017', '44');
INSERT INTO `user_work` VALUES ('9', '638', '2017', '45');
INSERT INTO `user_work` VALUES ('16', '639', '2017', '43');
INSERT INTO `user_work` VALUES ('16', '639', '2017', '44');
INSERT INTO `user_work` VALUES ('16', '640', '2017', '43');
INSERT INTO `user_work` VALUES ('16', '640', '2017', '44');
INSERT INTO `user_work` VALUES ('16', '640', '2017', '45');
INSERT INTO `user_work` VALUES ('24', '641', '2017', '43');
INSERT INTO `user_work` VALUES ('24', '641', '2017', '44');
INSERT INTO `user_work` VALUES ('24', '642', '2017', '43');
INSERT INTO `user_work` VALUES ('24', '642', '2017', '44');
INSERT INTO `user_work` VALUES ('24', '642', '2017', '45');
INSERT INTO `user_work` VALUES ('24', '643', '2017', '43');
INSERT INTO `user_work` VALUES ('24', '643', '2017', '44');
INSERT INTO `user_work` VALUES ('19', '644', '2017', '42');
INSERT INTO `user_work` VALUES ('19', '644', '2017', '43');
INSERT INTO `user_work` VALUES ('19', '644', '2017', '44');
INSERT INTO `user_work` VALUES ('24', '645', '2017', '43');
INSERT INTO `user_work` VALUES ('24', '645', '2017', '44');
INSERT INTO `user_work` VALUES ('24', '645', '2017', '45');
INSERT INTO `user_work` VALUES ('19', '646', '2017', '43');
INSERT INTO `user_work` VALUES ('19', '647', '2017', '44');
INSERT INTO `user_work` VALUES ('27', '648', '2017', '43');
INSERT INTO `user_work` VALUES ('27', '648', '2017', '44');
INSERT INTO `user_work` VALUES ('27', '648', '2017', '45');
INSERT INTO `user_work` VALUES ('27', '649', '2017', '43');
INSERT INTO `user_work` VALUES ('27', '649', '2017', '44');
INSERT INTO `user_work` VALUES ('27', '650', '2017', '43');
INSERT INTO `user_work` VALUES ('27', '650', '2017', '44');
INSERT INTO `user_work` VALUES ('27', '650', '2017', '45');
INSERT INTO `user_work` VALUES ('28', '651', '2017', '43');
INSERT INTO `user_work` VALUES ('28', '652', '2017', '43');
INSERT INTO `user_work` VALUES ('10', '653', '2017', '44');
INSERT INTO `user_work` VALUES ('10', '653', '2017', '45');
INSERT INTO `user_work` VALUES ('4', '654', '2017', '43');
INSERT INTO `user_work` VALUES ('4', '654', '2017', '44');
INSERT INTO `user_work` VALUES ('4', '654', '2017', '45');
INSERT INTO `user_work` VALUES ('28', '655', '2017', '43');
INSERT INTO `user_work` VALUES ('4', '656', '2017', '43');
INSERT INTO `user_work` VALUES ('4', '656', '2017', '44');
INSERT INTO `user_work` VALUES ('4', '656', '2017', '45');
INSERT INTO `user_work` VALUES ('4', '657', '2017', '43');
INSERT INTO `user_work` VALUES ('4', '657', '2017', '44');
INSERT INTO `user_work` VALUES ('4', '657', '2017', '45');
INSERT INTO `user_work` VALUES ('28', '658', '2017', '44');
INSERT INTO `user_work` VALUES ('28', '658', '2017', '45');
INSERT INTO `user_work` VALUES ('18', '659', '2017', '43');
INSERT INTO `user_work` VALUES ('18', '662', '2017', '43');
INSERT INTO `user_work` VALUES ('18', '662', '2017', '44');
INSERT INTO `user_work` VALUES ('11', '663', '2017', '44');
INSERT INTO `user_work` VALUES ('11', '664', '2017', '43');
INSERT INTO `user_work` VALUES ('11', '664', '2017', '44');
INSERT INTO `user_work` VALUES ('16', '665', '2017', '43');
INSERT INTO `user_work` VALUES ('15', '666', '2017', '44');
INSERT INTO `user_work` VALUES ('15', '666', '2017', '45');
INSERT INTO `user_work` VALUES ('6', '667', '2017', '43');
INSERT INTO `user_work` VALUES ('6', '667', '2017', '44');
INSERT INTO `user_work` VALUES ('6', '667', '2017', '45');
INSERT INTO `user_work` VALUES ('18', '668', '2017', '43');
INSERT INTO `user_work` VALUES ('18', '668', '2017', '44');
INSERT INTO `user_work` VALUES ('28', '669', '2017', '43');
INSERT INTO `user_work` VALUES ('28', '669', '2017', '44');
INSERT INTO `user_work` VALUES ('20', '670', '2017', '43');
INSERT INTO `user_work` VALUES ('20', '672', '2017', '44');
INSERT INTO `user_work` VALUES ('20', '673', '2017', '44');
INSERT INTO `user_work` VALUES ('17', '675', '2017', '43');
INSERT INTO `user_work` VALUES ('17', '675', '2017', '44');
INSERT INTO `user_work` VALUES ('17', '676', '2017', '43');
INSERT INTO `user_work` VALUES ('17', '676', '2017', '44');
INSERT INTO `user_work` VALUES ('17', '676', '2017', '45');
INSERT INTO `user_work` VALUES ('5', '677', '2017', '43');
INSERT INTO `user_work` VALUES ('5', '677', '2017', '44');
INSERT INTO `user_work` VALUES ('5', '677', '2017', '45');
INSERT INTO `user_work` VALUES ('5', '678', '2017', '43');
INSERT INTO `user_work` VALUES ('5', '678', '2017', '44');
INSERT INTO `user_work` VALUES ('5', '678', '2017', '45');
INSERT INTO `user_work` VALUES ('8', '679', '2017', '43');
INSERT INTO `user_work` VALUES ('8', '680', '2017', '43');
INSERT INTO `user_work` VALUES ('16', '681', '2017', '43');
INSERT INTO `user_work` VALUES ('7', '683', '2017', '44');
INSERT INTO `user_work` VALUES ('7', '684', '2017', '44');
INSERT INTO `user_work` VALUES ('3', '685', '2017', '44');
INSERT INTO `user_work` VALUES ('3', '686', '2017', '44');
INSERT INTO `user_work` VALUES ('3', '686', '2017', '45');
INSERT INTO `user_work` VALUES ('5', '687', '2017', '44');
INSERT INTO `user_work` VALUES ('7', '688', '2017', '44');
INSERT INTO `user_work` VALUES ('9', '691', '2017', '44');
INSERT INTO `user_work` VALUES ('9', '691', '2017', '45');
INSERT INTO `user_work` VALUES ('9', '692', '2017', '44');
INSERT INTO `user_work` VALUES ('9', '693', '2017', '44');
INSERT INTO `user_work` VALUES ('9', '694', '2017', '44');
INSERT INTO `user_work` VALUES ('9', '694', '2017', '45');
INSERT INTO `user_work` VALUES ('13', '695', '2017', '44');
INSERT INTO `user_work` VALUES ('13', '696', '2017', '44');
INSERT INTO `user_work` VALUES ('13', '697', '2017', '44');
INSERT INTO `user_work` VALUES ('13', '697', '2017', '45');
INSERT INTO `user_work` VALUES ('27', '698', '2017', '44');
INSERT INTO `user_work` VALUES ('27', '698', '2017', '45');
INSERT INTO `user_work` VALUES ('18', '699', '2017', '44');
INSERT INTO `user_work` VALUES ('18', '700', '2017', '44');
INSERT INTO `user_work` VALUES ('16', '701', '2017', '44');
INSERT INTO `user_work` VALUES ('20', '702', '2017', '44');
INSERT INTO `user_work` VALUES ('20', '703', '2017', '44');
INSERT INTO `user_work` VALUES ('20', '704', '2017', '45');
INSERT INTO `user_work` VALUES ('20', '705', '2017', '45');
INSERT INTO `user_work` VALUES ('18', '706', '2017', '44');
INSERT INTO `user_work` VALUES ('18', '706', '2017', '45');
INSERT INTO `user_work` VALUES ('19', '707', '2017', '45');
INSERT INTO `user_work` VALUES ('19', '708', '2017', '44');
INSERT INTO `user_work` VALUES ('19', '709', '2017', '45');
INSERT INTO `user_work` VALUES ('28', '710', '2017', '44');
INSERT INTO `user_work` VALUES ('28', '710', '2017', '45');
INSERT INTO `user_work` VALUES ('15', '711', '2017', '44');
INSERT INTO `user_work` VALUES ('15', '712', '2017', '44');
INSERT INTO `user_work` VALUES ('15', '712', '2017', '45');
INSERT INTO `user_work` VALUES ('15', '713', '2017', '44');
INSERT INTO `user_work` VALUES ('15', '713', '2017', '45');
INSERT INTO `user_work` VALUES ('25', '714', '2017', '44');
INSERT INTO `user_work` VALUES ('25', '714', '2017', '45');
INSERT INTO `user_work` VALUES ('25', '715', '2017', '44');
INSERT INTO `user_work` VALUES ('25', '715', '2017', '45');
INSERT INTO `user_work` VALUES ('11', '716', '2017', '44');
INSERT INTO `user_work` VALUES ('11', '717', '2017', '44');
INSERT INTO `user_work` VALUES ('11', '718', '2017', '45');
INSERT INTO `user_work` VALUES ('11', '719', '2017', '45');
INSERT INTO `user_work` VALUES ('12', '720', '2017', '44');
INSERT INTO `user_work` VALUES ('12', '720', '2017', '45');
INSERT INTO `user_work` VALUES ('17', '721', '2017', '44');
INSERT INTO `user_work` VALUES ('17', '722', '2017', '44');
INSERT INTO `user_work` VALUES ('17', '722', '2017', '45');
INSERT INTO `user_work` VALUES ('17', '723', '2017', '44');
INSERT INTO `user_work` VALUES ('17', '723', '2017', '45');
INSERT INTO `user_work` VALUES ('17', '724', '2017', '44');
INSERT INTO `user_work` VALUES ('17', '724', '2017', '45');
INSERT INTO `user_work` VALUES ('17', '725', '2017', '44');
INSERT INTO `user_work` VALUES ('17', '725', '2017', '45');
INSERT INTO `user_work` VALUES ('24', '726', '2017', '44');
INSERT INTO `user_work` VALUES ('24', '726', '2017', '45');
INSERT INTO `user_work` VALUES ('24', '727', '2017', '44');
INSERT INTO `user_work` VALUES ('23', '728', '2017', '44');
INSERT INTO `user_work` VALUES ('23', '729', '2017', '44');
INSERT INTO `user_work` VALUES ('23', '729', '2017', '45');
INSERT INTO `user_work` VALUES ('5', '730', '2017', '44');
INSERT INTO `user_work` VALUES ('5', '731', '2017', '44');
INSERT INTO `user_work` VALUES ('5', '732', '2017', '44');
INSERT INTO `user_work` VALUES ('5', '732', '2017', '45');
INSERT INTO `user_work` VALUES ('5', '733', '2017', '44');
INSERT INTO `user_work` VALUES ('5', '734', '2017', '44');
INSERT INTO `user_work` VALUES ('10', '735', '2017', '44');
INSERT INTO `user_work` VALUES ('10', '736', '2017', '44');
INSERT INTO `user_work` VALUES ('10', '737', '2017', '44');
INSERT INTO `user_work` VALUES ('10', '738', '2017', '44');
INSERT INTO `user_work` VALUES ('8', '739', '2017', '44');
INSERT INTO `user_work` VALUES ('8', '740', '2017', '44');
INSERT INTO `user_work` VALUES ('8', '741', '2017', '44');
INSERT INTO `user_work` VALUES ('8', '743', '2017', '44');
INSERT INTO `user_work` VALUES ('8', '743', '2017', '45');
INSERT INTO `user_work` VALUES ('4', '744', '2017', '44');
INSERT INTO `user_work` VALUES ('4', '745', '2017', '44');
INSERT INTO `user_work` VALUES ('6', '746', '2017', '44');
INSERT INTO `user_work` VALUES ('6', '747', '2017', '44');
INSERT INTO `user_work` VALUES ('6', '748', '2017', '45');
INSERT INTO `user_work` VALUES ('30', '749', '2017', '42');
INSERT INTO `user_work` VALUES ('30', '751', '2017', '44');

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
) ENGINE=InnoDB AUTO_INCREMENT=752 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of work_detail
-- ----------------------------
INSERT INTO `work_detail` VALUES ('12', '股票质押约定购回', '', '业务需求', '7814', '关于增加项目编号筛选项等股票质押管理系统需求', '开发', '90', '2017-09-18', '1', '20170921', '20170921', '20170919', '');
INSERT INTO `work_detail` VALUES ('62', '清算录入', '', '业务需求', '8049', '港股通分拆合并QTSL对账相关清算录入修改', '开发', '100', '2017-09-19', '0', '20170921', '20170919', '20170919', '');
INSERT INTO `work_detail` VALUES ('63', '集中交易系统', '', '内部优化', '6175', 'LoadFrozenSecCode没必要重新查询一遍KS.SEC_CODE降低交收过账的性能，参考RelativeAdd的加载模式，在函数CSEC_CODE::Load(char *pMsg)中可以根据判断市场为1、证券类别为0A、冻结代码不为空的情况下直接加载。', '开发', '100', '2017-09-20', '0', '20170921', '20170920', '20170920', '');
INSERT INTO `work_detail` VALUES ('106', '集中交易系统', '', '监管需求', '8084', '投资者确认书，记录的非交易流水中复核职工是空,修改了。提交了', '开发', '100', '2017-09-18', '0', '20170921', '20170918', '20170918', '');
INSERT INTO `work_detail` VALUES ('107', '融资融券交易', '', '业务需求', '7857', '#转融券融入委托-名称问题，修改了txcode，输出名称.，  提交了', '开发', '100', '2017-09-18', '0', '20170921', '20170918', '20170918', '');
INSERT INTO `work_detail` VALUES ('108', '融资融券交易', '', '业务需求', '8137', '-中登流水查询 少了翻译，修改规带代码， 提交了', '开发', '100', '2017-09-18', '0', '20170921', '20170918', '20170918', '');
INSERT INTO `work_detail` VALUES ('109', '集中交易系统', '', '业务需求', '5995', '集中交易柜台“风险评测信息导入。 这个问题，确认后修改。\n这个问题，请帮忙 需要找潘超确认？ \n1：如果出现 市场为0的情况，在插入KS.SEC_EVALUATE_INFO数据 和 记录流水 时，需要市场这个字段。\n2：解决办法看是否可行？\n    基金信息表里面的代码，是不是走存在于 SEC_CODE里面？ 如果是的话，用里面的市场？\n', '开发', '50', '2017-09-18', '3', '20170921', '20170921', '20170921', '');
INSERT INTO `work_detail` VALUES ('112', '集中交易系统', '', '业务需求', '7763', '银行扩容，需求文档了解，准备开发柜台的修改', '开发', '10', '2017-09-18', '5', '20170921', '20170921', '20170925', '');
INSERT INTO `work_detail` VALUES ('113', '集中交易系统', '', '在线问题', '7763', '配合工作  查找柜台代码逻辑等。', '开发', '80', '2017-09-18', '0', '20170921', '20170918', '20170918', '');
INSERT INTO `work_detail` VALUES ('114', '融资融券交易', '', '业务需求', '6616', '仓单展期的需求\n', '开发', '10', '2017-09-25', '5', '20170921', '20170921', '20171009', '');
INSERT INTO `work_detail` VALUES ('115', '集中交易系统', '', '业务需求', '5995', '集中交易柜台“风险评测信息导入”菜单，通过投资品种评测信息导入场外基金产品信息时，对于市场为0的记录，处理为市场是空值传到集中交易系统后台\n\n完毕，提交了', '开发', '100', '2017-09-25', '0', '20170921', '20170925', '20170925', '');
INSERT INTO `work_detail` VALUES ('116', '集中交易系统', '', '业务需求', '8333', '集中交易、融资融券－银行信息扩容及优化接口\n\n进行中，本周开发 三方存管客户开销户，银行账户开户  ，三方存管强制开户等，', '开发', '20', '2017-09-25', '5', '20170921', '20170928', '20171009', '');
INSERT INTO `work_detail` VALUES ('117', '股票质押约定购回', '', '业务需求', '7706', '关于股票质押交易协议书字段位置格式调整的需求', '开发', '90', '2017-09-18', '1', '20170921', '20170921', '20170919', '');
INSERT INTO `work_detail` VALUES ('118', '集中交易系统', '', '业务需求', '7895', '中登流水查询增加翻译', '开发', '100', '2017-09-18', '0', '20170921', '20170918', '20170918', '');
INSERT INTO `work_detail` VALUES ('119', '融资融券交易', '', '业务需求', '8000', '中登流水查询增加翻译', '开发', '100', '2017-09-18', '0', '20170921', '20170918', '20170918', '');
INSERT INTO `work_detail` VALUES ('120', '集中交易系统', '', '业务需求', '7898', '大宗交易减持信息查询不应该查询挂账账户', '开发', '100', '2017-09-18', '0', '20170921', '20170918', '20170918', '');
INSERT INTO `work_detail` VALUES ('122', '融资融券交易', '', '业务需求', '7999', '大宗交易减持信息查询不应该查询挂账账户', '开发', '100', '2017-09-18', '0', '20170921', '20170918', '20170918', '');
INSERT INTO `work_detail` VALUES ('123', '集中交易系统', '', '业务需求', '7362', '集中交易折算率调整标准券临时冻结解冻功能按实际面值计算修改', '测试沟通', '90', '2017-09-18', '1', '20170921', '20170921', '20170919', '');
INSERT INTO `work_detail` VALUES ('124', '集中交易系统', '', '业务需求', '7847', 'SPX-669功能功能同步支持可转债', '开发', '100', '2017-09-18', '0', '20170921', '20170918', '20170918', '');
INSERT INTO `work_detail` VALUES ('125', '融资融券交易', '', '业务需求', '7848', 'SPX-669功能功能同步支持可转债', '开发', '90', '2017-09-18', '0.5', '20170921', '20170921', '20170919', '');
INSERT INTO `work_detail` VALUES ('126', '集中交易系统', '', '业务需求', '8059', '修正批前检查B转H对账不平问题', '开发', '100', '2017-09-18', '0', '20170921', '20170918', '20170918', '');
INSERT INTO `work_detail` VALUES ('127', '集中交易', '', '业务需求', '7341', '集中交易清算录入支持RZCX文件录入“股票质押余额”数据', '开发', '0', '2017-09-25', '2', '20170921', '20170928', '20170927', '');
INSERT INTO `work_detail` VALUES ('128', '股票质押约定购回', '', '业务需求', '需求 #1132', '在约定购回、股票质押交易协议书议价菜单中增加初始交易佣金、购回交易佣金、部分购回佣金设置字段并支持对应委托\n需求有变动，部分功能进行了重新开放', '开发', '100', '2017-09-11', '0', '20170921', '20170911', '20170911', '');
INSERT INTO `work_detail` VALUES ('129', '集中交易系统', '', '业务需求', '2123', '核对中登数据字典一致性文档与更新数据脚本差异，调试集中交易测试环境，运行实施脚本，测试系统', '单元测试', '50', '2017-09-19', '3', '20170921', '20170921', '20170922', '');
INSERT INTO `work_detail` VALUES ('130', '股票质押约定购回', '', '业务需求', '1132', '在约定购回、股票质押交易协议书议价菜单中增加初始交易佣金、购回交易佣金、部分购回佣金设置字段并支持对应委托\n需求变更，部分功能进行了重新开发', '开发', '100', '2017-09-11', '0', '20170921', '20170911', '20170911', '需求变更，部分功能进行了重新开发');
INSERT INTO `work_detail` VALUES ('131', '股票质押约定购回', '', '业务需求', '1132', '在约定购回、股票质押交易协议书议价菜单中增加初始交易佣金、购回交易佣金、部分购回佣金设置字段并支持对应委托\n需求变更，部分功能进行了重新开发', '开发', '100', '2017-09-11', '0', '20170921', '20170911', '20170911', '需求变更，部分功能进行了重新开发');
INSERT INTO `work_detail` VALUES ('132', '融出资金债权', '', '业务需求', '7361	', '明确压力测试内容，准备升级上线文档，模拟ABS回购了结过程，讨论性能应急方案。', '测试沟通', '70', '2017-08-07', '40', '20170921', '20170921', '20171009', '');
INSERT INTO `work_detail` VALUES ('133', '融资融券交易', '', '项目管理', '5837', 'Git版本管理、主线合并升级、同事问题协助处理', '测试沟通', '70', '2017-09-18', '10', '20170921', '20170921', '20171009', '');
INSERT INTO `work_detail` VALUES ('134', '集中交易系统', '', '业务需求', '7558', '清算日志查询菜单功能优化', '测试沟通', '100', '2017-09-18', '0', '20170921', '20170918', '20170918', '');
INSERT INTO `work_detail` VALUES ('136', '集中交易系统', '', '业务需求', '需求8316', '飞马极速相关修改', '复读', '100', '2017-09-25', '0', '20170921', '20170925', '20170925', '已复读');
INSERT INTO `work_detail` VALUES ('137', '集中交易系统', '', '在线问题', '#8216', '网上交易客户端显示竞价最大可卖计算错误，经过定位，发现是由于客户端查询的是持仓，而不是竞价可卖。', '问题排查', '100', '2017-09-18', '0', '20170921', '20170918', '20170918', '');
INSERT INTO `work_detail` VALUES ('138', '集中交易系统', '', '业务需求', '需求8315', '债券质押式回购风控模板配置表柜台设置支持同步至VIP系统', '单元测试', '100', '2017-09-25', '0', '20170921', '20170925', '20170925', '已复读并测试通过，待合并。');
INSERT INTO `work_detail` VALUES ('139', '集中交易系统', '', '项目管理', '需求 #1245', '广发银行产品代销联调测试', '测试沟通', '70', '2017-09-18', '1.5', '20170921', '20170921', '20170920', '');
INSERT INTO `work_detail` VALUES ('140', '融资融券交易', '', '在线问题', '#8215', '生产上发现仓单到期警示属性在展期之后没有被取消，经分析是由于周末上线时改为shell脚本执行的步骤没有赋权导致', '问题排查', '100', '2017-09-19', '0', '20170921', '20170919', '20170919', '');
INSERT INTO `work_detail` VALUES ('141', '集中交易系统', '', '业务需求', '需求8037', '上交所启用地方债券业务相关代码段', '单元测试', '90', '2017-09-25', '0', '20170921', '20170925', '20170925', '已复读并验证，待合并。');
INSERT INTO `work_detail` VALUES ('142', '集中交易系统', '', '业务需求', '#7988', '网上交易大宗减持承诺书需求沟通', '需求确认', '30', '2017-09-18', '3', '20170921', '20170921', '20170921', '');
INSERT INTO `work_detail` VALUES ('143', '融资融券交易', '', '业务需求', '#4105', '仓单展期权限外围开发支持及融资融券网厅开户联调支持', '需求确认', '50', '2017-09-20', '5', '20170921', '20170921', '20170927', '');
INSERT INTO `work_detail` VALUES ('144', '集中交易系统', '', '在线问题', '需求 #7583', '修改代码以修复问题：客户2600205946在8月16日确权数据柜台未处理', '开发', '90', '2017-09-18', '0.5', '20170921', '20170921', '20170919', '');
INSERT INTO `work_detail` VALUES ('145', '融出资金债权', '', '业务需求', '7361', '明确压力测试内容，测试模拟产品了结过程，讨论应急方案，准备上线文档', '测试沟通', '70', '2017-09-18', '40', '20170921', '20170921', '20171120', '');
INSERT INTO `work_detail` VALUES ('146', '集中交易系统', '', '业务需求', '任务 #7930', '深港通SZHK_QTSL中分拆合并临时代码可用额度对账逻辑', '开发', '60', '2017-09-18', '3', '20170921', '20170921', '20170921', '');
INSERT INTO `work_detail` VALUES ('147', '集中交易系统', '', '业务需求', '需求 #7708', '修改代码以修复问题：投保A08文件因连续性校验逻辑处理导致记录异常', '开发', '90', '2017-09-18', '0.5', '20170921', '20170921', '20170919', '');
INSERT INTO `work_detail` VALUES ('148', '融出资金债权', '', '在线问题', '7886', '根据扫描内容分析问题，', '问题排查', '30', '2017-09-20', '20', '20170921', '20170921', '20171025', '');
INSERT INTO `work_detail` VALUES ('149', '集中交易系统', '', '在线问题', '问题单 #8090', '修改代码以修复问题：开放式基金“终止定投”操作失败，因为“基金账户非交易状态”', '开发', '10', '2017-09-19', '3', '20170921', '20170921', '20170922', '');
INSERT INTO `work_detail` VALUES ('152', '集中交易系统', '', '业务需求', '2123', '测试并调试系统，查看前台数据是否符合预期。对比初始化全量数据插入脚本，核对数据是否正确。生成测试小结。', '单元测试', '100', '2017-09-25', '2', '20170921', '20170928', '20170927', '');
INSERT INTO `work_detail` VALUES ('154', '集中交易系统', '', '业务需求', '问题单 #8090', '修改代码以修复问题：开放式基金“终止定投”操作失败，因为“基金账户非交易状态”', '开发', '10', '2017-09-25', '3', '20170921', '20170928', '20170928', '');
INSERT INTO `work_detail` VALUES ('155', '集中交易系统', '', '业务需求', '需求 #038439', '关于基金定投业务系统改造需求的协作', '开发', '0', '2017-09-25', '5', '20170921', '20170921', '20171009', '');
INSERT INTO `work_detail` VALUES ('156', '融出资金债权', '', '项目管理', '7361', '测试并查看邮件模块实施进度及内容，明确升级时间表，对应急方案进行细化，跟踪上线流程，细化升级实施过程。', '进度跟踪', '80', '2017-09-25', '30', '20170921', '20170928', '20171113', '');
INSERT INTO `work_detail` VALUES ('157', '融资融券交易', '', '在线问题', '#7850', '修复460外围签约 证书类型错误可签约成功的问题', '开发', '100', '2017-09-18', '0', '20170921', '20170918', '20170918', '');
INSERT INTO `work_detail` VALUES ('158', '融资融券交易', '', '在线问题', '7858', '解决 投资者确认书，记录的非交易流水中复核职工是空的问题', '问题排查', '100', '2017-09-18', '0', '20170921', '20170918', '20170918', '');
INSERT INTO `work_detail` VALUES ('159', '融资融券交易', '', '在线问题', '7893', '资管O32系统融资融券spx网关白名单控制失效：与外高桥核对版本，问题复现', '问题排查', '90', '2017-09-18', '0.5', '20170921', '20170921', '20170919', '');
INSERT INTO `work_detail` VALUES ('160', '股票质押约定购回', '', '业务需求', '需求 #6396', '关于修改股票质押、约定购回黑名单控制逻辑的需求\n', '开发', '100', '2017-09-12', '0', '20170921', '20170912', '20170912', '');
INSERT INTO `work_detail` VALUES ('161', '集中交易系统', '', '业务需求', '7760', '银行信息扩容：设计文件完成评审，并进行开发工作', '设计', '100', '2017-09-14', '0', '20170921', '20170914', '20170914', '');
INSERT INTO `work_detail` VALUES ('162', '股票质押约定购回', '', '业务需求', 'Bug #8336', '交易协议书网上执行时，高管可用额度未根据杂项4240来判断是否转移', '开发', '80', '2017-09-21', '1', '20170921', '20170921', '20170922', '');
INSERT INTO `work_detail` VALUES ('163', '股票质押约定购回', '', '业务需求', '需求 #6396', '关于修改股票质押、约定购回黑名单控制逻辑的需求\n', '开发', '100', '2017-09-12', '0', '20170921', '20170912', '20170912', '');
INSERT INTO `work_detail` VALUES ('164', '集中交易系统', '', '业务需求', '7769', '银行信息扩容：完成设计文档评审并进行开发', '设计', '100', '2017-09-14', '0', '20170921', '20170914', '20170914', '');
INSERT INTO `work_detail` VALUES ('165', '股票质押约定购回', '', '业务需求', '需求 #6396', '关于修改股票质押、约定购回黑名单控制逻辑的需求\n', '开发', '100', '2017-09-12', '0', '20170921', '20170912', '20170912', '');
INSERT INTO `work_detail` VALUES ('166', '股票质押约定购回', '', '业务需求', '需求 #6396', '关于修改股票质押、约定购回黑名单控制逻辑的需求\n', '开发', '100', '2017-09-12', '0', '20170921', '20170912', '20170912', '');
INSERT INTO `work_detail` VALUES ('167', '股票质押约定购回', '', '内部优化', '需求 #6817', '修改PSR、bbs库代码中的历史遗留问题，使数据库支持兼容级别100\n', '开发', '50', '2017-08-31', '3', '20170921', '20170921', '20170905', '');
INSERT INTO `work_detail` VALUES ('168', '股票质押约定购回', '', '内部优化', '需求 #6817', '修改PSR、bbs库代码中的历史遗留问题，使数据库支持兼容级别100\n', '开发', '50', '2017-08-31', '3', '20170921', '20170921', '20170905', '');
INSERT INTO `work_detail` VALUES ('169', '股票质押约定购回', '', '业务需求', '需求 #6817', '关于修改股票质押、约定购回黑名单控制逻辑的需求\n', '开发', '100', '2017-09-12', '0', '20170921', '20170912', '20170912', '');
INSERT INTO `work_detail` VALUES ('170', '集中交易系统', '', '项目管理', 'NULL', 'v5.0.2.6-h1专题包复读', '复读', '100', '2017-09-18', '0', '20170921', '20170918', '20170918', '完成v5.0.2.6-h1复读问题单，安排相关人员完成修改');
INSERT INTO `work_detail` VALUES ('171', '集中交易系统', '', '业务需求', '7976', '集中交易柜台->创业板投资者适当性管理：进行中登申报时报“证券账户号码不存在与证券账户类别不匹配”的问题', '问题排查', '100', '2017-09-25', '1', '20170921', '20170929', '20170926', '经排查，只需要修改前端，已经转给张修兴');
INSERT INTO `work_detail` VALUES ('172', '集中交易系统', '', '在线问题', '6205', 'B股指定席位与申报席位不一致的客户无法进行投票类综合业务', '问题排查', '0', '2017-09-25', '1', '20170921', '20170929', '20170926', '方案待定中');
INSERT INTO `work_detail` VALUES ('173', '集中交易系统', '', '业务需求', '7948', '中登账户前置机pack.cfg中对于机构类别转换错误（应该为72-》31）', '开发', '100', '2017-09-25', '0', '20170921', '20170925', '20170925', '已经修改，git还没有开专题包，故没有提交');
INSERT INTO `work_detail` VALUES ('174', '集中交易系统', '', '业务需求', '7760', '银行信息扩容：完成设计评审，并进行开发', '开发', '60', '2017-09-18', '1', '20170921', '20170921', '20170919', '');
INSERT INTO `work_detail` VALUES ('176', '股票质押约定购回', '', '业务需求', '需求 #6396', '关于修改股票质押、约定购回黑名单控制逻辑的需求\n', '开发', '100', '2017-09-18', '0', '20170921', '20170918', '20170918', '');
INSERT INTO `work_detail` VALUES ('177', '股票质押约定购回', '', '内部优化', '需求 #1130', '修改PSR、bbs库代码中的历史遗留问题，使数据库支持兼容级别100\n', '开发', '50', '2017-09-18', '3', '20170921', '20170921', '20170921', '');
INSERT INTO `work_detail` VALUES ('178', '集中交易系统', '', '业务需求', '7762', '银行返回代码梳理：完成代码更改', '开发', '0', '2017-09-25', '0.5', '20170921', '20170921', '20170926', '');
INSERT INTO `work_detail` VALUES ('179', '集中交易系统', '', '业务需求', '8322', '三方存管手工冲正测试问题修正：完成场景梳理、代码开发、自测试', '问题排查', '0', '2017-09-25', '1.5', '20170921', '20170921', '20170927', '');
INSERT INTO `work_detail` VALUES ('180', '股票质押约定购回', '', '业务需求', '暂无', '大型DBF文件拆分工具', '开发', '50', '2017-09-18', '2', '20170921', '20170921', '20170920', '');
INSERT INTO `work_detail` VALUES ('181', '集中交易系统', '', '业务需求', '7760', '银行信息扩容：完成代码编写并进行自测试', '开发', '60', '2017-09-25', '1.5', '20170921', '20170921', '20170927', '');
INSERT INTO `work_detail` VALUES ('182', '信用管理', '管理系统', '内部优化', '需求 #6817', '修改PSR、bbs库代码中的历史遗留问题，使数据库支持兼容级别100\n', '开发', '50', '2017-09-25', '3', '20170921', '20170928', '20170928', '');
INSERT INTO `work_detail` VALUES ('183', '小工具', '', '业务需求', '需求 #8051', '关于超大DBF文件的处理方式', '开发', '100', '2017-09-25', '0', '20170921', '20170925', '20170925', '');
INSERT INTO `work_detail` VALUES ('184', '信用管理', '股票质押', '业务需求', '子需求 #8220', '优化交易协议书变更时提取履保、提取系数的计算方式', '开发', '100', '2017-09-25', '0', '20170921', '20170925', '20170925', '');
INSERT INTO `work_detail` VALUES ('185', '股票质押约定购回', '', '内部优化', '需求 #7345', '证金加密程序改为多线程，提升加密效率', '开发', '100', '2017-09-18', '0', '20170921', '20170918', '20170918', '');
INSERT INTO `work_detail` VALUES ('186', '股票质押约定购回', '', '内部优化', 'Bug #7775', '交易协议书履保监控时，履保比例精度不够，极端情况下会导致计算出的相关补仓金额数值不对', '复读', '100', '2017-09-20', '0', '20170921', '20170920', '20170920', '');
INSERT INTO `work_detail` VALUES ('187', '股票质押约定购回', '', '业务需求', '需求 #1130', '支持管理系统权益数据通过融资融券交易系统日终采集功能', '复读', '80', '2017-09-19', '1', '20170921', '20170921', '20170920', '');
INSERT INTO `work_detail` VALUES ('189', '股票质押约定购回', '', '业务需求', '需求 #7706', '关于股票质押交易协议书字段位置格式调整的需求', '复读', '100', '2017-09-21', '0', '20170921', '20170921', '20170921', '');
INSERT INTO `work_detail` VALUES ('191', '股票质押约定购回', '', '监管需求', '需求 #7602', '高管可用额度冻结方案设计', '整理文档', '20', '2017-09-18', '5', '20170921', '20170921', '20170925', '');
INSERT INTO `work_detail` VALUES ('192', '股票质押约定购回', '', '业务需求', '需求 #6396', '关于修改股票质押、约定购回黑名单控制逻辑的需求', '复读', '80', '2017-09-22', '1', '20170921', '20170921', '20170925', '');
INSERT INTO `work_detail` VALUES ('193', '股票质押约定购回', '', '业务需求', '需求 #6749', '新增菜单查询股票质押业T-1日，T-2日的履约保障比例', '复读', '80', '2017-09-22', '1', '20170921', '20170921', '20170925', '');
INSERT INTO `work_detail` VALUES ('194', '股票质押约定购回', '', '在线问题', 'BUG #8336', '网签交易协议书时未根据杂项4240控制高管可用额度是否转移', '问题排查', '100', '2017-09-21', '1', '20170921', '20170921', '20170922', '');
INSERT INTO `work_detail` VALUES ('195', '集中交易系统', '', '数据维护', '需求 #7602', '每日清算后处理高管可用额度冻结的脚本', '开发', '100', '2017-09-18', '0', '20170921', '20170918', '20170918', '');
INSERT INTO `work_detail` VALUES ('196', '股票质押约定购回', '', '业务需求', '子需求 #5748', '合并金仕达股票质押3.0.3大包', '开发', '0', '2017-09-25', '10', '20170921', '20170921', '20171016', '');
INSERT INTO `work_detail` VALUES ('197', '信用管理系统', '', '业务需求', '#7819', '分支机构反映，在查询证券标的变动时（调入调出担保品、融资标的、融券标的），很难直观地查询某只证券在何时进行的标的调整，因此希望开发一个标的调整流水菜单，来查询标的变动流水。具体需求如下：\n开发一个标的调整流水查询菜单，查询入口参数包括：市场、证券代码、调整日期开始时间、调整日期结束时间、调整来源（手工调整、系统自动调整）；查询结果包含但不限于：市场、证券代码、调整日期、调整来源（手工调整、系统自动调整）、调整内容、调整职工代码。', '开发', '100', '2017-09-18', '0', '20170921', '20170918', '20170918', '');
INSERT INTO `work_detail` VALUES ('202', '股票质押约定购回', '', '业务需求', '#1132', '股票质押 约定购回 指定佣金率\n需求变更部分功能进行了重新开放', '开发', '100', '2017-09-11', '0', '20170921', '20170911', '20170911', '');
INSERT INTO `work_detail` VALUES ('203', '人行征信', '', '业务需求', '7885', '黑盒扫描高风险修正', '进度跟踪', '20', '2017-09-18', '3', '20170921', '20170921', '20170921', '');
INSERT INTO `work_detail` VALUES ('204', '人行征信', '', '业务需求', '7888', '黑盒扫描中风险修正', '进度跟踪', '20', '2017-09-21', '3', '20170921', '20170921', '20170926', '');
INSERT INTO `work_detail` VALUES ('210', '股票质押约定购回', '', '业务需求', '#1132', '股票质押约定购回指定佣金率\n需求变更部分功能重新开发', '开发', '100', '2017-09-18', '0', '20170921', '20170918', '20170918', '需求变更部分功能重新开发');
INSERT INTO `work_detail` VALUES ('211', 'QFII订单系统', '', '业务需求', '需求 #5563', 'KSTP系统支持ETF交易功能', '开发', '0', '2017-08-10', '3', '20170921', '20170921', '20170815', '本周暂时挂起');
INSERT INTO `work_detail` VALUES ('212', 'QFII订单系统', '', '项目管理', '0000', '1:QFII-KSTP系统后续相关业务沟通', '进度跟踪', '100', '2017-09-20', '0', '20170921', '20170920', '20170920', '和业务部门，以及金仕达进行了相关沟通，明确了后需要跟踪和开发的任务');
INSERT INTO `work_detail` VALUES ('214', 'QFII订单系统', '', '项目管理', '1111', '参加恒生的风控系统的培训；学习恒生相关的系统结构', '进度跟踪', '100', '2017-09-18', '0', '20170921', '20170918', '20170918', '');
INSERT INTO `work_detail` VALUES ('215', 'QFII订单系统', '', '项目管理', 'Bug #7860', '小组成员对于任务的疑问解答,以及相关设计和代码的评审', '进度跟踪', '100', '2017-09-20', '0', '20170921', '20170920', '20170920', '');
INSERT INTO `work_detail` VALUES ('216', 'QFII订单系统', '', '项目管理', '2017042155号', '国际业务业务部子交易系统历史服务器安全扫描', '进度跟踪', '100', '2017-09-21', '0', '20170921', '20170921', '20170921', '已发起历史库安全扫描协作;待网络安全部评审');
INSERT INTO `work_detail` VALUES ('217', 'QFII订单系统', 'KSTP', '业务需求', '需求 #5563', 'KSTP系统支持ETF交易功能', '开发', '80', '2017-09-25', '3', '20170921', '20170928', '20170928', '本周暂时挂起');
INSERT INTO `work_detail` VALUES ('219', 'QFII订单系统', 'KSTP', '项目管理', '0000', '1:QFII快订历史库数据仓库相关采集沟通，和吴保洁已经沟通完毕，我们这边上线历史库, 不会对数仓采集有影响\n2:路透UAT访问失败，问题排查和跟踪\n3:BlackRock FIX标签新规则对KSTP系统的修改评估，暂时评估下来,后台以及ugfix网关层面均需要修改,\n   近一步的评估需要业务部门拿到详细的中文翻译资料以及示例fix消息再进行', '问题排查', '100', '2017-09-25', '0', '20170921', '20170925', '20170925', '');
INSERT INTO `work_detail` VALUES ('224', '集中交易系统', '', '业务需求', 'NULL', '兴业银行冲正测试问题跟踪', '测试沟通', '50', '2017-09-18', '2', '20170921', '20170921', '20170920', '（1）证转银，银行成功：已测试。\n（2）证转银，银行没有记录：请将40元失败的那笔改为未处理状态。(是否要冻结资金？)\n（3）证转银，银行冲正失败：请将证转银成功的那笔改为未处理状态。(是否要冻结资金？)\n（4）银转证，银行冲正成功：请将其中一笔银转证改为未处理。\n（5）银转证，银行冲正失败：请将失败的那笔银转证改为未处理，做冲正银行返回失败。\n');
INSERT INTO `work_detail` VALUES ('225', '集中交易系统', '', '在线问题', '8375', '柜台发起高管额度转移，废单后并没有释放委托时扣减的额度，', '问题排查', '70', '2017-09-21', '2', '20170921', '20170921', '20170925', '已反馈金仕达修改');
INSERT INTO `work_detail` VALUES ('227', '集中交易系统', '', '在线问题', 'BUG#8345', '可转债、可交换债IPO配号查询（SPX-51号）上海市场配号数量不正确的问题', '问题排查', '70', '2017-09-21', '2', '20170921', '20170921', '20170925', '反馈给了金仕达，也可以自己修改');
INSERT INTO `work_detail` VALUES ('228', '集中交易系统', '', '业务需求', '#8219', '造几个测试案例用于测试静态代码扫描', '开发', '100', '2017-09-20', '0', '20170921', '20170920', '20170920', '');
INSERT INTO `work_detail` VALUES ('229', '集中交易系统', '', '业务需求', '#8001', 'KS.Holder_acc所有增删改内容补全', '开发', '30', '2017-09-18', '5', '20170921', '20170921', '20170925', '');
INSERT INTO `work_detail` VALUES ('230', '集中交易系统', '', '业务需求', '#8001', 'KS.Holder_acc所有增删改内容补全', '开发', '80', '2017-09-25', '2', '20170921', '20170928', '20170927', '');
INSERT INTO `work_detail` VALUES ('231', '集中交易系统', '', '项目管理', 'NULL', '[HTXQ-20170901]临时停市债券质押式回购业务结算暂行办法', '测试沟通', '100', '2017-09-18', '0', '20170921', '20170918', '20170918', '讨论会议');
INSERT INTO `work_detail` VALUES ('232', '集中交易系统', '', '项目管理', '需求 #4808', '关于做好可转债、可交换债发行方式改革相关技术准备的通知-集中交易', '进度跟踪', '20', '2017-09-21', '3', '20170921', '20170921', '20170926', '会议及上线支持，预计下周一至周三支持上线');
INSERT INTO `work_detail` VALUES ('236', '集中交易系统', '', '业务需求', '子需求#8376', '静态代码扫描分析\n360和端码两个产品分析，扫描结果对比分析。测试案例整理。', '需求确认', '60', '2017-09-18', '5', '20170921', '20170921', '20170925', '');
INSERT INTO `work_detail` VALUES ('241', '集中交易', '', '业务需求', '子需求 #7734', '集中交易、融资融券－银行信息扩容及优化接口需求确认', '需求确认', '50', '2017-09-25', '2', '20170921', '20170928', '20170927', '');
INSERT INTO `work_detail` VALUES ('242', '融资融券交易', '', '在线问题', 'null', '证金报送文件生成逻辑梳理', '问题排查', '100', '2017-09-15', '1', '20170921', '20170921', '20170918', '');
INSERT INTO `work_detail` VALUES ('243', '股票质押约定购回', '', '业务需求', '7814', '关于增加项目编号筛选项等股票质押管理系统需求，等朱沈杰优化完历史后再加上我的修改', '开发', '100', '2017-09-25', '0', '20170921', '20170925', '20170925', '');
INSERT INTO `work_detail` VALUES ('247', '股票质押约定购回', '', '业务需求', '7706', '关于股票质押交易协议书字段位置格式调整的需求，等朱沈杰优化完历史后再加上我的修改', '开发', '100', '2017-09-25', '0', '20170921', '20170925', '20170925', '');
INSERT INTO `work_detail` VALUES ('248', '集中交易系统', '', '升级', 'null', 'v5026-h1 代码复读问题修改，设计和单元测试文档整理', '整理文档', '0', '2017-09-18', '1', '20170921', '20170921', '20170919', '');
INSERT INTO `work_detail` VALUES ('250', '人行征信', '', '业务需求', '7885', '黑盒扫描高风险修正', '进度跟踪', '20', '2017-09-25', '3', '20170921', '20170921', '20170928', '');
INSERT INTO `work_detail` VALUES ('254', '集中交易系统', '', '在线问题', 'null', '过账后备份失败问题排查', '问题排查', '80', '2017-09-20', '2', '20170921', '20170921', '20170922', '');
INSERT INTO `work_detail` VALUES ('258', '股票质押约定购回', '', '业务需求', '需求 #7704', '由于股票质押项目存在多笔主交易协议书关联管理的情况，我部希望股票质押业务新增关联两笔及以上主交易协议书的功能。 ', '开发', '0', '2017-09-25', '10', '20170925', '20170925', '20171016', '比较复杂');
INSERT INTO `work_detail` VALUES ('259', '集中交易系统', '', '业务需求', '8344', '可转债、可交换债IPO配号查询（SPX-51号）上海市场配号数量不正确的问题', '开发', '100', '2017-09-25', '0', '20170925', '20170925', '20170925', '已提交到5026-h1');
INSERT INTO `work_detail` VALUES ('260', '融资融券交易', '', '业务需求', '8345', '可转债、可交换债IPO配号查询（SPX-51号）上海市场配号数量不正确的问题', '开发', '100', '2017-09-25', '0', '20170925', '20170925', '20170925', '已提交到 batchlog格式优化');
INSERT INTO `work_detail` VALUES ('280', '集中交易系统', '', '业务需求', '任务8468', '股权激励计划状态变更引起实时清算报错', '设计', '30', '2017-09-26', '2', '20170928', '20170928', '20170928', '');
INSERT INTO `work_detail` VALUES ('281', '集中交易系统', '', '业务需求', '子需求 6849', '担保品划转控制', '单元测试', '50', '2017-09-28', '2', '20170928', '20170928', '20171009', '金仕达已发包，已复读，待测试。');
INSERT INTO `work_detail` VALUES ('282', '集中交易', '', '业务需求', '需求#8659', 'SECCS-9881 集中交易API网关490012接口修改融资放大倍数、标准卷使用率问题', '单元测试', '100', '2017-09-27', '0', '20170928', '20170927', '20170927', '');
INSERT INTO `work_detail` VALUES ('284', '集中交易', '', '业务需求', '需求 #8629', 'SECREQ-5003 【上交所】债券质押式回购交易业务调整', '单元测试', '0', '2017-09-28', '5', '20170928', '20171102', '20171109', '本周处理5026h1任务，本需求顺延。');
INSERT INTO `work_detail` VALUES ('287', '集中交易', '', '业务需求', '需求 #8616', 'SECREQ-5206 【上交所】关于启用资产支持证券业务相关代码段的通知', '单元测试', '0', '2017-09-28', '5', '20170928', '20171102', '20171109', '本周处理5026h1任务，本需求顺延。');
INSERT INTO `work_detail` VALUES ('288', '信用管理系统', '', '项目管理', '子需求 #7729', '1 合并股票质押3.0.3包中KSSC相关内容到1.9.0.0中\n2 代码复读', '复读', '100', '2017-09-25', '0', '20170928', '20170925', '20170925', '');
INSERT INTO `work_detail` VALUES ('289', '股票质押约定购回', '', '业务需求', '需求 #7704', '由于股票质押项目存在多笔主交易协议书关联管理的情况，我部希望股票质押业务新增关联两笔及以上主交易协议书的功能。\n在管理系统中应新增一类合约类型：关联主交易协议书，可以进行申请、处理、审批、审核、生效等全合约流程审批，以及增加相应菜单及合约处理的权限管理。盯市时，使用关联后的履约保障比例；通知送达时，使用新的通知模板做通知送达，并使用关联后的履约保障比例作为违约、预警等通知的生成条件。\n该业务的回单打印格式，待我部确定后另行沟通。', '开发', '30', '2017-09-22', '5', '20170928', '20170928', '20170929', '1 回单样式未确定\n2 通知模板未确定\n3 证金报送相关未确定');
INSERT INTO `work_detail` VALUES ('290', '股票质押约定购回', '', '业务需求', '需求 #7704', '由于股票质押项目存在多笔主交易协议书关联管理的情况，我部希望股票质押业务新增关联两笔及以上主交易协议书的功能。\n在管理系统中应新增一类合约类型：关联主交易协议书，可以进行申请、处理、审批、审核、生效等全合约流程审批，以及增加相应菜单及合约处理的权限管理。盯市时，使用关联后的履约保障比例；通知送达时，使用新的通知模板做通知送达，并使用关联后的履约保障比例作为违约、预警等通知的生成条件。\n该业务的回单打印格式，待我部确定后另行沟通', '开发', '100', '2017-09-22', '0', '20170928', '20171026', '20170922', '通知模板暂无，回单模板暂无\n邮件通知模板可能要使用HTML 模板形式，需要增加开发量\n现在设置功能，履保计算支持合并计算功能开发完毕');
INSERT INTO `work_detail` VALUES ('291', 'QFII订单系统', 'KSTP', '在线问题', '问题单 #7927', '针对KSTP系统卖出有零股的可转债时发生委托撤单失败这一问题，在kstp前后台加入零股委托的校验逻辑，相应的数据结构需要做调整', '开发', '60', '2017-09-22', '3', '20170928', '20170928', '20170927', '');
INSERT INTO `work_detail` VALUES ('292', '集中交易', '', '业务需求', '需求 #8614', 'SECREQ-5243 【光大】关于债券质押式回购计息公式变化的需求 ', '单元测试', '0', '2017-09-28', '5', '20170928', '20171102', '20171109', '本周处理5026h1任务，本需求顺延。');
INSERT INTO `work_detail` VALUES ('294', 'QFII订单系统', 'KSTP', '在线问题', '问题单 #7927', '针对KSTP系统卖出有零股的可转债时发生委托撤单失败这一问题，在kstp前后台加入零股委托的校验逻辑，相应的数据结构需要做调整', '开发', '100', '2017-09-22', '0', '20170928', '20170922', '20170922', '');
INSERT INTO `work_detail` VALUES ('295', '集中交易', '', '业务需求', '需求 #8602', 'SECREQ-5431 【上交所】关于完善回购利率的技术评估-120933的修改', '单元测试', '0', '2017-09-28', '5', '20170928', '20171102', '20171109', '本周处理5026h1任务，本需求顺延。');
INSERT INTO `work_detail` VALUES ('296', '集中交易', '', '业务需求', '需求 #8600', 'SECREQ-5438 【海通】债券托管量批量导入文件名称需要校验YYYYMMDD', '单元测试', '0', '2017-09-28', '5', '20170928', '20171102', '20171109', '本周处理5026h1任务，本需求顺延。');
INSERT INTO `work_detail` VALUES ('297', '集中交易系统', '', '业务需求', '#7976', '集中交易柜台->创业板投资者适当性管理：进行中登申报时报“证券账户号码不存在与证券账户类别不匹配”的问题\n\n原因：\n  报送时，根据客户号和证券账户获取证券账户类别时， 应该加上市场。\n  测试数据 23环境 1366083002\n', '开发', '100', '2017-09-28', '0', '20170928', '20170928', '20170928', '');
INSERT INTO `work_detail` VALUES ('298', '集中交易系统', '', '业务需求', '#7763', '合作问题排查和其他工作问题', '开发', '50', '2017-09-28', '5', '20170928', '20170928', '20171012', '');
INSERT INTO `work_detail` VALUES ('299', '集中交易系统', '', '业务需求', '需求 #8333', '继续 银行借款扩容。  完毕', '开发', '100', '2017-09-28', '0', '20170928', '20171019', '20170928', '已经提交5026');
INSERT INTO `work_detail` VALUES ('300', '融资融券交易', '', '项目管理', '无', '办公网直接连接南方中心网络', '问题排查', '100', '2017-09-28', '0', '20170928', '20170928', '20170928', '');
INSERT INTO `work_detail` VALUES ('301', '股票质押约定购回', '', '业务需求', '任务 #0000', '管理系统开发任务待定', '开发', '0', '2017-10-19', '2', '20170928', '20171019', '20171023', '');
INSERT INTO `work_detail` VALUES ('302', '融资融券交易', '', '业务需求', 'BUG#8806', '客户资产负债查询菜单中，前台部分新加两个输出字段融资余额与融券余额', '开发', '100', '2017-10-16', '0', '20170928', '20171026', '20171016', '');
INSERT INTO `work_detail` VALUES ('303', '集中交易系统', '', '业务需求', '#8001', 'KS.Holder_acc补全的测试，ks.cust_base_info增删改的补全', '开发', '0', '2017-10-02', '5', '20170928', '20170928', '20171013', '');
INSERT INTO `work_detail` VALUES ('304', '周边工具', '', '内部优化', 'REDMINE-#8374', '交易编码抽取工具输出格式调整。调整输出方式为一个个协议输出，而不是一起输出。抽取工具输出的协议输出，在字段为 double 时，长度为0，字段为long时，长度和精度都为 0 。修改字段为 double 时，长度为 8 ，字段为 long 时，长度为 4， 精度为0。', '开发', '80', '2017-09-22', '1', '20170928', '20170928', '20170925', '');
INSERT INTO `work_detail` VALUES ('305', '人行征信', '', '业务需求', '任务 #7889', '黑盒扫描中风险修正 (待分析)', '进度跟踪', '30', '2017-10-25', '10', '20170928', '20171026', '20171108', '');
INSERT INTO `work_detail` VALUES ('306', '小工具', '', '业务需求', '#2948', '完成协议平台分页功能、协议版本比较设计，部分编码。后续还需要进一步完成版本比较功能，另外还需要新增高级检索功能：包含关键字检索', '开发', '60', '2017-09-22', '12', '20170928', '20170928', '20171017', '');
INSERT INTO `work_detail` VALUES ('307', '集中交易', '', '业务需求', '#6827', '针对每一个系统，给出具体的升级方案，已将结果反馈给杨杰', '整理文档', '100', '2017-09-22', '0', '20170928', '20170922', '20170922', '');
INSERT INTO `work_detail` VALUES ('308', '集中交易系统', '', '业务需求', '需求#8809', '新经纪业务平台下的清算处理步骤没有记录职工操作流水', '开发', '100', '2017-10-16', '0', '20170928', '20171019', '20171016', '');
INSERT INTO `work_detail` VALUES ('309', '信用交易', '', '业务需求', '需求#8810', '新经纪业务平台下的清算处理步骤没有记录职工操作流水', '开发', '100', '2017-10-16', '0', '20170928', '20171019', '20171016', '');
INSERT INTO `work_detail` VALUES ('310', '融出资金债权', '', '在线问题', '7887', '协助金仕达升级测试环境框架补丁，并申请重新扫描。', '问题排查', '30', '2017-09-25', '20', '20170928', '20170928', '20171030', '');
INSERT INTO `work_detail` VALUES ('311', '周边模块', 'SPX网关', '项目管理', 'REDMINE-#8321', '电话沟通，反馈说测试环境中成交查询定位串失效，猜测是测试环境SPX和后台版本太低有关。对接人还反馈希望有主推成交记录的系统，我向xxx反馈了，建议更新测试环境或者更换接入的系统。', '测试沟通', '90', '2017-09-28', '0.5', '20170928', '20170928', '20170929', '');
INSERT INTO `work_detail` VALUES ('312', '融出资金债权', '', '项目管理', '需求#7361', 'ABS生产坏境升级并处理在线问题', '测试沟通', '90', '2017-10-09', '13', '20170928', '20171102', '20171121', '');
INSERT INTO `work_detail` VALUES ('315', '周边模块', 'SPX网关', '业务需求', 'REDMINE-#8338', '测试 SPX 668 功能（信用交易核心系统）', '单元测试', '100', '2017-09-21', '0', '20170928', '20170921', '20170921', '');
INSERT INTO `work_detail` VALUES ('316', '信用管理', '股票质押', '业务需求', '子需求 #5748', '合并金仕达股票质押3.0.3大包', '开发', '100', '2017-09-28', '0', '20170928', '20171103', '20171103', '');
INSERT INTO `work_detail` VALUES ('317', '信用管理', '股票质押', '业务需求', '需求 #6398', '与业务部门确认股票质押、约定购回存量客户适当性管理需求。', '需求确认', '80', '2017-09-28', '2', '20170928', '20170928', '20171009', '');
INSERT INTO `work_detail` VALUES ('318', 'QFII订单系统', 'KSTP', '业务需求', '需求 #8411', '海通TWAP限量策略需求分析', '需求确认', '20', '2017-09-26', '7', '20170928', '20170928', '20171012', '完成了相关的需求分析，后续进行详细设计和开发');
INSERT INTO `work_detail` VALUES ('319', '集中交易', '', '业务需求', '需求 #1245', '广发银行产品代销联调测试', '测试沟通', '90', '2017-08-01', '2', '20170928', '20170928', '20170803', '');
INSERT INTO `work_detail` VALUES ('320', '集中交易', '', '业务需求', '子需求 #7762', '银行返回代码梳理：完成代码更改、单元测试', '开发', '100', '2017-09-25', '0', '20170928', '20170925', '20170925', '');
INSERT INTO `work_detail` VALUES ('321', '周边模块', '报盘', '升级', '#8726', '核实5030配套升级包中报盘程序与生产在线版本情况，通过比较源代码，发现新版本的新增投票回报功能，需入GIT管理', '复读', '80', '2017-09-28', '1', '20170928', '20170928', '20170929', '');
INSERT INTO `work_detail` VALUES ('322', 'QFII订单系统', 'KSTP', '业务需求', '需求 #8728', '关于QFII交易系统持续支持交易所大宗交易系统股份减持技术要求的需求，9月22日QFII客户下大宗交易被拒绝，经排查是EMS系统还没有升级大宗减持升级包以及QFII交易系统还不支持大宗减持业务所导致的, 后续需要改造KSTP系统, 增加受限标志的输入', '需求确认', '20', '2017-09-26', '5', '20170928', '20170928', '20171010', '需求分析和确认，后续进行相关的开发');
INSERT INTO `work_detail` VALUES ('323', '融出资金债权', '', '在线问题', '需求#7887', '协助安全问题诊断及测试，并通过质保部WEB安全扫描', '测试沟通', '60', '2017-10-09', '0', '20170928', '20171026', '20171009', '');
INSERT INTO `work_detail` VALUES ('324', '集中交易', '', '业务需求', '子需求 #8322', '三方存管手工冲正测试问题修正：完成场景梳理、代码开发、自测试', '开发', '100', '2017-09-25', '0', '20170928', '20170925', '20170925', '');
INSERT INTO `work_detail` VALUES ('325', '集中交易', '', '业务需求', '任务 #7760', '银行信息扩容：完成代码编写，完成开销户、联通、更换银行账号等功能测试', '开发', '80', '2017-09-25', '1.5', '20170928', '20170928', '20170927', '');
INSERT INTO `work_detail` VALUES ('326', '集中交易', '', '业务需求', '任务 #7930', '深港通SZHK_QTSL中分拆合并临时代码可用额度对账逻辑', '开发', '90', '2017-08-22', '2', '20170928', '20170928', '20170824', '');
INSERT INTO `work_detail` VALUES ('327', '集中交易', '', '业务需求', '需求 #8611', '股权激励管理白名单与增加流水', '复读', '0', '2017-09-28', '30', '20170928', '20171103', '20171215', '本周未处理');
INSERT INTO `work_detail` VALUES ('328', '集中交易', '', '业务需求', '需求 #8617', '违约处置卖出申报', '复读', '0', '2017-09-28', '30', '20170928', '20171103', '20171215', '本周未处理');
INSERT INTO `work_detail` VALUES ('329', '周边模块', '报盘', '升级', '任务 #8726', '完成源代码的复核，入库管理，升级协作等后续工作', '复读', '100', '2017-09-29', '1', '20170928', '20171026', '20171009', '打算放到5030专题包中，延后进行');
INSERT INTO `work_detail` VALUES ('331', '信用交易', '', '在线问题', '问题单 #7893', '资管O32系统融资融券spx网关白名单控制失效：完成问题排查及测试', '单元测试', '100', '2017-09-25', '0', '20170928', '20170925', '20170925', '');
INSERT INTO `work_detail` VALUES ('332', '集中交易', '', '业务需求', '需求 #8674', '上海股票质押购回交易无法正确进行资产修正', '复读', '0', '2017-09-28', '30', '20170928', '20171103', '20171215', '本周未处理');
INSERT INTO `work_detail` VALUES ('333', '小工具', '', '业务需求', '#2948', '完成协议管理平台中协议版本功能，以及关键字检索功能。进一步优化UI前台交互设计', '开发', '70', '2017-09-29', '12', '20170928', '20170928', '20171024', '');
INSERT INTO `work_detail` VALUES ('334', '集中交易', '', '在线问题', '需求 #8699', 'DcomBu前置机重启后取股权激励自主行权撤单非交易委托价格错误', '复读', '0', '2017-09-28', '30', '20170928', '20171103', '20171215', '本周未处理');
INSERT INTO `work_detail` VALUES ('335', '集中交易', '', '业务需求', 'NULL', '场外开放式基金清算优化', '开发', '10', '2017-09-25', '15', '20170928', '20170928', '20171023', '');
INSERT INTO `work_detail` VALUES ('336', '集中交易', '', '业务需求', '任务 #7760', '完成单元测试、柜台联试', '单元测试', '100', '2017-10-09', '0', '20170928', '20171009', '20171009', '');
INSERT INTO `work_detail` VALUES ('337', '集中交易', '', '内部优化', '子需求 #7761', '银行转账支持批量重发设计', '设计', '100', '2017-10-09', '0', '20170928', '20171026', '20171009', '');
INSERT INTO `work_detail` VALUES ('338', '集中交易', '', '在线问题', 'NULL', '场外开放式基金通过基金参数设置控制在海通进行代销的认购人数时，发生无法进行有效控制的情况\n', '问题排查', '60', '2017-09-26', '1', '20170928', '20170928', '20170927', '');
INSERT INTO `work_detail` VALUES ('339', '集中交易', '', '业务需求', '需求 #1245', '广发银行产品代销联调测试', '测试沟通', '90', '2017-10-30', '3', '20170928', '20171026', '20171102', '预计下周一开始上线前测试');
INSERT INTO `work_detail` VALUES ('340', '集中交易', '', '业务需求', '需求#8811', '清算自动录入后端程序对接新意文件接收部分需求分析。', '需求确认', '20', '2017-09-28', '5', '20170928', '20170928', '20171012', '');
INSERT INTO `work_detail` VALUES ('341', '集中交易', '', '业务需求', '需求 #8884', '场外开放式基金清算优化 现金理财委托生成、清算入账等', '开发', '10', '2017-10-30', '7', '20170928', '20171026', '20171108', '');
INSERT INTO `work_detail` VALUES ('342', 'QFII订单系统', 'KSTP', '项目管理', '0000', '海通QFII工作量统计', '整理文档', '100', '2017-09-25', '0', '20170928', '20170925', '20170925', '统计完毕，只统计自主开发部分的金仕达测试工时');
INSERT INTO `work_detail` VALUES ('343', '集中交易', '', '业务需求', '无', '可转债新规首次发行跟踪处理。', '问题排查', '100', '2017-09-28', '0', '20170928', '20170928', '20170928', '');
INSERT INTO `work_detail` VALUES ('344', '周边模块', '通讯互联网关', '内部优化', '需求 #8883', 'linkbu通讯互联网关相关优化, 已完成开发，待测试', '开发', '80', '2017-09-27', '2', '20170928', '20170929', '20170929', '');
INSERT INTO `work_detail` VALUES ('345', '信用管理', '股票质押', '业务需求', '需求 #7987', '关于交易协议书新增出资方字段的需求', '开发', '20', '2017-09-28', '1', '20170928', '20170928', '20170929', '');
INSERT INTO `work_detail` VALUES ('346', '集中交易', '', '在线问题', 'NULL', '32环境结算模块过账后备份失败，新建子进程异常退出，已查明原因并修复', '问题排查', '100', '2017-09-22', '3', '20170928', '20170928', '20170927', '');
INSERT INTO `work_detail` VALUES ('351', '信用交易', '', '在线问题', '需求 #8813', '9月22日有个客户当日推送了很多次的xy标志（见附件），导致反洗钱这边报警，集中交易客户号：5050000888，对应融资融券客户号：1885050020以为是通讯互联网关转发了多次，后来排查通讯互联网关的日志，发现该客户的110094并无调用。因此排除通讯互联网关。然后其他的调用点如账户中心---刘舒婷说还么有调用该功能。--其他如柜台菜单，信用一站式开户，这个只剩下唯一的可能性了', '问题排查', '40', '2017-09-28', '2', '20170928', '20170928', '20171009', '此问题暂未查清');
INSERT INTO `work_detail` VALUES ('352', '信用管理', '股票质押', '业务需求', '需求 #7987', '关于交易协议书新增出资方字段的需求', '开发', '100', '2017-09-28', '0', '20170928', '20170928', '20170928', '');
INSERT INTO `work_detail` VALUES ('353', '周边模块', '通讯互联网关', '内部优化', '需求 #8883', 'linkbu通讯互联网关相关优化, 已完成开发，单元测试已完成', '单元测试', '100', '2017-10-09', '0', '20170928', '20171009', '20171009', '需要后续质保部测试，并进行相关的升级');
INSERT INTO `work_detail` VALUES ('356', '集中交易', '', '业务需求', '需求 #8814', '三方存管手工冲正和银证转账单边账调整菜单缺少复核功能。', '需求确认', '30', '2017-09-28', '1', '20170928', '20170928', '20170929', '分给张修兴后续处理');
INSERT INTO `work_detail` VALUES ('357', 'QFII订单系统', 'KSTP', '业务需求', '需求 #8728', '关于QFII交易系统持续支持交易所大宗交易系统股份减持技术要求的需求，9月22日QFII客户下大宗交易被拒绝，经排查是EMS系统还没有升级大宗减持升级包以及QFII交易系统还不支持大宗减持业务所导致的, 后续需要改造KSTP系统, 增加受限标志的输入', '整理文档', '100', '2017-10-09', '0', '20170928', '20171019', '20171009', '已经将该任务指派给贾森，后续进行相关跟踪,和协助贾森完成该任务');
INSERT INTO `work_detail` VALUES ('358', '集中交易', '', '在线问题', 'NULL', '修正完善标准券调整统一修改单元测试报告', '单元测试', '100', '2017-09-27', '1', '20170928', '20170928', '20170928', '');
INSERT INTO `work_detail` VALUES ('359', '集中交易', '', '业务需求', '无', '静态代码扫描事宜，整理测试案例，分析扫描结果，扫描结果反馈给开发商。', '进度跟踪', '40', '2017-09-28', '5', '20170928', '20170928', '20171012', '');
INSERT INTO `work_detail` VALUES ('360', '信用管理', '股票质押', '业务需求', '需求 #8319', '关于信用管理平台股票质押司法冻结监控菜单功能优化的需求', '开发', '100', '2017-10-09', '0', '20170928', '20171009', '20171009', '');
INSERT INTO `work_detail` VALUES ('361', '集中交易', '', '业务需求', '需求 #7721', '关于进一步做好上市公司股东大会网络投票服务的通知设计，', '需求确认', '50', '2017-10-26', '10', '20170928', '20171027', '20171110', '');
INSERT INTO `work_detail` VALUES ('362', '集中交易', '', '业务需求', '需求 #7936', '日志系统需求（1，重构后台的Http通信服务框架，提高稳定性；2，在写周报的时候添加一个转移按钮，能把本周的工作复制到下周去，免得下周再重新写一次；3，完善查询的功能，需要添加排序和导出的一些功能；\n4，更改添加周报跟新日期等于开始日期）', '开发', '100', '2017-09-29', '0', '20170928', '20171103', '20171103', '');
INSERT INTO `work_detail` VALUES ('363', '集中交易', '', '项目管理', '任务 #0000', '集中交易的V5026h1版本预计提交质保部测试', '进度跟踪', '30', '2017-09-28', '5', '20170928', '20171020', '20171012', '');
INSERT INTO `work_detail` VALUES ('366', '集中交易', '', '业务需求', '需求 #7341', '集中交易清算录入支持RZCX文件录入“股票质押余额”数据', '开发', '100', '2017-10-11', '0', '20170928', '20171011', '20171011', '');
INSERT INTO `work_detail` VALUES ('367', '集中交易', '', '业务需求', '需求 #8090', '修改代码以修复问题：开放式基金“终止定投”操作失败，因为“基金账户非交易状态”', '开发', '100', '2017-09-28', '0', '20170928', '20171019', '20170928', '');
INSERT INTO `work_detail` VALUES ('368', '周边模块', 'SPX网关', '项目管理', 'REDMINE-#7291', '和江通沟通，提出 SPX要新增开关的需求。', '进度跟踪', '50', '2017-09-21', '1', '20170928', '20170928', '20170922', '');
INSERT INTO `work_detail` VALUES ('369', '小工具', '', '内部优化', 'REDMINE-#8383', '调研自动化构建、部署环境的可行性。花了一些时间安装jenkins，在研究怎么使用。', '需求确认', '30', '2017-09-22', '3', '20170928', '20170928', '20170927', '');
INSERT INTO `work_detail` VALUES ('370', '集中交易', '', '业务需求', 'REDMINE-#7941', '新股中签查询支持可转债，出了设计。', '设计', '50', '2017-09-22', '2', '20170928', '20170928', '20170926', '');
INSERT INTO `work_detail` VALUES ('371', '集中交易', '', '业务需求', 'REDMINE-#8364', 'SPX17 号功能新增交易单位和存放单位输出，便于外围计算交易单位', '设计', '40', '2017-09-22', '2', '20170928', '20170928', '20170926', '');
INSERT INTO `work_detail` VALUES ('372', '集中交易', '', '在线问题', 'REDMINE-#6516', '客户10号功能包可用1股，查17号功能最大可卖应该返回1股，但现在返回的是0股。经测试，55基金会走经如图所示的一段逻辑。建议修改控制条件。', '问题排查', '90', '2017-09-22', '0.5', '20170928', '20170928', '20170925', '');
INSERT INTO `work_detail` VALUES ('373', '集中交易', '', '业务需求', 'REDMINE-#8469', 'Cache 对应后台 404230 需要增加股票质押余额输出', '设计', '50', '2017-09-22', '1', '20170928', '20170928', '20170925', '');
INSERT INTO `work_detail` VALUES ('374', '集中交易', '', '培训准备', '7765', 'ksshmt红黑树学习', '整理文档', '100', '2017-08-17', '0', '20170928', '20170817', '20170817', '已整理好文档上传redmine');
INSERT INTO `work_detail` VALUES ('375', '集中交易', '', '内部优化', '6844', '集中交易内存库编译优化', '单元测试', '90', '2017-07-11', '2', '20170928', '20170928', '20170713', '1.统计归纳接口函数使用频率列表，对使用频率高的函数进行测试。\n2.除查询外，对增删改也同样进行测试');
INSERT INTO `work_detail` VALUES ('376', '集中交易', '', '内部优化', '需求#6844', '集中交易内存库编译优化', '单元测试', '90', '2017-07-11', '2', '20170928', '20171026', '20171030', '本周集中进行监控模块的开发，暂时搁置');
INSERT INTO `work_detail` VALUES ('378', '集中交易', '', '内部优化', '需求 #1737', '交收过账优化', '开发', '50', '2017-09-29', '20', '20170929', '20170929', '20171103', '完成一期优化计划（文档后补）');
INSERT INTO `work_detail` VALUES ('379', '集中交易', '', '项目管理', '需求 #8613', '可转债、可交换债发行改革上线支持', '进度跟踪', '100', '2017-09-29', '0', '20170929', '20170929', '20170929', '生产支持3天');
INSERT INTO `work_detail` VALUES ('380', '集中交易', '', '业务需求', '需求 #7988', '网上交易大宗减持承诺书需求确定及开发支持', '开发', '40', '2017-09-25', '2', '20170929', '20170929', '20170927', '');
INSERT INTO `work_detail` VALUES ('381', '集中交易', '', '在线问题', '任务 #8468', '股权激励计划状态变更引起实时清算报错', '问题排查', '100', '2017-09-29', '0', '20170929', '20170929', '20170929', '安排陈岱宗修改');
INSERT INTO `work_detail` VALUES ('382', '集中交易', '', '业务需求', '需求 #6991', '股东账户质量增量导出代码合并到GIT', '开发', '90', '2017-09-27', '1', '20170929', '20170929', '20170928', '');
INSERT INTO `work_detail` VALUES ('383', '集中交易', '', '在线问题', 'Bug #8384', '大宗交易生产问题（废单情况下卖出份额未解冻）问题排查及金仕达新一轮专题包代码合并', '问题排查', '60', '2017-09-26', '3', '20170929', '20170929', '20170929', '');
INSERT INTO `work_detail` VALUES ('384', '集中交易', '', '业务需求', '子需求 #6840', '集中交易金仕达5030专题包代码复读', '复读', '10', '2017-09-28', '5', '20170929', '20170929', '20171012', '');
INSERT INTO `work_detail` VALUES ('385', '集中交易', '', '业务需求', '子需求 #6840', '员工平台接口梳理', '测试沟通', '100', '2017-09-28', '0', '20170929', '20170928', '20170928', '');
INSERT INTO `work_detail` VALUES ('386', '集中交易', '', '业务需求', '子需求 #6840', '集中交易金仕达5030专题包代码合并', '复读', '60', '2017-09-28', '2', '20170929', '20171103', '20171107', '');
INSERT INTO `work_detail` VALUES ('387', 'QFII订单系统', 'KSTP', '培训准备', '8074	', '后台搭建一整套环境，包括数据库，应用以及初始化数据, 通过搭建环境， 近一步了解后台系统\n搭建服务器 :188.190.12.44 \n数据库版本安装db2 10版本\n快订系统重新搭建，理解后台', '测试沟通', '90', '2017-09-25', '1', '20170929', '20170929', '20170926', '');
INSERT INTO `work_detail` VALUES ('388', '集中交易', '', '内部优化', '需求 #1737', '交收过账优化完成：\n1. 客户序列号优化\n2. COMMIT次数优化\n3. 委托统计优化', '开发', '100', '2017-09-29', '0', '20170929', '20171103', '20171103', '并行清算测试');
INSERT INTO `work_detail` VALUES ('389', '集中交易', '', '项目管理', '需求 #0000', '5030复读。', '复读', '10', '2017-09-29', '10', '20170929', '20170929', '20171020', '');
INSERT INTO `work_detail` VALUES ('390', 'QFII订单系统', 'KSTP', '业务需求', '需求#8917', '查询不到证券信息之后的报错信息优化', '开发', '10', '2017-10-09', '1', '20170929', '20171013', '20171010', '');
INSERT INTO `work_detail` VALUES ('391', 'QFII订单系统', 'KSTP', '业务需求', '需求#8409', '在“财务佣金核账”中，匹配记录时如金额不完全一致时，可以输入备注信息以留痕。', '开发', '0', '2017-10-16', '4', '20170929', '20171013', '20171020', '');
INSERT INTO `work_detail` VALUES ('412', '信用交易', '', '在线问题', '需求#0000', '业务称深圳受让方减持额度交易所未发送，最后排查为自28日起一直未录入数据。', '问题排查', '100', '2017-10-09', '0', '20171010', '20171009', '20171009', '');
INSERT INTO `work_detail` VALUES ('413', '信用交易', '', '在线问题', '需求#8942', '客户9.30日融资合约到期，非交易日，管理29日日终数据中仍有此客户合约，导致10.9日客户可以新开仓。10.9日日终计息失败。\n计划修改管理日终导出逻辑，T+1前到期的，T日日终导出前合同额度更新为0.转二涛。', '问题排查', '100', '2017-10-10', '0', '20171010', '20171010', '20171010', '');
INSERT INTO `work_detail` VALUES ('414', '集中交易', '', '内部优化', '需求#8947', 'bstat.cpp [C020480014]非流通性质的高管可用额度不用更新 前台刷屏太多，无需提示', '设计', '100', '2017-10-10', '0', '20171010', '20171010', '20171010', '');
INSERT INTO `work_detail` VALUES ('415', '信用交易', '', '在线问题', '需求  #8952', '客户无合同，信用利率未匹配，但前台查询仓单现状不应报错。\n110268 取GETFEE 若失败，利率输出为-99，无需报错。\n融券也一样。 转周万庚', '问题排查', '100', '2017-10-10', '0', '20171010', '20171010', '20171010', '');
INSERT INTO `work_detail` VALUES ('422', '集中交易', '', '内部优化', '需求 #8950', '沟通金仕达，废弃其5030改的参数优化，以我部修改版本为准。', '需求确认', '100', '2017-10-11', '0', '20171011', '20171011', '20171011', '');
INSERT INTO `work_detail` VALUES ('428', '集中交易', '', '业务需求', '需求 #3668', 'RTGS接口优化,沟通版本，先测试手工入账，5031版本\n--暂停，等5031', '测试沟通', '0', '2017-10-13', '1', '20171011', '20171026', '20171016', '');
INSERT INTO `work_detail` VALUES ('457', '集中交易', '', '业务需求', '需求 #8925', '协议委托附加表（KS.XY_ENTRUST_ATTACH）支持转历史库——集中交易前台\n--接手分析。\n\n暂停。', '开发', '90', '2017-10-12', '5', '20171012', '20171103', '20171110', '暂停。等金仕达方案');
INSERT INTO `work_detail` VALUES ('458', '集中交易', '', '业务需求', 'BUG#6205', 'B股指定席位与申报席位不一致的客户无法进行投票类综合业务', '开发', '100', '2017-10-12', '0', '20171012', '20171019', '20171012', '');
INSERT INTO `work_detail` VALUES ('461', '集中交易', '', '业务需求', '需求#8927', '子需求#8927：交收过账性能优化——去除历史成交备份表（KS.HIS_DONE_FC）的逻辑 \n现有逻辑梳理，新需求改动方案设计', '设计', '100', '2017-10-09', '3', '20171012', '20171012', '20171012', '');
INSERT INTO `work_detail` VALUES ('462', '信用交易', '', '业务需求', '需求#8981', '管理系统同步信用额度到交易也调用413105', '开发', '100', '2017-10-16', '0', '20171012', '20171016', '20171016', '');
INSERT INTO `work_detail` VALUES ('463', '集中交易', '', '业务需求', '需求 #7763', '合作问题排查和其他工作问题记录，配合查找交易编码 柜台点逻辑等', '开发', '50', '2017-10-12', '5', '20171012', '20171103', '20171110', '');
INSERT INTO `work_detail` VALUES ('464', '信用管理', '', '业务需求', '需求 #8938', '国际统计报表历史服务器没有配置交易编码. 完成', '开发', '100', '2017-10-12', '0', '20171012', '20171019', '20171012', '');
INSERT INTO `work_detail` VALUES ('465', '信用交易', '', '业务需求', '需求 #8805', '客户资产负债查询菜单中，前台部分新加两个输出字段融资余额与融券余额 --等需求确认和服务端修改后，进行\n完毕', '开发', '100', '2017-10-23', '0', '20171012', '20171026', '20171023', '完毕');
INSERT INTO `work_detail` VALUES ('466', '集中交易', '', '业务需求', '需求#8927', '子需求#8927：交收过账性能优化——去除历史成交备份表（KS.HIS_DONE_FC）的逻辑\n代码实现', '开发', '100', '2017-10-12', '0', '20171012', '20171027', '20171027', '');
INSERT INTO `work_detail` VALUES ('467', '集中交易', '', '业务需求', '任务#8961', 'otc赎回延迟交收批前检查不平', '问题排查', '100', '2017-10-11', '0', '20171012', '20171011', '20171011', '');
INSERT INTO `work_detail` VALUES ('468', '集中交易', '', '业务需求', 'BUG#8984', '可转债IPO中签交收日（T+2）银行文件生成错误', '开发', '100', '2017-10-11', '0', '20171012', '20171026', '20171011', '');
INSERT INTO `work_detail` VALUES ('469', '集中交易', '', '业务需求', '任务#8962', '关于挂账账户深港通份额无法自动迁移的问题', '开发', '100', '2017-10-11', '0', '20171012', '20171102', '20171102', '');
INSERT INTO `work_detail` VALUES ('470', '集中交易', '', '业务需求', '子需求#6849', '担保品划转控制', '单元测试', '50', '2017-09-27', '5', '20171012', '20171102', '20171109', '金仕达已发包，已复读，待测试。\n本周处理5026h1任务，本需求顺延。');
INSERT INTO `work_detail` VALUES ('471', '集中交易', '', '业务需求', '需求#8927', '子需求#8927：交收过账性能优化  单元测试\n', '单元测试', '100', '2017-10-16', '0', '20171012', '20171027', '20171027', '');
INSERT INTO `work_detail` VALUES ('472', '集中交易', '', '业务需求', '需求#8924', '需求#8924：协议委托附加表（KS.XY_ENTRUST_ATTACH）支持转历史库——集中交易后台', '开发', '0', '2017-10-16', '2', '20171012', '20171019', '20171018', '版本推迟');
INSERT INTO `work_detail` VALUES ('473', '信用管理', '股票质押', '业务需求', '需求 #8807', '股票质押利息预估菜单增加导出功能', '开发', '100', '2017-10-12', '0', '20171012', '20171012', '20171012', '');
INSERT INTO `work_detail` VALUES ('474', '集中交易', '', '业务需求', '任务 #8916', '广发代销测试柜台对于151（基金终止）业务未做处理', '开发', '100', '2017-09-29', '0', '20171012', '20171026', '20170929', '');
INSERT INTO `work_detail` VALUES ('475', '信用交易', '', '业务需求', '需求 #7709', '[RZRQ-20171001]-关于剔除融资融券业务网上交易“历史成交”菜单中冗余数据的需求', '设计', '100', '2017-10-11', '0', '20171012', '20171103', '20171103', '1. 需要与证金部刘红宇确认需求\n2. 计划安排陈岱宗开发');
INSERT INTO `work_detail` VALUES ('476', '集中交易', '', '内部优化', '问题单 #8963', '转债中签清算处理后查询（债券中签转非流通4616）发现发生金额为0但标准机构费用明细文件中发生金额有值的问题', '设计', '100', '2017-10-11', '0', '20171012', '20171011', '20171011', '完成设计，安排陈岱宗开发');
INSERT INTO `work_detail` VALUES ('477', '信用交易', '', '在线问题', 'BUG#7835', '根据复读内容更新批量到日期设置，并考虑后续实现方案', '问题排查', '80', '2017-10-12', '0', '20171012', '20171026', '20171012', '');
INSERT INTO `work_detail` VALUES ('478', '集中交易', '', '业务需求', '需求 #8923', '协议委托附加表（KS.XY_ENTRUST_ATTACH）支持转历史库', '设计', '100', '2017-10-12', '0', '20171012', '20171012', '20171012', '设计评审完毕，安排郑发桂后台开发、张修兴柜台开发、陈凯翔周边支持');
INSERT INTO `work_detail` VALUES ('479', '集中交易', '', '业务需求', '需求 #8947', '[C020480014]非流通性质的高管可用额度不用更新 提示信息去除', '设计', '100', '2017-10-12', '0', '20171012', '20171103', '20171103', '2017-10-12：待分析\n2017-11-2：复读已完成');
INSERT INTO `work_detail` VALUES ('480', 'QFII订单系统', 'KSTP', '业务需求', '问题单 #8964', '邮件系统问题：单日自买自卖统计的成交时间问题', '问题排查', '100', '2017-10-10', '0', '20171012', '20171026', '20171010', '');
INSERT INTO `work_detail` VALUES ('481', 'QFII订单系统', 'KSTP', '业务需求', '需求 #8999', '小工具开发, 编写小工具，识别现在kstp的每个代码文件的编码格式 ', '开发', '100', '2017-10-12', '0', '20171012', '20171019', '20171012', '');
INSERT INTO `work_detail` VALUES ('482', '集中交易', '', '内部优化', '问题单 #7924', '算录入上海AG国债对账文件GZQTSL（QTSL）录入报主键冲突', '设计', '100', '2017-10-12', '0', '20171012', '20171103', '20171103', '2017-10-12：待分析');
INSERT INTO `work_detail` VALUES ('483', '集中交易', '', '业务需求', '需求 #7226', '集中交易、融资融券和快速交易系统债券质押式回购交易结算风险控制', '设计', '100', '2017-10-12', '0', '20171012', '20171103', '20171103', '2017-10-12：待分析');
INSERT INTO `work_detail` VALUES ('484', '信用管理', '管理系统', '在线问题', 'BUG#[8942]', '额度到期日为非交易时，导致到期日后的下一个交易日客户可以进行开仓操作', '开发', '100', '2017-10-10', '0', '20171012', '20171010', '20171010', '');
INSERT INTO `work_detail` VALUES ('485', 'QFII订单系统', 'KSTP', '业务需求', '需求 #8411', '国际业务部提出TWAP限量策略需求,  设计完成，后续进行相关的开发', '设计', '100', '2017-10-09', '0', '20171012', '20171019', '20171009', '已经完成相关设计，并将其上传到 redmine上了');
INSERT INTO `work_detail` VALUES ('486', '信用管理', '管理系统', '在线问题', 'BUG #9000', '对账单邮件发送问题，与163合作排查问题，修复问题', '问题排查', '100', '2017-10-09', '0', '20171012', '20171009', '20171009', '');
INSERT INTO `work_detail` VALUES ('487', 'QFII订单系统', 'EMS', '在线问题', '需求 #3577', '深中登二期优化上线后，红股红利的业务接口都变更了，清算多头的业务逻辑需要变更的整理，\n由金仕达施磊勤进行相关整理', '进度跟踪', '100', '2017-10-09', '0', '20171012', '20171009', '20171009', '金仕达施磊勤承诺本周给出开发周期，以及测试包发包时间');
INSERT INTO `work_detail` VALUES ('488', '信用管理', '股票质押', '业务需求', '需求 #1139', '要求对股票质押-证券标的设置  查询的显示进行修改', '开发', '100', '2017-10-11', '0', '20171012', '20171011', '20171011', '');
INSERT INTO `work_detail` VALUES ('489', 'QFII订单系统', 'KSTP', '项目管理', '需求 #0000', '1:跟踪Black Rock的FIX标签新需求，并阅读相关说明文档,分析系统需要的修改点\n2:QFII 自买自卖成交查询问题跟踪，初步分析之后，已将问题指派给端伟彬，redmine编号 #8964', '进度跟踪', '100', '2017-10-12', '0', '20171012', '20171012', '20171012', '');
INSERT INTO `work_detail` VALUES ('490', '信用交易', '', '业务需求', '需求 #7345', '关于融资融券证金数据报送加密流程优化的需求', '开发', '80', '2017-10-12', '2', '20171012', '20171102', '20171106', '1 java程序已经可以在linux下运行，shell脚本已经完成\n2 融资融券后台也需要我开发，与预想不同，需要学习准备下\n3 确定后台调用方式，采用框架方式增加操作步骤\n4 日志采用修改java程序每次加密一个文件就可以返回给C程序，然后记录日志');
INSERT INTO `work_detail` VALUES ('491', '周边模块', 'SPX网关', '业务需求', '需求 #7291', 'SPX数据字典查询功能：询问金仕达进展：融资融券后台+网关，本周末（2017-10-13）前估计可以完成，集中交易需要在迭代会上评审。', '设计', '100', '2017-10-12', '0', '20171012', '20171026', '20171012', '已完成');
INSERT INTO `work_detail` VALUES ('492', '周边模块', 'SPX网关', '内部优化', '子需求 #8926', '协议委托附加表（KS.XY_ENTRUST_ATTACH）支持转历史库，需要SPX将相关的请求配置历史查询转发。计划本周五完成相关功能的测试与验证。', '需求确认', '50', '2017-10-12', '1', '20171012', '20171020', '20171013', '');
INSERT INTO `work_detail` VALUES ('493', '周边模块', 'SPX网关', '业务需求', '子需求 #8932', 'SPX 14 号功能新增“证券类别”输出，评估涉及到修改后台交易编码 423106 ，涉及到接口 114 和 669 。拟以 sstat_type2 字段输出。', '设计', '100', '2017-10-12', '0', '20171012', '20171026', '20171026', '');
INSERT INTO `work_detail` VALUES ('494', '信用交易', '', '业务需求', '需求 #8469', 'Cache 对应后台 404230 需要增加股票质押余额输出', '开发', '100', '2017-10-12', '0', '20171012', '20171026', '20171026', '');
INSERT INTO `work_detail` VALUES ('495', '集中交易', '', '业务需求', '需求 #8930', '配合恒生PB系统SPX14号功能改造新增证券类别', '开发', '100', '2017-10-12', '0', '20171012', '20171026', '20171026', '');
INSERT INTO `work_detail` VALUES ('496', '信用交易', '', '业务需求', '需求 #8931', '配合恒生PB系统SPX14号功能改造新增证券类别', '开发', '100', '2017-10-12', '0', '20171012', '20171026', '20171026', '');
INSERT INTO `work_detail` VALUES ('497', '信用交易', '', '业务需求', '需求 #7942', '新股中签查询支持可转债', '开发', '100', '2017-10-12', '0', '20171012', '20171026', '20171026', '');
INSERT INTO `work_detail` VALUES ('498', '信用管理', '股票质押', '业务需求', '需求 #8808', '交易协议书到期监控菜单添加指令类别', '开发', '100', '2017-10-12', '0', '20171012', '20171019', '20171012', '');
INSERT INTO `work_detail` VALUES ('499', '集中交易', '', '项目管理', '任务 #0000', '新员工入职、报销、面试等部门事务处理', '整理文档', '100', '2017-10-19', '0', '20171012', '20171026', '20171019', '');
INSERT INTO `work_detail` VALUES ('500', '信用交易', '', '业务需求', '需求#7709', '关于剔除融资融券业务网上交易“历史成交”菜单中冗余数据的需求', '开发', '100', '2017-10-12', '0', '20171012', '20171019', '20171012', '');
INSERT INTO `work_detail` VALUES ('501', '集中交易', '', '业务需求', '需求#8947', '需求 #8947 非流通性质的高管可用额度不用更新 提示信息去除', '开发', '100', '2017-10-16', '2', '20171012', '20171019', '20171018', '');
INSERT INTO `work_detail` VALUES ('502', '小工具', '', '业务需求', '需求#2948', '完成协议管理平台中协议版本功能，新增版本比较功能，进一步完善UI交互', '开发', '70', '2017-10-12', '8', '20171012', '20171102', '20171114', '本周新增了信息标签功能，后续还会对协议搜索新增一个高级检索功能，版本比较功能放入下周工作');
INSERT INTO `work_detail` VALUES ('504', '信用交易', '', '在线问题', 'BUG#8970', '9.28日300628红股除权，生成公允价格失败，排查下来因为当日有2 002845，2 036198，共7个证券代码有红利红股，但是036198是个权证到账，没有价格，导致查询价格是没查到，直接break了，导致后续的几个代码没有生成公允价格。修改把break改为continue。', '问题排查', '100', '2017-10-09', '0', '20171012', '20171009', '20171009', '');
INSERT INTO `work_detail` VALUES ('505', '信用交易', '', '在线问题', 'BUG#8972', '10.09日128016雨虹转债上市转流通，但是没有生成公允价格，查下来是因为清算录入证券类别录成了66，应该是HH。修改证券模板。', '问题排查', '100', '2017-10-12', '0', '20171012', '20171012', '20171012', '');
INSERT INTO `work_detail` VALUES ('506', '集中交易', '', '业务需求', '子需求#8934', '融资融券交易系统会向集中交易系统推送“xy-信用账户”标示,写流水时加上职工和操作来源', '开发', '100', '2017-10-12', '0', '20171012', '20171012', '20171012', '');
INSERT INTO `work_detail` VALUES ('507', '信用交易', '', '在线问题', '子需求#8967', '上次修改查询客户资产负债时，新加了输出利率字段，但是有些客户合约逾期后开仓，产品编号是空的，导致查询不到利率。但是不能报错退出，可以吧利率输出为0,设计菜单客户资产负债查询，额度申请查询等等有利率输出的菜单', '问题排查', '100', '2017-10-12', '0', '20171012', '20171012', '20171012', '');
INSERT INTO `work_detail` VALUES ('508', '集中交易', '', '业务需求', '需求#7662', '集中交易对股票质押约定购回购回，部分购回不判断创业板交易权限', '开发', '0', '2017-10-16', '1', '20171012', '20171012', '20171017', '');
INSERT INTO `work_detail` VALUES ('509', '信用交易', '', '业务需求', 'BUG#8847', '客户开户流程未结束，没有信用标识的情况下修改联系资料，相关数据未在日终数据时生成，导致管理系统数据不一致。见管理需求#7060', '开发', '10', '2017-10-16', '1', '20171012', '20171012', '20171017', '');
INSERT INTO `work_detail` VALUES ('511', '集中交易', '', '内部优化', '需求 #9010', '20171012 沟通目前统一报盘，快订全业务进度。统一报盘一期需整理测试案例，二期内容和V5BU现有功能重复，金仕达回退。 张哲负责测试环境全套模拟生产。 预定10.31日讨论测试案例。\n统一接入 对自动区分历史服务器的支持需排查。', '设计', '0', '2017-10-12', '90', '20171012', '20171026', '20180215', '1. 多后台同一席位申报\n2. 同一报盘断网，后台某一或多断连，KUF某一或多断连，小站重启\n3. 间歇闪断\n4. 报盘重启漏单补单');
INSERT INTO `work_detail` VALUES ('513', '信用管理', '股票质押', '在线问题', 'BUG #8953', '排查上海违约处置清算时未归还负债的问题', '问题排查', '100', '2017-10-09', '0', '20171012', '20171009', '20171009', '');
INSERT INTO `work_detail` VALUES ('514', '集中交易', '', '内部优化', '需求#9011', '交易编码内存库应用调查', '设计', '90', '2017-10-09', '0', '20171012', '20171019', '20171009', '从胡晶玉老师处取得了DB2端的访问记录，再次进行了分析。分析结果已经提交领导审核');
INSERT INTO `work_detail` VALUES ('515', '集中交易', '', '业务需求', '需求#9012', '分公司审核权限 基于5025版本测试包的复读合包', '复读', '100', '2017-10-12', '0', '20171012', '20171012', '20171012', '代码无法编译，部分变量测试包中没有定义。金仕达后续提交了基于5030版本的测试包，由于海通并不会升级5030版本。后续测试计划待定。');
INSERT INTO `work_detail` VALUES ('517', 'QFII订单系统', 'KSTP', '业务需求', '需求#8074', '后台搭建一整套环境，包括数据库，应用以及初始化数据, 近一步了解后台系统\n搭建服务器 :188.190.12.44 \n数据库版本安装db2 10版本\n快订系统重新搭建，理解后台', '开发', '100', '2017-10-09', '0', '20171013', '20171009', '20171009', '44数据库的迁移过程中实例用户设置与147不同，在还原过程中通过对系统表结构的重定向实现实例用户对数据库的访问。');
INSERT INTO `work_detail` VALUES ('518', 'QFII订单系统', 'KSTP', '业务需求', '需求#8917', '查询不到证券信息之后的报错信息优化', '开发', '50', '2017-10-16', '3', '20171013', '20171020', '20171019', '');
INSERT INTO `work_detail` VALUES ('519', 'QFII订单系统', 'KSTP', '业务需求', '需求#8409', '在“财务佣金核账”中，匹配记录时如金额不完全一致时，可以输入备注信息以留痕。', '开发', '90', '2017-10-13', '0', '20171013', '20171102', '20171102', '');
INSERT INTO `work_detail` VALUES ('520', '信用管理', '管理系统', '业务需求', '需求 #8753', '关于调整信用管理平台股票质押业务集中度参数的需求', '开发', '100', '2017-10-17', '0', '20171013', '20171026', '20171026', '');
INSERT INTO `work_detail` VALUES ('521', '集中交易', '', '业务需求', '需求 #4105', '网厅仓单展期权限开通测试支持', '测试沟通', '60', '2017-10-09', '1', '20171013', '20171027', '20171030', '');
INSERT INTO `work_detail` VALUES ('522', '集中交易', '', '业务需求', '子需求 #8422', '集中交易系统提供修改客户警示属性、其他重要属性、业务控制等接口', '开发', '100', '2017-10-13', '0', '20171013', '20171027', '20171027', '');
INSERT INTO `work_detail` VALUES ('523', '集中交易', '', '监管需求', '需求 #7988', '财富中心大宗减持线上运营问题分析及后续需求沟通', '问题排查', '60', '2017-10-09', '10', '20171013', '20171103', '20171117', '本周完成全部需求分析，下周开始编码');
INSERT INTO `work_detail` VALUES ('524', '信用交易', '', '业务需求', '需求 #9009', '客户融资、融券申请额度查询合同号显示', '开发', '100', '2017-10-13', '0', '20171013', '20171019', '20171013', '');
INSERT INTO `work_detail` VALUES ('525', '信用交易', '', '业务需求', '需求 #6477', '关于优化转融通费用过账文件生成的需求', '开发', '20', '2017-10-30', '3', '20171013', '20171026', '20171102', '这周在跟进修改hoder_acc表内容和#6616，这个顺延到下周');
INSERT INTO `work_detail` VALUES ('526', '信用交易', '', '在线问题', '需求 #8724', '由于财富中心当日未导入减持额度导致客户竞价无法卖出。\n\n通知运行二部，建议开始前检查增加对应表当日日期数据检查脚本跑批。\n通知金仕达尽快完成市场信息转换录入对应减持额度信息。\n--转周万庚\n', '问题排查', '100', '2017-10-12', '0', '20171013', '20171012', '20171012', '');
INSERT INTO `work_detail` VALUES ('527', '信用交易', '', '在线问题', '问题单 #7925', '当日信用账户存在挂账数据导致红利补扣税导入报811. 同步修改集中交易，融资融券，最近版本升级。转曹卓娅\n将集中交易宕账权益处理复制到信用交易系统，让业务提需求后安排开发。', '问题排查', '100', '2017-10-13', '0', '20171013', '20171013', '20171013', '');
INSERT INTO `work_detail` VALUES ('528', '集中交易', '', '内部优化', '需求 #8920', '集中交易资产连续性前期沟通。\n\n20171013-由于目前数仓有在途资产修正，修改时需同步调整。已沟通王正航，后续关注上线风险。', '设计', '10', '2017-10-13', '87', '20171013', '20171025', '20180213', '');
INSERT INTO `work_detail` VALUES ('530', '信用交易', '', '业务需求', '子需求 #6893', '集中交易融资融券的136开头的债券代码sec_price表的assert_price转的有问题，没有加this_profit', '开发', '100', '2017-10-13', '0', '20171013', '20171013', '20171013', '');
INSERT INTO `work_detail` VALUES ('531', '集中交易', '', '业务需求', '子需求 #6892', '集中交易融资融券的136开头的债券代码sec_price表的assert_price转的有问题，没有加this_profit', '开发', '100', '2017-10-13', '0', '20171013', '20171013', '20171013', '');
INSERT INTO `work_detail` VALUES ('532', '集中交易', '', '业务需求', '子需求 #8001', 'ks.cust_base_info所有增删改内容补全', '开发', '0', '2017-10-13', '0', '20171013', '20171019', '20171013', '');
INSERT INTO `work_detail` VALUES ('533', '集中交易', '', '业务需求', '子需求 #8973', '新三板限售股录入系统并提供外围查询\n20171013-  bjsdz DZGFXZ>“00“的数据，发零售谢悦确认展现形式。\n20171019 胡曜晖回复确认客户汇总查询，转周万庚实现。', '设计', '100', '2017-10-13', '0', '20171013', '20171019', '20171013', '');
INSERT INTO `work_detail` VALUES ('535', '集中交易', '', '在线问题', '需求 #9102', '目前公司要求的操作逻辑为 到期日营业部职工应在风控平台查询客户到期应付资金并通知客户。目前风控平台对到期预计透支资金有明确揭示。\n\n和运营沟通过，当时风控，运营都监控出此客户可能透支，并通知此客户，但由于其未连通，无法转入导致最终透支。\n\nPS:按此协作中运营所拟提出需求，我们只能按具体需求对其开通融资购回权限做校验是否连通（避免其可能透支后无法补足的风险），但对于客户若赋权时三方存管状态正常而后又去做银行变更且未连通的情况系统也无法做到有效控制。如确认需开权限时控制请提具体需求\n', '问题排查', '100', '2017-10-13', '0', '20171016', '20171013', '20171013', '客户0350051462（此客户一直在做回购套作）：\n10.12日日终 资金余额10471.26， 融资回购未到期28100张，到期日[20171013]，利息[9.40]（实际融资2809971.9=28100*100-28.1手续费），预解冻下日到期28100张\n10.13日日间 当日新发生一天期回购：28000张，对应融资金额2799972（=28000*100-28手续费）  融资系统只控制股份，资金是入账所以不判断手续费资金是否足够。\n                            当日到期12日发生一天期回购 含利息共计 -2810695.01\n                   则当日日终客户资金余额为10471.26-2810695.01+2799972=-251.75\n集中交易系统融资回购流水中会提示此笔金额对应利息应为多少，如客户12日其中一笔回购流水中：“到期日[20171013]，利息[6.92]，金额[28006.92] ”，按其12日回购流水合计到期利息为695.01. 如需交易系统查询未到期利息可由业务主管部门提出需求后实现。');
INSERT INTO `work_detail` VALUES ('536', '信用交易', '', '在线问题', '问题单 #9109', '20171016日，证金报送文件生成报错，原因为融资偿还红冲业务未统计造成资金连续性校验不平。 \n证金勾稽逻辑有漏洞，程序无问题，以后让业务周五才做单负债的红冲蓝补。', '问题排查', '100', '2017-10-17', '0', '20171017', '20171017', '20171017', '');
INSERT INTO `work_detail` VALUES ('537', '集中交易', '', '项目管理', '需求 #0000', '集中交易，融资融券本周封版总结梳理。', '进度跟踪', '100', '2017-10-17', '0', '20171017', '20171017', '20171017', '');
INSERT INTO `work_detail` VALUES ('538', '集中交易', '', '项目管理', '需求 #0000', '集中交易5026h1版本整理复读。', '复读', '100', '2017-10-18', '0', '20171018', '20171027', '20171027', '');
INSERT INTO `work_detail` VALUES ('543', '集中交易', '', '业务需求', '需求 #9170', '清算录入QTSL个股期权备兑锁券报-803主键冲突', '单元测试', '100', '2017-10-17', '0', '20171018', '20171017', '20171017', '');
INSERT INTO `work_detail` VALUES ('544', '集中交易', '', '内部优化', '需求 #9208', '统一接入代码重写\n1.新增快订系统对应订单中心设置表， 本次初始化数据维护\n2.快订设置426000,490034 设置时无需输入交易中心。自动按初始化数据配置匹配填入CUST_BASE_INFO.TRADE_CENTER_NO和CUST_TRADE_MAP\n3.前台快订客户设置查询输出对应交易中心。\n\n4.后续考虑整理方案，去除g_ksbu_param .iunify_ap ，itransfer为啥要2个参数，可以用营业部内部参数替代。 -周万庚\n5. 网关那统一配置-转给陈凯祥。', '设计', '20', '2017-10-18', '7', '20171018', '20171026', '20171027', '20171026 请李鹤晨介绍方案。');
INSERT INTO `work_detail` VALUES ('545', '集中交易', '', '业务需求', '需求 #8814', ' 三方存管手工冲正和银证转账单边账调整菜单缺少复核功能，等待符合功能好的申请返回。\n本周完毕', '开发', '100', '2017-10-23', '0', '20171019', '20171026', '20171023', '本周完毕');
INSERT INTO `work_detail` VALUES ('546', '集中交易', '', '业务需求', '需求 #9004', '场外基金参数设置 查询优化，完成', '开发', '100', '2017-10-19', '0', '20171019', '20171019', '20171019', '');
INSERT INTO `work_detail` VALUES ('547', '集中交易', '', '业务需求', '需求 #8968', ' 新经纪业务平台下的清算处理步骤没有记录职工操作流水', '开发', '100', '2017-10-19', '0', '20171019', '20171019', '20171019', '');
INSERT INTO `work_detail` VALUES ('548', '信用管理', '股票质押', '业务需求', '需求 #7987', '交易协议书新增出资方字段', '复读', '100', '2017-10-17', '0', '20171019', '20171017', '20171017', '');
INSERT INTO `work_detail` VALUES ('549', '集中交易', '', '业务需求', '需求   #8997', '  集中交易菜单 股份对账和股份对账查询，查询结果展示时，在最后增加四列：', '开发', '100', '2017-10-19', '0', '20171019', '20171019', '20171019', '');
INSERT INTO `work_detail` VALUES ('550', '信用管理', '股票质押', '业务需求', '需求 #8319', '信用管理平台股票质押司法冻结监控菜单功能优化', '复读', '100', '2017-10-17', '0', '20171019', '20171017', '20171017', '');
INSERT INTO `work_detail` VALUES ('551', '信用管理', '股票质押', '业务需求', '需求 #8807', '股票质押利息预估菜单增加导出功能', '复读', '100', '2017-10-17', '0', '20171019', '20171017', '20171017', '');
INSERT INTO `work_detail` VALUES ('552', '信用管理', '股票质押', '业务需求', '需求 #8808', '交易协议书到期监控菜单添加指令类别', '复读', '100', '2017-10-19', '0', '20171019', '20171019', '20171019', '');
INSERT INTO `work_detail` VALUES ('553', '集中交易', '', '业务需求', '需求 #7763', '协助查询柜台代码逻辑等', '开发', '50', '2017-10-16', '5', '20171019', '20171103', '20171110', '');
INSERT INTO `work_detail` VALUES ('554', '信用交易', '', '业务需求', '需求 #6616', '提供仓单展期问题，已经明确需求 ，开始处理\n完成，下次提交', '开发', '100', '2017-10-23', '0', '20171019', '20171103', '20171103', '提供仓单展期问题，已经明确需求 ，开始处理');
INSERT INTO `work_detail` VALUES ('555', '信用交易', '', '内部优化', 'BUG  #8938', '配合完成国际统计报表历史服务器没有配置交易编码问题的单元测试', '单元测试', '100', '2017-10-16', '1', '20171019', '20171019', '20171017', '');
INSERT INTO `work_detail` VALUES ('556', '集中交易', '', '业务需求', '需求 #8333', '配合完成银证接口优化前台测试', '单元测试', '100', '2017-10-16', '3', '20171019', '20171019', '20171019', '');
INSERT INTO `work_detail` VALUES ('557', '集中交易', '', '内部优化', 'BUG #8429', '完成“银证单边账调整，券商发起转出且作废时，资金被解冻两次”问题修正测试', '开发', '100', '2017-10-19', '1', '20171019', '20171019', '20171020', '');
INSERT INTO `work_detail` VALUES ('558', '集中交易', '', '业务需求', '任务 #0000', '配合完成交通银行测试', '单元测试', '100', '2017-10-18', '2', '20171019', '20171019', '20171020', '');
INSERT INTO `work_detail` VALUES ('559', '集中交易', '', '业务需求', '任务 #7760', '复读问题更改，与账户中心讨论接口', '开发', '100', '2017-10-19', '0', '20171019', '20171019', '20171019', '');
INSERT INTO `work_detail` VALUES ('560', '人行征信', '', '项目管理', '任务#7885', '人行征信测试，反馈安硕，协调安硕技术人员处理，以及新的问题处理', '测试沟通', '90', '2017-10-26', '1', '20171019', '20171102', '20171103', '');
INSERT INTO `work_detail` VALUES ('563', '信用交易', '', '业务需求', '子需求 #8009', '同步融资融券系统的风险评测处理与集中交易一致', '开发', '100', '2017-10-17', '0', '20171019', '20171017', '20171017', '');
INSERT INTO `work_detail` VALUES ('564', '信用交易', '', '业务需求', '需求 #7477', '对于融资融券未配置业务，自动生成一条交易变动流水，保证投保勾稽不出问题', '开发', '100', '2017-10-17', '0', '20171019', '20171026', '20171017', '');
INSERT INTO `work_detail` VALUES ('565', '信用管理', '股票质押', '监管需求', '需求 #8933', '股票质押数据报送需要讨论会议', '需求确认', '100', '2017-10-19', '0', '20171019', '20171019', '20171019', '');
INSERT INTO `work_detail` VALUES ('566', '信用交易', '', '业务需求', '任务 #9114', '【投保】投保报送A08、A10的ZDXX（终端信息）校验字符串', '开发', '100', '2017-10-18', '0', '20171019', '20171026', '20171018', '');
INSERT INTO `work_detail` VALUES ('567', '集中交易', '', '业务需求', '任务 #8377', '【投保】投保报送A08、A10的ZDXX（终端信息）校验字符串', '开发', '100', '2017-10-18', '0', '20171019', '20171026', '20171018', '');
INSERT INTO `work_detail` VALUES ('568', '集中交易', '', '业务需求', '子需求 #8001', 'ks.holder_acc增删改格式非交易流水规范', '开发', '100', '2017-10-19', '0', '20171019', '20171026', '20171019', '');
INSERT INTO `work_detail` VALUES ('569', 'QFII订单系统', 'KSTP', '在线问题', '问题单 #9202', '修正深B股二类指令dbf导出数据 交收日期和交收金额不对的问题', '问题排查', '100', '2017-10-18', '0', '20171019', '20171018', '20171018', '');
INSERT INTO `work_detail` VALUES ('570', '小工具', '', '业务需求', '任务#9221', '测试跨平台下SET，MAP的使用性能，目前已经完成了windows下测试，后续还需要完成linux平台下测试', '开发', '100', '2017-10-16', '0', '20171019', '20171102', '20171102', '完成了linux下set，map的测试，测试样本使用陈总提供的数据，结果显示set比map性能要低点，而且linux下set更新元素要先删除，再插入，操作较map麻烦');
INSERT INTO `work_detail` VALUES ('571', '集中交易', '', '业务需求', '任务#9220', '复读陈凯祥修改的集中交易5026-h1专题包中交易编码p423121.sqc，p423109.sqc，p423106.sqc，复读过程中发现的问题，都反馈给陈凯祥进行修改', '复读', '100', '2017-10-17', '0', '20171019', '20171017', '20171017', '');
INSERT INTO `work_detail` VALUES ('572', 'QFII订单系统', 'TPCTS', '业务需求', '需求 #8918', 'tpcts撤单效率差的性能优化', '问题排查', '100', '2017-10-20', '0', '20171019', '20171102', '20171102', '进过对各个执行步骤的分析，发现耗时主要在外调423002上，后续与#9226一并调查，有可能是配置原因');
INSERT INTO `work_detail` VALUES ('573', '集中交易', '', '业务需求', '需求#8339', '学习融资融券清算录入的流程，查看源代码，了结清算整体架构。', '需求确认', '10', '2017-10-30', '6', '20171019', '20171026', '20171107', '');
INSERT INTO `work_detail` VALUES ('574', '集中交易', '', '业务需求', '任务 #8962', '关于挂账账户深港通份额无法自动迁移的问题', '问题排查', '40', '2017-10-11', '2', '20171019', '20171011', '20171013', '');
INSERT INTO `work_detail` VALUES ('575', '集中交易', '', '业务需求', 'BUG#8984', '可转债IPO中签交收日（T+2）银行文件生成错误', '开发', '100', '2017-10-13', '0', '20171019', '20171026', '20171013', '');
INSERT INTO `work_detail` VALUES ('576', '集中交易', '', '业务需求', '任务 #8468', '股权激励计划状态变更引起实时清算报错', '开发', '100', '2017-10-13', '0', '20171019', '20171019', '20171013', '');
INSERT INTO `work_detail` VALUES ('577', 'QFII订单系统', 'KSTP', '业务需求', '需求 #8411', 'TWAP限量策略开发', '开发', '0', '2017-10-20', '10', '20171019', '20171102', '20171116', '本周由于忙其他任务，该任务暂时挂起');
INSERT INTO `work_detail` VALUES ('578', '信用管理', '股票质押', '业务需求', 'BUG #9018', '先做了提前购回，但未购回，后又做了延期，合约查询中的“变更后购回交易金额”显示错误', '开发', '50', '2017-10-19', '1', '20171019', '20171019', '20171020', '');
INSERT INTO `work_detail` VALUES ('580', '信用管理', '股票质押', '业务需求', '子需求 #1863', '在沪市融资创新文件中输出客户股票质押余额数据。', '开发', '100', '2017-10-23', '0', '20171019', '20171026', '20171026', '');
INSERT INTO `work_detail` VALUES ('581', '周边模块', '银证前置', '在线问题', '问题单 #9174', '广发银行bankbu异常终止问题', '问题排查', '100', '2017-10-17', '0', '20171019', '20171102', '20171102', '已经模拟银行端发起的请求，验证了下 ， 11005-银行端发起修改客户资料功能已经支持了, 并且bankbu现在不会再因为请求方的不规范而导致，飞掉,已提交给测试验证');
INSERT INTO `work_detail` VALUES ('582', '集中交易', '', '业务需求', '需求 #9175', '集中交易系统融资回购交易权限开通增加三方存管开通判断', '开发', '100', '2017-10-23', '0', '20171019', '20171026', '20171023', '已开发完成，git分支还没有，所以还没有提交');
INSERT INTO `work_detail` VALUES ('583', 'QFII订单系统', 'TPCTS', '在线问题', '问题单 #9226', '10月18日，运行一部反映， 监控程序报警，tpcts网关负债过大，查看了ksmbcc3 show的status.lst发现委托性能，在下午13:24:50秒之后，骤降，一笔委托(423001)平均处理时间， 仅有14ms.\n处理性能过慢', '问题排查', '100', '2017-10-18', '0', '20171019', '20171102', '20171102', '从数据库层面上面已经优化了 二级费用折扣表 这张表的统计信息，从测试环境验证了，查询性能已经达到了最优, 从每笔查询2ms缩减到 0.5ms以下，但是测试环境100笔每秒的压力测试，tpcts处理还是很慢，通过 ksmbcc3 show能显示出 ,一笔委托大约要耗时45ms,  下次升级准备在生产环境验证一下,tpcts的压力测试');
INSERT INTO `work_detail` VALUES ('584', '周边模块', 'hiswitchbu', '内部优化', '任务 #0000', '陈总提出，使用大商所的数据，来进行c++的set与map 的性能对比 ,包括增删改查，\n测试下来，发现不同平台的测试结果不一样\nlinux平台 map的速度快一些 \nwindows vc 6.0平台 set的速度快一些', '开发', '100', '2017-10-16', '0', '20171019', '20171016', '20171016', '需要近一步跟踪，两个不同平台处理速度不一致的原因（暂时不支持小工具模块，就先使用了周边模块）');
INSERT INTO `work_detail` VALUES ('585', '信用交易', '', '升级', '任务#0000     ', '学习并整理发布文档及流程', '进度跟踪', '40', '2017-10-18', '1', '20171019', '20171026', '20171019', '');
INSERT INTO `work_detail` VALUES ('586', '集中交易', '', '内部优化', '需求#9237', '内存库监控模块的开发', '开发', '30', '2017-10-19', '5', '20171019', '20171102', '20171109', '完善了log功能，并使用fork函数实现了监控进程的后台运行。尝试一些方法来实现与后台进程的通信但均达不到理想结果，决定后续新增共享内存的控制块来达成该目的。');
INSERT INTO `work_detail` VALUES ('587', '集中交易', '', '业务需求', '需求 #9024', '清算日志显示优化-实际购回日期提示改为黑字提示', '开发', '100', '2017-10-16', '2', '20171019', '20171019', '20171018', '');
INSERT INTO `work_detail` VALUES ('588', '集中交易', '', '业务需求', '问题单#7925', '红利补扣税批量冻结多头报错', '问题排查', '100', '2017-10-16', '2', '20171019', '20171019', '20171018', '');
INSERT INTO `work_detail` VALUES ('589', '信用交易', '', '业务需求', '问题单#9017', '红利补扣税批量冻结多头报错', '问题排查', '100', '2017-10-16', '2', '20171019', '20171019', '20171018', '');
INSERT INTO `work_detail` VALUES ('590', '信用交易', '', '项目管理', '任务 #0000', '融资融券V3.21.4.11专题包整理', '进度跟踪', '30', '2017-10-20', '5', '20171020', '20171020', '20171027', '');
INSERT INTO `work_detail` VALUES ('591', '周边模块', 'SPX网关', '业务需求', '需求 #9190', 'SPX数据字典查询功能发布，比较代码并合并代码，编译二进制程序，测试相关功能。', '复读', '100', '2017-10-12', '0', '20171020', '20171012', '20171012', '');
INSERT INTO `work_detail` VALUES ('592', '集中交易', '', '内部优化', '需求 #9170', '清算录入QTSL个股期权备兑锁券报-803主键冲突，金仕达代码复读', '设计', '100', '2017-10-16', '0', '20171020', '20171016', '20171016', '安排胡有亮合并');
INSERT INTO `work_detail` VALUES ('593', '集中交易', '', '业务需求', '需求 #9208', '快速交易客户设置菜单自动添加和修改客户的订单中心号码', '开发', '100', '2017-10-19', '0', '20171020', '20171019', '20171019', '');
INSERT INTO `work_detail` VALUES ('594', '集中交易', '', '内部优化', '需求 #9216', '集中交易及融资融券BDFUNC.INL优化', '开发', '100', '2017-10-18', '0', '20171020', '20171018', '20171018', '');
INSERT INTO `work_detail` VALUES ('595', '信用交易', '', '业务需求', '需求 #8365', '423109 新增交易单位和存放单位输出', '开发', '100', '2017-10-20', '0', '20171020', '20171020', '20171020', '');
INSERT INTO `work_detail` VALUES ('596', '集中交易', '', '业务需求', '问题单 #6205', 'B股指定席位与申报席位不一致的客户无法进行投票类综合业务问题修改', '开发', '100', '2017-10-17', '0', '20171020', '20171017', '20171017', '');
INSERT INTO `work_detail` VALUES ('597', '集中交易', '', '业务需求', '需求 #2123', '中登和集中交易数据字典一致性专题包代码复读', '复读', '100', '2017-10-16', '0', '20171020', '20171103', '20171103', '');
INSERT INTO `work_detail` VALUES ('598', '集中交易', '', '业务需求', '需求 #8364', '423109 新增交易单位和存放单位输出', '开发', '100', '2017-10-20', '0', '20171020', '20171020', '20171020', '');
INSERT INTO `work_detail` VALUES ('599', '信用交易', '', '业务需求', '需求 #9076', '交易编码110112对员工平台豁免权限及员工平台联调支持', '开发', '100', '2017-10-16', '0', '20171020', '20171103', '20171103', '');
INSERT INTO `work_detail` VALUES ('600', '周边模块', 'SPX网关', '业务需求', '需求 #8363', 'SPX新增交易单位和存放单位输出', '开发', '100', '2017-10-20', '0', '20171020', '20171020', '20171020', '');
INSERT INTO `work_detail` VALUES ('601', '集中交易', '', '内部优化', '需求 #8923', '协议委托附加表（KS.XY_ENTRUST_ATTACH）支持转历史库', '需求确认', '20', '2017-10-20', '2', '20171020', '20171103', '20171107', '与金仕达确认设计方案，安排金仕达开发\n20171103：本周未跟踪进度');
INSERT INTO `work_detail` VALUES ('602', '集中交易', '', '监管需求', '需求 #7990', '大宗交易海通特殊需求分析及金仕达沟通。除自动化录入外其他需求均自主开发', '开发', '70', '2017-10-16', '10', '20171020', '20171103', '20171117', '金仕达已经开始迭代开发，本周确定生产文件目录');
INSERT INTO `work_detail` VALUES ('603', '周边模块', 'SPX网关', '业务需求', '需求 #8004', 'SPX 67 新股中签查询增加证券类型字段', '开发', '100', '2017-10-20', '0', '20171020', '20171020', '20171020', '');
INSERT INTO `work_detail` VALUES ('604', '集中交易', '', '业务需求', '需求 #9102', '在回购查询菜单增加预计到期利息的显示，SPX增加回购未到期的查询', '设计', '50', '2017-10-20', '1', '20171020', '20171103', '20171106', '2017-10-26：还没有收到陈凯翔那边的接口确认。\n2017-11-03：设计评估已完，接口已确认。');
INSERT INTO `work_detail` VALUES ('605', '集中交易', '', '业务需求', '需求 #7941', '集中交易423121增加输出区分股票和债券。', '开发', '100', '2017-10-20', '0', '20171020', '20171020', '20171020', '');
INSERT INTO `work_detail` VALUES ('606', '集中交易', '', '业务需求', '需求 #0000', '5026h1版本及融资融券版本质保部测试支持', '测试沟通', '60', '2017-10-16', '5', '20171020', '20171103', '20171110', '编译问题及测试BUG修改');
INSERT INTO `work_detail` VALUES ('607', '集中交易', '', '业务需求', '需求 #7756', '关于新增T+1日欠库测算数据的通知', '需求确认', '100', '2017-10-20', '0', '20171020', '20171103', '20171103', '2017-11-03：确认沪AT+1欠库测算数据（QTSL新增接口）集中交易不予以处理');
INSERT INTO `work_detail` VALUES ('608', '信用交易', '', '业务需求', '需求 #7942', '融资融券423121中签查询，增加输出区分股票和债券', '开发', '100', '2017-10-20', '0', '20171020', '20171020', '20171020', '');
INSERT INTO `work_detail` VALUES ('609', '信用交易', '', '内部优化', '问题单 #9109', '证金报送文件生成报错（因融资偿还红冲业务未统计造成资金连续性校验不平）', '需求确认', '0', '2017-10-20', '2', '20171020', '20171103', '20171107', '2017-11-03：本周未予以排查，安排在下周任务中完成');
INSERT INTO `work_detail` VALUES ('610', '集中交易', '', '培训准备', '任务 #0000', '集中交易结算系统培训', '整理文档', '100', '2017-10-20', '0', '20171020', '20171020', '20171020', '');
INSERT INTO `work_detail` VALUES ('612', 'QFII订单系统', 'KSTP', '业务需求', '需求 #8409', '在“财务佣金核账”功能中当匹配记录时如金额不完全一致时，新增字段输入备注信息写入对应表，并在“财务佣金核账查询”功能中，针对财务核账查询的匹配回退，抹除系统主户日佣金表备注字段中的信息。并增加相应的备注信息展示列。', '开发', '100', '2017-10-16', '0', '20171020', '20171102', '20171102', '');
INSERT INTO `work_detail` VALUES ('613', 'QFII订单系统', 'KSTP', '业务需求', '需求 #8917', '查询不到证券信息之后的报错信息优化', '开发', '50', '2017-10-26', '5', '20171020', '20171026', '20171102', '');
INSERT INTO `work_detail` VALUES ('614', 'QFII订单系统', 'KSTP', '业务需求', '需求 #8409', '在“财务佣金核账”中，匹配记录时如金额不完全一致时，新增字段可以输入备注信息以留痕。', '开发', '100', '2017-10-23', '0', '20171020', '20171026', '20171023', '');
INSERT INTO `work_detail` VALUES ('615', 'QFII订单系统', 'KSTP', '业务需求', '需求 #8728', 'QFII交易系统持续支持交易所大宗交易系统股份减持技术要求', '开发', '50', '2017-10-26', '10', '20171020', '20171102', '20171116', '现阶段对四处前台界面进行了修改，对指令管理（含修改），指令监控，交易查询，委托交易新增大宗交易减持展示部分，在指令管理和详细信息部分（含修改）界面增加了大宗交易减持（受限股份）的操作选项。');
INSERT INTO `work_detail` VALUES ('616', '集中交易', '', '业务需求', '任务 #8335', 'batchlog优化历史库投保部分开发', '开发', '100', '2017-10-20', '0', '20171020', '20171020', '20171020', '');
INSERT INTO `work_detail` VALUES ('626', '集中交易', '', '项目管理', '任务 #0000', '集中交易V5026h1专题包代码复读', '复读', '70', '2017-10-25', '1', '20171025', '20171025', '20171026', '1,ckx,422104,日期不对；2,ckx,422101,输出股权激励标志回退；3,423113，lwx，日志注释，fetch 放到while循环里面，rzrq同步修改在svn上，jzjy的修改在git上；4，zfg，his_done_fc表不要drop；5，B680480，新经纪业务平台下的清算处理步骤记录职工操作流水，业务代码不要用功能号，固定写死9339，功能号写到note备注里面。；6、zmh的银证，p412353.sqc--82位，p412355.sqc--82位，pubfunc.sqc--抬头，pubfunc2.sqc--抬头，bankbus.h--抬头，pubfunc.h--抬头，upt-init.sh，upt-bank_acc.sql---剔除去，放到实施脚本里面，不要放在初始化数据里');
INSERT INTO `work_detail` VALUES ('627', '集中交易', '', '培训准备', '任务 #0000', '交易系统简介培训ppt制作', '整理文档', '100', '2017-10-25', '0', '20171025', '20171025', '20171025', '');
INSERT INTO `work_detail` VALUES ('628', '集中交易', '', '在线问题', '问题单 #0000', '历史库的中登一码通资料录入，内存占用之后突然释放，录入失败。修改通讯平台的超时时间6w改为6K就好了，原因再查。后续先修改为每1w笔commit一次试试效果。', '问题排查', '70', '2017-10-25', '2', '20171025', '20171025', '20171027', '');
INSERT INTO `work_detail` VALUES ('631', '集中交易', '', '在线问题', '需求 #9361', 'qtymtzl100044 13.634GB \nqtzhzl100044.a20 1.178GB\n1.加载内存 全体一码通账户资料文件加载，试下是否可以内部不匹配，后台再匹配。\n转张华伟\n', '问题排查', '50', '2017-10-23', '0', '20171025', '20171023', '20171023', '');
INSERT INTO `work_detail` VALUES ('632', '信用交易', '', '项目管理', '需求 #0000', '复读3.21.4.11', '复读', '100', '2017-10-23', '3', '20171025', '20171023', '20171026', '');
INSERT INTO `work_detail` VALUES ('634', '集中交易', '', '业务需求', '需求 #7886', '#7866   一站式开户,一站式资料修改 时不同步集中交易的警示属性、其他重要属性两个字段到融资融券交易柜台\n本周处理完毕', '开发', '100', '2017-10-23', '0', '20171026', '20171023', '20171023', '本周处理完毕');
INSERT INTO `work_detail` VALUES ('635', '集中交易', '', '业务需求', '需求 #9267', ' #9267 一码通转挂打印前后一致问题,勾选多个做转挂，需要把旧值都打印，不然显示会有疑问\n本周处理完毕', '开发', '100', '2017-10-26', '0', '20171026', '20171026', '20171026', '本周处理完毕');
INSERT INTO `work_detail` VALUES ('636', '信用交易', '', '业务需求', '需求 #9353', 'REF #9353 “大宗减持额度信息录入”菜单，导入日志可以支持全选并复制出来\n完成，等分支，准备提交git\n', '开发', '90', '2017-10-26', '1', '20171026', '20171102', '20171103', '');
INSERT INTO `work_detail` VALUES ('637', '集中交易', '', '业务需求', '需求  #9224', 'REF #9224 “经纪平台场外基金清算入账”菜单，基金公司下拉列表增加可选项  新建“经纪平台场外基金清算入账查询”菜单\n申请相关基础资源', '开发', '20', '2017-10-26', '5', '20171026', '20171103', '20171110', '');
INSERT INTO `work_detail` VALUES ('638', '信用交易', '', '业务需求', '需求   #9354', 'REF  #9354  大宗减持额度信息设置 -增加营业部\n开始   完毕， 等分支提交', '开发', '90', '2017-10-26', '1', '20171026', '20171102', '20171103', '');
INSERT INTO `work_detail` VALUES ('639', '信用交易', '', '业务需求', '需求#7709', '关于剔除融资融券业务网上交易“历史成交”菜单中冗余数据的需求', '单元测试', '100', '2017-10-23', '0', '20171026', '20171102', '20171102', '');
INSERT INTO `work_detail` VALUES ('640', '集中交易', '', '业务需求', '需求#9102', '\"回购查询\"菜单，增加“实际持有日期”，“预计利息”字段', '开发', '60', '2017-10-23', '6', '20171026', '20171102', '20171110', '柜台修改已完成，周边交易编码开发中。');
INSERT INTO `work_detail` VALUES ('641', '信用管理', '股票质押', '业务需求', '需求 #9240', '约定购回、股票质押存量客户适当性相关需求分析，任务细分', '设计', '100', '2017-10-25', '0', '20171026', '20171103', '20171103', '');
INSERT INTO `work_detail` VALUES ('642', '信用管理', '股票质押', '项目管理', '需求 #1142', '网上交易显示股票质押余额，各子需求进度跟踪', '进度跟踪', '90', '2017-10-26', '5', '20171026', '20171103', '20171110', '');
INSERT INTO `work_detail` VALUES ('643', '信用管理', '股票质押', '业务需求', '需求 #1863', '新增股票质押资金、股份余额文件输出', '复读', '100', '2017-10-26', '0', '20171026', '20171103', '20171103', '');
INSERT INTO `work_detail` VALUES ('644', '信用管理', '管理系统', '业务需求', '子需求 #9227', '666615修改接口字段长度，账户中心的长度现在为char（255），请修改：家庭情况、曾参与过的业务、金融资产、个人负债情况、个人资产抵押情况、个人其他对外担保情况等字段长度', '开发', '100', '2017-10-20', '0', '20171026', '20171102', '20171102', '');
INSERT INTO `work_detail` VALUES ('645', '信用管理', '股票质押', '业务需求', '需求 #7338', '网签三方交易协议书需求分析，接口设计，任务细分', '设计', '90', '2017-10-26', '2', '20171026', '20171103', '20171107', '');
INSERT INTO `work_detail` VALUES ('646', '信用管理', '管理系统', '业务需求', '子需求 #9227', '666615修改接口字段长度，账户中心的长度现在为char（255），请修改：家庭情况、曾参与过的业务、金融资产、个人负债情况、个人资产抵押情况、个人其他对外担保情况等字段长度。', '开发', '100', '2017-10-23', '0', '20171026', '20171023', '20171023', '666615修改接口字段长度，账户中心的长度现在为char（255），请修改：家庭情况、曾参与过的业务、金融资产、个人负债情况、个人资产抵押情况、个人其他对外担保情况等字段长度。');
INSERT INTO `work_detail` VALUES ('647', '信用管理', '管理系统', '业务需求', '需求 #8416', '请在融资融券管理系统中，将黑名单、灰名单客户在征信审核环节、批量授信处理环节，审核中心、审批中心、受理业务监控中，高亮显示。', '开发', '100', '2017-10-31', '0', '20171026', '20171102', '20171102', '');
INSERT INTO `work_detail` VALUES ('648', '集中交易', '', '项目管理', '任务 #0001', '海通研发测试云相关的项目统计、外包人员账号开通等事务', '测试沟通', '80', '2017-10-26', '10', '20171026', '20171102', '20171116', '');
INSERT INTO `work_detail` VALUES ('649', '集中交易', '', '项目管理', '任务 #0001', '集中交易5026-h1和融资融券3.21.4.11版本Git打包测试等相关事务处理', '进度跟踪', '100', '2017-10-26', '0', '20171026', '20171102', '20171102', '');
INSERT INTO `work_detail` VALUES ('650', '信用管理', '管理系统', '业务需求', '需求 #7884', '黑盒扫描高风险修正', '问题排查', '50', '2017-10-26', '10', '20171026', '20171102', '20171116', '');
INSERT INTO `work_detail` VALUES ('651', '集中交易', '', '业务需求', '任务#0000', '继续配合完成交通银行冲正测试', '测试沟通', '100', '2017-10-23', '0', '20171026', '20171026', '20171023', '');
INSERT INTO `work_detail` VALUES ('652', '集中交易', '', '业务需求', '需求#7760', '1、完成测试场景文档整理\n2、与账户中心沟通接口\n3、完成复读问题更改', '测试沟通', '100', '2017-10-23', '0', '20171026', '20171023', '20171023', '');
INSERT INTO `work_detail` VALUES ('653', '集中交易', '', '业务需求', '需求 #7662', '集中交易对股票质押约定购回购回，部分购回不判断创业板交易权限', '开发', '50', '2017-10-30', '3', '20171026', '20171103', '20171108', '');
INSERT INTO `work_detail` VALUES ('654', '集中交易', '', '业务需求', '需求 #9102', '\"回购查询\"菜单，增加“实际持有日期”、“预计利息”字段，', '设计', '80', '2017-10-26', '1', '20171026', '20171103', '20171106', '2017-11-03：设计评估完毕（还剩下代码复读）');
INSERT INTO `work_detail` VALUES ('655', '信用交易', '', '内部优化', 'BUG #7850', '复读问题更改', '问题排查', '100', '2017-10-23', '0', '20171026', '20171023', '20171023', '');
INSERT INTO `work_detail` VALUES ('656', '集中交易', '', '内部优化', '子需求 #8927', '交收过账去除HIS_DONE_FC测试结果复读', '复读', '100', '2017-10-26', '0', '20171026', '20171103', '20171103', '安排郑发桂完成\n2017-11-03：本周完成测试结果评估。');
INSERT INTO `work_detail` VALUES ('657', '集中交易', '', '业务需求', '任务 #8962', '关于挂账账户深港通份额无法自动迁移的问题', '设计', '50', '2017-10-26', '1', '20171026', '20171103', '20171106', '安排陈岱宗开发\n2017-11-03：参与设计评估，解决方案需等待设计评审会');
INSERT INTO `work_detail` VALUES ('658', '集中交易', '', '业务需求', '需求#7760', '配合完成测试', '测试沟通', '60', '2017-10-30', '5', '20171026', '20171102', '20171109', '');
INSERT INTO `work_detail` VALUES ('659', '周边模块', '行情转换', '在线问题', 'BUG#9402', '行情转换程序临近收市报错，排查BushMananger.cpp 中调用OpenOrCreate函数出现了系统级别的1450错误。\n根据从MSDN上描述，该错误表明系统当时进行了大量的IO操作，出现了系统级资源不足，导致失败。初步怀疑可能是交易在那段时间内，很短时间内写了很多数据，导致系统的缓冲区超过了限制。', '问题排查', '100', '2017-10-25', '0', '20171026', '20171025', '20171025', '后续打算让生产关注出现该情况时，PC上内存、CPU使用情况，以及当时的DBF文件大小增加了多少。');
INSERT INTO `work_detail` VALUES ('662', '周边模块', '报盘', '业务需求', '任务#9409', '编译redhat6.5环境下v5adp，完成代码修改编译', '开发', '100', '2017-10-24', '0', '20171026', '20171102', '20171102', '');
INSERT INTO `work_detail` VALUES ('663', '信用交易', '', '业务需求', '子需求 #6616', '网上交易（E海通财手机客户端）仓单展期的需求-融资融券\n追加显示字段', '开发', '100', '2017-10-30', '0', '20171026', '20171102', '20171102', '');
INSERT INTO `work_detail` VALUES ('664', '集中交易', '', '内部优化', 'BUG #9395', '5.0.2.6H1升级包数据脚本问题', '开发', '100', '2017-10-26', '0', '20171026', '20171102', '20171102', '');
INSERT INTO `work_detail` VALUES ('665', '集中交易', '', '业务需求', 'BUG#9395', '更新集中交易交易服务器DIVISION2BUSINESS主键', '开发', '100', '2017-10-26', '0', '20171026', '20171026', '20171026', '更新集中交易交易服务器DIVISION2BUSINESS主键为DIVISION_KIND, DIVISION_TYPE, MARKET_CODE, BUSINESS_CODE历史服务器无需更新');
INSERT INTO `work_detail` VALUES ('666', '周边模块', '银证前置', '业务需求', '需求 #9316', '已经进行该问题的分析，并将平安银行bankbu飞掉的问题一并交由金仕达进行处理', '需求确认', '40', '2017-10-30', '5', '20171026', '20171102', '20171109', '需要对字符做截断操作,   注意汉字字符的特殊处理');
INSERT INTO `work_detail` VALUES ('667', '集中交易', '', '业务需求', '需求 #0000', '制定现金赢家压力测试方案，通过脚本生成测试数据，与资管和运营中心配合展开测试', '测试沟通', '50', '2017-10-24', '5', '20171026', '20171103', '20171110', '');
INSERT INTO `work_detail` VALUES ('668', '周边模块', '报盘', '内部优化', '需求#9308', 'V5ADP配置中MERGDONE=1合并成交打开，回报处理有时调用p400106有时调用p400116，需要与金仕达沟通，这里能否优化', '问题排查', '100', '2017-10-27', '0', '20171026', '20171102', '20171102', '');
INSERT INTO `work_detail` VALUES ('669', '集中交易', '', '内部优化', '任务#0000', '完成5.0.3.0代码合并', '复读', '100', '2017-10-26', '0', '20171026', '20171102', '20171102', '');
INSERT INTO `work_detail` VALUES ('670', '信用管理', '股票质押', '升级', 'BUG #9374', 'v1.0.5：修改股票质押、约定购回黑名单控制逻辑的代码中，筛选黑名单客户问题。', '开发', '100', '2017-10-25', '0', '20171026', '20171025', '20171025', '');
INSERT INTO `work_detail` VALUES ('672', '信用管理', '股票质押', '业务需求', '子需求 #9388 ', '柜台交易协议书议价时判断客户风险等级，不允许最低级别客户议价', '开发', '100', '2017-10-30', '0', '20171026', '20171102', '20171102', '');
INSERT INTO `work_detail` VALUES ('673', '信用管理', '股票质押', '业务需求', '子需求 #9389', '柜台交易协议书执行时判断客户适当性匹配情况', '开发', '100', '2017-11-02', '0', '20171026', '20171102', '20171102', '');
INSERT INTO `work_detail` VALUES ('675', '集中交易', '', '业务需求', '需求 #9250', '处理国债逆回购功能优化需求，编写设计文档，设计文档已完成。', '设计', '100', '2017-10-27', '0', '20171027', '20171102', '20171102', '');
INSERT INTO `work_detail` VALUES ('676', '集中交易', '', '内部优化', '需求 #9295', '数据字典查询优化为调用内存库', '设计', '0', '2017-10-27', '1', '20171027', '20171027', '20171030', '');
INSERT INTO `work_detail` VALUES ('677', '集中交易', '', '项目管理', '任务 #0000', '集中交易5026h1专题包上线前整理', '进度跟踪', '60', '2017-10-27', '5', '20171027', '20171103', '20171110', '');
INSERT INTO `work_detail` VALUES ('678', '信用交易', '', '项目管理', '任务 #0000', '融资融券V3.21.4.11专题包上线前整理', '进度跟踪', '70', '2017-10-27', '5', '20171027', '20171103', '20171110', '');
INSERT INTO `work_detail` VALUES ('679', '集中交易', '', '业务需求', '问题单#7925', '红利补扣税导入报错，完善更新', '问题排查', '100', '2017-10-25', '2', '20171027', '20171027', '20171031', '');
INSERT INTO `work_detail` VALUES ('680', '信用交易', '', '业务需求', '问题单#9017', '红利补扣税导入报错，完善更新', '问题排查', '100', '2017-10-25', '0', '20171027', '20171027', '20171027', '');
INSERT INTO `work_detail` VALUES ('681', '集中交易', '', '业务需求', 'BUG#9395', '5.0.2.6H1升级包数据脚本问题', '开发', '100', '2017-10-27', '0', '20171027', '20171027', '20171027', '');
INSERT INTO `work_detail` VALUES ('683', '集中交易', '', '业务需求', '任务 #9220', '复读陈凯祥修改的集中交易5026-h1专题包中交易编码', '复读', '100', '2017-10-30', '0', '20171030', '20171030', '20171030', '');
INSERT INTO `work_detail` VALUES ('684', '集中交易', '', '业务需求', '任务 #0000', '金仕达代码合并：\n1. 合并清算录入，先合并金仕达v5.0.3.0至gitv5.0.3.1；\n2. 后合并金仕达v5.0.3.1至GITv5.0.3.1；\n3. 合并 20170913[经纪业务平台]v5.0.3.0 配合集中交易升级正式包 到 Git V5.0.3.1\n', '整理文档', '100', '2017-10-30', '0', '20171030', '20171030', '20171030', '');
INSERT INTO `work_detail` VALUES ('685', '信用交易', '', '在线问题', 'BUG #9489', '764222林样配债 中登已改为担保交收走普通配股逻辑，但系统由于去年做资产优化，未发现本次变更，导致仍用JSMX（交收通知，交收结果）处理，但配股为T日GH，T+N JSMX交收处理。导致本次T日日终未冻结，幸而业务发现及时。 30日日间临时冻结未造成透支。 \n\n30日交收需紧急修改脚本，支持GH+JSMX交收处理。', '问题排查', '100', '2017-10-30', '0', '20171030', '20171030', '20171030', '');
INSERT INTO `work_detail` VALUES ('686', '集中交易', '', '业务需求', '需求 #0000', 'ETF现金替代退补确认： 130235 目前存在部分货币基金无ETF篮子信息， 请确认是否可以这个代码找不到ETF信息就默认沿用现有代码直接处理。 发金仕达确认', '设计', '10', '2017-11-01', '7', '20171101', '20171101', '20171110', '');
INSERT INTO `work_detail` VALUES ('687', '信用交易', '', '在线问题', 'BUG #0000', '融资融券测试发现历史数据导出，打印导出KS.TRANS_DATA_CFG表之后，就没有反映了，经排查是因为要把.TRANS_DATA_CFG的表名和配置加载到消息队列里面去，但是消息队列写到第165个就写不进去了，然后就假死在那里等待，最后修改了系统消息队列的配置，1、vi /etc/rc.d/rc.local，2、添加 echo  \'4194304\' > /proc/sys/kernel/msgmax			3、 执行生效  .(空格) /etc/rc.d/rc.local--问题解决', '问题排查', '100', '2017-11-01', '0', '20171101', '20171101', '20171101', '');
INSERT INTO `work_detail` VALUES ('688', '集中交易', '', '业务需求', '需求 #9523', '[清算成交数据检查]清算数据检查汇总不平问题修正；（2017年11月1日成交数据检查中选择“清算数据检查明细”查询结果对账正常，但是选择“清算数据检查汇总”，却提示“有不平帐：[2]市场[240200]席位的REAL_DONE对帐共有[1]笔不平记录”）\n', '开发', '100', '2017-11-01', '0', '20171101', '20171101', '20171101', '');
INSERT INTO `work_detail` VALUES ('691', '集中交易', '', '业务需求', '需求 #9414', '#9414  集中交易... \"回购查询\"菜单，增加“实际持有日期”，“预计利息”字段\n等下一个分支提交', '开发', '90', '2017-11-02', '1', '20171102', '20171102', '20171103', '');
INSERT INTO `work_detail` VALUES ('692', '集中交易', '', '业务需求', '需求 #9574', '   创新业务权限菜单增加的时候允许“市场代码”和“股东账户”为空, 集中交易和融资融券修改一下.\n已经提交', '开发', '100', '2017-11-02', '0', '20171102', '20171102', '20171102', '');
INSERT INTO `work_detail` VALUES ('693', '集中交易', '', '业务需求', '需求 #6362', '出借人资格申报，  念齐燕提的问题排查', '问题排查', '100', '2017-11-02', '0', '20171102', '20171102', '20171102', '');
INSERT INTO `work_detail` VALUES ('694', '集中交易', '', '业务需求', '需求 #9617 ', ' REF  一站式信用开户 增加 2个报表    适当性匹配意见及投资者确认书.rpt   产品或服务风险警示及投资者确认书.rpt', '开发', '80', '2017-11-02', '2', '20171102', '20171102', '20171106', '');
INSERT INTO `work_detail` VALUES ('695', 'QFII订单系统', 'KSTP', '在线问题', 'BUG #9500', '修复报表数据查询-成交页签中无法显示证券名称的问题', '问题排查', '100', '2017-10-31', '1', '20171102', '20171031', '20171101', '');
INSERT INTO `work_detail` VALUES ('696', 'QFII订单系统', 'KSTP', '业务需求', '需求 #9421', 'KSTP资金管理风控需求需求确认', '需求确认', '100', '2017-10-31', '2', '20171102', '20171031', '20171102', '');
INSERT INTO `work_detail` VALUES ('697', 'QFII订单系统', 'KSTP', '业务需求', '需求 #9421', 'KSTP资金管理风控需求需求', '开发', '20', '2017-11-02', '7', '20171102', '20171102', '20171113', '');
INSERT INTO `work_detail` VALUES ('698', '集中交易', '', '项目管理', '任务 #0000', '桌面云网络、2017年度IT类制度评改等部门事务处理', '整理文档', '40', '2017-11-01', '8', '20171102', '20171102', '20171114', '');
INSERT INTO `work_detail` VALUES ('699', '周边模块', '报盘', '升级', '任务#9521', '核实5031配套升级包中包含报盘程序修改，上传git代码', '开发', '100', '2017-10-31', '0', '20171102', '20171031', '20171031', '');
INSERT INTO `work_detail` VALUES ('700', '集中交易', '', '升级', '任务#9423', '升级协作升级如下系统的ksmbcc：\n集中交易主系统 AIX7.1  （使用AIX7.1版本ksmbcc3.4）\n集中交易子系统1 REH6.5（使用REH6.5版本ksmbcc3.4）\n集中交易子系统2 REH6.7（使用REH6.5版本ksmbcc3.4）\n集中交易子系统3 REH5.10（使用REH5.8版本ksmbcc3.4）\n集中交易子系统4 REH5.10（使用REH5.8版本ksmbcc3.4）\n融资融券主系统 REH6.5（使用REH6.5版本ksmbcc3.4）\n融资融券快订系统 REH5.8（使用REH5.8版本ksmbcc3.4）', '开发', '100', '2017-10-31', '0', '20171102', '20171031', '20171031', '');
INSERT INTO `work_detail` VALUES ('701', '集中交易', '', '业务需求', '需求 #7002', '证券代码段梳理，129000-129999证券代码设置修正实施脚本。', '开发', '100', '2017-11-02', '0', '20171102', '20171102', '20171102', '');
INSERT INTO `work_detail` VALUES ('702', '信用管理', '股票质押', '升级', 'BUG #9618', '股票质押交易协议书网上执行时，4240参数控制修复', '开发', '100', '2017-11-02', '0', '20171102', '20171102', '20171102', '');
INSERT INTO `work_detail` VALUES ('703', '信用管理', '管理系统', '升级', 'BUG #9374', '修改股票质押、约定购回黑名单控制逻辑关联条件', '开发', '100', '2017-11-02', '0', '20171102', '20171102', '20171102', '');
INSERT INTO `work_detail` VALUES ('704', '信用管理', '管理系统', '业务需求', '需求 #9329', '更新股票质押系统交易协议显示模板中的购回交易金额公式', '开发', '10', '2017-11-06', '2', '20171102', '20171106', '20171108', '');
INSERT INTO `work_detail` VALUES ('705', '信用管理', '股票质押', '业务需求', 'BUG #9018', '股票质押先提前购回再延期后，购回交易金额显示不正确', '开发', '50', '2017-11-07', '2', '20171102', '20171107', '20171109', '');
INSERT INTO `work_detail` VALUES ('706', '周边模块', '报盘', '培训准备', '需求#4182', '阅读统一报盘的源代码，分析报盘程序配置文件中各个配置项作用', '开发', '0', '2017-11-02', '5', '20171102', '20171102', '20171109', '');
INSERT INTO `work_detail` VALUES ('707', '信用管理', '管理系统', '业务需求', '需求 #9363', '在交易系统的其他重要属性新增设置为产品户的客户，如在管理系统中未设置单独维保平仓预警线，请设置平仓线为140%，风控线为160%，补仓线为160%；如已设置，请保留原有设置。', '开发', '0', '2017-11-06', '3', '20171102', '20171106', '20171109', '1 交易日终通过文件形式给其他重要属性给管理系统\n2 管理日终录入其他重要属性\n3 管理日终根据录入的其他重要属性是cp的客户单独设置平仓预警线');
INSERT INTO `work_detail` VALUES ('708', '信用管理', '管理系统', '业务需求', '需求 #9563', '历史融资明细查询与客户历史融券明细查询菜单中，新增字段融资（券）产品，融资（券）利率', '开发', '100', '2017-11-01', '1', '20171102', '20171101', '20171102', '历史库中融券明细并未保存利率信息(bug)，进行额外处理，product_code字段不为空');
INSERT INTO `work_detail` VALUES ('709', '信用管理', '管理系统', '业务需求', '需求 #9621', '现在融资融券管理系统的证券公允价格只能最低设置为0.001元，我部希望可以支持公允价格设置为0元的需求', '开发', '0', '2017-11-06', '1', '20171102', '20171106', '20171107', '');
INSERT INTO `work_detail` VALUES ('710', '集中交易', '', '内部优化', '需求 #8339', '集中交易清算录入支持配置录入', '设计', '10', '2017-11-02', '7', '20171102', '20171102', '20171113', '');
INSERT INTO `work_detail` VALUES ('711', 'QFII订单系统', 'KSTP', '数据维护', '需求 #1458', 'Itrade历史数据迁移，相关脚本复核，以及协作 【应用软件升级2017000679号】的提交 ，准备本周五 11月2日 就行相关的数据迁移\n', '复读', '100', '2017-11-01', '0', '20171102', '20171101', '20171101', '');
INSERT INTO `work_detail` VALUES ('712', 'QFII订单系统', 'UGFIX', '监管需求', '需求 #9487', 'BlackRock客户fix标签新需求, 已经跟业务部门进行了 沟通，对于这些特殊客户的个性话FIX标签的返回，均使用lua脚本进行返回,已经由金仕达杨攀攀提交，待测试和验证,以及和BlackRock的联调', '进度跟踪', '80', '2017-10-30', '5', '20171102', '20171030', '20171106', '该需求属于 欧盟监管局的 监管需求, 发文里面说要到 2018年1月份上线，但是特殊情况下，还是可以进行一段时间的时延');
INSERT INTO `work_detail` VALUES ('713', 'QFII订单系统', 'UGFIX', '业务需求', '需求 #9624', '彭博从SSL加密转换成TLS加密相关修改', '需求确认', '20', '2017-11-02', '20', '20171102', '20171102', '20171130', '业务部门在和 行业内的开发商根网 以及彭博再次沟通了之后， 得知该TLS加密方式可能不涉及到应用层面的修改，只是网络以及数据链路层面的修改，需要 和金仕达的孙永芳确认下，现在 境外的Sungard 的fix引擎 是否支持了TLS的加密方式。如果需要应用层面的修改，那么代码修改难度比较大');
INSERT INTO `work_detail` VALUES ('714', '信用交易', '', '在线问题', '问题单#9398', '对比生产环境数据，生成数据解决脚本并测试', '开发', '80', '2017-11-02', '2', '20171102', '20171102', '20171106', '');
INSERT INTO `work_detail` VALUES ('715', '信用交易', '', '在线问题', '问题单#9247', '可转债首日上市面值不正确问题诊断，查看信息源文件，并学习行情转换程序流程及用法', '问题排查', '20', '2017-11-02', '10', '20171102', '20171102', '20171116', '');
INSERT INTO `work_detail` VALUES ('716', '集中交易', '', '业务需求', 'BUG #9446', '并行清算-集中交易系统“交收过账”偶发写KS.OTHER_CHANGE的死锁', '开发', '100', '2017-11-02', '0', '20171102', '20171102', '20171102', '');
INSERT INTO `work_detail` VALUES ('717', '信用交易', '', '业务需求', 'BUG #9395', '并行清算执行至“历史数据导入”停止，但是“结算监控”中显示的状态是正在执行“历史数据导出”', '问题排查', '100', '2017-11-02', '0', '20171102', '20171102', '20171102', '');
INSERT INTO `work_detail` VALUES ('718', '集中交易', '', '业务需求', '子需求 #9224', 'OFS性能优化1.2-后台修改', '开发', '0', '2017-11-06', '2', '20171102', '20171106', '20171108', '');
INSERT INTO `work_detail` VALUES ('719', '集中交易', '', '业务需求', '子需求 #7758', 'KS.CUST_BASE_INFO 增删改信息补全', '开发', '0', '2017-11-06', '5', '20171102', '20171106', '20171113', '');
INSERT INTO `work_detail` VALUES ('720', '集中交易', '', '业务需求', '需求#9447', '提供调用内存库查询数据字典的接口', '开发', '80', '2017-11-02', '3', '20171102', '20171102', '20171107', '新增了新的接口函数\nT_DICTIONARY * GetRecsDictionaryByBD(char *branch_code, int dict_entry, int *reccount, char *rtnmsg);\n实现功能为输入确定的营业部代码和词典大项，返回所有符合条件的词典小项。\n输入的营业部代码和词典大项不能为空。\n已测试通过，内存库模式和DB2模式均正常工作。\n后续工作增加注释和书写测试报告。');
INSERT INTO `work_detail` VALUES ('721', '周边模块', 'SPX网关', '在线问题', 'BUG #9427', '编译的SPX运行报缺失DLL错误，经排查是使用的HQDLL.dll非发布版本的问题。', '问题排查', '100', '2017-10-30', '1', '20171102', '20171030', '20171031', '');
INSERT INTO `work_detail` VALUES ('722', '周边模块', 'SPX网关', '业务需求', '需求 #9391', 'SPX 689 功能新增两个输入项（股票质押网签交易协议书适当性改造）\n编写SPX资源申请，通过后开发出测试版本。', '开发', '80', '2017-10-30', '1', '20171102', '20171030', '20171031', '');
INSERT INTO `work_detail` VALUES ('723', '周边模块', 'SPX网关', '业务需求', '需求 #9416', 'SPX630、681增加字段（股票质押网签三方交易协议书）\n协议资源申请，批复后开发出测试版，计划在下个版本上线。', '开发', '90', '2017-10-30', '1', '20171102', '20171030', '20171031', '');
INSERT INTO `work_detail` VALUES ('724', '集中交易', '', '内部优化', '需求 #9295', '数据字典查询优化为调用内存库，李昶提供了内存库调用API，待开发', '设计', '30', '2017-10-30', '1', '20171102', '20171030', '20171031', '');
INSERT INTO `work_detail` VALUES ('725', '集中交易', '', '业务需求', '需求 #9261', '集中交易：接供当日即将到期的标准券市值功能接口\n接口定义好了，申请了相关的后台代码和接口资源，后台代码陈岱宗开发好了，SPX待开发测试。', '设计', '90', '2017-10-30', '1', '20171102', '20171030', '20171031', '');
INSERT INTO `work_detail` VALUES ('726', '信用管理', '股票质押', '业务需求', '需求 #9214', '民生银行项目，要求个性化定制客户的预警通知、违约预警通知、违约通知', '设计', '50', '2017-11-03', '2', '20171103', '20171103', '20171107', '');
INSERT INTO `work_detail` VALUES ('727', '信用管理', '股票质押', '业务需求', '需求 #9627', '按照监管报表口径，临时统计股票质押业务基本情况表中部分分类汇总数据情况。', '开发', '100', '2017-10-31', '0', '20171103', '20171031', '20171031', '');
INSERT INTO `work_detail` VALUES ('728', '集中交易', '', '内部优化', '问题单 #9613', '集中交易对账单打印输出成txt文件后可用数量和最新市值位置相反', '开发', '100', '2017-11-03', '0', '20171103', '20171103', '20171103', '');
INSERT INTO `work_detail` VALUES ('729', '集中交易', '', '业务需求', '需求 #1234', '债券合格投资者报备及客户回访需求会议', '设计', '10', '2017-10-31', '10', '20171103', '20171031', '20171114', '');
INSERT INTO `work_detail` VALUES ('730', '集中交易', '', '数据维护', '需求 #0000', '数据维护：上周五T日沪可转债认购清算没有冻结资金，20171030-rzrq洋林配债-配债764222数据维护，\n1-配号查询放大1000倍.sql\n2-沪可转债T+1支持模块化清算的维护.sql\n3-配债投保配置.sql\n4-证金资金余额和股份连续性不平', '问题排查', '100', '2017-11-03', '0', '20171103', '20171103', '20171103', '');
INSERT INTO `work_detail` VALUES ('731', '信用交易', '', '数据维护', '需求 #0000', '20171030-rzrq洋林转债可转债IPO中签794222数据维护，1-可转债IPO支持PP证券类别投保配置.sql，2-证金股份连续性不平', '问题排查', '100', '2017-11-03', '0', '20171103', '20171103', '20171103', '');
INSERT INTO `work_detail` VALUES ('732', '集中交易', '', '在线问题', '问题单 #0000', '生产客户买入了配号代码764222，委托时冻结资金，交易所废单后没有解冻资金，排查下来疑似是因为交易所返回的废单数量是0，按部分成交处理了。也就是说废单处理成了部分成交，部分成交数量为0，所以只改了委托的状态，但是没有解冻资金。待确认。', '问题排查', '70', '2017-11-03', '3', '20171103', '20171103', '20171108', '');
INSERT INTO `work_detail` VALUES ('733', '集中交易', '', '项目管理', '需求 #9619', '登陆日志留痕验收时发现，网上交易的调用接口为61号->901号，901只是验证通讯密码，登录日志只记录在61调用的后台编码里面。 但是e海通财是先901->在61.所以若果先输错了通讯密码，则没有记录错误的登录日志，如果通信密码正确，交易密码错误，也就是901会通过，最后到61验证出错则会记录。--可修改e海通财的登录验证顺序。后台不做修改。', '问题排查', '100', '2017-11-03', '0', '20171103', '20171103', '20171103', '');
INSERT INTO `work_detail` VALUES ('734', '信用交易', '', '在线问题', '需求 #0000', '20171103日260营业部003397职工，查询16年之前的客户交易流水，报错职工状态不正常，经排查是因为以20160101日为界，新加了归档库，然后16年之前的数据走了分库网关到了归档库查询，该职工刚好是16年新加的职工，所以16年之前的数据查询时报错。后面外高桥会把职工表同步到归档库过去。', '问题排查', '100', '2017-11-03', '0', '20171103', '20171103', '20171103', '');
INSERT INTO `work_detail` VALUES ('735', '集中交易', '', '内部优化', '任务 #7057', '登录信息留痕完善,增加登录流水，每次登录成功失败都记录流水，不在控制登录次数', '开发', '100', '2017-10-30', '0', '20171103', '20171103', '20171103', '');
INSERT INTO `work_detail` VALUES ('736', '信用交易', '', '内部优化', '任务 #7582', '登录信息留痕完善,增加登录流水，每次登录成功失败都记录流水，不在控制登录次数', '开发', '100', '2017-11-03', '0', '20171103', '20171103', '20171103', '');
INSERT INTO `work_detail` VALUES ('737', '集中交易', '', '内部优化', '需求 #8809', ' 新经纪业务平台下的清算处理步骤没有记录职工操作流水, 非交易流水的业务代码改为9339，并添加备注\n', '开发', '100', '2017-11-03', '0', '20171103', '20171103', '20171103', '');
INSERT INTO `work_detail` VALUES ('738', '信用交易', '', '内部优化', '需求 #8810', '新经纪业务平台下的清算处理步骤没有记录职工操作流水, 非交易流水的业务代码改为9339，并添加备注', '开发', '100', '2017-11-03', '0', '20171103', '20171103', '20171103', '');
INSERT INTO `work_detail` VALUES ('739', '集中交易', '', '业务需求', '需求#7560', '清算日志查询菜单功能优化  需求变更', '开发', '100', '2017-10-30', '2', '20171103', '20171103', '20171107', '');
INSERT INTO `work_detail` VALUES ('740', '集中交易', '', '升级', '任务#0000', '合并v5.0.3.0和v5.0.3.1代码至GIT主线v5.0.3.1', '整理文档', '100', '2017-10-30', '1', '20171103', '20171103', '20171106', '');
INSERT INTO `work_detail` VALUES ('741', '集中交易', '', '业务需求', '需求#9502', '梳理所有清算用流水备份表（KS.FUND_STK_CHG_FC_BK）生成-->回滚-->删除的逻辑，考虑去除这张表。直接使用FC表过账。', '整理文档', '100', '2017-11-01', '2', '20171103', '20171101', '20171103', '');
INSERT INTO `work_detail` VALUES ('743', '集中交易', '', '业务需求', '问题单#7925', '批量冻结多头报错问题修改完善', '开发', '90', '2017-11-01', '2', '20171103', '20171101', '20171103', '');
INSERT INTO `work_detail` VALUES ('744', '信用交易', '', '内部优化', '需求 #9529', '修改融资融券股票配售（债券配售）清算逻辑支持T+1日反冲交收', '开发', '100', '2017-11-03', '0', '20171103', '20171103', '20171103', '2017-11-03：完成开发、测试，安排在最新版本中上线');
INSERT INTO `work_detail` VALUES ('745', '集中交易', '', '内部优化', 'BUG #0000', '可转债IPO生产环境问题排查、数据维护脚本等', '开发', '100', '2017-11-03', '0', '20171103', '20171103', '20171103', '');
INSERT INTO `work_detail` VALUES ('746', '集中交易', '', '业务需求', '需求 #7968', '关于基金定投业务系统改造需求的协作', '开发', '0', '2017-11-03', '5', '20171103', '20171103', '20171110', '');
INSERT INTO `work_detail` VALUES ('747', '集中交易', '', '业务需求', 'BUG #9630', '投保报送A12，A16勾稽关系不平时，没写KS.ZJJKSB_A16_OTH', '开发', '0', '2017-11-02', '0', '20171103', '20171103', '20171103', '');
INSERT INTO `work_detail` VALUES ('748', '集中交易', '', '业务需求', '需求 #9615', '[投保报送]集中交易支持510810的4018股息入账配置', '开发', '0', '2017-11-06', '3', '20171103', '20171106', '20171109', '');
INSERT INTO `work_detail` VALUES ('749', '周边模块', '市场信息转换', '培训准备', '需求 #0000', '市场信息转换系统代码深度，理解。', '复读', '100', '2017-10-20', '0', '20171103', '20171020', '20171020', '');
INSERT INTO `work_detail` VALUES ('751', '周边模块', '市场信息转换', '培训准备', '需求 #0000', '市场信息转换系统代码理解。', '复读', '100', '2017-11-03', '0', '20171103', '20171103', '20171103', '');

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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xgroup
-- ----------------------------
INSERT INTO `xgroup` VALUES ('12', '结算组', '4', '1');
INSERT INTO `xgroup` VALUES ('13', '交易组', '5', '1');
INSERT INTO `xgroup` VALUES ('14', '管理组', '24', '1');
INSERT INTO `xgroup` VALUES ('15', '周边组', '15', '1');
INSERT INTO `xgroup` VALUES ('16', '一人组', '3', '1');

-- ----------------------------
-- Table structure for xholiday
-- ----------------------------
DROP TABLE IF EXISTS `xholiday`;
CREATE TABLE `xholiday` (
  `date` char(8) NOT NULL,
  PRIMARY KEY (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xholiday
-- ----------------------------
INSERT INTO `xholiday` VALUES ('20171002');
INSERT INTO `xholiday` VALUES ('20171003');
INSERT INTO `xholiday` VALUES ('20171004');
INSERT INTO `xholiday` VALUES ('20171005');
INSERT INTO `xholiday` VALUES ('20171006');
