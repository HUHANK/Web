# -*- coding:utf-8 -*-

from http_protocol import *

def MainProcess(queue):
    while True:
        cliSock = queue.get()
        print cliSock
        #http = HttpProtocol(cliSock)
