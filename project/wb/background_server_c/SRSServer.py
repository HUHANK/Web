# -*- coding:utf-8 -*-

import BaseHTTPServer
from SocketServer import ThreadingMixIn
from PubFunc import *

import sys
reload(sys)
sys.setdefaultencoding("utf-8")


class SRSServer(BaseHTTPServer.BaseHTTPRequestHandler):
    def do_GET(self):
        print dir(self)
        print self.path


    def do_POST(self):
        print list(self)


class ThreadedHTTPServer(ThreadingMixIn, BaseHTTPServer.HTTPServer):
    """Handle requests in a separate thread."""

def start_server(port):
    print "Now Start HttpServer: PORT="+str(port) + "..."
    http_server = ThreadedHTTPServer(('', int(port)), SRSServer)
    http_server.serve_forever()







if __name__ == "__main__":

    execfunc("start_server", 6008)
    #start_server(6008)