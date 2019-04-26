var CalendarHasInit = false;

function CalendarMain() {
    if (CalendarHasInit) return;
    CalendarInit();

    CalendarHasInit = true;
}

function CalendarInit() {
    /*初始化月日历*/
    var year = getCurrentYear();
    var month = getCurrentMonth();
    var nowDay = getCurrentDay();

    CalendarInitSidebar();
    CalendarInitMonthTable( year, month );
    CalendarAddEvent( );
}

function CalendarClearMonthTable() {
    var i=0;
    var j=0;
    for(i=0; i<6; i++) {
        for(j=0; j<7; j++) {
            var sel = ".calendar .calendar-m td.w" + i + "" + j;
            $(sel).removeClass('settle');
            $(sel+" dt span.solar-num").text("");
            $(sel+" dt span.day-info").text("");
            $(sel+" dt span.day-info").removeClass('today');
            $(sel+" dl dd").remove();
        }
    }
}

function CalendarMonthTableGetDBData(ID, dd) {
    var sql = "SELECT DETAIL, START_DATE, END_DATE, TYPE, ADD_USER, DATE_FORMAT(ADD_TIME,'%Y-%m-%d') FROM calendar WHERE ID IN ("+ID+")";
    var param = {};
    param['method'] = "SELECT";
    param['SQL'] = sql;
    sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
        if (d.ErrCode != 0) {
            alter(d.msg);
            return;
        }

        var data=d.data;
        if (data.length < 1) {
            alter("数据库无您查找的数据！");
            return;
        }
        data = data[0];
        var sy = $(dd).parent().offset().top;
        var sx = $(dd).parent().offset().left;
        var col= $(dd).parent().parent().attr("class").split(" ")[0][2];

        var add_schedule = $(".wrap1 .calendar-add-schedule");
        add_schedule.show();
        add_schedule.css("top", sy+"px");
        if (col>"4") {
            add_schedule.css("left", (sx-add_schedule.width()-2)+"px");
        } else {
            add_schedule.css("left", (sx+$(dd).parent().width()+2)+"px");
        } 
        /*Init*/
        $(".wrap1 .calendar-add-schedule .body .detail").val(data[0]);
        $(".wrap1 .calendar-add-schedule .body .start-date").val( data[1] );
        $(".wrap1 .calendar-add-schedule .body .end-date").val(  data[2] );
        $(".wrap1 .calendar-add-schedule .body .calendar-kind").val(  data[3] );
    });
}

function CalendarMonthTableInitDBData() {
    var startDate = $(".calendar .calendar-wrap .calendar-body .calendar-m .w00").attr("cal-date");
    var endDate   = $(".calendar .calendar-wrap .calendar-body .calendar-m .w56").attr("cal-date");
    var sql = "SELECT ID, DETAIL, START_DATE, END_DATE, TYPE, ADD_USER, DATE_FORMAT(ADD_TIME,'%Y-%m-%d') FROM calendar WHERE START_DATE >='"+startDate+"' AND START_DATE <='"+endDate+"'";
    var param = {};
    param['method'] = "SELECT";
    param['SQL'] = sql;
    sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
        if (d.ErrCode != 0) {
            alter(d.msg);
            return;
        }
        var i=0;
        var j=0;
        var data = d.data;
        for(i=0; i<6; i++) {
            for(j=0; j<7; j++) {
                var sel = ".calendar .calendar-wrap .calendar-body .calendar-m .w"+i+""+j;
                $(sel).find("dd").remove();
                var nDate = $(sel).attr("cal-date");
                var n=0;
                for (n=0; n<data.length; n++) {
                    var ID = data[n][0];
                    var DETAIL = data[n][1];
                    var START_DATE = data[n][2];
                    var END_DATE = data[n][3];
                    
                    if (nDate>=START_DATE && nDate <= END_DATE) {
                        var dd = $("<dd></dd>").attr("cal-id", ID).text(DETAIL);
                        dd.click(function(event) {
                            $(".wrap1 .calendar-add-schedule .foot .delete,.update").css("display", "inline-block");
                            $(".wrap1 .calendar-add-schedule .foot .save").css("display", "none");
                            $(".wrap1 .calendar-add-schedule .head .title").text("编辑日程");
                            $(".wrap1 .calendar-add-schedule .foot .delete,.update").attr("cal-id", $(this).attr("cal-id"));
                            CalendarMonthTableGetDBData($(this).attr("cal-id"), $(this));
                        });
                        $(sel).find("dl").append(dd);
                    }
                }
            }
        }
        
    });
}

function CalendarInitMonthTable(year, month) {
    CalendarClearMonthTable();
    var mdays = getMonthDays(year, month);
    var day = 1;
    var weekN = 0;
    var firstWeekDay=0;
    for(day=1; day <= mdays; day++ ) {
        var weekday = getWeekDay(year, month, day);
        if (day == 1) firstWeekDay = weekday;
        if (weekday == 0 && day == 1)
            weekN = 0;
        else if (weekday == 0)
            weekN++;
        sel = ".calendar .calendar-m td.w"+weekN+""+weekday;
        $(sel).addClass('settle');

        $(sel+" dt span.solar-num").text("");
        $(sel+" dt span.solar-num").text(day);
        $(sel).attr('cal-date', year+'-'+(month<10 ? ("0"+month) : month)+"-" + (day<10 ? ("0"+day): day));

        if (year ==getCurrentYear() && month== getCurrentMonth() && getCurrentDay() == day) {
            $(sel+" dt span.day-info").text("");
            $(sel+" dt span.day-info").text("今天");
            $(sel+" dt span.day-info").addClass('today');
        }
    }
    var i=0;
    var j=0;
    var ret = getMonthByMonth(year, month, -1);
    var preYear = ret[0];
    var preMonth = ret[1];
    mdays = getMonthDays(preYear, preMonth);
    for(j=6; j--; j>=0) {
        var sel = ".calendar .calendar-m td.w0"+j;
        if (!$(sel).hasClass('settle')) {
            $(sel + " dt span.solar-num").text(mdays);
            $(sel).attr('cal-date', preYear+'-'+(preMonth<10 ? ("0"+preMonth) : preMonth)+"-" + (mdays<10 ? ("0"+mdays): mdays));
            mdays--;
        }
    }

    ret = getMonthByMonth(year, month, 1);
    var nextYear = ret[0];
    var nextMonth = ret[1];
    mdays = 1;
    for(i=4; i<6; i++) {
        for(j=0; j<7; j++) {
            var sel = ".calendar .calendar-m td.w"+i+""+j;
            if (!$(sel).hasClass('settle')) {
                $(sel + " dt span.solar-num").text(mdays);
                $(sel).attr('cal-date', nextYear+'-'+(nextMonth<10 ? ("0"+nextMonth) : nextMonth)+"-" + (mdays<10 ? ("0"+mdays): mdays));
                mdays++;
            }
        }
    }

    CalendarMonthTableInitDBData();
}

function CalendarAddEvent() {
    $(".ul-level-1 .li-level-1 label").click(function(event) {
        $(this).parent().next().slideToggle(400);
    });

    $(".body .calendar .sidebar-list .li-level-1,.li-level-2 label").click(function(event) {
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
            $(".wrap1 .calendar-add-schedule .head .title").text("添加日程");
            $(".wrap1 .calendar-add-schedule .foot .delete,.update").css("display", "none");
            $(".wrap1 .calendar-add-schedule .foot .save").css("display", "inline-block");
            var sy = $(this).parent().offset().top;
            var sx = $(this).parent().offset().left;
            var col = $(this).parent().parent().attr("class").split(" ")[0][2];

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
            $(".wrap1 .calendar-add-schedule .body .start-date").val( $(this).parent().parent().attr("cal-date") );
            $(".wrap1 .calendar-add-schedule .body .end-date").val(  $(this).parent().parent().attr("cal-date") );
        });
        dd.css("color", "#B3B3B3");
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

        var startDate = $(".wrap1 .calendar-add-schedule .body .start-date").val();
        var endDate = $(".wrap1 .calendar-add-schedule .body .end-date").val();
        var type = $(".wrap1 .calendar-add-schedule .body .calendar-kind").val();

        var sql = "INSERT INTO calendar(DETAIL, START_DATE, END_DATE, TYPE, ADD_USER) VALUES('"+detail+"','" + startDate +"','" + endDate +"','" +
                    type +"','" + g_CURRENT_USER +"')";
        var param = {};
        param['method'] = "INSERT";
        param['SQL'] = sql;
        sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
            if (d.ErrCode != 0) {
                alter(d.msg);
                return;
            }
            CalendarMonthTableInitDBData();
            $(".wrap1 .calendar-add-schedule").hide();
        });
    });

    $(".wrap1 .calendar-add-schedule .foot .delete,.update").click(function(event) {
        var id = $(this).attr("cal-id");
        var detail = $(".wrap1 .calendar-add-schedule .body .detail").val();
        var startDate = $(".wrap1 .calendar-add-schedule .body .start-date").val();
        var endDate = $(".wrap1 .calendar-add-schedule .body .end-date").val();
        var type = $(".wrap1 .calendar-add-schedule .body .calendar-kind").val();
        var sql = "";
        if ($(this).hasClass('delete')) {
            sql = "DELETE FROM calendar WHERE ID="+id;
        }else if ($(this).hasClass('update')){
            sql = "UPDATE calendar SET DETAIL='"+detail+"', START_DATE='"+startDate+"', END_DATE='"+
                    endDate + "', TYPE='"+type+"', UPT_USER='"+g_CURRENT_USER+"', UPT_TIME=CURRENT_TIMESTAMP "+
                    "WHERE ID = " + id;
        }
        var param = {};
        param['method'] = "UPDATE";
        param['SQL'] = sql;
        sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
            if (d.ErrCode != 0) {
                alter(d.msg);
                return;
            }
            CalendarMonthTableInitDBData();
            $(".wrap1 .calendar-add-schedule").hide();
        });

    });

    $(".body .calendar .calendar-wrap .calendar-top button").click(function(event) {
        var minfo = $(this).parent().children('.calm').text();
        var year = parseInt(minfo.slice(0,4));
        var month = 0;
        if (minfo.length == 7) {
            month = parseInt(minfo[5]);
        }
        else if (minfo.length == 8) {
            month = parseInt(minfo[5]+""+minfo[6]);
        } else {
            return ;
        }

        var mode = 0;
        if ($(this).hasClass('prev')) {
            mode = -1;
        } else if ($(this).hasClass('next')) {
            mode = 1;
        }

        var ret = getMonthByMonth(year, month, mode);
        year = ret[0];
        month = ret[1];

        $(".body .calendar .calendar-wrap .calendar-top .calm").text(year+"年"+month+"月");
        CalendarInitMonthTable(year, month);
    });
}


function CalendarInitSidebar() {

    var sp = $(".body .calendar .sidebar-list .sidebar-container.share-person");
    var i=0;
    var j=0;
    var k=0;

    var ul1 = $("<ul></ul>").addClass('ul-level-1');
    for(i=0; i<g_ALL_DEPART.length; i++) {
        var depart_id = g_ALL_DEPART[i].id;
        var li1 = $("<li></li>").addClass('li-level-1').append('<input type="checkbox" name="">').append($("<label></label>").text(g_ALL_DEPART[i].name));
        li1.children("input[type='checkbox']").click(function(event) {
            if ($(this)[0].checked ==true) {
                $(this).parent().next().find("input[type='checkbox']").attr("checked", true);
            } else {
                $(this).parent().next().find("input[type='checkbox']").attr("checked", false);
            }
        });
        var ul2 = $("<ul></ul>").addClass('ul-level-2');
        for(j=0; j<g_ALL_GROUP.length; j++) {
            var group_id = g_ALL_GROUP[j].id;
            if (depart_id == g_ALL_GROUP[j].depart_id) {
                var li2 = $("<li></li>").addClass('li-level-2').append('<input type="checkbox" name="">').append($("<label></label>").text(g_ALL_GROUP[j].name));
                li2.children("input[type='checkbox']").click(function(event) {
                    if ($(this)[0].checked ==true) {
                        $(this).parent().next().find("input[type='checkbox']").attr("checked", true);
                    } else {
                        $(this).parent().next().find("input[type='checkbox']").attr("checked", false);
                    }
                });
                var ul3 = $("<ul></ul>").addClass('ul-level-3');
                for(k=0; k<g_ALL_USER.length; k++) {
                    if (group_id == g_ALL_USER[k].group_id) {
                        var li3 =  $("<li></li>").addClass('li-level-3').append('<input type="checkbox" name="">').append($("<label></label>").text(g_ALL_USER[k].cname))
                        ul3.append(li3);
                    }
                }
                ul2.append(li2);
                ul2.append(ul3);
            }
        }
        ul1.append(li1);
        ul1.append(ul2);
    }
    sp.html("");
    sp.append(ul1);
}