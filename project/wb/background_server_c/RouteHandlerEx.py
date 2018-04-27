# -*- coding: utf-8 -*-

from    wrap        import route
from    MySQL_db    import *
from    Session     import *
from    MTime       import *
from    PubFunc     import *
from    RedmineProc import Redmine_GetData, AddRedmineUptInfo, GetRedmineUptInfo, GenRedmineIssuesQueryUrl
import  base64
import  uuid
import  traceback



def systemGetAllDict():
	db =  Options['mysql']
	ret = {}

	sql = "SELECT id, name FROM dict WHERE isRoot = 1"
	root = db.select2(sql)
	if root is None:
		return None

	for row1 in root["data"]:
		sql = "SELECT id, name FROM dict WHERE parent = %s"%(row1['id'])
		rs = db.select2(sql)
		if rs is None:
			return None

		name = row1['name']
		ret[name] = rs["data"]

		for row2 in ret[name]:
			sql = "SELECT id, name FROM dict WHERE parent = %s"%(row2['id'])
			rs = db.select2(sql)
			if rs is None:
				return None

			row2['data'] = rs['data']
	return ret


def systemUpdateDictItem(data):
	db =  Options['mysql']

	name = data.get('new_name', None)
	id = data.get("id", 0)
	if name is None:
		print "systemUpdateDictItem: parameter name Error!"
		return False
	sql = "UPDATE dict SET name = '%s' WHERE id = %s" % (name, id)

	rs = db.update(sql)
	if rs < 0:
		return False
	return True

def systemAddDictItem(data):
	db =  Options['mysql']
	name = data.get("name", None)
	if name is None or len(name) < 1:
		print "systemAddDictItem: parameter name Error!"
		return -1
	parent = data.get("parent", None)
	if parent is None or len(parent) < 1:
		print "systemAddDictItem: parameter parent Error!"
		return -1
	parent_id = data.get('', None)

	sql = "INSERT INTO dict(name,title, parent,isRoot) VALUES('%s', 0, %s, 0)"
	if parent == 'type':
		sql = sql % (name, 2)
	elif parent == 'property':
		sql = sql % (name, 3)
	elif parent == 'system':
		sql = sql % (name, 1)
	elif parent == 'module':
		if parent_id is None:
			print "systemAddDictItem: parameter parent_id Error!"
			return -1
		sql = sql % (name, parent_id)

	return db.update(sql)


def UpdateThisWeekStatu(wid, madd, mupt):
	""" 添加方式|更新方式
		添加方式：0：系统顺延 1：手动添加 2：从Redmine添加
		更新方式：0：无更新 1：手动更新 2：从Redmine更新
	"""
	db =  Options['mysql']
	(Year, Week, Day) = getNowYearWeek()
	sql = ""

	if madd is None and mupt is None:
		return 0

	if madd is None and mupt is not None:
		sql = "UPDATE user_work SET STATU = CONCAT(SUBSTR(STATU, 1, 1), '%s') \
			WHERE WID=%s AND YEAR=%s AND WEEK=%s" % ( \
				mupt, wid, Year, Week)

	if madd is not None and mupt is None:
		sql = "UPDATE user_work SET STATU = CONCAT('%s', SUBSTR(STATU, 2, 1)) \
			WHERE WID=%s AND YEAR=%s AND WEEK=%s" % ( \
				madd, wid, Year, Week)

	if madd is not None and mupt is not None:
		sql = "UPDATE user_work SET STATU = CONCAT('%s', '%s') \
			WHERE WID=%s AND YEAR=%s AND WEEK=%s" % ( \
				madd, mupt, wid, Year, Week)

	return db.update(sql)



def GetThisWeekWorkStatus(uid):
	""" 获取工作状态的信息
	"""
	db =  Options['mysql']
	(Year, Week, Day) = getNowYearWeek()
	ret = {}
	ret['self'] = {}
	ret['all'] = {}
	ret['self']['add'] = {}
	ret['self']['upt'] = {}
	ret['all']['add'] = {}
	ret['all']['upt'] = {}

	#本人的
	#本周添加
	ritem = ret['self']['add']
	sql = "SELECT TraceNo FROM work_detail WHERE id IN ( \
		SELECT WID FROM user_work WHERE YEAR = %s AND WEEK = %s AND UID = %s AND STATU LIKE '2%%') \
		"%(Year, Week, uid)

	rs = db.select2(sql)
	if rs is None:
		return ''
	ritem['count'] = rs.get("total", 0)

	iids = ""
	for row in rs["data"]:
		TraceNo = row.get("TraceNo", '')
		arr = TraceNo.split('#')
		sid = '0'
		iid = 0
		if len(arr) == 1:
			sid = arr[0]
		elif len(arr) > 1:
			sid = arr[1]
		try:
			iid = int(sid)
		except:
			print traceback.format_exc()

		if iid > 0:
			iids = iids + str(iid) + ","

	ritem['url'] = GenRedmineIssuesQueryUrl(iids.rstrip(","))

	ritem = ret['self']['upt']
	sql = "SELECT TraceNo FROM work_detail WHERE id IN ( \
		SELECT WID FROM user_work WHERE YEAR = %s AND WEEK = %s AND UID = %s AND STATU LIKE '%%2') \
		"%(Year, Week, uid)

	rs = db.select2(sql)
	if rs is None:
		return ''
	ritem['count'] = rs.get("total", 0)

	iids = ""
	for row in rs["data"]:
		TraceNo = row.get("TraceNo", '')
		arr = TraceNo.split('#')
		sid = '0'
		iid = 0
		if len(arr) == 1:
			sid = arr[0]
		elif len(arr) > 1:
			sid = arr[1]
		try:
			iid = int(sid)
		except:
			print traceback.format_exc()

		if iid > 0:
			iids = iids + str(iid) + ","

	ritem['url'] = GenRedmineIssuesQueryUrl(iids.rstrip(","))

	#全组的
	ritem = ret['all']['add']
	sql = "SELECT TraceNo FROM work_detail WHERE id IN ( \
		SELECT WID FROM user_work WHERE YEAR = %s AND WEEK = %s AND STATU LIKE '2%%') \
		"%(Year, Week)

	rs = db.select2(sql)
	if rs is None:
		return ''
	ritem['count'] = rs.get("total", 0)

	iids = ""
	for row in rs["data"]:
		TraceNo = row.get("TraceNo", '')
		arr = TraceNo.split('#')
		sid = '0'
		iid = 0
		if len(arr) == 1:
			sid = arr[0]
		elif len(arr) > 1:
			sid = arr[1]
		try:
			iid = int(sid)
		except:
			print traceback.format_exc()

		if iid > 0:
			iids = iids + str(iid) + ","

	ritem['url'] = GenRedmineIssuesQueryUrl(iids.rstrip(","))

	ritem = ret['all']['upt']
	sql = "SELECT TraceNo FROM work_detail WHERE id IN ( \
		SELECT WID FROM user_work WHERE YEAR = %s AND WEEK = %s AND STATU LIKE '%%2') \
		"%(Year, Week)

	rs = db.select2(sql)
	if rs is None:
		return ''
	ritem['count'] = rs.get("total", 0)

	iids = ""
	for row in rs["data"]:
		TraceNo = row.get("TraceNo", '')
		arr = TraceNo.split('#')
		sid = '0'
		iid = 0
		if len(arr) == 1:
			sid = arr[0]
		elif len(arr) > 1:
			sid = arr[1]
		try:
			iid = int(sid)
		except:
			print traceback.format_exc()

		if iid > 0:
			iids = iids + str(iid) + ","

	ritem['url'] = GenRedmineIssuesQueryUrl(iids.rstrip(","))

	return ret



