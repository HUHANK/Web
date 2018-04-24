# -*- coding: utf-8 -*-

from config import REDMINE_HOST, REDMINE_QUERY_ID, REDMINE_API_KEY
from redminelib import Redmine
import json
import urllib2
import traceback
from MTime import * 

RedmineUpdateInfo = {}


def AddRedmineUptInfo(uid, mode, traceNo, descript, time):
    """用户ID， 模式【1:Redmine录入, 2:从Redmine添加，3:从Redmine更新】， 跟踪号， 描述， 时间"""
    dic = RedmineUpdateInfo;
    uid = str(uid)
    mode = str(mode)
    traceNo = str(traceNo)

    if dic.get(uid, None) is None:
        dic[uid] = {}

    dic = dic[uid]
    if dic.get(mode, None) is None:
        dic[mode] = {}

    dic = dic[mode]
    dic[traceNo] = "%s|%s" % (descript, time)

def ResetRedmineUptInfo(uid):
    if RedmineUpdateInfo.has_key(uid):
        RedmineUpdateInfo.pop(uid)

def GetRedmineUptInfo(uid):
    res = RedmineUpdateInfo.get(str(uid), '')
    ResetRedmineUptInfo(str(uid))
    return res

def Redmine_DateTrf(date):
    str = date[0:10]
    str = str.split('-')
    res = ''
    for e in str:
        res = res + e
    return res


def Redmine_GetUpdatedThisWeekByHttpAll():
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

    #print issue.time_entries
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
    rs = Redmine_GetUpdatedThisWeekByHttpAll()
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

        fmt = '%Y-%m-%dT%H:%M:%SZ'
        row['created_on']   = Datetime_UTC2Shanghai(row['created_on'], fmt)
        row['updated_on']   = Datetime_UTC2Shanghai(row['updated_on'], fmt)

        tr = {}
        tr['System']        = row['project']['name']
        tr['User']          = row['assigned_to']['name']
        tr['StartDate']     = row['created_on'][0:10]
        tr['AddDate']       = Redmine_DateTrf(row['created_on'])
        tr['EditDate']      = Redmine_DateTrf(row['updated_on'])
        tr['ExpireDate']    = tr['EditDate']
        tr['ProgressRate']  = row['done_ratio']
        tr['ID']            = row['id']
        tr['TraceNo']       = '%s #%s' % (row['tracker']['name'], row['id'])
        tr['Detail']        = row['description']
        # print "*************************************"
        for field in row['custom_fields']:
            # print field
            # print field['id']
            # print field['value']
            # print field['name']
            if field['id'] == 7:
                tr['Type'] = field['value']
        tr2 = Redmine_GetIssue(row['id'])

        tr3 = dict(tr, **tr2)

        # print tr3
        # for key in tr3:
        #     print "%s : %s" % (key, tr3[key])
        ret.append(tr3)

    return ret

def Redmine_GetUpdateThisWeekByPdll(uid):
    (Year,Week,Day) = getNowYearWeek()
    (wFirstDay, wEndDay) = getWeekFirstLastday( "%s#%s" % (Year, Week))
    redmine = Redmine('http://%s/redmine'%(REDMINE_HOST), key=REDMINE_API_KEY)
    issues = redmine.issue.filter(updated_on="><%s|%s"%(wFirstDay,wEndDay), assigned_to_id=uid, status_id="*")

    ret = []
    for issue in issues:
        tr = {}
        tr["ID"]        = issue.id
        tr['System']    = issue.project['name']
        tr['User']      = issue.assigned_to['id']
        for custom_field in issue.custom_fields:
            if custom_field.id == 7:
                tr["Type"] = custom_field.value
        if tr.get("Type",'').strip() == '':
            tr["Type"] = u'项目管理';

        tr['TraceNo']   = "%s #%s" % (issue.tracker['name'], issue.id)
        tr['Detail'] = (issue.description).strip()
        if tr['Detail'] == '':
            tr['Detail'] = (issue.subject).strip()
        tr['Subject'] = (issue.subject).strip()

        for time_entry in issue.time_entries:
            tr['Property'] = (time_entry.activity['name']).strip()
        if tr.get('Property','') == '':
            tr['Property'] = u'进度跟踪'

        if hasattr(issue, 'category'):
            tr['Module'] = issue.category.name

        tr['ProgressRate'] = issue.done_ratio
        if hasattr(issue, 'start_date'):
            tr['StartDate'] = issue.start_date
        tr['AddDate'] = issue.created_on
        tr['EditDate'] = issue.updated_on
        if hasattr(issue, 'due_date'):
            tr['ExpireDate'] = issue.due_date
        else:
            tr['ExpireDate'] = tr['EditDate']

        created_on = datetime.datetime.strftime(issue.created_on, "%Y-%m-%d")
        updated_on = datetime.datetime.strftime(issue.updated_on, "%Y-%m-%d")
        #如果创建时间和更新时间是一天，并且进度为0，认为该任务只是添加，不做本周任务；
        #考虑到有人一周添加了几百条任务，但他只是做工作任务的录入这种情况；
        if created_on == updated_on and issue.done_ratio == 0:
            AddRedmineUptInfo(uid, '1', tr['TraceNo'], tr['Subject'], datetime.datetime.strftime(issue.created_on, "%Y-%m-%d %H:%M:%S"))
            continue

        ret.append(tr)
    return ret

def Redmine_DataTransfrom2(ret):
    """主要处理一些数据问题"""
    fmt = '%Y-%m-%d %H:%M:%S'
    for row in ret:
        #时间时区和格式的转换
        key = 'EditDate'
        if row.has_key(key):
            row[key] = Datetime_UTC2Shanghai2(row[key], fmt)
            row[key] =Redmine_DateTrf(row[key])

        key = 'StartDate'
        if row.has_key(key):
            #row[key] = Datetime_UTC2Shanghai2(row[key], fmt)
            #row[key] = row[key][0:10]
            row[key]  = row[key]
        else:
            row[key] = Datetime_UTC2Shanghai2(row['AddDate'], fmt)[0:10]

        key = 'AddDate'
        if row.has_key(key):
            row[key] = Datetime_UTC2Shanghai2(row[key], fmt)
            row[key] =Redmine_DateTrf(row[key])

        key = 'ExpireDate'
        if row.has_key(key):
            # row[key] = Datetime_UTC2Shanghai2(row[key], fmt)
            row[key] =Redmine_DateTrf(row[key].strftime("%Y-%m-%d"))
    return ret



def Redmine_GetData(mode, uid):
    try:
        if mode == "SINGLE":
            return Redmine_DataTransfrom2(Redmine_GetUpdateThisWeekByPdll(uid))
        elif mode == "ALL":
            return Redmine_DataTransfrom(None)
        else:
            print "Error Param!"
            return []
    except:
        print traceback.format_exc()
    return []


#-------------------test---------------------------
# ret = Redmine_GetData("SINGLE", u"ExtXYKJ胡有亮")

# print ret
# for row in ret:
#     print "----------------------------------------"
#     for key in row:
#         print "%s : %s" % (key, row[key])