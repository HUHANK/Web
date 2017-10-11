# -*- coding:utf-8 -*-

from MTime import *
from MySQL_db import *
import  math


def CalExpireDate(db, start_date, days):
    year = start_date[0] + start_date[1] + start_date[2] + start_date[3]
    #ydays = getYearTotalDays(int(year))

    day = getYearDay(start_date)
    (a,b) = math.modf(days)
    if a != 0.0 :
        days = b + 1
    days = int(days)
    day = int(day)
    sdate = start_date[0] + start_date[1] + start_date[2] + start_date[3] + start_date[5] + start_date[6] + start_date[8] + start_date[9]
    while days > 0:
        day += 1
        sdate = getDateByDay2(int(year), day)
        (a,b,week) = getWeekInfoByDate(sdate)
        if week > 5:
            continue
        sql = "SELECT * from xholiday WHERE date = '%s'" % (sdate)
        rs = db.select2(sql)
        if rs["total"] != 0:
            continue
        days -= 1
    return sdate


db = MySQLOption()
db.connect()
sql = "SELECT * from work_detail"
rs = db.select2(sql)
#print rs["data"]
for row in rs["data"]:
    #print row
    edate = CalExpireDate(db, row["StartDate"], row["NeedDays"])
    sql = "update work_detail set ExpireDate='%s' where id = %s" % (edate, row["id"])
    db.update(sql)




