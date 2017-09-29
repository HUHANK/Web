# -*- coding:utf-8 -*-
from config import *
from PubFunc import *
from MySQL_db import *
import  json

# def initSession():
#     data = ReadFile(SESSION_DATA_PATH)
#     if data == "":
#         return
#     Options["session"] = json.loads(data)

def addSession(sid, sdata):
    db = Options['mysql']
    sql = "insert into session(id, uname, login_time) values('%s', '%s', %s)" % (str(sid), sdata.get("UserName", ""), sdata.get("login_time", 0))
    if db.update(sql) < 0:
        print "Session 数据库添加失败！"
        return  False
    return True

def findSession(sid):
    ret = {}
    db = Options['mysql']
    sql = "select * from session where id = '%s'" % (str(sid))
    rs = db.select2(sql)
    if len(rs["data"]) > 0:
        if rs["data"][0].get("uname", None) is not None:
            ret["UserName"] = rs["data"][0]["uname"]
            return ret
    return None