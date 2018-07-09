# -*- coding:utf-8 -*-

import git
import traceback
from collections import namedtuple
import sys
reload(sys)
sys.setdefaultencoding("utf-8")

Commit = namedtuple('Commit',['user', 'commit_time', 'summary', 'hexsha'])

class Progress(git.RemoteProgress):
    def update(self, op_code, cur_count, max_count=None, message=''):
        print "[%s],[%s],[%s],[%s]" % (op_code, cur_count, max_count, message)

def print_commit(commit):
    print("[%s][%s][%s]"%(commit.author.name,str(commit.authored_datetime), commit.summary))

def utf8_gb2312(str):
    if str is None:
        return ''
    return str.decode('utf-8').encode('gb2312')

def gb2312_utf8(str):
    if str is None:
        return ''
    return str.decode('gbk').encode('utf-8')

class GitProc(object):
    """Git Business"""
    def __init__(self, path=None, url=''):
        self._path = path
        self._url = url
        self._repo = None
        self._refs = []

    def repo(self):
        try:
            self._repo = git.Repo(self._path)
        except (git.NoSuchPathError, git.InvalidGitRepositoryError):
            print traceback.format_exc()
            print "Now clone from remote url: %s to local path: %s" % (self._url, self._path)
            p = Progress()
            self._repo = git.Repo.clone_from(self._url, self._path, branch='master', progress=p)
            print "##############Clone Sucess!###############"

    def current_branch(self):
        return (self._repo.active_branch.name)

    def get_remote_branches(self):
        origin = self._repo.remote("origin")
        self._refs = origin.refs

    def remote_branches_name(self):
        ret = []
        # if len(self._refs) < 1:
        self.get_remote_branches()
        for br in self._refs:
            ret.append(br.name)
        return ret

    def local_branches_name(self):
        ret = []
        for br in self._repo.heads:
            #ret.append(gb2312_utf8(br.name))
            ret.append(br.name)
        return ret

    def checkout_remote(self, branch = None):
        if branch is None:
            raise ValueError("Param branch can't be None!")
        # 字符编码转换
        branch = utf8_gb2312(branch)
        git = self._repo.git
        return git.checkout(t=branch)


    def checkout_local(self, branch = None):
        if branch is None:
            raise ValueError("Param branch can't be None!")
        branch = utf8_gb2312(branch)
        git = self._repo.git
        return git.checkout(branch)


    def del_local_branch(self, branch = ''):

        if len(branch) < 1 :
            if self.current_branch() == "master":
                return True
            else:
                branch = self.current_branch()
                self.checkout_local('master')
        else:
            has = False
            for br in self.local_branches_name():
                if branch == br:
                    has = True
                    break
            if not has:
                print "The local don't has the branch!"
                return False

            if branch == self.current_branch():
                self.checkout_local('master')

        branch = utf8_gb2312(branch)
        git = self._repo.git

        git.branch(D=branch)
        return True

    def commits(self, count=10, skip=0):
        commits = list(self._repo.iter_commits('HEAD', max_count=count, skip=skip))

        ret = []
        for commit in commits:
            com = Commit(user=commit.author.name, commit_time=str(commit.authored_datetime),
                         summary=commit.summary, hexsha= commit.hexsha)
            ret.append(com)
        return ret

    def get_commit_trees(self, hexsha=''):
        if len(hexsha) < 1:
            return ''
        commit = self._repo.commit(hexsha)
        print_commit(commit)
        # for entry in commit.tree:
        #     print entry.path
        #     for b in entry.blobs:
        #         print "\t",b.path
        print dir(commit)
        print commit.repo.index
        # for blob in list(commit.repo.index.iter_blobs()):
        #     print blob[1].path

        # for (path, stage), entry in commit.repo.index.entries.items():
        #     if stage != 0:
        #         print path, stage

    def _log_parse(self, section):
        print "+++++++++++++++++++++++++++++++++++++++++++++++++++++++"
        print section
        ret = {}
        BlankLineNum = 0
        for line in section.split("\n"):
            line = line.strip()
            if line == '':
                BlankLineNum += 1
                continue

            if BlankLineNum == 0:
                if line[:6] == 'commit':
                    ret['hexsha'] = line.split(' ', 1)[1].strip()
                elif line[:6] == 'Author':
                    ret['author'] = line.split(':', 1)[1].strip()
                elif line[:4] == 'Date':
                    ret['date'] = line.split(':', 1)[1].strip()
            elif 1 == BlankLineNum:
                ret['message'] = ret.get('message', '')+line+"\n"
            elif 2 == BlankLineNum:
                ret['files'] = ret.get('files', '') + line + "\n"

        return ret

    def logs(self, count=10, skip=0):
        git = self._repo.git
        res = git.log("--name-status",'--encoding=UTF-8','--max-count=%s'%count,
                      '--skip=%s'%skip, '--date=iso')

        ret = []
        section = ''
        for line in res.split('\n'):
            if line[:6] == 'commit':
                if len(section) > 0:
                    ret.append(self._log_parse(section))
                section = ''
            section += line+"\n"
        if len(section) > 0:
            ret.append(self._log_parse(section))
        return ret

    def commits_diff(self, cid1, cid2):
        git = self._repo.git
        res = git.diff("--name-only", cid1, cid2)
        ret = []
        for line in res.split("\n"):
            ret.append(line)
        return ret

    def commit_diff(self, cid):
        git = self._repo.git
        res = git.diff_tree('-r', '--no-commit-id', '--name-only', cid)
        ret = []
        for line in res.split("\n"):
            ret.append(line)
        return ret

    def pull_fetch(self):
        git = self._repo.git
        res = "Pull...\n"
        rs = git.pull()
        res = res + rs
        res = res + "\nFetch...\n"
        rs = git.fetch()
        res = res + rs
        return res


# g = GitProc(path="./git/jzjy", url = 'http://wb_hyl:hyl12345678@10.10.12.120/rzrq/jzjy.git')
# g.repo()
# for e in g.remote_branches_name():
#     print e
#
# print "Local Branches"
# for e in g.local_branches_name():
#     print e
# print "Current Branch"
# print g.current_branch()
# # g.checkout_local('develop/5040-h1/20180522集中交易5040-h2')
# # g.checkout_remote('origin/develop/5040-h1/20180522集中交易5040-h2')
# # print g.current_branch()
# # g.del_local_branch('develop/5040-h1/20180522集中交易5040-h2')
#
# # for com in g.commits(2):
# #     print com
# #     print com.user, com.summary
#
# print "------------------------------------------------------"
# # g.get_commit_trees("5a3224da09aa68061a2bfeca2423bde36971c27a")
# # print g.logs()
# # print g.commits_diff('6a501f3a5d35eff85989280e2a2868eeed2f5d23', '997c8c2201e47ff8b3e1b1a4cb54a9fdffc15c2d')
#
# print g.commit_diff('6a501f3a5d35eff85989280e2a2868eeed2f5d23')