# -*- coding:utf-8 -*-
import os, math, json, sys
import random
import socket
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


def PortIsUsed(port, ip='127.0.0.1'):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        s.connect((ip, int(port)))
        s.shutdown(2)
        # 利用shutdown()函数使socket双向数据传输变为单向数据传输。shutdown()需要一个单独的参数，
        # 该参数表示了如何关闭socket。具体为：0表示禁止将来读；1表示禁止将来写；2表示禁止将来读和写。
        print "%s:%s is used!" %(ip, port)
        return True
    except:
        print "%s:%s is unused!" % (ip, port)
        return False

def GetUnusedPort(ip='127.0.0.1'):
    port = random.randint(10000, 20000)
    while PortIsUsed(port):
        port = random.randint(20000, 30000)
    return port

def execfunc(funcname, param):
    main = sys.modules["__main__"]

    if not hasattr(main, funcname):
        pass
    return getattr(main, funcname)(param)