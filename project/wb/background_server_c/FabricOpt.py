# -*- coding:utf-8 -*-

import fabric, os, sys
from fabric.api import  env, run, cd, put

env.hosts = ['10.10.14.36']
env.user = 'back'
env.password = 'back'

LOCAL_PATH = ''

def fput():
    global LOCAL_PATH

    with cd("~"):
        run("mkdir upgrade")

    put(local_path=LOCAL_PATH, remote_path='./upgrade/')
    fname = os.path.basename(LOCAL_PATH)
    with cd('./upgrade/'):
        run("unzip "+fname)
        run("rm -rf "+fname)



def upload(lpath):
    global LOCAL_PATH
    LOCAL_PATH = lpath

    bname = os.path.basename(__file__)
    cmd = "fab -f %s fput" % (bname)
    os.system(cmd)

if __name__ == "__main__":
    for arg in sys.argv:
        print  arg