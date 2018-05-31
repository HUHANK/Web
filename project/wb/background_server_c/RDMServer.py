# -*- coding:utf-8 -*-

from config import *
import os
import multiprocessing


def startRDMServer():
    basedir = GIT_REPO_BASE_PATH

    if not os.path.exists(basedir):
        os.makedirs(basedir)

    flist = os.listdir(basedir)
    dirlist = []
    for f in flist:
        fpath = os.path.join(basedir, f)
        if os.path.isdir(fpath):
            dirlist.append(fpath)

    Options['RDMServers'] = []
    for dir in dirlist:
        rdm = RDMServer()
        rdm.set_git_dir(dir)
        Options['RDMServers'].append(rdm)
    print Options



class RDMServer(object):
    """远程部署管理服务"""
    def __init__(self):
        self.QUEUE_SIZE = 5
        self.queue = multiprocessing.Queue(self.QUEUE_SIZE)
        self.process = None

        self.ServerName = ''
        self.GitType    = ''
        self.GitDir     = ''

        self.git        = None

    def set_git_dir(self, dir):
        self.GitDir = dir
        self.ServerName = os.path.basename(dir).upper()
        self.GitType = self.ServerName.split('_')[0]
        # print self.GitDir, self.GitType, self.ServerName

    def start(self):
        self.process = multiprocessing.Process(target=RDMServer.MainProcess, args=(self,))
        self.process.start()

    def MainProcess(self):
        pass



startRDMServer()