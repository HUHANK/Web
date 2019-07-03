var MONTH_REPORT_ALL_INIT=false;
var MONTH_REPORT_OVER_TIME_OPT='';
var MONTH_REPORT_OVER_TIME_QUERY_CONDITION='';
var MONTH_REPORT_TRAIN_EXP_DATA = '';

function MonthReportMain() {
    if (MONTH_REPORT_ALL_INIT) return;
    MonthReportInit();
    MonthReportEventInit();
    MONTH_REPORT_ALL_INIT = true;
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
    $(".body .monthly-report .container .train .col-result tbody").css("max-height", h1+"px");
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

    $(".body .monthly-report .container .train .col-edit-query .edit1 .edit-box .date").datepicker({
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
    var type = tquery.find(".type select").val();

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

    if (type.length > 0) {
        condition += " AND TYPE = '" + type + "' ";
    }

    MONTH_REPORT_OVER_TIME_QUERY_CONDITION = condition;
}

function MonthReportTableQuery() {
    MonthReportOverTimeConditionChg();
    var sql = "SELECT ID,OCCUR_DATE,NAME,START_TIME,END_TIME,HOURS,ADDR,TYPE,REASON FROM overtime_report " + MONTH_REPORT_OVER_TIME_QUERY_CONDITION;
    sql += " ORDER BY NAME, OCCUR_DATE";
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
            var type = data[i][7];
            var reason = data[i][8];
            var tr = $("<tr></tr>");
            tr.append($("<td></td>").text(date).css("width",   "100px").css("text-align", "center"));
            tr.append($("<td></td>").text(user).css("width",   "70px").css("text-align", "center"));
            tr.append($("<td></td>").text(startT).css("width", "90px").css("text-align", "center"));
            tr.append($("<td></td>").text(endT).css("width",   "90px").css("text-align", "center"));
            tr.append($("<td></td>").text(hours).css("width",  "70px").css("text-align", "center"));
            tr.append($("<td></td>").text(addr).css("width",  "130px").css("text-align", "center"));
            tr.append($("<td></td>").text(type).css("width",  "90px").css("text-align", "center"));
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

function MonthReportTableQuery2() {
    var sql = "SELECT ID,TRAIN_DATE,TRAIN_TIME,TRAIN_HOURS,TRAIN_ADDR,DEPARTMENT,TRAIN_DETAIL,TRAIN_PERSON,TRAINER_NUM,NOTE FROM train_detail ";
    var year = $(".body .monthly-report .container .train .col-edit-query .query1 .date .year").val();
    var month = $(".body .monthly-report .container .train .col-edit-query .query1 .date .month").val();
    var condition = " WHERE TRAIN_DATE LIKE '";
    if (month.length < 1) {
        condition += year+"%'";
    }else if (month.length == 1) {
        condition += year + "-0" + month + "%'";
    }else {
        condition += year + "-" + month + "%'";
    }
    sql += condition;

    var param = {};
    param["method"] = "SELECT";
    param['SQL'] = sql;
    sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
        if (d.ErrCode != 0) {
            alter(d.msg);
            return;
        }
        var data = d.data;
        MONTH_REPORT_TRAIN_EXP_DATA = data;
        console.info(data);
        var tbody = $(".body .monthly-report .container .train .col-result tbody");
        tbody.html('');
        var i = 0;
        for( i=0; i<data.length; i++) {
            var row = data[i];
            var id = row[0];
            var date = row[1];
            var time = row[2];
            var hours = row[3];
            var addr = row[4];
            var depart = row[5];
            var detail = row[6];
            var person = row[7];
            var num = row[8];
            var note = row[9];

            var tr = $("<tr></tr>");
            tr.append($("<td></td>").text(date).css(  {'width': '90px',  'text-align': 'center' }));
            tr.append($("<td></td>").text(time).css(  {'width': '60px',  'text-align': 'center' }));
            tr.append($("<td></td>").text(hours).css( {'width': '50px',  'text-align': 'center' }));
            tr.append($("<td></td>").text(addr).css(  {'width': '100px', 'text-align': 'center' }));
            tr.append($("<td></td>").text(depart).css({'width': '100px', 'text-align': 'center' }));
            tr.append($("<td></td>").text(detail).css({'width': '300px', 'text-align': 'center' }));
            tr.append($("<td></td>").text(person).css({'width': '100px', 'text-align': 'center' }));
            tr.append($("<td></td>").text(num).css(   {'width': '70px',  'text-align': 'center' }));
            tr.append($("<td></td>").text(note).css(  {'width': (250-getScrollWidth())+'px', 'text-align': 'center' }));
            tr.attr("row-id", id);
            tr.click(function(event) {
                if ($(this).hasClass('selected')) return;
                $(this).siblings('.selected').removeClass('selected');
                $(this).addClass('selected');
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
        if (cls == "train") {
            MonthReportTableQuery2();
        }
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
        else if ($(this).hasClass('exp')) MONTH_REPORT_OVER_TIME_OPT = 'exp';
        else if ($(this).hasClass('con-add')) MONTH_REPORT_OVER_TIME_OPT = 'con-add';

        if (MONTH_REPORT_OVER_TIME_OPT == 'add' || 'con-add' == MONTH_REPORT_OVER_TIME_OPT) {
            $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .date").val(GetNowDate2());
            $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .user").val(g_CURRENT_USER);
            $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .startT").val("09:00");
            $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .endT").val("17:00");
            $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .hours").val("8");
            $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .reason").val("");
            $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .addr").val("");
        } else if (MONTH_REPORT_OVER_TIME_OPT == 'exp') {
            var sql = "SELECT OCCUR_DATE,NAME,START_TIME,END_TIME,HOURS,ADDR,TYPE,REASON FROM overtime_report " + MONTH_REPORT_OVER_TIME_QUERY_CONDITION;
            sql += " ORDER BY NAME, OCCUR_DATE";
            var param = {};
            param["method"] = "SELECT";
            param['SQL'] = sql;
            sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
                if (d.ErrCode != 0) {
                    alter(d.msg);
                    return;
                }
                var data = d.data;
                var table = "";
                var thead = "";
                var tbody = "<tbody>";
                var tr = "<tr>";
                $(".body .monthly-report .container .overtime .col-result thead tr th").each(function(index, el) {
                    var th = "<th>"+$(el).text()+"</th>";
                    tr+= th;
                });
                tr += "</tr>";
                thead = "<thead>" + tr + "</thead>";

                var i, j;
                for( i=0; i<data.length; i++) {
                    var row = data[i];
                    tr = "<tr>";
                    for(j=0; j<row.length; j++) {
                        var td = "<td>" + row[j] + "</td>"; 
                        tr += td;
                    }
                    tr += "</tr>";
                    tbody += tr;
                }
                tbody += "</tbody>";
                table = "<table>" + thead + tbody + "</table>";
                if(getExplorer()=='ie') {
                    alert("不支持IE导出！");
                } else {
                    tableToExcel(table);
                }
            });
            $(this).removeClass('selected');
            return;
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
            $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .type").val($(tds[6]).text());
            $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .reason").val($(tds[7]).text());
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
            var type = $(ebox).find(".type").val();
            if (type == null) type = '';
            var reason = $(ebox).find(".reason").val();
            var sql = "";
            var param = {};

            if (MONTH_REPORT_OVER_TIME_OPT == 'add' || MONTH_REPORT_OVER_TIME_OPT == 'con-add') {
                sql = "INSERT INTO overtime_report(OCCUR_DATE,NAME,START_TIME,END_TIME,HOURS,ADDR,TYPE,REASON) VALUES('"+
                    date1+"','"+user+"','"+startT+"','"+endT+"',"+hours+",'"+addr+"','"+type+"','"+reason+"')";
                param["method"] = "INSERT";
            } else if (MONTH_REPORT_OVER_TIME_OPT == 'upt') {
                var id = $(".body .monthly-report .container .overtime .col-result tbody tr.selected").attr("row-id");
                sql = "UPDATE overtime_report SET OCCUR_DATE='"+date1+"', NAME='"+user+"', START_TIME='"+startT+"', END_TIME='" +
                    endT+"', HOURS="+hours+", REASON='"+reason+"', ADDR='"+addr+"', TYPE='"+type+"' WHERE ID="+id;
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
            if (MONTH_REPORT_OVER_TIME_OPT == 'con-add') {
                var date2 = getNextDate(date1, 1);
                $(ebox).find(".date").val(date2);
                return;
            }
        }
        $(this).parent().parent().hide();
        $(".body .monthly-report .container .overtime .col-edit-query .edit1 .opt button.selected").removeClass('selected');
    });

    $(".body .monthly-report .container .train .col-edit-query .edit1 .opt button.add").click(function(event) {
        $(".body .monthly-report .container .train .col-edit-query .edit1 .edit-box").toggle();
        var ebox   = $(".body .monthly-report .container .train .col-edit-query .edit1 .edit-box");
        ebox.find(".date").val(GetNowDate2());
        ebox.find(".time").val("12:00");
        ebox.find(".hours").val(1);
        ebox.find(".addr").val("");
        ebox.find(".depart").val("");
        ebox.find(".detail").val("");
        ebox.find(".trainer").val("");
        ebox.find(".ntrainers").val(0);
        ebox.find(".note").val("");
    });
    $(".body .monthly-report .container .train .col-edit-query .edit1 .opt button.del").click(function(event) {
        $(".body .monthly-report .container .train .col-edit-query .edit1 .edit-box").hide();
        var tr = $(".body .monthly-report .container .train .col-result tbody tr.selected");
        if (tr.length < 1) {
            alert("请先选取一行数据进行操作！");
            return ;
        }

        var sql = "DELETE FROM train_detail WHERE ID="+tr.attr("row-id");
        var param = {};
        param['SQL'] = sql;
        param['method'] = 'UPDATE';
        sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
            if (d.ErrCode != 0) {
                alter(d.msg);
                return;
            }
            MonthReportTableQuery2();
        });
    });
    $(".body .monthly-report .container .train .col-edit-query .edit1 .opt button.exp").click(function(event) {
        $(".body .monthly-report .container .train .col-edit-query .edit1 .edit-box").hide();

        var thead = $(".body .monthly-report .container .train .col-result thead").html();
        thead = "<thead>" + thead + "</thead>";
        //console.info(thead);
        var i=0;
        var tbody = "<tbody>";
        for(i=0; i<MONTH_REPORT_TRAIN_EXP_DATA.length; i++) {
            var row = MONTH_REPORT_TRAIN_EXP_DATA[i];
            var date = row[1];
            var time = row[2];
            var hours = row[3];
            var addr = row[4];
            var depart = row[5];
            var detail = row[6];
            var person = row[7];
            var num = row[8];
            var note = row[9];

            tbody += "<tr>"+
                    "<th>" + date +"</th>" +
                    "<th>" + time +"</th>" +
                    "<th>" + hours +"</th>" +
                    "<th>" + addr +"</th>" +
                    "<th>" + depart +"</th>" +
                    "<th>" + detail +"</th>" +
                    "<th>" + person +"</th>" +
                    "<th>" + num +"</th>" +
                    "<th>" + note +"</th>" +
                +"</tr>";
        }
        tbody += "</tbody>";
        var table = "<table>"+thead+tbody+"</table>";
        console.info(table);
        if(getExplorer()=='ie') {
            alert("不支持IE导出！");
        } else {
            tableToExcel(table);
        }
    });

    $(".body .monthly-report .container .train .col-edit-query .query1 select").change(function(event) {
        MonthReportTableQuery2();
    });

    $(".body .monthly-report .container .train .col-edit-query .edit1 .edit-box button").click(function(event) {
        if ($(this).hasClass('cancle')) {
            $(".body .monthly-report .container .train .col-edit-query .edit1 .edit-box").hide();
            return;
        }
        var ebox   = $(".body .monthly-report .container .train .col-edit-query .edit1 .edit-box");
        var date   = ebox.find('.date').val();
        var time   = ebox.find('.time').val();
        var hours  = ebox.find(".hours").val();
        var addr   = ebox.find(".addr").val();
        var depart = ebox.find(".depart").val();
        var detail = ebox.find(".detail").val();
        var trainer = ebox.find(".trainer").val();
        var ntrainers = ebox.find(".ntrainers").val();
        var note  = ebox.find(".note").val();

        var sql = "INSERT INTO train_detail(TRAIN_DATE,TRAIN_TIME,TRAIN_HOURS,TRAIN_ADDR,DEPARTMENT,TRAIN_DETAIL,TRAIN_PERSON,TRAINER_NUM,NOTE,ADD_USER) VALUES(";
        sql += "'"+date+"',"+"'"+time+"',"+hours+","+"'"+addr+"',"+"'"+depart+"',"+"'"+detail+"',"+"'"+trainer+"',"+ntrainers+",'"+note+"','"+g_CURRENT_USER+"')";
        var param = {};
        param['SQL'] = sql;
        param['method'] = 'INSERT';
        console.info(sql);
        sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
            if (d.ErrCode != 0) {
                alter(d.msg);
                return;
            }
            $(".body .monthly-report .container .train .col-edit-query .edit1 .edit-box").hide();
            MonthReportTableQuery2();
        });
        
    });
}