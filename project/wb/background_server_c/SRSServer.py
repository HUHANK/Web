# -*- coding:utf-8 -*-

import BaseHTTPServer
from SocketServer import ThreadingMixIn
from multiprocessing import Process, Queue
import threading
from PubFunc import *
from config import Options
import urlparse
import traceback

reload(sys)
sys.setdefaultencoding("utf-8")


class CMainProcess:
    """"""
    def __init__(self):
        self.process    = None
        self.queue      = Queue(5)
        self.SessionID  = None
        self.mutex      = threading.Lock()

    def process(self, data):
        self.queue.put(data)

    def isBusy(self):
        if self.SessionID is not None:
            return True
        else:
            return False

    def setSessionID(self, sid):
        self.mutex.acquire()
        self.SessionID = sid
        self.mutex.release()

    def getSessionID(self):
        return self.SessionID

    def start(self):
        self.process = Process(target=CMainProcess.run, args=(self,))
        self.start()

    def run(self):
        while True:
            try:

                pass
            except:
                print traceback.format_exc()




class SRSServer(BaseHTTPServer.BaseHTTPRequestHandler):
    def do_GET(self):
        path  = urlparse.unquote(self.path)
        url   = urlparse.urlparse(path)
        d = {}
        d['func'] = url.path.replace('/','')
        d['param'] = urlparse.parse_qs(url.query)



    def do_POST(self):
        print list(self)

    def buprocess(self, data):
        #如果是请求分配资源的则在这里处理
        if data['func'] == '' :
            pass
        #如果是普通的请求处理则在这里处理
        SessionID = data['param'].get('SessionID', None)
        if SessionID is None :

            return





class ThreadedHTTPServer(ThreadingMixIn, BaseHTTPServer.HTTPServer):
    """Handle requests in a separate thread."""

def start_server(port):
    print "Now Start HttpServer: PORT="+str(port) + "..."
    http_server = ThreadedHTTPServer(('', int(port)), SRSServer)
    http_server.serve_forever()



if __name__ == "__main__":
    Options['mprocesses'] = []
    for i in range(2):
        p = CMainProcess()
        p.start()
        Options['mprocesses'].


    start_server(6008)