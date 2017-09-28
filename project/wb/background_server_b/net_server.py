# -*- coding:utf-8 -*-

from config import *
from socket import *
#from abc import ABCMeta, abstractmethod

class NetServer:

    def __init__(self, queue):
        self.sock = None
        self.HOST = ''
        self.PORT = HTTP_SERVER_PORT
        self.ADDR = (self.HOST, self.PORT)
        self.QUEUE = queue

    def __del__(self):
        pass

    def start(self):
        self.sock = socket(AF_INET, SOCK_STREAM)
        self.sock.bind(self.ADDR)
        self.sock.listen(10)

        while True:
            print "waiting for connection..."
            cliSock, addr = self.sock.accept()
            print "...connected from :", addr
            self.QUEUE.put(" A ")
