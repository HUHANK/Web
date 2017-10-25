# -*- coding:utf-8 -*-


from multiprocessing import Process, Queue
from MySQL_db import *
from MTime import *


def startSysTimedTaskProcess():
    process = Process(target=SysTimedTaskProcess, args=())
    process.start()

def SysTimedTaskProcess():
    N = 0
    while True:

        if N % (15) == 0:
            TurnNextWeek()

        N += 1
        time.sleep(60)
        if N >= 10000000:
            N = 0

def TurnNextWeek():
    (NowYear, NowWeek, d) = getNowYearWeek()
    db = MySQLOption()
    db.connect()

    sql = "SELECT * FROM sys_param where ParamCode = '0001'"
    rs = db.select2(sql)
    if rs is None:
        print "数据库查询失败！"
        print "[SQL]:%s" % (sql)
        return False
    Week = rs["data"][0].get("ParamValue", None)
    if Week is None:
        print "系统当前周期参数是空，请检查！"
        return False
    arr = Week.split(",")
    Week = arr[1]
    Year = arr[0]
    Year = int(Year)
    Week = int(Week)
    if NowWeek == Week:
        return True

    sql = "UPDATE sys_param SET ParamValue = '%s,%s' WHERE ParamCode = '0001'" % (NowYear,NowWeek)
    if db.update(sql) < 0:
        print "数据库跟新失败！"
        return False

    sql = "SELECT UID, WID FROM user_work A LEFT JOIN work_detail B on A.WID = B.id where A.YEAR = %s and A.WEEK = %s AND ProgressRate < 100" % (Year, Week)
    rs = db.select2(sql)
    if rs is None:
        print "数据库查询失败！"
        print "[SQL]:%s" % (sql)
        return False

    for row in rs["data"]:
        WID = row["WID"]
        UID = row["UID"]
        sql1 = "INSERT into user_work(UID, WID, YEAR, WEEK) VALUES(%s, %s, %s, %s)" % (UID, WID, NowYear, NowWeek)
        db.update(sql1)


def TurnNextWeek2():
    db = MySQLOption()
    db.connect()

    sql = "SELECT * FROM sys_param where ParamCode = '0002'"
    rs = db.select2(sql)
    if rs is None:
        print "数据库查询失败！"
        print "[SQL]:%s" % (sql)
        return False
    tmp = rs["data"][0].get("ParamValue", None)
    if tmp is None:
        print "系统当前周期参数是空，请检查！"
        return False
    arr = tmp.split(",")
    weekDay = int(arr[0])
    time = int(arr[1])
    (NowYear, NowWeek, NowDay) = getNowYearWeek()

    if NowDay != weekDay :
        return True
    if time != int(getNowHours()):
        return True

    print "开始把本周工作转下周！..."
    LastWeek = NowWeek - 1
    LastYear = NowYear
    if LastWeek < 1:
        (LastYear,LastWeek,tmp) = getYearLastWeek(NowYear-1)

    sql = "SELECT UID, WID FROM user_work A LEFT JOIN work_detail B on A.WID = B.id where A.YEAR = %s and A.WEEK = %s AND ProgressRate < 100" % (
        LastYear, LastWeek)
    rs = db.select2(sql)
    if rs is None:
        print "数据库查询失败！"
        print "[SQL]:%s" % (sql)
        return False

    for row in rs["data"]:
        WID = row["WID"]
        UID = row["UID"]
        sql1 = "INSERT into user_work(UID, WID, YEAR, WEEK) VALUES(%s, %s, %s, %s)" % (UID, WID, NowYear, NowWeek)
        db.update(sql1)