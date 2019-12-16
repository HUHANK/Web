var ZMSJAP_TABLE = null;
var BINIT = false; 
var ZMSJAP_SQL_QUERY_CONDITION = "";

function ZMSJAP_resize() {
    if (ZMSJAP_TABLE == null) return;
    var hs = getScrollWidth();
    if (hs == 0) {
        window.setTimeout(ZMSJAP_resize, 100);
    }
    ZMSJAP_TABLE.ScrollWidth = hs;
    ZMSJAP_TABLE.refresh();
    
    var wwidth = $(window).width();
    var wheight = $(window).height();
    var h1 = $("body .wrapper-top").outerHeight();
    var h2 = $(".body .ZMSJAP .opt-area").outerHeight()
    var h3 = $(".body .ZMSJAP .res-area thead").outerHeight();
    $(".body .ZMSJAP .res-area tbody").height(wheight-h1 -h2 - h3 - hs - 4);
    $(".body .ZMSJAP .res-area").width(wwidth);
}


function ZMSJAP_main() {
    if (BINIT) return;
    BINIT = true;

    var TABLE_CONF = {};
    TABLE_CONF.body_height = 800;
    TABLE_CONF.columns = [
        {name: "#",             field: "ID",        width: 30, align: "center"},
        {name: "升级、测试项目", field: "ITEM",      width: 150, align: "center"},
        {name: "系统版本",       field: "XTBB",     width: 90, align: "center"},
        {name: "分类",          field: "FL",        width: 50, align: "center"},
        {name: "上线功能",      field: "SXGN",      width: 200, align: "left"},
        {name: "上线意义",      field: "SXYY",      width: 200, align: "left"},
        {name: "是否为重点上线功能", field: "SFZD",  width: 80, align: "center"},
        {name: "地点",          field: "ADDR",      width: 100, align: "center"},
        {name: "负责人及联系方式", field: "FZRLXFS", width: 200, align: "left"},
        {name: "周六支持",         field: "ZLZC",   width: 200, align: "left"},
        {name: "周一支持",          field: "ZYZC",  width: 200, align: "left"},
        {name: "金仕达参与人要求",  field: "CYRYQ",  width: 200, align: "left"},
        {name: "本次升级情况",      field: "BCSJQK",  width: 200, align: "left"},
        {name: "外部关联系统测试情况",field: "GLXTCSQK",  width: 200, align: "left"},
        {name: "业务部门测试情况",  field: "YWBMCSQK",  width: 200, align: "left"},
        {name: "后续处理方案",      field: "HXCLFA",  width: 200, align: "left"},
        {name: "添加日期",         field: "ADD_DATE",  width: 100, align: "center"},
    ];

    function query(condition = " order by ADD_DATE desc ") {
        var cols = TABLE_CONF.columns, i, sql="SELECT ";
        for(i=0; i<cols.length; i++) {
            if (cols[i].field == "ADD_DATE") {
                sql += " date_format(" + cols[i].field + ", '%Y-%m-%d'),";
            }else
                sql += " " + cols[i].field + ",";
        }
        sql = sql.substring(0, sql.length-1) + " FROM zmsjap " + condition;

        var param = {};
        param['method'] = "SELECT";
        param['SQL'] = sql;
        sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
            if (d.ErrCode != 0) {
                alter(d.msg);
                return;
            }
            TABLE_CONF.data = d.data;
            ZMSJAP_TABLE = HTable($(".body .ZMSJAP .res-area"), TABLE_CONF);
        });
        ZMSJAP_resize();
    }

    /**刷新页面 */
    var dt1 = new Date();
    var sed = dt1.GetWeekStartAndEndDate();
    var dt2 = new Date(sed[0]);
    dt2 = dt2.DateAdd('w', -1).toJSON().substring(0, 10);
    //console.info(dt2, sed[1]);
    var condition = " where date_format(ADD_DATE, '%Y-%m-%d') >= '" + dt2 + "' AND date_format(ADD_DATE, '%Y-%m-%d') <='" + sed[1] + "'  order by ADD_DATE desc ";
    query(condition);
    ZMSJAP_SQL_QUERY_CONDITION = condition;

    $(".ZMSJAP .opt-area .qry_all").click(function(){
        query();
        ZMSJAP_SQL_QUERY_CONDITION = "";
    });

    $(".ZMSJAP .opt-area .qry_bz").click(function(){
        var dt1 = new Date();
        var sed = dt1.GetWeekStartAndEndDate();
        var condition = " where date_format(ADD_DATE, '%Y-%m-%d') >= '" + sed[0] + "' AND date_format(ADD_DATE, '%Y-%m-%d') <='" + sed[1] + "'  order by ADD_DATE desc ";
        query(condition);
        ZMSJAP_SQL_QUERY_CONDITION = condition;
    });

    function ErrMsg(title, str) {
        var dlg = HDialog();
        dlg.show();
        dlg.set_info_msg(title, str);
    }
    $(".ZMSJAP .opt-area .del").click(function(){
        var row = ZMSJAP_TABLE.get_selected_row();
        if (row == null) {
            ErrMsg("提示", "请选择需要删除的行!");
            return;
        }

        // var upt_date = row[row.length-2];
        // var nowd = new Date();
        // var arr = nowd.GetWeekStartAndEndDate();
        // if (upt_date < arr[0]) {
        //     ErrMsg("提示", "请不要删除非本周的数据!");
        //     return;
        // }

        var dlg = HDialog();
        dlg.show();
        dlg.set_info_msg("提示", "请确认需要删除该记录!");
        dlg.confirn_handler = function() {
            var sql = "DELETE FROM zmsjap WHERE ID = " +row[0];
            var param = {};
            param['method'] = "UPDATE";
            param['SQL'] = sql;
            sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
                if (d.ErrCode != 0) {
                    alter(d.msg);
                    return;
                }
                if (ZMSJAP_SQL_QUERY_CONDITION.length > 0) 
                    query(ZMSJAP_SQL_QUERY_CONDITION);
                else
                    query();
            });
        }
    });

    function CreateDialog(title = "添加安排", mode = 1) {
        var dlg = HDialog();
        var required = false;
        dlg.dialog_width = 800;
        dlg.dialog_height = 500;
        dlg.dialog_title = title;
        dlg.show();

        dlg.add_row();
        dlg.add_input("项目名称", "ITEM");
        dlg.add_input("系统版本", "XTBB");
        dlg.add_select("分类", "FL", ['测试', '升级', '其它']);

        dlg.add_row();
        dlg.add_input("地点", "ADDR");
        dlg.add_select("是否是重点", "SFZD", ['否', '是']);

        dlg.add_row();
        dlg.add_textarea("上线功能", "SXGN");
        dlg.add_textarea("上线意义", "SXYY");

        dlg.add_row();
        dlg.add_textarea("周六支持", "ZLZC");
        dlg.add_textarea("周一支持", "ZYZC");

        dlg.add_row();
        dlg.add_textarea("负责人及联系电话", "FZRLXFS");
        dlg.add_textarea("金仕达参与人要求", "CYRYQ");

        dlg.add_row();
        if (mode == 1 || mode == 2) required = true;
        dlg.add_textarea("本次升级情况", "BCSJQK", "本次升级的重要功能和测试关注点，提前先想好写好，以免到时遗漏", "升级测试前必填项，没有请写‘无’", required);
        dlg.add_textarea("关联系统测试情况", "GLXTCSQK", "关联的系统和外部模块", "升级测试前必填项，没有请写‘无’", required);

        required = false;
        if (mode == 2) required = true;
        dlg.add_row();
        dlg.add_textarea("业务部门测试情况", "YWBMCSQK", "升级后存在的问题", "升级测试后必填项，没有请写‘无’", required);
        dlg.add_textarea("后续处理方案", "HXCLFA", "升级后存在问题的后续处理方案", "升级测试后必填项，没有请写‘无’", required);


        dlg.set_dialog_vertical_center();
        return dlg;
    }
    $(".ZMSJAP .opt-area .add").click(function(){
        var dlg = CreateDialog();

        dlg.confirn_handler = function() {
            var keys = "", values = "", i=0;
            for(i=1; i<TABLE_CONF.columns.length-1; i++) {
                var key = TABLE_CONF.columns[i].field;
                var value = dlg.get_value_by_class(key);
                keys += key+",";
                values += "'"+value+"',";
                /*如果有必填字段为空就立马提示出来 */
                if (dlg.is_required_field_empty(key)) {
                    alert("必填项不能为空，请按照规则来填写信息内容。");
                    return false;
                }
            }
            var sql = "INSERT INTO zmsjap("+keys.substring(0, keys.length-1)+") VALUES("
                    + values.substring(0, values.length -1)+")";

            var param = {};
            param['method'] = "UPDATE";
            param['SQL'] = sql;
            sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
                if (d.ErrCode != 0) {
                    alter(d.msg);
                    return false;
                }
                var d1 = HDialog();
                d1.show();
                d1.set_info_msg("成功", "添加成功");
                d1.cancle_handler = d1.confirn_handler = function() {
                    if (ZMSJAP_SQL_QUERY_CONDITION.length > 0) 
                        query(ZMSJAP_SQL_QUERY_CONDITION);
                    else
                        query();
                }
            });
            return true;
        }
    });

    $(".ZMSJAP .opt-area .upt").click(function() {
        var row = ZMSJAP_TABLE.get_selected_row();
        if (row == null) {
            ErrMsg("提示", "请选择需要修改的行!");
            return;
        }

        /*取记录的添加日期*/
        var upt_date = row[row.length-2];
        var nowd = new Date();
        var arr = nowd.GetWeekStartAndEndDate();
        var mode = 1;
        if (upt_date < arr[0]) mode = 2;

        var pred = nowd.DateAdd("w", -1);
        var parr = pred.GetWeekStartAndEndDate();
        // if (upt_date < parr[0]) {
        //     ErrMsg("提示", "请不要修改一个星期之前的数据!");
        //     return;
        // }

        var dlg = CreateDialog("修改安排", mode);
        var columns = TABLE_CONF.columns, i=0;
        for(i=1; i<columns.length-1; i++) {
            var value = row[i];
            var key = columns[i].field;
            dlg.set_value_by_class(key, value);
        }

        dlg.confirn_handler = function() {
            var row = ZMSJAP_TABLE.get_selected_row();
            var cols = TABLE_CONF.columns;
            var sql = "UPDATE zmsjap SET ";
            var i=0;
            for (i=1; i<cols.length-1; i++) {
                var key = cols[i].field;
                var val = dlg.get_value_by_class(key);
                sql += key + "='" + val + "',";
                /*如果有必填字段为空就立马提示出来 */
                if (dlg.is_required_field_empty(key)) {
                    alert("必填项不能为空，请按照规则来填写信息内容。");
                    return false;
                }
            }
            sql = sql.substring(0, sql.length - 1);
            sql += " WHERE ID = " + row[0];

            var param = {};
            param['method'] = "UPDATE";
            param['SQL'] = sql;
            sync_post_data("/exec_native_sql/", JSON.stringify(param), function(d){
                if (d.ErrCode != 0) {
                    alter(d.msg);
                    return false;
                }
                ErrMsg("成功", "更新成功!");
                if (ZMSJAP_SQL_QUERY_CONDITION.length > 0) 
                    query(ZMSJAP_SQL_QUERY_CONDITION);
                else
                    query();
            });
            return true;
        }
    });
    
    $(".ZMSJAP .opt-area .exp").click(function() {
        if(getExplorer()=='ie') {
            alert("不支持IE导出！");
        } else {
            tableToExcel(ZMSJAP_TABLE.Parent.html());
        }
    });
}

