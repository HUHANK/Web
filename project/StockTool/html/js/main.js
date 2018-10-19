$(document).ready(function() {
    NavbarInit();
    hanqInit();
    
});



/*导航栏条的初始化*/
function NavbarInit() {
    $(".head > nav > a").click(function(event) {
        $(".head > nav > a.active").removeClass('active');
        $(this).addClass('active');
    });
}

/*行情界面初始化*/
function hanqInit() {
    var param = new Object();
    param.method = "get_stock_basics";
    res = sync_post_data(param);
    console.info(res);

    var tconf = new Object();
    tconf.obj = $("#hanq .show");
    tconf.datas = res;
    tconf.isPage = true;
    tconf.pageSize = 40;
    tconf.columns = [
        {name: "代码",        field: "code",          width: "50", align: "center"},
        {name: "名称",        field: "name",          width: "60", align: "center"},
        {name: "所属行业",     field: "industry",       width: "60", align: "center"},
        {name: "地区",        field: "area",          width: "", align: "center"},
        {name: "市盈率",       field: "pe",            width: "", align: "left"},
        {name: "流通股本(亿)", field: "outstanding",     width: "", align: "left"},
        {name: "总股本(亿)",    field: "totals",        width: "", align: "left"},
        {name: "总资产(万)",    field: "totalAssets",   width: "70", align: "left"},
        {name: "流动资产",      field: "liquidAssets",  width: "70", align: "left"},
        {name: "固定资产",      field: "fixedAssets",   width: "70", align: "left"},
        {name: "公积金",       field: "reserved",      width: "70", align: "left"},
        {name: "每股公积金",     field: "reservedPerShare", width: "", align: "left"},
        {name: "每股收益",      field: "esp",           width: "", align: "left"},
        {name: "每股净资",      field: "bvps",          width: "", align: "left"},
        {name: "市净率",       field: "pb",            width: "", align: "left"},
        {name: "上市日期",      field: "timeToMarket", width: "70", align: "left"},
        {name: "未分利润",      field: "undp",          width: "70", align: "left"},
        {name: "每股未分配",     field: "perundp",       width: "", align: "left"},
        {name: "收入同比(%)",   field: "rev",           width: "", align: "left"},
        {name: "利润同比(%)",   field: "profit",        width: "", align: "left"},
        {name: "毛利率(%)",    field: "gpr",           width: "", align: "left"},
        {name: "净利润率(%)",   field: "npr",           width: "", align: "left"},
        {name: "股东人数",      field: "holders",       width: "", align: "left"}
    ]; 

    var tab1 = createTable(tconf);
}







/*#################################基础的共用函数######################################*/
function post_data(data, func, path="stock.py") {
    $.post(path, data, func);
}
function sync_post_data(data, path="stock.py") {
    var ret = false;
    $.ajax({
        url: path,
        async: false,
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(data),
    })
    .done(function(d) {
        //console.log("success");
        if (d.ErrCode) {
            console.error(d.ErrMsg);
        }else{
            ret = $.parseJSON(d.ret_data); 
        }
    })
    .fail(function(data, type, err) {
        console.error("ajax错误类型: "+type);
        console.error(err);
    })
    .always(function() {
        console.log("complete");
    });

    return ret;
}


function createTable(conf) {
    this.obj    = conf.obj;
    this.datas  = conf.datas;
    this.height = conf.height;
    this.columns= conf.columns;
    this.isPage = conf.isPage;
    this.pageSize = conf.pageSize;
    this.N      = 0;
    this.pageN  = 1;
    this.col_names = [];
    this.col_fields = [];
    this.col_widths = {};
    this.col_aligns = {};

    for ( i=0; i<this.columns.length; i++) {
        var el = this.columns[i];
        this.col_names.push(el.name);
        this.col_fields.push(el.field);
        this.col_widths[el.field] = el.width;
        this.col_aligns[el.field] = el.align;
    }

    /*HEAD*/
    var tr = $("<tr></tr>");
    for (i=0; i<this.columns.length; i++) {
        var col = this.columns[i];
        var th = $("<th></th>").text(col.name).addClass(col.field);
        tr.append(th);
    }    
    var table = $("<table></table>");
    table.css({
        "font-size": '12px'
    });
    table.append($("<thead></thead>").append(tr));

    /*TBODY*/
    if (!this.isPage) this.pageSize = this.datas.length;

    var tbody = $("<tbody></tbody>");
    for(code in this.datas) {
        var data = this.datas[code];
        var tr = $("<tr></tr>");
        for(var i=0; i<this.columns.length; i++) {
            var col = this.columns[i];
            var td = "";
            if (col.field == "code")
                td = $("<td></td>").addClass("code").text(code).attr("width", col.width).attr("align", col["align"]);
            else
                td = $("<td></td>").addClass(col.field).text(data[col.field]).attr("width", col.width).attr("align", col.align);
            tr.append(td);
        }
        tbody.append(tr);
        this.N++;
        if (this.N % this.pageSize == 0) break;
    }
    table.append(tbody);

    $(this.obj).append(table);

}