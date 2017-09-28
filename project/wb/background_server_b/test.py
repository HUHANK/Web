
import datetime, calendar
import uuid

def getYearWeek(strdate):
    date = datetime.datetime.strptime(strdate, '%Y-%m-%d')
    YearWeek = date.isocalendar()
    return YearWeek[1]

def getNowYearWeek():
    date = datetime.datetime.now()
    return date.isocalendar()[1]

def getDayInWeekMonday():
    week_num = datetime.datetime.now().weekday()
    Monday = datetime.datetime.now() + datetime.timedelta(days=-week_num)
    Monday = str(Monday)[0:10]
    return Monday


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

def getYearDay(strdate):
    dt = datetime.datetime.strptime(strdate, "%Y-%m-%d")
    return dt.strftime("%j")

def getDateByDay(year,day):
    fir_day = datetime.datetime(year,1,1)
    zone = datetime.timedelta(days=day-1)
    return datetime.datetime.strftime(fir_day + zone, "%Y-%m-%d")

print getYearWeek("2017-07-30")
print getNowYearWeek()
print getDayInWeekMonday()
print getWeekFirstday("2017#34")
print getYearDay("2017-08-30")
print getDateByDay(2017, 241)
cal = calendar.month(2017, 8)
print cal

print calendar.monthrange(2017, 8)
print calendar.weekday(2017, 8, 21)

print str(uuid.uuid4())