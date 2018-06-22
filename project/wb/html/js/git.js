/*后台访问地址url设定*/
var HOST_URL = "http://127.0.0.1:6008";
var SessionID = '';
var ID_OF_SETINTERVAL = 0;

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
    var tmp = $(_div).text(d.id).addClass('id');
    tmp = $(_div).append(tmp);
    unit.append(tmp);
    unit.append($(_div).text(d.GitType).addClass('title'));

    if (d.isBusy) unit.addClass('busy');
    else unit.addClass('unbusy');

    $("#level1").append(unit);
}

function InitLevel2(id, type){
    $("#level2").show();
    var str = "";
    if (type == "JZJY") {
        str = "集中交易升级  ID:"+id;
    }else if (type == "RZRQ") {
        str = "融资融券升级  ID:"+id;
    }
    $("#level2 .head").text(str);
}

function InitLevel1(){
    $("#level1").html("");
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

        $("#level1 .unit").unbind();
        $("#level1 .unit").click(function(event) {
            if ($(this).hasClass('busy')) {
                alert("该环境正在繁忙，请选择其他不繁忙的环境!")
                return;
            }
            var param = {};
            param.id = $(this).find(".id").text();
            title = $(this).find(".title").text();
            get_data("request", param, function(d){
                if (d.ErrCode != 0){
                    alert(d.msg);
                    return;
                }
                SessionID = d.sid;
                InitLevel1();
                clearInterval(ID_OF_SETINTERVAL);
                $("#level1").hide();
                InitLevel2(param.id, title);
            });
        });
    })
}

function winResize() {
    wheight = $(window).height();
    wwidth = $(window).width();

    $("#level1").width(wwidth-1);
    $("#level1").height(wheight-1);
}

jQuery(document).ready(function($) {
    InitLevel2(2345,'JZJY');
    //InitLevel1();
    ID_OF_SETINTERVAL = setInterval(InitLevel1, 2000);
    winResize();
    window.onresize = winResize;

});