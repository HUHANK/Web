

from MySQL_db import *


def initJS():
    db = Options['mysql'];
    fo = open(JS_DIR, "w")

    #init sysmodule
    sql = "select DISTINCT sysmodule from week_report"
    data = db.select(sql)
    print data['datas']
    str = "var SysModules='"+json.dumps(data['datas'])+"';"
    fo.writelines(str)
    fo.writelines('\n')

    sql = "select DISTINCT Type from week_report";
    data = db.select(sql)
    print data['datas']
    str = "var Types='" + json.dumps(data['datas']) + "';"
    fo.writelines(str)
    fo.writelines('\n')

    sql = "select DISTINCT Property from week_report";
    data = db.select(sql)
    print data['datas']
    str = "var Propertys='" + json.dumps(data['datas']) + "';"
    fo.writelines(str)
    fo.writelines('\n')

    sql = "select DISTINCT EmpName from week_report";
    data = db.select(sql)
    print data['datas']
    str = "var EmpNames='" + json.dumps(data['datas']) + "';"
    fo.writelines(str)
    fo.writelines('\n')

    fo.close()