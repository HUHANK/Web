/*全局变量*/
var WEEK_REPORT_EVENT_INIT=false;
var WEEK_REPORT_PAGE_SIZE=10;
var WEEK_REPORT_PAGE_NUM = 0;
var WEEK_REPORT_TOTAL_PAGE_NUM = 0;
var WEEK_REPORT_QUERY_TOTAL_COUNT = 0;

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
    {name: '上周完成工作',        field: 'LAST_WEEK_WORK',            width: '140', align: 'center'},
    {name: '本周完成工作',        field: 'THIS_WEEK_WORK',            width: '140', align: 'center'},
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
    {name: '纳入跟踪',            field: 'NEED_TRACK',                  width: '60', align: 'center'},
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

    WeekReportQueryTable(WEEK_REPORT_PAGE_NUM*WEEK_REPORT_PAGE_SIZE, WEEK_REPORT_PAGE_SIZE);
    $(".week-report .query-foot button.prev").attr("disabled",true);
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

function WeekReportEvent() {
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
        if (WEEK_REPORT_PAGE_NUM ==0) {
            $(".week-report .query-foot button.prev").attr("disabled",true);
        }
        if (WEEK_REPORT_PAGE_NUM == WEEK_REPORT_TOTAL_PAGE_NUM) {
            $(".week-report .query-foot button.next").attr("disabled",true);
        }
        WeekReportQueryTable(WEEK_REPORT_PAGE_NUM*WEEK_REPORT_PAGE_SIZE, WEEK_REPORT_PAGE_SIZE);
    });
}

function WeekReportQueryTable(offset, rows) {
    sql = "SELECT ID,SUPPLIER,PRIORITY,SYSTEM,ITEM_TYPE,ITEM,ITEM_PROGRESS,LAST_WEEK_WORK, \
            THIS_WEEK_WORK,SUPPLIER_FOLLOWUP_WORK,PROVIDE_ITEM_WEEK_REPORT,SUPPLIER_FEEDBACK,\
            SUPPLIER_ITEM_CHARGE,START_DATE,END_DATE,RISK_POINT,ITEM_CHARGE,WORKLOAD,\
            `GROUP`,NEED_TRACK,DETAIL_DESIGN_DOC,DESIGN_REVIEW_DATE,BUSINESS_DEPART,\
            DESIGN_REVIEW_STATUS,NOTE FROM week_report ";

    sql = sql + "limit "+offset+", "+rows;
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
                var td = $("<td></td>").text(row[j]);
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
    var txt = "("+(ps+1)+"-"+(ps+WEEK_REPORT_PAGE_SIZE)+"/"+(WEEK_REPORT_QUERY_TOTAL_COUNT)+")"
    $(".week-report .query-foot .page-info").text(txt);
}

function WeekReportQueryGetTotalCount() {
    var sql = "SELECT COUNT(1) FROM week_report ";

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



























































































































