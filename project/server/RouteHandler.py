# -*- coding:utf-8 -*-

from wrap import  route
from MySQL_db import *


@route("/")
def index(data) :
    return data


@route("/test/")
def test(data):
    db = Options['mysql']
    result = db.select('select * from stock_basics')
    return result
