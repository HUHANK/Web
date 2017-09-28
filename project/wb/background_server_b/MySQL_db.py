# -*- coding:utf-8 -*-

import MySQLdb, time, types, datetime, exceptions, json
from config import *

class MySQLOption:

    def __init__(self):
        self.conn = None
        self.cursor = None
        self.Otime = 0
        self.tSlot = 60*60*1.0
        #print "init"

    def __del__(self):
        self.close()
        #print 'del'

    def close(self):
        if self.conn is not None:
            self.conn.close()

    def connect(self):
        self.close()
        self.conn = MySQLdb.connect(
            host=MYSQL_HOST, user=MYSQL_USER,
            passwd=MYSQL_PWD, db=MYSQL_DB,
            port=MYSQL_PORT, charset='utf8'
        )
        self.conn.autocommit(True)

        '''
        if self.conn is None or \
            (self.Otime-time.time()) >= self.tSlot:
            self.close()
            self.conn = MySQLdb.connect(
                host=MYSQL_HOST,user=MYSQL_USER,
                passwd=MYSQL_PWD,db=MYSQL_DB,
                port=MYSQL_PORT,charset='utf8'
            )
            self.conn.autocommit(True)
        '''

    def select(self,sql):
        self.connect()
        if sql is None:
            print 'The param sql is None!'
            return None
        self.conn.query(sql)
        r = self.conn.store_result()
        out_map = {'total': r.num_rows(), 'field_count': r.num_fields()}
        fields = []
        (field_info) = r.describe()

        for item in field_info:
            temp_dict = {'name':        item[0],
                         'type_code':   item[1],
                         'display_size': item[2],
                         'internal_size': item[3],
                         'precision':   item[4],
                         'scale':       item[5],
                         'null_ok':     item[6]}
            fields.append(temp_dict)
        out_map['fields'] = fields

        datas = []
        for i in range(r.num_rows()):
            (row,) = r.fetch_row()
            new_row = []
            for col in row:
                new_row.append(col)
            datas.append(new_row)
        out_map['datas'] = datas
        return out_map

    def select2(self, sql):
        self.connect()
        if sql is None:
            print 'The param sql is None!'
            return None
        self.conn.query(sql)
        r = self.conn.store_result()
        out_map = {'total': r.num_rows(), 'field_count': r.num_fields()}
        fields = []
        (field_info) = r.describe()

        for item in field_info:
            fields.append(item[0])

        datas = []
        for i in range(r.num_rows()):
            (row,) = r.fetch_row()
            new_row = {}
            for j in range(len(row)):
                new_row[fields[j]] = row[j]
            datas.append(new_row)
        out_map["data"] = datas
        return out_map


    def update(self, sql):
        self.connect()
        if sql is None:
            print 'The param sql is None!'
            return None
        cursor = self.conn.cursor()

        ret = True
        id = -1
        try:
            cursor.execute(sql)
            id = self.conn.insert_id()
        except MySQLdb.Error, e:
            print "Error:%s" % str(e)
            cursor.close()
            ret = False
        cursor.close()
        if ret :
            return id
        else:
            return id






