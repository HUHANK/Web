# -*- coding:utf-8 -*-

from functools import  wraps
from config import  *

def urlModify(url):
    return url.replace("/", "")

def route(url):
    def decorator(func):
        #fMethods[urlModify(url)] = func
        if Options.get('url', None) is None :
            Options['url'] = {}
        Options['url'][urlModify(url)] = func
        @wraps(func)
        def wrap(*args, **kw):
            func(*args, **kw)
        return wrap
    return decorator




