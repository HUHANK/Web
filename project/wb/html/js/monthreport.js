var MONTH_REPORT_ALL_INIT=false;
var MONTH_REPORT_OVER_TIME_OPT='';
var MONTH_REPORT_OVER_TIME_QUERY_CONDITION='';

function MonthReportMain() {
    if (MONTH_REPORT_ALL_INIT) return;
    MonthReportInit();
    MonthReportEventInit();
}

function MonthReportChangeDaySelect() {
    var year = $(".body .monthly-report .container .overtime .col-edit-query .query1 .date .year").val();
    var month = $(".body .monthly-report .container .overtime .col-edit-query .query1 .date .month").val();
    var day = $(".body .monthly-report .container .overtime .col-edit-query .query1 .date .day");
    var days = getMonthDays(year, month);
    var i = 1;
    day.html("");
    day.append($("<option></option>"));
    for (i=1; i<=days; i++) {
        var opt = $("<option></option>").text(i+"");
        day.append(opt);
    }
}

function MonthReportWinResize() {
    wheight = $(window).height();
    var h = wheight - $("body .wrapper-top").height() - 1;
    $(".body .monthly-report").height(h);
    var h1 = h - $(".body .monthly-report .container .overtime .title").height() - 15 -
        $(".body .monthly-report .container .overtime .col-result thead").height() - 32 - getScrollWidth();
    $(".body .monthly-report .container .overtime .col-result tbody").css("max-height", h1+"px");
}

function MonthReportInit() {
    $(".body .monthly-report .container .overtime .col-edit-query .query1 .date .year").val(getCurrentYear());
    $(".body .monthly-report .container .overtime .col-edit-query .query1 .date .month").val(getCurrentMonth());
    //MonthReportChangeDaySelect();

    var i,j;
    $(".body .monthly-report .container .overtime .col-edit-query .query1 .group select").html("");
    $(".body .monthly-report .container .overtime .col-edit-query .query1 .user select").html("");
    $(".body .monthly-report .container .overtime .col-edit-query .query1 .group select").append($("<option></option>"));
    $(".body .monthly-report .container .overtime .col-edit-query .query1 .user select").append($("<option></option>"));
    var gr = "";
    for(i=0; i<g_ALL_GROUP.length; i++) {
        if (g_ALL_GROUP[i].depart_id != 1) continue;
        var opt = $("<option></option>").text(g_ALL_GROUP[i].name);
        $(".body .monthly-report .container .overtime .col-edit-query .query1 .group select").append(opt);
        var optgroup = $("<optgroup></optgroup>").attr("label", g_ALL_GROUP[i].name);
        for(j=0; j<g_ALL_USER.length; j++) {
            if (g_ALL_USER[j].group_id == g_ALL_GROUP[i].id) {
                optgroup.append($("<option></option>").text(g_ALL_USER[j].cname));
                if (g_ALL_USER[j].cname == g_CURRENT_USER) {
                    gr = g_ALL_GROUP[i].name;
                }
            }
        }
        $(".body .monthly-report .container .overtime .col-edit-query .query1 .user select").append(optgroup);
    }
    $(".body .monthly-report .container .overtime .col-edit-query .query1 .user select").val(g_CURRENT_USER);
    $(".body .monthly-report .container .overtime .col-edit-query .query1 .group select").val(gr);

    $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .date").datepicker({
        showButtonPanel: true,
        changeMonth: true,
        changeYear: true,
        showWeek: true,
        firstDay: 1,
        dateFormat: "yy-mm-dd"
    });

    //$(".body .monthly-report .container .overtime .col-result thead").css("width", "calc(100% - "+getScrollWidth()+"px)");
    MonthReportTableQuery();

}

function MonthReportOverTimeConditionChg() {
    var tquery = $(".body .monthly-report .container .overtime .col-edit-query .query1");
    var year = tquery.find(".year").val();
    var month = tquery.find(".month").val();
    var day = tquery.find(".day").val();
    var group = tquery.find(".group select").val();
    var user = tquery.find(".user select").val();

    var condition = " WHERE OCCUR_DATE LIKE ";
    var date = year+"-";
    if (month.length > 0) {
        if (month.length == 1) {
            date += "0"+month+"-";
        }else 
            date += month+"-";
        if (day.length > 0) {
            if (day.length == 1)
                date += "0" + day;
            else
                date += day;
        } else {
            date += "%";
        }
    } else {
        date += "%";
    }
    condition += "'" + date + "' ";

    if (group.length > 0) {
        if (user.length > 0) {
            condition += " AND NAME = '" + user + "' ";
        } else {
            var i,j;
            var gid = '';
            for(i=0; i<g_ALL_GROUP.length; i++) {
                if (g_ALL_GROUP[i].name == group) {
                    gid = g_ALL_GROUP[i].id;
                }
            }
            condition += " AND NAME IN ("
            for (i=0; i<g_ALL_USER.length; i++) {
                if (g_ALL_USER[i].group_id == gid) {
                    condition += "'" + g_ALL_USER[i].cname + "',";
                }
            }
            condition = condition.substring(0, condition.length-1) + ") ";
        } 
    } else {
        if (user.length > 0) {
            condition += " AND NAME = '" + user + "' ";
        }
    }

    MONTH_REPORT_OVER_TIME_QUERY_CONDITION = condition;
}

function MonthReportTableQuery() {
    MonthReportOverTimeConditionChg();
    var sql = "SELECT ID,OCCUR_DATE,NAME,START_TIME,END_TIME,HOURS,ADDR,REASON FROM overtime_report " + MONTH_REPORT_OVER_TIME_QUERY_CONDITION;
    console.info(sql);
    var param = {};
    param["method"] = "SELECT";
    param['SQL'] = sql;
    sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
        if (d.ErrCode != 0) {
            alter(d.msg);
            return;
        }
        var data = d.data;
        var i,j;
        var tbody = $(".body .monthly-report .container .overtime .col-result tbody");
        tbody.html("");
        for(i=0; i<data.length; i++) {
            var id = data[i][0];
            var date = data[i][1];
            var user = data[i][2];
            var startT = data[i][3];
            var endT = data[i][4];
            var hours = data[i][5];
            var addr = data[i][6];
            var reason = data[i][7];
            var tr = $("<tr></tr>");
            tr.append($("<td></td>").text(date).css("width",   "100px").css("text-align", "center"));
            tr.append($("<td></td>").text(user).css("width",   "70px").css("text-align", "center"));
            tr.append($("<td></td>").text(startT).css("width", "90px").css("text-align", "center"));
            tr.append($("<td></td>").text(endT).css("width",   "90px").css("text-align", "center"));
            tr.append($("<td></td>").text(hours).css("width",  "70px").css("text-align", "center"));
            tr.append($("<td></td>").text(addr).css("width",  "130px").css("text-align", "center"));
            tr.append($("<td></td>").text(reason).css("width", (385-getScrollWidth())+"px").css("text-align", "center"));
            tr.attr("row-id", id);
            tr.click(function(event) {
                if ($(this).hasClass('selected')) return;
                $(this).siblings('.selected').removeClass('selected');
                $(this).addClass('selected');
                
                var tds = $(this).children();
                $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .date").val($(tds[0]).text());
                $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .user").val($(tds[1]).text());
                $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .startT").val($(tds[2]).text());
                $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .endT").val($(tds[3]).text());
                $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .hours").val($(tds[4]).text());
                $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .addr").val($(tds[5]).text());
                $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .reason").val($(tds[6]).text());
            });
            tbody.append(tr);
        }
    });

}

function MonthReportEventInit() {
    $(".body .monthly-report .container .overtime .col-edit-query .query1 select").change(function(event) {
        MonthReportTableQuery();
    });

    $(".body .monthly-report .sidebar .unit").click(function(event) {
        event.stopPropagation();//阻止事件冒泡即可
        if ($(this).hasClass('sel')) return;
        $(this).parent().find(".sel").removeClass('sel');
        $(this).addClass('sel');
        var cls = $(this).attr("name");
        $(".body .monthly-report .container .sel").removeClass('sel');
        $(".body .monthly-report .container").find("."+cls).addClass('sel');
    });

    $(".body .monthly-report .container .overtime .col-edit-query .query1 .date .year").change(function(event) {
        MonthReportChangeDaySelect();
    });
    $(".body .monthly-report .container .overtime .col-edit-query .query1 .date .month").change(function(event) {
        MonthReportChangeDaySelect();
    });

    $(".body .monthly-report .container .overtime .col-edit-query .edit1 .opt button").click(function(event) {
        if ($(this).hasClass('selected')) return;
        $(this).parent().find(".selected").removeClass('selected');
        $(this).addClass('selected');

        if ($(this).hasClass('add')) MONTH_REPORT_OVER_TIME_OPT = 'add';
        else if ($(this).hasClass('upt')) MONTH_REPORT_OVER_TIME_OPT = 'upt';
        else if ($(this).hasClass('del')) MONTH_REPORT_OVER_TIME_OPT = 'del';

        if (MONTH_REPORT_OVER_TIME_OPT == 'add') {
            $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .date").val(GetNowDate2());
            $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .user").val(g_CURRENT_USER);
            $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .startT").val("09:00");
            $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .endT").val("17:00");
            $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .hours").val("8");
            $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .reason").val("");
            $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .addr").val("");
        } else {
            var tr = $(".body .monthly-report .container .overtime .col-result tbody tr.selected");
            if (tr.length < 1) {
                alert("请先选取一行数据进行操作！");
                $(this).removeClass('selected');
                return ;
            }
            var tds = tr.children();
            $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .date").val($(tds[0]).text());
            $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .user").val($(tds[1]).text());
            $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .startT").val($(tds[2]).text());
            $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .endT").val($(tds[3]).text());
            $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .hours").val($(tds[4]).text());
            $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .addr").val($(tds[5]).text());
            $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .reason").val($(tds[6]).text());
        }

        $(this).parent().next().show();
    });

    $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .foot button").click(function(event) {
        if ($(this).hasClass('comfirm')) {
            var ebox = $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box");
            var date1 = $(ebox).find(".date").val();
            var user = $(ebox).find(".user").val();
            var startT = $(ebox).find(".startT").val();
            var endT = $(ebox).find(".endT").val();
            var hours = $(ebox).find(".hours").val();
            var addr =  $(ebox).find(".addr").val();
            var reason = $(ebox).find(".reason").val();
            var sql = "";
            var param = {};

            console.info(MONTH_REPORT_OVER_TIME_OPT);
            if (MONTH_REPORT_OVER_TIME_OPT == 'add') {
                sql = "INSERT INTO overtime_report(OCCUR_DATE,NAME,START_TIME,END_TIME,HOURS,ADDR,REASON) VALUES('"+
                    date1+"','"+user+"','"+startT+"','"+endT+"',"+hours+",'"+addr+"','"+reason+"')";
                param["method"] = "INSERT";
            } else if (MONTH_REPORT_OVER_TIME_OPT == 'upt') {
                var id = $(".body .monthly-report .container .overtime .col-result tbody tr.selected").attr("row-id");
                sql = "UPDATE overtime_report SET OCCUR_DATE='"+date1+"', NAME='"+user+"', START_TIME='"+startT+"', END_TIME='" +
                    endT+"', HOURS="+hours+", REASON='"+reason+"', ADDR='"+addr+"' WHERE ID="+id;
                param["method"] = "INSERT";
            } else if (MONTH_REPORT_OVER_TIME_OPT == 'del') {
                var id = $(".body .monthly-report .container .overtime .col-result tbody tr.selected").attr("row-id");
                sql = "DELETE FROM overtime_report WHERE ID="+id;
                param["method"] = "INSERT";
            }
            param['SQL'] = sql;
            sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
                if (d.ErrCode != 0) {
                    alter(d.msg);
                    return;
                }
                MonthReportTableQuery();
            });
        }
        $(this).parent().parent().hide();
        $(".body .monthly-report .container .overtime .col-edit-query .edit1 .opt button.selected").removeClass('selected');
    });
}