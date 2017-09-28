# -*- coding:utf-8 -*-

import BaseHTTPServer
from SocketServer import ThreadingMixIn
from SocketServer import ForkingMixIn
from config import *
from RouteHandler import *
from InitJSDefinition import *
from Session import  *
from Crontab import *
import sys
reload(sys)
sys.setdefaultencoding("utf-8")

class RequestHandler(BaseHTTPServer.BaseHTTPRequestHandler):

    def do_GET(self):
        #print "GET"
        self.process(2)

    def do_POST(self):
        #print "---POST---"
        self.process(1)

    def process(self, type):
        if 1 == type:#POST
            #print self.path
            #print self.headers
            nbytes = int(self.headers['Content-Length'])
            data = self.rfile.read(nbytes)

            url = str(self.path).replace("/", "")
            startTime = getNowTimestamp()
            if Options.get('url', None) is not None and Options['url'].get(url, None) is not None:
                content = Options['url'][url](data)
            else:
                content = u""
            print "AllUseTime: %s" % (getNowTimestamp() - startTime)

            #content = content.encode("UTF-8")
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
    #init mysql
    Options['mysql'] = MySQLOption()
    initSession()
    print Options
    #initJS()
    #sjwhzdwh("{}");
    #startCrontab();
    start_server(HTTP_SERVER_PORT)