window.onload = main;


function main() {
	//resize
	resize();
	window.onresize = resize;
	//init
	initTitle();

	getUrlData("/test/", "", test);
}


function getUrlData(path, data, func) {
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
	console.info(obj);
}

function test(data) {
	console.log("-------------------------------------------------------START");
	
	data = $.parseJSON(data);
	console.info(data);
	var headers = new Array();
	for(var i=0; i<data.field_count; i++) {
		headers[i] = data.fields[i].name;
	}
	console.info(headers);

	grid($("#iframe_right"), data.field_count, data.total, headers, data.datas);
	
	console.log("-------------------------------------------------------  END");
}

function resize() {
	var bodyWidth = document.body.clientWidth;
	var leftWidth = 80;
	var leftHeight = 700;
	var topHeight = 40;
	var rightHeight = leftHeight - topHeight;

	$("#iframe_left").css({
		width: leftWidth,
		height: leftHeight
	});

	$("#iframe_top").css({
		width: (bodyWidth - leftWidth),
		height: topHeight
	});

	$("#iframe_right").css({

		width: (bodyWidth - leftWidth),
		height: rightHeight
	});

}

function initTitle() {
	var ifr_left_div_bcolor = '#FFFFFF';
	var mouse_over_color = '#A8B3FC';

	$("#iframe_left_div").css({
		'background-color': ifr_left_div_bcolor
	});
	$("#iframe_left div").mouseover(function(event) {
		/* Act on the event */
		$(this).css({
			'background-color': mouse_over_color
		});
	});
	$("#iframe_left div").mouseout(function(event) {
		/* Act on the event */
		$(this).css({
			'background-color': ifr_left_div_bcolor	
		});
	});
}



function getConfig(Key1, Key2) {

}




































