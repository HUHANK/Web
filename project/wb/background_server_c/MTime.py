# -*- coding:utf-8 -*-

import datetime, calendar, time

def getNowTimestamp():
    return time.time()

#YYYY-MM-DD
def getYearWeek(strdate):
    date = datetime.datetime.strptime(strdate, '%Y-%m-%d')
    YearWeek = date.isocalendar()
    return YearWeek

#获取当前年份，第几周，一周的第几天
def getNowYearWeek():
    date = datetime.datetime.now()
    return date.isocalendar()
#根据指定的日期获取年份，第几周，一周的第几天
def getWeekInfoByDate(str):
    date = datetime.datetime.strptime(str, '%Y%m%d')
    return date.isocalendar()

#获取某个星期的第一天日期
# getWeekFirstday("2017#34")
def getWeekFirstday(weekflag):
    year_str = weekflag[0:4]
    week_str = weekflag[5:]
    if int(week_str)>=53:
        Monday = "Error,Week Num greater than 53!"
    else:
        yearstart_str = year_str + '0101'
        yearstart = datetime.datetime.strptime(yearstart_str, '%Y%m%d')
        yearstartcalendarmsg = yearstart.isocalendar()
        yearstartweekday = yearstartcalendarmsg[2]
        yearstartyear = yearstartcalendarmsg[0]
        if yearstartyear < int(year_str):
            daydelat = (8 - int(yearstartweekday)) + (int(week_str) - 1) * 7
        else:
            daydelat = (8 - int(yearstartweekday)) + (int(week_str) - 2) * 7
        Monday = (yearstart + datetime.timedelta(days=daydelat)).date()
    return Monday

#
# 获取该日期是这一年的第几天
# YYYY-MM-DD
def getYearDay(strdate):
    dt = datetime.datetime.strptime(strdate, "%Y-%m-%d")
    return dt.strftime("%j")

# 根据年，天获取日期
def getDateByDay(year,day):
    fir_day = datetime.datetime(year,1,1)
    zone = datetime.timedelta(days=day-1)
    return datetime.datetime.strftime(fir_day + zone, "%Y-%m-%d")

def getDateByDay2(year,day):
    fir_day = datetime.datetime(year,1,1)
    zone = datetime.timedelta(days=day-1)
    return datetime.datetime.strftime(fir_day + zone, "%Y%m%d")

def getNowDate1():
    return datetime.datetime.strftime(datetime.datetime.now(), "%Y年%m月%d日")

def getNowDate2():
    return datetime.datetime.strftime(datetime.datetime.now(), "%Y%m%d")

#获取一年的总共天数
def getYearTotalDays(year):
    ydays = 0
    for i in range(12):
        (tmp,mdays) = calendar.monthrange(year, i+1)
        ydays += mdays
    return ydays

#print  getYearTotalDays(2014)
#print getNowDate2()
#print getNowYearWeek()

#print getWeekInfoByDate("20171008")






