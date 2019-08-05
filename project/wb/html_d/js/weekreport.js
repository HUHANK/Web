/*全局变量*/
var WEEK_REPORT_EVENT_INIT=false;
var WEEK_REPORT_PAGE_SIZE=25;
var WEEK_REPORT_PAGE_NUM = 0;
var WEEK_REPORT_TOTAL_PAGE_NUM = 0;
var WEEK_REPORT_QUERY_TOTAL_COUNT = 0;

var WEEK_REPORT_QUERY_CONDITION='';
var WEEK_REPORT_CURRENT_USER_GROUP = '';

var WEEK_REPORT_REQUIRED_FIELDS='';
var WEEK_REPORT_REQUIRED_FIELDA=[   ".wrap1 .week-report-table .body .field_LAST_WEEK_WORK", 
                                    ".wrap1 .week-report-table .body .field_THIS_WEEK_WORK",
                                    ".wrap1 .week-report-table .body .field_NEXT_WEEK_WORK", 
                                    ".wrap1 .week-report-table .body .field_RISK_POINT", 
                                    ".wrap1 .week-report-table .body .field_MILESTONE1",
                                    ".wrap1 .week-report-table .body .field_MILESTONE2",
                                    ".wrap1 .week-report-table .body .field_ITEM_PROGRESS",
                                    ".wrap1 .week-report-table .body .field_MILESTONE1_END_TIME",
                                    ".wrap1 .week-report-table .body .field_MILESTONE2_END_TIME",
                                    ".wrap1 .week-report-table .body .field_ITEM_STAGE"
                                ];
var WEEK_REPORT_REQUIRED_FIELDB=[
                                    ".wrap1 .week-report-table .body .field_THIS_WEEK_WORK"
];

/*Main函数*/
function WeekReportMain() {
    if (!WEEK_REPORT_EVENT_INIT) {
        WeekReportInit();
        WeekReportEvent();
        WEEK_REPORT_EVENT_INIT = true;
    }
    WeekReportWinResize();
}

var TABLE_CONF = {};
TABLE_CONF.columns = [
    {name: '#',                  field: 'ID',                       sel_field: "ID",                     width: '28', align: 'center'},
    {name: '供应商',              field: 'SUPPLIER',                 sel_field: "SUPPLIER",              width: '50', align: 'center'},
    {name: '优先级',              field: 'PRIORITY',                 sel_field: "PRIORITY",              width: '40', align: 'center'},
    {name: '系统',                field: 'SYSTEM',                  sel_field: "SYSTEM",                 width: '80', align: 'center'},
    {name: '项目类别',            field: 'ITEM_TYPE',                sel_field: "ITEM_TYPE",             width: '50', align: 'center'},
    {name: '项目',                field: 'ITEM',                    sel_field: "ITEM",                   width: '80', align: 'center'},
    {name: '项目开始时间',         field: 'START_DATE',               sel_field: "START_DATE",             width: '80', align: 'center'},
    {name: '项目结束时间',         field: 'END_DATE',                 sel_field: "END_DATE",               width: '80', align: 'center'}, 
    {name: '项目所处阶段',        field: 'ITEM_STAGE',                sel_field: "ITEM_STAGE",            width: '80', align: 'center'},
    {name: '项目进度(%)',         field: 'ITEM_PROGRESS',            sel_field: "ITEM_PROGRESS",         width: '50', align: 'center'},
    {name: '小组',                field: 'GROUP',                   sel_field: "`GROUP`",                 width: '60', align: 'center'},
    {name: '负责人',              field: 'ITEM_CHARGE',              sel_field: "ITEM_CHARGE",            width: '50', align: 'center'},
    {name: '标签',                field: 'NEED_TRACK',               sel_field: "NEED_TRACK",             width: '60', align: 'center'},
    {name: '本周工作计划',        field: 'LAST_WEEK_WORK',           sel_field: "LAST_WEEK_WORK",         width: '320', align: 'left'},
    {name: '本周完成工作',        field: 'THIS_WEEK_WORK',           sel_field: "THIS_WEEK_WORK",         width: '320', align: 'left'},
    {name: '下周工作计划',        field: 'NEXT_WEEK_WORK',           sel_field: "NEXT_WEEK_WORK",         width: '320', align: 'left'},
    {name: '匹配度低说明',        field: 'MEET_FEEDBACK',            sel_field: "MEET_FEEDBACK",          width: '120', align: 'left'},
    {name: '风险点',              field: 'RISK_POINT',               sel_field: "RISK_POINT",             width: '280', align: 'left'},
    //{name: 'JIRA号',             field: 'JIRA_NOS',                 sel_field: "JIRA_NOS",               width: '100', align: 'center'},
    {name: '当前里程碑任务',      field: 'MILESTONE1',               sel_field: "MILESTONE1",             width: '280', align: 'left'},
    {name: '截止时间',            field: 'MILESTONE1_END_TIME',      sel_field: "MILESTONE1_END_TIME",    width: '80', align: 'center'},
    {name: '下一里程碑任务',      field: 'MILESTONE2',               sel_field: "MILESTONE2",             width: '280', align: 'left'},
    {name: '截止时间',            field: 'MILESTONE2_END_TIME',      sel_field: "MILESTONE2_END_TIME",    width: '80', align: 'center'},
    {name: '供应商后续工作',      field: 'SUPPLIER_FOLLOWUP_WORK',   sel_field: "SUPPLIER_FOLLOWUP_WORK", width: '220', align: 'left'},
    {name: '是否提供项目周报',    field: 'PROVIDE_ITEM_WEEK_REPORT',  sel_field: "PROVIDE_ITEM_WEEK_REPORT",width: '60', align: 'center'},
    {name: '供应商反馈',          field: 'SUPPLIER_FEEDBACK',        sel_field: "SUPPLIER_FEEDBACK",       width: '180', align: 'center'},
    {name: '供应商项目负责人',    field: 'SUPPLIER_ITEM_CHARGE',      sel_field: "SUPPLIER_ITEM_CHARGE",   width: '60', align: 'center'},
    {name: '工作量(人/周)',       field: 'WORKLOAD',                  sel_field: "WORKLOAD",               width: '60', align: 'center'}, 
    {name: '设计文档',            field: 'DETAIL_DESIGN_DOC',        sel_field: "DETAIL_DESIGN_DOC",      width: '100', align: 'center'},
    {name: '设计评审时间',        field: 'DESIGN_REVIEW_DATE',       sel_field: "DESIGN_REVIEW_DATE",      width: '80', align: 'center'},
    {name: '业务主管部门',        field: 'BUSINESS_DEPART',          sel_field: "BUSINESS_DEPART",         width: '80', align: 'center'},
    {name: '设计评审时间和状态',   field: 'DESIGN_REVIEW_STATUS',     sel_field: "DESIGN_REVIEW_STATUS",    width: '100', align: 'center'},
    {name: '更新日期',     field: 'UPT_DATE', sel_field: "date_format(UPT_DATE, '%Y-%m-%d')",               width: '80', align: 'center'},
    {name: '备注',                field: 'NOTE',                     sel_field: "NOTE",                    width: '200', align: 'center'}
];

function getTableConfObjectByField(field) {
    var i=0;
    for(i=0; i<TABLE_CONF.columns.length; i++) {
        if (field == TABLE_CONF.columns[i].field) {
            return TABLE_CONF.columns[i];
        }
    }
    return '';
}

function WeekReportWinResize() {
    wheight = $(window).height();
    var h = wheight - $("body .wrapper-top").height() - 
        $(".body .week-report .query-form").height() - $(".body .week-report .query-opt").height() - 
        $(".body .week-report .query-foot").height()-$(".body .week-report .query-result thead").height()-
        getScrollWidth()-6;
    $(".body .week-report .query-result tbody").css("max-height", h+"px");
}

function WeekReportInit() {
    /*初始化表头*/
    var tr = $("<tr></tr>");
    var i=0; 
    for(i=0; i<TABLE_CONF.columns.length; i++){
        var th = $("<th></th>").text(TABLE_CONF.columns[i].name);
        th.css("width", (TABLE_CONF.columns[i].width)+"px");
        tr.append(th);
    }
    $(".week-report .query-result table thead").html(tr);
    $(".week-report .query-result table thead").css("width", "calc(100% - "+getScrollWidth()+"px)");

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

    $(".wrap1 .week-report-table .body .field_START_DATE").datepicker({
        showButtonPanel: true,
        changeMonth: true,
        changeYear: true,
        showWeek: true,
        firstDay: 1,
        dateFormat: "yy-mm-dd"
    });

    $(".wrap1 .week-report-table .body .field_END_DATE").datepicker({
        showButtonPanel: true,
        changeMonth: true,
        changeYear: true,
        showWeek: true,
        firstDay: 1,
        dateFormat: "yy-mm-dd"
    });

    $(".wrap1 .week-report-table .body .field_DESIGN_REVIEW_DATE").datepicker({
        showButtonPanel: true,
        changeMonth: true,
        changeYear: true,
        showWeek: true,
        firstDay: 1,
        dateFormat: "yy-mm-dd"
    });

    $(".wrap1 .week-report-table .body .field_MILESTONE1_END_TIME").datepicker({
        showButtonPanel: true,
        changeMonth: true,
        changeYear: true,
        showWeek: true,
        firstDay: 1,
        dateFormat: "yy-mm-dd"
    });

    $(".wrap1 .week-report-table .body .field_MILESTONE2_END_TIME").datepicker({
        showButtonPanel: true,
        changeMonth: true,
        changeYear: true,
        showWeek: true,
        firstDay: 1,
        dateFormat: "yy-mm-dd"
    });

    var j=0;
    $(".wrap1 .week-report-table .body .field_GROUP").html("");
    $(".wrap1 .week-report-table .body .field_ITEM_CHARGE").html("");
    for(i=0; i<g_ALL_GROUP.length; i++) {
        if (g_ALL_GROUP[i].depart_id != 1) continue;
        var opt = $("<option></option>").text(g_ALL_GROUP[i].name);
        $(".wrap1 .week-report-table .body .field_GROUP").append(opt);
        var optgroup = $("<optgroup></optgroup>").attr("label", g_ALL_GROUP[i].name);
        for(j=0; j<g_ALL_USER.length; j++) {
            if (g_ALL_USER[j].group_id == g_ALL_GROUP[i].id) {
                optgroup.append($("<option></option>").text(g_ALL_USER[j].cname));
                if (g_ALL_USER[j].cname == g_CURRENT_USER) {
                    WEEK_REPORT_CURRENT_USER_GROUP = g_ALL_GROUP[i].name;
                }
            }
        }
        $(".wrap1 .week-report-table .body .field_ITEM_CHARGE").append(optgroup);
    }

}

function WeekReportGetValue(cls) {

    var clas = ".week-report-table .body .field_"+cls;
    var tagName = $(clas)[0].tagName;
    if (tagName == "INPUT" || tagName == "TEXTAREA" || tagName == 'SELECT') {
        if ($(clas).val() == null) return '';
        return ($(clas).val());
    } else {
        return '';
    }
}

function WeekReportScroll() {
    
}

function WeekReportEvent() {
    /*周报页面被点击时事件*/
    $("#week-report-dialog-01").dialog({
        autoOpen: false,
        width: 400,
        modal: true,
        buttons: [
            {
                text: "Ok",
                click: function() {
                    var id = $(".week-report .query-result tbody .selected").attr("row-id");
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
                    $( this ).dialog( "close" );
                }
            },
            {
                text: "Cancel",
                click: function() {
                    $( this ).dialog( "close" );
                }
            }
        ]
    });

    $("#week-report-dialog-02").dialog({
        autoOpen: false,
        width: 400,
        modal: true
    });

    WeekReportRequiredFocusEvent();

    $( ".body .week-report .query-opt button.delete" ).click(function( event ) {
        var id = $(".week-report .query-result tbody .selected").attr("row-id");
        if (typeof id == 'undefined') {
            alert("请选取需要更新的行！");
            return ;
        }
        $( "#week-report-dialog-01" ).dialog( "open" );
        event.preventDefault();
    });

    $(".body .week-report .query-form fieldset .container .cell .mult").click(function(event) {
        var sel = $(this).prev().children();
        if (typeof sel.attr("multiple") == 'undefined') {
            sel.attr("multiple", true);
            sel.css("height", "100px");
        } else if (sel.attr("multiple") == 'multiple'){
            sel.attr("multiple", false);
            sel.css("height", "24px");
        }
    });

    $(".body .week-report .query-form fieldset legend span").click(function(event) {
        event.stopPropagation();//阻止事件冒泡即可
        var icon = $(this).prev("i");
        var bSelectData = false;
        if (icon.hasClass('icony02')) {
            icon.removeClass('icony02');
            icon.addClass('icony04');
            bSelectData = true;
        } else {
            icon.removeClass('icony04');
            icon.addClass('icony02');
            bSelectData = false;
        }
        $(this).parent().next().slideToggle(400);

        if (bSelectData == false) return;

        var sql = "";
        $(".body .week-report .query-form fieldset .container .cell .input select").each(function(index, el) {
            var sel = $(this);
            var field = $(this).attr("class");
            sql += " SELECT '"+field+"'," + MySQLSpecialFieldProcess(field) + " FROM week_report GROUP BY "+MySQLSpecialFieldProcess(field);
            sql += " UNION ALL"
        });
        sql = sql.substring(0, sql.length-9);
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

            $(".body .week-report .query-form fieldset .container .cell .input select").each(function(index, el) {
                var field = $(this).attr("class");
                var i=0;
                $(this).html("");
                $(this).append($("<option></option>"));
                for(i=0; i<data.length; i++) {
                    if (field == data[i][0]) {
                        var fd = $.trim(data[i][1]);
                        if (fd.length < 1) continue;
                        $(this).append($("<option></option>").text(fd));
                    }
                }
            });
        });
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
        $(".wrap1 .week-report-table .body table .field_ITEM_CHARGE").val(g_CURRENT_USER);
        $(".wrap1 .week-report-table .body table .field_NEED_TRACK").val("项目周报");
        $(".wrap1 .week-report-table .body table .field_PRIORITY").val("低");
        $(".wrap1 .week-report-table .body table .field_START_DATE").val(GetNowDate2());
        $(".wrap1 .week-report-table .body table .field_END_DATE").val(GetNowDate2());
        $(".wrap1 .week-report-table .body table .field_ITEM_PROGRESS").val(0);
        $(".wrap1 .week-report-table .body table .field_WORKLOAD").val(0);
        $(".wrap1 .week-report-table .body table .field_GROUP").val(WEEK_REPORT_CURRENT_USER_GROUP);
        //$(".wrap1 .week-report-table .body table .field_ITEM_STAGE").val("策划阶段");
        WeekReportInitRequired();

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

        var i=0;
        var columns = TABLE_CONF.columns;
        var sql = "SELECT ";
        for(i=0; i<columns.length; i++) {
            sql += columns[i].sel_field+",";
        }
        sql = sql.substring(0, sql.length-1)+" FROM week_report WHERE ID=" + id;
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
                if ("UPT_DATE".indexOf(cols[i].field) != -1 ) continue;
                var cls = ".field_"+cols[i].field;
                etable.find(cls).val("");
                etable.find(cls).val(row[i]);
            }
            WeekReportInitRequired();
        });
    });

    $(".body .week-report .query-opt button.queryi").click(function(event) {
        var parent = $(".week-report .query-form .condition .container");
        var SUPPLIER = parent.find(".SUPPLIER option:selected");
        var PRIORITY = parent.find(".PRIORITY option:selected");
        var SYSTEM = parent.find(".SYSTEM option:selected");
        var ITEM_TYPE = parent.find(".ITEM_TYPE option:selected");
        var ITEM = parent.find(".ITEM option:selected");
        var ITEM_PROGRESS = parent.find(".ITEM_PROGRESS option:selected");
        var GROUP = parent.find(".GROUP option:selected");
        var ITEM_CHARGE = parent.find(".ITEM_CHARGE option:selected");
        var NEED_TRACK = parent.find(".NEED_TRACK option:selected");
        var scondition = "";

        var s = SUPPLIER;
        var field = "SUPPLIER";
        if (s.length > 0) {
            var sf = "";
            s.each(function(index, el) {
                if ($(this).text().length > 1) sf += "'"+$(this).text()+"',";
            });
            if (sf.length > 1) {
                sf = sf.substring(0, sf.length-1)
                if (scondition.length < 1) {
                    scondition += " WHERE "+field+" IN ("+sf+") ";
                }else {
                    scondition += " AND " + field+" IN ("+sf+") ";
                }
            }
        }

        s = PRIORITY;
        field = "PRIORITY";
        if (s.length > 0) {
            var sf = "";
            s.each(function(index, el) {
                if ($(this).text().length > 1) sf += "'"+$(this).text()+"',";
            });
            if (sf.length > 1) {
                sf = sf.substring(0, sf.length-1)
                if (scondition.length < 1) {
                    scondition += " WHERE "+field+" IN ("+sf+") ";
                }else {
                    scondition += " AND " + field+" IN ("+sf+") ";
                }
            }
        }

        s = SYSTEM;
        field = "SYSTEM";
        if (s.length > 0) {
            var sf = "";
            s.each(function(index, el) {
                if ($(this).text().length > 1) sf += "'"+$(this).text()+"',";
            });
            if (sf.length > 1) {
                sf = sf.substring(0, sf.length-1)
                if (scondition.length < 1) {
                    scondition += " WHERE "+field+" IN ("+sf+") ";
                }else {
                    scondition += " AND " + field+" IN ("+sf+") ";
                }
            }
        }

        s = ITEM_TYPE;
        field = "ITEM_TYPE";
        if (s.length > 0) {
            var sf = "";
            s.each(function(index, el) {
                if ($(this).text().length > 1) sf += "'"+$(this).text()+"',";
            });
            if (sf.length > 1) {
                sf = sf.substring(0, sf.length-1)
                if (scondition.length < 1) {
                    scondition += " WHERE "+field+" IN ("+sf+") ";
                }else {
                    scondition += " AND " + field+" IN ("+sf+") ";
                }
            }
        }

        s = ITEM;
        field = "ITEM";
        if (s.length > 0) {
            var sf = "";
            s.each(function(index, el) {
                if ($(this).text().length > 1) sf += "'"+$(this).text()+"',";
            });
            if (sf.length > 1) {
                sf = sf.substring(0, sf.length-1)
                if (scondition.length < 1) {
                    scondition += " WHERE "+field+" IN ("+sf+") ";
                }else {
                    scondition += " AND " + field+" IN ("+sf+") ";
                }
            }
        }

        s = ITEM_PROGRESS;
        field = "ITEM_PROGRESS";
        if (s.length > 0) {
            var sf = "";
            s.each(function(index, el) {
                if ($(this).text().length > 1) sf += "'"+$(this).text()+"',";
            });
            if (sf.length > 1) {
                sf = sf.substring(0, sf.length-1)
                if (scondition.length < 1) {
                    scondition += " WHERE "+field+" IN ("+sf+") ";
                }else {
                    scondition += " AND " + field+" IN ("+sf+") ";
                }
            }
        }

        s = GROUP;
        field = "GROUP";
        field = MySQLSpecialFieldProcess(field);
        if (s.length > 0) {
            var sf = "";
            s.each(function(index, el) {
                if ($(this).text().length > 1) sf += "'"+$(this).text()+"',";
            });
            if (sf.length > 1) {
                sf = sf.substring(0, sf.length-1)
                if (scondition.length < 1) {
                    scondition += " WHERE "+field+" IN ("+sf+") ";
                }else {
                    scondition += " AND " + field+" IN ("+sf+") ";
                }
            }
        }

        s = ITEM_CHARGE;
        field = "ITEM_CHARGE";
        if (s.length > 0) {
            var sf = "";
            s.each(function(index, el) {
                if ($(this).text().length > 1) sf += "'"+$(this).text()+"',";
            });
            if (sf.length > 1) {
                sf = sf.substring(0, sf.length-1)
                if (scondition.length < 1) {
                    scondition += " WHERE "+field+" IN ("+sf+") ";
                }else {
                    scondition += " AND " + field+" IN ("+sf+") ";
                }
            }
        }

        s = NEED_TRACK;
        field = "NEED_TRACK";
        if (s.length > 0) {
            var sf = "";
            s.each(function(index, el) {
                if ($(this).text().length > 1) sf += "'"+$(this).text()+"',";
            });
            if (sf.length > 1) {
                sf = sf.substring(0, sf.length-1)
                if (scondition.length < 1) {
                    scondition += " WHERE "+field+" IN ("+sf+") ";
                }else {
                    scondition += " AND " + field+" IN ("+sf+") ";
                }
            }
        }

        WEEK_REPORT_QUERY_CONDITION = scondition;
        WeekReportQueryTable(WEEK_REPORT_PAGE_NUM*WEEK_REPORT_PAGE_SIZE, WEEK_REPORT_PAGE_SIZE);
    });

    $(".body .week-report .query-opt button.export").click(function(event) {
        //$("body").children(".hyl-bokeh").addClass("hyl-show");
        var cols = TABLE_CONF.columns;
        var i = 0;
        var table = $(".wrap1 .week-report-export table tbody");
        table.html("");
        for(i=0; i<cols.length; i++) {
            var tr = $("<tr></tr>");
            tr.click(function(event) {
                event.stopPropagation();//阻止事件冒泡即可
                if ($(this).attr("selected")) return;
                $(this).parent().children("tr[selected='selected']").attr("selected", false);
                $(this).attr("selected", true);
            });
            tr.attr("export", "yes");
            tr.addClass(cols[i].field);
            tr.append($("<td></td>").text(cols[i].name));
            var tmp = $("<td></td>").append($("<i class='icony-44 icony0510'></i>"));
            tmp.css("text-align", "center");
            tmp.css("line-height", "20px");
            tmp.click(function(event) {
                //event.stopPropagation();//阻止事件冒泡即可
                if ($(this).parent().attr("export") == "yes") {
                    $(this).parent().attr("export", "no");
                    $(this).children('i').removeClass();
                    $(this).children('i').addClass('icony-red');
                    $(this).children('i').addClass('icony0709');
                } else {
                    $(this).parent().attr("export", "yes");
                    $(this).children('i').removeClass();
                    $(this).children('i').addClass('icony-44');
                    $(this).children('i').addClass('icony0510');
                }
            });
            tr.append(tmp);
            tmp = $("<td></td>");
            tmp.css("text-align", "center");
            tmp.append($("<i class='icony-44 icony0713'></i>").css("cursor", "pointer").click(function(event) {
                //console.info($(this).parent().parent().prev().length);
                var prev = $(this).parent().parent().prev();
                if (prev.length < 1) return;
                $(this).parent().parent().after(prev);
            }));
            tmp.append($("<i class='icony-44 icony0513'></i>").css("cursor", "pointer").click(function(event) {
                //console.info($(this).parent().parent().next());
                var next = $(this).parent().parent().next();
                if (next.length < 1) return;
                $(this).parent().parent().before(next);
            }));
            tr.append(tmp);
            table.append(tr);
        }

        $("body").children(".hyl-bokeh").addClass("hyl-show");
        $(".wrap1 .week-report-export").show();
    });

    $(".wrap1 .week-report-table .head .exitbtn").click(function(event) {
        $("body").children(".hyl-bokeh").removeClass('hyl-show');
        $(".wrap1 .week-report-table").hide();
    });

    $(".wrap1 .week-report-export .head .exit").click(function(event) {
        $("body").children(".hyl-bokeh").removeClass('hyl-show');
        $(".wrap1 .week-report-export").hide();
    });

    $(".wrap1 .week-report-export .export").click(function(event) {
        var trs = $(".wrap1 .week-report-export tbody tr[export='yes']");
        var i=0;
        var colums = "";
        var shead = ""; 
        var COLS = [];
        for(i=0; i<trs.length; i++) {
            var cls = $(trs[i]).attr("class");
            COLS.push(cls);
            var cname = $($(trs[i]).children()[0]).text();
            shead += "<th>"+cname+"</th>";
            colums += getTableConfObjectByField(cls).sel_field+",";
        }
        shead = "<tr>" + shead + "</tr>";
        colums = colums.substring(0, colums.length-1);

        var sql = "SELECT " + colums + " FROM week_report "+WEEK_REPORT_QUERY_CONDITION;
        sql += " ORDER BY `GROUP`,ITEM_CHARGE ";
        var param = {};
        param['method'] = "SELECT";
        param['SQL'] = sql;
        sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
            if (d.ErrCode != 0) {
                alter(d.msg);
                return;
            }
            var data = d.data;
            var sbody = "";
            var i=0;
            var j=0;

            for (i=0; i<data.length; i++) {
                var row = data[i];
                var trow = "";
                for(j=0; j<row.length; j++) {
                    if ("RISK_POINT,MEET_FEEDBACK".indexOf(COLS[j]) != -1) {
                        trow += "<td style='color:red;'>" + (row[j]+"").replace(/\n/g, "<br style='mso-data-placement:same-cell;'/>") + "</td>";
                    } else {
                        trow += "<td style='color:black;'>" + (row[j]+"").replace(/\n/g, "<br style='mso-data-placement:same-cell;'/>") + "</td>";
                    }
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

    $(".wrap1 .week-report-table .foot .commit").click(function(event) {
        var mode = $(this).attr("value");
        var columns = TABLE_CONF.columns;
        var i=0;
        var sql_fields = '';
        var sql_values = '';
        var sql = '';

        if (WeekReportCheckFieldValueRightful() == false) return ;
        if (mode == 'add') {
            for(i=0; i<columns.length; i++) {
                var field = columns[i].field;
                if ("UPT_DATE,ID".indexOf(field) != -1) continue;
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
                if ("UPT_DATE,ID".indexOf(field) != -1) continue;
                sql = sql + MySQLSpecialFieldProcess(field) + "='"+WeekReportGetValue(field)+"', ";
            }
            sql += "UPT_USER='"+g_CURRENT_USER+"',UPT_DATE= CURRENT_TIMESTAMP ";
            sql = sql + " WHERE ID="+id;
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

    $(".wrap1 .week-report-table .body .field_NEED_TRACK").change(function(event) {
        if ($(this).val() == "项目周报") {
            WEEK_REPORT_REQUIRED_FIELDS = WEEK_REPORT_REQUIRED_FIELDA;
        } else {
            WEEK_REPORT_REQUIRED_FIELDS = WEEK_REPORT_REQUIRED_FIELDB;
        }
        WeekReportInitRequired();
    });
}

function WeekReportCheckFieldValueRightful()
{
    var NEED_TRACK = WeekReportGetValue("NEED_TRACK");
    var ITEM_PROGRESS = WeekReportGetValue("ITEM_PROGRESS");
    var THIS_WEEK_WORK = WeekReportGetValue("THIS_WEEK_WORK");
    if (THIS_WEEK_WORK.length < 1) {
        WeekReportDialog02TiShi("请填写本周完成的工作!");
        return false;
    }
    if (NEED_TRACK == "项目周报") {
        var MILESTONE1 = WeekReportGetValue("MILESTONE1");
        var MILESTONE2 = WeekReportGetValue("MILESTONE2");
        var MILESTONE1_END_TIME = WeekReportGetValue("MILESTONE1_END_TIME");
        var MILESTONE2_END_TIME = WeekReportGetValue("MILESTONE2_END_TIME");
        var ITEM_STAGE = WeekReportGetValue("ITEM_STAGE");

        if (ITEM_PROGRESS.length < 1) {
            WeekReportDialog02TiShi("请填写正确的项目进度!");
            return false;
        }
        if (MILESTONE1.length < 1) {
            WeekReportDialog02TiShi("请填写当前里程碑任务!");
            return false;
        }
        if (MILESTONE2.length < 1) {
            WeekReportDialog02TiShi("请填写下一里程碑任务!");
            return false;
        }
        if (MILESTONE1_END_TIME.length < 1) {
            WeekReportDialog02TiShi("里程碑任务截止日期不能为空!");
            return false;
        }
        if (MILESTONE2_END_TIME.length < 1) {
            WeekReportDialog02TiShi("里程碑任务截止日期不能为空!");
            return false;
        }
        if (ITEM_STAGE.length < 1) {
            WeekReportDialog02TiShi("请选择项目所处阶段!");
            return false;
        }
    }
    return true;
}

function WeekReportQueryTable(offset, rows) {
    var i=0;
    var columns = TABLE_CONF.columns;
    var sql = "SELECT ";
    for(i=0; i<columns.length; i++) {
        sql += columns[i].sel_field+",";
    }
    sql = sql.substring(0, sql.length-1)+" FROM week_report "

    sql = sql + WEEK_REPORT_QUERY_CONDITION;
    sql += " ORDER BY UPT_DATE, ITEM_CHARGE  ";
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
                var feild1 = columns[j].field;
                var pre = $("<pre></pre>").text(row[j]);
                pre.css("text-align", columns[j].align);
                var td = $("<td></td>").append(pre);
                if ("RISK_POINT,MEET_FEEDBACK".indexOf(feild1) != -1) {
                    td.css("color", "red");
                }
                td.css("width", columns[j].width+"px");
                td.addClass('c'+feild1);
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

function WeekReportDialog02TiShi(msg) {
    $( "#week-report-dialog-02 p" ).text(msg);
    $( "#week-report-dialog-02" ).dialog( "open" );
}

function WeekReportRequiredFocusEvent() {
    var arr = WEEK_REPORT_REQUIRED_FIELDA;
    var i = 0;
    for(i=0; i<arr.length; i++) {
        var o = arr[i];
        //$(o).addClass('wrequired');
        $(o).blur(function(event) {
            if ($(this).hasClass('wrequired')) {
                if ($(this).hasClass('wrequired-red')) {
                    if ($(this).val().length > 0) $(this).removeClass('wrequired-red');
                } else {
                    if ($(this).val().length < 1) $(this).addClass('wrequired-red');
                }
            }
        });
    }
}

function WeekReportInitRequired() {
    if ($(".wrap1 .week-report-table .body .field_NEED_TRACK").val() == "项目周报" ) WEEK_REPORT_REQUIRED_FIELDS = WEEK_REPORT_REQUIRED_FIELDA;
    else WEEK_REPORT_REQUIRED_FIELDS = WEEK_REPORT_REQUIRED_FIELDB;

    console.info(WEEK_REPORT_REQUIRED_FIELDS);
    var arr = WEEK_REPORT_REQUIRED_FIELDS;
    
    if ($(".wrap1 .week-report-table .body .wrequired").length > 0)
        $(".wrap1 .week-report-table .body .wrequired").removeClass('wrequired').removeClass('wrequired-red');

    var i= 0;
    for(i=0; i<arr.length; i++) {

        var o = $(arr[i]);
        console.info(o);
        o.addClass('wrequired');
        if (o.val().length > 0 ) {
            if (o.hasClass('wrequired-red')) {
                o.removeClass('wrequired-red');
            }
        }else {
            if (!o.hasClass('wrequired-red')) {
                o.addClass('wrequired-red');
            }
        }
    }
}






















































































































