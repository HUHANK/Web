window.onload = main;

Options = new Object();
var NavbarIndexCookies = "HTZQ_NavbarIndex";

function main() {
	Options.SessionID = $.cookie("htzq_SessionID");
	GInit();
	InitHeader();
	var index = $.cookie(NavbarIndexCookies);
	if (typeof index == "undefined") 
		index = 1;
	initNavbar(index);
	navbar();
}

function InitHeader() {
	var param = new Object();
	param.SessionID = Options.SessionID;
	post_data("/baseinfo/", JSON.stringify(param), function(d) {
		d = $.parseJSON(d);
		var txt = "你好，" + d.UserName + "！";
		$(".header .subhead .yhxs").text(txt);

		txt = d.Date + "(第" + d.Week + "周)";
		$(".header .subhead .rqxs").text(txt);

	});
}

function GInit(){
	/*初始化日历控件*/
	jeDate.skin('gray');
	jeDate({
		dateCell:"#dateinfo",//isinitVal:true,
		format:"YYYY-MM-DD",
		isTime:false, //isClear:false,
		isinitVal:true,
		minDate:"2014-10-19 00:00:00",
		maxDate:"2020-11-8 00:00:00"
	})
	/*动态加载CSS文件*/
	$("<link>").attr({ rel: "stylesheet",type: "text/css",href: "css/zbxt.css"}).appendTo("head");

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
						console.info("result",d);
						if (d.ErrCode == 0) {
							var data = d.data;
							var shtml = "<option name='-1'></option>";
							for(var i=0; i<data.length; i++) {
								shtml += "<option name='"+data[i].id+"'>" + data[i].name + "</option>";
							}
							console.info(shtml);
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
							console.info(shtml);
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
	
}

function GUpdateBaseinfo(){
	var param = new Object();
	param.SessionID = Options.SessionID;
	sync_post_data("/baseinfo/", JSON.stringify(param), function(d){
		if (d.ErrCode == 0) {
			g_ALL_USER = d.Users;
			g_ALL_DEPART = d.Departs;
			g_ALL_GROUP = d.Groups;
		}else{
			alert("您没有登录！");
		}
	});
}

function initNavbar(index){
	index = parseInt(index)
	switch(index)
	{
		case 1:
			$(".body .home-page").css("display", "block");
			home_page();
			break;
		case 2:
			$(".body .query").css("display", "block");
			query();
			break;
		case 3:
			$(".body .add-zb").css("display", "block");
			add_zb();
			break;
		case 4:
			$(".body .sjwh").css("display", "block");
			data_protect();
			break;
	}
	$(".title .navbar ul li").each(function(i, data){
		if (i+1 == index) {
			$(data).addClass("clicked");
		}
	});
}

function navbar() {
	$(".navbar ul li").click(function(){
		//删除li的所有的class
		$(".navbar ul").children("li").each(function(index, data){
			$(data).removeClass("clicked");
		});
		//添加clicked的class
		$(this).addClass("clicked");
		var value = $(this).attr("value");
		if (value == "HomePage") {
			$(".body .home-page").css("display", "block");
			
			$(".body .add-zb").css("display", "none");
			$(".body .query").css("display", "none");
			$(".body .sjwh").css("display", "none");
			$.cookie(NavbarIndexCookies, 1);
			home_page();
		} else if (value == "Query"){
			$(".body .query").css("display", "block");

			$(".body .home-page").css("display", "none");
			$(".body .sjwh").css("display", "none");
			$(".body .add-zb").css("display", "none");
			$.cookie(NavbarIndexCookies, 2);
			query();
		} else if (value == "WZB") {
			$(".body .add-zb").css("display", "block");

			$(".body .home-page").css("display", "none");
			$(".body .query").css("display", "none");
			$(".body .sjwh").css("display", "none");
			$.cookie(NavbarIndexCookies, 3);
			add_zb();
		} else if (value == "SZWH") {
			$(".body .sjwh").css("display", "block");

			$(".body .home-page").css("display", "none");
			$(".body .query").css("display", "none");
			$(".body .add-zb").css("display", "none");
			$.cookie(NavbarIndexCookies, 4);
			data_protect();
		}

	});
}

function query() {
	$(".query .result .ztl button").click(function(){
		var pageIndex = parseInt($(".query .result .ztl .pageIndex").text());
		var totalPage = parseInt($(".query .result .ztl .totalPage").text());
		if ($(this).attr("value") == "pre") {

			if (pageIndex <= 1) {
				alert("已经是第一页");
				return;
			} else {
				pageIndex = pageIndex - 1;
			}
		}
		else if ($(this).attr("value") == "next") {
			if (pageIndex >= totalPage) {
				alert("已经是最后一页");
				return ;
			} else {
				pageIndex = pageIndex + 1;
			}
		}
		query_update_data(pageIndex - 1);
	});
	sidebar();
}

function sidebar() {
	var param = new Object();
	param.method = "GET";
	sync_post_data("/dict/", JSON.stringify(param), function(d) {
		Options.Dicts = d;
	});
	
	param.name = "all";
	sync_post_data("/getuserinfo/", JSON.stringify(param), function(d) {
		Options.UserInfo = d;
	});

	function sidebar_add_unit(obj, header, data, n) {
		var shtml = '<div class="yj" name="' + n + '">' + header + '</div>';
		shtml += '<div class="ej" name="' + n + '">';
		shtml += '<span style="all">全选</span>';
		for( var i=0; i<data.length; i++ ) {
			shtml += '<span style="unit">' + data[i] + '</span>';
		}
		shtml += '</div>';
		$(obj).append(shtml);
	}
	var data = [];
	for(var i=0; i<Options.UserInfo.length; i++) {
		data[i] = Options.UserInfo[i][1];
	}
	//$(".query .sidebar").children().remove();
	$(".query .sidebar").html("");
	sidebar_add_unit($(".query .sidebar"), "部门人员", data, "User");

	sidebar_add_unit($(".query .sidebar"), 
				Options.Dicts.SysModule.note, 
				Options.Dicts.SysModule.data,
				"SysModule");
	sidebar_add_unit($(".query .sidebar"), 
				Options.Dicts.Type.note, 
				Options.Dicts.Type.data,
				"Type");
	sidebar_add_unit($(".query .sidebar"), 
				Options.Dicts.Property.note, 
				Options.Dicts.Property.data,
				"Property");
	/*--------------------------------------------------*/

	$(".query .sidebar .yj").click(function() {
		var ej = $(this).next();
		if (ej.css("display") == "block"){
			ej.css("display", "none");
		}else {
			ej.css("display", "block");
		}
	});

	$('.query .sidebar .ej span[style="all"]').click(function() {
		var key = $(this).parent().attr("name");
		if ($(this).attr("class") == "sel") {
			$(this).removeClass("sel");
			$(this).siblings().each(function(index, data){
				$(data).removeClass("select");
				deal_query_condition(1, key, $(data).text());
			});
		} else {
			$(this).addClass("sel");
			$(this).siblings().each(function(index, data){
				$(data).addClass("select");
				deal_query_condition(0, key, $(data).text());
			});
		}
		query_update_data(0);
	});
	$('.query .sidebar .ej span[style="unit"]').click(function() {
		var key = $(this).parent().attr("name");
		if ($(this).attr("class") == "select") {
			$(this).removeClass("select");
			deal_query_condition(1, key, $(this).text());
		} else {
			$(this).addClass("select");
			deal_query_condition(0, key, $(this).text());
		}
		query_update_data(0);
	});

	query_update_data(0);
}

/*type:0 add type:1 delete*/
function deal_query_condition(type, key, value) {
	var qs;
	var NeedQueryBackground = 1;
	if (type == 0) {
		//add
		if ("User" == key) {
			qs = Options.QueryCondition.User;
			/*把用户的中文名转成对应的用户ID*/
			for(var i=0; i<Options.UserInfo.length; i++){
				if(Options.UserInfo[i][1] == value) {
					value = Options.UserInfo[i][0];
				}
			}
		} else if ("SysModule" == key) {
			qs = Options.QueryCondition.SysModule;
		} else if ("Property" == key) {
			qs = Options.QueryCondition.Property;
		} else if ("Type" == key) {
			qs = Options.QueryCondition.Type;
		}
		for(var i=0; i<qs.length; i++) {
			if (qs[i] == value) {
				NeedQueryBackground = 0;
			}
		}
		if (NeedQueryBackground == 1) {
			qs.push(value);
		}
	} else if (type == 1) {
		//delete
		if ("User" == key) {
			qs = Options.QueryCondition.User;
			/*把用户的中文名转成对应的用户ID*/
			for(var i=0; i<Options.UserInfo.length; i++){
				if(Options.UserInfo[i][1] == value) {
					value = Options.UserInfo[i][0];
				}
			}
		} else if ("SysModule" == key) {
			qs = Options.QueryCondition.SysModule;
		} else if ("Property" == key) {
			qs = Options.QueryCondition.Property;
		} else if ("Type" == key) {
			qs = Options.QueryCondition.Type;
		}
		for(var i=0; i<qs.length; i++) {
			if (qs[i] == value) {
				//delete qs[i];
				qs.splice(i, 1);
			}
		}
	}

	

}

function query_update_data(page) {
	var param = Options.QueryCondition;
	param.Page = page;
	post_data("/query1/", JSON.stringify(param), function(d) {
		d = $.parseJSON(d);
		//draw_table($(".query .result .box"), d.header, d.data); 
		$(".query .result .box").html("");

		jeui.use(["jeTable", "jeCheck"], function() {
			$(".query .result .box").jeTable({
				height:"740",
				isPage: false,
				datas: d.rows,
				columnSort:[],
				columns:[
					{name:"ID", 		field:"id", 		width:"40", align: "center", isShow:true, renderer:""},
					{name:"用户名", 		field:"UserName", 	width:"60", align: "center"},
					{name:"系统(模块)",	field:"SysModule", 	width:"140", align: "center"},
					{name:"类型", 		field:"Type", 		width:"70", align: "center"},
					{name:"跟踪号", 		field:"TraceNo", 	width:"60", align: "center"},
					{name:"工作内容", 	field:"Detail", 	width:"300", align: "center"},
					{name:"性质", 		field:"Property", 	width:"70", align: "center"},
					{name:"进度", 		field:"ProgressRate", width:"40", align: "center"},
					{name:"开始日期", 	field:"StartDate", 	width:"100", align: "center"},
					{name:"后续人日", 	field:"NeedDays", 	width:"70", align: "center"},
					{name:"备注", 		field:"Note", 		width:"300", align: "center"}
				],
				itemfun:function(elem, data) {
					elem.on('dblclick', function(event) {
						event.preventDefault();
						/* Act on the event */
					});
				}
			});
		});

		//console.info(d);
		$(".query .result .ztl .totalPage").text(d.totalPage);
		$(".query .result .ztl .totalCount").text(d.totalCount);
		$(".query .result .ztl .pageIndex").text(page+1);

	});
	
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
				pop_box("SUCCESS", 200, 120, d.msg, null, function(){
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

				jeui.use(["jeSelect"], function(){
					$("#je-popup-box-wrap select").jeSelect({
						sosList:true
					});
				});
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

				jeui.use(["jeSelect"], function(){
					$("#je-popup-box-wrap select").jeSelect({
						sosList:true
					});
				});

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
	// jeui.use(["jeSelect"], function() {
		
	// });
	
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

	$(".sjwh .wrap .zdwh .tool .add").click(function() {
	
		pop_box("字典添加", 400, 260, zdwh_add_html, function(){
			jeui.use(["jeSelect"], function(){
				$("#je-popup-box-wrap select").jeSelect({
					sosList:true
				});
			});
		});

	});
/*-----------------------test---------------------------*/
	jeui.use(["jeCheck"], function(){
		$(".sjwh .wrap .bmgl table").jeCheck({
            jename:"chunk",
            attrName:[false,"勾选"], 
            itemfun: function(elem,bool) {
                //console.log(bool)
                //console.log(elem.prop('checked'))
            },
            success:function(elem){
                jeui.chunkSelect(elem,'.sjwh .wrap .bmgl table thead input','on')
                
            }
        })
	});
	
/*-----------------------test---------------------------*/
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
						console.info($(this).attr("name"));
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
			console.info($(".sjwh .wrap .zdwh fieldset .root"));
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


function add_zb() {
	
	$(".add-zb .edit .zq button").click(function(){
		$(this).parent().children().each(function(index, data){
			$(data).removeClass("btn_clicked")
		});
		$(this).addClass('btn_clicked');
	});

	add_zb_update();

	/*获取字典信息*/
	var pam = new Object();
	pam.method = "GET";
	sync_post_data("/dict/", JSON.stringify(pam), function(d) {
		Options.Dicts = d;
	});
	
	draw_drop_down_box_select($(".add-zb .edit .sx .xtmk"), Options.Dicts.SysModule.data);
	draw_drop_down_box_select($(".add-zb .edit .sx .lx"), Options.Dicts.Type.data);
	draw_drop_down_box_select($(".add-zb .edit .sx .xz"), Options.Dicts.Property.data);

	
	$(".add-zb .btn-submit").click(add_zb_btn_submit);
}

function add_zb_update() {
	var param = new Object();
	param.SessionID = Options.SessionID;
	param.method = "GET";
	param.week = 0;
	/*添加本周工作*/
	post_data("/report/", JSON.stringify(param), function(d) {
		d = $.parseJSON(d);
		if (d.data.length>0)
			draw_table($(".add-zb .bzgz"), d.header, d.data);
		else{
			$(".add-zb .bzgz").html("<span>暂无记录</span>")
		}
	});

	/*添加下周工作*/
	param.week = 1;
	post_data("/report/", JSON.stringify(param), function(d) {
		d = $.parseJSON(d);
		if (d.data.length > 0)
			draw_table($(".add-zb .xzgz"), d.header, d.data);
		else {
			$(".add-zb .xzgz").html("<span>暂无记录</span>")
		}
	});
}

function add_zb_btn_submit(event) {
	var param = new Object();
	$(".add-zb .edit .zq button").each(function(index, data){
		if ($(data).attr("class") == "btn_clicked") {
			if ($(data).attr("value") == "now")
				param.week = 0;
			else if ($(data).attr("value") == "next")
				param.week = 1;
		}
	})

	param.SysModule = $(".add-zb .edit .sx .xtmk select").val();
	param.Type = $(".add-zb .edit .sx .lx select").val();
	param.TraceNo = $(".add-zb .edit .sx .gzh input").val();
	param.WorkDetail = $(".add-zb .edit .sx .gzln input").val();
	param.Property = $(".add-zb .edit .sx .xz select").val();
	param.ProgressRate = $(".add-zb .edit .sx .gzjd select").val();
	param.StartDate = $(".add-zb .edit .sx .ksrq input").val();
	param.NeedDays = $(".add-zb .edit .sx .hxrr input").val();
	param.Notes = $(".add-zb .edit .bz textarea").val();
	param.SessionID = Options.SessionID;

	if ($(this).attr("class") == "btn-submit") {
		param.method = "ADD";
		sync_post_data("/report/", JSON.stringify(param), function(d) {
		});
	}
	add_zb_update();
}

function home_page() {
	var param = new Object();
	param.SessionID = Options.SessionID;
	post_data("/home/", JSON.stringify(param), function(d) {
		d = $.parseJSON(d);
		d = d.bzgz;
		if (d.data.length>0)
			draw_table($(".home-page .wdbzgz"), d.header, d.data);
		else{
			$(".home-page .wdbzgz").html("<span>暂无记录</span>")
		}
	});
}








































