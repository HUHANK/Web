/*后台访问地址url设定*/
var HOST_URL = "http://127.0.0.1:6008";

function get_data(path, param, func) {
    str = ""
    for (key in param){
        str = str + key + "="+ param[key]+"&"
    }
    str = str.trim("&", "right");
    url = HOST_URL+"/"+path+"?"+str;
    url = encodeURI(url);
    //$.get(url, func);
    $.ajax({
        url:    url,
        async:  false,
        type:   "GET",
        success: func,
        dataType: "json"
    });
}

function genLevel1Unit(d){
    var _div = "<div></div>";
    var unit = $(_div).addClass('unit');
    var tmp = $(_div).text(d.id);
    tmp = $(_div).append(tmp);
    unit.append(tmp);
    unit.append($(_div).text(d.GitType));

    if (d.isBusy) unit.addClass('busy');
    else unit.addClass('unbusy');

    $("#level1").append(unit);
}

function InitLevel1(){
    get_data("queryallgit", {}, function(data){
        console.info(data);
        if (data.ErrCode != 0) {
            alert(data.msg);
        }
        data = data.data;
        for( i in data) {
            var ele = data[i];
            genLevel1Unit(ele);
        }

    })
}

function winResize() {
    wheight = $(window).height();
    wwidth = $(window).width();

    $("#level1").width(wwidth-1);
    $("#level1").height(wheight-1);
}

jQuery(document).ready(function($) {
    InitLevel1();
    winResize();
    window.onresize = winResize;

});