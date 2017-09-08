# -*- coding:utf-8 -*-

def WriteFile(fpath, data):
    fp = open(fpath, 'w')
    fp.write(data)
    fp.close()
    return True

def ReadFile(fpath):
    fp = open(fpath, 'r')
    data = fp.read()
    fp.close()
    return data