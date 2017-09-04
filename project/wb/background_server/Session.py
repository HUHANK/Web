# -*- coding:utf-8 -*-
from config import *

def addSession(sid):
    if Options.get("session", None) is None :
        Options["session"] = {}
    Options["session"][str(sid)] = {}
    return  Options["session"][str(sid)]

def findSession(sid):
    if Options.get("session", None) is None :
        return None
    if Options["session"].get(str(sid), None) is None:
        return None
    return Options["session"][str(sid)]