# -*- coding:utf-8 -*-

import BaseHTTPServer
from config import *
from RouteHandler import *

class RequestHandler(BaseHTTPServer.BaseHTTPRequestHandler):

    def do_GET(self):
        print "GET"
        self.process(2)

    def do_POST(self):
        print "---POST---"
        self.process(1)

    def process(self, type):
        if 1 == type:#POST
            print self.path
            #print self.headers
            nbytes = int(self.headers['Content-Length'])
            data = self.rfile.read(nbytes)

            url = str(self.path).replace("/", "")
            if Options.get('url', None) is not None and Options['url'].get(url, None) is not None:
                content = Options['url'][url](data)
            else:
                content = u""

            #content = content.encode("UTF-8")
            #SEND
            self.send_response(200)
            self.send_header("Conten-type", "text/html")
            self.send_header("Access-Control-Allow-Origin","*")
            self.send_header("Conten-Length",str(len(content)))
            self.end_headers()
            self.wfile.write(content)

def start_server(port):
    print "Now Start HttpServer: PORT="+str(port) + "..."
    http_server = BaseHTTPServer.HTTPServer(('',int(port)), RequestHandler)
    http_server.serve_forever()

if __name__ == "__main__":
    #init mysql
    Options['mysql'] = MySQLOption();

    print Options
    start_server(HTTP_SERVER_PORT)