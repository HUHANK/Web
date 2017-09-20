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
    ret = {}
    sessionData = findSession(data.get("SessionID", ""))
    if sessionData is None:
        print "baseinfo 用户没有登录！"
        setErrMsg(ret, 1, "baseinfo 用户没有登录！")
        return json.dumps(ret)
    userName = sessionData.get("UserName", "")

    sql = "select NOTE from user where UNAME='%s'" % (userName)
    res = db.select(sql)
    ret["UserName"] = res["datas"][0][0]

    ret["Date"] = getNowDate1()
    (year, week, day) = getNowYearWeek()
    ret["Week"] = week

    sql = "select UID id, UNAME ename, NOTE cname from user"
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
        rs = db.select2(sql)
        ret["System"]["data"][i]["data"] = rs["data"]

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
    ret = {}

    if data["method"] == "ADD":
        (Year, Week, Day) = getYearWeek(data["StartDate"])
        sql = "INSERT INTO work_detail(System, Module,Type,TraceNo,Detail,Property,ProgressRate,StartDate,NeedDays,Note) VALUES(" \
              "'%s', '%s', '%s','%s','%s','%s',%s, '%s', %s, '%s')" %(
                data['System'], data['Module'], data['Type'], data["TraceNo"], data["Detail"], \
                data["Property"], data["ProgressRate"], data["StartDate"], data["NeedDays"], data["Note"])
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
    elif data["method"] == "GET":
        sql = "SELECT C.id, C.TraceNo, C.System, C.Module, C.Type, C.Detail, C.Property, C.ProgressRate, C.Note " \
              "FROM user_work A LEFT JOIN user B on A.UID = B.UID LEFT JOIN work_detail C ON A.WID = C.id " \
              "WHERE B.UNAME = '%s' AND A.YEAR = %s AND A.WEEK = %s" % (userName, Year, Week)
        rs = db.select2(sql)
        ret["current"] = rs["data"]
        Week = Week + 1
        sql = "SELECT C.id, C.TraceNo, C.System, C.Module, C.Type, C.Detail, C.Property, C.ProgressRate, C.Note " \
              "FROM user_work A LEFT JOIN user B on A.UID = B.UID LEFT JOIN work_detail C ON A.WID = C.id " \
              "WHERE B.UNAME = '%s' AND A.YEAR = %s AND A.WEEK = %s" % (userName, Year, Week)
        rs = db.select2(sql)
        ret["next"] = rs["data"]
        setErrMsg(ret, 0, "")
        return json.dumps(ret)
    elif data["method"] == "DELETE":
        sql = "delete from user_work where WID=%s" % (data.get("id", -1))
        if db.update(sql) < 0:
            setErrMsg(ret, 2, u"数据库删除失败!")
            return json.dumps(ret)
        sql = "delete from work_detail where id=%s" % (data.get("id", -1))
        if db.update(sql) < 0:
            setErrMsg(ret, 2, u"数据库删除失败!")
            return json.dumps(ret)
        setErrMsg(ret, 0, "")
        return json.dumps(ret)
    setErrMsg(ret, 3, "未知参数！")
    return json.dumps(ret)

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

@route("/sjwh_xgmm/")
def modifyUserPwd(data):
    data = json.loads(data)
    ret = {}
    ses = findSession(data.get("SessionID", ""))
    if ses == None :
        setErrMsg(ret, 1, u"请确认该用户是否登录！")
    else:
        db = Options['mysql']
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
    db = Options['mysql']
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
    db = Options['mysql']
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
    db = Options['mysql']
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
    db = Options['mysql']
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

    print ret
    return json.dumps(ret)