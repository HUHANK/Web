#_*_encoding:utf-8 _*_


f = open(u"D:/TEST/中登数据文件/20170509/SJSJG0509.DBF", "rb")
filedata = f.read()
filesize = f.tell()
f.close()

print filesize

