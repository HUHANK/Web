
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
	wheight = $(window).outerHeight();
	wwidth = $(window).width();


	qheight = parseInt(wheight) 
			- parseInt($("body .wrapper-top").outerHeight())
			- parseInt($(".support .wrap .option").outerHeight(true)) 
			- parseInt($(".support .wrap .show .table .thead").outerHeight());
	// console.info(wheight, $("body .wrapper-top").outerHeight(), $(".support .wrap .option").outerHeight(true), $(".support .wrap .show .table .thead").outerHeight());

	$(".support .wrap .show ").css("width", (wwidth)+"px");
	$(".support .wrap .show .table .tbody").css("height", (qheight-getScrollWidth()-3)+"px");
	// $(".support .wrap .show .table .tbody").css('width', wwidth+'px');
	// console.info("AAAAAAAAAAAAAA", qheight, getScrollWidth());
}

function fexamine(){
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
		/*设置标题*/
		$(".support .task-show .head .title").text(" # "+data.ID);

		/*设置主题*/
		$(".support .task-show .content .subject .title").text(data.PACKAGE_NAME);

		/*Set Author*/
		$(".support .task-show .content .author .cuser").text(data.CRT_USER);
		$(".support .task-show .content .author .uuser").text(data.UPT_USER);
		var tmp = data.CRT_TIME.substring(0,10);
		var tstr = '';
		var diff = 0;
		if ((diff=DateDiffNow('n', tmp)) < 1) tstr = "刚刚";
		else if((diff=DateDiffNow('n', tmp)) < 60) tstr = diff + "分钟";
		else if((diff=DateDiffNow('h', tmp)) < 24) tstr = diff + "小时";
		else if((diff=DateDiffNow('d', tmp)) < 7) tstr = diff + "天";
		else if((diff=DateDiffNow('w', tmp)) < 6) tstr = diff + "周";
		else if((diff=DateDiffNow('m', tmp))) tstr = diff+"个月";
		
		$(".support .task-show .content .author .cdate").text(tstr);
		tmp = data.UPT_TIME.substring(0, 10);
		if ((diff=DateDiffNow('n', tmp)) < 1) tstr = "刚刚";
		else if((diff=DateDiffNow('n', tmp)) < 60) tstr = diff + "分钟";
		else if((diff=DateDiffNow('h', tmp)) < 24) tstr = diff + "小时";
		else if((diff=DateDiffNow('d', tmp)) < 7) tstr = diff + "天";
		else if((diff=DateDiffNow('w', tmp)) < 6) tstr = diff + "周";
		else if((diff=DateDiffNow('m', tmp))) tstr = diff+"个月";
		$(".support .task-show .content .author .udate").text(tstr);

		/*---------------------------*/
		$(".support .task-show .content .attributes .status .value").text(data.STATUS);
		$(".support .task-show .content .attributes .publishdate .value").text(data.PUBLISH_DATE.substring(0, 10));
		$(".support .task-show .content .attributes .crtuser .value").text(data.CRT_USER);
		$(".support .task-show .content .attributes .crtdate .value").text(data.CRT_TIME.substring(0, 10));
		$(".support .task-show .content .attributes .uptdate .value").text(data.UPT_TIME.substring(0, 10));
		$(".support .task-show .content .attributes .uptuser .value").text(data.UPT_USER);
		$(".support .task-show .content .attributes .type .value").text(data.TYPE);
		$(".support .task-show .content .attributes .publishserial .value").text(data.PUBLISH_SERIAL);
		$(".support .task-show .content .attributes .system .value").text(data.SYSTEM);
		$(".support .task-show .content .attributes .module .value").text(data.MODULE);
		$(".support .task-show .content .attributes .baseversion .value").text(data.BASE_VERSION);
		$(".support .task-show .content .ftp .value").text(data.FTP_ADDR);
		$(".support .task-show .content .pcontent .value").text(data.CONTENT.length == 0 ? '无' : data.CONTENT);

		$(".support .task-show .content .attributes .charger .value").text(data.CHARGER);
		$(".support .task-show .content .attributes .developer .value").text(data.DEVELOPER);
		$(".support .task-show .content .attributes .collaboration .value").text(data.COLLABORATION);
		$(".support .task-show .content .attributes .gitbranch .value").text(data.GIT_BRANCH);
		$(".support .task-show .content .attributes .uptnum .value").text(data.UPT_NUM);
		$(".support .task-show .content .attributes .problemnum .value").text(data.PROBLEM_NUM);
		$(".support .task-show .content .attributes .planversion .value").text(data.PLAN_VERSION);
		$(".support .task-show .content .attributes .upgradeversion .value").text(data.UPGRADE_VERSION);

		$(".support .task-show .content .remark .value").text(data.REMARK.length == 0 ? '无' : data.REMARK);
		$(".support .task-show .content .redmines .value").text(data.REDMINES.length == 0 ? '无' : data.REDMINES);
		$(".support .task-show .content .note .value").text(data.NOTE.length == 0 ? '无' : data.NOTE);

		$("body").children(".hyl-bokeh").addClass('hyl-show');
		$(".support .task-show").show(10);
	});
}

function SupportMouseRightDown(e) {
	var dropbox = $("body .mouse-right-down");
	dropbox.css("top", e.clientY+"px")
			.css("left", e.clientX+"px");
	dropbox.html(' 	<div class="upt">更改</div>\
					<div class="del">删除</div>\
					<div class="refresh">刷新</div>\
					<div class="examine">查看详细</div>');
	dropbox.slideDown(60, function() {});
	dropbox.focus();

	$("body").click(function(event) {
		setTimeout(function(){
			$("body .mouse-right-down").slideUp(20);
			$("body").unbind('click');
		}, 60);
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
			$(".support .add-record table .ftp 		textarea").val(data.FTP_ADDR);
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
		if ($('.support .wrap .show .table .tbody .tr.selected' ).length < 1) {
			alert("请选取需要删除的行！");
			return true;
		}

		var param = {};
		param.ID = $('.support .wrap .show .table .tbody .tr.selected').attr("row");
		param.SessionID = Options.SessionID;
		param.method = "DELETE";
		sync_post_data("/support/", JSON.stringify(param), function(d) {
			if (d.ErrCode != 0) {
				//alert("数据库删除失败！");
				hyl_alert2("error", "删除失败");
				return ;
			}
			hyl_alert2("success", "删除成功", function(){
				querySupport();
			});
		});
	});

	dropbox.find('.refresh').click(function(event) {
		/* Act on the event */
		querySupport();
		hyl_alert2("success", "成功刷新");
	});

	dropbox.find('.examine').click(function(event) {
		fexamine();
	});

	return false;
}

function SupportMouseRightDownBatch(e){
	var dropbox = $("body .mouse-right-down");
	dropbox.css("top", e.clientY+"px")
			.css("left", e.clientX+"px");
	dropbox.html('<div class="upt">批量更改</div>');
	dropbox.slideDown(60, function() {});
	dropbox.focus();

	$("body").click(function(event) {
		setTimeout(function(){
			$("body .mouse-right-down").slideUp(20);
			$("body").unbind('click');
		}, 60);
	});

	dropbox.find(".upt").unbind();
	dropbox.find(".upt").click(function(event) {
		var l = new Array();
		$(".support .show .table .tbody .tr.selected").each(function(index, el) {
			l.push("#"+$(el).attr("row"));
		});
		var str = "批量更新Support [" + l.join(", ")+"]";
		$(".support .batch-wrap .head .title").text(str);

		$(".support .batch-wrap .upt .pversion").val('');
		$(".support .batch-wrap .upt .gitbranch").val('');
		$(".support .batch-wrap .upt .uversion").val('');

		$(".support .batch-wrap").show();
		$("body").children(".hyl-bokeh").addClass("hyl-show");
		
	});


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

	var users = {};
	var usersa = [];
	$(g_ALL_USER).each(function(index, el) {
		uname = el.cname;
		usersa.push(el.cname);
		gname = el.group_name;
		if (gname) {
			if (!users[gname]) users[gname] = [];
			users[gname].push(uname);
		}
	});
	for (key in users) {
		users[key] = arraySortByPinyin(users[key]);
	}

	/*-----------------------------负责人下拉框----------------------------------------*/
	var batch_charger = $(".support .batch-wrap .upt .charger");
	usersa = arraySortByPinyin(usersa);
	batch_charger.append($("<option></option>"));
	$(usersa).each(function(index, el) {
		batch_charger.append($("<option></option>").text(el));
	});
	/*---------------------------------*/
	var charger = $(".support .add-record table .charger");
	var obj = $("<div></div>").addClass('combo-dropdown');
	obj.css({
		'display':'none',
		'position': 'fixed',
		'max-height':'200px',
		'background-color': 'white',
		'border': '1px solid #3BB4F2',
		'box-shadow': '0px 0px 3px #3BB4F2',
		'margin-top': '2px',
		'overflow': 'auto'
	});
	
	obj.append($('<div><<我>></div>').addClass('option-item').css("padding-left", "10px"));
	for (key in users) {
		var managerName = '';
		for (i in g_ALL_GROUP) {
			if (g_ALL_GROUP[i].name == key) {
				managerName = g_ALL_GROUP[i].manager_name;
			}
		}
		var gt = $("<div></div>").addClass('option-group').text(">> "+key);
		gt.css({
			'font-style': 'italic',
			'color': '#ACACAC',
			'background-color': '#EDEDED'
		});
		obj.append(gt);
		for (i in users[key]) {
			var ut =$("<div></div>").addClass('option-item').text(users[key][i]);
			ut.css({
				'padding-left': '10px'
			});
			if (users[key][i] == managerName) {
				ut.css({'color': '#FB3636', 'font-weight':'bold'});
			}
			obj.append(ut)
		}
	}
	charger.append(obj);
	charger.children('div').css({
		'padding': '2px'
	});

	var _input = charger.find("input");
	_input.unbind();
	_input.focus(function(event) {
		charger.find('.combo-dropdown').css({
			'width': $(_input).outerWidth()+"px",
			'top'  : $(_input).outerHeight()+($(_input).offset().top-$(document).scrollTop())+"px",
			'left' : $(_input).offset().left+"px"
		});
		charger.find('.combo-dropdown').slideDown();
	});

	charger.find(".option-item").unbind();
	charger.find(".option-item").click(function(event) {
		charger.find(".selected").removeClass('selected');
		$(this).addClass('selected'); 
		if ($(this).text() == "<<我>>") { 
			_input.val(g_CURRENT_USER);
			init_develop_select(g_CURRENT_USER);
		}
		else{ 
			_input.val($(this).text());
			init_develop_select($(this).text());
		}
		charger.find('.combo-dropdown').hide();
	});
	/*-----------------------------开发人下拉框----------------------------------------*/
	function init_develop_select(scharger){
		var developer = $(".support .add-record table .developer");
		if (developer.children('.combo-dropdown').length < 1) {
			var obj = $("<div></div>").addClass('combo-dropdown');
			obj.css({
				'display':'none',
				'position': 'fixed',
				'max-height':'200px',
				'background-color': 'white',
				'border': '1px solid #3BB4F2',
				'box-shadow': '0px 0px 3px #3BB4F2',
				'margin-top': '2px',
				'overflow': 'auto'
			});
			developer.append(obj);
		} 

		developer.find(".combo-dropdown").html("");
		for (_group in users) {
			var us = users[_group];
			var bFind = false;
			for (i in us) {
				if (us[i] == scharger){
					bFind = true;
					break;
				}
			}
			if (bFind) {
				var managerName = '';
				for (i in g_ALL_GROUP) {
					if (g_ALL_GROUP[i].name == _group) {
						managerName = g_ALL_GROUP[i].manager_name;
					}
				}
				for (i in us) {
					var ut = $("<div></div>").addClass('option-item').text(us[i]);
					ut.css({'padding-left': '10px'});
					if (us[i] == managerName) {
						ut.css({'color': '#FB3636', 'font-weight':'bold'});
					}
					developer.find(".combo-dropdown").append(ut);
				}
				
				bFind = false;
				break;
			}
		}

		var _input = developer.find("input");
		_input.unbind();
		_input.focus(function(event) {
			developer.find('.combo-dropdown').css({
				'width': $(_input).outerWidth()+"px",
				'top'  : $(_input).outerHeight()+($(_input).offset().top-$(document).scrollTop())+"px",
				'left' : $(_input).offset().left+"px"
			});
			developer.find(".combo-dropdown").slideDown();
		});

		developer.find(".option-item").unbind();
		developer.find(".option-item").click(function(event) {
			developer.find(".selected").removeClass('selected');
			$(this).addClass('selected'); 
			if ($(this).text() == "<<我>>") { 
				_input.val(g_CURRENT_USER);
			}
			else{ 
				_input.val($(this).text());	
			}
			developer.find('.combo-dropdown').hide();
		});
	}
	
	/*当填写升级版本后，状态直接变更为已完成@!*/
	$(".support .add-record table .uversion input").unbind();
	$(".support .add-record table .uversion input").change(function(event) {
		if ($(this).val().length < 1) return;
		$(".support .add-record table .status input").val("已升级");
		$(".support .add-record table .status .hyl-drop-down").find(".selected").removeClass('selected');
	});

	/*---------------------包的类型和状态下拉数据的填充------------------------------*/
	$(".support .batch-wrap .upt .type").append($("<option></option>"));
	$(".support .batch-wrap .upt .status").append($("<option></option>"));
	$(g_SUPPORT).each(function(index, el) {
		if (el.name == "包类型"){
			data = [];
			$(el.data).each(function(index, el) {
				data.push(el.name);
				$(".support .batch-wrap .upt .type").append($("<option></option>").text(el.name));
			});
			hyl_select($(".support .add-record table .type"), data);
		}else if(el.name == "状态"){
			data = [];
			$(el.data).each(function(index, el) {
				data.push(el.name);
				$(".support .batch-wrap .upt .status").append($("<option></option>").text(el.name));
			});
			hyl_select($(".support .add-record table .status"), data);
		}
	});
	

	$('.support .wrap .show').unbind();
	$('.support .wrap .show').mousedown(function(e){
		//console.info(e.which); // 1 = 鼠标左键 left; 2 = 鼠标中键; 3 = 鼠标右键
		if (e.which == 3) {
			if ($(".support .show .table .tbody .tr.selected").length <= 1) SupportMouseRightDown(e);
			else SupportMouseRightDownBatch(e);
		}
		return false;//阻止链接跳转
	});

	$(".support .batch-wrap .head .exit").unbind();
	$(".support .batch-wrap .head .exit").click(function(event) {
		/* Act on the event */
		$("body").children(".hyl-bokeh").removeClass('hyl-show');
		$(".support .batch-wrap").hide();
	});

	$(".support .batch-wrap .foot .confirm").unbind();
	$(".support .batch-wrap .foot .confirm").click(function(event) {
		var type = $(".support .batch-wrap .upt .type").val();
		var status = $(".support .batch-wrap .upt .status").val();
		var pversion = $(".support .batch-wrap .upt .pversion").val();
		var charger = $(".support .batch-wrap .upt .charger").val();
		var gitbranch = $(".support .batch-wrap .upt .gitbranch").val();
		var uversion = $(".support .batch-wrap .upt .uversion").val();
		
		var ids = [];
		$(".support .show .table .tbody .tr.selected").each(function(index, el) {
			ids.push($(el).attr("row"));
		});
		ids = ids.join(",");

		if( type.length < 1 && status.length < 1 && pversion.length < 1 && charger.length < 1 &&
			gitbranch.length < 1 && uversion.length < 1){
			$("body").children(".hyl-bokeh").removeClass('hyl-show');
			$(".support .batch-wrap").hide();
			return;
		}
		var param = {};
		param.IDs = ids;
		param.SessionID = Options.SessionID;
		if (type.length > 0) param.Type = type;
		if (status.length > 0) param.Status = status;
		if (charger.length > 0) param.Charger = charger;
		if (pversion.length > 0) param.PVersion = pversion;
		if (gitbranch.length > 0) param.GitBranch = gitbranch;
		if (uversion.length > 0) param.UVersion = uversion;
		param.UptUser = g_CURRENT_USER;
		param.method = "BATCH_UPDATE";

		sync_post_data("/support/", JSON.stringify(param), function(d) {
			if (d.ErrCode != 0){
				hyl_alert2("error", "更新失败", function(){});
				return;
			}
			hyl_alert2("success", "更新成功", function(){
				$("body").children(".hyl-bokeh").removeClass('hyl-show');
				$(".support .batch-wrap").hide();
				querySupport();
			});
		});
	});

	$(".support .add-record .head .exit").unbind();
	$(".support .add-record .head .exit").click(function(event) {
		/* Act on the event */
		$("body").children(".hyl-bokeh").removeClass('hyl-show');
		$(".support .add-record").removeClass('show');
	});

	$(".support .add-record table .confirm").unbind();
	$(".support .add-record table .confirm").click(function(event) {
		/* Act on the event */
		var ret = false;
		var msg = "";
		if ($(this).hasClass('add')) {
			ret = addSupport("ADD");
			$(this).removeClass('add');
			msg = "添加";
		} else if ($(this).hasClass('upt')) {
			ret = addSupport("UPT");
			$(this).removeClass('upt');
			msg = "更新";
		}
		if (ret == true) {
			hyl_alert2("success", msg+"成功", function(){
				$("body").children(".hyl-bokeh").removeClass('hyl-show');
				$(".support .add-record").removeClass('show');
				querySupport();
			}, 1000);
		}else{
			hyl_alert2("error", msg+"失败", function(){}, 1000);
		}
	});

	$(".support .add-record table .cancle").unbind();
	$(".support .add-record table .cancle").click(function(event) {
		/* Act on the event */
		$("body").children(".hyl-bokeh").removeClass('hyl-show');
		$(".support .add-record").removeClass('show');
	});

	$('.support .wrap .option button.add').unbind();
	$('.support .wrap .option button.add').click(function(event) {

		$(".support .add-record table .system 	input").val('');
		$(".support .add-record table .module 	input").val('');
		$(".support .add-record table .type 	input").val('');
		$(".support .add-record table .sname 	input").val('');
		$(".support .add-record table .ftp 		textarea").val('');
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

	$('.support .wrap .option button.upt').unbind();
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
			var data = d.data[0];

			$(".support .add-record table .system 	input").val(data.SYSTEM);
			$(".support .add-record table .module 	input").val(data.MODULE);
			$(".support .add-record table .type 	input").val(data.TYPE);
			$(".support .add-record table .sname 	input").val(data.PACKAGE_NAME);
			$(".support .add-record table .ftp 		textarea").val(data.FTP_ADDR);
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

	$('.support .wrap .option button.del').unbind();
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

	$('.support .wrap .option button.exp').unbind();
	$('.support .wrap .option button.exp').click(function(event) {
		$(".support .exp-sel .body table .col2 i").each(function(index, el) {
			$(el).addClass('selected');	
		});

		var tb = $("body").children(".hyl-bokeh");
		tb.addClass("hyl-show");
		$(".support .exp-sel").show(200, function() {});
	});

	$('.support .exp-sel button.exp').unbind();
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

	$(".support .exp-sel .head .exit").unbind();
	$(".support .exp-sel .head .exit").click(function(event) {
		var tb = $("body").children(".hyl-bokeh");
		tb.removeClass("hyl-show");
		$(".support .exp-sel").hide(300, function() {});
	});

	$(".support .exp-sel .body .table-body .col2 i").unbind();
	$(".support .exp-sel .body .table-body .col2 i").click(function(event) {
		if ($(this).hasClass('selected')) {
			$(this).removeClass('selected');
		}else{
			$(this).addClass('selected');
		}
	});

	$(".support .task-show .head .exit").unbind();
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
	param.ftp 			= sGetTextareaVal("ftp");
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
		param.ID = $('.support .wrap .show .table .tbody .tr.selected').attr("row");
	}

	sync_post_data("/support/", JSON.stringify(param), function(d) {
		if (d.ErrCode != 0) {
			//alert("数据库更新失败!");
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
			{name: '负责人', 	field:'CHARGER', 		width:'60', align:'center'},
			{name: '开发员', 	field:'DEVELOPER', 		width:'60', align:'center'},
			{name: '计划版本', 	field:'PLAN_VERSION', 	width:'150', align:'center'},
			{name: 'Git分支', 	field:'GIT_BRANCH', 	width:'200', align:'center'},
			{name: '升级版本', 	field:'UPGRADE_VERSION',width:'200', align:'center'},
			{name: '协作号', 	field:'COLLABORATION', 	width:'100', align:'center'},
			{name: '创建者', 	field:'CRT_USER', 		width:'60', align:'center'},
			{name: '创建时间', 	field:'CRT_TIME', 		width:'140', align:'center'},
			{name: '更新者', 	field:'UPT_USER', 		width:'60', align:'center'},
			{name: '更新时间', 	field:'UPT_TIME', 		width:'140', align:'center'}
		];
		conf.datas = d.data;

		hyl_table2($(".support .show"), conf);

		$(".support .show .table .tbody .tr").unbind();
		$(".support .show .table .tbody .tr").click(function(event) {
			var sel = "selected"
			if (!g_CTRL_KEY_DOWN)
				$(this).parent().find(("."+sel)).removeClass(sel);
			if (!$(this).hasClass(sel))
				$(this).addClass(sel);
			else
				$(this).removeClass(sel);
		});
		$(".support .show .table .tbody .tr").dblclick(function(event) {
			/* Act on the event */
			fexamine();
		});

		/*重新绘制宽度和高度，去掉滚动条的宽度*/
		setTimeout(SuportRepaint, 10);
	});

}