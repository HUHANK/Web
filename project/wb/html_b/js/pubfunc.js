
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


var HostUrl = "http://127.0.0.1:5010";

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


function pop_box1(stitle, w, h, html, succfunc, endfunc) {
	jeui.use(["jquery", "jeBox"], function(){
		jeBox.open({
			title: stitle,
			closeBtn:true,
			maskClose:true,
			boxSize:[w+"px", h+"px"],
			content: html,
			zIndex: 2,
			boxStyle:{
						border:"1px solid #81BA25",
						"border-radius":"4px"
					},
			success:succfunc,
			endfun: endfunc
		});
	});
}

function pop_box(stitle, w, h, html, succfunc, endfunc) {
	// jeui.use(["jquery", "jeBox"], function(){
	// 	jeBox.open({
	// 		title: stitle,
	// 		closeBtn:true,
	// 		maskClose:true,
	// 		boxSize:[w+"px", h+"px"],
	// 		content: html,
	// 		zIndex: 2,
	// 		boxStyle:{
	// 					border:"1px solid #81BA25",
	// 					"border-radius":"4px"
	// 				},
	// 		success:succfunc,
	// 		endfun: endfunc
	// 	});
	// });
	var tb = $("body").children(".hyl-bokeh");
	tb.addClass("hyl-show");

	tb = $("#hyl-popup-box-wrap");
	tb.css({
		"width": w,
		"height": h
	});
	tb.addClass('hyl-show');
	tb.find(".hyl-head .title").text(stitle);
	tb.find(".hyl-main").html(html);

	//var endfun = endfunc;
	// tb.find(".hyl-head button").onclick = function(endfunc) {
	// 	var tb = $("body").children(".hyl-bokeh");
	// 	tb.removeClass("hyl-show");
	// 	tb = $("#hyl-popup-box-wrap");
	// 	tb.removeClass("hyl-show");
	// 	tb.find(".hyl-head .title").text("");
	// 	tb.find(".hyl-main").html("");
	// }
	tb.find(".hyl-head button").click({name: endfunc},function(event){
		var tb = $("body").children(".hyl-bokeh");
		tb.removeClass("hyl-show");
		tb = $("#hyl-popup-box-wrap");
		tb.removeClass("hyl-show");
		tb.find(".hyl-head .title").text("");
		tb.find(".hyl-main").html("");
		
	});
	succfunc();
}

function je_table(obj, opts) {
	jeui.use(["jeTable", "jeCheck"], function() {
	        	$(obj).jeTable(opts);
	});        		
}

/*支持浏览器验证，通过返回true*/
function Support_for_browser_validation() {
	
	var Sys = {};
	var ua = navigator.userAgent.toLowerCase();
	var s;
	(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
	(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
	(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
	(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
	(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
	 
	//以下进行测试
	// if (Sys.ie) console.info('IE: ' + Sys.ie);
	// if (Sys.firefox) console.info('Firefox: ' + Sys.firefox);
	// if (Sys.chrome) console.info('Chrome: ' + Sys.chrome);
	// if (Sys.opera) console.info('Opera: ' + Sys.opera);
	// if (Sys.safari) console.info('Safari: ' + Sys.safari);
	/*暂时只支持火狐，谷歌，safari浏览器*/
	if ( Sys.firefox || Sys.chrome || Sys.safari ) {
		return true;
	}

	return false;
}

function deal_query_condition_array(arr, obj, type) {
	if (type == 0) {
		for(var i =0; i<arr.length; i++) {
			var tmp = arr[i];
			if ( (tmp.name == obj.name) && (tmp.id == obj.id) && (tmp.title == obj.title) ) {
				arr.splice(i, 1);
				return;
			}
		}
	}
	if (type == 1) {
		for(var i=0; i<arr.length; i++) {
			var tmp = arr[i];
			if ( (tmp.name == obj.name) && (tmp.id == obj.id) && (tmp.title == obj.title) ) {
				return;
			}
		}
		arr.push(obj);
	}
}

function deal_query_condition(name, attr, isAdd) {
	var arr = attr.split(",");
	var title = arr[0];
	var id = arr[1];
	//console.info(title, id);
	var tmp = {};
	tmp.name = name;
	tmp.id = id;
	tmp.title = title;

	if (title == "type") {
		if (typeof(QueryCondi.type) == "undefined" ) {
			QueryCondi.type = [];
		}
		deal_query_condition_array(QueryCondi.type, tmp, isAdd);
	}
	if (title == "system") {
		if (typeof(QueryCondi.system) == "undefined" ) {
			QueryCondi.system = [];
		}
		deal_query_condition_array(QueryCondi.system, tmp, isAdd);
	}
	if (title == "user") {
		if (typeof(QueryCondi.user) == "undefined" ) {
			QueryCondi.user = [];
		}
		deal_query_condition_array(QueryCondi.user, tmp, isAdd);
	}
	if (title == "property") {
		if (typeof(QueryCondi.property) == "undefined" ) {
			QueryCondi.property = [];
		}
		deal_query_condition_array(QueryCondi.property, tmp, isAdd);
	}
	//console.info(QueryCondi);
	return;
}


function GetSessionID() {
	if (Options.SessionID == null || typeof(Options.SessionID) == "undefined") {
		alert("您还没有登录，请先登录！");
		window.location.href = "login.html";
	} else {
		return Options.SessionID;
	}
	return null;
}

function GenProgressBarHtml(width, height, pro) {
	pro = parseFloat(pro)/100;
	var w2 = width * pro;
	var radius = height/2;
	var html = '<div class="hyl-progress-bar" style="width: '+width+'px;height: '+height+'px;border-radius: '+radius+'px;"> \
        			<div class="progress" style="width: '+w2+'px;border-radius: '+radius+'px;"></div> \
    			</div>';
    return html;
}


function DateDiffNow (strInterval, dtStart) {
	var dtEnd = new Date();
	if (typeof dtStart == 'string' )//如果是字符串转换为日期型
	{
		if (dtStart.length == 8){
			dtStart = dtStart[0]+dtStart[1]+dtStart[2]+dtStart[3]+"/"+dtStart[4]+dtStart[5]+"/"+dtStart[6]+dtStart[7];
		}
		dtStart = new Date(dtStart);
	}
	switch (strInterval) {
		case 's' :return parseInt((dtEnd - dtStart) / 1000);
		case 'n' :return parseInt((dtEnd - dtStart) / 60000);
		case 'h' :return parseInt((dtEnd - dtStart) / 3600000);
		case 'd' :return parseInt((dtEnd - dtStart) / 86400000);
		case 'w' :return parseInt((dtEnd - dtStart) / (86400000 * 7));
		case 'm' :return (dtEnd.getMonth()+1)+((dtEnd.getFullYear()-dtStart.getFullYear())*12) - (dtStart.getMonth()+1);
		case 'y' :return dtEnd.getFullYear() - dtStart.getFullYear();
	}
}

function GetNowDate() {
	var date = new Date();
	var ret = "";
	ret += date.getFullYear()+""+ (date.getMonth()+1) + "" + date.getDate();
	return ret;
}

function DateDiff (strInterval, dtStart, dtEnd) {
	//var dtEnd = new Date();
	if ( typeof dtEnd == "string" ) {
		if (dtEnd.length == 8){
			dtEnd = dtEnd[0]+dtEnd[1]+dtEnd[2]+dtEnd[3]+"/"+dtEnd[4]+dtEnd[5]+"/"+dtEnd[6]+dtEnd[7];
		}
		dtEnd = new Date(dtEnd);
	}
	if ( typeof dtStart == 'string' )//如果是字符串转换为日期型
	{
		if (dtStart.length == 8){
			dtStart = dtStart[0]+dtStart[1]+dtStart[2]+dtStart[3]+"/"+dtStart[4]+dtStart[5]+"/"+dtStart[6]+dtStart[7];
		}
		dtStart = new Date(dtStart);
	}
	switch (strInterval) {
		case 's' :return parseInt((dtEnd - dtStart) / 1000);
		case 'n' :return parseInt((dtEnd - dtStart) / 60000);
		case 'h' :return parseInt((dtEnd - dtStart) / 3600000);
		case 'd' :return parseInt((dtEnd - dtStart) / 86400000);
		case 'w' :return parseInt((dtEnd - dtStart) / (86400000 * 7));
		case 'm' :return (dtEnd.getMonth()+1)+((dtEnd.getFullYear()-dtStart.getFullYear())*12) - (dtStart.getMonth()+1);
		case 'y' :return dtEnd.getFullYear() - dtStart.getFullYear();
	}
}



















