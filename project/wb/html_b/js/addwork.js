function add_zb_ginit() {
	/*初始化日历控件*/
	jeDate.skin('gray');
	jeDate({
		dateCell:".add-zb .edit .form .ksrq",//isinitVal:true,
		format:"YYYY-MM-DD",
		isTime:false, //isClear:false,
		isinitVal:true,
		minDate:"2017-11-1 00:00:00",
		maxDate:"2020-11-8 00:00:00"
	});

	$(".add-zb .edit .form .update").attr('disabled', '');
	$(".add-zb .edit .form .cancle").attr('disabled', '');

	jeui.use(["jeSelect"], function(){
		$(".add-zb .edit .form select").jeSelect({
			sosList:false,
			itemfun:function(elem,index){
				if (elem.attr("class") == "fsys") {
					
					var data = g_ALL_SYSTEM.data;
					var dd = [];
					for( var i=0; i< data.length;  i++) {
						if ( data[i].name == elem.val() ) {
							dd = data[i].data;
						}
					}
					var shtml = "";
					var fmod = $(".add-zb .edit .form .fmod");
					fmod.html("");
					fmod.siblings('.je-select').html("");
					shtml = "<option></option>"
					for (var i=0; i<dd.length; i++) {
						shtml += "<option name='"+dd[i].id+"'>"+ dd[i].name +"</option>";
					}
					fmod.html(shtml);
				}
				else if (elem.attr("class") == "fjd"){
					//console.info(elem.val());
					if (elem.val() == "100") {
						$(".add-zb .edit .form .fhxrr").val("0");
					}
				}
			}
		});
	});

	$(".add-zb .edit .form .zq button").click(function(){
		$(this).addClass('je-bg-native');
		$(this).removeAttr("selected");
		$(this).siblings().addClass('je-bg-native');
		$(this).siblings().removeAttr('selected');
		$(this).removeClass("je-bg-native");
		$(this).attr("selected", "selected");
	});

	$(".add-zb .edit .form .ksrq").blur(function(){
		var hxrr = $(".add-zb .edit .form .fhxrr").val();
		if (hxrr.length < 1) return;
		hxrr = parseInt( hxrr );
		if (hxrr < 0) return;

		var param = new Object();
		param.method = "GET_EXPIRE_DATE";
		param.StartDate = $(this).val();
		param.NeedDays = hxrr;

		//console.info($(this).val());
		sync_post_data("/pubinterface/", JSON.stringify(param), function(d) {
			if (d.ErrCode == 0) {
				var tmp = d.ExpireDate;
				tmp = tmp[0]+tmp[1]+tmp[2]+tmp[3]+"-"+tmp[4]+tmp[5]+"-"+tmp[6]+tmp[7];
				$(".add-zb .edit .form .fwcrq").val(tmp);
			}else{
				alert(d.msg);
			}
		});

	});

	$(".add-zb .edit .form .fhxrr").change(function(){
		var ksrq = $(".add-zb .edit .form .ksrq").val();
		if (ksrq.length < 1) return;

		var hxrr = $(this).val();
		if (hxrr.length < 1) return;
		hxrr = parseInt(hxrr);
		if (hxrr < 0) return;

		var param = new Object();
		param.method = "GET_EXPIRE_DATE";
		param.StartDate = ksrq;
		param.NeedDays = hxrr;

		sync_post_data("/pubinterface/", JSON.stringify(param), function(d) {
			if (d.ErrCode == 0) {
				var tmp = d.ExpireDate;
				tmp = tmp[0]+tmp[1]+tmp[2]+tmp[3]+"-"+tmp[4]+tmp[5]+"-"+tmp[6]+tmp[7];
				$(".add-zb .edit .form .fwcrq").val(tmp);
			}else{
				alert(d.msg);
			}
		});

	});

	$(".add-zb .head-wrap .options .add").click(function(event) {
		$(".add-zb .edit-wrap .head .title").text("添加周报");
		show_edit_wrap_pop_box();
	});

	$(".add-zb .head-wrap .options .sync-redmine").click(function(event) {
		/*判断是否操作过于频繁*/
		if (IsOperationFrequent("SyncRedmine", 15)) {
			return ;
		}
		/*产生等待的效果*/
		//$(".wrap1 .unshow").removeClass('unshow');
		$(".wrap1 .wait").show(100, function() {});

		var param = new Object();
		param.SessionID = Options.SessionID;
		param.mode = "SINGLE";
		param.UID = g_CURRENT_USER_ID;

		setTimeout(function(){
			var bsync = $(".wrap1 .redmine-sync").is(":hidden");
			var bwait = $(".wrap1 .wait").is(':hidden');
			if ((bsync == true && bwait == false)){
				alert("连接超时！");
				$(".wrap1 .wait").hide(200, function() {});
			}
		},10000);

		post_data("/sync_from_redmine/", JSON.stringify(param), function(d) {
			d = $.parseJSON(d);
			if (d.ErrCode != 0) {
				alert(d.msg);
			}
			show_redmin_sync_info(d.data);
			
			//add_zb_show_work();
			//$(".wrap1 .wait").addClass('unshow');
		});
	});

	$(".wrap1 .redmine-sync .head .exit").click(function(event) {
		$(".wrap1 .wait").hide(10, function() {});
		$(".wrap1 .redmine-sync .m0,.m1,.m2,.m3").hide(10);
		$(".wrap1 .redmine-sync").hide(10);
		add_zb_show_work();
	});

	$(".add-zb .edit-wrap .head .exit").click(function(event) {
		hide_edit_wrap_pop_box();
	});

}

function show_redmin_sync_info(data){
	//console.info(data);
	$(".wrap1 .redmine-sync").show(0);
	if (data == '') {
		/*显示无任何信息*/
		$(".wrap1 .redmine-sync .m0").show(0);
	}else{
		$.map(data, function(val, mode){
			//console.info(mode, val);
			if (mode == '1'){
				var hb = $(".wrap1 .redmine-sync .m1 .res");
				hb.html("");
				var i = 0;
				$.map(val, function(v, k){
					i = i + 1;
					var rs = "["+k+"] "+v;
					//hb.append($("<p></p>").text(rs));	
					rs = "<span>"+i+". </span>" + rs;
					hb.append($("<p></p>").html(rs));
				})
				$(".wrap1 .redmine-sync .m1").show(0);
			}else if ('2' == mode){
				var hb = $(".wrap1 .redmine-sync .m2 .res");
				hb.html("");
				var i = 0;
				$.map(val, function(v, k){
					i = i + 1;
					var rs = "["+k+"] "+v;
					rs = "<span>"+i+". </span>" + rs;
					hb.append($("<p></p>").html(rs));	
				})
				$(".wrap1 .redmine-sync .m2").show(0);
			}else if ('3' == mode){
				var hb = $(".wrap1 .redmine-sync .m3 .res");
				hb.html("");
				var i = 0;
				$.map(val, function(v, k){
					i = i + 1;
					var rs = "["+k+"] "+v;
					rs = "<span>"+i+". </span>" + rs;
					hb.append($("<p></p>").html(rs));
				})
				$(".wrap1 .redmine-sync .m3").show(0);
			}
		});
	}
		
	var h = $(".wrap1 .redmine-sync").height();
	var w = $(".wrap1 .redmine-sync").width();
	var clientW = $(window).width();
	var clientH = $(window).height();
	//console.info(h,w, clientW, clientH);
	lleft = (clientW-w)/2;
	ttop =  (clientH-h)/2;
	//console.info(lleft, ttop);
	//$(".wrap1 .redmine-sync").css('margin', '-300px 0 0 -'+h/2+"px");
	$(".wrap1 .redmine-sync").css({
		'left': lleft+'px',
		'top': ttop+'px'
	});
}

function show_edit_wrap_pop_box(){
	$("body").children(".hyl-bokeh").addClass('hyl-show');
	//$(".add-zb .edit-wrap").show(100, function() {});
	$(".add-zb .edit-wrap").slideDown(200, function() {
		
	});
}
function hide_edit_wrap_pop_box(){
	$("body").children(".hyl-bokeh").removeClass('hyl-show');
	//$(".add-zb .edit-wrap").hide(100, function() {});
	$(".add-zb .edit-wrap").slideUp(100);
}

function add_zb_form_clean() {
	var editForm = $(".add-zb .edit .form");
	editForm.find("select").html("");
	//editForm.find("input").val("");
	editForm.find("textarea").val("");
}

function add_zb_form_select_init() {
	add_zb_form_clean();

	var editForm = $(".add-zb .edit .form");
	var sys = g_ALL_SYSTEM.data;
	var shtml = "<option></option>";
	for (var i=0; i<sys.length; i++) {
		shtml += "<option name='"+sys[i].id+"'>"+ sys[i].name +"</option>";
	}
	editForm.find(".fsys").html(shtml);

	var type = g_ALL_TYPE.data;
	shtml = "<option></option>";
	for(var i=0; i<type.length; i++) {
		shtml += "<option name='"+type[i].id+"'>"+ type[i].name +"</option>";
	}
	editForm.find(".ftype").html(shtml);

	var prop = g_ALL_PROPERTY.data;
	shtml = "<option></option>";
	for(var i=0; i<prop.length; i++) {
		shtml += "<option name='"+prop[i].id+"'>"+ prop[i].name +"</option>";
	}
	editForm.find(".fprop").html(shtml);

	shtml = "";
	for(var i=0; i<11; i++) {
		shtml += "<option>"+(i*10)+"</option>";
	}
	editForm.find(".fjd").html(shtml);

	// shtml = "";
	// $(g_SUPPORT_PACKAGE_NAMES).each(function(index, el) {
	// 	shtml += "<option name='"+el.ID+"'>"+el.PACKAGE_NAME+"</option>";
	// });
	// editForm.find('.support-packn').html(shtml);
}

function add_zb() {

	add_zb_form_select_init();

	$(".add-zb .edit .form .add").unbind();
	$(".add-zb .edit .form .add").click(function(){
		$(this).attr("disabled", "");
		var fom = $(".add-zb .edit .form");
		var sys = fom.find(".fsys");
		var mod = fom.find(".fmod");
		var type = fom.find(".ftype");
		var property = fom.find(".fprop");
		var jd = fom.find(".fjd");
		var gzh = fom.find(".fgzh");
		var gznr = fom.find(".fgznr");
		var ksrq = fom.find(".ksrq");
		var hxrr = fom.find(".fhxrr");
		var bz =   fom.find(".fbz");
		//var sup_name = fom.find(".support-packn");

		if (sys.val() == "") {
			alert("系统选项不能为空！");
			$(this).removeAttr("disabled");
			return;
		}
		if (type.val() == "") {
			alert("类型选项不能为空！");
			$(this).removeAttr("disabled");
			return;
		}
		if (property.val() == "") {
			alert("性质选项不能为空！");
			$(this).removeAttr("disabled");
			return ;
		}
		if (gzh.val() == "") {
			alert("跟踪号不能为空！");
			$(this).removeAttr("disabled");
			return;
		}
		if (gznr.val() == "") {
			alert("工作内容不能填空！");
			$(this).removeAttr("disabled");
			return;
		}
		if (ksrq.val() == "") {
			alert("开始日期不能是空！");
			$(this).removeAttr("disabled");
			return;
		}
		if (hxrr.val() == "") {
			alert("后续人日不能填空！");
			$(this).removeAttr("disabled");
			return;
		}

		var param = new Object();
		param.SessionID = Options.SessionID;
		param.method = "ADD";

		param.Week = 0;
		param.System = sys.val();
		param.Module = mod.val();
		param.Type = type.val();
		param.Property = property.val();
		param.ProgressRate = jd.val();
		param.TraceNo = gzh.val();
		param.Detail = gznr.val();
		param.StartDate = ksrq.val();
		param.NeedDays = hxrr.val();
		param.Note = bz.val();

		// if ( sup_name.find("[selected=selected]").length < 1 ){
		// 	param.SID = '0';
		// } else {
		// 	param.SID = sup_name.find("[selected=selected]").attr("name");
		// }
		
		/*检查用户输入参数是否有问题*/
		var re = /^\d+$/
		if (!re.test(param.NeedDays)) {
			alert("后续人日不能为非正整数！")
			$(this).removeAttr("disabled");
			return;
		}
		re = /^.*(需求|任务|BUG|问题单|功能点)\s*#/i
		if (!re.test(param.TraceNo)) {
			alert("跟踪号的格式不对，请按照 [需求, 任务, BUG, 问题单, 功能点]#[XXXX]格式填写！");
			$(this).removeAttr("disabled");
			return;
		}

		sync_post_data("/report/", JSON.stringify(param), function(d) {
			//d = $.parseJSON(d);
			if (d.ErrCode == 0) {
				hyl_alert2("success", "添加成功", function(){
					sys.val("");
					mod.val("");
					type.val("");
					property.val("");
					sys.siblings(".je-select").html("");
					mod.siblings(".je-select").html("");
					type.siblings(".je-select").html("");
					property.siblings(".je-select").html("");

					jd.val("0");
					gzh.val("");
					gznr.val("");
					//ksrq.val("");
					hxrr.val("");
					bz.val("");
					hide_edit_wrap_pop_box();
					add_zb_show_work();
					window.location.reload();
				}, 1000);
				//window.location.href = "zbxt.html";
				//window.location.reload();
				//add_zb_show_work();
			}else {
				hyl_alert2("error", "添加失败", function(){
					//hide_edit_wrap_pop_box();
				}, 1000);
			}
			$(".add-zb .edit .form .add").removeAttr("disabled");
		});
	})

	$(".add-zb .edit .form .update").unbind();
	$(".add-zb .edit .form .update").click(function() {
		var fom = $(".add-zb .edit .form");
		var sys = fom.find(".fsys");
		var mod = fom.find(".fmod");
		var type = fom.find(".ftype");
		var property = fom.find(".fprop");
		var jd = fom.find(".fjd");
		var gzh = fom.find(".fgzh");
		var gznr = fom.find(".fgznr");
		var ksrq = fom.find(".ksrq");
		var hxrr = fom.find(".fhxrr");
		var bz = fom.find(".fbz");

		var param = new Object();
		param.SessionID = Options.SessionID;
		param.method = "UPDATE";
		if (typeof($(this).attr("name")) == "undefined") {
			alert("UPDATE ID信息丢失！");
			return;
		}
		param.id = $(this).attr("name");
		//$(this).removeAttr("name");

		param.System = sys.siblings().text();
		param.Module = mod.siblings().text();
		param.Type = type.siblings().text();
		param.Property = property.siblings().text();
		param.ProgressRate = jd.siblings().text();
		param.TraceNo = gzh.val();
		param.Detail = gznr.val();
		param.EditDate = ksrq.val();
		param.NeedDays = hxrr.val();
		param.Note = bz.val();

		/*检查用户输入参数是否有问题*/
		var re = /^\d+$/
		if (!re.test(param.NeedDays)) {
			alert("后续人日不能为非正整数！");
			return;
		}
		re = /^.*(需求|任务|BUG|问题单|功能点)\s*#/i
		if (!re.test(param.TraceNo)) {
			alert("跟踪号的格式不对，请按照 [需求, 任务, BUG, 问题单, 功能点]#[XXXX]格式填写！");
			return;
		}

		sync_post_data("/report/", JSON.stringify(param), function(d) {
			//d = $.parseJSON(d);
			if (d.ErrCode == 0) {
				hyl_alert2("success", "更新成功", function(){
					sys.val("");
					mod.val("");
					type.val("");
					property.val("");
					sys.siblings(".je-select").html("");
					mod.siblings(".je-select").html("");
					type.siblings(".je-select").html("");
					property.siblings(".je-select").html("");

					jd.val("0");
					gzh.val("");
					gznr.val("");
					//ksrq.val("");
					hxrr.val("");
					bz.val("");
					
					fom.find(".add").removeAttr('disabled');
					fom.find(".update").attr('disabled', '');
					//add_zb_show_work();
					/**----------------------解禁开始日期------------------------**/
					$(".add-zb .edit .form .ksrq").removeAttr('disabled');
					$(".add-zb .edit .form .ksrq-lab").text("开始日期");
					/**----------------------------------------------------------**/
					hide_edit_wrap_pop_box();
					add_zb_show_work();
					window.location.reload();
				}, 1000);
				
				//window.location.href = "zbxt.html";
				// 
			} else {
				hyl_alert2("error", "更新失败", function(){}, 1000);
			}
		});
	});

	$(".add-zb .edit .form .cancle").unbind();
	$(".add-zb .edit .form .cancle").click(function () {
		var fom = $(".add-zb .edit .form");
		var sys = fom.find(".fsys");
		var mod = fom.find(".fmod");
		var type = fom.find(".ftype");
		var property = fom.find(".fprop");
		var jd = fom.find(".fjd");
		var gzh = fom.find(".fgzh");
		var gznr = fom.find(".fgznr");
		var ksrq = fom.find(".ksrq");
		var hxrr = fom.find(".fhxrr");
		var bz = fom.find(".fbz");
		var wcrq = fom.find(".fwcrq");

		sys.siblings('.je-select').html("");
		mod.siblings('.je-select').html("");
		type.siblings('.je-select').html("");
		property.siblings('.je-select').html("");
		jd.val("");

		gzh.val("");
		gznr.val("");
		hxrr.val("");
		bz.val("");
		wcrq.val("");

		$(".add-zb .edit .form .update").attr('disabled', '');
		$(".add-zb .edit .form .cancle").attr('disabled', '');
		$(".add-zb .edit .form .add").removeAttr('disabled');
		/**----------------------解禁开始日期------------------------**/
		$(".add-zb .edit .form .ksrq").removeAttr('disabled');
		$(".add-zb .edit .form .ksrq-lab").text("开始日期");
		/**----------------------------------------------------------**/
		hide_edit_wrap_pop_box();

	});

	add_zb_show_work();
}

function add_zb_show_work() {
	var param = new Object()
	param.SessionID = Options.SessionID;
	param.method = "GET";
	param.UserID = g_CURRENT_USER_ID;
	
	sync_post_data("/report/", JSON.stringify(param), function(d) {
		//d = $.parseJSON(d);
		//console.info(d);
		if (d.ErrCode != 0) {
			alert(d.msg)
			return;
		}
		ThisWeekWorkStatus = d.ThisWeekWorkStatus;
		console.info(ThisWeekWorkStatus);
		$(".add-zb .head-wrap .reminder .redmine .self-add").text(ThisWeekWorkStatus.self.add.count)
		$(".add-zb .head-wrap .reminder .redmine .self-upt").text(ThisWeekWorkStatus.self.upt.count)
		$(".add-zb .head-wrap .reminder .redmine .all-add").text(ThisWeekWorkStatus.all.add.count)
		$(".add-zb .head-wrap .reminder .redmine .all-upt").text(ThisWeekWorkStatus.all.upt.count)
		$(".add-zb .head-wrap .reminder .redmine span").unbind();
		$(".add-zb .head-wrap .reminder .redmine span").click(function(event) {
			var url = "";
			var title = '';
			if ($(this).hasClass('self-add')) {
				url = ThisWeekWorkStatus.self.add.url;
				title = "本人本周从Redmine同步添加的Issues";
			} else if ($(this).hasClass('self-upt')){
				url = ThisWeekWorkStatus.self.upt.url;
				title = "本人本周从Redmine同步更新的Issues";
			}
			else if ($(this).hasClass('all-add')){
				url = ThisWeekWorkStatus.all.add.url;
				title = "所有人员本周从Redmine同步添加的Issues";
			}
			else if ($(this).hasClass('all-upt')){
				url = ThisWeekWorkStatus.all.upt.url;
				title = "所有人员本周从Redmine同步更新的Issues";
			}
			OpenRedmineWindow(url, 800, 1500, title);
		});
		if (d.ErrCode == 0) {
			var CurWeekData = d.current;
			var NextWeekData = d.next;
			var bzgz = $(".add-zb .bzgz");
			var xzgz = $(".add-zb .xzgz");
			var finishedRows = new Array();
			var needHint = new Array();
			var totalRows = new Array();
			var unfinishedRows = new Array();
			var delayRows = new Array();

			var WeekFirstDay = d.WeekFirstDay;
			var WeekLastDay = d.WeekLastDay;

			var NowDate = parseInt(GetNowDate());
			for(var i=0; i<d.current.length; i++) {
				var row = d.current[i];
				var tmp = row.EditDate;
				var eDate = row.EditDate;
				if (tmp.length > 7)
					row.EditDate = tmp[0]+tmp[1]+tmp[2]+tmp[3]+ "-" +tmp[4]+tmp[5]+ "-" +tmp[6]+tmp[7];
				tmp = row.ExpireDate;
				if (tmp.length > 7)
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
			for(var i=0; i<d.next.length; i++) {
				var row = d.next[i];
				var tmp = row.EditDate;
				var eDate = row.EditDate;
				if (tmp.length > 7)
					row.EditDate = tmp[0]+tmp[1]+tmp[2]+tmp[3]+ "-" +tmp[4]+tmp[5]+ "-" +tmp[6]+tmp[7];
				tmp = row.ExpireDate;
				if (tmp.length > 7)
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

			if (CurWeekData.length < 1){
				bzgz.html("暂无本周工作记录")
			} else {
				//console.info(CurWeekData);
				je_table($(".add-zb .bzgz"),{
					width:"1433",
					isPage: false,
					datas: CurWeekData,
					columnSort:[],
					columns:[
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
								return '<pre class="content-omit" title="'+obj.Detail+'" style="font-size:12px;">' + obj.Detail + "</pre>";
							}
						},
						{name: "性质", 		field: "Property", 	width: "70", align:"center"},
						{name: "进度", 		field: "ProgressRate", width: "70", align:"center",
							renderer:function(obj, rowidex) {
								if (obj.ProgressRate == 100) {
									finishedRows.push(rowidex);
								}else{
									unfinishedRows.push(rowidex);
								}
								return GenProgressBarHtml(60, 14, obj.ProgressRate);
							}
						},
						{name: "开始日期", 		field: "StartDate", width: "100", align:"center"},
						{name: "更新日期", 		field: "EditDate", width: "100", align:"center",
							renderer:function(obj, rowidex) {
								var tmp = obj.EditDate;
								if (!(tmp >= WeekFirstDay && tmp <= WeekLastDay)) {
									needHint.push(rowidex);
								}
								return obj.EditDate;
							}
						},
						{name: "后续人日", 		field: "NeedDays", width: "70", align:"center"},
						{name: "计划完成日期", 	field: "ExpireDate", width: "100", align:"center"},
						{name: "延期天数",		field: "ExpireDays", width: "70", align:"center",
							renderer:function(obj, rowidex) {
								if (obj.ExpireDays != 0) {
									delayRows.push(rowidex);
								}
								return obj.ExpireDays;
							}
						},
						{name: "备注", 	field:"Note", 	width:"200", 	align:"left",
	                		renderer:function(obj, rowidex) {
								return '<pre class="content-omit" title="'+obj.Note+'" style="font-size:12px;">' + obj.Note + "</pre>";
							}
	                	},
						{name: "操作", field:'id', width:"100", align:"center", 
							renderer:function(obj, rowidex) {
								totalRows.push(rowidex);
								//console.log(obj);
	                    		return '<button name="'+obj.id+'" type="edit" class="je-btn je-bg-blue je-btn-small"><i class="je-icon">&#xe63f;</i></button> \
	    							<button  name="'+obj.id+'" type="delete" class="je-btn je-bg-red je-btn-small"><i class="je-icon">&#xe63e;</i></button> \
	    							<!--<button  name="'+obj.id+'" type="turn" class="je-btn je-bg-green je-btn-small"><i class="je-icon" style="transform: rotate(-180deg);">&#xe627;</i></button>-->';
	                    	}
	                	}
					],
					itemfun:function(elem,data){

					},
					success:function(elCell, tbody) {
						/*+++++++++++*/
						//console.info($(".add-zb .reminder .total-wn"));
						$(".add-zb .reminder .total-wn").text(totalRows.length);
						$(".add-zb .reminder .finish-wn").text(finishedRows.length);
						$(".add-zb .reminder .unfinish-wn").text(unfinishedRows.length);
						$(".add-zb .reminder .delay-wn").text(delayRows.length);
						$(".add-zb .reminder .unupdate-wn").text(needHint.length);
						/*设置已完成任务的颜色*/
						for(var i=0; i<finishedRows.length; i++) {
							var sel = $(tbody).find('tr[row="' + finishedRows[i] + '"]');
							sel.addClass("bkg-green");
						}
						/*设置需要提示任务的颜色*/
						for (var i=0; i<needHint.length; i++) {
							var sel = $(tbody).find('tr[row="' + needHint[i] + '"]');
							sel.addClass("bkg-red");
						}

						$(".add-zb .reminder .ts-unit").hover(function() {
							/* Stuff to do when the mouse enters the element */
							var cla = $(this).children().attr("class");
							if ("finish-wn" == cla) {
								for (var i = 0; i<finishedRows.length; i++) {
									var sel = $(tbody).find('tr[row="' + finishedRows[i] + '"]');
									sel.addClass('sel');
								}
							}
							else if ("unfinish-wn" == cla) {
								for (var i=0; i<unfinishedRows.length; i++) {
									var sel = $(tbody).find('tr[row="' + unfinishedRows[i] + '"]');
									sel.addClass('sel');
								}
							}
							else if ("delay-wn" == cla) {
								for (var i=0; i<delayRows.length; i++) {
									var sel = $(tbody).find('tr[row="' + delayRows[i] + '"]');
									sel.addClass('sel');
								}
							}
							else if ("unupdate-wn" == cla) {
								for (var i=0; i<needHint.length; i++) {
									var sel = $(tbody).find('tr[row="' + needHint[i] + '"]');
									sel.addClass('sel');
								}
							}
						}, function() {
							/* Stuff to do when the mouse leaves the element */
							var cla = $(this).children().attr("class");
							if ("finish-wn" == cla) {
								for (var i = 0; i<finishedRows.length; i++) {
									var sel = $(tbody).find('tr[row="' + finishedRows[i] + '"]');
									sel.removeClass('sel');
								}
							}
							else if ("unfinish-wn" == cla) {
								for (var i=0; i<unfinishedRows.length; i++) {
									var sel = $(tbody).find('tr[row="' + unfinishedRows[i] + '"]');
									sel.removeClass('sel');
								}
							}
							else if ("delay-wn" == cla) {
								for (var i=0; i<delayRows.length; i++) {
									var sel = $(tbody).find('tr[row="' + delayRows[i] + '"]');
									sel.removeClass('sel');
								}
							}
							else if ("unupdate-wn" == cla) {
								for (var i=0; i<needHint.length; i++) {
									var sel = $(tbody).find('tr[row="' + needHint[i] + '"]');
									sel.removeClass('sel');
								}
							}
						});

						$(".add-zb .bzgz button").click(function(){
							var param = new Object();
							param.SessionID  = Options.SessionID;
							if ($(this).attr("type") == "delete") {
								param.method = "DELETE";
								param.id = $(this).attr("name");
								param.week = 0;
								sync_post_data("/report/", JSON.stringify(param), function(d){
									if (d.ErrCode == 0) {
										hyl_alert2("success", "删除成功", function(){
											/*初始化界面*/
											var fom = $(".add-zb .edit .form");
											var sys = fom.find(".fsys");
											var mod = fom.find(".fmod");
											var type = fom.find(".ftype");
											var property = fom.find(".fprop");
											var jd = fom.find(".fjd");
											var gzh = fom.find(".fgzh");
											var gznr = fom.find(".fgznr");
											var ksrq = fom.find(".ksrq");
											var hxrr = fom.find(".fhxrr");
											var bz = fom.find(".fbz");

											sys.siblings('.je-select').html("");
											mod.siblings('.je-select').html("");
											type.siblings('.je-select').html("");
											property.siblings('.je-select').html("");
											jd.val("");

											gzh.val("");
											gznr.val("");
											hxrr.val("");
											bz.val("");

											$(".add-zb .edit .form .update").attr('disabled', '');
											$(".add-zb .edit .form .cancle").attr('disabled', '');
											$(".add-zb .edit .form .add").removeAttr('disabled');
											add_zb_show_work();
										}, 1000);
									} else {
										hyl_alert2("error", "删除失败", function(){
											add_zb_show_work();
										}, 1000);
									}
								});
							}
							else if ($(this).attr("type") == "edit") {
								$(".add-zb .edit-wrap .head .title").text("更新周报");
								/**----------------------禁用开始日期------------------------**/
								$(".add-zb .edit .form .ksrq").attr("disabled", "");
								$(".add-zb .edit .form .ksrq-lab").text("更新日期");
								var nDate = GetNowDate();
								nDate = nDate[0]+nDate[1]+nDate[2]+nDate[3]+"-"+nDate[4]+nDate[5]+"-"+nDate[6]+nDate[7];
								$(".add-zb .edit .form .ksrq").val(nDate);
								/**----------------------------------------------------------**/
								var id = $(this).attr("name");
								param.method = "GETSIG";
								param.id = id;
								sync_post_data("/report/", JSON.stringify(param), function(d){
									if (d.ErrCode == 0) {
										if (d.data.length < 1) return;
										//console.info(d.data[0]);
										d = d.data[0];
										var fom = $(".add-zb .edit .form");
										var sys = fom.find(".fsys");
										var mod = fom.find(".fmod");
										var type = fom.find(".ftype");
										var property = fom.find(".fprop");
										var jd = fom.find(".fjd");
										var gzh = fom.find(".fgzh");
										var gznr = fom.find(".fgznr");
										var ksrq = fom.find(".ksrq");
										var hxrr = fom.find(".fhxrr");
										var bz = fom.find(".fbz");
										var zq = fom.find(".zq .bz");
										zq.removeClass('je-bg-native');
										zq.attr("selected", "selected");
										zq.siblings().addClass('je-bg-native');

										sys.siblings('.je-select').text(d.System);
										mod.siblings('.je-select').text(d.Module);
										type.siblings('.je-select').text(d.Type);
										property.siblings('.je-select').text(d.Property);
										jd.siblings('.je-select').text(d.ProgressRate);
										gzh.val(d.TraceNo);
										gznr.val(d.Detail);
										//ksrq.val(d.StartDate);
										bz.val(d.Note);
										hxrr.val(d.NeedDays);

										var param = new Object();
										param.method = "GET_EXPIRE_DATE";
										param.StartDate = ksrq.val();
										param.NeedDays = d.NeedDays;
										
										sync_post_data("/pubinterface/", JSON.stringify(param), function(d) {
											if (d.ErrCode == 0) {
												var tmp = d.ExpireDate;
												tmp = tmp[0]+tmp[1]+tmp[2]+tmp[3]+"-"+tmp[4]+tmp[5]+"-"+tmp[6]+tmp[7];
												$(".add-zb .edit .form .fwcrq").val(tmp);
											}else{
												alert(d.msg);
											}
										});


										fom.find(".update").attr("name", d.id);
										fom.find(".update").removeAttr('disabled');
										fom.find(".add").attr('disabled','');
										fom.find(".cancle").removeAttr('disabled');
										show_edit_wrap_pop_box();
									} else {
										alert(d.msg);
									}
								});
							}
							// else if ($(this).attr("type") == "turn") {
							// 	param.method = "TURN_NEXT";
							// 	param.id = $(this).attr("name");
							// 	sync_post_data("/report/", JSON.stringify(param), function(d){
							// 		if (d.ErrCode == 0) {
							// 			add_zb_show_work();
							// 		} else {
							// 			alert(d.msg);
							// 		}
							// 	});
							// }
						});
					}	
				});
			}
			if (NextWeekData.length < 1) {
				xzgz.html("暂无下周工作记录")
			} else {
				je_table($(".add-zb .xzgz"),{
					width:"1433",
					isPage: false,
					datas: NextWeekData,
					columnSort:[],
					columns:[
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
						{name: "进度", 		field: "ProgressRate", width: "70", align:"center",
							renderer:function(obj, rowidex) {
								return GenProgressBarHtml(60, 14, obj.ProgressRate);
							}
						},
						{name: "开始日期", 		field: "StartDate", width: "100", align:"center"},
						{name: "更新日期", 		field: "EditDate", width: "100", align:"center"},
						{name: "后续人日", 		field: "NeedDays", width: "70", align:"center"},
						{name: "计划完成日期", 		field: "ExpireDate", width: "100", align:"center"},
						{name: "延期天数",		field: "ExpireDays", width: "70", align:"center"},
						{name: "备注", 	field:"Note", 	width:"200", 	align:"left",
	                		renderer:function(obj, rowidex) {
								return '<pre style="font-size:12px;">' + obj.Note + "</pre>";
							}
	                	},
						{name: "操作", field:'id', width:"100", align:"center", 
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

						$(".add-zb .xzgz button").click(function(){
							var param = new Object();
							param.SessionID  = Options.SessionID;
							if ($(this).attr("type") == "delete") {
								param.method = "DELETE";
								param.id = $(this).attr("name");
								param.week = 1;
								sync_post_data("/report/", JSON.stringify(param), function(d){
									if (d.ErrCode == 0) {
										add_zb_show_work();
										/*初始化界面*/
										var fom = $(".add-zb .edit .form");
										var sys = fom.find(".fsys");
										var mod = fom.find(".fmod");
										var type = fom.find(".ftype");
										var property = fom.find(".fprop");
										var jd = fom.find(".fjd");
										var gzh = fom.find(".fgzh");
										var gznr = fom.find(".fgznr");
										var ksrq = fom.find(".ksrq");
										var hxrr = fom.find(".fhxrr");
										var bz = fom.find(".fbz");

										sys.siblings('.je-select').html("");
										mod.siblings('.je-select').html("");
										type.siblings('.je-select').html("");
										property.siblings('.je-select').html("");
										jd.val("");

										gzh.val("");
										gznr.val("");
										hxrr.val("");
										bz.val("");

										$(".add-zb .edit .form .update").attr('disabled', '');
										$(".add-zb .edit .form .cancle").attr('disabled', '');
										$(".add-zb .edit .form .add").removeAttr('disabled');
									} else {
										alert(d.msg);
									}
								});
							}
							else if ($(this).attr("type") == "edit") {
								$(".add-zb .edit-wrap .head .title").text("更新周报");
								/**----------------------禁用开始日期------------------------**/
								$(".add-zb .edit .form .ksrq").attr("disabled", "");
								$(".add-zb .edit .form .ksrq-lab").text("更新日期");
								var nDate = GetNowDate();
								nDate = nDate[0]+nDate[1]+nDate[2]+nDate[3]+"-"+nDate[4]+nDate[5]+"-"+nDate[6]+nDate[7];
								$(".add-zb .edit .form .ksrq").val(nDate);
								/**----------------------------------------------------------**/
								var id = $(this).attr("name");
								param.method = "GETSIG";
								param.id = id;
								sync_post_data("/report/", JSON.stringify(param), function(d){
									if (d.ErrCode == 0) {
										if (d.data.length < 1) return;
										//console.info(d.data[0]);
										d = d.data[0];
										var fom = $(".add-zb .edit .form");
										var sys = fom.find(".fsys");
										var mod = fom.find(".fmod");
										var type = fom.find(".ftype");
										var property = fom.find(".fprop");
										var jd = fom.find(".fjd");
										var gzh = fom.find(".fgzh");
										var gznr = fom.find(".fgznr");
										var ksrq = fom.find(".ksrq");
										var hxrr = fom.find(".fhxrr");
										var bz = fom.find(".fbz");
										var zq = fom.find(".zq .xz");
										zq.removeClass('je-bg-native');
										zq.attr("selected", "selected");
										zq.siblings().addClass('je-bg-native');

										sys.siblings('.je-select').text(d.System);
										mod.siblings('.je-select').text(d.Module);
										type.siblings('.je-select').text(d.Type);
										property.siblings('.je-select').text(d.Property);
										jd.siblings('.je-select').text(d.ProgressRate);
										gzh.val(d.TraceNo);
										gznr.val(d.Detail);
										//ksrq.val(d.StartDate);
										bz.val(d.Note);
										hxrr.val(d.NeedDays);

										var param = new Object();
										param.method = "GET_EXPIRE_DATE";
										param.StartDate = ksrq.val();
										param.NeedDays = d.NeedDays;

										sync_post_data("/pubinterface/", JSON.stringify(param), function(d) {
											if (d.ErrCode == 0) {
												var tmp = d.ExpireDate;
												tmp = tmp[0]+tmp[1]+tmp[2]+tmp[3]+"-"+tmp[4]+tmp[5]+"-"+tmp[6]+tmp[7];
												$(".add-zb .edit .form .fwcrq").val(tmp);
											}else{
												alert(d.msg);
											}
										});

										fom.find(".update").attr("name", d.id);
										fom.find(".update").removeAttr('disabled');
										fom.find(".add").attr('disabled', '');
										fom.find(".cancle").removeAttr('disabled');
										show_edit_wrap_pop_box();
									} else {
										alert(d.msg);
									}
								});
							}
						});
					}	
				});
			}
		}
	});
}
