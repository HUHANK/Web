# -*- coding:utf-8 -*-

HTTP_SERVER_MASTER = '10.10.14.36'
HTTP_SERVER_PORT = 5000

MAIN_PROCESS_NUM = 8



#MySQL Config
MYSQL_HOST = '10.10.14.36'
MYSQL_PORT = 3306
MYSQL_USER = 'root'
MYSQL_PWD  = '123456'
MYSQL_DB   = 'weekreportsys'

# Global Value Defined
Options = {}


#---Redmine config----
REDMINE_HOST = '10.10.14.56'
"""用户自定义查询的ID，ID必须与API_KEY配对，否则发生权限问题"""
REDMINE_QUERY_ID = 299
"""用户的API访问键"""
REDMINE_API_KEY = '8388252dfccf7d9e0a7aeb079ddeacf669261891'
#REDMINE_API_KEY = 'e00b59970e8eedcbaf2a1906a927613ba7c5f543'

#------------------GIT----------------------------------
GIT_REPO_BASE_PATH = './git'
GIT_JZJY_URL = 'http://wb_hyl:hyl12345678@10.10.12.120/rzrq/jzjy.git'
GIT_RZRQ_URL = ''
