window.onload = main;

Options = new Object();
var NavbarIndexCookies = "HTZQ_NavbarIndex";

function main() {
	Options.SeesionID = $.cookie("htzq_SessionID");
	var index = $.cookie(NavbarIndexCookies);
	if (typeof index == "undefined") 
		index = 1;
	initNavbar(index);
	navbar();
	//query();
}

function initNavbar(index){
	console.info(typeof index);
	index = parseInt(index)
	switch(index)
	{
		case 1:
			$(".body .home-page").css("display", "block");

			break;
		case 2:
			$(".body .query").css("display", "block");

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
		//console.info(i);
		//console.info($(data));
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
		} else if (value == "Query"){
			$(".body .query").css("display", "block");

			$(".body .home-page").css("display", "none");
			$(".body .sjwh").css("display", "none");
			$(".body .add-zb").css("display", "none");
			$.cookie(NavbarIndexCookies, 2);
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

	var headers = [];
	var i = 0;
	headers[i++] = "ID";
	headers[i++] = "系统模块";
	headers[i++] = "类型";
	headers[i++] = "跟踪号";
	headers[i++] = "工作内容";
	headers[i++] = "性质";
	headers[i++] = "人员";
	headers[i++] = "进度";
	headers[i++] = "开始日期";
	headers[i++] = "后续人日";
	headers[i++] = "备注";

	var datas = $.parseJSON(TDatas);

	draw_table($(".body .query .result"), headers, datas);
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
	/*初始化日历控件*/
	jeDate.skin('gray');
	jeDate({
		dateCell:"#dateinfo",//isinitVal:true,
		format:"YYYY-MM-DD",
		isTime:false, //isClear:false,
		isinitVal:true,
		minDate:"2014-10-19 00:00:00",
		maxDate:"2018-11-8 00:00:00"
	})

	/*获取字典信息*/
	var pam = new Object();
	pam.method = "GET";
	sync_post_data("/dict", JSON.stringify(pam), function(d) {
		console.info(d);
		Options.Dicts = d;
	});
	
	draw_drop_down_box_select($(".add-zb .edit .sx .xtmk"), Options.Dicts.SysModule.data);
	draw_drop_down_box_select($(".add-zb .edit .sx .lx"), Options.Dicts.Type.data);
	draw_drop_down_box_select($(".add-zb .edit .sx .xz"), Options.Dicts.Property.data);
}











































