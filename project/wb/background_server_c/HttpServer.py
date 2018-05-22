# -*- coding:utf-8 -*-

import BaseHTTPServer
from SocketServer import ThreadingMixIn
#from SocketServer import ForkingMixIn
from config import *
from RouteHandler import *
from MainProcess import  *
from Crontab import *
from SysTimedTaskProcess import startSysTimedTaskProcess
import sys
reload(sys)
sys.setdefaultencoding("utf-8")


MProcess = []

class RequestHandler(BaseHTTPServer.BaseHTTPRequestHandler):
    def do_GET(self):
        self.process(2)

    def do_POST(self):
        self.process(1)

    def process(self, type):
        if 1 == type:#POST
            nbytes = int(self.headers['Content-Length'])
            data = self.rfile.read(nbytes)

            url = str(self.path).replace("/", "")
            content = ""
            sdata = {}
            sdata["method"] = url
            sdata["data"] = data

            while True:
                canExit = False
                for i in range(len(MProcess)):
                    ret = MProcess[i].mprocess(sdata)
                    if ret is not False:
                        content = ret
                        canExit = True
                        break
                    time.sleep(0.001)
                if canExit:
                    break
            #SEND
            self.send_response(200)
            self.send_header("Conten-type", "text/html")
            self.send_header("Access-Control-Allow-Origin","*")
            self.send_header("Conten-Length",str(len(content)))
            self.end_headers()
            self.wfile.write(content)

class ThreadedHTTPServer(ThreadingMixIn, BaseHTTPServer.HTTPServer):
    """Handle requests in a separate thread."""


def start_server(port):
    print "Now Start HttpServer: PORT="+str(port) + "..."
    http_server = ThreadedHTTPServer(('', int(port)), RequestHandler)
    #http_server = BaseHTTPServer.HTTPServer(('',int(port)), RequestHandler)
    http_server.serve_forever()

if __name__ == "__main__":
    #print Options
    for i in range(MAIN_PROCESS_NUM):
        MProcess.append(CMainProcess())
    for i in range(len(MProcess)):
        MProcess[i].start()

    startSysTimedTaskProcess()

    start_server(HTTP_SERVER_PORT)