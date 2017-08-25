
from functools import  wraps

Methods = {}

def urlModify(url):
    return url.replace("/", "")

def route(url):
    def decorator(func):
        Methods[urlModify(url)] = func
        @wraps(func)
        def wrap(*args, **kw):
            func(*args, **kw)
        return wrap
    return decorator









@route("/test")
def test():
    print "test"




print "-------------------------"

test()

test.__call__()

print "-------------------------"
ss = "/test/"
print ss.replace("/", "")
