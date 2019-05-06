/*全局变量*/
var WEEK_REPORT_EVENT_INIT=false;
var WEEK_REPORT_PAGE_SIZE=10;
var WEEK_REPORT_PAGE_NUM = 0;
var WEEK_REPORT_TOTAL_PAGE_NUM = 0;
var WEEK_REPORT_QUERY_TOTAL_COUNT = 0;

var WEEK_REPORT_DROP_BOX_CLASS_ID='';
var WEEK_REPORT_QUERY_CONDITION='';

/*Main函数*/
function WeekReportMain() {
    WeekReportInit();
    if (!WEEK_REPORT_EVENT_INIT) {
        WeekReportEvent();
        WEEK_REPORT_EVENT_INIT = true;
    }
}

var TABLE_CONF = {};
TABLE_CONF.columns = [
    {name: '#',                  field: 'ID',                        width: '40', align: 'center'},
    {name: '供应商',              field: 'SUPPLIER',                   width: '100', align: 'center'},
    {name: '优先级',              field: 'PRIORITY',                   width: '40', align: 'center'},
    {name: '系统',                field: 'SYSTEM',                    width: '100', align: 'center'},
    {name: '项目类别',            field: 'ITEM_TYPE',                   width: '100', align: 'center'},
    {name: '项目',                field: 'ITEM',                      width: '100', align: 'center'},
    {name: '项目进度',            field: 'ITEM_PROGRESS',               width: '60', align: 'center'},
    {name: '上周完成工作',        field: 'LAST_WEEK_WORK',            width: '180', align: 'center'},
    {name: '本周完成工作',        field: 'THIS_WEEK_WORK',            width: '180', align: 'center'},
    {name: '供应商后续工作',      field: 'SUPPLIER_FOLLOWUP_WORK',     width: '100', align: 'center'},
    {name: '是否提供项目周报',    field: 'PROVIDE_ITEM_WEEK_REPORT',    width: '60', align: 'center'},
    {name: '供应商反馈',          field: 'SUPPLIER_FEEDBACK',          width: '100', align: 'center'},
    {name: '供应商项目负责人',    field: 'SUPPLIER_ITEM_CHARGE',        width: '60', align: 'center'},
    {name: '开始时间',            field: 'START_DATE',                  width: '70', align: 'center'},
    {name: '结束时间',            field: 'END_DATE',                    width: '70', align: 'center'},
    {name: '风险点',              field: 'RISK_POINT',                 width: '100', align: 'center'},
    {name: '负责人',              field: 'ITEM_CHARGE',                width: '50', align: 'center'},
    {name: '工作量（人/周）',     field: 'WORKLOAD',                   width: '60', align: 'center'},
    {name: '小组',                field: 'GROUP',                     width: '60', align: 'center'},
    {name: '标签',                field: 'NEED_TRACK',                  width: '60', align: 'center'},
    {name: '设计文档',            field: 'DETAIL_DESIGN_DOC',           width: '100', align: 'center'},
    {name: '设计评审时间',        field: 'DESIGN_REVIEW_DATE',          width: '80', align: 'center'},
    {name: '业务主管部门',        field: 'BUSINESS_DEPART',             width: '80', align: 'center'},
    {name: '设计评审时间和状态',   field: 'DESIGN_REVIEW_STATUS',       width: '100', align: 'center'},
    {name: '备注',                field: 'NOTE',                      width: '100', align: 'center'}
];
function WeekReportInit() {
    /*初始化表头*/
    var tr = $("<tr></tr>");
    var i=0; 
    for(i=0; i<TABLE_CONF.columns.length; i++){
        var th = $("<th></th>").text(TABLE_CONF.columns[i].name);
        th.css("min-width", TABLE_CONF.columns[i].width+"px");
        tr.append(th);
    }
    $(".week-report .query-result table thead").html(tr);

    var parent = $(".week-report .query-form .condition .container");
    parent.find(".SUPPLIER").val('');
    parent.find(".PRIORITY").val('');
    parent.find(".SYSTEM").val('');
    parent.find(".ITEM_TYPE").val('');
    parent.find(".ITEM").val('');
    parent.find(".ITEM_PROGRESS").val('');
    parent.find(".GROUP").val('');
    parent.find(".ITEM_CHARGE").val('');
    parent.find(".NEED_TRACK").val('');
    WEEK_REPORT_QUERY_CONDITION = " WHERE ITEM_CHARGE IN ('" + g_CURRENT_USER + "') ";
    WeekReportQueryTable(WEEK_REPORT_PAGE_NUM*WEEK_REPORT_PAGE_SIZE, WEEK_REPORT_PAGE_SIZE);
}

function WeekReportGetValue(cls) {
    var clas = ".week-report-table .body .field_"+cls;
    var tagName = $(clas)[0].tagName;
    if (tagName == "INPUT" || tagName == "TEXTAREA" || tagName == 'SELECT') {
        return ($(clas).val());
    } else {
        return '';
    }
}

function WeekReportScroll() {
    if (WEEK_REPORT_DROP_BOX_CLASS_ID.length > 0) {
        $("#"+WEEK_REPORT_DROP_BOX_CLASS_ID).remove();
    }
}

function WeekReportEvent() {
    $(".body .week-report .query-form").click(function(event) {
        if (WEEK_REPORT_DROP_BOX_CLASS_ID.length > 0) {
            $("#"+WEEK_REPORT_DROP_BOX_CLASS_ID).remove();
        }
    });
    $(".body .week-report .query-form fieldset .container .cell .input input").click(function(event) {
        event.stopPropagation();//阻止事件冒泡即可
        if ($(this).attr("selected")) return;
        $(".body .week-report .query-form fieldset .container .cell .input input").attr('selected',false);
        $(this).attr('selected',true);
        if (WEEK_REPORT_DROP_BOX_CLASS_ID.length > 0) {
            $("#"+WEEK_REPORT_DROP_BOX_CLASS_ID).remove();
        }
        var y = $(this).offset().top;
        var x = $(this).offset().left;
        var height = $(this).height();
        var width = $(this).width();
        WEEK_REPORT_DROP_BOX_CLASS_ID = UUID(10);

        var div = $("<div></div>").attr("id", WEEK_REPORT_DROP_BOX_CLASS_ID);
        div.css({
            'width': (width+3)+'px',
            'max-height': '180px',
            'background-color': 'white',
            'position': 'absolute',
            'border-radius': '4px',
            'z-index': '1001',
            'top': (y+height+3)+'px',
            'left': x+'px',
            'display': 'none',
            'overflow': 'auto',
            'font-size': '12px',
            'border': '1px solid #4BB2FD',
            'box-shadow': '0 0 6px #4BB2FD',
            'cursor': 'pointer'
        });
        $("body").append(div);

        var field = $(this).attr("class");
        var sql = "SELECT DISTINCT "+MySQLSpecialFieldProcess(field)+" FROM week_report";

        var param = {};
        param['method'] = "SELECT";
        param["SQL"] = sql;
        sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
            if (d.ErrCode != 0) {
                alter(d.msg);
                return;
            }
            var data = d.data;
            if (data.length < 1) return;
            var i=0;
            var sel = $(".body .week-report .query-form fieldset .container .cell .input input[selected='selected']");
            var value = sel.val();
            for(i=0; i<data.length; i++) {
                var fd = $.trim(data[i]);
                if (fd.length < 1) continue;
                var dd = $("<div></div>").text(fd);
                dd.attr("title", fd);
                dd.css({
                    'height': '20px',
                    'line-height': '20px',
                    'overflow': 'hidden',
                    'padding-left': '5px',
                    'margin-bottom': '1px'
                });
                if (value.indexOf((fd+","))!=-1) {
                    dd.addClass('selected');
                    dd.css("background-color","#0074E8");
                    dd.css("color", "white");
                }
                // dd.hover(function() {
                //     /* Stuff to do when the mouse enters the element */
                //     $(this).css("background-color","#E4FFE6");
                // }, function() {
                //     /* Stuff to do when the mouse leaves the element */
                //     $(this).css("background-color","transparent");
                // });
                div.append(dd);
                dd.click(function(event) {
                    /* Act on the event */
                    var sel = $(".body .week-report .query-form fieldset .container .cell .input input[selected='selected']");
                    var value = sel.val();
                    var value1 = $(this).text()+",";
                    if ($(this).hasClass('selected')) {
                        $(this).removeClass('selected');
                        $(this).css("background-color","transparent");
                        $(this).css("color", "black");
                        value = value.replace(value1, '');
                    } else {
                        $(this).addClass('selected');
                        $(this).css("background-color","#0074E8");
                        $(this).css("color", "white");
                        value += value1;
                    }
                    sel.val(value);
                });
            }

            div.show(100);
        });
    });

    $(".body .week-report .query-form fieldset legend span").click(function(event) {
        var icon = $(this).prev("i");
        if (icon.hasClass('icony02')) {
            icon.removeClass('icony02');
            icon.addClass('icony04');
        } else {
            icon.removeClass('icony04');
            icon.addClass('icony02');
        }
        $(this).parent().next().slideToggle(400);
    });

    $(".body .week-report .query-opt button.add").click(function(event) {
        $("body").children(".hyl-bokeh").addClass("hyl-show");
        $(".wrap1 .week-report-table").show();
        $(".wrap1 .week-report-table .body .foot button.commit").text("添加");
        $(".wrap1 .week-report-table .body .foot button.commit").attr("value", "add");

        var i=0;
        var cols=TABLE_CONF.columns;
        for(i=1; i<cols.length; i++) {
            var cls = ".wrap1 .week-report-table .body table .field_"+cols[i].field;
            $(cls).val("");
        }
    });

    $(".body .week-report .query-opt button.update").click(function(event) {
        var id = $(".week-report .query-result tbody .selected").attr("row-id");
        if (typeof id == 'undefined') {
            alert("请选取需要更新的行！");
            return ;
        }

        $("body").children(".hyl-bokeh").addClass("hyl-show");
        $(".wrap1 .week-report-table").show();
        $(".wrap1 .week-report-table .body .foot button.commit").text("更新");
        $(".wrap1 .week-report-table .body .foot button.commit").attr("value", "update");
        $(".wrap1 .week-report-table .body .foot button.commit").attr("row-id", id);

        var sql = "SELECT ID,SUPPLIER,PRIORITY,SYSTEM,ITEM_TYPE,ITEM,ITEM_PROGRESS,LAST_WEEK_WORK, \
                    THIS_WEEK_WORK,SUPPLIER_FOLLOWUP_WORK,PROVIDE_ITEM_WEEK_REPORT,SUPPLIER_FEEDBACK,\
                    SUPPLIER_ITEM_CHARGE,START_DATE,END_DATE,RISK_POINT,ITEM_CHARGE,WORKLOAD,\
                    `GROUP`,NEED_TRACK,DETAIL_DESIGN_DOC,DESIGN_REVIEW_DATE,BUSINESS_DEPART,\
                    DESIGN_REVIEW_STATUS,NOTE FROM week_report WHERE ID="+id;
        var param = {};
        param['method'] = "SELECT";
        param["SQL"] = sql;
        sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
            if (d.ErrCode != 0) {
                alter(d.msg);
                return;
            }

            var row = d.data[0];
            var cols = TABLE_CONF.columns;
            var i=0;
            var etable = $(".wrap1 .week-report-table .body table");
            for (i=1; i<cols.length; i++) {
                var cls = ".field_"+cols[i].field;
                etable.find(cls).val("");
                etable.find(cls).val(row[i]);
            }
        });
    });

    $(".body .week-report .query-opt button.delete").click(function(event) {
        var id = $(".week-report .query-result tbody .selected").attr("row-id");
        if (typeof id == 'undefined') {
            alert("请选取需要更新的行！");
            return ;
        }

        var sql = "DELETE FROM week_report WHERE ID="+id;
        var param = {};
        param['method'] = "UPDATE";
        param["SQL"] = sql;
        sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
            if (d.ErrCode != 0) {
                alter(d.msg);
                return;
            }
            WeekReportQueryTable(WEEK_REPORT_PAGE_NUM*WEEK_REPORT_PAGE_SIZE, WEEK_REPORT_PAGE_SIZE);
        });
    });

    $(".body .week-report .query-opt button.queryi").click(function(event) {
        var parent = $(".week-report .query-form .condition .container");
        var SUPPLIER = parent.find(".SUPPLIER").val();
        var PRIORITY = parent.find(".PRIORITY").val();
        var SYSTEM = parent.find(".SYSTEM").val();
        var ITEM_TYPE = parent.find(".ITEM_TYPE").val();
        var ITEM = parent.find(".ITEM").val();
        var ITEM_PROGRESS = parent.find(".ITEM_PROGRESS").val();
        var GROUP = parent.find(".GROUP").val();
        var ITEM_CHARGE = parent.find(".ITEM_CHARGE").val();
        var NEED_TRACK = parent.find(".NEED_TRACK").val();
        var scondition = "";

        var s = SUPPLIER;
        var field = "SUPPLIER";
        if (s.length > 0) {
            if (s[s.length-1] == ',') s = s.substring(0, s.length-1);
            s = "'"+s.replace(/,/g, "','")+"'";
            if (scondition.length < 1) {
                scondition += " WHERE "+field+" IN ("+s+") ";
            }else {
                scondition += " AND " + field+" IN ("+s+") ";
            }
        }

        s = PRIORITY;
        field = "PRIORITY";
        if (s.length > 0) {
            if (s[s.length-1] == ',') s = s.substring(0, s.length-1);
            s = "'"+s.replace(/,/g, "','")+"'";
            if (scondition.length < 1) {
                scondition += " WHERE "+field+" IN ("+s+") ";
            }else {
                scondition += " AND " + field+" IN ("+s+") ";
            }
        }
        s = SYSTEM;
        field = "SYSTEM";
        if (s.length > 0) {
            if (s[s.length-1] == ',') s = s.substring(0, s.length-1);
            s = "'"+s.replace(/,/g, "','")+"'";
            if (scondition.length < 1) {
                scondition += " WHERE "+field+" IN ("+s+") ";
            }else {
                scondition += " AND " + field+" IN ("+s+") ";
            }
        }
        s = ITEM_TYPE;
        field = "ITEM_TYPE";
        if (s.length > 0) {
            if (s[s.length-1] == ',') s = s.substring(0, s.length-1);
            s = "'"+s.replace(/,/g, "','")+"'";
            if (scondition.length < 1) {
                scondition += " WHERE "+field+" IN ("+s+") ";
            }else {
                scondition += " AND " + field+" IN ("+s+") ";
            }
        }
        s = ITEM;
        field = "ITEM";
        if (s.length > 0) {
            if (s[s.length-1] == ',') s = s.substring(0, s.length-1);
            s = "'"+s.replace(/,/g, "','")+"'";
            if (scondition.length < 1) {
                scondition += " WHERE "+field+" IN ("+s+") ";
            }else {
                scondition += " AND " + field+" IN ("+s+") ";
            }
        }
        s = ITEM_PROGRESS;
        field = "ITEM_PROGRESS";
        if (s.length > 0) {
            if (s[s.length-1] == ',') s = s.substring(0, s.length-1);
            s = "'"+s.replace(/,/g, "','")+"'";
            if (scondition.length < 1) {
                scondition += " WHERE "+field+" IN ("+s+") ";
            }else {
                scondition += " AND " + field+" IN ("+s+") ";
            }
        }
        s = GROUP;
        field = "GROUP";
        field = MySQLSpecialFieldProcess(field);
        if (s.length > 0) {
            if (s[s.length-1] == ',') s = s.substring(0, s.length-1);
            s = "'"+s.replace(/,/g, "','")+"'";
            if (scondition.length < 1) {
                scondition += " WHERE "+field+" IN ("+s+") ";
            }else {
                scondition += " AND " + field+" IN ("+s+") ";
            }
        }
        s = ITEM_CHARGE;
        field = "ITEM_CHARGE";
        if (s.length > 0) {
            if (s[s.length-1] == ',') s = s.substring(0, s.length-1);
            s = "'"+s.replace(/,/g, "','")+"'";
            if (scondition.length < 1) {
                scondition += " WHERE "+field+" IN ("+s+") ";
            }else {
                scondition += " AND " + field+" IN ("+s+") ";
            }
        }
        s = NEED_TRACK;
        field = "NEED_TRACK";
        if (s.length > 0) {
            if (s[s.length-1] == ',') s = s.substring(0, s.length-1);
            s = "'"+s.replace(/,/g, "','")+"'";
            if (scondition.length < 1) {
                scondition += " WHERE "+field+" IN ("+s+") ";
            }else {
                scondition += " AND " + field+" IN ("+s+") ";
            }
        }
        WEEK_REPORT_QUERY_CONDITION = scondition;
        WeekReportQueryTable(WEEK_REPORT_PAGE_NUM*WEEK_REPORT_PAGE_SIZE, WEEK_REPORT_PAGE_SIZE);
    });

    $(".body .week-report .query-opt button.export").click(function(event) {
        sql = "SELECT ID,SUPPLIER,PRIORITY,SYSTEM,ITEM_TYPE,ITEM,ITEM_PROGRESS,LAST_WEEK_WORK, \
            THIS_WEEK_WORK,SUPPLIER_FOLLOWUP_WORK,PROVIDE_ITEM_WEEK_REPORT,SUPPLIER_FEEDBACK,\
            SUPPLIER_ITEM_CHARGE,START_DATE,END_DATE,RISK_POINT,ITEM_CHARGE,WORKLOAD,\
            `GROUP`,NEED_TRACK,DETAIL_DESIGN_DOC,DESIGN_REVIEW_DATE,BUSINESS_DEPART,\
            DESIGN_REVIEW_STATUS,NOTE FROM week_report ";

        var param = {};
        param['method'] = "SELECT";
        param['SQL'] = sql;
        sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
            if (d.ErrCode != 0) {
                alter(d.msg);
                return;
            }
            var data = d.data;
            var shead = "";
            var sbody = "";

            shead += "<th>#</th>";
            shead += "<th>供应商</th>";
            shead += "<th>优先级</th>";
            shead += "<th>系统</th>";
            shead += "<th>项目类别</th>";
            shead += "<th>项目</th>";
            shead += "<th>项目进度</th>";
            shead += "<th>上周完成工作</th>";
            shead += "<th>本周完成工作</th>";
            shead += "<th>供应商后续工作</th>";
            shead += "<th>是否提供项目周报</th>";
            shead += "<th>供应商反馈</th>";
            shead += "<th>供应商项目负责人</th>";
            shead += "<th>开始时间</th>";
            shead += "<th>结束时间</th>";
            shead += "<th>风险点</th>";
            shead += "<th>负责人</th>";
            shead += "<th>工作量（人/周）</th>";
            shead += "<th>小组</th>";
            shead += "<th>标签</th>";
            shead += "<th>设计文档</th>";
            shead += "<th>设计评审时间</th>";
            shead += "<th>业务主管部门</th>";
            shead += "<th>设计评审时间和状态</th>";
            shead += "<th>备注</th>";
            shead = "<tr>" + shead + "</tr>";
            var i=0;
            var j=0;
            for (i=0; i<data.length; i++) {
                var row = data[i];
                var trow = "";
                for(j=0; j<row.length; j++) {
                    trow += "<td>" + row[j] + "</td>";
                }
                sbody += "<tr>" + trow + "</tr>";
            }
            var html = "<table>" + shead + sbody + "</table>";
            if(getExplorer()=='ie') {
                alert("不支持IE导出！");
            } else {
                tableToExcel(html);
            }
        });
    });

    $(".wrap1 .week-report-table .head .exitbtn").click(function(event) {
        $("body").children(".hyl-bokeh").removeClass('hyl-show');
        $(".wrap1 .week-report-table").hide();
    });

    $(".wrap1 .week-report-table .foot .commit").click(function(event) {
        var mode = $(this).attr("value");
        var columns = TABLE_CONF.columns;
        var i=0;
        var sql_fields = '';
        var sql_values = '';
        var sql = '';

        if (mode == 'add') {
            for(i=0; i<columns.length; i++) {
                var field = columns[i].field;
                if (field == 'ID') continue;
                sql_fields += MySQLSpecialFieldProcess(field)+","
                sql_values += "'"+WeekReportGetValue(field)+"',";
            }
            sql_fields += "ADD_USER,";
            sql_values += "'"+g_CURRENT_USER+"',";
            sql_fields = sql_fields.substr(0, sql_fields.length - 1);
            sql_values = sql_values.substr(0, sql_values.length - 1);
            sql = "INSERT INTO week_report("+sql_fields+") VALUES(" + sql_values + ")";
        }
        else if (mode == 'update') {
            var id = $(this).attr("row-id");
            $(this).attr("row-id", '');
            sql = "UPDATE week_report SET ";
            for(i=1; i<columns.length; i++) {
                var field = columns[i].field;
                sql = sql + MySQLSpecialFieldProcess(field) + "='"+WeekReportGetValue(field)+"', ";
            }
            sql = sql.substr(0, sql.length - 2) + " WHERE ID="+id;
        }

        var param = {};
        param['method'] = "INSERT";
        param['SQL'] = sql;
        sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
            if (d.ErrCode != 0) {
                alter(d.msg);
                return;
            }
            WeekReportQueryTable(WEEK_REPORT_PAGE_NUM*WEEK_REPORT_PAGE_SIZE, WEEK_REPORT_PAGE_SIZE);
            $("body").children(".hyl-bokeh").removeClass('hyl-show');
            $(".wrap1 .week-report-table").hide();
        });

    });

    $(".week-report .query-foot .page-size").click(function(event) {
        $(this).siblings('.selected').removeClass('selected');
        $(this).addClass('selected');
        WEEK_REPORT_PAGE_SIZE = parseInt($(this).text());
        WEEK_REPORT_PAGE_NUM = 0;
        WeekReportQueryTable(WEEK_REPORT_PAGE_NUM*WEEK_REPORT_PAGE_SIZE, WEEK_REPORT_PAGE_SIZE);
    });

    $(".week-report .query-foot button").click(function(event) {
        var cls = $(this).attr("class");
        if (cls == "prev") {
            if (WEEK_REPORT_PAGE_NUM == WEEK_REPORT_TOTAL_PAGE_NUM) {
                $(".week-report .query-foot button.next").attr("disabled",false);
            }
            WEEK_REPORT_PAGE_NUM--;
        } else if (cls == "next") {
            if (WEEK_REPORT_PAGE_NUM == 0) {
                $(".week-report .query-foot button.prev").attr("disabled",false);
            }
            WEEK_REPORT_PAGE_NUM++;
        }
        // if (WEEK_REPORT_PAGE_NUM ==0) {
        //     $(".week-report .query-foot button.prev").attr("disabled",true);
        // }
        // if (WEEK_REPORT_PAGE_NUM == WEEK_REPORT_TOTAL_PAGE_NUM) {
        //     $(".week-report .query-foot button.next").attr("disabled",true);
        // }
        WeekReportQueryTable(WEEK_REPORT_PAGE_NUM*WEEK_REPORT_PAGE_SIZE, WEEK_REPORT_PAGE_SIZE);
    });
}

function WeekReportQueryTable(offset, rows) {
    sql = "SELECT ID,SUPPLIER,PRIORITY,SYSTEM,ITEM_TYPE,ITEM,ITEM_PROGRESS,LAST_WEEK_WORK, \
            THIS_WEEK_WORK,SUPPLIER_FOLLOWUP_WORK,PROVIDE_ITEM_WEEK_REPORT,SUPPLIER_FEEDBACK,\
            SUPPLIER_ITEM_CHARGE,START_DATE,END_DATE,RISK_POINT,ITEM_CHARGE,WORKLOAD,\
            `GROUP`,NEED_TRACK,DETAIL_DESIGN_DOC,DESIGN_REVIEW_DATE,BUSINESS_DEPART,\
            DESIGN_REVIEW_STATUS,NOTE FROM week_report ";

    sql = sql + WEEK_REPORT_QUERY_CONDITION;
    sql = sql + " limit "+offset+", "+rows;

    var param = {};
    param['method'] = "SELECT";
    param['SQL'] = sql;
    sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
        if (d.ErrCode != 0) {
            alter(d.msg);
            return;
        }

        var tbody=$(".week-report .query-result table tbody");
        tbody.html("");
        var data = d.data;
        var i=0;
        var j=0;
        for (i=0; i<data.length; i++) {
            var row = data[i];
            var tr = $("<tr></tr>").attr("row-id", row[0]+"");
            for (j=0; j<row.length; j++) {
                var pre = $("<pre></pre>").text(row[j]);
                var td = $("<td></td>").append(pre);
                tr.append(td);
            }
            tr.click(function(event) {
                $(this).siblings('.selected').removeClass('selected');
                $(this).addClass('selected');
            });
            tbody.append(tr);
        }
    });

    /*------------------------------------------*/
    WeekReportQueryGetTotalCount();
    WEEK_REPORT_TOTAL_PAGE_NUM = parseInt(WEEK_REPORT_QUERY_TOTAL_COUNT/WEEK_REPORT_PAGE_SIZE)+0;
    var ps = WEEK_REPORT_PAGE_NUM*WEEK_REPORT_PAGE_SIZE;
    var txt = "("+(ps+1)+"-"+((ps+WEEK_REPORT_PAGE_SIZE)>WEEK_REPORT_QUERY_TOTAL_COUNT ? WEEK_REPORT_QUERY_TOTAL_COUNT : (ps+WEEK_REPORT_PAGE_SIZE))+"/"+(WEEK_REPORT_QUERY_TOTAL_COUNT)+")"
    $(".week-report .query-foot .page-info").text(txt);

    if (WEEK_REPORT_PAGE_NUM == 0) {
        $(".week-report .query-foot button.prev").attr("disabled",true);
    }
    if (((WEEK_REPORT_PAGE_NUM+1)*WEEK_REPORT_PAGE_SIZE)> WEEK_REPORT_QUERY_TOTAL_COUNT) {
        $(".week-report .query-foot button.next").attr("disabled",true);
    } else if ( ((WEEK_REPORT_PAGE_NUM+1)*WEEK_REPORT_PAGE_SIZE)< WEEK_REPORT_QUERY_TOTAL_COUNT ) {
        $(".week-report .query-foot button.next").attr("disabled",false);
    }
}

function WeekReportQueryGetTotalCount() {
    var sql = "SELECT COUNT(1) FROM week_report "+WEEK_REPORT_QUERY_CONDITION;

    var param = {};
    param['method'] = "SELECT";
    param['SQL'] = sql;
    sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
        if (d.ErrCode != 0) {
            alter(d.msg);
            return;
        }
        WEEK_REPORT_QUERY_TOTAL_COUNT = parseInt(d.data[0][0]);
    });
}



























































































































