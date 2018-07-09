#_*_encoding:utf-8 _*_

import os, shutil
from GitBusiness import *

g = GitProc(path="./git/jzjy0", url = 'http://wb_hyl:hyl12345678@10.10.12.120/rzrq/jzjy.git')
g.repo()

ret = g.commit_diff("518bacd01d76fc0b066913cee6671aa89e265098")

def scopy(spath, delimiter, dpath):
    if not os.path.exists(dpath):
        os.makedirs(dpath);
    print spath
    destp = os.path.join(delimiter, spath.split(delimiter)[1])
    destp = dpath+destp
    if not os.path.exists(os.path.dirname(destp)):
        os.makedirs( os.path.dirname(destp) )
    shutil.copy(spath, destp)

for f in ret:
    if "/back2/" in f:
        scopy("./git/jzjy0/"+f, "/back2/", "./upg-package/test")


