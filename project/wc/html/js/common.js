/*---------------时间日期--------------------*/

 // 获取当前月的第一天
function getCurrentMonthFirst() {
    var date = new Date();
    date.setDate(1);
    return date;
}

function getCurrentDay() {
    var dt = new Date();
    return dt.getDate();
}

function getCurrentMonth() {
    var dt = new Date();
    return (dt.getMonth()+1);
}

function getCurrentYear() {
    var dt = new Date();
    return dt.getFullYear();
}

// 获取指定月份有多少天, month不需要减1
function getMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
}

//获取日期是那个星期的第几天
CWEEK_DAY_NAME=["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
function getWeekDay(year, month, day) {
    month = month - 1;
    var dt = new Date(year, month, day);
    return dt.getDay();
}

//获取星期第几天的中文名称
function getWeekDayCName(n) {
    return CWEEK_DAY_NAME[n];
}




























