
function Support ( ) {
	querySupport();
}

function InitSupport ( ) {
	SuportRepaint();
	init_add_record();
	$(".support").bind("contextmenu",function(e){
   		return false;
 	});
 	$("body .mouse-right-down").bind("contextmenu",function(e){
   		return false;
 	});
}

function SuportRepaint () {
	wheight = $(window).height();
	wwidth = $(window).width();

	qheight = wheight - $("body .wrapper-top").height();

	$(".support .wrap").css("height", qheight+"px");
	$(".support .wrap .show").css("height", ($(".support .wrap").height() 
		- $(".support .wrap .option").outerHeight()) + "px");
}

function SupportMouseRightDown(e) {
	var dropbox = $("body .mouse-right-down");

	// console.info(e);
	// console.info(e.clientX, e.clientY);
	dropbox.css("top", e.clientY+"px")
			.css("left", e.clientX+"px");
	dropbox.slideDown(200, function() {
		
	});

	dropbox.focus();

	$("body").click(function(event) {
		/* Act on the event */
		setTimeout(function(){
			$("body .mouse-right-down").slideUp(100);
			$("body").unbind('click');
		}, 100);
	});

	$(document).on("scroll", function(ev) {
		//console.info(ev);
		setTimeout(function(){
			$("body .mouse-right-down").slideUp(100);
			$(document).unbind('scroll');
		}, 1);
	});

	return false;
}

function init_add_record ( ) {
	
	var system = g_ALL_SYSTEM.data;
	var data = [];
	$(system).each(function(index, el) {
		data.push(el.name);		
	});
	
	hyl_select($(".support .add-record .system"), data, system_selected);

	$(".support .add-record .module").append($("<input type='text' name='' readonly='readonly'>"));

	function system_selected( ele ){
		$(system).each(function(index, el) {
			if (el.name === $(ele).text()) {
				
				if (el.data.length >= 1){
					var d = [];
					$(el.data).each(function(index, ell) {
						d.push(ell.name);
					});
					hyl_select($(".support .add-record .module"), d); 
				}else{
					$(".support .add-record .module").html($("<input type='text' name='' readonly='readonly'>"));
				}
			}
		});
	}

	$('.support .wrap .show').mousedown(function(e){
		//console.info(e.which); // 1 = 鼠标左键 left; 2 = 鼠标中键; 3 = 鼠标右键
		if (e.which == 3) {
			SupportMouseRightDown(e);
		}
		return false;//阻止链接跳转
	});

	$(".support .add-record .head .exit").click(function(event) {
		/* Act on the event */
		$("body").children(".hyl-bokeh").removeClass('hyl-show');
		$(".support .add-record").removeClass('show');
	});

	$('.support .wrap .option button.add').click(function(event) {
		/* Act on the event */
		var tb = $("body").children(".hyl-bokeh");
		tb.addClass("hyl-show");

		$(".support .add-record .head .title").text('添加Support包记录');
		$(".support .add-record").addClass('show');
		$(".support .add-record table .confirm").addClass('add');
	});

	$('.support .wrap .option button.upt').click(function(event) {
		/* Act on the event */
		var tb = $("body").children(".hyl-bokeh");
		tb.addClass("hyl-show");

		$(".support .add-record .head .title").text('更新Support包记录');
		$(".support .add-record").addClass('show');
		$(".support .add-record table .confirm").addClass('upt');
	});

	$(".support .add-record table .confirm").click(function(event) {
		/* Act on the event */
		var ret = false;
		if ($(this).hasClass('add')) {
			ret = addSupport("ADD");
		} else if ($(this).hasClass('upt')) {
			ret = addSupport("UPT");
		}

	});

	var users = [];
	$(g_ALL_USER).each(function(index, el) {
		//console.info(el.cname);
		users.push(el.cname);
	});
	users.sort();
	hyl_select($(".support .add-record table .developer"), users);
	hyl_select($(".support .add-record table .charger"), users);


}

function addSupport(opt) {
	var param = {};

	function sGetInputVal(name) {
		return $(".support .add-record table ."+name+" input").val();
	}
	function sGetTextareaVal(name) {
		return $(".support .add-record table ."+name+" textarea").val();
	}

	param.system 		= sGetInputVal("system");
	param.module 		= sGetInputVal("module");
	param.type 			= sGetInputVal("type");
	param.name 			= sGetInputVal("sname");
	param.ftp 			= sGetInputVal("ftp");
	param.detail 		= sGetTextareaVal("detail");
	param.bversion 		= sGetInputVal("bversion");
	param.pulno 		= sGetInputVal("pulno");
	param.pdate 		= sGetInputVal("pdate");
	param.uptno 		= sGetInputVal("uptno");
	param.status 		= sGetInputVal("status");
	param.remark 		= sGetTextareaVal("remark");
	param.developer 	= sGetInputVal("developer");
	param.charger 		= sGetInputVal("charger");
	param.collaboration = sGetInputVal("collaboration");
	param.pversion 		= sGetInputVal("pversion");
	param.gitb 			= sGetInputVal("gitb");
	param.uversion 		= sGetInputVal("uversion");

	param.SessionID = Options.SessionID;
	if (opt == "ADD") {
		param.method = "ADD";
		param.adduser = g_CURRENT_USER;
	} else if (opt == "UPT") {
		param.method = "UPDATE";
	}
	console.info(param);

	sync_post_data("/support/", JSON.stringify(param), function(d) {
		console.info(d);
	});
}

function querySupport() {
	var param = {};
	param.method    = "QUERY";
	param.SessionID = Options.SessionID;

	sync_post_data("/support/", JSON.stringify(param), function(d) {
		console.info(d);
		if (d.ErrCode != 0) {
			alter(d.msg);
		}

		var conf = {};
		conf.width = 2600;
		conf.height = 400;
		conf.columns = [
			{name: 'ID', 		field:'ID', 			width:'40', align:'center'},
			{name: '包类型', 	field:'TYPE', 			width:'100', align:'center'},
			{name: '系统', 		field:'SYSTEM', 		width:'100', align:'center'},
			{name: '模块', 		field:'MODULE', 		width:'100', align:'center'},
			{name: '包名称', 	field:'PACKAGE_NAME', 	width:'100', align:'center'},
			{name: 'FTP地址', 	field:'FTP_ADDR', 		width:'100', align:'center'},
			{name: '发布内容', 	field:'CONTENT', 		width:'100', align:'center'},
			{name: '基础版本', 	field:'BASE_VERSION', 	width:'100', align:'center'},
			{name: '发布流程号',field:'PUBLISH_SERIAL', width:'120', align:'center'},
			{name: '备注', 		field:'REMARK', 		width:'100', align:'center'},
			{name: '更新次数', 	field:'UPT_NUM', 		width:'100', align:'center'},
			{name: '发布日期', 	field:'PUBLISH_DATE', 	width:'100', align:'center'},
			{name: '状态', 		field:'STATUS', 		width:'100', align:'center'},
			{name: '开发员', 	field:'DEVELOPER', 		width:'100', align:'center'},
			{name: '负责人', 	field:'CHARGER', 		width:'100', align:'center'},
			{name: '计划版本', 	field:'PLAN_VERSION', 	width:'100', align:'center'},
			{name: 'Git分支', 	field:'GIT_BRANCH', 	width:'100', align:'center'},
			{name: '升级版本', 	field:'UPGRADE_VERSION',width:'100', align:'center'},
			{name: '协作号', 	field:'COLLABORATION', 	width:'100', align:'center'},
			{name: '创建者', 	field:'CRT_USER', 		width:'100', align:'center'},
			{name: '创建时间', 	field:'CRT_TIME', 		width:'100', align:'center'},
			{name: '更新者', 	field:'UPT_USER', 		width:'100', align:'center'},
			{name: '跟新时间', 	field:'UPT_TIME', 		width:'100', align:'center'}
		];
		conf.datas = d.data;

		hyl_table($(".support .show"), conf);

	});

}