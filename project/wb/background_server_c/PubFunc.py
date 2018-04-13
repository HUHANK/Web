# -*- coding:utf-8 -*-
import os, math, json
from MTime import *

def WriteFile(fpath, data):
    fp = open(fpath, 'w')
    fp.write(data)
    fp.close()
    return True

def ReadFile(fpath):
    if os.path.exists(fpath) == False:
        return ""
    fp = open(fpath, 'r')
    data = fp.read()
    fp.close()
    return data

def iArray2Str(arr):
    ret = ""
    for v in arr:
        ret += str(v)+","
    ret = ret.rstrip(",")
    if len(ret) < 1:
        return ""
    return ret

def sArray2Str(arr):
    ret = ""
    for v in arr:
        ret += "'"+v+"'" + ","
    ret = ret.rstrip(",")
    if len(ret) < 1:
        return ""
    return ret

def setErrMsg(ret, code, msg):
    ret["ErrCode"] = code
    ret["msg"] = msg

def ErrorDeal(ret, msg):
    ret["ErrCode"] = 4
    ret["msg"] = msg
    return json.dumps(ret)

def SuccessDeal(ret):
    ret["ErrCode"] = 0
    ret["msg"] = ''
    return json.dumps(ret)

def CalExpireDate(db, start_date, days):
    year = start_date[0] + start_date[1] + start_date[2] + start_date[3]
    #ydays = getYearTotalDays(int(year))

    print start_date
    day = getYearDay(start_date)
    (a,b) = math.modf(float(days))
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


def ArrayHas(arr, dest):
    if len(arr) == 1:
        if arr[0] == dest:
            return True
        return False
    m = len(arr)/2
    if ArrayHas(arr[:m], dest) or ArrayHas(arr[m:], dest):
        return True
    else:
        return False