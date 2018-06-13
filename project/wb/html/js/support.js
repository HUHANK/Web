
function Support ( ) {
	querySupport();
}

function InitSupport ( ) {
	//SuportRepaint();
	init_add_record();
	$(".support").bind("contextmenu",function(e){
   		return false;
 	});
 	$("body .mouse-right-down").bind("contextmenu",function(e){
   		return false;
 	});
}

function SuportRepaint () {
	wheight = $(window).outerHeight();
	wwidth = $(window).width();


	qheight = parseInt(wheight) 
			- parseInt($("body .wrapper-top").outerHeight())
			- parseInt($(".support .wrap .option").outerHeight(true)) 
			- parseInt($(".support .wrap .show .table .thead").outerHeight());

	//console.info(window.screen.availHeight);
	console.info(wheight, $("body .wrapper-top").outerHeight(), $(".support .wrap .option").outerHeight(true), 
		$(".support .wrap .show .table .thead").outerHeight(), qheight);
	
	$(".support .wrap .show ").css("width", (wwidth)+"px");
	$(".support .wrap .show .table .tbody").css("height", (qheight-getScrollWidth()-1)+"px");
}

function SupportMouseRightDown(e) {
	var dropbox = $("body .mouse-right-down");

	dropbox.css("top", e.clientY+"px")
			.css("left", e.clientX+"px");
	dropbox.slideDown(200, function() {});
	dropbox.focus();
	dropbox.html(' 	<div class="upt">更改</div>\
					<div class="del">删除</div>\
					<div class="refresh">刷新</div>\
					<div class="examine">查看任务</div>');

	$("body").click(function(event) {
		setTimeout(function(){
			$("body .mouse-right-down").slideUp(100);
			$("body").unbind('click');
		}, 100);
	});

	$(".support .wrap .show").on("scroll", function(ev) {
		setTimeout(function(){
			$("body .mouse-right-down").slideUp(100);
			$(".support .wrap .show").unbind('scroll');
		}, 1);
	});

	dropbox.find(".upt").click(function(event) {
		if ($('.support .wrap .show .table .tbody .tr.selected' ).length < 1) {
			alert("请选取需要更新的行！");
			return true;
		}

		var param = {};
		param.ID = $('.support .wrap .show .table .tbody .tr.selected').attr("row");
		param.SessionID = Options.SessionID;
		param.method = "QUERY_ONE";
		sync_post_data("/support/", JSON.stringify(param), function(d) {
			if (d.ErrCode != 0) {
				alert("数据库查询失败！");
				return ;
			}

			var data = d.data[0];
			$(".support .add-record table .system 	input").val(data.SYSTEM);
			$(".support .add-record table .module 	input").val(data.MODULE);
			$(".support .add-record table .type 	input").val(data.TYPE);
			$(".support .add-record table .sname 	input").val(data.PACKAGE_NAME);
			$(".support .add-record table .ftp 		input").val(data.FTP_ADDR);
			$(".support .add-record table .detail 	textarea").val(data.CONTENT);
			$(".support .add-record table .bversion input").val(data.BASE_VERSION);
			$(".support .add-record table .pulno 	input").val(data.PUBLISH_SERIAL);
			$(".support .add-record table .pdate 	input").val(data.PUBLISH_DATE);
			$(".support .add-record table .uptno 	input").val(data.UPT_NUM);
			$(".support .add-record table .status 	input").val(data.STATUS);
			$(".support .add-record table .remark 	textarea").val(data.REMARK);
			$(".support .add-record table .developer input").val(data.DEVELOPER);
			$(".support .add-record table .charger 	input").val(data.CHARGER);
			$(".support .add-record table .collaboration input").val(data.COLLABORATION);
			$(".support .add-record table .pversion input").val(data.PLAN_VERSION);
			$(".support .add-record table .gitb 	input").val(data.GIT_BRANCH);
			$(".support .add-record table .uversion input").val(data.UPGRADE_VERSION);
			$(".support .add-record table .pronum   input").val(data.PROBLEM_NUM);
			$(".support .add-record table .note     textarea").val(data.NOTE);
			$(".support .add-record table .redmine  textarea").val(data.REDMINES);
		});

		var tb = $("body").children(".hyl-bokeh");
		tb.addClass("hyl-show");

		$(".support .add-record .head .title").text('更新Support包记录');
		$(".support .add-record").addClass('show');
		$(".support .add-record table .confirm").addClass('upt');
	});

	dropbox.find('.del').click(function(event) {
		/* Act on the event */
		if ($('.support .wrap .show table tbody tr.selected' ).length < 1) {
			alert("请选取需要删除的行！");
			return true;
		}

		var param = {};
		param.ID = $('.support .wrap .show table tbody tr.selected').attr("row");
		param.SessionID = Options.SessionID;
		param.method = "DELETE";
		sync_post_data("/support/", JSON.stringify(param), function(d) {
			if (d.ErrCode != 0) {
				alert("数据库删除失败！");
				return ;
			}
			querySupport();
		});
	});

	dropbox.find('.refresh').click(function(event) {
		/* Act on the event */
		querySupport();
	});

	dropbox.find('.examine').click(function(event) {
		if ($('.support .wrap .show table tbody tr.selected' ).length < 1) {
			alert("请选中一行数据！");
			return true;
		}
		var param = {};
		param.ID = $('.support .wrap .show table tbody tr.selected').attr("row");
		param.SessionID = Options.SessionID;
		param.method = "GETTASKINFO";
		sync_post_data("/support/", JSON.stringify(param), function(d) {
			if (d.ErrCode != 0) {
				alert("获取任务信息失败！");
				return ;
			}
			//console.info(d);

			var conf = {};
			conf.columns = [
				{name: '人员', 		field:'User', 			width:'60', align:'center'},
				{name: '系统', 		field:'System', 		width:'80', align:'center'},
				{name: '模块', 		field:'Module', 		width:'80', align:'center'},
				{name: '类型', 		field:'Type', 			width:'80', align:'center'},
				{name: '性质', 		field:'Property', 		width:'70', align:'center'},
				{name: '跟踪号', 	field:'TraceNo', 		width:'70', align:'center',
					renderer: function(data){
						return GenTraceNoAhref(data);
					}
				},
				{name: '工作内容', 	field:'Detail', 		width:'300', align:'left',
					renderer: function(data){
						return '<pre style="font-size:12px;">' + data + "</pre>";
					}
				},
				{name: '进度', 		field:'ProgressRate', 	width:'60', align:'center',
					renderer: function(data){
						return GenProgressBarHtml(60, 14, data);
					}
				}
			];
			conf.datas = d.data;

			hyl_table($(".support .task-show .result"), conf);

			$("body").children(".hyl-bokeh").addClass("hyl-show");
			$(".support .task-show").show(200, function() {});
		});
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

	var users = [];
	$(g_ALL_USER).each(function(index, el) {
		users.push(el.cname);
	});
	users.sort();
	hyl_select($(".support .add-record table .developer"), users);
	hyl_select($(".support .add-record table .charger"), users);


	//console.info(g_SUPPORT);
	$(g_SUPPORT).each(function(index, el) {
		if (el.name == "包类型"){
			data = []
			$(el.data).each(function(index, el) {
				data.push(el.name);
			});
			hyl_select($(".support .add-record table .type"), data);
		}else if(el.name == "状态"){
			data = []
			$(el.data).each(function(index, el) {
				data.push(el.name);
			});
			hyl_select($(".support .add-record table .status"), data);
		}
	});
	


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

	$(".support .add-record table .confirm").click(function(event) {
		/* Act on the event */
		var ret = false;
		if ($(this).hasClass('add')) {
			ret = addSupport("ADD");
			$(this).removeClass('add');
		} else if ($(this).hasClass('upt')) {
			ret = addSupport("UPT");
			$(this).removeClass('upt');
		}
		if (ret == true) {
			$("body").children(".hyl-bokeh").removeClass('hyl-show');
			$(".support .add-record").removeClass('show');
			querySupport();
		}
	});

	$(".support .add-record table .cancle").click(function(event) {
		/* Act on the event */
		$("body").children(".hyl-bokeh").removeClass('hyl-show');
		$(".support .add-record").removeClass('show');
	});

	$('.support .wrap .option button.add').click(function(event) {

		$(".support .add-record table .system 	input").val('');
		$(".support .add-record table .module 	input").val('');
		$(".support .add-record table .type 	input").val('');
		$(".support .add-record table .sname 	input").val('');
		$(".support .add-record table .ftp 		input").val('');
		$(".support .add-record table .detail 	textarea").val('');
		$(".support .add-record table .bversion input").val('');
		$(".support .add-record table .pulno 	input").val('');
		$(".support .add-record table .pdate 	input").val(GetNowDate2());
		$(".support .add-record table .uptno 	input").val(0);
		$(".support .add-record table .status 	input").val('');
		$(".support .add-record table .remark 	textarea").val('');
		$(".support .add-record table .developer input").val('');
		$(".support .add-record table .charger 	input").val('');
		$(".support .add-record table .collaboration input").val('');
		$(".support .add-record table .pversion input").val('');
		$(".support .add-record table .gitb 	input").val('');
		$(".support .add-record table .uversion input").val('');
		$(".support .add-record table .pronum 	input").val('0');
		$(".support .add-record table .note 	textarea").val('');
		$(".support .add-record table .redmine 	textarea").val('');

		var tb = $("body").children(".hyl-bokeh");
		tb.addClass("hyl-show");

		$(".support .add-record .head .title").text('添加Support包记录');
		$(".support .add-record").addClass('show');
		$(".support .add-record table .confirm").addClass('add');
	});

	$('.support .wrap .option button.upt').click(function(event) {
		/* Act on the event */
		if ($('.support .wrap .show table tbody tr.selected' ).length < 1) {
			alert("请选取需要更新的行！");
			return true;
		}

		var param = {};
		param.ID = $('.support .wrap .show table tbody tr.selected').attr("row");
		param.SessionID = Options.SessionID;
		param.method = "QUERY_ONE";
		sync_post_data("/support/", JSON.stringify(param), function(d) {
			if (d.ErrCode != 0) {
				alert("数据库查询失败！");
				return ;
			}
			//console.info(d);
			var data = d.data[0];

			$(".support .add-record table .system 	input").val(data.SYSTEM);
			$(".support .add-record table .module 	input").val(data.MODULE);
			$(".support .add-record table .type 	input").val(data.TYPE);
			$(".support .add-record table .sname 	input").val(data.PACKAGE_NAME);
			$(".support .add-record table .ftp 		input").val(data.FTP_ADDR);
			$(".support .add-record table .detail 	textarea").val(data.CONTENT);
			$(".support .add-record table .bversion input").val(data.BASE_VERSION);
			$(".support .add-record table .pulno 	input").val(data.PUBLISH_SERIAL);
			$(".support .add-record table .pdate 	input").val(data.PUBLISH_DATE);
			$(".support .add-record table .uptno 	input").val(data.UPT_NUM);
			$(".support .add-record table .status 	input").val(data.STATUS);
			$(".support .add-record table .remark 	textarea").val(data.REMARK);
			$(".support .add-record table .developer input").val(data.DEVELOPER);
			$(".support .add-record table .charger 	input").val(data.CHARGER);
			$(".support .add-record table .collaboration input").val(data.COLLABORATION);
			$(".support .add-record table .pversion input").val(data.PLAN_VERSION);
			$(".support .add-record table .gitb 	input").val(data.GIT_BRANCH);
			$(".support .add-record table .uversion input").val(data.UPGRADE_VERSION);
		});

		var tb = $("body").children(".hyl-bokeh");
		tb.addClass("hyl-show");

		$(".support .add-record .head .title").text('更新Support包记录');
		$(".support .add-record").addClass('show');
		$(".support .add-record table .confirm").addClass('upt');
	});

	$('.support .wrap .option button.del').click(function(event) {
		/* Act on the event */
		if ($('.support .wrap .show table tbody tr.selected' ).length < 1) {
			alert("请选取需要删除的行！");
			return true;
		}

		var param = {};
		param.ID = $('.support .wrap .show table tbody tr.selected').attr("row");
		param.SessionID = Options.SessionID;
		param.method = "DELETE";
		sync_post_data("/support/", JSON.stringify(param), function(d) {
			if (d.ErrCode != 0) {
				alert("数据库删除失败！");
				return ;
			}
			querySupport();
		});
	});

	$('.support .wrap .option button.exp').click(function(event) {
		$(".support .exp-sel .body table .col2 i").each(function(index, el) {
			$(el).addClass('selected');	
		});

		var tb = $("body").children(".hyl-bokeh");
		tb.addClass("hyl-show");
		$(".support .exp-sel").show(200, function() {});
	});

	$('.support .exp-sel button.exp').click(function(event) {
		var param = {};
		param.SessionID = Options.SessionID;
		param.method = "EXPORT";

		sync_post_data("/support/", JSON.stringify(param), function(d) {
			//console.info(d);
			if (d.ErrCode != 0) {
				alert(d.msg);
				return;
			}

			var data  = d.data;
			var html  = "";
			var shead = '';
			var sbody = '';

			var _names = [];
			var _fields = [];
			//console.info($(".support .exp-sel .body tbody col2 i"));
			$(".support .exp-sel .body tbody .col2 i.selected").each(function(index, el) {
				var col1 = $(el).parent().parent().parent().find('.col1');
				//console.info(col1);
				_names.push($.trim(col1.find("div").text()));
				_fields.push($.trim(col1.attr("class").split("\t")[0]));
			});
			
			shead = "<tr>";
			$(_names).each(function(index, el) {
				shead = shead + "<th>" + el + "</th>";
			});
			shead = shead + "</tr>";
			shead = '<thead>'+shead+"</thead>";

			$(data).each(function(index, el) {
				sbody = sbody + "<tr>";
				$(_fields).each(function(index, ell) {
					sbody = sbody + "<td>" + eval("el."+ell) + "</td>";
				});				
				sbody = sbody + "</tr>";
			});
			sbody = "<tbody>" + sbody + "<tbody>";

			html = "<table>" + shead + sbody + "</table>";

			if(getExplorer()=='ie') {
				alert("不支持IE导出！");
			} else {
				tableToExcel(html);
			}

		});
	});

	$(".support .exp-sel .head .exit").click(function(event) {
		var tb = $("body").children(".hyl-bokeh");
		tb.removeClass("hyl-show");
		$(".support .exp-sel").hide(300, function() {});
	});

	$(".support .exp-sel .body .table-body .col2 i").click(function(event) {
		if ($(this).hasClass('selected')) {
			$(this).removeClass('selected');
		}else{
			$(this).addClass('selected');
		}
	});

	$(".support .task-show .head .exit").click(function(event) {
		$("body").children(".hyl-bokeh").removeClass('hyl-show');
		$(".support .task-show").hide(200, function() {});
	});

	
	if (!g_CURRENT_USER_IS_ADMIN){
		$(".support .wrap .option button.add").css("display", "none");
		$('.support .wrap .option button.exp').css("display", "none");
	}
}

function addSupport(opt) {
	var param = {};
	var ret = true;

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
	param.pronum 		= sGetInputVal("pronum");
	param.note			= sGetTextareaVal("note");
	param.redmine		= sGetTextareaVal("redmine");

	if (param.uptno.length < 1) param.uptno = '0';
	if (param.pronum.length < 1) param.pronum = '0';
	
	param.SessionID = Options.SessionID;

	if (opt == "ADD") {
		param.method = "ADD";
		param.adduser = g_CURRENT_USER;
	} else if (opt == "UPT") {
		param.method = "UPDATE";
		param.uptuser = g_CURRENT_USER;
		param.ID = $('.support .wrap .show table tbody tr.selected').attr("row");
	}

	sync_post_data("/support/", JSON.stringify(param), function(d) {
		//console.info(d);
		if (d.ErrCode != 0) {
			alert("数据库更新失败!");
			ret = false;
			return ;
		}
	});

	return ret;
}

function querySupport() {
	var param = {};
	param.method    = "QUERY";
	param.SessionID = Options.SessionID;
	param.User = g_CURRENT_USER;

	sync_post_data("/support/", JSON.stringify(param), function(d) {
		if (d.ErrCode != 0) {
			alter(d.msg);
		}

		var conf = {};
		conf.width = 2600;
		conf.height = 400;
		conf.columns = [
			{name: '#', 		field:'ID', 			width:'40', align:'center'},
			{name: '包类型', 	field:'TYPE', 			width:'50', align:'center'},
			{name: '系统', 		field:'SYSTEM', 		width:'100', align:'center'},
			{name: '模块', 		field:'MODULE', 		width:'80', align:'center'},
			{name: '包名称', 	field:'PACKAGE_NAME', 	width:'350', align:'center'},
			//{name: 'FTP地址', 	field:'FTP_ADDR', 		width:'150', align:'center'},
			//{name: '发布内容', 	field:'CONTENT', 		width:'300', align:'center'},
			{name: '基础版本', 	field:'BASE_VERSION', 	width:'100', align:'center'},
			{name: '发布流程号',field:'PUBLISH_SERIAL', width:'110', align:'center'},
			// {name: '补充说明', 	field:'REMARK', 		width:'100', align:'center'},
			{name: '更新次数', 	field:'UPT_NUM', 		width:'60', align:'center'},
			{name: '发布日期', 	field:'PUBLISH_DATE', 	width:'80', align:'center'},
			{name: '状态', 		field:'STATUS', 		width:'70', align:'center'},
			{name: '开发员', 	field:'DEVELOPER', 		width:'60', align:'center'},
			{name: '负责人', 	field:'CHARGER', 		width:'60', align:'center'},
			{name: '计划版本', 	field:'PLAN_VERSION', 	width:'90', align:'center'},
			{name: 'Git分支', 	field:'GIT_BRANCH', 	width:'140', align:'center'},
			{name: '升级版本', 	field:'UPGRADE_VERSION',width:'90', align:'center'},
			{name: '协作号', 	field:'COLLABORATION', 	width:'100', align:'center'},
			{name: '创建者', 	field:'CRT_USER', 		width:'60', align:'center'},
			{name: '创建时间', 	field:'CRT_TIME', 		width:'140', align:'center'},
			{name: '更新者', 	field:'UPT_USER', 		width:'60', align:'center'},
			{name: '更新时间', 	field:'UPT_TIME', 		width:'140', align:'center'}
		];
		conf.datas = d.data;

		hyl_table2($(".support .show"), conf);

		/*重新绘制宽度和高度，去掉滚动条的宽度*/
		SuportRepaint();

		$(".support .show .table .tbody .tr").mousedown(function(event) {
			var sel = "selected"
			$(this).parent().find(("."+sel)).removeClass(sel);
			$(this).addClass(sel);
		});

	});

}