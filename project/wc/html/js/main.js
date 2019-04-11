jQuery(document).ready(function($) {
    main();
});

function main() {
    NavigationBarInit();
    NavigationBarEvent();
    MonthCalendarInit();
}

//导航栏优化
function NavigationBarInit() {
    $("#top-menu .week-report").addClass('selected');
    $("#main .week-report").css("display", "block");

    // $("#top-menu .calendar").addClass('selected');
    // $("#main .calendar").css("display", "block");
}

//导航栏事件
function NavigationBarEvent() {
    $("#top-menu ul li").click(function(event) {
        if ($(this).hasClass('selected')) return;
        $(this).parent().children().removeClass('selected');
        var cls = $(this).attr("class");
        $(this).addClass('selected');
        $("#main").children().css("display", "none");
        $("#main ."+cls).css("display", "block");
    });
}

//日历初始化
function MonthCalendarInit() {
    var month = getCurrentMonth();
    var year = getCurrentYear();
    var monthDayNum = getMonthDays(year, month);

    var day = 1;
    var rowNum = 1;
    for(day=1; day <= monthDayNum; day++) {
        weekday= getWeekDay(year, month, day)+1;
        if (weekday==1 && day == 1)
            rowNum = 1;
        else if (weekday == 1)
            rowNum++;
        if (rowNum > 4) {
            $("#main .cal_container .cal_m_contain .body .row"+rowNum).show();
        }

        var cls="#main .cal_container .cal_m_contain .body .row"+rowNum+" .col"+weekday;
        $(cls).html(""+day);
    }
}

//周报统计显示初始化
function WeekReportInit() {
    var TblConf = {};
    
}