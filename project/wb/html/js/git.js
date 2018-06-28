/*后台访问地址url设定*/
var HOST_URL = "http://127.0.0.1:6008";
var SessionID = '';
var ID_OF_SETINTERVAL = 0;
var GIT_CUR_BRANCH = '';

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

function hcookie(key, value){
    var KEY = "GIT_HYL_2018092345643322";
    if (key && value){
        /*SET*/
        var dict = $.cookie(KEY);
        if (dict)
            dict = $.parseJSON(dict);
        else
            dict = dict || {}
        dict[key] = value
        var data = JSON.stringify(dict);
        $.cookie(KEY, data, { expires: 1 });
        return true;
    }
    else if (key && !value){
        /*GET*/
        var data = $.cookie(KEY);
        if (!data) return data;
        var dict = $.parseJSON(data);
        if (!dict) return dict;
        return dict[key];
    }
    return false;
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
    $("#level2 .head .left").text(str);

    $("#level2 .submit .row1 .back-user").val("back");
    $("#level2 .submit .row1 .back-pwd").val("back");

    var param = {};
    param.sid= SessionID;
    get_data("GitGetInitInfo", param, function(d){
        if (d.ErrCode != 0){
            alert(d.msg);
            return;
        }
        branch = d.GitBranch;
        var tmp = "当前分支: "+branch.current;
        GIT_CUR_BRANCH = branch.current;
        $("#level2 .head .right").text(tmp);

        var obj = $("#level2 .submit .row2 .branchs select");
        obj.html("");
        for (i in branch.local){
            var b = branch.local[i];
            obj.append( $("<option></option>").text(b).addClass('local') );
        }
        for (i in branch.remote){
            var b = branch.remote[i];
            obj.append( $("<option></option>").text(b).addClass('remote') );
        }
        obj.val(GIT_CUR_BRANCH);
    });

    $("#level2 .submit .upt-branch").unbind();
    $("#level2 .submit .upt-branch").click(function(event) {
        var param = {};
        param.sid= SessionID;
        get_data("GitPullAndFetch", param, function(d){
            if (d.ErrCode != 0){
                alert(d.msg);
                return;
            }
            branch = d.GitBranch;
            var obj = $("#level2 .submit .row2 .branchs select");
            obj.html("");
            for (i in branch.local){
                var b = branch.local[i];
                obj.append( $("<option></option>").text(b).addClass('local') );
            }
            for (i in branch.remote){
                var b = branch.remote[i];
                obj.append( $("<option></option>").text(b).addClass('remote') );
            }
            obj.val(GIT_CUR_BRANCH);
        });
    });

    $("#level2 .submit .row2 .branchs select").unbind();
    $("#level2 .submit .row2 .branchs select").change(function(event) {
        changeBranch = $(this).val();
        var param = {};
        param.sid= SessionID;
        param.branch = changeBranch;

        get_data("GitChangeBranch", param, function(d){
            if (d.ErrCode != 0) {
                alert(d.msg);
                return;
            }
            GIT_CUR_BRANCH = changeBranch;
            $("#level2 .head .right").text("当前分支: "+GIT_CUR_BRANCH);
        });

    });

    $("#level2 .submit .row3 .show-commits").unbind();
    $("#level2 .submit .row3 .show-commits").click(function(event) {
        $("#level3").show();
        var param = {};
        param.sid= SessionID;
        param.count = 100;
        param.skip = 0;

        get_data("GitLogSnippet", param, function(d){
            if (d.ErrCode != 0){
                alert(d.msg);
                return;
            }
            logs = d.logs;

            var obj = $("#level3 .gitlog .table-body table tbody");
            obj.html("");
            for (i in logs) {
                log = logs[i];
                var tr = $("<tr></tr>").attr('id', log.hexsha).attr("files", log.files);
                var to = $("<div></div>").text(log.author.split(' ')[0]).css("width", "70px").css('overflow', 'hide');
                tr.append( $("<td></td>").append(to).attr('align', 'left') );

                to = $("<div></div>").text(log.date.substring(0,19)).css("width", "140px").css('overflow', 'hide');
                tr.append( $("<td></td>").append(to).attr('align', 'left') );

                to = $("<div></div>").text(log.message).css("width", "764px").css('overflow', 'hide')
                    .attr('title', log.message);
                tr.append( $("<td></td>").append(to) );
                obj.append(tr);
            }

            obj.find("tr").click(function(event) {
                obj.find("tr.selected").removeClass('selected');
                $(this).addClass('selected');

                $("#level3 .gitlog .wrap1 .detail").text('');
                $("#level3 .gitlog .wrap1 .detail").text($(this).attr("files"));
            });
        });
    });

    $("#level2 .submit .row3 .start-upgrade").unbind();
    $("#level2 .submit .row3 .start-upgrade").click(function(event) {
        /*获取远程配置信息*/
        var param = {};
        param.sid= SessionID;
        param.type = type;
        

    });

    $("#level3 .gitlog .wrap1 .submit .yes").unbind();
    $("#level3 .gitlog .wrap1 .submit .yes").click(function(event) {
        var id = $("#level3 .gitlog .table-body table tbody tr.selected").attr("id");
        $("#level2 .submit .row3 .icommit").val(id);
        $("#level3").hide();
    });


}

function InitLevel1(){
    $("#level1").show();
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
                hcookie("SessionID", SessionID);
                InitLevel1();
                clearInterval(ID_OF_SETINTERVAL);
                $("#level1").hide();
                InitLevel2(param.id, title);
                hcookie("Level2Title", param.id+"|"+title);
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
    SessionID = hcookie("SessionID");
    var tmp = hcookie("Level2Title");
    if (!tmp){
        InitLevel1();
        ID_OF_SETINTERVAL = setInterval(InitLevel1, 5000);
    } else {
        var arr = tmp.split("|");
        InitLevel2(arr[0], arr[1]);
    }
    
    winResize();
    window.onresize = winResize;

});