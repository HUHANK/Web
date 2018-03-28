
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

	dropbox.css("top", e.clientY+"px")
			.css("left", e.clientX+"px");
	dropbox.slideDown(200, function() {});
	dropbox.focus();
	dropbox.html('<div class="upt">更改</div><div class="del">删除</div>');

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
			console.info(d);
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
		/* Act on the event */
		$(".support .add-record table .system 	input").val('');
		$(".support .add-record table .module 	input").val('');
		$(".support .add-record table .type 	input").val('');
		$(".support .add-record table .sname 	input").val('');
		$(".support .add-record table .ftp 		input").val('');
		$(".support .add-record table .detail 	textarea").val('');
		$(".support .add-record table .bversion input").val('');
		$(".support .add-record table .pulno 	input").val('');
		//$(".support .add-record table .pdate 	input").val('');
		$(".support .add-record table .uptno 	input").val(0);
		$(".support .add-record table .status 	input").val('');
		$(".support .add-record table .remark 	textarea").val('');
		$(".support .add-record table .developer input").val('');
		$(".support .add-record table .charger 	input").val('');
		$(".support .add-record table .collaboration input").val('');
		$(".support .add-record table .pversion input").val('');
		$(".support .add-record table .gitb 	input").val('');
		$(".support .add-record table .uversion input").val('');

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
			console.info(d);
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
			console.info(d);
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

	var users = [];
	$(g_ALL_USER).each(function(index, el) {
		users.push(el.cname);
	});
	users.sort();
	hyl_select($(".support .add-record table .developer"), users);
	hyl_select($(".support .add-record table .charger"), users);


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

	console.info("XXXXXX");
	sync_post_data("/support/", JSON.stringify(param), function(d) {
		if (d.ErrCode != 0) {
			alter(d.msg);
		}

		var conf = {};
		conf.width = 2600;
		conf.height = 400;
		conf.columns = [
			{name: 'ID', 		field:'ID', 			width:'20', align:'center'},
			{name: '包类型', 	field:'TYPE', 			width:'40', align:'center'},
			{name: '系统', 		field:'SYSTEM', 		width:'40', align:'center'},
			{name: '模块', 		field:'MODULE', 		width:'40', align:'center'},
			{name: '包名称', 	field:'PACKAGE_NAME', 	width:'150', align:'center'},
			{name: 'FTP地址', 	field:'FTP_ADDR', 		width:'150', align:'center'},
			{name: '发布内容', 	field:'CONTENT', 		width:'300', align:'center'},
			{name: '基础版本', 	field:'BASE_VERSION', 	width:'100', align:'center'},
			{name: '发布流程号',field:'PUBLISH_SERIAL', width:'110', align:'center'},
			{name: '备注', 		field:'REMARK', 		width:'100', align:'center'},
			{name: '更新次数', 	field:'UPT_NUM', 		width:'40', align:'center'},
			{name: '发布日期', 	field:'PUBLISH_DATE', 	width:'70', align:'center'},
			{name: '状态', 		field:'STATUS', 		width:'40', align:'center'},
			{name: '开发员', 	field:'DEVELOPER', 		width:'50', align:'center'},
			{name: '负责人', 	field:'CHARGER', 		width:'50', align:'center'},
			{name: '计划版本', 	field:'PLAN_VERSION', 	width:'90', align:'center'},
			{name: 'Git分支', 	field:'GIT_BRANCH', 	width:'90', align:'center'},
			{name: '升级版本', 	field:'UPGRADE_VERSION',width:'90', align:'center'},
			{name: '协作号', 	field:'COLLABORATION', 	width:'100', align:'center'},
			{name: '创建者', 	field:'CRT_USER', 		width:'50', align:'center'},
			{name: '创建时间', 	field:'CRT_TIME', 		width:'80', align:'center'},
			{name: '更新者', 	field:'UPT_USER', 		width:'50', align:'center'},
			{name: '跟新时间', 	field:'UPT_TIME', 		width:'80', align:'center'}
		];
		conf.datas = d.data;

		hyl_table($(".support .show"), conf);

		// $(".support .show .hyl-grid-tbody tbody tr").click(function(event) {
		// 	/* Act on the event */
		// 	var sel = "selected"
		// 	$(this).parent().find(("."+sel)).removeClass(sel);
		// 	$(this).addClass(sel);
		// });

		$(".support .show .hyl-grid-tbody tbody tr").mousedown(function(event) {
			/* Act on the event */
			var sel = "selected"
			$(this).parent().find(("."+sel)).removeClass(sel);
			$(this).addClass(sel);
		});

	});

}