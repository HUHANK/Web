#_*_encoding:utf-8 _*_

s = u"我是中国人"
t = "我是中国人"

print s
print type(s)

print t
print type(t)

ss = s.encode("utf-8")

print ss
print type(ss)