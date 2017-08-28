window.onload = main;


function main() {

	$("#pre-page").click(function(event) {
		/* Act on the event */
		turn_pre_page();
	});
	$("#next-page").click(function(event) {
		/* Act on the event */
		turn_next_page();
	});

	turn_next_page();

	$.cookie("AAAA", "huyouliang");
	console.info($.cookie("AAAA"));
}

function turn_pre_page() {
	console.info("AAAAAAAAAA");
	var no = $.cookie("now-page-no");
	if (no == null) return;
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
	console.info("BBBBBBBB");
	var no = $.cookie("now-page-no");
	if (no === "") no = "0";
	no = parseInt(no);
	no = no + 1;
	$.cookie("now-page-no", no+'', {expires: 7});


	console.info($.cookie("now-page-no"));
	var params = new Object();
	params.page = 1;
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