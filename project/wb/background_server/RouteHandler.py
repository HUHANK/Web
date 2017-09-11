# -*- coding:utf-8 -*-

import json
from wrap import  route
from MySQL_db import *
from Session import *
import uuid
from MTime import *
from PubFunc import *


@route("/")
def index(data) :
    return data

@route("/login")
def login(data):
    db = Options['mysql']
    param = json.loads(data)
    sql = "select count(*) from user where UNAME='%s'" % (param['UserName'])

    ret = db.select(sql)
    rs = {}
    #print ret['datas'][0][0]
    if (ret['datas'][0][0] > 0) :
        sql = "select count(*) from user where UNAME='%s' and UPWD='%s'" % (param['UserName'], param['PassWord'])
        ret = db.select(sql)
        if ret['datas'][0][0] > 0 :
            sql = "UPDATE user set LAST_LOGIN_TIME = CURRENT_TIMESTAMP() WHERE UNAME='%s' and UPWD='%s'" % (param['UserName'], param['PassWord'])
            if db.update(sql) < 0 :
                print u"跟新user表时间出错！"
            rs['result'] = "OK"
            rs["note"] = ""
            rs["sessionid"] = str(uuid.uuid4())

            sdata = {}
            sdata["UserName"] = param['UserName']
            sdata["login_time"] = getNowTimestamp()
            se = addSession(rs["sessionid"], sdata)
            se["user_name"] = param['UserName']
            se["login_time"] = getNowTimestamp()
            #print Options["session"]
            #print json.dumps(Options["session"])
            WriteFile(SESSION_DATA_PATH, json.dumps(Options["session"]))
        else:
            rs['result'] = "NO"
            rs["note"] = u"用户密码不对！"
    else:
        rs['result'] = "NO"
        rs["note"] = u"无此用户！"

    return json.dumps(rs)

@route("/baseinfo/")
def baseinfo(data):
    db = Options['mysql']
    data = json.loads(data)
    sessionData = findSession(data.get("SessionID", ""))
    if sessionData is None:
        print "baseinfo 用户没有登录！"
        return ""
    userName = sessionData.get("UserName", "")
    ret = {}
    sql = "select NOTE from user where UNAME='%s'" % (userName)
    res = db.select(sql)
    ret["UserName"] = res["datas"][0][0]

    ret["Date"] = getNowDate1()
    (year, week, day) = getNowYearWeek()
    ret["Week"] = week
    return json.dumps(ret)

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
    if method == "ADD":
        value = data.get("value", None)
        key = data.get("key", None)
        if key is None:
            return ""
        sql = "select NOTE from dictionary where DIC_TYPE=1 and TABLE_NAME = 'work_detail' and COL_NAME = '%s'" % (key)
        ret = db.select(sql)
        ret = ret['datas'][0][0]
        if ret.find(value) < 0 :
            ret = ret + value + ","
            sql = "update dictionary set Note = '%s' where DIC_TYPE=1 and TABLE_NAME = 'work_detail' and COL_NAME = '%s'" % (ret,key)
            db.update(sql)
        if key == "SysModule":
            pass
        if key == "Type":
            pass
        if key == "Property":
            pass
    return json.dumps(result)

@route("/report/")
def reportProcess(data):
    data = json.loads(data)
    sessionData = findSession(data.get("SessionID", ""))
    if sessionData is None:
        print u"用户未登录！"
        return ""
    userName = sessionData.get("UserName", "")
    db = Options['mysql']
    (Year, Week, Day) = getNowYearWeek()

    if data["method"] == "ADD":
        sql = "INSERT INTO work_detail(SysModule,Type,TraceNo,Detail,Property,ProgressRate,StartDate,NeedDays,Note) VALUES(" \
              "'%s', '%s','%s','%s','%s',%s, '%s', %s, '%s')" %(data['SysModule'], data['Type'], data["TraceNo"], data["WorkDetail"], \
                data["Property"], data["ProgressRate"], data["StartDate"], data["NeedDays"], data["Notes"])
        id = db.update(sql)

        sql = "SELECT UID FROM user where UNAME = '%s'" %(userName)
        ret = db.select(sql)
        UID = ret["datas"][0][0]
        Week = Week + data.get("week", 0)
        sql = "INSERT INTO user_work(UID,WID, YEAR, WEEK) VALUES(%s, %s, %s, %s)" % (UID, id, Year, Week)
        db.update(sql)
        return ""
    elif data["method"] == "GET":
        Week = Week + data.get("week", 0)
        headers = ["跟踪号","系统", "类型", "工作内容", "性质", "进度"]
        sql = "SELECT C.TraceNo, C.SysModule, C.Type, C.Detail, C.Property, C.ProgressRate " \
              "FROM user_work A LEFT JOIN user B on A.UID = B.UID LEFT JOIN work_detail C ON A.WID = C.id " \
              "WHERE B.UNAME = '%s' AND A.YEAR = %s AND A.WEEK = %s" % (userName, Year, Week)
        ret = db.select(sql)
        result = {}
        result['header'] = headers
        result['data'] = ret["datas"]
        return json.dumps(result)
    return ""

@route("/home")
def getHomeData(data):
    data = json.loads(data)
    sessionData = findSession(data.get("SessionID", ""))
    if sessionData is None:
        print u"用户没有登录！"
        return ""
    userName = sessionData.get("UserName", "")
    db = Options['mysql']
    (Year, Week, Day) = getNowYearWeek()
    headers = ["跟踪号", "系统", "类型", "工作内容", "性质", "进度"]
    sql = "SELECT C.TraceNo, C.SysModule, C.Type, C.Detail, C.Property, C.ProgressRate " \
          "FROM user_work A LEFT JOIN user B on A.UID = B.UID LEFT JOIN work_detail C ON A.WID = C.id " \
          "WHERE B.UNAME = '%s' AND A.YEAR = %s AND A.WEEK = %s" % (userName, Year, Week)
    ret = db.select(sql)
    result = {}
    result["bzgz"] = {}
    result["bzgz"]['header'] = headers
    result["bzgz"]['data'] = ret["datas"]
    return json.dumps(result)

@route("/getuserinfo")
def getUserInfo(data):
    data = json.loads(data)
    db = Options['mysql']

    if data.get("method", "") == "GET" :
        if data["name"].lower() == "all":
            sql = "select UID, NOTE from user"
            ret = db.select(sql)
            ret = json.dumps(ret["datas"])
            return ret

    return ""

@route("/query")
def queryData(data):
    data = json.loads(data)
    #print data
    headers = ["ID", "用户名", "系统(模块)", "类型", "跟踪号", "工作内容","性质", "进度", "开始日期", "后续人日", "备注"]
    sql = "select  B.id, C.NOTE, SysModule, Type, TraceNo, Detail, " \
          "Property, ProgressRate, StartDate, NeedDays, B.Note " \
          "from user_work A left join work_detail B on A.WID = B.id " \
          " left join user C on A.UID = C.UID "
    scond = iArray2Str(data["User"])
    if len(scond) > 0:
        scond = " where A.UID in ("+scond+") "

    ret = sArray2Str(data["SysModule"])
    if len(ret) > 0:
        if len(scond) > 0:
            scond += "and SysModule in (" + ret + ") "
        else:
            scond += "where SysModule in (" + ret + ") "

    ret = sArray2Str(data["Property"])
    if len(ret) > 0:
        if len(scond) > 0:
            scond += "and Property in (" + ret + ") "
        else:
            scond += "where Property in (" + ret + ") "

    ret = sArray2Str(data["Type"])
    if len(ret) > 0:
        if len(scond) > 0:
            scond += "and Type in (" + ret + ") "
        else:
            scond += "where Type in (" + ret + ") "

    sql += scond + " limit " + str(data["Page"]*data["PageSize"]) + ", " + str(data["PageSize"])
    db = Options['mysql']

    ret = db.select(sql)
    res = {}
    res["header"] = headers
    res["data"] = ret["datas"]

    return json.dumps(res)


@route("/query1")
def queryData(data):
    #print data
    data = json.loads(data)
    headers = ["ID", "用户名", "系统(模块)", "类型", "跟踪号", "工作内容","性质", "进度", "开始日期", "后续人日", "备注"]
    sql = "select  B.id, C.NOTE as UserName, SysModule, Type, TraceNo, Detail, " \
          "Property, ProgressRate, StartDate, NeedDays, B.Note " \
          "from user_work A left join work_detail B on A.WID = B.id " \
          " left join user C on A.UID = C.UID "
    sqlt = "select   count(1) " \
          "from user_work A left join work_detail B on A.WID = B.id " \
          " left join user C on A.UID = C.UID "
    scond = iArray2Str(data["User"])
    if len(scond) > 0:
        scond = " where A.UID in ("+scond+") "

    ret = sArray2Str(data["SysModule"])
    if len(ret) > 0:
        if len(scond) > 0:
            scond += "and SysModule in (" + ret + ") "
        else:
            scond += "where SysModule in (" + ret + ") "

    ret = sArray2Str(data["Property"])
    if len(ret) > 0:
        if len(scond) > 0:
            scond += "and Property in (" + ret + ") "
        else:
            scond += "where Property in (" + ret + ") "

    ret = sArray2Str(data["Type"])
    if len(ret) > 0:
        if len(scond) > 0:
            scond += "and Type in (" + ret + ") "
        else:
            scond += "where Type in (" + ret + ") "

    sql += scond + " limit " + str(data["Page"]*data["PageSize"]) + ", " + str(data["PageSize"])
    db = Options['mysql']

    ret = db.select(sql)

    field_name = []
    for i in range(len(ret["fields"])):
        field_name.append( ret["fields"][i]["name"] )
    #print field_name
    res = {}
    res["rows"] = []
    for v in ret["datas"]:
        tmp = {}
        for i in range(len(v)):
            tmp[field_name[i]] = v[i]
        res["rows"].append(tmp)
    #print res

    sql = sqlt + scond
    ret = db.select(sql)
    #print ret
    res["totalCount"] = ret["datas"][0][0]
    #res["total"] = (data["PageSize"] >= res["totalCount"] ? res["totalCount"] :
    if data["PageSize"] >= res["totalCount"] :
        res["total"] = res["totalCount"]
    else:
        res["total"] = data["PageSize"]

    if int(res["total"]) != 0:
        res["totalPage"] = int(res["totalCount"]) % int(res["total"])
        if int(res["totalCount"]) % int(res["total"]) == 0:
            res["totalPage"] = int(res["totalCount"]) / int(res["total"])
        else:
            if int(res["totalCount"]) <= int(res["total"]):
                res["totalPage"] = 1;
            else:
                res["totalPage"] = (int(res["totalCount"]) / int(res["total"])) + 1
    else:
        res["totalPage"] = 0

    return json.dumps(res)



