function add_zb_ginit() {
	/*初始化日历控件*/
	jeDate.skin('gray');
	jeDate({
		dateCell:".add-zb .edit .form .ksrq",//isinitVal:true,
		format:"YYYY-MM-DD",
		isTime:false, //isClear:false,
		isinitVal:true,
		minDate:"2014-10-19 00:00:00",
		maxDate:"2020-11-8 00:00:00"
	});

	jeui.use(["jeSelect"], function(){
		$(".add-zb .edit .form select").jeSelect({
			sosList:true,
			itemfun:function(elem,index){
				if (elem.attr("class") == "fsys") {
					console.info(elem.val());
					console.info(g_ALL_SYSTEM);
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
					shtml = "<option></option>"
					for (var i=0; i<dd.length; i++) {
						shtml += "<option name='"+dd[i].id+"'>"+ dd[i].name +"</option>";
					}
					fmod.html(shtml);
				}
			}
		});
	});

}

function add_zb_form_clean() {
	var editForm = $(".add-zb .edit .form");
	editForm.find("select").html("");
	editForm.find("input").val("");
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

		if (sys.val() == "") {
			alert("系统选项不能为空！");
			return;
		}
		if (mod.val() == "") {
			alert("模块选项不能为空！");
			return;
		}
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

		post_data("/report/", JSON.stringify(param), function(d) {
			d = $.parseJSON(d);
			if (d.ErrCode == 0) {
				add_zb_show_work();

				sys.val("");
				mod.val("");
				type.val("");
				property.val("");
				jd.val("");
				gzh.val("");
				gznr.val("");
				ksrq.val("");
				hxrr.val("");
				bz.val("");
			}
		});
	})

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

			if (CurWeekData.length < 1){
				bzgz.html("暂无本周工作记录")
			} else {
				je_table($(".add-zb .bzgz"),{
					width:"1193",
					isPage: false,
					datas: CurWeekData,
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
						{name: "ID", 		field: "id", 		width: "40", align:"center"},
						{name: "系统", 		field: "System", 	width: "100", align:"center"},
						{name: "模块", 		field: "Module", 	width: "100", align:"center"},
						{name: "类型", 		field: "Type", 		width: "100", align:"center"},
						{name: "跟踪号", 	field: "TraceNo", 	width: "60", align:"center"},
						{name: "工作内容", 	field: "Detail", 	width: "260", align:"left"},
						{name: "性质", 		field: "Property", 	width: "100", align:"center"},
						{name: "进度", 		field: "ProgressRate", width: "60", align:"center"},
						{name: "备注", 		field: "Note", 		width: "220",  align:"left"},
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
						elCell.jeCheck({
			                jename:"chunk",
			                checkCls:"je-check",
			                itemfun: function(elem,bool) {
			                    //alert(elem.attr("jename")
			                },
			                success:function(elem){
			                    jeui.chunkSelect(elem,".add-zb .bzgz .gocheck",'on')
			                }
			            });

						$(".add-zb .bzgz button").click(function(){
							var param = new Object();
							param.SessionID  = Options.SessionID;
							if ($(this).attr("type") == "delete") {
								// param.method = "DELETE";
								// param.id = $(this).attr("name");
								// sync_post_data("/sjwh_bmgl/", JSON.stringify(param), function(d){
								// 	if (d.ErrCode == 0) {
								// 		sjwh_bmgl_update();
								// 		GUpdateBaseinfo();
								// 	} else {
								// 		pop_box("ERROR", 200, 120, d.msg);
								// 	}
								// });
							}
							else if ($(this).attr("type") == "edit") {

							}
						});
					}	
				});
			}
			if (NextWeekData.length < 1) {
				xzgz.html("暂无下周工作记录")
			} else {
				console.info(NextWeekData);
				je_table($(".add-zb .xzgz"),{
					width:"1193",
					isPage: false,
					datas: NextWeekData,
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
						{name: "ID", 		field: "id", 		width: "40", align:"center"},
						{name: "系统", 		field: "System", 	width: "100", align:"center"},
						{name: "模块", 		field: "Module", 	width: "100", align:"center"},
						{name: "类型", 		field: "Type", 		width: "100", align:"center"},
						{name: "跟踪号", 	field: "TraceNo", 	width: "60", align:"center"},
						{name: "工作内容", 	field: "Detail", 	width: "260", align:"left"},
						{name: "性质", 		field: "Property", 	width: "100", align:"center"},
						{name: "进度", 		field: "ProgressRate", width: "60", align:"center"},
						{name: "备注", 		field: "Note", 		width: "220",  align:"left"},
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
						elCell.jeCheck({
			                jename:"chunk",
			                checkCls:"je-check",
			                itemfun: function(elem,bool) {
			                    //alert(elem.attr("jename")
			                },
			                success:function(elem){
			                    jeui.chunkSelect(elem,".add-zb .bzgz .gocheck",'on')
			                }
			            });

						$(".add-zb .xzgz button").click(function(){
							var param = new Object();
							param.SessionID  = Options.SessionID;
							if ($(this).attr("type") == "delete") {
								param.method = "DELETE";
								param.id = $(this).attr("name");
								sync_post_data("/report/", JSON.stringify(param), function(d){
									if (d.ErrCode == 0) {
										add_zb_show_work();
									} else {
										alert(d.msg);
									}
								});
							}
							else if ($(this).attr("type") == "edit") {

							}
						});
					}	
				});
			}
		}
	});
}
