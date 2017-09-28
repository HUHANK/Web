# -*- coding:utf-8 -*-

from socket import  *

class HttpProtocol:

    def __init__(self, sock):
        self.sock = sock
        self.BUFSIZ = 1024
        self.src = ''
        self.parse()

    def read(self):
        while True:
            tmp = self.sock.recv(self.BUFSIZ)
            if not tmp:
                break
            self.src += tmp
            if len(tmp) < self.BUFSIZ:
                break

    def parse(self):
        self.read()
        print self.src