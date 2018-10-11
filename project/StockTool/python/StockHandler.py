# -*- coding:utf-8 -*-

import tornado.web
import json, sys
import tushare  as ts

def ERROR(code, msg, ret={}):
    ret["ErrCode"] = code
    ret["ErrMsg"] = msg
    return json.dumps(ret)

def get_stock_basics(data):
    df = ts.get_stock_basics()
    df = df.sort_values(by=["industry","area"])
    data["ret_data"] = df.to_json(orient='records')
    print df
    return data

class StockHandler(tornado.web.RequestHandler):
    def get(self, *args, **kwargs):
        self.write("Hello World! StockHandler get")
        self.flush()

    def post(self, *args, **kwargs):
        print "post"
        print self.request.body
        data = self.request.body
        if data is None or len(data) < 1:
            self.write(ERROR(1, "POST的数据为空!"))
            self.flush()
            return

        data = json.loads(data)
        method = data.get("method", "")
        if len(method) < 1:
            self.write(ERROR(1, "POST的数据method为空!"))
            self.flush()
            return

        main = sys.modules["__main__"]
        if not hasattr(main, method):
            self.write(ERROR(100, "method方法无效!"))
            self.flush()
            return

        ERROR(0, "", data)
        ret = getattr(main, method)(data)
        self.write(json.dumps(ret))
        self.flush()
        return