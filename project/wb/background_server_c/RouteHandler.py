# -*- coding:utf-8 -*-

import json
from wrap import  route
from MySQL_db import *
from Session import *
import uuid
from MTime import *
from PubFunc import *
import base64


@route("/")
def index(data) :
    return data

@route("/logout")
def logout(data):
    data = json.loads(data)
    db = Options['mysql']
    ret = {}

    sql = "delete from session where id = '%s'" % (data.get("SessionID", ''))
    if db.update(sql) < 0:
        setErrMsg(ret, 2, "数据库跟新失败")
    else:
        setErrMsg(ret, 0, "")

    return json.dumps(ret)

@route("/login")
def login(data):
    db =  Options['mysql']
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
                print u"update user time Error!"
            rs['result'] = "OK"
            rs["note"] = ""
            rs["sessionid"] = str(uuid.uuid4())

            sdata = {}
            sdata["UserName"] = param['UserName']
            sdata["login_time"] = getNowTimestamp()
            addSession(rs["sessionid"], sdata)
            # se["user_name"] = param['UserName']
            # se["login_time"] = getNowTimestamp()
            #print Options["session"]
            #print json.dumps(Options["session"])
            #WriteFile(SESSION_DATA_PATH, json.dumps(Options["session"]))
        else:
            rs['result'] = "NO"
            rs["note"] = u"用户密码不对！"
    else:
        rs['result'] = "NO"
        rs["note"] = u"无此用户！"

    return json.dumps(rs)

@route("/baseinfo/")
def baseinfo(data):
    db =  Options['mysql']
    data = json.loads(data)
    ret = {}
    sessionData = findSession(data.get("SessionID", ""))
    if sessionData is None:
        #print "baseinfo 用户没有登录！"
        setErrMsg(ret, 1, "baseinfo 用户没有登录！")
        return json.dumps(ret)
    userName = sessionData.get("UserName", "")

    sql = "select NOTE from user where UNAME='%s'" % (userName)
    res = db.select(sql)
    ret["UserName"] = res["datas"][0][0]

    ret["Date"] = getNowDate1()
    (year, week, day) = getNowYearWeek()
    ret["Week"] = week

    sql = "select UID id, UNAME ename, NOTE cname, group_id, B.name group_name from user A LEFT JOIN xgroup B ON A.group_id = B.id"
    rs = db.select2(sql)
    ret["Users"] = rs["data"]

    sql = "SELECT id, name, manager from department"
    rs = db.select2(sql)
    ret["Departs"] = rs["data"]

    sql = "select * from xgroup"
    rs = db.select2(sql)
    ret["Groups"] = rs["data"]

    #---------------------------SYSTEM----------------------
    sql = "select id, name from dict where name = '系统'"
    rs = db.select2(sql)
    ret["System"] = rs["data"][0]

    sql = "select id, name from dict where parent = %s" % (ret["System"]["id"])
    rs = db.select2(sql)
    ret["System"]["data"] = rs["data"]
    #print ret["System"]
    for i in range(len(rs["data"])):
        sql = "select id, name from dict where parent = %s" % (rs["data"][i]["id"])
        rss = db.select2(sql)
        ret["System"]["data"][i]["data"] = rss["data"]

    #--------------------------TYPE--------------------------
    sql = "select id, name from dict where name = '类型'"
    rs = db.select2(sql)
    ret["Type"] = rs["data"][0]

    sql = "select id, name from dict where parent = %s" % (ret["Type"]["id"])
    rs = db.select2(sql)
    ret["Type"]["data"] = rs["data"]

    #--------------------------PROPERTY--------------------------
    sql = "select id, name from dict where name = '性质'"
    rs = db.select2(sql)
    ret["Property"] = rs["data"][0]

    sql = "select id, name from dict where parent = %s" % (ret["Property"]["id"])
    rs = db.select2(sql)
    ret["Property"]["data"] = rs["data"]

    setErrMsg(ret, 0, "")
    return json.dumps(ret)

@route("/dict")
def getdict(data):
    db =  Options['mysql']
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

def updateEditDate(db, id):
    sql = "update work_detail set EditDate = %s where id = %s" % (getNowDate2(), id)
    db.update(sql)

@route("/report/")
def reportProcess(data):
    data = json.loads(data)
    #print data
    sessionData = findSession(data.get("SessionID", ""))
    if sessionData is None:
        #print u"用户未登录！"
        return ""
    userName = sessionData.get("UserName", "")
    db =  Options['mysql']
    (Year, Week, Day) = getNowYearWeek()
    ret = {}

    if data["method"] == "ADD":
        #print data
        (SYear, SWeek, Day) = getYearWeek(data["StartDate"])

        if SYear > Year :
            Year = SYear
            Week = SWeek
        elif SYear == Year and SWeek > Week:
            Week = SWeek
        #Week = Week + data.get("Week", 0)
        #特殊转换区
        editDate = data["StartDate"];
        editDate = editDate[0]+editDate[1]+editDate[2]+editDate[3]+editDate[5]+editDate[6]+editDate[8]+editDate[9]

        Detail = data["Detail"].replace("'", "''")
        Note = data["Note"].replace("'", "''")
        #---------------------------------------------------------
        sql = "INSERT INTO work_detail(System, Module,Type,TraceNo,Detail,Property,ProgressRate,StartDate,NeedDays,Note, AddDate, EditDate, ExpireDate) VALUES(" \
              "'%s', '%s', '%s','%s','%s','%s',%s, '%s', %s, '%s', '%s', '%s', '%s')" %(
                data['System'], data['Module'], data['Type'], data["TraceNo"], Detail, \
                data["Property"], data["ProgressRate"], data["StartDate"], data["NeedDays"], Note,
                getNowDate2(), editDate, CalExpireDate(db, data["StartDate"], data["NeedDays"]))
        id = db.update(sql)
        if id < 0:
            setErrMsg(ret, 2, "数据库插入失败！")
            return json.dumps(ret)

        sql = "SELECT UID FROM user where UNAME = '%s'" %(userName)
        ret = db.select(sql)
        UID = ret["datas"][0][0]
        sql = "INSERT INTO user_work(UID,WID, YEAR, WEEK) VALUES(%s, %s, %s, %s)" % (UID, id, Year, Week)
        if db.update(sql) < 0 :
            setErrMsg(ret, 2, "数据库插入失败！")
            return json.dumps(ret)
        setErrMsg(ret, 0, "")
        return json.dumps(ret)
    elif data["method"] == "UPDATE":
        #print data
        d = data
        # 特殊转换区
        Detail = d["Detail"].replace("'", "''")
        Note = d["Note"].replace("'", "''")
        EditDate = d["EditDate"]
        EditDate = EditDate[0]+EditDate[1]+EditDate[2]+EditDate[3]+ EditDate[5]+EditDate[6]+ EditDate[8]+EditDate[9];
        #-----------------------------------------------------
        sql = "update work_detail set System='%s', Module='%s', Type='%s', TraceNo='%s', Detail='%s', Property='%s', ProgressRate=%s, EditDate='%s', NeedDays=%s, Note='%s', ExpireDate='%s' where id=%s" \
            % (d["System"], d["Module"], d["Type"],d["TraceNo"],Detail,d["Property"],d["ProgressRate"],
               EditDate,d["NeedDays"],Note, CalExpireDate(db, d["EditDate"], d["NeedDays"]),
               d["id"])
        #print sql
        if db.update(sql) < 0:
            setErrMsg(ret, 2, u"数据库跟新失败！")
            return json.dumps(ret)
        setErrMsg(ret, 0, "")
        return json.dumps(ret)

    elif data["method"] == "GETSIG":
        id = data.get("id", -1)
        sql = "select * from work_detail where id = %s" % (id)
        rs = db.select2(sql)
        if rs == None:
            setErrMsg(ret, 2, u"数据库查询失败！")
            return json.dumps(ret)
        ret["data"] = rs["data"]
        setErrMsg(ret, 0, "")
        return json.dumps(ret)
    elif data["method"] == "GET":
        #sql = "SELECT C.id, C.TraceNo, C.System, C.Module, C.Type, C.Detail, C.Property, C.ProgressRate, C.Note " \
        (wFirstDay, wLastDay) = getWeekFirstLastday("%s#%s" % (Year,Week))
        ret["WeekFirstDay"] = wFirstDay;
        ret["WeekLastDay"] = wLastDay;

        sql = "SELECT C.* " \
                "FROM user_work A LEFT JOIN user B on A.UID = B.UID LEFT JOIN work_detail C ON A.WID = C.id " \
                "WHERE B.UNAME = '%s' AND A.YEAR = %s AND A.WEEK = %s" % (userName, Year, Week)
        rs = db.select2(sql)
        ret["current"] = rs["data"]

        (NYear, NWeek) = getNextWeek(Year, Week)
        tmp = "%s#%s" % (NYear, NWeek)
        NextWeekFirstDay = getWeekFirstday(tmp)
        tmp = NextWeekFirstDay
        NextWeekFirstDay2 = tmp[0] + tmp[1] +tmp[2] +tmp[3] +tmp[5] +tmp[6] +tmp[8] +tmp[9]
        sql = "SELECT C.* " \
              "FROM user_work A LEFT JOIN user B on A.UID = B.UID LEFT JOIN work_detail C ON A.WID = C.id " \
              "WHERE B.UNAME = '%s' AND A.YEAR = %s AND A.WEEK = %s " \
              "UNION " \
              "SELECT C.*  " \
              "FROM user_work A LEFT JOIN user B on A.UID = B.UID LEFT JOIN work_detail C ON A.WID = C.id " \
              "WHERE B.UNAME = '%s' AND  A.YEAR = %s AND A.WEEK = %s " \
              " AND C.ProgressRate < 100 AND C.StartDate < '%s' AND C.ExpireDate >= '%s'" \
              % (userName, NYear, NWeek, userName, Year, Week, NextWeekFirstDay, NextWeekFirstDay2)
        rs = db.select2(sql)
        ret["next"] = rs["data"]
        setErrMsg(ret, 0, "")
        return json.dumps(ret)
    elif data["method"] == "DELETE":
        dweek = data.get("week", None)
        if dweek is None:
            setErrMsg(ret, 3, u"您所传的参数中没能找到week，请检查！")
            return json.dumps(ret)
        (dYaer, dWeek, dDay) = getYearLastWeek(Year)
        #print "################### ",dYaer, dWeek
        sql = ""
        if dWeek == Week:
            sql = "delete from user_work where WID=%s and WEEK=%s and YEAR=%s" % (data.get("id", -1), 1, (Year+1))
        elif dWeek > Week:
            sql = "delete from user_work where WID=%s and WEEK=%s and YEAR=%s" % (data.get("id", -1), (Week+dweek), Year)
        #print sql
        if db.update(sql) < 0:
            setErrMsg(ret, 2, u"数据库删除失败!")
            return json.dumps(ret)
        sql = "select * from user_work where WID=%s" % (data.get("id", -1))
        rs = db.select2(sql)
        if len(rs["data"]) <= 0:
            sql = "delete from work_detail where id=%s" % (data.get("id", -1))
            if db.update(sql) < 0:
                setErrMsg(ret, 2, u"数据库删除失败!")
                return json.dumps(ret)
        setErrMsg(ret, 0, "")
        return json.dumps(ret)
    elif data["method"] == "TURN_NEXT":
        sql = "select * from user_work where WID=%s and WEEK = %s" % (data.get("id", -1), Week+1)
        rs = db.select2(sql)
        #print rs["data"]
        if len(rs["data"]) > 0:
            setErrMsg(ret, 3, u"该任务已经在下周里面，无法重复添加！");
            return json.dumps(ret)

        sql = "INSERT into user_work(UID, WID, YEAR, WEEK) SELECT UID, WID, YEAR, WEEK+1 from user_work where WID = %s and WEEK = %s" % (data.get("id", -1), Week)
        if db.update(sql) < 0:
            setErrMsg(ret, 2, u"数据库跟新失败！")
            return json.dumps(ret)
        updateEditDate(db, data.get("id", -1));

        setErrMsg(ret, 0, "")
        return json.dumps(ret)

    setErrMsg(ret, 3, "未知参数！")
    return json.dumps(ret)

@route("/pubinterface/")
def pubInterface(data):
    data = json.loads(data)
    db = Options['mysql']
    ret = {}
    method = data.get("method",None)

    if method is None:
        setErrMsg(ret, 2, "未知的方法！")
    elif method == "GET_EXPIRE_DATE":
        ret["ExpireDate"] = CalExpireDate(db, data["StartDate"], data["NeedDays"])
        setErrMsg(ret, 0, "")

    return json.dumps(ret)

@route("/home")
def getHomeData(data):
    data = json.loads(data)
    sessionData = findSession(data.get("SessionID", ""))
    ret = {}
    db =  Options['mysql']
    if sessionData is None:
        setErrMsg(ret, 0,  u"用户没有登录！")
        return json.dumps(ret)
    userName = sessionData.get("UserName", "")
    (Year, Week, Day) = getNowYearWeek()

    sql = "select B.NOTE User, C.* from user_work A LEFT JOIN user B on A.UID = B.UID LEFT JOIN work_detail C on A.WID = C.id " \
          "where B.UNAME = '%s' and A.YEAR = %s and A.WEEK = %s" % (userName, Year, Week)
    rs = db.select2(sql)
    if rs == None:
        setErrMsg(ret, 2, "数据库查询失败！")
        return json.dumps(ret)
    ret["data"] = rs["data"]

    sql = "select B.NOTE User, C.* from user_work A LEFT JOIN user B on A.UID = B.UID LEFT JOIN work_detail C on A.WID = C.id " \
            " where A.YEAR = %s and A.WEEK = %s " \
            " AND A.UID in (" \
            " select UID from user where group_id in (select id from xgroup where manager in (select UID from user where UNAME = '%s')) and UNAME != '%s'" \
            " ) ORDER BY 1, 3,4,5" % (Year, Week, userName, userName)
    rs = db.select2(sql)
    if rs == None:
        setErrMsg(ret, 2, "数据库查询失败！")
        return json.dumps(ret)
    ret["cbzgz"] = rs["data"]
    if len(rs["data"]) > 0 :
        ret["isManager"] = 1
    else:
        ret["isManager"] = 0

    (NYear, NWeek) = getNextWeek(Year, Week)
    tmp = "%s#%s" % (NYear, NWeek)
    NextWeekFirstDay = getWeekFirstday(tmp)
    tmp = NextWeekFirstDay
    NextWeekFirstDay2 = tmp[0] + tmp[1] + tmp[2] + tmp[3] + tmp[5] + tmp[6] + tmp[8] + tmp[9]

    sql = "select B.NOTE User, C.* from user_work A LEFT JOIN user B on A.UID = B.UID LEFT JOIN work_detail C on A.WID = C.id " \
          " where A.YEAR = %s and A.WEEK = %s " \
          " AND A.UID in (" \
          " select UID from user where group_id in (select id from xgroup where manager in (select UID from user where UNAME = '%s')) and UNAME != '%s'" \
          " ) " % (NYear, NWeek, userName, userName)
    sql += " UNION "
    sql += "select B.NOTE User, C.* from user_work A LEFT JOIN user B on A.UID = B.UID LEFT JOIN work_detail C on A.WID = C.id " \
            " where A.YEAR = %s and A.WEEK = %s " \
            " AND C.ProgressRate < 100 AND C.StartDate <= '%s' AND C.ExpireDate >= '%s'" \
            " AND A.UID in (" \
            " select UID from user where group_id in (select id from xgroup where manager in (select UID from user where UNAME = '%s')) and UNAME != '%s'" \
            " ) ORDER BY 1, 3,4,5 " % (Year, Week, NextWeekFirstDay, NextWeekFirstDay2, userName, userName)
    rs = db.select2(sql)
    if rs == None:
        setErrMsg(ret, 2, "数据库查询失败！")
        return json.dumps(ret)
    ret["cxzgz"] = rs["data"]
    if ret["isManager"] == 0 and len(rs["data"]) > 0:
        ret["isManager"] = 1

    setErrMsg(ret, 0, "")
    return json.dumps(ret)

@route("/getuserinfo")
def getUserInfo(data):
    data = json.loads(data)
    db =  Options['mysql']
    ret = {}
    method = data.get("method", "")
    if method == "" :
        setErrMsg(ret, 1, u"参数不对！")


    if data.get("method", "") == "GET" :
        if data["name"].lower() == "all":
            sql = "select UID, NOTE from user"
            ret = db.select(sql)
            ret = json.dumps(ret["datas"])
            return ret
    elif method == "GET_USERS":
        sql = "SELECT A.UID, A.group_id, A.UNAME, A.NOTE, DATE_FORMAT(A.LAST_LOGIN_TIME, '%Y-%m-%d %H:%i:%s') LAST_LOGIN_TIME, B.name FROM user A LEFT JOIN xgroup B on A.group_id = B.id"
        res = db.select2(sql)
        ret["data"] = res["data"]
        setErrMsg(ret, 0, "")

    return json.dumps(ret)

def genQuerySQL(data):
    #data = json.loads(data)
    #print data

    sql = "select A.UID, C.NOTE UNAME, C.group_id, concat(A.YEAR,'年第',A.WEEK,'周') WEEK, B.* " \
          "from user_work A LEFT JOIN work_detail B on A.WID = B.id LEFT JOIN user C ON A.UID=C.UID "
    condi = data.get("condition", None)

    if condi == None:
        return sql

    user = condi.get("user", None)
    type = condi.get("type", None)
    property = condi.get("property", None)
    system = condi.get("system", None)
    module = condi.get("module", None)
    week = condi.get("week", None)
    schedule = condi.get("schedule", None)
    delay = condi.get("delay", None)
    sortType = condi.get("sortType", None)
    sortCols = condi.get("sortCols", None)
    bPRate = 0
    sqlsort = ""
    sqlcondi = ""

    if sortType != None and sortCols != None:
        if len(sortCols) > 0:
            sqlsort = " order by "
            for col in sortCols:
                if col == "Group":
                    sqlsort += "C.group_id,"
                else:
                    sqlsort += col + ","
            sqlsort = sqlsort.rstrip(",")
            if sortType == "ASCE":
                sortType = "ASC"
            sqlsort += " " + sortType + " "
            # print sqlsort

    if user != None:
        if len(user) > 0:
            sqlcondi += " A.UID in ("
            for i in range(len(user)):
                sqlcondi += str(user[i].get("id", 0)) + ","
            sqlcondi = sqlcondi.rstrip(",")
            sqlcondi += ") "
    if type != None:
        if len(type) > 0:
            if len(sqlcondi) > 0:
                sqlcondi += " AND "
            sqlcondi += " B.Type in ("
            for i in range(len(type)):
                sqlcondi += "'" + str(type[i].get("name", "")) + "',"
            sqlcondi = sqlcondi.rstrip(",")
            sqlcondi += ") "
    if property != None:
        if len(property) > 0:
            if len(sqlcondi) > 0:
                sqlcondi += " AND "
            sqlcondi += " B.Property in ("
            for i in range(len(property)):
                sqlcondi += "'" + str(property[i].get("name", "")) + "',"
            sqlcondi = sqlcondi.rstrip(",")
            sqlcondi += ") "

    if system != None:
        if len(system) > 0:
            if len(sqlcondi) > 0:
                if module != None and len(module) > 0:
                    sqlcondi += " AND (B.System in ( "
                else:
                    sqlcondi += " AND B.System in ("
            else:
                if module != None and len(module) > 0:
                    sqlcondi += " (B.System in ("
                else:
                    sqlcondi += " B.System in ("
            for i in range(len(system)):
                sqlcondi += "'" + str(system[i].get("name", "")) + "',"
            sqlcondi = sqlcondi.rstrip(",")
            sqlcondi += ") "

    if module != None:
        if len(module) > 0:
            if len(sqlcondi) > 0:
                if system != None and len(system) > 0:
                    sqlcondi += " OR "
                else:
                    sqlcondi += " AND "
            sqlcondi += " B.Module IN ("
            for i in range(len(module)):
                sqlcondi += "'" + str(module[i].get("name", "")) + "',"
            sqlcondi = sqlcondi.rstrip(",")
            if system != None and len(system) > 0:
                sqlcondi += ")) "
            else:
                sqlcondi += ") "

    if week != None:
        if len(week) > 0:
            if len(sqlcondi) > 0:
                sqlcondi += " AND "
            sqlcondi += " A.WEEK BETWEEN %s AND %s and A.YEAR = %s " % (
            week.get("start", 0), week.get("end", 0), week.get("year", 0))
    if schedule != None:
        if len(sqlcondi) > 0 and schedule >= 0:
            sqlcondi += " AND "
        if schedule == 0:
            sqlcondi += " B.ProgressRate BETWEEN 0 AND 99 "
            bPRate = 1
        elif schedule == 100:
            sqlcondi += " B.ProgressRate = 100 "
            bPRate = 2
    if delay != None:
        if len(sqlcondi) > 0 and delay >= 0:
            sqlcondi += " AND "
        if delay == 0:
            # sqlcondi += " date_add(B.StartDate, INTERVAL (B.NeedDays+1)*24 hour) >= now() "
            if bPRate == 0:
                sqlcondi += " ((ProgressRate=100 and ExpireDate>=EditDate) or (ProgressRate!=100 and ExpireDate>='%s')) " % (
                getNowDate2())
            elif bPRate == 1:
                sqlcondi += " ExpireDate>='%s' " % (getNowDate2())
            elif bPRate == 2:
                sqlcondi += " ExpireDate>=EditDate "
        if delay == 1:
            # sqlcondi += " date_add(B.StartDate, INTERVAL (B.NeedDays+1)*24 hour) < now() "
            if bPRate == 0:
                sqlcondi += " ((ProgressRate=100 and ExpireDate<EditDate) or (ProgressRate!=100 and ExpireDate<'%s')) " % (
                getNowDate2())
            elif bPRate == 1:
                sqlcondi += " ExpireDate<'%s' " % (getNowDate2())
            elif bPRate == 2:
                sqlcondi += " ExpireDate<EditDate "

    if len(sqlcondi) > 0:
        sql += " where " + sqlcondi + sqlsort
    else:
        sql += sqlsort
    return  sql

@route("/query/")
def queryData(data):
    data = json.loads(data)
    #print data
    ret = {}
    db =  Options['mysql']

    sql = "select A.UID, C.NOTE UNAME, C.group_id, concat(A.YEAR,'年第',A.WEEK,'周') WEEK, B.* " \
          "from user_work A LEFT JOIN work_detail B on A.WID = B.id LEFT JOIN user C ON A.UID=C.UID "
    sqlc = "select count(*) COUNT from user_work A LEFT JOIN work_detail B on A.WID = B.id "
    sqllimit = " limit " + str(data.get("page", 0)*data.get("pageSize", 0)) + "," + str(data.get("pageSize", 0))
    condi = data.get("condition", None)
    if condi == None:
        rs = db.select2(sqlc)
        #print rs["data"]
        ret["total"] = rs["data"][0].get("COUNT", 0)
        rs = db.select2(sql + sqllimit)
        ret["data"] = rs["data"]
        setErrMsg(ret, 0, "")
        return json.dumps(ret)

    user = condi.get("user", None)
    type = condi.get("type", None)
    property = condi.get("property", None)
    system = condi.get("system", None)
    module = condi.get("module", None)
    week = condi.get("week", None)
    schedule = condi.get("schedule", None)
    delay = condi.get("delay", None)
    sortType = condi.get("sortType", None)
    sortCols = condi.get("sortCols", None)
    bPRate = 0
    sqlsort = ""
    sqlcondi = ""

    if sortType != None and sortCols != None:
        if len(sortCols) > 0 :
            sqlsort = " order by "

            if sortType == "ASCE":
                sortType = "ASC"
            for col in sortCols:
                if col == "Group":
                    sqlsort += "C.group_id %s," % (sortType)
                else:
                    sqlsort += col + " " + sortType + ","
            sqlsort = sqlsort.rstrip(",")

            sqlsort += " "
            #print sqlsort
        else:
            sqlsort = " order by EditDate desc, A.UID desc"
    else:
        sqlsort = " order by EditDate desc, A.UID desc "

    if user != None:
        if len(user) > 0:
            sqlcondi += " A.UID in ("
            for i in range(len(user)):
                sqlcondi += str(user[i].get("id", 0)) + ","
            sqlcondi = sqlcondi.rstrip(",")
            sqlcondi += ") "
    if type != None:
        if len(type) > 0 :
            if len(sqlcondi) > 0 :
                sqlcondi += " AND "
            sqlcondi += " B.Type in ("
            for i in range(len(type)):
                sqlcondi += "'" + str(type[i].get("name", "")) + "',"
            sqlcondi = sqlcondi.rstrip(",")
            sqlcondi += ") "
    if property != None:
        if len(property) > 0:
            if len(sqlcondi) > 0:
                sqlcondi += " AND "
            sqlcondi += " B.Property in ("
            for i in range(len(property)):
                sqlcondi += "'" + str(property[i].get("name", "")) + "',"
            sqlcondi = sqlcondi.rstrip(",")
            sqlcondi += ") "
    if system != None:
        if len(system) > 0:
            if len(sqlcondi) > 0:
                if module != None and len(module) > 0:
                    sqlcondi += " AND (B.System in ( "
                else:
                    sqlcondi += " AND B.System in ("
            else:
                if module != None and len(module) > 0:
                    sqlcondi += " (B.System in ("
                else:
                    sqlcondi += " B.System in ("
            for i in range(len(system)):
                sqlcondi += "'" + str(system[i].get("name", "")) + "',"
            sqlcondi = sqlcondi.rstrip(",")
            sqlcondi += ") "

    if module != None:
        if len(module) > 0:
            if len(sqlcondi) > 0:
                if system != None and len(system) > 0:
                    sqlcondi += " OR "
                else:
                    sqlcondi += " AND "
            sqlcondi += " B.Module IN ("
            for i in range(len(module)):
                sqlcondi += "'" + str(module[i].get("name", "")) + "',"
            sqlcondi = sqlcondi.rstrip(",")
            if system != None and len(system) > 0:
                sqlcondi += ")) "
            else:
                sqlcondi += ") "

    if week != None:
        if len(week) > 0:
            if len(sqlcondi) > 0:
                sqlcondi += " AND "
            sqlcondi += " A.WEEK BETWEEN %s AND %s and A.YEAR = %s " % (week.get("start", 0), week.get("end", 0), week.get("year", 0))
    if schedule != None:
        if len(sqlcondi) > 0 and schedule >= 0:
            sqlcondi += " AND "
        if schedule == 0:
            sqlcondi += " B.ProgressRate BETWEEN 0 AND 99 "
            bPRate = 1
        elif schedule == 100:
            sqlcondi += " B.ProgressRate = 100 "
            bPRate = 2
    if delay != None:
        if len(sqlcondi) > 0 and delay >= 0:
            sqlcondi += " AND "
        if delay == 0:
            #sqlcondi += " date_add(B.StartDate, INTERVAL (B.NeedDays+1)*24 hour) >= now() "
            if bPRate == 0:
                sqlcondi += " ((ProgressRate=100 and ExpireDate>=EditDate) or (ProgressRate!=100 and ExpireDate>='%s')) " % (getNowDate2())
            elif bPRate == 1:
                sqlcondi += " ExpireDate>='%s' " % (getNowDate2())
            elif bPRate == 2:
                sqlcondi += " ExpireDate>=EditDate "
        if delay == 1:
            #sqlcondi += " date_add(B.StartDate, INTERVAL (B.NeedDays+1)*24 hour) < now() "
            if bPRate == 0:
                sqlcondi += " ((ProgressRate=100 and ExpireDate<EditDate) or (ProgressRate!=100 and ExpireDate<'%s')) " % (getNowDate2())
            elif bPRate == 1:
                sqlcondi += " ExpireDate<'%s' " % (getNowDate2())
            elif bPRate == 2:
                sqlcondi += " ExpireDate<EditDate "

    if len(sqlcondi) > 0:
        sql += " where " + sqlcondi + sqlsort + sqllimit
        sqlc += " where " + sqlcondi
    else:
        sql += sqlsort + sqllimit

    rs = db.select2(sqlc)
    ret["total"] = rs["data"][0].get("COUNT", 0)
    #print sqlsort
    #print sql
    rs = db.select2(sql)
    ret["data"] = rs["data"]

    setErrMsg(ret, 0, "")
    return json.dumps(ret)


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
    db =  Options['mysql']

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

@route("/sjwh_xgmm/")
def modifyUserPwd(data):
    data = json.loads(data)
    ret = {}
    ses = findSession(data.get("SessionID", ""))
    if ses == None :
        setErrMsg(ret, 1, u"请确认该用户是否登录！")
    else:
        db =  Options['mysql']
        UserName = ses.get("UserName", "")
        sql = "select UID from user where UNAME = '%s' and UPWD='%s'" % (UserName, data.get("OldPwd", ""))
        rs = db.select(sql)
        if rs["total"] > 0 :
            sql = "update user set UPWD = '%s' Where UID = %s" % (data.get("NewPwd", ""), rs["datas"][0][0])
            if db.update(sql) < 0:
                setErrMsg(ret, 3, u"密码修改失败！")
            else:
                setErrMsg(ret, 0, u"密码修改成功！")
        else:
            setErrMsg(ret, 2, u"原密码不正确！")
    return json.dumps(ret)

@route("/sjwh_bmgl/")
def sjwhbmgl(data):
    data = json.loads(data)
    #print data
    db =  Options['mysql']
    ret = {}
    if data.get("method", "") == "GET":
        sql = "select A.id, A.name , B.NOTE manager from department A LEFT JOIN user B on A.manager = B.UID"
        rs = db.select2(sql)
        if rs == None:
            setErrMsg(ret,2, u"查询数据库失败！")
        else:
            ret["data"] = rs["data"]
            setErrMsg(ret, 0, "")
    elif data.get("method", "") == "ADD":
        sql = "insert into department(name, manager) values('%s',%s)" % (data.get("depart", ""), data.get("manager", ""))
        if db.update(sql) < 0:
            setErrMsg(ret, 2, u"数据库插入数据错误!")
        else:
            setErrMsg(ret, 0, "")
    elif data.get("method", "") == "DELETE":
        sql = "delete from department where id=%s" % (data.get("id", -1))
        if db.update(sql) < 0:
            setErrMsg(ret, 2, u"数据库删除失败！")
        else:
            setErrMsg(ret, 0, "")
    else:
        setErrMsg(ret, 1, u"参数不正确!")
    return json.dumps(ret)

@route("/sjwh_xzgl/")
def sjwhxzgl(data):
    data = json.loads(data)
    #print data
    db =  Options['mysql']
    ret = {}
    method = data.get("method", "")
    if method == "GET":
        sql = "select A.id, A.name, C.NOTE manager, B.name depart from xgroup A LEFT JOIN department B on A.depart_id = B.id LEFT JOIN user C on A.manager = C.UID"
        rs = db.select2(sql)
        if rs == None:
            setErrMsg(ret, 2, u"数据库查询失败！")
        else:
            ret["data"] = rs["data"]
            setErrMsg(ret, 0, "")
    if method == "ADD":
        sql = "INSERT into xgroup(name, manager, depart_id) values('%s', %s, %s)" % (data.get("name", ""), data.get("manager", ""), data.get("depart", ""))
        if db.update(sql) < 0:
            setErrMsg(ret, 2, u"数据库插入失败！")
        else:
            setErrMsg(ret, 0, "")
    if method == "DELETE":
        sql = "DELETE from xgroup where id = %s" % (data.get("id", 0))
        if db.update(sql) <  0:
            setErrMsg(ret, 2, u"数据库删除失败！")
        else:
            setErrMsg(ret, 0, "")
    if method == "GET_GROUP_USER":
        sql = "select group_id, UID id, A.NOTE user_name from user A  join xgroup B on A.group_id = B.id where A.group_id = %s"%(data.get("id", -1))
        rs = db.select2(sql)
        #print sql
        if rs == None:
            setErrMsg(ret, 2, u"数据库查询失败！")
        else:
            ret["data"] = rs["data"]
            setErrMsg(ret, 0, "")
    if method == "UPDATE_USER_GROUP":
        sql = "update user set group_id = %s where UID= %s" % (data.get("gid",-1), data.get("uid", -1))
        if db.update(sql) < 0:
            setErrMsg(ret, 2, "数据库跟新失败！")
        else:
            setErrMsg(ret, 0, "")
    if method == "DELETE_USER_GROUP":
        sql = "update user set group_id = 0 where UID = %s" %(data.get("id", -1))
        if db.update(sql) < 0:
            setErrMsg(ret, 2, "数据库跟新失败！")
        else:
            setErrMsg(ret, 0, "")
    return json.dumps(ret)

@route("/sjwh_zdwh")
def sjwhzdwh(data):
    sdata = json.loads(data)
    #print sdata
    db =  Options['mysql']
    ret = {}
    dict = {}
    method = sdata.get("method", "")
    if method == "GET":
        sql = "select * from dict"
        rs = db.select2(sql)
        data = rs["data"]
        for i in range(len(data)):
            dict[data[i]["id"]] = data[i]

    if method == "GET":
        condi = sdata.get("condi", "")
        sql = ""
        for key in condi:
            if sql == "":
                sql += " WHERE "+ key + " = " + str(condi[key]) + " "
            else:
                sql += " OR " + key + " = " + str(condi[key]) + " "
        sql = "select * from dict " + sql
        rs = db.select2(sql);
        if rs is None:
            setErrMsg(ret, 2, "数据库查询出错!")
            return json.dumps(ret)
        data = rs["data"]
        for i in range(len(data)):
            if data[i]["parent"] > 0:
                data[i]["parent"] = dict[data[i]["parent"]]["name"]
            else:
                data[i]["parent"] = ""
            if data[i]["title"] > 0:
                data[i]["title"] = dict[data[i]["title"]]["name"]
            else:
                data[i]["title"] = ""
        ret["data"] = data
        setErrMsg(ret, 0, "")

    if method == "ADD":
        sql = "INSERT INTO dict(name, parent, isRoot) VALUES('%s', %s, %s)" % \
              (sdata.get("name", ""), sdata.get("parent", 0), sdata.get("isRoot", 0))
        if db.update(sql) < 0:
            setErrMsg(ret, 2, u"数据库插入失败!")
        else:
            setErrMsg(ret, 0, "")

    if method == "DELETE":
        sql = "delete from dict where id = %s" % (sdata.get("id", -1))
        if db.update(sql) < 0:
            setErrMsg(ret, 2, u"数据库删除失败!")
        else:
            setErrMsg(ret, 0, "")

    return json.dumps(ret)

@route("/query_tree/")
def queryTree(data):
    data = json.loads(data)
    db =  Options['mysql']
    ret = []
    tmp = {}
    method = data.get("method", "")
    if method == "GET":
        #开发部门
        tmp = {}
        tmp["id"] = 0
        tmp["layer"] = 0
        tmp["attr"] = ""
        tmp["name"] = u"开发部门"
        tmp["data"] = []
        sql = "select id, name from department"
        rs = db.select2(sql)
        if rs != None:
            rs = rs["data"]
            for i in range(len(rs)):
                tt = {}
                tt["id"] = rs[i]["id"]
                tt["layer"] = 1
                tt["attr"] = "department"
                tt["name"] = rs[i]["name"]
                tt["data"] = []
                sql = "select id, name from xgroup where depart_id =%s" % (tt["id"])
                rs2 = db.select2(sql)
                if rs2 != None:
                    rs2 = rs2["data"]
                    for j in range(len(rs2)):
                        ttt = {}
                        ttt["id"] = rs2[j]["id"]
                        ttt["layer"] = 2
                        ttt["attr"] = "group"
                        ttt["name"] = rs2[j]["name"]
                        ttt["data"] = []
                        sql = "select UID as id, NOTE as name from user where group_id = %s" % (ttt["id"])
                        rs3 = db.select2(sql)
                        if rs3 != None:
                            rs3 = rs3["data"]
                            for k in range(len(rs3)):
                                tx = {}
                                tx["id"] = rs3[k]["id"]
                                tx["layer"] = 3
                                tx["attr"] = "user"
                                tx["name"] = rs3[k]["name"]
                                tx["data"] = []
                                ttt["data"].append(tx)
                        tt["data"].append(ttt)
                tmp["data"].append(tt)
        ret.append(tmp)

        #系统
        tmp = {}
        tmp["id"] = 1
        tmp["layer"] = 0
        tmp["attr"] = ""
        tmp["name"] = u"系统"
        tmp["data"] = []
        sql = "select id, name from dict where parent in ( select id from dict where isRoot = 1 and name = '系统')"
        rs = db.select2(sql)
        if rs != None:
            rs = rs["data"]
            for i in range(len(rs)):
                tt = {}
                tt["id"] = rs[i]["id"]
                tt["layer"] = 1
                tt["attr"] = "system"
                tt["name"] = rs[i]["name"]
                tt["data"] = []
                sql = "select id, name from dict where parent = %s" % (tt["id"])
                rs2 = db.select2(sql)
                if rs2 != None:
                    rs2 = rs2["data"]
                    for j in range(len(rs2)):
                        ttt = {}
                        ttt["id"] = rs2[j]["id"]
                        ttt["layer"] = 2
                        ttt["attr"] = "module"
                        ttt["name"] = rs2[j]["name"]
                        ttt["data"] = []
                        tt["data"].append(ttt)
                tmp["data"].append(tt)
        ret.append(tmp)

        #类别
        tmp = {}
        tmp["id"] = 2
        tmp["layer"] = 0
        tmp["attr"] = ""
        tmp["name"] = u"类型"
        tmp["data"] = []
        sql = "select id, name from dict where parent in (select id from dict where name = '类型')"
        rs = db.select2(sql)
        if rs != None:
            rs = rs["data"]
            for i in range(len(rs)):
                tt = {}
                tt["id"] = rs[i]["id"]
                tt["layer"] = 1
                tt["attr"] = "type"
                tt["name"] = rs[i]["name"]
                tt["data"] = []
                tmp["data"].append(tt)
        ret.append(tmp)

        #性质
        tmp = {}
        tmp["id"] = 3
        tmp["layer"] = 0
        tmp["attr"] = ""
        tmp["name"] = u"性质"
        tmp["data"] = []
        sql = "select id, name from dict where parent in (select id from dict where name = '性质')"
        rs = db.select2(sql)
        if rs != None:
            rs = rs["data"]
            for i in range(len(rs)):
                tt = {}
                tt["id"] = rs[i]["id"]
                tt["layer"] = 1
                tt["attr"] = "property"
                tt["name"] = rs[i]["name"]
                tt["data"] = []
                tmp["data"].append(tt)
        ret.append(tmp)
        res = {}
        res["data"] = ret;
        setErrMsg(res, 0, "")
        ret = res;

    #print ret
    return json.dumps(ret)


@route("/export/")
def exportFile(data):
    ret = {}
    data = json.loads(data)
    db = Options['mysql']

    sql = genQuerySQL(data)
    rs = db.select2(sql)

    # for row in rs["data"]:
    #     tmp = row["WEEK"]
    #     print type(tmp)

    ret["data"] = rs["data"]
    setErrMsg(ret, 0, "")
    return json.dumps(ret)




def supportADD( d ):
    db =  Options['mysql']

    sql = "INSERT INTO support(\
            TYPE,           SYSTEM,             MODULE,         PACKAGE_NAME,   FTP_ADDR,\
            CONTENT,        BASE_VERSION,       PUBLISH_SERIAL, REMARK,         UPT_NUM,\
            PUBLISH_DATE,   STATUS,             DEVELOPER,      CHARGER,        PLAN_VERSION,\
            GIT_BRANCH,     UPGRADE_VERSION,    COLLABORATION,  NOTE,\
            CRT_USER\
        ) VALUES (\
            '%s','%s','%s','%s','%s', \
            '%s','%s','%s','%s', %s , \
            '%s','%s','%s','%s','%s',\
            '%s','%s','%s','%s',\
            '%s'\
        )" % (\
            d.get('type',''), d.get('system',''), d.get('module',''), d.get('name',''), d.get('ftp',''),\
            d.get('detail',''), d.get('bversion',''), d.get('pulno',''), d.get('remark',''), d.get('uptno',0),\
            d.get('pdate',''), d.get('status',''), d.get('developer',''), d.get('charger',''), d.get('pversion',''),\
            d.get('gitb',''), d.get('uversion',''), d.get('collaboration',''), '',\
            d.get('adduser','')\
    )

    return db.update(sql)

def supportUPDATE(d):
    db =  Options['mysql']

    sql = "UPDATE support SET\
                TYPE            = '%s',\
                SYSTEM          = '%s',\
                MODULE          = '%s',\
                PACKAGE_NAME    = '%s',\
                FTP_ADDR        = '%s',\
                CONTENT         = '%s',\
                BASE_VERSION    = '%s',\
                PUBLISH_SERIAL  = '%s',\
                REMARK          = '%s',\
                UPT_NUM         =  %s ,\
                PUBLISH_DATE    = '%s',\
                STATUS          = '%s',\
                DEVELOPER       = '%s',\
                CHARGER         = '%s',\
                PLAN_VERSION    = '%s',\
                GIT_BRANCH      = '%s',\
                UPGRADE_VERSION = '%s',\
                COLLABORATION   = '%s',\
                UPT_USER        = '%s',\
                UPT_TIME  = CURRENT_TIMESTAMP() \
            WHERE ID = %s" %(       \
                d.get('type',''),       \
                d.get('system',''),         \
                d.get('module',''),         \
                d.get('name',''),       \
                d.get('ftp',''),        \
                d.get('detail',''),         \
                d.get('bversion',''),       \
                d.get('pulno',''),      \
                d.get('remark',''),         \
                d.get('uptno',0),       \
                d.get('pdate',''),      \
                d.get('status',''),         \
                d.get('developer',''),      \
                d.get('charger',''),        \
                d.get('pversion',''),       \
                d.get('gitb',''),       \
                d.get('uversion',''),       \
                d.get('collaboration',''),      \
                d.get('uptuser',''),     \
                d.get("ID", 0) \
            )
    #print sql
    return db.update(sql)

def supportQUERY(d):
    db =  Options['mysql']

    sql = "SELECT\
        ID,    TYPE,    SYSTEM,    MODULE,    PACKAGE_NAME,    FTP_ADDR,\
        CONTENT,    BASE_VERSION,    PUBLISH_SERIAL,    REMARK,    UPT_NUM,\
        DATE_FORMAT(PUBLISH_DATE,'%Y-%m-%d') AS PUBLISH_DATE,    \
        STATUS,    DEVELOPER,    CHARGER,    PLAN_VERSION,\
        GIT_BRANCH,    UPGRADE_VERSION,    COLLABORATION,    NOTE,\
        CRT_USER,    \
        DATE_FORMAT(CRT_TIME,'%Y-%m-%d %H:%I:%S') AS CRT_TIME,    \
        UPT_USER,    \
        DATE_FORMAT(UPT_TIME,'%Y-%m-%d %H:%I:%S') AS UPT_TIME\
        FROM support ORDER BY ID DESC"

    #sql = "SELECT * FROM support ORDER BY ID DESC"
    return db.select2(sql)

def supportQUERY_ONE(d):
    db =  Options['mysql']

    sql = "SELECT\
        ID,    TYPE,    SYSTEM,    MODULE,    PACKAGE_NAME,    FTP_ADDR,\
        CONTENT,    BASE_VERSION,    PUBLISH_SERIAL,    REMARK,    UPT_NUM,\
        DATE_FORMAT(PUBLISH_DATE,'%Y-%m-%d') AS PUBLISH_DATE,    \
        STATUS,    DEVELOPER,    CHARGER,    PLAN_VERSION,\
        GIT_BRANCH,    UPGRADE_VERSION,    COLLABORATION,    NOTE,\
        CRT_USER,    \
        DATE_FORMAT(CRT_TIME,'%Y-%m-%d %H:%I:%S') AS CRT_TIME,    \
        UPT_USER,    \
        DATE_FORMAT(UPT_TIME,'%Y-%m-%d %H:%I:%S') AS UPT_TIME\
        FROM support WHERE ID = " + str(d.get('ID', 0))

    return db.select2(sql) 

def supportDELETE(d):
    db =  Options['mysql']

    sql = "DELETE FROM support WHERE ID = " + str(d.get('ID', 0))
    return db.update(sql)

@route("/support/")
def Support(data):
    data = json.loads(data)
    method = data.get("method", None)
    ret = {}
    #print data
    
    if method is None:
        setErrMsg(ret, 2, "未知的方法！")
    
    if method == "ADD":
        res = supportADD(data)
        if res < 0:
            setErrMsg(ret, 2, "添加数据失败！")
        else:
            setErrMsg(ret, 0, "")

    if method == "QUERY":
        res = supportQUERY(data)

        if res is None:
            setErrMsg(ret, 2, "数据库查询失败！")
        else:
            ret["data"] = res["data"]

            setErrMsg(ret, 0, "")

    if method == "QUERY_ONE":
        res = supportQUERY_ONE(data)
        if res is None:
            setErrMsg(ret, 2, "数据库查询失败！")
        else:
            ret["data"] = res["data"]
            setErrMsg(ret, 0, "")

    if method == "UPDATE":
        res = supportUPDATE(data)
        if res < 0:
            setErrMsg(ret, 2, "数据库更新失败！")
        else:
            setErrMsg(ret, 0, "")

    if method == "DELETE":
        res = supportDELETE(data)
        if res < 0:
            setErrMsg(ret, 2, "数据库删除失败！")
        else:
            setErrMsg(ret, 0, "")

    if method == "EXPORT":
        res = supportQUERY(data)
        if res is None:
            setErrMsg(ret, 2, "数据库查询失败！")
        else:
            ret["data"] = res["data"]
            setErrMsg(ret, 0, "")    

    return json.dumps(ret)








