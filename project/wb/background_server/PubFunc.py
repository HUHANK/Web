# -*- coding:utf-8 -*-
import os

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