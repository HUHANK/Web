
function draw_table(obj, headers, datas) {
	
	var cols = headers.length;
	var rows = datas.length;
	var i = 0;
	var k = 0;

	/*thead*/
	var thead = "<thead><tr>";
	for (i=0; i<cols; i++) {
		thead = thead + "<th>" + headers[i] + "</th>";
	}
	thead = thead + "</tr></thead>";
	/*tbody*/
	var tbody = "<tbody>"
	for (i=0; i<rows; i++) {
		tbody = tbody +"<tr>";
		for (k=0; k<cols; k++) {
			tbody = tbody + "<td>" + datas[i][k] + "</td>";
		}
		tbody = tbody + "</tr>";
	}
	tbody = tbody + "</tbody>";

	var html = "<table>" + thead + tbody + "</table>";
	$(obj).html(html);
	$(obj).children("table").children("tbody").children("tr").each(function(index, data){
		if (index % 2 == 0) {
			//$(data).css("background-color", "#F6F7F8");
			$(data).addClass("jjss");
		}
	});
}

function draw_drop_down_box_select(obj, datas) {
	var shtml = "<select>";
	for( var i=0; i<datas.length; i++ ){
		shtml = shtml + "<option>" + datas[i] + "</option>";
	}
	shtml = shtml + "</select>";
	$(obj).html(shtml);
}


var HostUrl = "http://127.0.0.1:5001";

function post_data(path, data, func) {
	var surl = HostUrl;
	var u = surl + path;
	$.post(u, data, func);
}

function sync_post_data(path, data, func) {
	var surl = HostUrl;
	var u = surl + path;
	$.ajax({
		url: 	u,
		async: 	false,
		type: 	"POST",
		data: 	data,
		success: func,
		dataType: "json"
	});
}

//将一维数组转成二维数组
function array_1d22d(arr) {
	var ret = [];
	for (var i=0; i<arr.length; i++) {
		ret[i] = [];
		ret[i][0] = arr[i];
	}
	return ret;
}