# -*- coding:utf-8 -*-

import datetime, calendar, time, pytz

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
        Monday = datetime.datetime.strftime(Monday, "%Y-%m-%d")
    return Monday
#获取一周的第一天和最后一天
def getWeekFirstLastday(weekflag):
    year_str = weekflag[0:4]
    week_str = weekflag[4:]
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
        Sunday = Monday + datetime.timedelta(days=6)
        Monday = datetime.datetime.strftime(Monday, "%Y-%m-%d")
        Sunday = datetime.datetime.strftime(Sunday, "%Y-%m-%d")
    return (Monday, Sunday)

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

#获取当前时间的小时
def getNowHours():
    return datetime.datetime.now().strftime('%H')

#获取一年的最后一个周
def getYearLastWeek(year):
    md = 1231
    tmp = "%s%s" % (year, md)
    (y,w,d) = getWeekInfoByDate(tmp)
    while y != year:
        md = md -1
        tmp = "%s%s" % (year, md)
        (y, w, d) = getWeekInfoByDate(tmp)
        #print tmp
    return getWeekInfoByDate(tmp)

#获取指定周的下一个周
def getNextWeek(year, week):
    year = int(year)
    week = int(week)
    (lYear, lWeek, lDay) = getYearLastWeek(year)
    week = week+1
    if week > lWeek:
        week = 1
        year = year + 1
        return (year, week)
    return (year, week)
#获取指定周的上一个周
def getPrevWeek(year, week):
    year = int(year)
    week = int(week)
    if week <= 1:
        year = year - 1
        (lYear, lWeek, lDay) = getYearLastWeek(year)
        return (lYear, lWeek)
    else:
        return (year, week-1)

def Datetime_UTC2Shanghai(str, fmt):
    """把世界时间转换成中国上海时区的标准时间"""
    date = datetime.datetime.strptime(str, fmt).replace(tzinfo=pytz.utc).astimezone(pytz.timezone('Asia/Shanghai'))
    return date.strftime(fmt)

def Datetime_UTC2Shanghai2(date, fmt):
    """把世界时间转换成中国上海时区的标准时间"""
    date = date.replace(tzinfo=pytz.utc).astimezone(pytz.timezone('Asia/Shanghai'))
    return date.strftime(fmt)







