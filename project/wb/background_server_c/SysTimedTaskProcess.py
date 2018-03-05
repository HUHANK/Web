# -*- coding:utf-8 -*-


from multiprocessing import Process, Queue
from MySQL_db import *
from MTime import *

HAS_TURN_NEXT_BY_DATETIME = False

def startSysTimedTaskProcess():
    process = Process(target=SysTimedTaskProcess, args=())
    process.start()

def SysTimedTaskProcess():
    N = 0
    while True:

        if N % (15) == 0:
            TurnNextWeek()
        if N % (5) == 0:
            TurnNextWeek2()

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

    '''删掉之前转过来的已经完成的任务'''
    sql = "SELECT A.UID, A.WID, A.YEAR, A.WEEK FROM user_work A LEFT JOIN work_detail B on A.WID = B.id WHERE A.YEAR = %s AND A.WEEK = %s AND B.ProgressRate = 100" % (NowYear, NowWeek)
    rs = db.select2(sql)
    if rs is None:
    	print "数据库查询失败![%s]" % sql
    	return False
    for row in rs["data"]:
    	sql1 = "DELETE FROM user_work WHERE UID = %s AND WID = %s AND YEAR = %s AND WEEK = %s"%(row['UID'], row['WID'], row['YEAR'], row['WEEK'])
    	db.update(sql1)

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
    global HAS_TURN_NEXT_BY_DATETIME
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
        HAS_TURN_NEXT_BY_DATETIME = False
        return True
    if HAS_TURN_NEXT_BY_DATETIME == True:
        return True

    print "开始把本周工作转下周！..."
    LastWeek = NowWeek + 1
    LastYear = NowYear
    (tmp,MaxWeek,tmp) = getYearLastWeek(NowYear)
    if LastWeek > MaxWeek:
        LastWeek = 1
        LastYear = NowYear + 1

    sql = "SELECT UID, WID FROM user_work A LEFT JOIN work_detail B on A.WID = B.id where A.YEAR = %s and A.WEEK = %s AND ProgressRate < 100" % (
        NowYear, NowWeek)
    rs = db.select2(sql)
    if rs is None:
        print "数据库查询失败！"
        print "[SQL]:%s" % (sql)
        return False

    for row in rs["data"]:
        WID = row["WID"]
        UID = row["UID"]
        sql1 = "INSERT into user_work(UID, WID, YEAR, WEEK) VALUES(%s, %s, %s, %s)" % (UID, WID, LastYear, LastWeek)
        db.update(sql1)

    HAS_TURN_NEXT_BY_DATETIME = True