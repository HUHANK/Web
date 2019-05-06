//window.onload = main;

jQuery(document).ready(function($) {
	main();
});

// Options = new Object();
var NavbarIndexCookies = "HTZQ_NavbarIndex";

function main() {
	Options.SessionID = $.cookie("htzq_SessionID");
	GetSessionID();
	InitHeader();
	GInit();
	var index = $.cookie(NavbarIndexCookies);
	if (index == 'null' || typeof(index) == 'undefined') 
		index = 1;
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

	jeui.use(["jeSelect"], function(){
		$(".sjwh .wrap .xzgl .xzcysz .zcy").jeSelect({
			sosList:true
		});

		$("#je-popup-box-wrap select").jeSelect({
			sosList:true
		});
		
		$(".sjwh .wrap .zdwh fieldset select").jeSelect({
            sosList:true,
            itemfun:function(elem, index, val){
            	//console.info(elem, index, val);
            	
            	if (elem.attr("class") == "root") {
            		//console.info(elem.attr("class"));
            		var id = elem.children('option[selected="selected"]').attr("name");
            		var param = new Object();
            		param.SessionID = Options.SessionID;
					param.method = "GET";
					param.condi = {};
					param.condi.parent = id;
					sync_post_data("/sjwh_zdwh/", JSON.stringify(param), function(d){
						//console.info("result",d);
						if (d.ErrCode == 0) {
							var data = d.data;
							var shtml = "<option name='-1'></option>";
							for(var i=0; i<data.length; i++) {
								shtml += "<option name='"+data[i].id+"'>" + data[i].name + "</option>";
							}
							//console.info(shtml);
							var yj = $(".sjwh .wrap .zdwh fieldset .first");
							yj.html("");
							yj.val("");
							yj.html(shtml);
						}
					});

            	}else if (elem.attr("class") == "first") {
            		var id = elem.children('option[selected="selected"]').attr("name");
            		var param = new Object();
            		param.SessionID = Options.SessionID;
					param.method = "GET";
					param.condi = {};
					param.condi.parent = id;
					sync_post_data("/sjwh_zdwh/", JSON.stringify(param), function(d){
						//console.info("result",d);
						if (d.ErrCode == 0) {
							var data = d.data;
							var shtml = "<option name='-1'> </option>";
							for(var i=0; i<data.length; i++) {
								shtml += "<option name='"+data[i].id+"'>" + data[i].name + "</option>";
							}
							//console.info(shtml);
							var yj = $(".sjwh .wrap .zdwh fieldset .second");
							yj.html("");
							yj.val("");
							yj.html(shtml);
						}
					});
            	}

            }
        });
	});

	add_zb_ginit();
	query_sidebar_init();
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
			$.cookie(NavbarIndexCookies, 6);
			WeekReportMain();

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
			jeui.use(["jquery", "jeBox"], function(){
				pop_box("ERROR", 200, 120, "确认密码不能与新密码不一致!");
			})
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

				// jeui.use(["jeSelect"], function(){
				// 	$("#je-popup-box-wrap .bmgl .manager").jeSelect({
				// 		sosList:true
				// 	});
				// });
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

				// jeui.use(["jeSelect"], function(){
				// 	$("#je-popup-box-wrap .xzgl select").jeSelect({
				// 		sosList:true
				// 	});
				// });

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
					
					// jeui.use(["jeSelect"], function(){
					// 	$("#je-popup-box-wrap .zdwh select").jeSelect({
					// 		sosList:true
					// 	});
					// });
					
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
	var param = new Object();
	param.SessionID = Options.SessionID;
	param.method = "GET";

	sync_post_data("/sjwh_bmgl/", JSON.stringify(param), function(d){
		if (d.ErrCode == 0) {
			je_table($(".sjwh .wrap .bmgl .table"),{
				width:"453",
				isPage: false,
				datas:d.data,
				columnSort:[],
				columns:[
					{	name:["选择",function(){return '<input type="checkbox" name="checkbox" class="gocheck" jename="chunk">';}], 
						field:"id", 
						width: "50", 
						align: "center",
						renderer:function(obj, rowidex) {
        					return '<input type="checkbox" name="checkbox" jename="chunk">';
        				}
					},
					{name: "ID", field: "id", width: "40", align:"center"},
					{name: "部门名称", field: "name", width: "140", align:"center"},
					{name: "部门负责人", field: "manager", width: "120", align:"center"},
					{name:"操作", field:'id', width:"100", align:"center", 
						renderer:function(obj, rowidex) {
							//console.log(obj);
                    		return '<button name="'+obj.id+'" type="edit" class="je-btn je-bg-blue je-btn-small"><i class="je-icon">&#xe63f;</i></button> \
    							<button  name="'+obj.id+'" type="delete" class="je-btn je-bg-red je-btn-small"><i class="je-icon">&#xe63e;</i></button>';
                    	}
                	}
				],
				itemfun:function(elem,data){

				},
				success:function(elCell, tbody) {
					elCell.jeCheck({
		                jename:"chunk",
		                checkCls:"je-check",
		                itemfun: function(elem,bool) {
		                    //alert(elem.attr("jename")
		                },
		                success:function(elem){
		                    jeui.chunkSelect(elem,".sjwh .wrap .bmgl .table .gocheck",'on')
		                }
		            });

					$(".sjwh .wrap .bmgl .table button").click(function(){
						var param = new Object();
						param.SessionID  = Options.SessionID;
						if ($(this).attr("type") == "delete") {
							param.method = "DELETE";
							param.id = $(this).attr("name");
							sync_post_data("/sjwh_bmgl/", JSON.stringify(param), function(d){
								if (d.ErrCode == 0) {
									sjwh_bmgl_update();
									GUpdateBaseinfo();
								} else {
									pop_box("ERROR", 200, 120, d.msg);
								}
							});
						}
						else if ($(this).attr("type") == "edit") {

						}
					});
				}	
			});
		}else {
			pop_box("ERROR", 200, 120, d.msg);
		}
	});
}

function sjwh_xzgl_show() {

	var param = new Object();
	param.SessionID  = Options.SessionID;
	param.method = "GET_GROUP_USER";
	param.id = $(".sjwh .wrap .xzgl .clicked").find("button").attr("name");

	sync_post_data("/sjwh_xzgl/", JSON.stringify(param), function(d){
		if(d.ErrCode == 0){
			var data = d.data;
			for(var i=0; i<data.length; i++) {
				for(var j=0; j<g_ALL_GROUP.length; j++) {
					if (data[i].group_id == g_ALL_GROUP[j].id) {
						data[i].group_id = g_ALL_GROUP[j].name;
						break;
					}
				}
			}
			
			je_table($(".sjwh .wrap .xzgl .table2"),{
				width:"573",
				isPage: false,
				datas: data,
				columnSort:[],
				columns:[
					{	name:["选择",function(){return '<input type="checkbox" name="checkbox" class="gocheck" jename="chunk">';}], 
						field:"id", 
						width: "50", 
						align: "center",
						renderer:function(obj, rowidex) {
        					return '<input type="checkbox" name="checkbox" jename="chunk">';
        				}
					},
					{name: "ID", field: "id", width: "40", align:"center"},
					{name: "成员名称", field: "user_name", width: "140", align:"center"},
					{name: "所属组", field: "group_id", width: "120", align: "center"},
					{name:"操作", field:'id', width:"100", align:"center", 
						renderer:function(obj, rowidex) {
							//console.log(obj);
                    		return '<button name="'+obj.id+'" type="edit" class="je-btn je-bg-blue je-btn-small"><i class="je-icon">&#xe63f;</i></button> \
    							<button  name="'+obj.id+'" type="delete" class="je-btn je-bg-red je-btn-small"><i class="je-icon">&#xe63e;</i></button>';
                    	}
                	}
				],
				itemfun:function(elem,data){},
				success:function(elCell, tbody) {
					elCell.jeCheck({
		                jename:"chunk",
		                checkCls:"je-check",
		                itemfun: function(elem,bool) {
		                    //alert(elem.attr("jename")
		                },
		                success:function(elem){
		                    jeui.chunkSelect(elem,".sjwh .wrap .xzgl .table2 .gocheck",'on')
		                }
		            });

					$(".sjwh .wrap .xzgl .table2 button").click(function(){
						var param = new Object();
						param.SessionID  = Options.SessionID;
						//console.info($(this).attr("name"));
						if ($(this).attr("type") == "delete") {
							param.method = "DELETE_USER_GROUP";
							param.id = $(this).attr("name");
							sync_post_data("/sjwh_xzgl/", JSON.stringify(param), function(d){
								if (d.ErrCode == 0) {
									sjwh_xzgl_show();
								} else {
									pop_box("ERROR", 200, 120, d.msg);
								}
							});
						}
						else if ($(this).attr("type") == "edit") {

						}
					});
				}
			});
		}
	});
}

function sjwh_xzgl_update() {
	var param = new Object();
	param.SessionID = Options.SessionID;
	param.method = "GET";

	sync_post_data("/sjwh_xzgl/", JSON.stringify(param), function(d){
		//console.log(d);
		if (d.ErrCode == 0){
			je_table($(".sjwh .wrap .xzgl .table"),{
				width:"573",
				isPage: false,
				datas:d.data,
				columnSort:[],
				columns:[
					{	name:["选择",function(){return '<input type="checkbox" name="checkbox" class="gocheck" jename="chunk">';}], 
						field:"id", 
						width: "50", 
						align: "center",
						renderer:function(obj, rowidex) {
        					return '<input type="checkbox" name="checkbox" jename="chunk">';
        				}
					},
					{name: "ID", field: "id", width: "40", align:"center"},
					{name: "小组名称", field: "name", width: "140", align:"center"},
					{name: "小组负责人", field: "manager", width: "120", align: "center"},
					{name: "所属部门", field: "depart", width: "120", align: "center"},
					{name:"操作", field:'id', width:"100", align:"center", 
						renderer:function(obj, rowidex) {
							//console.log(obj);
                    		return '<button name="'+obj.id+'" type="edit" class="je-btn je-bg-blue je-btn-small"><i class="je-icon">&#xe63f;</i></button> \
    							<button  name="'+obj.id+'" type="delete" class="je-btn je-bg-red je-btn-small"><i class="je-icon">&#xe63e;</i></button>';
                    	}
                	}
				],
				itemfun:function(elem,data){
					$(elem).click(function(){
						$(".sjwh .wrap .xzgl .clicked").removeClass("clicked");
						$(this).addClass('clicked');
						sjwh_xzgl_show();
					});
				},
				success:function(elCell, tbody) {
					elCell.jeCheck({
		                jename:"chunk",
		                checkCls:"je-check",
		                itemfun: function(elem,bool) {
		                    //alert(elem.attr("jename")
		                },
		                success:function(elem){
		                    jeui.chunkSelect(elem,".sjwh .wrap .xzgl .table .gocheck",'on')
		                }
		            });

					$(".sjwh .wrap .xzgl .table button").click(function(){
						var param = new Object();
						param.SessionID  = Options.SessionID;
						if ($(this).attr("type") == "delete") {
							param.method = "DELETE";
							param.id = $(this).attr("name");
							sync_post_data("/sjwh_xzgl/", JSON.stringify(param), function(d){
								if (d.ErrCode == 0) {
									sjwh_xzgl_update();
									GUpdateBaseinfo();
								} else {
									pop_box("ERROR", 200, 120, d.msg);
								}
							});
						}
						else if ($(this).attr("type") == "edit") {

						}
					});
				}	
			});
		}
	});

	//console.info(g_ALL_USER);
	var shtml = "";
	var zcy = $(".sjwh .wrap .xzgl .xzcysz .zcy");
	zcy.html("");
	shtml += "<option name='-1'><option>";
	for(var i = 0; i<g_ALL_USER.length; i++) {
		shtml += "<option name='"+g_ALL_USER[i].id+"'>"+ g_ALL_USER[i].cname+"</option>";
	}
	zcy.html(shtml);

	$(".sjwh .wrap .xzgl .xzcysz .add").click(function(){
		//console.info($(zcy).find("option[selected='selected']").attr("name"));

		var param = new Object();
		param.SessionID  = Options.SessionID;
		param.method = "UPDATE_USER_GROUP";
		param.uid = $(zcy).find("option[selected='selected']").attr("name");
		param.gid = $(".sjwh .wrap .xzgl .clicked").find("button").attr("name");
		//console.info(param);
		sync_post_data("/sjwh_xzgl/", JSON.stringify(param), function(d){
			if(d.ErrCode == 0) {
				sjwh_xzgl_show();
			}
		});
	});

}

function sjwh_zdwh_update_result_table(d) {
	$(".sjwh .wrap .zdwh .result").html("");
	je_table($(".sjwh .wrap .zdwh .result"),{
		height:"500",
		isPage: false,
		datas:d,
		columnSort:[],
		columns:[
			{	name:["选择",function(){return '<input type="checkbox" name="checkbox" class="gocheck" jename="chunk">';}], 
				field:"id", 
				width: "100", 
				align: "center",
				renderer:function(obj, rowidex) {
					return '<input type="checkbox" name="checkbox" jename="chunk">';
				}
			},
			{name: "ID", field: "id", width: "80", align:"center"},
			{name: "字典名称", field: "name", width: "200", align:"center"},
			{name: "父节点名称", field: "parent", width: "200", align: "center"},
			{name: "是否是根节点", field: "isRoot", width: "120", align: "center",
				renderer:function(obj, rowidex) {
					if (obj.isRoot == 0) {
						return "否";
					} else {
						return "是";
					}
				}}
		],
		itemfun:function(elem,data){

		},
		success:function(elCell, tbody) {
			elCell.jeCheck({
                jename:"chunk",
                checkCls:"je-check",
                itemfun: function(elem,bool) {
                    //alert(elem.attr("jename")
                },
                success:function(elem){
                    jeui.chunkSelect(elem,".sjwh .wrap .zdwh .result .gocheck",'on')
                }
            });
		}	
	});
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
	var param = new Object();
	param.SessionID = Options.SessionID;
	post_data("/home/", JSON.stringify(param), function(d) {
		d = $.parseJSON(d);
		//console.info(d);
		if (d.ErrCode == 0) {
			//console.info(d.data);
			var NowDate = parseInt(GetNowDate());
			for(var i=0; i<d.data.length; i++) {
				var row = d.data[i];
				var tmp = row.EditDate;
				var eDate = row.EditDate;
				row.EditDate = tmp[0]+tmp[1]+tmp[2]+tmp[3]+ "-" +tmp[4]+tmp[5]+ "-" +tmp[6]+tmp[7];
				tmp = row.ExpireDate;
				row.ExpireDate = tmp[0]+tmp[1]+tmp[2]+tmp[3]+ "-" +tmp[4]+tmp[5]+ "-" +tmp[6]+tmp[7];
				/**==================================================*/
				if (row.ProgressRate < 100) {
					if (parseInt(tmp) < NowDate) {
						row.ExpireDays = DateDiffNow('d', tmp);
					} else {
						row.ExpireDays = 0;
					}
				} else {
					//row.ExpireDays = DateDiff('d', eDate, tmp );
					row.ExpireDays = 0;
				}
				/**==================================================*/
			}
			for(var i=0; i<d.cxzgz.length; i++) {
				var row = d.cxzgz[i];
				var tmp = row.EditDate;
				var eDate = row.EditDate;
				row.EditDate = tmp[0]+tmp[1]+tmp[2]+tmp[3]+ "-" +tmp[4]+tmp[5]+ "-" +tmp[6]+tmp[7];
				tmp = row.ExpireDate;
				row.ExpireDate = tmp[0]+tmp[1]+tmp[2]+tmp[3]+ "-" +tmp[4]+tmp[5]+ "-" +tmp[6]+tmp[7];
				/**==================================================*/
				if (row.ProgressRate < 100) {
					if (parseInt(tmp) < NowDate) {
						row.ExpireDays = DateDiffNow('d', tmp);
					} else {
						row.ExpireDays = 0;
					}
				} else {
					//row.ExpireDays = DateDiff('d', eDate, tmp );
					row.ExpireDays = 0;
				}
				/**==================================================*/
			}
			for(var i=0; i<d.cbzgz.length; i++) {
				var row = d.cbzgz[i];
				var tmp = row.EditDate;
				var eDate = row.EditDate;
				row.EditDate = tmp[0]+tmp[1]+tmp[2]+tmp[3]+ "-" +tmp[4]+tmp[5]+ "-" +tmp[6]+tmp[7];
				tmp = row.ExpireDate;
				row.ExpireDate = tmp[0]+tmp[1]+tmp[2]+tmp[3]+ "-" +tmp[4]+tmp[5]+ "-" +tmp[6]+tmp[7];
				/**==================================================*/
				if (row.ProgressRate < 100) {
					if (parseInt(tmp) < NowDate) {
						row.ExpireDays = DateDiffNow('d', tmp);
					} else {
						row.ExpireDays = 0;
					}
				} else {
					//row.ExpireDays = DateDiff('d', eDate, tmp );
					row.ExpireDays = 0;
				}
				/**==================================================*/
			}

			je_table($(".home-page .wdbzgz"),{
				width: "1143",
				isPage: false,
				datas: d.data,
				columnSort: [],
				columns: [
					{name: "系统", 		field: "System", 	width: "70", align:"center"},
					{name: "模块", 		field: "Module", 	width: "60", align:"center"},
					{name: "类型", 		field: "Type", 		width: "70", align:"center"},
					{name: "跟踪号", 	field: "TraceNo", 	width: "60", align:"center",
						renderer:function(obj, rowidex) {
							return GenTraceNoAhref(obj.TraceNo);
						}
					},
					{name: "工作内容", 	field: "Detail", 	width: "290", align:"left",
						renderer:function(obj, rowidex) {
							return '<pre style="font-size:12px;">' + obj.Detail + "</pre>";
						}
					},
					{name: "性质", 		field: "Property", 	width: "70", align:"center"},
					{name: "进度", 		field: "ProgressRate", width: "80", align:"center",
						renderer:function(obj, rowidex) {
							return GenProgressBarHtml(70, 14, obj.ProgressRate);
						}},
					{name: "开始日期", 		field: "StartDate", width: "100", align:"center"},
					{name: "更新日期", 		field: "EditDate", width: "100", align:"center"},
					{name: "后续人日", 		field: "NeedDays", width: "70", align:"center"},
					{name: "计划完成日期", 		field: "ExpireDate", width: "100", align:"center"},
					{name: "延期天数",		field: "ExpireDays", width: "70", align:"center"}
				],
				itemfun:function(elem,data){},
				success:function(elCell, tbody){}
			});

			if (d.isManager > 0) {
				$(".home-page .child").css("display", "block");
				je_table($(".home-page .child .zcybzgz"),{
					width: "1223",
					isPage: false,
					datas: d.cbzgz,
					columnSort: [],
					columns: [
						{name: "成员", field: "User", width: "80", align:"center"},
						{name: "系统", 		field: "System", 	width: "70", align:"center"},
						{name: "模块", 		field: "Module", 	width: "60", align:"center"},
						{name: "类型", 		field: "Type", 		width: "70", align:"center"},
						{name: "跟踪号", 	field: "TraceNo", 	width: "60", align:"center",
							renderer:function(obj, rowidex) {
								return GenTraceNoAhref(obj.TraceNo);
							}
						},
						{name: "工作内容", 	field: "Detail", 	width: "290", align:"left",
							renderer:function(obj, rowidex) {
								return '<pre style="font-size:12px;">' + obj.Detail + "</pre>";
							}
						},
						{name: "性质", 		field: "Property", 	width: "70", align:"center"},
						{name: "进度", 		field: "ProgressRate", width: "80", align:"center",
							renderer:function(obj, rowidex) {
								return GenProgressBarHtml(70, 14, obj.ProgressRate);
							}},
						{name: "开始日期", 		field: "StartDate", width: "100", align:"center"},
						{name: "更新日期", 		field: "EditDate", width: "100", align:"center"},
						{name: "后续人日", 		field: "NeedDays", width: "70", align:"center"},
						{name: "计划完成日期", 		field: "ExpireDate", width: "100", align:"center"},
						{name: "延期天数",		field: "ExpireDays", width: "70", align:"center"}
					],
					itemfun:function(elem,data){},
					success:function(elCell, tbody){}
				});
				je_table($(".home-page .child .zcyxzgz"),{
					width: "1223",
					isPage: false,
					datas: d.cxzgz,
					columnSort: [],
					columns: [
						{name: "成员", field: "User", width: "80", align:"center"},
						{name: "系统", 		field: "System", 	width: "70", align:"center"},
						{name: "模块", 		field: "Module", 	width: "60", align:"center"},
						{name: "类型", 		field: "Type", 		width: "70", align:"center"},
						{name: "跟踪号", 	field: "TraceNo", 	width: "60", align:"center",
							renderer:function(obj, rowidex) {
								return GenTraceNoAhref(obj.TraceNo);
							}
						},
						{name: "工作内容", 	field: "Detail", 	width: "290", align:"left",
							renderer:function(obj, rowidex) {
								return '<pre style="font-size:12px;">' + obj.Detail + "</pre>";
							}
						},
						{name: "性质", 		field: "Property", 	width: "70", align:"center"},
						{name: "进度", 		field: "ProgressRate", width: "80", align:"center",
							renderer:function(obj, rowidex) {
								return GenProgressBarHtml(70, 14, obj.ProgressRate);
							}},
						{name: "开始日期", 		field: "StartDate", width: "100", align:"center"},
						{name: "更新日期", 		field: "EditDate", width: "100", align:"center"},
						{name: "后续人日", 		field: "NeedDays", width: "70", align:"center"},
						{name: "计划完成日期", 		field: "ExpireDate", width: "100", align:"center"},
						{name: "延期天数",		field: "ExpireDays", width: "70", align:"center"},
					],
					itemfun:function(elem,data){},
					success:function(elCell, tbody){}
				});
			}
		} else {
			alert(d.msg);
		}
	});
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





































