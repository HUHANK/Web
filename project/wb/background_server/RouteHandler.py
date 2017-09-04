# -*- coding:utf-8 -*-

import json
from wrap import  route
from MySQL_db import *
from Session import *
import uuid
from MTime import *


@route("/")
def index(data) :
    return data


@route("/test/")
def test(data):
    param = json.loads(data)
    start = (param['page']-1)*param['page_size']
    sql = "select * from WEEK_REPORT limit %s, %s" % (start, param['page_size'])
    db = Options['mysql']
    result = db.select(sql)
    result = json.dumps(result)
    return result

@route("/login")
def login(data):
    db = Options['mysql']
    param = json.loads(data)
    sql = "select count(*) from user where UNAME='%s'" % (param['UserName'])

    ret = db.select(sql)
    rs = {}
    print ret['datas'][0][0]
    if (ret['datas'][0][0] > 0) :
        sql = "select count(*) from user where UNAME='%s' and UPWD='%s'" % (param['UserName'], param['PassWord'])
        ret = db.select(sql)
        if ret['datas'][0][0] > 0 :
            sql = "UPDATE user set LAST_LOGIN_TIME = CURRENT_TIMESTAMP() WHERE UNAME='%s' and UPWD='%s'" % (param['UserName'], param['PassWord'])
            if db.update(sql) == False :
                print u"跟新user表时间出错！"
            rs['result'] = "OK"
            rs["note"] = ""
            rs["sessionid"] = str(uuid.uuid4())

            se = addSession(rs["sessionid"])
            se["user_name"] = param['UserName'];
            se["login_time"] = getNowTimestamp()
        else:
            rs['result'] = "NO"
            rs["note"] = u"用户密码不对！"
    else:
        rs['result'] = "NO"
        rs["note"] = u"无此用户！"

    return json.dumps(rs)

@route("/baseinfo")
def baseinfo(data):
    ret = {}
    (year, day) = getNowYearWeek()
    ret["Year"] = year
    ret["Day"] = day

@route("/dict")
def getdict(data):
    db = Options['mysql']
    data = json.loads(data)
    method = data.get("method", None)
    result = {}
    if method == "GET" :
        sql = "SELECT TABLE_NAME,COL_NAME, NOTE FROM dictionary where DIC_TYPE = 0 and TABLE_NAME='work_detail' and COL_NAME in ('SysModule','Type','Property')"
        ret = db.select(sql)
        datas = ret['datas'];
        for i in range(len(datas)):
            tbname = datas[i][0]
            colname = datas[i][1]
            note = datas[i][2]

            result[colname] = {}
            result[colname]["note"] = note
            sql = "SELECT NOTE FROM dictionary where DIC_TYPE = 1 and TABLE_NAME='%s' and COL_NAME = '%s'" % (tbname, colname)
            r = db.select(sql)
            r = r['datas']
            sql = ""
            for j in range(len(r)):
                sql += r[j][0]
            r = sql.split(',')
            for j in range(len(r)):
                if r[j].strip() == "":
                    del r[j]
            result[colname]["data"] = r
    #print result
    return json.dumps(result)







