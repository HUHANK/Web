# -*- coding:utf-8 -*-

from multiprocessing import Process, Queue
from MySQL_db import *
from Crontab import startCrontab
from MTime import *
import threading, json
from PubFunc import *
from config import *
import sys


class CMainProcess:

    def __init__(self):
        self.QUEUE_SIZE = 5
        self.queue = Queue(self.QUEUE_SIZE)
        self.IsBusy = False
        self.process = None
        self.mutex = threading.Lock()

    def __del__(self):
        print "delete..."

    def isBusy(self):
        return self.IsBusy

    def setBusy(self):
        self.mutex.acquire()
        self.IsBusy = True
        self.mutex.release()

    def setUnBusy(self):
        self.mutex.acquire()
        self.IsBusy = False
        self.mutex.release()

    def start(self):
        # print Options
        self.process = Process(target=MainProcess, args=(self.queue, ))
        self.process.start()

    def mprocess(self, data):
        if self.isBusy():
            return False
        self.setBusy()
        self.queue.put(data)
        data = self.queue.get()
        self.setUnBusy()
        return data

    def test(self):
        print "test"

def MainProcess(queue):
    Options["mysql"] = MySQLOption()
    Options["mysql"].connect()
    print Options
    startCrontab()

    while True:
        data = queue.get()
        startTime = getNowTimestamp()
        method = data.get("method", None)
        if method is None:
            print u"请求无法处理，未指定处理方法！"
            ret = {}
            setErrMsg(ret, 2, u"请求无法处理，未指定处理方法！")
            queue.put(json.dumps(ret))
            continue
        d = data.get("data", None)
        if d is None:
            print "请求数据为空，无法处理!"
            ret = {}
            setErrMsg(ret, 2, u"请求数据为空，无法处理!")
            queue.put(json.dumps(ret))
            continue
        ret = ""
        if Options.get('url', None) is not None and Options['url'].get(method, None) is not None:
            ret = Options['url'][method](d)
        else:
            ret = {}
            setErrMsg(ret, 2, "请求无效！")
            print ret
            ret = json.dumps(ret)
        queue.put(ret)
        endTime = getNowTimestamp()
        print "METHOD: ",method, " USETIME: ", str(endTime - startTime)
