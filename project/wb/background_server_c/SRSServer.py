# -*- coding:utf-8 -*-

import BaseHTTPServer
from SocketServer import ThreadingMixIn
from multiprocessing import Process, Queue
import threading
from config import Options
import urlparse
import traceback

import SRSSRouter
from SRSSRouter import *

reload(sys)
sys.setdefaultencoding("utf-8")


class CMainProcess:
    """"""
    def __init__(self):
        self.process    = None
        self.queue      = Queue(5)
        self.SessionID  = None
        self.mutex      = threading.Lock()
        self.GitType    = ''
        self.GitPath    = ''
        self.GitUrl     = ''
        self.PID        = 0

    def mprocess(self, data):
        try:
            self.queue.put(data)
            return self.queue.get(timeout=30)
        except :
            print traceback.format_exc()
            return ErrorDeal({}, "系统异常或繁忙，请查看后台日志，稍后再试!")

    def isBusy(self):
        if self.SessionID is not None:
            return True
        else:
            return False

    def setBusy(self, sid):
        self.mutex.acquire()
        self.SessionID = sid
        self.mutex.release()
        return self.SessionID

    def setUnBusy(self):
        self.mutex.acquire()
        self.SessionID = None
        self.mutex.release()

    def getSessionID(self):
        return self.SessionID

    def start(self):
        self.process = Process(target=MainProcess, args=(self.queue,))
        self.process.start()
        self.PID = self.process.pid
        data = {}
        data['path'] = self.GitPath
        data['url'] = self.GitUrl
        self.queue.put(json.dumps(data))



def MainProcess(queue):
    # Init Git
    data = queue.get()
    data = json.loads(data)
    print ("Git Path: %s" % data.get("path", ''))
    print ("Git  URL: %s" % data.get("url", ''))
    GitInit(data.get("path", ''), data.get("url", ''))

    while True:
        ret = {}
        try:
            data = queue.get()
            data = json.loads(data)

            func = data.get('func', None)
            param = data.get('param', None)
            if func is None or len(func) < 1:
                ret = ErrorDeal(ret, "函数参数不能为空!")
            else:
                ret = execfunc(func, param)
                #ret = GitGetInitInfo(param)
            queue.put(ret)
        except:
            print traceback.format_exc()


class SRSServer(BaseHTTPServer.BaseHTTPRequestHandler):
    def do_GET(self):
        path  = urlparse.unquote(self.path)
        url   = urlparse.urlparse(path)
        d = {}
        d['func'] = url.path.replace('/','')
        d['param'] = urlparse.parse_qs(url.query)
        rs = self.buprocess(d)
        # SEND
        self.send_response(200)
        self.send_header("Conten-type", "text/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Conten-Length", str(len(rs)))
        self.end_headers()
        self.wfile.write(rs)

    def do_POST(self):
        print "POST"

    def buprocess(self, data):
        print data
        processes = Options['mprocesses']
        #如果是请求分配资源的则在这里处理
        if data['func'] == 'queryallgit':
            ret = {}
            ret['data'] = []
            for p in processes:
                rs = {}
                rs['GitType'] = p.GitType
                rs['isBusy']  = p.isBusy()
                rs['id']      = p.PID
                ret['data'].append(rs)
            return SuccessDeal(ret)

        if data['func'] == 'request':
            id = data['param'].get('id', 0)[0]
            ret = {}
            for p in processes:
                if not p.isBusy():
                    if str(p.PID) == str(id):
                        ret['sid'] = p.setBusy(genUUID())
            if ret.get('sid', None) is None:
                return ErrorDeal(ret, "系统繁忙，请稍后再试!")
            else:
                return SuccessDeal(ret)

        #如果是普通的请求处理则在这里处理
        SessionID = data['param'].get('sid', None)
        if SessionID is None or len(SessionID) == 0:
            return ErrorDeal({}, "请求ID不能为空!")
        SessionID = SessionID[0]

        if data['func'] == 'logout':
            bFind = False
            for p in processes:
                if p.getSessionID() == SessionID:
                    bFind = True
                    p.setUnBusy()
            if bFind:
                return SuccessDeal({})
            else:
                return ErrorDeal({}, "无法找到请求ID对应的处理环境!")

        data = json.dumps(data)
        for p in processes:
            if p.getSessionID() == SessionID:
                return p.mprocess(data)
        return ErrorDeal({}, "无法找到请求ID对应的处理环境!")



class ThreadedHTTPServer(ThreadingMixIn, BaseHTTPServer.HTTPServer):
    """Handle requests in a separate thread."""

def start_server(port):
    print "Now Start HttpServer: PORT="+str(port) + "..."
    http_server = ThreadedHTTPServer(('', int(port)), SRSServer)
    http_server.serve_forever()


BASE_GIT_DIR = "./git"
GIT_USER_ACC = "wb_hyl"
GIT_USER_PWD = "hyl12345678"
JZJY_URL = "http://%s:%s@10.10.12.120/rzrq/jzjy.git" % (GIT_USER_ACC, GIT_USER_PWD)
RZRQ_URL = "http://%s:%s@10.10.12.120/rzrq/rzrq.git" % (GIT_USER_ACC, GIT_USER_PWD)

JZJY_BASE_NAME = 'jzjy'
RZRQ_BASE_NAME = 'rzrq'

JZJY_PROC_NUM = 2
RZRQ_PROC_NUM = 2

if __name__ == "__main__":
    Options['mprocesses'] = []

    for i in range(JZJY_PROC_NUM):
        p = CMainProcess()
        dir = "%s%s" % (JZJY_BASE_NAME, i)
        dir = os.path.join(BASE_GIT_DIR, dir)
        p.GitType = "JZJY"
        p.GitPath = dir
        p.GitUrl = JZJY_URL
        p.start()
        Options['mprocesses'].append(p)

    for i in range(RZRQ_PROC_NUM):
        p = CMainProcess()
        dir = "%s%s" % (RZRQ_BASE_NAME, i)
        dir = os.path.join(BASE_GIT_DIR, dir)
        p.GitType = "RZRQ"
        p.GitPath = dir
        p.GitUrl = RZRQ_URL
        p.start()
        Options['mprocesses'].append(p)

    start_server(6008)