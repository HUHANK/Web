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

        if N % (60*10) == 0:
            GenCalenderData()
        if N % (15) == 0:
            TurnNextWeek()
        if N % (5) == 0:
            TurnNextWeek2()
            weekreportToHis()

        if N % (60*12) == 0:
            DelExpireSession()

        N += 1
        time.sleep(60)
        if N >= 10000000:
            N = 0

def weekreportToHis():
    # db = Options['mysql']
    db = MySQLOption()
    db.connect()

    ywt = getNowYearWeek()
    syw = "%s%s" % (ywt[0], (ywt[1]))

    sql = "SELECT ParamValue FROM sys_param where ParamCode = '0007'"
    rs = db.select3(sql)
    # print rs[0][0]
    if rs[0][0] >= syw:
        return

    ywt = getPrevWeek(ywt[0], ywt[1])
    syw = "%s%s" % (ywt[0], (ywt[1]))
    (sDate, eDate) = getWeekFirstLastday(syw)

    str = u"'%s','%s','%s'"%(syw, sDate, eDate)
    sql = u"INSERT INTO his_week_report(ID,YEAR_WEEK,START_DATE,END_DATE,ITEM,ITEM_STAGE,ITEM_PROGRESS,ITEM_STATUS,ITEM_TYPE,LAST_WEEK_WORK,THIS_WEEK_WORK,NEXT_WEEK_WORK,SYSTEM,PRIORITY,ITEM_CHARGE,`GROUP`,NEED_TRACK,NOTE,ADD_USER,ADD_DATE,UPT_USER,UPT_DATE,SFBYG) "
    sql += u"SELECT ID," + str + u",ITEM,ITEM_STAGE,ITEM_PROGRESS,ITEM_STATUS,ITEM_TYPE,LAST_WEEK_WORK,THIS_WEEK_WORK,NEXT_WEEK_WORK,SYSTEM,PRIORITY,ITEM_CHARGE,`GROUP`,NEED_TRACK,NOTE,ADD_USER,ADD_DATE,UPT_USER,UPT_DATE,SFBYG "
    sql += u"FROM week_report WHERE NEED_TRACK = '个人周报'"
    print sql
    db.update(sql)

    sql = "UPDATE sys_param SET ParamValue='%s' WHERE ParamCode='0007'"%(syw)
    print sql
    db.update(sql)

def GenCalenderData():
    # db = Options['mysql']
    db = MySQLOption()
    db.connect()

    sql = "DELETE FROM calendar WHERE ADD_USER = 'SYSTEM'"
    db.update(sql)

    sql = u"SELECT ID, ITEM, ITEM_PROGRESS, RISK_POINT, END_DATE FROM week_report WHERE END_DATE != '' AND NEED_TRACK='项目周报' AND ITEM_STATUS = '未完成'"
    data = db.select3(sql)
    for row in data:
        id = str(row[0])

        if row[1] == '':
            continue
        risk = ''
        if len(row[3]) == 0:
            risk = u"无风险"
        else:
            risk = u"有风险"
        detail = row[1]+"["+risk+"]["+row[2]+"%]"
        sql = u"INSERT INTO calendar(ID,WID, DETAIL, START_DATE, END_DATE, TYPE, SOURCE, ADD_USER) VALUES("
        sql += id + "," + id + ",'" + detail + "','" + row[4] + "','" + row[4] + u"', '0', '1', 'SYSTEM')"
        print sql
        db.update(sql)

    sql = u"SELECT ID, CONCAT('[',FL,']', ITEM), DATE_FORMAT(ADD_DATE,'%Y-%m-%d') FROM zmsjap"
    data = db.select3(sql)
    for row in data:
        id = str(row[0])
        detail = row[1]
        t1 = row[2]

        tt = getYearWeek(t1)
        date = datetime.datetime.strptime(t1, '%Y-%m-%d')
        delta = datetime.timedelta(days=(5-tt[2]))
        n_days = date + delta
        t2 = n_days.strftime("%Y-%m-%d")

        sql = u"INSERT INTO calendar(ID,WID, DETAIL, START_DATE, END_DATE, TYPE, SOURCE, ADD_USER) VALUES("
        sql += id +","+ id +",'"+ detail +"','" + t2 + "','" + t2 + "', '0', '2', 'SYSTEM')"
        print (sql)
        db.update(sql)


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
        '''检查上周是否有此任务'''
        sql1 = "SELECT * FROM user_work WHERE UID = %s AND WID = %s AND YEAR = %s AND WEEK = %s"%(row['UID'], row['WID'], Year, Week)
        result = db.select2(sql1)
        if result is None:
            print "数据库查询失败![%s]" % sql1
            continue
        if len(result['data']) < 1 :
            continue
        '''如果这个任务是上周有的，证明是延续下来的，就删掉此任务'''
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


'''删除过期session'''
def DelExpireSession():
    db = MySQLOption()
    db.connect()

    sql = "DELETE FROM session WHERE DATE(login_timestamp) < CURDATE()"
    db.update(sql)
    #db.close()