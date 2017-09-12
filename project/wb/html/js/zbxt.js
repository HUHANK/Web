window.onload = main;

Options = new Object();
var NavbarIndexCookies = "HTZQ_NavbarIndex";

function main() {
	Options.SessionID = $.cookie("htzq_SessionID");
	GInit();
	InitHeader();
	var index = $.cookie(NavbarIndexCookies);
	if (typeof index == "undefined") 
		index = 1;
	initNavbar(index);
	navbar();
}

function InitHeader() {
	var param = new Object();
	param.SessionID = Options.SessionID;
	post_data("/baseinfo/", JSON.stringify(param), function(d) {
		d = $.parseJSON(d);
		var txt = "你好，" + d.UserName + "！";
		$(".header .subhead .yhxs").text(txt);

		txt = d.Date + "(第" + d.Week + "周)";
		$(".header .subhead .rqxs").text(txt);

	});
}

function GInit(){
	/*初始化日历控件*/
	jeDate.skin('gray');
	jeDate({
		dateCell:"#dateinfo",//isinitVal:true,
		format:"YYYY-MM-DD",
		isTime:false, //isClear:false,
		isinitVal:true,
		minDate:"2014-10-19 00:00:00",
		maxDate:"2020-11-8 00:00:00"
	})
	/*动态加载CSS文件*/
	$("<link>").attr({ rel: "stylesheet",type: "text/css",href: "css/zbxt.css"}).appendTo("head");

	Options.QueryCondition = new Object();
	Options.QueryCondition.User = [];
	Options.QueryCondition.SysModule = [];
	Options.QueryCondition.Property = [];
	Options.QueryCondition.Type = [];
	Options.QueryCondition.Page = 0;
	Options.QueryCondition.PageSize = 25;
}

function initNavbar(index){
	index = parseInt(index)
	switch(index)
	{
		case 1:
			$(".body .home-page").css("display", "block");
			home_page();
			break;
		case 2:
			$(".body .query").css("display", "block");
			query();
			break;
		case 3:
			$(".body .add-zb").css("display", "block");
			add_zb();
			break;
		case 4:
			$(".body .sjwh").css("display", "block");
			data_protect();
			break;
	}
	$(".title .navbar ul li").each(function(i, data){
		if (i+1 == index) {
			$(data).addClass("clicked");
		}
	});
}

function navbar() {
	$(".navbar ul li").click(function(){
		//删除li的所有的class
		$(".navbar ul").children("li").each(function(index, data){
			$(data).removeClass("clicked");
		});
		//添加clicked的class
		$(this).addClass("clicked");
		var value = $(this).attr("value");
		if (value == "HomePage") {
			$(".body .home-page").css("display", "block");
			
			$(".body .add-zb").css("display", "none");
			$(".body .query").css("display", "none");
			$(".body .sjwh").css("display", "none");
			$.cookie(NavbarIndexCookies, 1);
			home_page();
		} else if (value == "Query"){
			$(".body .query").css("display", "block");

			$(".body .home-page").css("display", "none");
			$(".body .sjwh").css("display", "none");
			$(".body .add-zb").css("display", "none");
			$.cookie(NavbarIndexCookies, 2);
			query();
		} else if (value == "WZB") {
			$(".body .add-zb").css("display", "block");

			$(".body .home-page").css("display", "none");
			$(".body .query").css("display", "none");
			$(".body .sjwh").css("display", "none");
			$.cookie(NavbarIndexCookies, 3);
			add_zb();
		} else if (value == "SZWH") {
			$(".body .sjwh").css("display", "block");

			$(".body .home-page").css("display", "none");
			$(".body .query").css("display", "none");
			$(".body .add-zb").css("display", "none");
			$.cookie(NavbarIndexCookies, 4);
			data_protect();
		}

	});
}

function query() {
	$(".query .result .ztl button").click(function(){
		var pageIndex = parseInt($(".query .result .ztl .pageIndex").text());
		var totalPage = parseInt($(".query .result .ztl .totalPage").text());
		if ($(this).attr("value") == "pre") {

			if (pageIndex <= 1) {
				alert("已经是第一页");
				return;
			} else {
				pageIndex = pageIndex - 1;
			}
		}
		else if ($(this).attr("value") == "next") {
			if (pageIndex >= totalPage) {
				alert("已经是最后一页");
				return ;
			} else {
				pageIndex = pageIndex + 1;
			}
		}
		query_update_data(pageIndex - 1);
	});
	sidebar();
}

function sidebar() {
	var param = new Object();
	param.method = "GET";
	sync_post_data("/dict/", JSON.stringify(param), function(d) {
		Options.Dicts = d;
	});
	
	param.name = "all";
	sync_post_data("/getuserinfo/", JSON.stringify(param), function(d) {
		Options.UserInfo = d;
	});

	function sidebar_add_unit(obj, header, data, n) {
		var shtml = '<div class="yj" name="' + n + '">' + header + '</div>';
		shtml += '<div class="ej" name="' + n + '">';
		shtml += '<span style="all">全选</span>';
		for( var i=0; i<data.length; i++ ) {
			shtml += '<span style="unit">' + data[i] + '</span>';
		}
		shtml += '</div>';
		$(obj).append(shtml);
	}
	var data = [];
	for(var i=0; i<Options.UserInfo.length; i++) {
		data[i] = Options.UserInfo[i][1];
	}
	//$(".query .sidebar").children().remove();
	$(".query .sidebar").html("");
	sidebar_add_unit($(".query .sidebar"), "部门人员", data, "User");

	sidebar_add_unit($(".query .sidebar"), 
				Options.Dicts.SysModule.note, 
				Options.Dicts.SysModule.data,
				"SysModule");
	sidebar_add_unit($(".query .sidebar"), 
				Options.Dicts.Type.note, 
				Options.Dicts.Type.data,
				"Type");
	sidebar_add_unit($(".query .sidebar"), 
				Options.Dicts.Property.note, 
				Options.Dicts.Property.data,
				"Property");
	/*--------------------------------------------------*/

	$(".query .sidebar .yj").click(function() {
		var ej = $(this).next();
		if (ej.css("display") == "block"){
			ej.css("display", "none");
		}else {
			ej.css("display", "block");
		}
	});

	$('.query .sidebar .ej span[style="all"]').click(function() {
		var key = $(this).parent().attr("name");
		if ($(this).attr("class") == "sel") {
			$(this).removeClass("sel");
			$(this).siblings().each(function(index, data){
				$(data).removeClass("select");
				deal_query_condition(1, key, $(data).text());
			});
		} else {
			$(this).addClass("sel");
			$(this).siblings().each(function(index, data){
				$(data).addClass("select");
				deal_query_condition(0, key, $(data).text());
			});
		}
		query_update_data(0);
	});
	$('.query .sidebar .ej span[style="unit"]').click(function() {
		var key = $(this).parent().attr("name");
		if ($(this).attr("class") == "select") {
			$(this).removeClass("select");
			deal_query_condition(1, key, $(this).text());
		} else {
			$(this).addClass("select");
			deal_query_condition(0, key, $(this).text());
		}
		query_update_data(0);
	});

	query_update_data(0);
}

/*type:0 add type:1 delete*/
function deal_query_condition(type, key, value) {
	var qs;
	var NeedQueryBackground = 1;
	if (type == 0) {
		//add
		if ("User" == key) {
			qs = Options.QueryCondition.User;
			/*把用户的中文名转成对应的用户ID*/
			for(var i=0; i<Options.UserInfo.length; i++){
				if(Options.UserInfo[i][1] == value) {
					value = Options.UserInfo[i][0];
				}
			}
		} else if ("SysModule" == key) {
			qs = Options.QueryCondition.SysModule;
		} else if ("Property" == key) {
			qs = Options.QueryCondition.Property;
		} else if ("Type" == key) {
			qs = Options.QueryCondition.Type;
		}
		for(var i=0; i<qs.length; i++) {
			if (qs[i] == value) {
				NeedQueryBackground = 0;
			}
		}
		if (NeedQueryBackground == 1) {
			qs.push(value);
		}
	} else if (type == 1) {
		//delete
		if ("User" == key) {
			qs = Options.QueryCondition.User;
			/*把用户的中文名转成对应的用户ID*/
			for(var i=0; i<Options.UserInfo.length; i++){
				if(Options.UserInfo[i][1] == value) {
					value = Options.UserInfo[i][0];
				}
			}
		} else if ("SysModule" == key) {
			qs = Options.QueryCondition.SysModule;
		} else if ("Property" == key) {
			qs = Options.QueryCondition.Property;
		} else if ("Type" == key) {
			qs = Options.QueryCondition.Type;
		}
		for(var i=0; i<qs.length; i++) {
			if (qs[i] == value) {
				//delete qs[i];
				qs.splice(i, 1);
			}
		}
	}

	

}

function query_update_data(page) {
	var param = Options.QueryCondition;
	param.Page = page;
	post_data("/query1/", JSON.stringify(param), function(d) {
		d = $.parseJSON(d);
		//draw_table($(".query .result .box"), d.header, d.data); 
		$(".query .result .box").html("");

		jeui.use(["jeTable", "jeCheck"], function() {
			$(".query .result .box").jeTable({
				height:"740",
				isPage: false,
				datas: d.rows,
				columnSort:[],
				columns:[
					{name:"ID", 		field:"id", 		width:"40", align: "center", isShow:true, renderer:""},
					{name:"用户名", 		field:"UserName", 	width:"60", align: "center"},
					{name:"系统(模块)",	field:"SysModule", 	width:"140", align: "center"},
					{name:"类型", 		field:"Type", 		width:"70", align: "center"},
					{name:"跟踪号", 		field:"TraceNo", 	width:"60", align: "center"},
					{name:"工作内容", 	field:"Detail", 	width:"300", align: "center"},
					{name:"性质", 		field:"Property", 	width:"70", align: "center"},
					{name:"进度", 		field:"ProgressRate", width:"40", align: "center"},
					{name:"开始日期", 	field:"StartDate", 	width:"100", align: "center"},
					{name:"后续人日", 	field:"NeedDays", 	width:"70", align: "center"},
					{name:"备注", 		field:"Note", 		width:"300", align: "center"}
				],
				itemfun:function(elem, data) {
					elem.on('dblclick', function(event) {
						event.preventDefault();
						/* Act on the event */
					});
				}
			});
		});

		console.info(d);
		$(".query .result .ztl .totalPage").text(d.totalPage);
		$(".query .result .ztl .totalCount").text(d.totalCount);
		$(".query .result .ztl .pageIndex").text(page+1);

	});
	
}

function data_protect(){
	//update_sjwh_dict();
	$(".sjwh .sidebar li").click(function(){
		$(".sjwh .sidebar li").each(function(index, data){
			$(data).removeClass("on");
		});
		$(this).addClass("on");
	});

	jeui.use(["jeCheck"], function(){
		$(".sjwh .wrap .bmgl table").jeCheck({
            jename:"chunk",
            attrName:[false,"勾选"], 
            itemfun: function(elem,bool) {
                console.log(bool)
                //console.log(elem.prop('checked'))
            },
            success:function(elem){
                jeui.chunkSelect(elem,'.sjwh .wrap .bmgl table thead input','on')
                
            }
        })
	});
}

function update_sjwh_dict(){
	//获取系统说明列表
	var pam = new Object();
	pam.method = "GET";
	sync_post_data("/dict", JSON.stringify(pam), function(d) {
		Options.Dicts = d;
	});

	var headers = [];
	headers[0] = Options.Dicts.SysModule.note;
	draw_table($(".sjwh .dict .sysm"), headers, array_1d22d(Options.Dicts.SysModule.data));

	headers[0] = Options.Dicts.Type.note;
	draw_table($(".sjwh .dict .type"), headers, array_1d22d(Options.Dicts.Type.data));

	headers[0] = Options.Dicts.Property.note;
	draw_table($(".sjwh .dict .property"), headers, array_1d22d(Options.Dicts.Property.data));

	var html = '<input type="text" name="">';
	$(".sjwh .dict .sysm").append(html).children("input").addClass('sysm-input');
	$(".sjwh .dict .type").append(html).children("input").addClass('type-input');
	$(".sjwh .dict .property").append(html).children("input").addClass('property-input');

	$(".sjwh .dict div input").keydown(function(event) {
		/* Act on the event */
		if (event.keyCode == 13) {
			var pam = new Object();
			pam.method = "ADD";
			if ($(this).attr("class") == "sysm-input") {
				pam.key = "SysModule";
			} else if ($(this).attr("class") == "type-input") {
				pam.key = "Type";
			} else if ($(this).attr("class") == "property-input") {
				pam.key = "Property";
			}
			pam.value = $(this).val();
			post_data("/dict", JSON.stringify(pam), function(d){});
			update_sjwh_dict();
		}
	});
}


function add_zb() {
	
	$(".add-zb .edit .zq button").click(function(){
		$(this).parent().children().each(function(index, data){
			$(data).removeClass("btn_clicked")
		});
		$(this).addClass('btn_clicked');
	});

	add_zb_update();

	/*获取字典信息*/
	var pam = new Object();
	pam.method = "GET";
	sync_post_data("/dict/", JSON.stringify(pam), function(d) {
		Options.Dicts = d;
	});
	
	draw_drop_down_box_select($(".add-zb .edit .sx .xtmk"), Options.Dicts.SysModule.data);
	draw_drop_down_box_select($(".add-zb .edit .sx .lx"), Options.Dicts.Type.data);
	draw_drop_down_box_select($(".add-zb .edit .sx .xz"), Options.Dicts.Property.data);

	
	$(".add-zb .btn-submit").click(add_zb_btn_submit);
}

function add_zb_update() {
	var param = new Object();
	param.SessionID = Options.SessionID;
	param.method = "GET";
	param.week = 0;
	/*添加本周工作*/
	post_data("/report/", JSON.stringify(param), function(d) {
		d = $.parseJSON(d);
		if (d.data.length>0)
			draw_table($(".add-zb .bzgz"), d.header, d.data);
		else{
			$(".add-zb .bzgz").html("<span>暂无记录</span>")
		}
	});

	/*添加下周工作*/
	param.week = 1;
	post_data("/report/", JSON.stringify(param), function(d) {
		d = $.parseJSON(d);
		if (d.data.length > 0)
			draw_table($(".add-zb .xzgz"), d.header, d.data);
		else {
			$(".add-zb .xzgz").html("<span>暂无记录</span>")
		}
	});
}

function add_zb_btn_submit(event) {
	var param = new Object();
	$(".add-zb .edit .zq button").each(function(index, data){
		if ($(data).attr("class") == "btn_clicked") {
			if ($(data).attr("value") == "now")
				param.week = 0;
			else if ($(data).attr("value") == "next")
				param.week = 1;
		}
	})

	param.SysModule = $(".add-zb .edit .sx .xtmk select").val();
	param.Type = $(".add-zb .edit .sx .lx select").val();
	param.TraceNo = $(".add-zb .edit .sx .gzh input").val();
	param.WorkDetail = $(".add-zb .edit .sx .gzln input").val();
	param.Property = $(".add-zb .edit .sx .xz select").val();
	param.ProgressRate = $(".add-zb .edit .sx .gzjd select").val();
	param.StartDate = $(".add-zb .edit .sx .ksrq input").val();
	param.NeedDays = $(".add-zb .edit .sx .hxrr input").val();
	param.Notes = $(".add-zb .edit .bz textarea").val();
	param.SessionID = Options.SessionID;

	if ($(this).attr("class") == "btn-submit") {
		param.method = "ADD";
		sync_post_data("/report/", JSON.stringify(param), function(d) {
		});
	}
	add_zb_update();
}

function home_page() {
	var param = new Object();
	param.SessionID = Options.SessionID;
	post_data("/home/", JSON.stringify(param), function(d) {
		d = $.parseJSON(d);
		d = d.bzgz;
		if (d.data.length>0)
			draw_table($(".home-page .wdbzgz"), d.header, d.data);
		else{
			$(".home-page .wdbzgz").html("<span>暂无记录</span>")
		}
	});
}








































