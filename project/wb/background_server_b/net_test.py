# -*- coding:utf-8 -*-

import time, os
import socket
#import sys
#reload(sys)
#sys.setdefaultencoding("utf-8")


HOST=''
PORT=5005
BUFSIZ=10
ADDR=(HOST, PORT)

tcpSerSock = socket.socket(socket.AF_INET, socket.SOCK_STREAM, 0)
tcpSerSock.bind(ADDR)
tcpSerSock.listen(10)

while True:
    print 'waiting for connection...'
    tcpCliSock, addr = tcpSerSock.accept()
    print '...connected from:', addr

    data = ''
    while True:
        tmp = tcpCliSock.recv(BUFSIZ)
        if not tmp:
            break
        data = data + tmp
        if len(tmp) < BUFSIZ:
            break
    print data
    tcpCliSock.close()
