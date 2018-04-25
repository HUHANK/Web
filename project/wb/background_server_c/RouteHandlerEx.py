# -*- coding: utf-8 -*-

from    wrap        import route
from    MySQL_db    import *
from    Session     import *
from    MTime       import *
from    PubFunc     import *
from    RedmineProc import Redmine_GetData, AddRedmineUptInfo, GetRedmineUptInfo
import  base64
import  uuid


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