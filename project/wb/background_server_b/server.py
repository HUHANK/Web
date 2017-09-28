# -*- coding:utf-8 -*-

from multiprocessing import Process, Queue
from net_server import *
from main_process import *
from config import *
import time
import sys
reload(sys)
sys.setdefaultencoding("utf-8")



if __name__ == '__main__':
    q = Queue(100)
    for i in range(MAIN_PROCESS_NUM):
        p = Process(target=MainProcess, args=(q,))
        p.start()

    netSer = NetServer(q)
    netSer.start()

