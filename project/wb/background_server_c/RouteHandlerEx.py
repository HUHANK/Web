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



