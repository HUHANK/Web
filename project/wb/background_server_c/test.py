#_*_encoding:utf-8 _*_


import ibm_db

conn = ibm_db.connect("DATABASE=KSDBS;HOSTNAME=10.10.14.36;PORT=50000;PROTOCOL=TCPIP;UID=back;PWD=back;", "", "")


def select(sql):
    stmt = ibm_db.exec_immediate(conn, sql)
    result = ibm_db.fetch_both(stmt)
    ret = []
    while result:
        #print result
        ret.append(result)
        result = ibm_db.fetch_both(stmt)
    return ret

sql = "SELECT B.HOLDER_ACC_NO, B.SEAT_NO FROM KS.FUND A JOIN KS.HOLDER_ACC B ON A.BRANCH_CODE = B.BRANCH_CODE AND A.CUST_NO = B.CUST_NO WHERE A.CUST_NO NOT IN ('0000000002')"
res =  select(sql)
tmp = ("%010d" % 5)

begin = 310
mid = 76625
#print res
for row in res:
    #print row
    beg_acc = ("%010d" % begin)
    begin += mid
    end_acc = ("%010d" % begin)
    holder_acc = row["HOLDER_ACC_NO"]
    seat_no = row['SEAT_NO']
    sql = "UPDATE KS.DONE_DETAIL SET SEC_ACC = '%s', DONE_SEAT = '%s' WHERE SEC_ACC >= '%s' and SEC_ACC <= '%s'" % (holder_acc, seat_no, beg_acc, end_acc)
    print sql
    ibm_db.exec_immediate(conn, sql)
