# -*- coding:utf-8 -*-

import sys, os
reload(sys)
sys.setdefaultencoding("utf-8")
import tornado.web
import tornado.httpserver
import tornado.ioloop
from StockHandler import *

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        #self.write( self.get_template_path() )
        self.write("Hello World!")
        self.flush()


handlers=[
    (r'/', IndexHandler),
    (r'/stock.py', StockHandler),
]

settings={
    "debug": False
}


if __name__ == "__main__":
    app = tornado.web.Application(handlers, **settings)

    app.listen(8800)

    print "Now start the server..."
    tornado.ioloop.IOLoop.current().start()