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