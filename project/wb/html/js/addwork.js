function add_zb_ginit() {
	/*初始化日历控件*/
	jeDate.skin('gray');
	jeDate({
		dateCell:".add-zb .edit .form .ksrq",//isinitVal:true,
		format:"YYYY-MM-DD",
		isTime:false, //isClear:false,
		isinitVal:true,
		minDate:"2017-9-1 00:00:00",
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
}

function add_zb() {

	add_zb_form_select_init();

	$(".add-zb .edit .form .add").click(function(){
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
		var zq = fom.find(".zq .je-bg-native").siblings();
		if (zq.hasClass('bz')) {
			zq = 0;
		}else{
			zq = 1;
		}

		if (sys.val() == "") {
			alert("系统选项不能为空！");
			return;
		}
		/*
		if (mod.val() == "") {
			alert("模块选项不能为空！");
			return;
		}*/
		if (type.val() == "") {
			alert("类型选项不能为空！");
			return;
		}
		if (property.val() == "") {
			alert("性质选项不能为空！");
			return ;
		}
		if (gzh.val() == "") {
			alert("跟踪号不能为空！");
			return;
		}
		if (gznr.val() == "") {
			alert("工作内容不能填空！");
			return;
		}
		if (ksrq.val() == "") {
			alert("开始日期不能是空！");
			return;
		}
		if (hxrr.val() == "") {
			alert("后续人日不能填空！");
			return;
		}

		var param = new Object();
		param.SessionID = Options.SessionID;
		param.method = "ADD";

		param.Week = zq;
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

		/*检查用户输入参数是否有问题*/
		var re = /^\d+$/
		if (!re.test(param.NeedDays)) {
			alert("后续人日不能为非正整数！")
			return;
		}
		re = /^.*(需求|任务|BUG|问题单)\s*#/
		if (!re.test(param.TraceNo)) {
			alert("跟踪号的格式不对，请按照 [需求, 任务, BUG, 问题单]#[XXXX]格式填写！没有跟踪号，请按照 [需求, 任务, BUG, 问题单]#[0000]格式填写！");
			return;
		}

		sync_post_data("/report/", JSON.stringify(param), function(d) {
			//d = $.parseJSON(d);
			if (d.ErrCode == 0) {
				add_zb_show_work();

				sys.val("");
				mod.val("");
				type.val("");
				property.val("");
				sys.siblings(".je-select").html("");
				mod.siblings(".je-select").html("");
				type.siblings(".je-select").html("");
				property.siblings(".je-select").html("");

				jd.val("");
				gzh.val("");
				gznr.val("");
				//ksrq.val("");
				hxrr.val("");
				bz.val("");
				window.location.href = "zbxt.html";
				//add_zb_show_work();
			}else {
				alert(d.msg);
			}
		});
	})

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
		param.StartDate = ksrq.val();
		param.NeedDays = hxrr.val();
		param.Note = bz.val();

		/*检查用户输入参数是否有问题*/
		var re = /^\d+$/
		if (!re.test(param.NeedDays)) {
			alert("后续人日不能为非正整数！");
			return;
		}
		re = /^.*(需求|任务|BUG|问题单)\s*#/
		if (!re.test(param.TraceNo)) {
			alert("跟踪号的格式不对，请按照 [需求, 任务, BUG, 问题单]#[XXXX]格式填写！没有跟踪号，请按照 [需求, 任务, BUG, 问题单]#[0000]格式填写！");
			return;
		}


		sync_post_data("/report/", JSON.stringify(param), function(d) {
			//d = $.parseJSON(d);
			if (d.ErrCode == 0) {
				add_zb_show_work();

				sys.val("");
				mod.val("");
				type.val("");
				property.val("");
				sys.siblings(".je-select").html("");
				mod.siblings(".je-select").html("");
				type.siblings(".je-select").html("");
				property.siblings(".je-select").html("");

				jd.val("");
				gzh.val("");
				gznr.val("");
				//ksrq.val("");
				hxrr.val("");
				bz.val("");
				
				fom.find(".add").removeAttr('disabled');
				fom.find(".update").attr('disabled', '');
				//add_zb_show_work();
				window.location.href = "zbxt.html";
			} else {
				alert(d.msg);
			}
		});
	});

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

	});

	add_zb_show_work();
}

function add_zb_show_work() {
	var param = new Object()
	param.SessionID = Options.SessionID;
	param.method = "GET";
	post_data("/report/", JSON.stringify(param), function(d) {
		d = $.parseJSON(d);
		//console.info(d);
		if (d.ErrCode == 0) {
			var CurWeekData = d.current;
			var NextWeekData = d.next;
			var bzgz = $(".add-zb .bzgz");
			var xzgz = $(".add-zb .xzgz");

			for(var i=0; i<d.current.length; i++) {
				var row = d.current[i];
				var tmp = row.EditDate;
				row.EditDate = tmp[0]+tmp[1]+tmp[2]+tmp[3]+ "-" +tmp[4]+tmp[5]+ "-" +tmp[6]+tmp[7];
				tmp = row.ExpireDate;
				row.ExpireDate = tmp[0]+tmp[1]+tmp[2]+tmp[3]+ "-" +tmp[4]+tmp[5]+ "-" +tmp[6]+tmp[7];
			}
			for(var i=0; i<d.next.length; i++) {
				var row = d.next[i];
				var tmp = row.EditDate;
				row.EditDate = tmp[0]+tmp[1]+tmp[2]+tmp[3]+ "-" +tmp[4]+tmp[5]+ "-" +tmp[6]+tmp[7];
				tmp = row.ExpireDate;
				row.ExpireDate = tmp[0]+tmp[1]+tmp[2]+tmp[3]+ "-" +tmp[4]+tmp[5]+ "-" +tmp[6]+tmp[7];
			}

			if (CurWeekData.length < 1){
				bzgz.html("暂无本周工作记录")
			} else {
				je_table($(".add-zb .bzgz"),{
					width:"1188",
					isPage: false,
					datas: CurWeekData,
					columnSort:[],
					columns:[
						{name: "系统", 		field: "System", 	width: "70", align:"center"},
						{name: "模块", 		field: "Module", 	width: "60", align:"center"},
						{name: "类型", 		field: "Type", 		width: "70", align:"center"},
						{name: "跟踪号", 	field: "TraceNo", 	width: "60", align:"center"},
						{name: "工作内容", 	field: "Detail", 	width: "290", align:"left"},
						{name: "性质", 		field: "Property", 	width: "70", align:"center"},
						{name: "进度", 		field: "ProgressRate", width: "70", align:"center",
							renderer:function(obj, rowidex) {
								return GenProgressBarHtml(60, 14, obj.ProgressRate);
							}
						},
						{name: "开始日期", 		field: "StartDate", width: "100", align:"center"},
						{name: "后续人日", 		field: "NeedDays", width: "70", align:"center"},
						{name: "更新日期", 		field: "EditDate", width: "100", align:"center"},
						{name: "计划完成日期", 		field: "ExpireDate", width: "100", align:"center"},
						{name: "操作", field:'id', width:"125", align:"center", 
							renderer:function(obj, rowidex) {
								//console.log(obj);
	                    		return '<button name="'+obj.id+'" type="edit" class="je-btn je-bg-blue je-btn-small"><i class="je-icon">&#xe63f;</i></button> \
	    							<button  name="'+obj.id+'" type="delete" class="je-btn je-bg-red je-btn-small"><i class="je-icon">&#xe63e;</i></button> \
	    							<button  name="'+obj.id+'" type="turn" class="je-btn je-bg-green je-btn-small"><i class="je-icon" style="transform: rotate(-180deg);">&#xe627;</i></button>';
	                    	}
	                	}
					],
					itemfun:function(elem,data){

					},
					success:function(elCell, tbody) {
						$(".add-zb .bzgz button").click(function(){
							var param = new Object();
							param.SessionID  = Options.SessionID;
							if ($(this).attr("type") == "delete") {
								param.method = "DELETE";
								param.id = $(this).attr("name");
								param.week = 0;
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
										ksrq.val(d.StartDate);
										bz.val(d.Note);
										hxrr.val(d.NeedDays);

										fom.find(".update").attr("name", d.id);
										fom.find(".update").removeAttr('disabled');
										fom.find(".add").attr('disabled','');
										fom.find(".cancle").removeAttr('disabled');
									} else {
										alert(d.msg);
									}
								});
							}
							else if ($(this).attr("type") == "turn") {
								param.method = "TURN_NEXT";
								param.id = $(this).attr("name");
								sync_post_data("/report/", JSON.stringify(param), function(d){
									if (d.ErrCode == 0) {
										add_zb_show_work();
									} else {
										alert(d.msg);
									}
								});
							}
						});
					}	
				});
			}
			if (NextWeekData.length < 1) {
				xzgz.html("暂无下周工作记录")
			} else {
				je_table($(".add-zb .xzgz"),{
					width:"1163",
					isPage: false,
					datas: NextWeekData,
					columnSort:[],
					columns:[
						{name: "系统", 		field: "System", 	width: "70", align:"center"},
						{name: "模块", 		field: "Module", 	width: "60", align:"center"},
						{name: "类型", 		field: "Type", 		width: "70", align:"center"},
						{name: "跟踪号", 	field: "TraceNo", 	width: "60", align:"center"},
						{name: "工作内容", 	field: "Detail", 	width: "290", align:"left"},
						{name: "性质", 		field: "Property", 	width: "70", align:"center"},
						{name: "进度", 		field: "ProgressRate", width: "70", align:"center",
							renderer:function(obj, rowidex) {
								return GenProgressBarHtml(60, 14, obj.ProgressRate);
							}
						},
						{name: "开始日期", 		field: "StartDate", width: "100", align:"center"},
						{name: "后续人日", 		field: "NeedDays", width: "70", align:"center"},
						{name: "更新日期", 		field: "EditDate", width: "100", align:"center"},
						{name: "计划完成日期", 		field: "ExpireDate", width: "100", align:"center"},
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
										ksrq.val(d.StartDate);
										bz.val(d.Note);
										hxrr.val(d.NeedDays);

										fom.find(".update").attr("name", d.id);
										fom.find(".update").removeAttr('disabled');
										fom.find(".add").attr('disabled', '');
										fom.find(".cancle").removeAttr('disabled');
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
