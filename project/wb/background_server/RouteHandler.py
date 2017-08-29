# -*- coding:utf-8 -*-

import json
from wrap import  route
from MySQL_db import *


@route("/")
def index(data) :
    return data


@route("/test/")
def test(data):
    param = json.loads(data)
    start = (param['page']-1)*param['page_size']
    sql = "select * from WEEK_REPORT limit %s, %s" % (start, param['page_size'])
    db = Options['mysql']
    result = db.select(sql)
    result = json.dumps(result)
    return result
