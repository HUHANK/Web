# -*- coding: utf-8 -*-

from redminelib import Redmine
import json
import urllib2

#---config----

REDMINE_HOST = '10.10.14.56'
"""用户自定义查询的ID，ID必须与API_KEY配对，否则发生权限问题"""
REDMINE_QUERY_ID = 299
"""用户的API访问键"""
REDMINE_API_KEY = '947a6d452a7ef68474070c1a5eb2ff729d5f342e'


#----process----

def Redmine_UpdatedThisWeek():
    """该函数主要是用于获取本周跟新的Redmine记录"""
    header_dic = {
        'Content-Type'      : 'application/json',
        'X-Redmine-API-Key' : REDMINE_API_KEY
    }
    page = 1
    ret = {}
    #ret["total_count"]  = 0
    ret["issues"]  = []
    while True:
        url = "http://%s/redmine/issues.json?page=%s&query_id=%s" % (REDMINE_HOST, page, REDMINE_QUERY_ID)
        _req = urllib2.Request(url=url, headers=header_dic)
        if _req is None:
            break

        _res_data = urllib2.urlopen(_req)
        if _res_data is None:
            break

        res = json.loads( _res_data.read() )
        if res is None:
            break

        page = page + 1
        #ret["total_count"] = res.get("total_count", 0)
        ret["issues"] = ret["issues"] + res.get("issues", [])

        if len(res.get("issues", [])) < res.get("limit", 25):
            break

    return ret.get('issues', [])

def Redmine_GetIssue(id):
    """主要是获取单个Issue的更详细信息"""
    url = "http://%s/redmine" % REDMINE_HOST
    redmine = Redmine(url, key=REDMINE_API_KEY)
    ret = {}

    issue = redmine.issue.get(id)
    # rs = list(issue)
    # print rs
    # print len(rs)
    # for row in rs:
    #     print row

    print issue.time_entries
    for time_entry in issue.time_entries:
        # print '-------------------'
        # print list(time_entry)
        # print time_entry.project
        # print time_entry.activity['name']
        ret['Property'] = time_entry.activity['name']
    return ret

#Redmine_GetIssue(15217)
def Redmine_DataTransfrom(user):
    """主要是把Redmine的数据转换成周报系统能识别的数据"""
    ret = []
    rs = Redmine_UpdatedThisWeek()
    #row = rs[2]
    for row in rs:
        # for key in row:
        #     print "%s : %s" % (key, row[key])
        # print "------------------------------"
        # print row["status"]['name']
        # print row["priority"]['name']
        # print row['author']['name']
        # print row['project']['name']
        # print row['custom_fields'][7]['name']
        # print row['fixed_version']['name']
        # print row['assigned_to']['name']
        # print row['updated_on']
        # print row['id']
        # print row['done_ratio']
        if user is None or user != row['assigned_to']['name']:
            continue

        tr = {}
        tr['System']        = row['project']['name']
        tr['User']          = row['assigned_to']['name']
        tr['EditDate']      = row['updated_on']
        tr['ProgressRate']  = row['done_ratio']
        tr['TraceNo']       = '%s #%s' % (row['tracker']['name'], row['id'])
        tr['Detail']        = row['description']
        tr['StartDate']     = row['created_on']
        for field in row['custom_fields']:
            # print field
            # print field['id']
            # print field['value']
            # print field['name']
            tr['Type'] = field['value']
        tr2 = Redmine_GetIssue(row['id'])

        tr3 = dict(tr, **tr2)

        # print tr3
        # for key in tr3:
        #     print "%s : %s" % (key, tr3[key])
        ret.append(tr3)

    return ret


def Redmine_GetData(mode, username):
    if mode == "SIGNLE":
        return Redmine_DataTransfrom(username)
    elif mode == "ALL":
        return Redmine_DataTransfrom(None)
    else:
        print "Error Param!"
        return []

Redmine_GetData()