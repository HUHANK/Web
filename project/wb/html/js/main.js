window.onload = main;


function main() {

	init();

	$("#pre-page").click(function(event) {
		/* Act on the event */
		turn_pre_page();
	});
	$("#next-page").click(function(event) {
		/* Act on the event */
		turn_next_page();
	});

	$(".head .btn").click(function(event) {
		// console.info($(this).offset().top);
		// console.info($(this).offset().left);
		// console.info(parseInt($(this).css('width')));
		// console.info(parseInt($(this).css('height')));
		draw_drop_down_box(
			$(this),
			$(this).offset().top+parseInt($(this).css('height')), 
			$(this).offset().left,
			200,
			200 );
	});

	turn_next_page();

	console.info($.parseJSON(SysModules));
}

function init() {
	$.cookie("now-page-no", null);
}

function draw_drop_down_box(obj, top, left, width, height) {
	$(".drop-down-box").css({
		'display': 'block',
		'background': '#88D2A5',
		'position': 'fixed',
		'top': top+"px",
		'left': left+"px",
		'width': width+'px',
		'height': height+'px'
	});
	var id = obj.parent().attr('id');
	var data;
	if (id === 'sys-module') {
		data = SysModules;
	}
	if (id === 'style') {
		data = Types;
	}
	if (id === 'property') {
		data = Propertys;
	}
	if (id === 'emp') {
		data = EmpNames;
	}
	data = $.parseJSON(data);
	//console.info(data);
	var html = "";
	for( var i=0; i<data.length; i++){
		html = html + "<label>"+data[i][0]+"</label>";
	}
	
	$(".drop-down-box .dhead").html(html);
	var label = $(".drop-down-box .dhead label");
	label.attr("class", "drop-down-box-head-lab");
	label.css("margin", "5px");
	label.click(function(event) {
		var vl = $(this).attr("value");
		if (typeof(vl) == "undefined" || vl == 'N') {
			$(this).attr("value", "Y");
			$(this).css("background", "#25E5D5");
			$(this).css("font-weight", "bold");
		}else{
			$(this).css("background", "");
			$(this).attr("value", "N");
			$(this).css("font-weight", "");
		}
		//console.info($(this).text());
		// vl = obj.prev("input").val();
		// if (vl.length == 0){
		// 	vl = $(this).text();
		// }else {
		// 	var sear = new RegExp($(this).text());
		// 	if (!sear.test(vl)) {
		// 		vl = vl +","+$(this).text();
		// 	}
		// }
		// obj.prev("input").val(vl);
	});

	$(".dbottom-btn").click(function(event) {
		$(".drop-down-box").css('display', 'none');
		var val = $(this).attr('value');
		if (val === 'cancle') {

		}else if(val === 'ok') {
			
		}
	});
}

function turn_pre_page() {
	var no = $.cookie("now-page-no");
	if (isNaN(no) || typeof(no)=="undefined" || !no ) return;
	if (no === "1") {
		alert("已经是首页");
		return;
	}
	no = parseInt(no);
	no = no - 1;
	$.cookie("now-page-no", no);

	var params = new Object();
	params.page = no;
	params.page_size = 20;
	getUrlData("/test/", JSON.stringify(params), getWeekReports);
}

function turn_next_page() {
	
	var no = $.cookie("now-page-no");
	console.info(no);
	if (isNaN(no) || typeof(no)=="undefined" || !no ) 
		no = "0";
	no = parseInt(no);
	no = no + 1;
	$.cookie("now-page-no", no+'', {expires: 7});


	console.info($.cookie("now-page-no"));
	var params = new Object();
	params.page = no;
	params.page_size = 20;
	getUrlData("/test/", JSON.stringify(params), getWeekReports);
}



function getWeekReports(data) {
	data = $.parseJSON(data);
	var headers = new Array();
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

	grid($(".body"), data.field_count, data.total, headers, data.datas);
}

function getUrlData(path, data, func) {
	console.info(data);
	var surl = "http://127.0.0.1:5000";
	var u = surl + path;
	$.post(u, data, func);
}

function grid(obj, cols, rows, headers, datas) {
	var thead = "<thead><tr>";
	var i = 0;
	var k = 0;
	for (i=0; i<cols; i++) {
		thead = thead + "<th>" + headers[i] + "</th>";
	}
	thead = thead + "</tr></thead>"

	var tbody = "<tbody>"
	for (i=0; i<rows; i++) {
		tbody = tbody + "<tr>";
		for (k = 0; k<cols; k++) {
			tbody = tbody + "<td>" + datas[i][k] + "</td>";
		}
		tbody = tbody + "</tr>";
	}
	tbody = tbody + "</tbody>";

	var html = "<table>" + thead + tbody + "</table>";

	$(obj).html(html);
}