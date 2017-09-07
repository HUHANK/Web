window.onload = main;

Options = new Object();
var NavbarIndexCookies = "HTZQ_NavbarIndex";

function main() {
	Options.SeesionID = $.cookie("htzq_SessionID");
	GInit();
	var index = $.cookie(NavbarIndexCookies);
	if (typeof index == "undefined") 
		index = 1;
	initNavbar(index);
	navbar();
	//query();
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
}

function initNavbar(index){
	console.info(typeof index);
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
		console.info($(this).attr("value"));
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
	sidebar();
}

function sidebar() {
	$(".query .sidebar .yj").click(function() {
		var ej = $(this).next();
		if (ej.css("display") == "block"){
			ej.css("display", "none");
		}else {
			ej.css("display", "block");
		}
	});

	$('.query .sidebar .ej span[style="all"]').click(function() {
		if ($(this).attr("class") == "sel") {
			$(this).removeClass("sel");
			$(this).siblings().each(function(index, data){
				$(data).removeClass("select");
			});
		} else {
			$(this).addClass("sel");
			$(this).siblings().each(function(index, data){
				$(data).addClass("select");
			});
		}
	});
	$('.query .sidebar .ej span[style="unit"]').click(function() {
		if ($(this).attr("class") == "select") {
			$(this).removeClass("select");
		} else {
			$(this).addClass("select");
		}
	});
}

function data_protect(){
	update_sjwh_dict();
}

function update_sjwh_dict(){
	//获取系统说明列表
	var pam = new Object();
	pam.method = "GET";
	sync_post_data("/dict", JSON.stringify(pam), function(d) {
		console.info(d);
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
			console.info($(this).attr("class"));
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
	sync_post_data("/dict", JSON.stringify(pam), function(d) {
		Options.Dicts = d;
	});
	
	draw_drop_down_box_select($(".add-zb .edit .sx .xtmk"), Options.Dicts.SysModule.data);
	draw_drop_down_box_select($(".add-zb .edit .sx .lx"), Options.Dicts.Type.data);
	draw_drop_down_box_select($(".add-zb .edit .sx .xz"), Options.Dicts.Property.data);

	
	$(".add-zb .edit .btn-submit").click(add_zb_btn_submit);
}

function add_zb_update() {
	var param = new Object();
	param.SessionID = Options.SeesionID;
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
	param.Notes = $(".add-zb .edit .bz input").val();
	param.SessionID = Options.SeesionID;

	if ($(this).attr("class") == "btn-submit") {
		param.method = "ADD";
		console.info(param);
		sync_post_data("/report/", JSON.stringify(param), function(d) {
			console.info(d);
		});
	}
	add_zb_update();
}

function home_page() {
	var param = new Object();
	param.SessionID = Options.SeesionID;
	post_data("/home/", JSON.stringify(param), function(d) {
		d = $.parseJSON(d);
		d = d.bzgz;
		console.info(d);
		if (d.data.length>0)
			draw_table($(".home-page .wdbzgz"), d.header, d.data);
		else{
			$(".home-page .wdbzgz").html("<span>暂无记录</span>")
		}
	});
}








































