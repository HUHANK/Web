# -*- coding:utf-8 -*-

import threading
import time
from config import *

def startCrontab():
    t = threading.Thread(target=crontabProcess)
    t.start()

def crontabProcess():
    COUNT = 0
    while True:
        #print "Child thread!",COUNT
        if COUNT % (10) == 0:
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

    # sql = "delete FROM calendar where WID > 0"
    # db.update(sql)

    sql = "SELECT ID, ITEM, ITEM_PROGRESS, RISK_POINT, END_DATE FROM week_report WHERE END_DATE != ''"
    data = db.select3(sql)
    for row in data:
        id = str(row[0])
        sql = "SELECT COUNT(1) FROM calendar WHERE WID="+id
        d1 = db.select3(sql)
        print d1[0][0]

        risk = ''
        if len(row[3]) == 0:
            risk = u"无风险"
        else:
            risk = u"有风险"
        detail = row[1]+"["+risk+"]["+row[2]+"%]"
        if d1[0][0] > 0:
            sql = "UPDATE calendar SET DETAIL='"+detail+"', START_DATE='" + row[4] + "', END_DATE='" + row[4] + "' WHERE WID="+id;
        elif d1[0][0] == 0:
            sql = "INSERT INTO calendar(WID, DETAIL, START_DATE, END_DATE, TYPE) VALUES("
            sql += str(id) + ",'" + detail + "','" + row[4] + "','" + row[4] + "','个人日历')"
        print sql
        db.update(sql)
