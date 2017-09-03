window.onload = main;


function main() {
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














































