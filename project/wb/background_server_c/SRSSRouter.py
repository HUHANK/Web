# -*- coding:utf-8 -*-

from PubFunc import *
from GitBusiness import *


Git = None

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

