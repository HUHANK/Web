window.onload = main;

Options = new Object();

function main() {
	Options.SeesionID = $.cookie("htzq_SessionID");
	//console.info(window.Options);
	data_protect();
	navbar();
	query();
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
			
			$(".body .query").css("display", "none");
		} else if (value == "Query"){
			$(".body .query").css("display", "block");

			$(".body .home-page").css("display", "none");
		} else if (value == "WZB") {
			$(".body .home-page").css("display", "none");
			$(".body .query").css("display", "none");
		} else if (value == "SZWH") {
			$(".body .home-page").css("display", "none");
			$(".body .query").css("display", "none");
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














































