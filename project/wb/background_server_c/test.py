#_*_encoding:utf-8 _*_


import MySQLdb


db = MySQLdb.connect("10.10.14.36", "root", "123456", "weekreportsys", charset='utf8')

cursor = db.cursor()

cursor.execute("SELECT * from user")

ret = cursor.fetchall()

print list(ret)