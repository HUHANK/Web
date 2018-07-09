# -*- coding:utf-8 -*-

from PubFunc import *
from GitBusiness import *
from FileOpt import *


Git = None
UPGRADE_PACKAGE_PATH = "./upg-package"
UPGRADE_PACKAGE_PATH_TMP = ''

def GitInit(path, url):
    global Git
    Git = GitProc(path, url)
    Git.repo()

def GitGetInitInfo(data):
    global Git
    ret = {}
    ret["GitBranch"] = {}
    ret["GitBranch"]['current'] = Git.current_branch()
    ret["GitBranch"]['local']   = Git.local_branches_name()
    ret["GitBranch"]['remote']  = Git.remote_branches_name()

    return SuccessDeal(ret)

def GitPullAndFetch(data):
    global Git
    ret = {}

    ret['res'] = Git.pull_fetch()

    ret["GitBranch"] = {}
    ret["GitBranch"]['current'] = Git.current_branch()
    ret["GitBranch"]['local'] = Git.local_branches_name()
    ret["GitBranch"]['remote'] = Git.remote_branches_name()

    return SuccessDeal(ret)

def GitChangeBranch(data):
    global Git
    ret = {}
    cbranch = data.get("branch", None)
    if cbranch is None or len(cbranch) < 1:
        return ErrorDeal(ret, "GitChangeBranch参数错误!")

    cbranch = cbranch[0]

    if 'origin' in cbranch:
        #切换远程分支到本地
        ret['res'] = Git.checkout_remote(cbranch)
    else:
        #切换本地分支
        ret['res'] = Git.checkout_local(cbranch)

    return SuccessDeal(ret)

def GitLogSnippet(data):
    global Git
    ret = {}

    count = data.get("count", None)
    skip  = data.get("skip", None)
    count = count[0] if count is not None else 100
    skip = skip[0] if skip is not None else 0

    ret['logs'] = Git.logs(count=count, skip=skip)
    return SuccessDeal(ret)

def GitPackPackage(cmit, type):
    global Git
    global UPGRADE_PACKAGE_PATH_TMP

    UPGRADE_PACKAGE_PATH_TMP = genUUID()
    destPath = os.path.join(UPGRADE_PACKAGE_PATH, UPGRADE_PACKAGE_PATH_TMP)
    UPGRADE_PACKAGE_PATH_TMP = destPath
    paths = Git.commit_diff(cmit)
    if len(paths) == 0:
        return True

    for fpath in paths:
        if "JZJY" in type:
            if "/back2/" in fpath:
                tmp = os.path.join(Git._path, fpath)
                git_file_copy(tmp, "/back2/", destPath)
        if "RZRQ" in type:
            if "/back/" in fpath:
                tmp = os.path.join(Git._path, fpath)
                git_file_copy(tmp, "/back/", destPath)
    if os.path.exists(os.path.join(destPath, "back2")):
        zip_dir(os.path.join(destPath, "back2"), os.path.join(destPath, "back2.zip"))
        shutil.rmtree(os.path.join(destPath, "back2"))
    return True

def StartUpgrade(data):
    ret = {}
    type = data.get("type", None)
    cmit = data.get("cmit", None)
    if type is None or cmit is None:
        return ErrorDeal(ret, "请求参数不全!")
    type = type[0]
    cmit = cmit[0]
    GitPackPackage(cmit, type)

    os

    return SuccessDeal(ret)