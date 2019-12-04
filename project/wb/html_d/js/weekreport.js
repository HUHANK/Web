/*全局变量*/
/**WeekReport */
var WeekReport = {};
WeekReport.data = [];
WeekReport.total_data_num = 0;
/**一页显示的数据条数 */
WeekReport.page_size = 50;
WeekReport.now_page_num = 1;
WeekReport.status_bar = null;
WeekReport.query_order_by = "";

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
                                    ".wrap1 .week-report-table .body .field_END_DATE_CHG_REASON", 
                                    ".wrap1 .week-report-table .body .field_MILESTONE1",
                                    ".wrap1 .week-report-table .body .field_MILESTONE2",
                                    ".wrap1 .week-report-table .body .field_ITEM_PROGRESS",
                                    ".wrap1 .week-report-table .body .field_MILESTONE1_END_TIME",
                                    ".wrap1 .week-report-table .body .field_MILESTONE2_END_TIME",
                                    ".wrap1 .week-report-table .body .field_SUPPLIER_INPUT_INFO",
                                    ".wrap1 .week-report-table .body .field_ITEM_STAGE",
                                    ".wrap1 .week-report-table .body .field_ITEM_INNER_RISKS",
                                    ".wrap1 .week-report-table .body .field_ITEM_OUTER_RISKS"

                                ];
var WEEK_REPORT_REQUIRED_FIELDB=[
                                    ".wrap1 .week-report-table .body .field_THIS_WEEK_WORK"
];

var WEEK_REPORT_FIELD_END_DATE_PREV='';
var WEEK_REPORT_FIELD_END_DATE_NEXT='';
var WEEK_REPORT_FIELD_END_DATE_BMOD = false;
var WEEK_REPORT_FIELD_END_DATE_NEED = false;
var WEEK_REPORT_FIELD_CHG_REASON_DETAIL = [];


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
    {name: '#',                  field: 'ID',                       sel_field: "ID",                     width: '40', align: 'center'},
    {name: '系统',                field: 'SYSTEM',                  sel_field: "SYSTEM",                 width: '80', align: 'center'},
    {name: '项目',                field: 'ITEM',                    sel_field: "ITEM",                   width: '80', align: 'center'},
    {name: '小组',                field: 'GROUP',                   sel_field: "`GROUP`",                 width: '60', align: 'center'},
    {name: '负责人',              field: 'ITEM_CHARGE',              sel_field: "ITEM_CHARGE",            width: '50', align: 'center'},
    {name: '项目开始时间',         field: 'START_DATE',               sel_field: "START_DATE",             width: '80', align: 'center'},
    {name: '项目结束时间',         field: 'END_DATE',                 sel_field: "END_DATE",               width: '80', align: 'center'}, 
    {name: '项目进度(%)',         field: 'ITEM_PROGRESS',            sel_field: "ITEM_PROGRESS",         width: '50', align: 'center'},
    {name: '本周工作计划',        field: 'LAST_WEEK_WORK',           sel_field: "LAST_WEEK_WORK",         width: '320', align: 'left'},
    {name: '本周完成工作',        field: 'THIS_WEEK_WORK',           sel_field: "THIS_WEEK_WORK",         width: '320', align: 'left'},
    {name: '下周工作计划',        field: 'NEXT_WEEK_WORK',           sel_field: "NEXT_WEEK_WORK",         width: '320', align: 'left'},
    {name: '项目组内风险',        field: 'ITEM_INNER_RISKS',         sel_field: "ITEM_INNER_RISKS",        width: '280', align: 'left'},
    {name: '项目组外风险',        field: 'ITEM_OUTER_RISKS',         sel_field: "ITEM_OUTER_RISKS",        width: '280', align: 'left'},
    {name: '优先级',              field: 'PRIORITY',                 sel_field: "PRIORITY",              width: '40', align: 'center'},
    {name: '项目类别',            field: 'ITEM_TYPE',                sel_field: "ITEM_TYPE",             width: '50', align: 'center'},
    {name: '项目所处阶段',        field: 'ITEM_STAGE',                sel_field: "ITEM_STAGE",            width: '80', align: 'center'},
    {name: '项目状态',            field: 'ITEM_STATUS',            sel_field: "ITEM_STATUS",              width: '50', align: 'center'},
    {name: '标签',                field: 'NEED_TRACK',               sel_field: "NEED_TRACK",             width: '60', align: 'center'},
    {name: '匹配度低说明',        field: 'MEET_FEEDBACK',            sel_field: "MEET_FEEDBACK",          width: '120', align: 'left'},
    //{name: '风险点',              field: 'RISK_POINT',               sel_field: "RISK_POINT",             width: '280', align: 'left'},
    //{name: 'JIRA号',             field: 'JIRA_NOS',                 sel_field: "JIRA_NOS",               width: '100', align: 'center'},
    {name: '当前里程碑任务',      field: 'MILESTONE1',               sel_field: "MILESTONE1",             width: '280', align: 'left'},
    {name: '截止时间',            field: 'MILESTONE1_END_TIME',      sel_field: "MILESTONE1_END_TIME",    width: '80', align: 'center'},
    {name: '下一里程碑任务',      field: 'MILESTONE2',               sel_field: "MILESTONE2",             width: '280', align: 'left'},
    {name: '截止时间',            field: 'MILESTONE2_END_TIME',      sel_field: "MILESTONE2_END_TIME",    width: '80', align: 'center'},
    {name: '供应商',              field: 'SUPPLIER',                 sel_field: "SUPPLIER",              width: '50', align: 'center'},
    {name: '供应商投入问题',      field: 'SUPPLIER_INPUT_INFO',      sel_field: "SUPPLIER_INPUT_INFO",    width: '280', align: 'left'},
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
    {name: '备注',                field: 'NOTE',                     sel_field: "NOTE",                    width: '200', align: 'center'},
    {name: '是否报研管',          field: 'SFBYG',                     sel_field: "SFBYG",                   width: '50', align: 'center'}
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
    var h = wheight -6;
    var hh = $("body .wrapper-top").height() + 
    $(".body .week-report .query-form").height() + $(".body .week-report .query-opt").height() + 
    $(".body .week-report .query-foot").height()+$(".body .week-report .query-result thead").height()
    ;
    var hs = getScrollWidth();
    
    // console.info("XJFKSJLFKDFJSJFKDS----------");
    // console.info(wheight+"||"+$("body .wrapper-top").height())
    // console.info($(".body .week-report .query-form").height()+"||"+$(".body .week-report .query-opt").height());
    // console.info($(".body .week-report .query-foot").height()+"||"+$(".body .week-report .query-result thead").height());
    // console.info(getScrollWidth());
    
    if (h == 0 || hs == 0) {
        window.setTimeout(WeekReportWinResize, 100);
    }

    if (hh == 0) {
        h = wheight - 72 -17 - 23 - 34 - 37 -17 ;
        $(".week-report .query-result table thead").css("width", "calc(100% - "+ 17 +"px)");
    } else {
        h = h - hh - hs;
        $(".week-report .query-result table thead").css("width", "calc(100% - "+getScrollWidth()+"px)");
    }
    
    $(".body .week-report .query-result tbody").css("max-height", h+"px");
}

function WeekReportInit() {
    /**表格状态栏 */
    WeekReport.status_bar = HTableStatusBar($(".body .week-report .query-foot"));
    WeekReport.status_bar.set_select_page_size_change(WeekReport.render);
    WeekReport.status_bar.set_first_page_click_handle(WeekReport.render);
    WeekReport.status_bar.set_last_page_click_handle(WeekReport.render);
    WeekReport.status_bar.set_next_page_click_handle(WeekReport.render);
    WeekReport.status_bar.set_prev_page_click_handle(WeekReport.render);
    WeekReport.status_bar.set_goto_page_click_handle(WeekReport.render);
    /**初始化是否包含历史个人周报为空 不选 */
    $(".week-report .query-form .condition .SFBHGRLS").prop("checked", false);
    /*初始化表头*/
    //$(".week-report .query-result table thead").css("width", "calc(100% - "+getScrollWidth()+"px)");
    var tr = $("<tr></tr>");
    var i=0; 
    for(i=0; i<TABLE_CONF.columns.length; i++){
        var th = $("<th></th>").text(TABLE_CONF.columns[i].name);
        th.css("width", (TABLE_CONF.columns[i].width)+"px");
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
    WEEK_REPORT_QUERY_CONDITION = " WHERE ITEM_CHARGE IN ('" + g_CURRENT_USER + "') AND ITEM_STATUS IN ('未完成','') ";
    WeekReport.render_data();

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
        dateFormat: "yy-mm-dd",
        onClose: function(dateText, inst){
            /**再次判断是否是个人周报，个人周报就不用填写时间变更原因的 */
            if ($(".wrap1 .week-report-table .body .field_NEED_TRACK").val() == "个人周报" ) return;
            if (WEEK_REPORT_FIELD_END_DATE_NEED == false) return;
            
            WEEK_REPORT_FIELD_END_DATE_NEXT = dateText;

            if (WEEK_REPORT_FIELD_END_DATE_PREV != WEEK_REPORT_FIELD_END_DATE_NEXT)
            {
                //alert( WEEK_REPORT_FIELD_END_DATE_PREV + " || " + WEEK_REPORT_FIELD_END_DATE_NEXT);
                //$(".wrap1 .week-report-table .body .date_change").show('100', function() {});
                $(".wrap1 .week-report-table .body .date_change .field_END_DATE_CHG_REASON").val("");
                $(".wrap1 .week-report-table .body .date_change").slideDown('100', function() {});
            }else{
                //$(".wrap1 .week-report-table .body .date_change").hide('100', function() {});
                $(".wrap1 .week-report-table .body .date_change").slideUp(100);
                WEEK_REPORT_FIELD_END_DATE_BMOD = false;
            }
        }
    });
    $(".wrap1 .week-report-table .body .field_END_DATE").focus(function(){
        if (WEEK_REPORT_FIELD_END_DATE_NEED == false) return;
        if (WEEK_REPORT_FIELD_END_DATE_BMOD == false)
        {
            WEEK_REPORT_FIELD_END_DATE_PREV = $(this).val();
            WEEK_REPORT_FIELD_END_DATE_BMOD = true;
        }
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
                        WeekReport.render_data(WeekReport.now_page_num);
                    });
                    
                    sql = "DELETE FROM field_value_mod_detail where WP_ID = " + id;
                    param["SQL"] = sql;
                    sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
                        if (d.ErrCode != 0) {
                            alter(d.msg);
                            return;
                        }
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

    /**删除按钮事件 */
    $( ".body .week-report .query-opt button.delete" ).click(function( event ) {
        var id = $(".week-report .query-result tbody .selected").attr("row-id");
        if (typeof id == 'undefined') {
            alert("请选取需要删除的行！");
            return ;
        }
        var user = $(".week-report .query-result tbody .selected").find(".cITEM_CHARGE pre").text();
        if (user != g_CURRENT_USER) {
            alert("您无权删除【" + user + "】的周报！");
            return;
        }

        if ($(".week-report .query-result tbody .selected").attr("data-flag") == "1") {
            alert("历史存档数据请不要删除!");
            return ;
        }
        $( "#week-report-dialog-01" ).dialog( "open" );
        event.preventDefault();
    });

    /**过滤器里面 */
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

    /**过滤器点击事件 包含初始化查询控件*/
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
        $(this).parent().siblings().slideToggle(100);

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

        /*特殊修改*/
        $(".body .week-report .query-form fieldset .container .cell .input select.ITEM_STATUS").html(
            "<option selected>未完成</option><option>已完成</option><option>暂停</option><option selected></option>");
    });

    /**添加任务按钮事件 */
    $(".body .week-report .query-opt button.add").click(function(event) {
        $("body").children(".hyl-bokeh").addClass("hyl-show");
        $(".wrap1 .week-report-table").show();
        $(".wrap1 .week-report-table .body .foot button.commit").text("添加");
        $(".wrap1 .week-report-table .body .foot button.commit").attr("value", "add");
        $(".wrap1 .week-report-table .body .foot").css("display", "block");

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
        $(".wrap1 .week-report-table .body table .field_ITEM_STATUS").val("未完成");
        $(".wrap1 .week-report-table .body table .field_SFBYG").val("否");
        //$(".wrap1 .week-report-table .body table .field_ITEM_STAGE").val("策划阶段");
        WeekReportInitRequired();

    });

    /**更新任务按钮事件 */
    $(".body .week-report .query-opt button.update").click(function(event) {
        var id = $(".week-report .query-result tbody .selected").attr("row-id");
        if (typeof id == 'undefined') {
            alert("请选取需要修改的行！");
            return ;
        }

        var user = $(".week-report .query-result tbody .selected").find(".cITEM_CHARGE pre").text();
        if (user != g_CURRENT_USER) {
            alert("您无权修改【" + user + "】的周报！");
            return;
        }

        //console.info($(".week-report .query-result tbody .selected").attr("data-flag"));
        if ($(".week-report .query-result tbody .selected").attr("data-flag") == "1") {
            alert("历史存档数据请不要修改!");
            return ;
        }

        $(".wrap1 .week-report-table .body .date_change").hide();
        $("body").children(".hyl-bokeh").addClass("hyl-show");
        $(".wrap1 .week-report-table").show();
        $(".wrap1 .week-report-table .body .foot button.commit").text("更新");
        $(".wrap1 .week-report-table .body .foot button.commit").attr("value", "update");
        $(".wrap1 .week-report-table .body .foot button.commit").attr("row-id", id);
        $(".wrap1 .week-report-table .body .foot").css("display", "block");

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

            if ($(".wrap1 .week-report-table .body .field_NEED_TRACK").val() == "项目周报" ) WEEK_REPORT_FIELD_END_DATE_NEED = true;
            else{
                /**个人周报的话，帮他们自动设置本周的开始日期和结束日期 */
                var date = new Date();
                var ret = date.GetWeekStartAndEndDate();
                $(".wrap1 .week-report-table .body .field_START_DATE").val(ret[0]);
                $(".wrap1 .week-report-table .body .field_END_DATE").val(ret[1]);
            }
        });
    });
    
    $(".body .week-report .query-opt button.grzb").click(function () {  
        WEEK_REPORT_QUERY_CONDITION = " WHERE ITEM_CHARGE IN ('" + g_CURRENT_USER + "') AND NEED_TRACK IN ('个人周报') ";
        WeekReport.render_data(1);
    });
    $(".body .week-report .query-opt button.xmzb").click(function () {  
        WEEK_REPORT_QUERY_CONDITION = " WHERE ITEM_CHARGE IN ('" + g_CURRENT_USER + "') AND NEED_TRACK IN ('项目周报') ";
        WeekReport.query_order_by = " ORDER BY ITEM_STATUS ";
        WeekReport.render_data(1);
    });

    /**查询按钮点击事件 */
    $(".body .week-report .query-opt button.queryi").click(function(event) {
        var scondition = "";
        var ccondifunc = function(filed_name) {
            if (filed_name.length < 1) return;

            var s = $(".week-report .query-form .condition .container ."+filed_name+" option:selected");
            var field = MySQLSpecialFieldProcess(filed_name);

            if (s.length > 0) {
                var sf = "";
                if (s.length == 1 ) {
                    if ($.trim($(s[0]).text()) != "")
                        sf = "'"+$(s[0]).text()+"',";
                }
                else
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
        }

        ccondifunc("SFBYG");
        ccondifunc("PRIORITY");
        ccondifunc("SYSTEM");
        ccondifunc("ITEM_TYPE");
        ccondifunc("ITEM");
        ccondifunc("ITEM_PROGRESS");
        ccondifunc("GROUP");
        ccondifunc("ITEM_CHARGE");
        ccondifunc("NEED_TRACK");
        ccondifunc("ITEM_STATUS");
        
        WEEK_REPORT_QUERY_CONDITION = scondition;
        
        WeekReport.render_data(1);
    });
    /**导出按钮点击事件 */
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

    /**导出处理事件 */
    $(".wrap1 .week-report-export .export").click(function(event) {
        var trs = $(".wrap1 .week-report-export tbody tr[export='yes']");
        var sfbhgrls = $(".week-report .query-form .condition .SFBHGRLS").prop("checked");
        var i=0;
        var colums = "";
        var shead = ""; 
        var sql = "", data = null;
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

        sql = "SELECT " + colums + " FROM week_report "+WEEK_REPORT_QUERY_CONDITION;
        sql += " ORDER BY `GROUP`,ITEM_CHARGE ";
        data = WeekReport.query_data_from_db(sql);
        if (sfbhgrls == true) {
            /**包含历史周报 */
            sql = "SELECT " + colums + " FROM his_week_report "+WEEK_REPORT_QUERY_CONDITION;
            sql += " ORDER BY `GROUP`,ITEM_CHARGE ";
            data = data.concat(WeekReport.query_data_from_db(sql));
        }
        
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
            AddEndDateChangeReason(id);
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
            WeekReport.render_data(WeekReport.now_page_num);
            $("body").children(".hyl-bokeh").removeClass('hyl-show');
            $(".wrap1 .week-report-table").hide();
        });

    });

    $(".wrap1 .week-report-table .body .field_NEED_TRACK").change(function(event) {
        if ($(this).val() == "项目周报") {
            WEEK_REPORT_REQUIRED_FIELDS = WEEK_REPORT_REQUIRED_FIELDA;
            $(".wrap1 .week-report-table .body table .field_ITEM_STATUS").val("未完成");
        } else {
            WEEK_REPORT_REQUIRED_FIELDS = WEEK_REPORT_REQUIRED_FIELDB;
            $(".wrap1 .week-report-table .body table .field_ITEM_STATUS").val("");
            $(".wrap1 .week-report-table .body .field_ITEM_PROGRESS").val(0);
            var date = new Date();
            var ret = date.GetWeekStartAndEndDate();
            $(".wrap1 .week-report-table .body .field_START_DATE").val(ret[0]);
            $(".wrap1 .week-report-table .body .field_END_DATE").val(ret[1]);
        }
        WeekReportInitRequired();
    });

    $(".wrap1 .week-report-table .body .field_ITEM_PROGRESS").change(function(event) {
        if ($(this).val() == 100){
            $(".wrap1 .week-report-table .body table .field_ITEM_STATUS").val("已完成");
        }
    });

    $(".wrap1 .week-report-table .body .field_ITEM_STATUS").change(function(event) {
        if ($(this).val() == "已完成"){
            $(".wrap1 .week-report-table .body .field_ITEM_PROGRESS").val(100);
        }
    });
}

function AddEndDateChangeReason(id){
    if (WEEK_REPORT_FIELD_END_DATE_NEED == false || WEEK_REPORT_FIELD_END_DATE_BMOD == false) return;

    var vla = WeekReportGetValue("END_DATE_CHG_REASON");
    var sql1 = "INSERT INTO field_value_mod_detail(WP_ID, FIELD_NAME, FIELD_VALUE, CHG_REASON) VALUES("+id+", 'END_DATE', '" + WEEK_REPORT_FIELD_END_DATE_PREV + "','" + vla + "')";

    var param = {};
    param['method'] = "INSERT";
    param['SQL'] = sql1;
    sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
        if (d.ErrCode != 0) {
            alter(d.msg);
            return;
        }
    });

    WEEK_REPORT_FIELD_END_DATE_PREV='';
    WEEK_REPORT_FIELD_END_DATE_NEXT='';
    WEEK_REPORT_FIELD_END_DATE_BMOD = false;
    WEEK_REPORT_FIELD_END_DATE_NEED = false;
    $(".wrap1 .week-report-table .body .date_change").hide();
    $(".wrap1 .week-report-table .body .date_change .field_END_DATE_CHG_REASON").val("");
}

function WeekReportCheckFieldValueRightful()
{
    var NEED_TRACK = $.trim(WeekReportGetValue("NEED_TRACK"));
    var ITEM_PROGRESS = $.trim(WeekReportGetValue("ITEM_PROGRESS"));
    var THIS_WEEK_WORK = $.trim(WeekReportGetValue("THIS_WEEK_WORK"));
    if (THIS_WEEK_WORK.length < 1) {
        WeekReportDialog02TiShi("请填写本周完成的工作!");
        return false;
    }
    if (NEED_TRACK == "项目周报") {
        var MILESTONE1 = $.trim(WeekReportGetValue("MILESTONE1"));
        var MILESTONE2 = $.trim(WeekReportGetValue("MILESTONE2"));
        var MILESTONE1_END_TIME = $.trim(WeekReportGetValue("MILESTONE1_END_TIME"));
        var MILESTONE2_END_TIME = $.trim(WeekReportGetValue("MILESTONE2_END_TIME"));
        var ITEM_STAGE = $.trim(WeekReportGetValue("ITEM_STAGE"));
        var SUPPLIER_INPUT_INFO = $.trim(WeekReportGetValue("SUPPLIER_INPUT_INFO"));
        var ITEM_INNER_RISKS = $.trim(WeekReportGetValue("ITEM_INNER_RISKS"));
        var ITEM_OUTER_RISKS = $.trim(WeekReportGetValue("ITEM_OUTER_RISKS"));

        var nowT = GetNowDate2();
        
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
        /**判断里程碑的结束日期不能小于当前日期 */
        if (MILESTONE1_END_TIME < nowT || MILESTONE2_END_TIME < nowT) {
            WeekReportDialog02TiShi("里程碑任务截止日期不能小于当前时间!");
            return false;
        }
        if (ITEM_STAGE.length < 1) {
            WeekReportDialog02TiShi("请选择项目所处阶段!");
            return false;
        }
        if (SUPPLIER_INPUT_INFO.length < 1) {
            WeekReportDialog02TiShi("请输入供应商投入问题!");
            return false;
        }
        if (ITEM_INNER_RISKS.length < 1 || ITEM_OUTER_RISKS.length < 1){
            WeekReportDialog02TiShi("请填写组内或组外风险!");
            return false;
        }

        if (WEEK_REPORT_FIELD_END_DATE_NEED == true && WEEK_REPORT_FIELD_END_DATE_BMOD == true)
        {
            var END_DATE_CHG_REASON = $.trim(WeekReportGetValue("END_DATE_CHG_REASON"));
            if (END_DATE_CHG_REASON.length < 1){
                WeekReportDialog02TiShi("请输入项目结束时间修改说明!");
                return false;
            }
        }

    }
    return true;
}

function GetFieldChangeReasonDetailFromArrary(id){
    var arr = [];

    var i=0;
    for(i=0; i<WEEK_REPORT_FIELD_CHG_REASON_DETAIL.length; i++){
        var obj = WEEK_REPORT_FIELD_CHG_REASON_DETAIL[i];
        if (obj["WP_ID"] == id){
            arr.push(obj);
        }
    }

    return arr;
}

function SelectFieldChangeReasonDetail()
{
    WEEK_REPORT_FIELD_CHG_REASON_DETAIL = [];

    var sql = "SELECT WP_ID, FIELD_NAME, FIELD_VALUE, CHG_REASON FROM field_value_mod_detail ORDER BY WP_ID, FIELD_NAME, ADD_DATE";
    var param = {};
    param['method'] = "SELECT";
    param['SQL'] = sql;
    sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
        if (d.ErrCode != 0) {
            alter(d.msg);
            return;
        }
        var i=0;
        for(i=0; i<d.data.length; i++){
            var data = d.data[i];
            var obj = {};
            obj['WP_ID'] = data[0];
            obj['FIELD_NAME']  =  data[1];
            obj['FIELD_VALUE'] =  data[2];
            obj['CHG_REASON']  =  data[3];
            WEEK_REPORT_FIELD_CHG_REASON_DETAIL.push(obj);
        } 
    });

    $(".week-report .query-result table tbody tr").each(function(index, el) {
        var id = $(this).attr("row-id");
        var arr = GetFieldChangeReasonDetailFromArrary(id);
        if (arr.length < 1) return;

        /*END_DATE*/
        var cEnd_date = $(this).children('.cEND_DATE');
        var nowDate = cEnd_date.children('pre').text();
        cEnd_date.html("");
        var i = 0;
        var div = $("<div></div>").text(nowDate);
        div.css({
            "font-weight": 'bold'
        });
        div.attr("title", "最新的结束日期");
        cEnd_date.append(div);
        for(i=arr.length-1; i>=0; i--) {
            var obj = arr[i];
            if (obj['FIELD_NAME'] == "END_DATE"){
                div = $("<div></div>").text(obj["FIELD_VALUE"]);
                div.attr("title", obj["CHG_REASON"]);
                cEnd_date.append(div);
            }
        }
        cEnd_date.children('div').css({
            "text-align": 'center'
        });
    });
}

WeekReport.render = function() {
    WeekReport.page_size = WeekReport.status_bar.page_size;
    WeekReport.now_page_num = WeekReport.status_bar.now_page_num;
    WeekReport.status_bar.total_page_num = WeekReport.total_page_num();
    WeekReport.table_body_bind_data(WeekReport.get_now_page_data());
}
WeekReport.total_page_num = function() {
    var total_num = WeekReport.data.length;
    if (total_num % WeekReport.page_size == 0) {
        return total_num/WeekReport.page_size;
    }else {
        return Math.ceil(total_num/WeekReport.page_size);
    }
}
WeekReport.get_now_page_data = function() {
    return WeekReport.get_n_page_data(WeekReport.now_page_num);
}
WeekReport.get_prev_page_data = function () {
    /**如果翻到第一页，还向前翻，则总是返回第一页的数据 */
    var page_num = WeekReport.now_page_num - 1;
    if (page_num >= 1) WeekReport.now_page_num = page_num;
    return WeekReport.get_n_page_data(WeekReport.now_page_num);
}
WeekReport.get_next_page_data = function () {  
    /**如果翻到最后一页，还向后翻，则总是返回最后一页的数据 */
    var page_num = WeekReport.now_page_num + 1;
    if (page_num <= WeekReport.total_page_num()) WeekReport.now_page_num = page_num;
    return WeekReport.get_n_page_data(WeekReport.now_page_num);
}
WeekReport.is_first_page = function() {
    return WeekReport.now_page_num == 1 ? true : false;
}
WeekReport.is_last_page = function () {
    return WeekReport.now_page_num == WeekReport.total_page_num() ? true : false;
}

WeekReport.get_n_page_data = function(page_num) {
    var ret = [];
    if (page_num < 1 || page_num > WeekReport.total_page_num()) return [];
    
    var start_row_num = (page_num - 1) * WeekReport.page_size;
    var end_row_num = (page_num) * WeekReport.page_size;
    var i = start_row_num;
    for(i; i<end_row_num; i++) {
        if (WeekReport.data[i] == undefined) break;
        ret.push(WeekReport.data[i]);
    }
    return ret;
}

WeekReport.render_data = function (page_num = 1) {  
    var sfbhgrls = $(".week-report .query-form .condition .SFBHGRLS").prop("checked");
    var mode = 1;
    if (sfbhgrls == true) mode = 3;

    WeekReport.get_all_week_report_table_data(mode);
    WeekReport.page_size = WeekReport.status_bar.get_page_size();
    WeekReport.status_bar.total_page_num = WeekReport.total_page_num();
    WeekReport.now_page_num = page_num;
    WeekReport.status_bar.now_page_num = WeekReport.now_page_num;
    WeekReport.status_bar.set_page_info();
    WeekReport.status_bar.set_total_data_num_info(WeekReport.total_data_num);
    WeekReport.render();
}

WeekReport.get_all_week_report_table_data = function(mode = null) {
    WeekReport.data = [];
    /**如果参数没有指定查询模式，就取设置的查询参数 */
    if (null == mode) mode = WeekReport.QueryMode;
    if (1 == mode) { /**只查询周报表 */
        WeekReport.get_week_report_table_data("week_report");
    } else if (2 == mode) { /**只查询历史周报表 */
        WeekReport.get_week_report_table_data("his_week_report", 1);
    } else if (3 == mode) { /**查询周报表和历史周报表 */
        WeekReport.get_week_report_table_data("week_report");
        WeekReport.get_week_report_table_data("his_week_report", 1);
    }
    WeekReport.total_data_num = WeekReport.data.length;
    //console.info("总共数据量："+WeekReport.total_data_num);
}

WeekReport.get_week_report_table_data = function(TableName, flag = 0) {
    var i=0;
    var columns = TABLE_CONF.columns;
    var sql = "SELECT ";

    for(i=0; i<columns.length; i++) {
        sql += columns[i].sel_field + ",";
    }
    sql = sql.substring(0, sql.length - 1) + " FROM " + TableName + " " + WEEK_REPORT_QUERY_CONDITION;
    if (WeekReport.query_order_by.length < 1)
        sql += " ORDER BY `GROUP`, ITEM_CHARGE, UPT_DATE ";
    else
        sql += WeekReport.query_order_by;
    WeekReport.query_order_by = "";

    var param = {};
    param['method'] = "SELECT";
    param['SQL'] = sql;

    sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
        if (d.ErrCode != 0) {
            alter(d.msg);
            return;
        }
        for(i=0; i<d.data.length; i++) {
            d.data[i].push(flag);
        }
        /**如果是历史数据，就颠倒元素的顺序 */
        if (flag == 1) {
            d.data = d.data.reverse();
        }
        WeekReport.data = WeekReport.data.concat(d.data);
        //console.info(WeekReport.data);
    });
}

WeekReport.query_data_from_db = function(sql) {
    var param = {};
    param['method'] = "SELECT";
    param['SQL'] = sql;
    var ret = null;

    sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
        if (d.ErrCode != 0) {
            alter(d.msg);
            return;
        }
        ret = d.data;
    });
    return ret;
}

WeekReport.table_head_init = function() {
    var tr = $("<tr></tr>");
    for(var i=0; i<TABLE_CONF.columns.length; i++) {
        var th = $("<th></th>").text(TABLE_CONF.columns[i].name);
        th.css("width", (TABLE_CONF.columns[i].width)+"px");
        tr.append(th);
    }
    $(".week-report .query-result table thead").html(tr);
}

WeekReport.table_body_bind_data = function(data) {
    var tbody = $(".week-report .query-result table tbody");
    tbody.html("");
    if (data.length < 1) return;
    var RED_COLOR_FIELDS = "RISK_POINT,MEET_FEEDBACK";

    var columns = TABLE_CONF.columns;
    var i=0, j=0;
    for(i=0; i<data.length; i++) {
        var row = data[i];
        var tr = $("<tr></tr>").attr("row-id", row[0]+"");
        var flag = row[row.length-1];
        tr.attr("data-flag", flag);
        
        for(j=0; j<(row.length-1); j++) {
            var field = columns[j].field;
            var pre = $("<pre></pre>").text(row[j]);
            var td = $("<td></td>").append(pre);
            pre.css("text-align", columns[j].align);
            td.css("width", columns[j].width+"px");
            td.addClass('c'+field);
            tr.append(td);
            if (RED_COLOR_FIELDS.indexOf(field) != -1) {
                td.css("color", "red");
            }
        }
        if (flag == 0)
        {
            tr.click(function(event){
                $(this).siblings('.selected').removeClass('selected');
                $(this).addClass('selected');
            });
        } else if ( 1 == flag ) {
            tr.css("background-color", "#F1F1F1");
        }
        tbody.append(tr);
    }

    /**每到周四，提示更新周报 */
    $(".week-report .query-result table tbody .cUPT_DATE").each(function(index, el) {
        if ($(this).parent().attr("data-flag") == "1") return;
        var date = new Date();
        if ( (date.getDay() || 7) >= 4 ) {
            var wfirstday = getFirstDayOfWeek(date);
            if ($(this).children('pre').text() < wfirstday ) 
            {
                $(this).parent().addClass('ts1');
                $(this).parent().attr("title", "请及时更新本周周报！");
            }
        }
    });

    SelectFieldChangeReasonDetail();
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
                    if ($(this).val() != null && $(this).val().length > 0) $(this).removeClass('wrequired-red');
                } else {
                    if ($(this).val() == null || $(this).val().length < 1) $(this).addClass('wrequired-red');
                }
            }
        });
    }
}

function WeekReportInitRequired() {
    if ($(".wrap1 .week-report-table .body .field_NEED_TRACK").val() == "项目周报" ) WEEK_REPORT_REQUIRED_FIELDS = WEEK_REPORT_REQUIRED_FIELDA;
    else WEEK_REPORT_REQUIRED_FIELDS = WEEK_REPORT_REQUIRED_FIELDB;

    var arr = WEEK_REPORT_REQUIRED_FIELDS;
    
    if ($(".wrap1 .week-report-table .body .wrequired").length > 0)
        $(".wrap1 .week-report-table .body .wrequired").removeClass('wrequired').removeClass('wrequired-red');

    var i= 0;
    for(i=0; i<arr.length; i++) {

        var o = $(arr[i]);
        //console.info(o);
        o.addClass('wrequired');
        if (o.val() != null && o.val().length > 0 ) {
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










































