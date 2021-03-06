window.onload = main;

// jQuery(document).ready(function($) {
// 	main();
// });

// Options = new Object();
var NavbarIndexCookies = "HTZQ_NavbarIndex";

function main() {
	Options.SessionID = $.cookie("htzq_SessionID");
	GetSessionID();
	InitHeader();
	GInit();
	var index = $.cookie(NavbarIndexCookies);
	if (index == 'null' || typeof(index) == 'undefined') 
		index = 6;
	initNavbar(index);
	navbar();

	/*退出登出*/
	$(".header .subhead .logout").click(function(){
		var param = new Object();
		param.SessionID = GetSessionID();
		sync_post_data("/logout/", JSON.stringify(param), function(d) {

		});

		$.cookie(NavbarIndexCookies, null);
		$.cookie("htzq_SessionID", null);
		Options.SessionID = null;
		window.location = "./login.html";
	});

	$(document).keydown(function(event) {
		/* Act on the event */
		if (event.keyCode == 27){
			var param = new Object();
			param.SessionID = GetSessionID();
			sync_post_data("/logout/", JSON.stringify(param), function(d) {});

			$.cookie(NavbarIndexCookies, null);
			$.cookie("htzq_SessionID", null);
			Options.SessionID = null;
			window.location = "./login.html";
		} else if (event.keyCode == 17) {//Ctrl键
			if (!g_CTRL_KEY_DOWN) g_CTRL_KEY_DOWN = true;
		} else if (event.keyCode == 16) {
			if (!g_SHIFT_KEY_DOWN) g_SHIFT_KEY_DOWN = true;
		}
	});

	$(document).keyup(function(event) {
		if (event.keyCode == 17){
			if (g_CTRL_KEY_DOWN) g_CTRL_KEY_DOWN = false;
		} else if (event.keyCode == 16){
			if (g_SHIFT_KEY_DOWN) g_SHIFT_KEY_DOWN = false;
		}
	});

	window.onresize = function() {
		init_window();
		query_get_result(g_CURRENT_QPAGE);
	}
	init_window();

	$(document).scroll(function(event) {
    	OnScroll(event);
    });

    $( document ).tooltip();
}

function OnScroll( event ) {
	WeekReportScroll();
}

function init_window() {
	wheight = $(window).height();
	wwidth = $(window).width() ;

	qheight = wheight - $("body .wrapper-top").height();
	$(".body .query").height(qheight);
	/*设置设置界面的高度*/
	var hsjwh = qheight - g_system_fix_height;
	$(".body .sjwh").height(hsjwh);
	$(".body .sjwh iframe").height(hsjwh);

	/**/
	var iframe_body = $(".body .sjwh iframe")[0].contentDocument.body;
	wwrap1 = wwidth - $(iframe_body).find('.wrap .sidebar').outerWidth();

	$(iframe_body).children('.wrap').height(hsjwh);
	$(iframe_body).find('.wrap .wrap1').height(hsjwh);
	$(iframe_body).find('.wrap .wrap1').width(wwrap1);
	SuportRepaint();
	WeekReportWinResize();
	MonthReportWinResize();
	CalendarWinResize();
}

function InitHeader() {
	var param = new Object();
	param.SessionID = GetSessionID();
	sync_post_data("/baseinfo/", JSON.stringify(param), function(d) {
		//console.info(d);
		var txt = "你好，" + d.UserName + "！";
		$(".header .subhead .yhxs").text(txt);

		txt = d.Date + "(第" + d.Week + "周)";
		$(".header .subhead .rqxs").text(txt);
		g_CURRENT_WEEK = d.Week;
		g_CURRENT_USER = d.UserName;
		g_CURRENT_USER_IS_ADMIN = d.IsAdmin;
		g_CURRENT_USER_ID = d.UserID;

		var tmp = d.Date[0] + d.Date[1] + d.Date[2] + d.Date[3];
		g_CURRENT_YEAR = parseInt(tmp);

		g_ALL_DICT = d.Dict;

		$(g_ALL_DICT).each(function(index, el) {
			if (el.name == "Support"){
				g_SUPPORT = el.data;
			}			
		});

	});
}

function GInit(){

	Options.QueryCondition = new Object();
	Options.QueryCondition.User = [];
	Options.QueryCondition.SysModule = [];
	Options.QueryCondition.Property = [];
	Options.QueryCondition.Type = [];
	Options.QueryCondition.Page = 0;
	Options.QueryCondition.PageSize = 25;
	GUpdateBaseinfo();

	InitSupport();
}

function GUpdateBaseinfo(){
	var param = new Object();
	param.SessionID = Options.SessionID;
	sync_post_data("/baseinfo/", JSON.stringify(param), function(d){
		if (d.ErrCode == 0) {
			g_ALL_USER = d.Users;
			g_ALL_DEPART = d.Departs;
			g_ALL_GROUP = d.Groups;
			g_ALL_SYSTEM = d.System;
			g_ALL_TYPE = d.Type;
			g_ALL_PROPERTY = d.Property;

			for( i  in g_ALL_GROUP ){
				for (ii in g_ALL_USER){
					if (g_ALL_USER[ii].id == g_ALL_GROUP[i].manager){
						g_ALL_GROUP[i].manager_name = g_ALL_USER[ii].cname;
					}
				}
			}
		}else{
			//alert("您没有登录！");
			window.location = "./login.html";
		}
	});
	param.method = "GET";
	sync_post_data("/query_tree/", JSON.stringify(param), function(d){
		if (d.ErrCode == 0){
			/*数据处理*/
			for (i=0; i<d.data.length; i++) {
				var data = d.data[i];
				if (data.name == "系统") {
					//console.info(data);
					for (j=0; j<data.data.length; j++) {
						for (k=1; k<data.data.length; k++) {
							if (data.data[k].data.length < data.data[k-1].data.length) {
								var tmp = data.data[k-1];
								data.data[k-1] = data.data[k];
								data.data[k] = tmp;
							}
						
						}
					}
				}
			}
			//console.info(d.data);
			g_QUERY_TREE = d.data;
			//console.info(g_QUERY_TREE);
		}else{

		}
	});
}

function initNavbar(index){
	index = parseInt(index)
	switch(index)
	{
		case 2:
			$(".body .query"	).css("display", "block");
			$(".title .navbar ul li[value='Query']").addClass('clicked');
			query();
			break;
		case 1:
			$(".body .add-zb"	).css("display", "block");
			$(".title .navbar ul li[value='WZB']").addClass('clicked');
			add_zb();
			break;
		case 5:
			$(".body .sjwh"		).css("display", "block");
			$(".title .navbar ul li[value='SZWH']").addClass('clicked');
			system_init();
			break;
		case 3:
			$(".body .support"	).css("display", "block");
			$(".title .navbar ul li[value='Support']").addClass('clicked');
			Support();
			break;
		case 4:
			$(".body .calendar").css("display", "block");
			$(".title .navbar ul li[value='Calendar']").addClass('clicked');
			CalendarMain();
			break;
		case 6:
			$(".body .week-report").css("display", "block");
			$(".title .navbar ul li[value='week-report']").addClass('clicked');
			WeekReportMain();
			break;
		case 7:
			$(".body .monthly-report"	).css("display", "block");
			$(".title .navbar ul li[value='monthly-report']").addClass('clicked');
			MonthReportMain();
			break;
	}
}

function navbar() {
	if (g_CURRENT_USER_IS_ADMIN == 0) {
		$("body .wrapper-top .navbar li[value=SZWH]").css('display', 'none');
	}
	$(".navbar ul li").click(function(){
		//删除li的所有的class
		$(".navbar ul").children("li").each(function(index, data){
			$(data).removeClass("clicked");
		});
		//添加clicked的class
		$(this).addClass("clicked");
		var value = $(this).attr("value");
		if (value == "HomePage") {
			// $(".body .home-page").css("display", "block");
			
			// $(".body .add-zb").css("display", "none");
			// $(".body .query").css("display", "none");
			// $(".body .sjwh").css("display", "none");
			// $.cookie(NavbarIndexCookies, 1);
			// home_page();
		} else if (value == "Query"){
			$(".body .query"	).css("display", "block");

			$(".body .home-page").css("display", "none");
			$(".body .sjwh"		).css("display", "none");
			$(".body .add-zb"	).css("display", "none");
			$(".body .support"	).css("display", "none");
			$(".body .calendar"	).css("display", "none");
			$(".body .week-report"	).css("display", "none");
			$(".body .monthly-report"	).css("display", "none");
			$.cookie(NavbarIndexCookies, 2);
			query();
		} else if (value == "WZB") {
			$(".body .add-zb"	).css("display", "block");

			$(".body .home-page").css("display", "none");
			$(".body .query"	).css("display", "none");
			$(".body .sjwh"		).css("display", "none");
			$(".body .support"	).css("display", "none");
			$(".body .calendar"	).css("display", "none");
			$(".body .week-report"	).css("display", "none");
			$(".body .monthly-report"	).css("display", "none");
			$.cookie(NavbarIndexCookies, 1);
			add_zb();
		} else if (value == "SZWH") {
			$(".body .sjwh"		).css("display", "block");

			$(".body .home-page").css("display", "none");
			$(".body .query"	).css("display", "none");
			$(".body .add-zb"	).css("display", "none");
			$(".body .support"	).css("display", "none");
			$(".body .calendar"	).css("display", "none");
			$(".body .week-report"	).css("display", "none");
			$(".body .monthly-report"	).css("display", "none");
			$.cookie(NavbarIndexCookies, 5);
			system_init();
		} else if (value == "Support") {
			$(".body .support"	).css("display", "block");

			$(".body .sjwh"		).css("display", "none");
			$(".body .home-page").css("display", "none");
			$(".body .query"	).css("display", "none");
			$(".body .add-zb"	).css("display", "none");
			$(".body .calendar"	).css("display", "none");
			$(".body .week-report"	).css("display", "none");
			$(".body .monthly-report"	).css("display", "none");
			$.cookie(NavbarIndexCookies, 3);
			Support();
		} else if (value == "Calendar") {
			$(".body .calendar"	).css("display", "block");

			$(".body .support"	).css("display", "none");
			$(".body .sjwh"		).css("display", "none");
			$(".body .home-page").css("display", "none");
			$(".body .query"	).css("display", "none");
			$(".body .add-zb"	).css("display", "none");
			$(".body .week-report"	).css("display", "none");
			$(".body .monthly-report"	).css("display", "none");
			$.cookie(NavbarIndexCookies, 4);
			CalendarMain();
		} else if(value == "week-report") {
			$(".body .week-report"	).css("display", "block");

			$(".body .calendar"	).css("display", "none");
			$(".body .support"	).css("display", "none");
			$(".body .sjwh"		).css("display", "none");
			$(".body .home-page").css("display", "none");
			$(".body .query"	).css("display", "none");
			$(".body .add-zb"	).css("display", "none");
			$(".body .monthly-report"	).css("display", "none");
			$.cookie(NavbarIndexCookies, 6);
			WeekReportMain();
		} else if( value == "monthly-report") {
			$(".body .monthly-report"	).css("display", "block");

			$(".body .calendar"	).css("display", "none");
			$(".body .support"	).css("display", "none");
			$(".body .sjwh"		).css("display", "none");
			$(".body .home-page").css("display", "none");
			$(".body .query"	).css("display", "none");
			$(".body .add-zb"	).css("display", "none");
			$(".body .week-report"	).css("display", "none");
			$.cookie(NavbarIndexCookies, 7);
			MonthReportMain();
		}

	});
}


function system_init() {
	var html = "<iframe src='system.html?version=1.8.4' frameborder='0' onload = '' width='100%'  scrolling='no'></iframe>"
	$(".sjwh").html(html);
	$(".body .sjwh iframe").height($(window).height()-$("body .wrapper-top").outerHeight() - g_system_fix_height);

	$(".body .sjwh iframe")[0].contentWindow.onload = function() {
		// console.info("xxxxxxxxxxxxxxxxxxxxxx");
		// console.info($(window).height());
		var h = $(window).height() - $("body .wrapper-top").outerHeight() - g_system_fix_height;
		// console.info(h);
		var iframe_body = $(".body .sjwh iframe")[0].contentDocument.body;
		$(iframe_body).find(".wrap").height(h);
		$(iframe_body).find(".wrap .sidebar").height(h);
		$(iframe_body).find(".wrap .wrap1").height(h);

		var w = $(".body .sjwh").innerWidth() - $(iframe_body).find(".wrap .sidebar").outerWidth();
		$(iframe_body).find(".wrap .wrap1").width(w);
	}

}

function data_protect(){
	//update_sjwh_dict();
	$(".sjwh .sidebar li").click(function(){
		$(".sjwh .sidebar li").each(function(index, data){
			$(data).removeClass("on");
		});
		$(this).addClass("on");

		if ($(this).attr("name") == "mmxg") {
			$(".sjwh .wrap .mmxg").css("display", "block");
			$(".sjwh .wrap .bmgl").css("display", "none");
			$(".sjwh .wrap .xzgl").css("display", "none");
			$(".sjwh .wrap .qxgl").css("display", "none");
			$(".sjwh .wrap .zdwh").css("display", "none");
		} else if ($(this).attr("name") == "bmgl") {
			$(".sjwh .wrap .mmxg").css("display", "none");
			$(".sjwh .wrap .bmgl").css("display", "block");
			$(".sjwh .wrap .xzgl").css("display", "none");
			$(".sjwh .wrap .qxgl").css("display", "none");
			$(".sjwh .wrap .zdwh").css("display", "none");
			sjwh_bmgl_update();
		} else if ($(this).attr("name") == "xzgl") {
			$(".sjwh .wrap .mmxg").css("display", "none");
			$(".sjwh .wrap .bmgl").css("display", "none");
			$(".sjwh .wrap .xzgl").css("display", "block");
			$(".sjwh .wrap .qxgl").css("display", "none");
			$(".sjwh .wrap .zdwh").css("display", "none");
			sjwh_xzgl_update();
		} else if ($(this).attr("name") == "qxgl") {
			$(".sjwh .wrap .mmxg").css("display", "none");
			$(".sjwh .wrap .bmgl").css("display", "none");
			$(".sjwh .wrap .xzgl").css("display", "none");
			$(".sjwh .wrap .qxgl").css("display", "block");
			$(".sjwh .wrap .zdwh").css("display", "none");
		} else if ($(this).attr("name") == "zdwh") {
			$(".sjwh .wrap .mmxg").css("display", "none");
			$(".sjwh .wrap .bmgl").css("display", "none");
			$(".sjwh .wrap .xzgl").css("display", "none");
			$(".sjwh .wrap .qxgl").css("display", "none");
			$(".sjwh .wrap .zdwh").css("display", "block");
			sjwh_zdwh_update();
		}
	});
/*-----------------------密码修改---------------------------*/
	var mmxg = $(".sjwh .wrap .mmxg");
	mmxg.find(".submit").click(function(){
		var jmm = mmxg.find(".jmm");
		var xmm1 = mmxg.find(".xmm1");
		var xmm2 = mmxg.find(".xmm2");
		if ( jmm.val() == "") {
			jmm.addClass('ts');
			return;
		}
		if (xmm1.val() == "") {
			xmm1.addClass('ts');
			return;
		}
		if (xmm2.val() == "") {
			xmm2.addClass('ts');
			return;
		}
		if (xmm1.val() != xmm2.val()) {
			pop_box("ERROR", 200, 120, "确认密码不能与新密码不一致!");
		}

		var param = new Object();
		param.SessionID = Options.SessionID;
		param.OldPwd = jmm.val();
		param.NewPwd = xmm1.val();

		sync_post_data("/sjwh_xgmm/", JSON.stringify(param), function(d){
			if (d.ErrCode == 0) {
				d.msg = d.msg + "请重新登录！";
				pop_box1("SUCCESS", 200, 120, d.msg, null, function(){
					window.location.href = "login.html";
				});
			}else{
				pop_box("FAILED", 200, 120, d.msg);
			}
		});

	});
/*-----------------------部门管理---------------------------*/
	$(".sjwh .wrap .bmgl button").click(function() {
		if ($(this).attr("name") == "add") {
			pop_box("添加部门", 400, 200, bmgl_add_html, function(){
				//console.log($("#je-popup-box-wrap .submit"));
				var shtml = "";
				for(var i=0; i<g_ALL_USER.length; i++){
					shtml += "<option>"+g_ALL_USER[i].cname+"</option>";
				}
				$("#je-popup-box-wrap .manager").html(shtml);

				$("#je-popup-box-wrap .submit").click(function() {
					var depart = $("#je-popup-box-wrap .depart");
					var manager = $("#je-popup-box-wrap .manager");
					if (depart.val().length < 1) {
						depart.addClass('ts');
						return ;
					}
					var  param = new Object();
					param.method = "ADD";
					param.SessionID  = Options.SessionID;
					param.depart = depart.val();
					var mid = 0;
					for(var i=0; i<g_ALL_USER.length; i++){
						if( manager.val() == g_ALL_USER[i].cname){
							mid = g_ALL_USER[i].id;
							break;
						}
					}
					param.manager = mid;

					sync_post_data("/sjwh_bmgl/", JSON.stringify(param), function(d){
						if(d.ErrCode == 0) {
							depart.val("");
							sjwh_bmgl_update();
							GUpdateBaseinfo();
						}
					});
				});
			});
		}
	});

/*-----------------------小组管理---------------------------*/
	$(".sjwh .wrap .xzgl button").click(function() {
		if ($(this).attr("name") == "add") {
			pop_box("添加小组", 400, 260, xzgl_add_html, function(){
				var shtml = "";
				for(var i=0; i<g_ALL_USER.length; i++){
					shtml += "<option>"+g_ALL_USER[i].cname+"</option>";
				}
				$("#je-popup-box-wrap .manager").html(shtml);

				shtml = "";
				for(var i=0; i<g_ALL_DEPART.length; i++) {
					shtml += "<option>"+g_ALL_DEPART[i].name+"</option>";
				}
				$("#je-popup-box-wrap .depart").html(shtml);

				$("#je-popup-box-wrap .submit").click(function() {
					var depart = $("#je-popup-box-wrap .depart");
					var group = $("#je-popup-box-wrap .group");
					var manager = $("#je-popup-box-wrap .manager");
					if (group.val() == "") {
						group.addClass('ts');
						return ;
					}
					
					var depart_id = -1;
					for(var i =0; i<g_ALL_DEPART.length; i++){
						if (depart.val() == g_ALL_DEPART[i].name){
							depart_id = g_ALL_DEPART[i].id;
							break;
						}
					}
					var uid = -1;
					for(var i = 0; i<g_ALL_USER.length; i++){
						if (manager.val() == g_ALL_USER[i].cname) {
							uid = g_ALL_USER[i].id;
							break;
						}
					}
					if (depart_id < 0 || uid < 0) {
						pop_box("ERROR", 200, 120, "内存中的字典数据不是最新的，请刷新跟新！");
						return;
					}

					var  param = new Object();
					param.method = "ADD";
					param.SessionID  = Options.SessionID;
					param.name = group.val();
					param.manager = uid;
					param.depart = depart_id;

					sync_post_data("/sjwh_xzgl/", JSON.stringify(param), function(d){
						if(d.ErrCode == 0) {
							group.val("");
							sjwh_xzgl_update();
							GUpdateBaseinfo();
						}
					});
				});

			});
		}
	});

	
/*-----------------------字典维护---------------------------*/	
	$(".sjwh .wrap .zdwh fieldset .submit").click(function(){
		var rot = $(".sjwh .wrap .zdwh fieldset .root");
		var first = $(".sjwh .wrap .zdwh fieldset .first");
		var second = $(".sjwh .wrap .zdwh fieldset .second");

		var param = new Object();
		param.SessionID = Options.SessionID;
		param.method = "GET";
		param.condi = {};
		if ($.trim(rot.val()).length > 0 ) {
			if ($.trim(first.val()).length > 0 ) {
				if ($.trim(second.val()).length > 0 ) {
					param.condi.parent = second.children('option[selected="selected"]').attr("name");
					param.condi.id = param.condi.parent;
				}else{
					param.condi.parent = first.children('option[selected="selected"]').attr("name");
					param.condi.id = param.condi.parent;
				}
			}else{
				//console.info(rot.children('option[selected="selected"]').attr("name"));
				param.condi.parent = rot.children('option[selected="selected"]').attr("name");
				param.condi.id = param.condi.parent;
			}
		} else {}
		post_data("/sjwh_zdwh/", JSON.stringify(param), function(d){
			d = $.parseJSON(d);
			if (d.ErrCode == 0) {
				sjwh_zdwh_update_result_table(d.data);
			}
		});
	});

	$(".sjwh .wrap .zdwh .tool .del").click(function() {
		$(".sjwh .wrap .zdwh .result tbody ins").each(function(index, data){
			
			if ($(data).hasClass("on")){
				var id = $(data).parent().parent().next().children().text();

				var param = new Object();
				param.SessionID = Options.SessionID;
				param.method = "DELETE";
				param.id = id;
				post_data("/sjwh_zdwh/", JSON.stringify(param), function(d){
					d = $.parseJSON(d);
					if (d.ErrCode == 0) {
		/*---------------------------------------*/
						var rot = $(".sjwh .wrap .zdwh fieldset .root");
						var first = $(".sjwh .wrap .zdwh fieldset .first");
						var second = $(".sjwh .wrap .zdwh fieldset .second");

						var param = new Object();
						param.SessionID = Options.SessionID;
						param.method = "GET";
						param.condi = {};
						if ($.trim(rot.val()).length > 0 ) {
							if ($.trim(first.val()).length > 0 ) {
								if ($.trim(second.val()).length > 0 ) {
									param.condi.parent = second.children('option[selected="selected"]').attr("name");
									param.condi.id = param.condi.parent;
								}else{
									param.condi.parent = first.children('option[selected="selected"]').attr("name");
									param.condi.id = param.condi.parent;
								}
							}else{
								//console.info(rot.children('option[selected="selected"]').attr("name"));
								param.condi.parent = rot.children('option[selected="selected"]').attr("name");
								param.condi.id = param.condi.parent;
							}
						} else {}
						post_data("/sjwh_zdwh/", JSON.stringify(param), function(d){
							d = $.parseJSON(d);
							if (d.ErrCode == 0) {
								sjwh_zdwh_update_result_table(d.data);
							}
						});
		/*---------------------------------------*/
					}
				});
			}
		});
	});

	$(".sjwh .wrap .zdwh .tool .add").click(function() {
	
		pop_box("字典添加", 400, 260, zdwh_add_html, function(){
			

			var param = new Object();
			param.SessionID = Options.SessionID;
			param.method = "GET";
			param.condi = {};

			post_data("/sjwh_zdwh/", JSON.stringify(param), function(d){
				d = $.parseJSON(d);
				if (d.ErrCode == 0) {
					
					var rot = $("#je-popup-box-wrap .zdwh .root");
					var shtml = "";
					rot.html(shtml);
					shtml = "<option></optino>"
					for (var i= 0; i<d.data.length; i++) {
						shtml += "<option name='"+d.data[i].id+"'>"+ d.data[i].name +"</option>";
					}
					rot.html(shtml);

					//console.info($("#je-popup-box-wrap .zdwh .root option"));
					$("#je-popup-box-wrap .zdwh .root option").click(function(){
						$(this).parent().children().removeAttr('selected');
						$(this).attr("selected", "selected");
					});

				}
			});

			
			$("#je-popup-box-wrap .submit").click(function() {
				var rot = $("#je-popup-box-wrap .root");
				var name = $("#je-popup-box-wrap .name");
				var isRoot = $("#je-popup-box-wrap .isroot");
				if (rot.val().length < 1){
					rot.addClass('ts');
					alert("请选择父节点！");
					return ;
				}
				if (name.val().length < 1 ) {
					name.addClass("ts");
					alert("请填写节点名称!");
					return ;
				}
				if (isRoot.val().length < 1) {
					isRoot.addClass("ts");
					return;
				}

				var param = new Object();
				param.SessionID = Options.SessionID;
				param.method = "ADD";
				param.parent = rot.find("option[selected='selected']").attr("name");
				param.name = name.val();
				if (isRoot.val() == "是")
					param.isRoot = 1;
				else
					param.isRoot = 0;

				post_data("/sjwh_zdwh/", JSON.stringify(param), function(d){
					d = $.parseJSON(d);
					if (d.ErrCode == 0) {
						rot.val("");
						name.val("");
						isRoot.val("");
					}
				});

			});
		});

	});
}

function sjwh_bmgl_update() {

}

function sjwh_xzgl_show() {

}

function sjwh_xzgl_update() {

}

function sjwh_zdwh_update_result_table(d) {
	
}

function sjwh_zdwh_update() {
	var param = new Object();
	param.SessionID = Options.SessionID;
	param.method = "GET";
	param.condi = {};
	param.condi.isRoot = 1;

	post_data("/sjwh_zdwh/", JSON.stringify(param), function(d){
		d = $.parseJSON(d);
		if (d.ErrCode == 0) {
			var data = d.data;
			var shtml = "<option name='-1'></option>";
			for(var i=0; i<data.length; i++) {
				shtml += "<option name='"+data[i].id+"'>" + data[i].name + "</option>";
			}
			//console.info($(".sjwh .wrap .zdwh fieldset .root"));
			$(".sjwh .wrap .zdwh fieldset .root").val("");
			$(".sjwh .wrap .zdwh fieldset .root").html("");
			$(".sjwh .wrap .zdwh fieldset .root").html(shtml);
			$(".sjwh .wrap .zdwh fieldset .first").val("");
			$(".sjwh .wrap .zdwh fieldset .first").html("");
			$(".sjwh .wrap .zdwh fieldset .second").val("");
			$(".sjwh .wrap .zdwh fieldset .second").html("");
		}
	});

	param.condi = {};
	post_data("/sjwh_zdwh/", JSON.stringify(param), function(d){
		d = $.parseJSON(d);
		if (d.ErrCode == 0) {
			sjwh_zdwh_update_result_table(d.data);
		}
	});

}

function update_sjwh_dict(){
	//获取系统说明列表
	var pam = new Object();
	pam.method = "GET";
	sync_post_data("/dict", JSON.stringify(pam), function(d) {
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




function home_page() {
	
}


/*
function system_onload(){
	console.info($(".body .sjwh iframe")[0].contentWindow);
	//console.info($(window).height()-$(".wrapper-top").outerHeight());
	var iframe_body = $(".body .sjwh iframe")[0].contentDocument.body;
	var iframe_win = $(".body .sjwh iframe")[0].contentWindow;
	$(iframe_body).children('.wrap').height($(window).height()-$(".wrapper-top").outerHeight());
	console.info(iframe_win.location);
	console.info(iframe_win.window.document.body);
	$(".body .sjwh iframe").attr("scrolling", "yes");
	//$(".body .sjwh iframe").attr("scrolling", "no");
}*/





































