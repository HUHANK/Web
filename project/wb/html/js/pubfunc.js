/*后台访问地址url设定*/
var HostUrl = "http://10.10.14.36:5000";

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

/*获取浏览器的类型*/
 function  getExplorer() {
var explorer = window.navigator.userAgent ;
	//ie 
	if (explorer.indexOf("MSIE") >= 0) {
    	return 'ie';
	}
	//firefox 
	else if (explorer.indexOf("Firefox") >= 0) {
	    return 'Firefox';
	}
	//Chrome
	else if(explorer.indexOf("Chrome") >= 0){
	    return 'Chrome';
	}
	//Opera
	else if(explorer.indexOf("Opera") >= 0){
	    return 'Opera';
	}
	//Safari
	else if(explorer.indexOf("Safari") >= 0){
	    return 'Safari';
	}
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
	if (title == "module") {
		if (typeof(QueryCondi.module) == "undefined") {
			QueryCondi.module = [];
		}
		deal_query_condition_array(QueryCondi.module, tmp, isAdd);
	}
	//console.info(QueryCondi);
	return;
}


function GetSessionID() {
	if (Options.SessionID == null || typeof(Options.SessionID) == "undefined") {
		//alert("您还没有登录，请先登录！");
		window.location = "./login.html";
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

function OpenRedmineWindow(url, h, w, title) {
	if (typeof h == "undefined") {
		h = 800;
	}
	if (typeof w == "undefined") {
		w = 700;
	}
	nw = window.open(url, "newwindow", "height="+h+", width="+w+", toolbar=no, menubar=no, scrollbars=yes, location=no, status=no");
	if (typeof title != "undefined") {
		setTimeout(function(){
			nw.document.title = title;
		}, 500);
		nw.document.title = title;
	}
}

function GenTraceNoAhref( traceNo ) {
	var arr = traceNo.split("#");
	var sNo = $.trim( arr[1] ); 
	if (sNo == "0000") return traceNo;

	var re = /^[0-9]{4,}$/
	if ( !re.test(sNo) ) {
		return traceNo;
	}
	var url = "http://10.10.14.56/redmine/issues/" + sNo;
	//var html = arr[0] + ' <a href="'+url+'" url="'+url+'">#'+sNo+'</a>'
	var html = arr[0] + ' <a href="#" onClick="OpenRedmineWindow(\''+url+'\')">#'+sNo+'</a>'
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
	var mon = date.getMonth()+1;
	if (mon < 10) {
		mon = "0"+mon;
	}else {
		mon = mon + "";
	}
	var day = date.getDate();
	if (day < 10) {
		day = "0" + day;
	} else {
		day = day + "";
	}
	ret = date.getFullYear()+"" + mon + day;
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


function GetNowDate2() {
	var date = new Date();
	var ret = "";
	var mon = date.getMonth()+1;
	if (mon < 10) {
		mon = "0"+mon;
	}else {
		mon = mon + "";
	}
	var day = date.getDate();
	if (day < 10) {
		day = "0" + day;
	} else {
		day = day + "";
	}
	ret = date.getFullYear()+"-" + mon + "-" + day;
	return ret;
}

function isLeapYear(year) {
    return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
}


function getMonthDays(year, month) {
    return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (isLeapYear(year) ? 29 : 28);
}

function getWeekNumber(y, m, d) {
    var now = new Date(y, m - 1, d),
        year = now.getFullYear(),
        month = now.getMonth(),
        days = now.getDate();
    //那一天是那一年中的第多少天
    for (var i = 0; i < month; i++) {
        days += getMonthDays(year, i);
    }

    //那一年第一天是星期几
    var yearFirstDay = new Date(year, 0, 1).getDay() || 7;

    var week = null;
    if (yearFirstDay == 1) {
        week = Math.ceil(days / yearFirstDay);
    } else {
        days -= (7 - yearFirstDay + 1);
        week = Math.ceil(days / 7) + 1;
    }

    return week;
}




function Cleanup() {
        window.clearInterval(idTmr);
        CollectGarbage();
    }
var tableToExcel = (function() {
  var uri = 'data:application/vnd.ms-excel;base64,',
  template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
    base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) },
    format = function(s, c) {
        return s.replace(/{(\w+)}/g,
        function(m, p) { return c[p]; }) }
    return function(table, name) {
    //if (!table.nodeType) table = document.getElementById(table)
    var ctx = {worksheet: name || 'Worksheet', table: table}
    window.location.href = uri + base64(format(template, ctx))
  }
})()

var oFrequentTimes = {};
function IsOperationFrequent(name, interval){
	var dt = (new Date()).valueOf();
	if (oFrequentTimes[name] == 'undefined') {
		oFrequentTimes[name] = dt;
		return false;
	}
	
	if ((dt - oFrequentTimes[name]) < interval*1000){
		var str = "您的操作过于频繁，请于"+(interval - parseInt((dt-oFrequentTimes[name])/1000))+"秒之后再试。";
		alert(str);
		return true;
	}
	oFrequentTimes[name] = dt;
	return false;
}

var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
function UUID(len, radix) {
	var chars = CHARS, uuid = [], i;
	radix = radix || chars.length;

	if (len) {
		//compact form
		for (i=0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
	} else {
		var r;

		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		uuid[14] = '4';

		for (i =0; i<36; i++) {
			r = 0|Math.random()*16;
			uuid[i] = chars[(i==19)?(r &0x3) | 0x8 : r];
		}
	}

	return uuid.join('');
}

function hyl_alert(msg) {
	var id = UUID(12);
	var clientW = $(window).width();
	var clientH = $(window).height();

	var dom = $("<div></div>").attr("id", id);
	dom.append($("<div></div>").addClass('bkg'));
	dom.append($("<div></div>").addClass('main').append(
		$("<div></div>").addClass('note').text(msg),
		$("<div class='opt'><button>确定</button></div>")
		));
	$("body").append(dom);
	//console.info(dom);

	dom = $("body").find("#"+id);
	dom.find(".bkg").css({
		'position': 'fixed',
		'top': '0',
		'left': '0',
		'width': '100%',
		'height': '100%',
		'background-color': 'black',
		'opacity': '0.4',
		'z-index': '100'
	});
	dom.find(".main").css({
		'position': 'fixed',
		'top': '50%',
		'left': '50%',
		'background-color': 'white',
		'z-index': '1001',
		'border': '1px solid #696969'
	});
	dom.find(".note").css({
		'text-align': 'center',
		'width': '240px',
		'min-height': '60px',
		'line-height': '60px',
		'font-size': '12px'
	});
	dom.find(".opt").css({
		'height': '60px',
		'line-height': '60px',
		'background-color': '#F2F2F2'
	});
	dom.find(".opt button").css({
		'outline': 'none',
		'background': 'none',
		'border': 'none',
		'border': '1px solid #2963C7',
		'border-radius': '2px',
		'width': '70px',
		'height': '28px',
		'background-color': '#5A97FF',
		'color': 'white',
		'margin-left': '150px'
	});

	var main = dom.find(".main");
	var h = main.height();
	var w = main.width();
	
	main.css({
		'left': (clientW-w)/2+'px',
		'top': (180)+'px'
	});

	dom.find(".opt button").click(function(event) {
		dom.remove();
	});
	
}



