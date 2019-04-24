var CalendarHasInit = false;

function CalendarMain() {
    if (CalendarHasInit) return;
    CalendarInit();

    CalendarHasInit = true;
}

function CalendarInit() {
    /*初始化月日历*/
    year = getCurrentYear();
    month = getCurrentMonth();
    nowDay = getCurrentDay();

    mdays = getMonthDays(year, month);
    day = 1;
    weekN=0;
    for(day = 1; day <= mdays; day++ ){
        weekday = getWeekDay(year, month, day);
        if (weekday == 0 && day == 1)
            weekN = 0;
        else if (weekday == 0)
            weekN++;
        sel = "td.w"+weekN+""+weekday;
        $(sel).addClass('settle');

        $(sel+" dt span.solar-num").text("");
        $(sel+" dt span.solar-num").text(day);
        $(sel).attr('cal-date', year+'|'+month+"|"+day);

        if (nowDay == day) {
            $(sel+" dt span.day-info").text("");
            $(sel+" dt span.day-info").text("今天");
            $(sel+" dt span.day-info").addClass('today');
        }
    }

    CalendarAddEvent();
}

function CalendarAddEvent() {
    $(".ul-level-1 .li-level-1 label").click(function(event) {
        $(this).parent().next().slideToggle(400);
    });

    $(".body .calendar .sidebar-list .sidebar-title").click(function(event) {
        $(this).next().slideToggle(400);
    });

    $(".body .calendar .calendar-wrap .calendar-body .calendar-m table td").click(function(event) {
        if ($(this).hasClass('selected')) return;

        $(this).parent().parent().find("td.selected dd.temp").remove();
        $(".wrap1 .calendar-add-schedule").hide();
        $(this).parent().parent().find("td.selected").removeClass('selected');
        $(this).addClass('selected');

        var dd = $("<dd></dd>").addClass('temp').text("新建日程 ...").click(function(event) {
            var sy = $(this).parent().offset().top;
            var sx = $(this).parent().offset().left;
            var col = $(this).parent().parent().attr("class").split(" ")[0][2];
            console.info(col);

            var add_schedule = $(".wrap1 .calendar-add-schedule");
            add_schedule.show();
            add_schedule.css("top", sy+"px");
            if (col>"4") {
                add_schedule.css("left", (sx-add_schedule.width()-2)+"px");
            } else {
                add_schedule.css("left", (sx+$(this).parent().width()+2)+"px");
            } 
            /*Init*/
            $(".wrap1 .calendar-add-schedule .body .detail").val("");
            $(".wrap1 .calendar-add-schedule .body .start-date").val(GetNowDate2());
            $(".wrap1 .calendar-add-schedule .body .end-date").val(GetNowDate2());
        });
        $(this).children('dl').append(dd);
    });

    $(".wrap1 .calendar-add-schedule .head .exitbtn").click(function(event) {
        var add_schedule = $(".wrap1 .calendar-add-schedule");
        add_schedule.hide();
    });

    $(".wrap1 .calendar-add-schedule .foot .save").click(function(event) {
        var td = $(".body .calendar .calendar-wrap .calendar-body .calendar-m table td.selected");
        var detail = $(".wrap1 .calendar-add-schedule .body .detail").val();
        var ndd = $("<dd></dd>").text(detail).attr("title", detail);
        td.find(".temp").remove();
        td.children('dl').append(ndd);
        $(".wrap1 .calendar-add-schedule").hide();
    });

}
