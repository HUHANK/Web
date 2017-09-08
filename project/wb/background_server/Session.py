# -*- coding:utf-8 -*-
from config import *
from PubFunc import *
import  json

def initSession():
    data = ReadFile(SESSION_DATA_PATH)
    if data == "":
        return
    Options["session"] = json.loads(data)

def addSession(sid, sdata):
    if Options.get("session", None) is None :
        Options["session"] = {}
    Options["session"][str(sid)] = sdata
    return  Options["session"][str(sid)]

def findSession(sid):
    print sid
    if Options.get("session", None) is None :
        return None
    print Options["session"]
    if Options["session"].get(str(sid), None) is None:
        return None
    return Options["session"][str(sid)]