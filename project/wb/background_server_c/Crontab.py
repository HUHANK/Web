# -*- coding:utf-8 -*-

import threading
import time
import MTime
import datetime
from config import *

def startCrontab():
    t = threading.Thread(target=crontabProcess)
    t.start()

def crontabProcess():
    COUNT = 0
    while True:
        #print "Child thread!",COUNT
        if COUNT % (60*20) == 0:
            TimeedTask1()
        if COUNT % (15) == 0:
            dbConnectionKeepAlive()
            print "dbConnectionKeepAlive"

        time.sleep(60)
        COUNT+=1
        if COUNT > 1000000:
            COUNT = 0


def dbConnectionKeepAlive():
    db = Options['mysql']
    sql = "SELECT CURDATE() from DUAL"
    rs = db.select2(sql)
    #print rs


def TimeedTask1():
    db = Options['mysql']

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

        tt = MTime.getYearWeek(t1)
        date = datetime.datetime.strptime(t1, '%Y-%m-%d')
        delta = datetime.timedelta(days=(5-tt[2]))
        n_days = date + delta
        t2 = n_days.strftime("%Y-%m-%d")

        sql = u"INSERT INTO calendar(ID,WID, DETAIL, START_DATE, END_DATE, TYPE, SOURCE, ADD_USER) VALUES("
        sql += id +","+ id +",'"+ detail +"','" + t2 + "','" + t2 + "', '0', '2', 'SYSTEM')"
        print (sql)
        db.update(sql)
