function query() {
	
	//sidebar();
}

function query_sidebar_add_list(obj, data) {
	var aicon =  "<i class='je-icon'>&#xe61a;</i>";	/*加图标*/
	var bicon =  "<i class='je-icon'>&#xe62a;</i>"; /*减图标*/
	var cicon =  "<i class='je-icon'>&#xe641;</i>"; /*头像*/ 
	var dicon =  "<i class='je-icon'>&#xe949;</i>"; /*指向图标*/

	var span = "<span></span>";
	var li = "<li></li>";
	var ul = "<ul></ul>";
	var display_none = {"display": "none"};
	var display_block = {"display": "block"};

	function add_leaf_node(obj, data) {
		if (data.id == 0) {
			var btn = $("<button></button>").text("取消全部").addClass("je-btn je-btn-mini je-bg-native cancle").css("margin-left", "2px");
			$(obj).append(
				$(li).append(
					$(span).append($("<button></button>").text(data.name).addClass("je-btn je-btn-mini je-bg-native all"), btn)
				).addClass("leaf").attr("attr", data.attr + "," + data.id)
			);
		} else {
			var ele = $("<em></em>").text(data.name);
			$(obj).append(
				$(li).append(
					$(span).append($(dicon), ele)
				).addClass("leaf").attr("attr", data.attr + "," + data.id)
			);
		}
	}
	function add_not_leaf_node(obj, ulobj, data, cla) {
		var ele = $("<em></em>").text(data.name);
		$(obj).append(
			$(li).append(
				$(span).append($(aicon), ele), 
				$(ulobj)
			).addClass(cla).attr("attr", data.attr + "," + data.id)
		)
	}

	obj = $(obj);
	obj.remove("ul");
	obj.append(ul);

	var yjul = obj.children("ul");

	if (data.data.length < 1) {
		/*do nothing*/
	} else {
		for(var i=0; i<data.data.length; i++) {
			var d = data.data[i];
			if (d.data.length > 0) {
				var ejul = $(ul);
				for(var j=0; j<d.data.length; j++) {
					var dd = d.data[j];
					if (dd.data.length > 0) {
						var sjul = $(ul);
						for (var k=0; k<dd.data.length; k++) {
							var ddd = dd.data[k];
							if (ddd.data.length > 0) {

							}else {
								if (k == 0) {
									var tmp = {};
									tmp.name = "全选";
									tmp.id = 0;
									tmp.attr = "";
									add_leaf_node(sjul, tmp);
								}
								add_leaf_node(sjul, ddd);
							}
						}
						add_not_leaf_node(ejul, sjul, dd, "layer3");
					} else {
						if (j == 0) {
							var tmp = {};
							tmp.name = "全选";
							tmp.id = 0;
							tmp.attr = "";
							add_leaf_node(ejul, tmp);
						}
						add_leaf_node(ejul, dd);
					}
				}
				add_not_leaf_node(yjul, ejul, d, "layer2");
			} else {
				if (i == 0) {
					var tmp = {};
					tmp.name = "全选";
					tmp.id = 0;
					tmp.attr = "";
					add_leaf_node(yjul, tmp);
				}
				add_leaf_node(yjul, d);
			}
		}
	}
	$(obj).find('ul').css(display_none);
}

function query_sidebar_init() {
	//console.info("------", g_QUERY_TREE, g_QUERY_TREE.length);
	for(var ii=0; ii<g_QUERY_TREE.length; ii++) {
		var tmp = g_QUERY_TREE[ii];
		
		if (tmp.name == "开发部门") {
			//console.info(tmp);
			query_sidebar_add_list($(".query .sidebar .kfbm"), tmp);
			
		}else if (tmp.name == "系统"){
			//console.info(tmp);
			query_sidebar_add_list($(".query .sidebar .xt"), tmp);
			
		}else if (tmp.name == "类型") {
			query_sidebar_add_list($(".query .sidebar .lx"), tmp);

		}else if (tmp.name == "性质") {
			query_sidebar_add_list($(".query .sidebar .xz"), tmp);
		}
	}

	$(".body .query .sidebar span").click(function() {
		var aicon =  "<i class='je-icon'>&#xe61a;</i>";	/*加图标*/
		var bicon =  "<i class='je-icon'>&#xe62a;</i>"; /*减图标*/
		var display_none = {"display": "none"};

		if ($(this).parent().attr("attr") == ",0"){
			return;
		}


		if ($(this).hasClass("selected")) {
			$(this).removeClass("selected");
		} else {
			$(this).addClass('selected');
		}

		if ($(this).parent().hasClass('week') || 
			$(this).parent().hasClass('schedule') ||
			$(this).parent().hasClass('delay') ||
			$(this).parent().hasClass('export') ||
			$(this).parent().hasClass('sort')
			){
			if ($(this).parent().children(".content").css("display") == "none") {
				$(this).parent().children(".content").css("display", "block");
			} else {
				$(this).parent().children(".content").css("display", "none");
			}
			return;
		}

		if (!$(this).parent().hasClass("leaf")) {
			var bro = $(this).siblings('ul');
			var i = $(this).children("i");
			if (bro.css("display") == "none") {
				bro.css("display", "block");
				i.before($(bicon));
				i.remove();
			} else {
				bro.css(display_none);
				i.before($(aicon));
				i.remove();
			}
		} else {
			var name = $(this).parent().find("em").text();
			var attr = $(this).parent().attr("attr");
			var isAdd = 0;
			if ($(this).hasClass("selected")) {
				isAdd = 1;
			}else {
				isAdd = 0;
			}
			//console.info(name, attr, isAdd);
			deal_query_condition(name, attr, isAdd);
			query_get_result(0);
		}

		var liele = $(this).parent();
		//console.info(liele.attr("attr"));
		if (typeof(liele.attr("attr")) != "undefined") {
			var attr = liele.attr("attr");
			//console.info(attr);
		}
	});

	$(".body .query .sidebar .leaf button").click( function() {
		//console.info($(this).parent().parent().siblings());
		if ($(this).hasClass("all")) {
			$(this).parent().parent().siblings().each(function(index, data){
				$(data).children("span").addClass('selected');
				var name = $(data).children('span').children("em").text();
				var attr = $(data).attr("attr");
				var isAdd = 1;
				//console.info(name, attr, isAdd);
				deal_query_condition(name, attr, isAdd);
			});
		}
		if ($(this).hasClass("cancle")){
			$(this).parent().parent().siblings().each(function(index, data){
				$(data).children("span").removeClass('selected');
				var name = $(data).children('span').children("em").text();
				var attr = $(data).attr("attr");
				var isAdd = 0;
				//console.info(name, attr, isAdd);
				deal_query_condition(name, attr, isAdd);
			});
		}
		query_get_result(0);
	});

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
		query_get_result(pageIndex - 1);
	});

	//console.info(g_CURRENT_WEEK);
	$(".query .sidebar .week .content .start").val(g_CURRENT_WEEK);
	$(".query .sidebar .week .content .end").val(g_CURRENT_WEEK);
	$(".query .sidebar .week .content .year").val(g_CURRENT_YEAR);
	/*跟新查询条件*/
	if (typeof(QueryCondi.week) == "undefined" ) {
		QueryCondi.week = {};
	}
	QueryCondi.week.start = g_CURRENT_WEEK;
	QueryCondi.week.end = g_CURRENT_WEEK;
	QueryCondi.week.year = g_CURRENT_YEAR;
	$(".query .sidebar .week .content input").change(function(e){
		//console.info($(this));
		var start = parseInt($(this).parent().find(".start").val());
		var end   = parseInt($(this).parent().find(".end").val());
		var year  = parseInt($(this).parent().find(".year").val());
		if ($(this).hasClass("start")) {
			if (start > end ){
				$(this).siblings(".end").val(start);
				end = start;
			}
		}
		if ($(this).hasClass("end")) {
			if (end < start) {
				alert("结束周期不能小于开始周期，请检查！");
				$(this).val(start);
				end = start;
			}
		}

		/*跟新查询条件*/
		if (typeof(QueryCondi.week) == "undefined" ) {
			QueryCondi.week = {};
		}
		QueryCondi.week.start = start;
		QueryCondi.week.end = end;
		QueryCondi.week.year = year;

		/*跟新结果*/
		query_get_result(0);
	});

	$(".query .sidebar .schedule .content .all").removeClass("je-bg-native");
	$(".query .sidebar .schedule .content button").click(function(){
		if (!$(this).hasClass("je-bg-native")) {
			return;
		}
		$(this).parent().children().each(function(index, data){
			if (!$(data).hasClass("je-bg-native")){
				$(data).addClass("je-bg-native");
			}
		});
		$(this).removeClass("je-bg-native");
		/*跟新查询条件*/
		if (typeof(QueryCondi.schedule) == "undefined" ) {
			QueryCondi.schedule = -1;
		}
		if ($(this).hasClass("all")) {
			QueryCondi.schedule = -1;
		}
		if ($(this).hasClass("wwc")) {
			QueryCondi.schedule = 0;
		}
		if ($(this).hasClass("ywc")) {
			QueryCondi.schedule = 100;
		}
		/*跟新结果*/
		query_get_result(0);
	});

	$(".query .sidebar .delay .content .all").removeClass("je-bg-native");
	$(".query .sidebar .delay .content button").click(function(){
		if (!$(this).hasClass("je-bg-native")) {
			return;
		}
		$(this).parent().children().each(function(index, data){
			if (!$(data).hasClass("je-bg-native")){
				$(data).addClass("je-bg-native");
			}
		});
		$(this).removeClass("je-bg-native");
		/*跟新查询条件*/
		if (typeof(QueryCondi.delay) == "undefined" ) {
			QueryCondi.delay = -1;
		}
		if ($(this).hasClass("all")) {
			QueryCondi.delay = -1;
		}
		if ($(this).hasClass("wyw")) {
			QueryCondi.delay = 0;
		}
		if ($(this).hasClass("yyw")) {
			QueryCondi.delay = 1;
		}
		/*跟新结果*/
		query_get_result(0);
	});

	$(".query .sidebar .sort .content .asce").removeClass("je-bg-native");
	$(".query .sidebar .sort .content button").click(function() {
		if (!$(this).hasClass("je-bg-native")) {
			return;
		}
		$(this).parent().children().each(function(index, data){
			if (!$(data).hasClass("je-bg-native")){
				$(data).addClass("je-bg-native");
			}
		});
		$(this).removeClass("je-bg-native");

		/*跟新查询条件*/
		if (typeof(QueryCondi.sortType) == "undefined") {
			QueryCondi.sortType = "ASCE"; /*升序*/
		}
		if ($(this).hasClass("asce")) {
			QueryCondi.sortType = "ASCE"; /*升序*/
			$(".query .result .box thead .selected").removeClass("desc");
			$(".query .result .box thead .selected").addClass("asce");
		}
		if ($(this).hasClass("desc")) {
			QueryCondi.sortType = "DESC"; /*降序*/
			$(".query .result .box thead .selected").removeClass("asce");
			$(".query .result .box thead .selected").addClass("desc");
		}

		QueryCondi.sortCols = new Array();
		$(".query .result .box thead .selected").each( function(index, elem) {
			QueryCondi.sortCols.push($(elem).attr("name"));
		});
		
		/*跟新结果*/
		if (QueryCondi.sortCols.length > 0)
			query_get_result(0);
	});

	function Cleanup() {
        window.clearInterval(idTmr);
        CollectGarbage();
    }
    var tableToExcel = (function() {
          var uri = 'data:application/vnd.ms-excel;base64,',
          template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
            base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) },
            format = function(s, c) {
                return s.replace(/{(\w+)}/g,
                function(m, p) { return c[p]; }) }
            return function(table, name) {
            //if (!table.nodeType) table = document.getElementById(table)
            var ctx = {worksheet: name || 'Worksheet', table: table}
            window.location.href = uri + base64(format(template, ctx))
          }
        })()
	$(".query .sidebar .export .content button").click(function() {
		var param = new Object();
		param.method = "EXPORT";
		param.condition = QueryCondi;

		sync_post_data("/export/", JSON.stringify(param), function(d) {
			console.info(d);
			var html = "";
			var shead = "";
			var sbody = "";

			var NowDate = parseInt(GetNowDate());
			for( var i=0; i<d.data.length; i++) {
				for (var j=0; j<g_ALL_USER.length; j++) {
					if (d.data[i].UID == g_ALL_USER[j].id) {
						//d.data[i].UNAME = g_ALL_USER[j].cname;
						d.data[i].GNAME = g_ALL_USER[j].group_name;
					}
					
				}

				var tmp = d.data[i].AddDate;
				d.data[i].AddDate = tmp[0]+tmp[1]+tmp[2]+tmp[3]+ "-" +tmp[4]+tmp[5]+ "-" +tmp[6]+tmp[7];
				tmp = d.data[i].EditDate;
				var eDate = tmp;
				d.data[i].EditDate = tmp[0]+tmp[1]+tmp[2]+tmp[3]+ "-" +tmp[4]+tmp[5]+ "-" +tmp[6]+tmp[7];
				tmp = d.data[i].ExpireDate;
				d.data[i].ExpireDate = tmp[0]+tmp[1]+tmp[2]+tmp[3]+ "-" +tmp[4]+tmp[5]+ "-" +tmp[6]+tmp[7];
				//console.info(tmp);
				if (d.data[i].ProgressRate < 100) {
					if ( parseInt(tmp) < NowDate ) {
						d.data[i].ExpireDays = DateDiffNow('d', tmp);
					} else {
						d.data[i].ExpireDays = 0;
					}
				} else {
					//d.data[i].ExpireDays = DateDiff('d', eDate, tmp);
					d.data[i].ExpireDays = 0;
				}
			}

			shead += "<th>"+"组"+"</th>";
			shead += "<th>"+"系统"+"</th>";
			shead += "<th>"+"模块"+"</th>";
			shead += "<th>"+"类型"+"</th>";
			shead += "<th>"+"跟踪号"+"</th>";
			shead += "<th>"+"工作内容"+"</th>";
			shead += "<th>"+"性质"+"</th>";
			shead += "<th>"+"人员"+"</th>";
			shead += "<th>"+"进度"+"</th>";
			shead += "<th>"+"开始日期"+"</th>";
			shead += "<th>"+"创建日期"+"</th>";
			shead += "<th>"+"更新日期"+"</th>";
			shead += "<th>"+"后续人日"+"</th>";
			shead += "<th>"+"计划完成日期"+"</th>";
			shead += "<th>"+"备注"+"</th>";
			shead += "<th>"+"工作周期"+"</th>";
			shead = "<tr>" + shead + "</tr>";

			for(var i =0; i<d.data.length; i++) {
				var row = d.data[i];
				var trow = "";
				trow += "<td>" + row.GNAME + "</td>";
				trow += "<td>" + row.System + "</td>";
				trow += "<td>" + row.Module + "</td>";
				trow += "<td>" + row.Type + "</td>";
				trow += "<td>" + row.TraceNo + "</td>";
				trow += "<td>" + row.Detail + "</td>";
				trow += "<td>" + row.Property + "</td>";
				trow += "<td>" + row.UNAME + "</td>";
				trow += "<td>" + row.ProgressRate + "</td>";
				trow += "<td>" + row.StartDate + "</td>";
				trow += "<td>" + row.AddDate + "</td>";
				trow += "<td>" + row.EditDate + "</td>";
				trow += "<td>" + row.NeedDays + "</td>";
				trow += "<td>" + row.ExpireDate + "</td>";
				trow += "<td>" + row.Note + "</td>";
				trow += "<td>" + row.WEEK + "</td>";
				trow = "<tr>" + trow + "</tr>";
				sbody += trow;
			}
			html = "<table>" + shead + sbody + "</table>";

			if(getExplorer()=='ie') {
				alert("不支持IE导出！");
			} else {
				tableToExcel(html);
			}

		});
	});

	query_get_result(0);
}

function query_get_result(page) {
	var param = new Object();
	param.method = "QUERY";
	param.condition = QueryCondi;
	param.page = page;
	param.pageSize = 25;
	//console.info("Condition:",QueryCondi);
	//console.info(g_ALL_USER);
	post_data("/query/", JSON.stringify(param), function(d){
		d = $.parseJSON(d);
		if (d.ErrCode != 0) {
			alert("数据库查询出错！");
			return;
		}
		//console.info(GetNowDate());
		var NowDate = parseInt(GetNowDate());
		for( var i=0; i<d.data.length; i++) {
			for (var j=0; j<g_ALL_USER.length; j++) {
				if (d.data[i].UID == g_ALL_USER[j].id) {
					//d.data[i].UNAME = g_ALL_USER[j].cname;
					d.data[i].GNAME = g_ALL_USER[j].group_name;
				}
				
			}

			var tmp = d.data[i].AddDate;
			d.data[i].AddDate = tmp[0]+tmp[1]+tmp[2]+tmp[3]+ "-" +tmp[4]+tmp[5]+ "-" +tmp[6]+tmp[7];
			tmp = d.data[i].EditDate;
			var eDate = tmp;
			d.data[i].EditDate = tmp[0]+tmp[1]+tmp[2]+tmp[3]+ "-" +tmp[4]+tmp[5]+ "-" +tmp[6]+tmp[7];
			tmp = d.data[i].ExpireDate;
			d.data[i].ExpireDate = tmp[0]+tmp[1]+tmp[2]+tmp[3]+ "-" +tmp[4]+tmp[5]+ "-" +tmp[6]+tmp[7];
			//console.info(tmp);
			if (d.data[i].ProgressRate < 100) {
				if ( parseInt(tmp) < NowDate ) {
					d.data[i].ExpireDays = DateDiffNow('d', tmp);
				} else {
					d.data[i].ExpireDays = 0;
				}
			} else {
				//d.data[i].ExpireDays = DateDiff('d', eDate, tmp);
				d.data[i].ExpireDays = 0;
			}
		}
		//console.info(d.data);
		$(".query .result .box").html("");
		je_table($(".query .result .box"), {
			height: "740",
			isPage: false,
			datas: d.data,
			columnSort:[],
			columns:[
				{name: "<div class='rhead' name='Group'>组</div>", field:"GNAME", 	width:"60", align:"center"},
				{name: "<div class='rhead' name='System'>系统</div>", field:"System", 	width:"80", align:"center"},
				{name: "<div class='rhead' name='Module'>模块</div>", field:"Module", 	width:"80", align:"center"},
				{name: "<div class='rhead' name='Type'>类型</div>", field:"Type", 	width:"80", align:"center"},
				{name: "<div class='rhead' name='TraceNo'>跟踪号</div>", field:"TraceNo", 	width:"100", align:"center",
					renderer:function(obj, rowidex) {
						return GenTraceNoAhref(obj.TraceNo);
					}
				},
				{name: "工作内容", field:"Detail", 	width:"360", align:"left",
					renderer:function(obj, rowidex) {
						return '<pre style="font-size:12px;">' + obj.Detail + "</pre>";
					}
				},
				{name: "<div class='rhead' name='Property'>性质</div>", field:"Property", 	width:"80", align:"center"},
				{name: "<div class='rhead' name='UNAME'>人员</div>", field:"UNAME", 	width:"60", align:"center"},
				{name: "<div class='rhead' name='ProgressRate'>进度</div>", field:"ProgressRate", 	width:"70", align:"center",
					renderer:function(obj, rowidex) {
						return GenProgressBarHtml(60, 14, obj.ProgressRate);
					}
				},
				{name: "<div class='rhead' name='StartDate'>开始日期</div>", field:"StartDate", 	width:"100", align:"center"},
				{name: "<div class='rhead' name='AddDate'>创建日期</div>", field:"AddDate", 	width:"100", align:"center"},
				{name: "<div class='rhead' name='EditDate'>更新日期</div>", field:"EditDate", 	width:"100", align:"center"},
				{name: "<div class='rhead' name='NeedDays'>后续人日</div>", field:"NeedDays", 	width:"60", align:"center"},
				{name: "<div class='rhead' name='ExpireDate'>计划完成日期</div>", field:"ExpireDate", 	width:"100", align:"center"},
				{name: "延期天数", 	field:"ExpireDays", 	width:"70", align:"center"},
				{name: "备注", 	field:"Note", 	width:"300", 	align:"left",
	                renderer:function(obj, rowidex) {
						return '<pre style="font-size:12px;">' + obj.Note + "</pre>";
					}
	            },
				{name: "<div class='rhead' name='WEEK'>周期</div>", field:"WEEK", 	width:"100", align:"center"}
			],
			itemfun: function(elem, data){},
			success: function(elem){
				if (typeof(QueryCondi.sortCols) != "undefined") {
					var sortType = ''
					$(".query .sidebar .sort .content .je-bg-native").each(function(index, elem){
						if (!$(elem).hasClass("asce")) {
							sortType = "ASCE";
						}else{
							sortType = "DESC";
						}
					});

					for(var i=0; i<QueryCondi.sortCols.length; i++) {
						var col = QueryCondi.sortCols[i];
						var el = $(elem).find("thead div[name='"+col+"']");

						el.addClass('selected');
						if (sortType == "ASCE") {
							el.addClass("asce");
						} else {
							el.addClass("desc");
						}
					}
				}
				
				$(elem).find(".rhead").click(function(){

					var sortType = ''
					$(".query .sidebar .sort .content .je-bg-native").each(function(index, elem){
						if (!$(elem).hasClass("asce")) {
							sortType = "ASCE";
						}else{
							sortType = "DESC";
						}
					});
					QueryCondi.sortType = sortType;

					if (typeof(QueryCondi.sortCols) == "undefined") {
						QueryCondi.sortCols = new Array();
					}

					if (!$(this).hasClass("selected")) {
						$(this).addClass("selected");
						QueryCondi.sortCols.push($(this).attr("name"));
						if (sortType == "ASCE") {
							$(this).addClass("asce");
						} else {
							$(this).addClass("desc");
						}
					} else {
						$(this).removeClass("selected");
						for(var i=0; i<QueryCondi.sortCols.length; i++){
							var col = QueryCondi.sortCols[i];
							if ($(this).attr("name") == col) {
								QueryCondi.sortCols.splice(i, 1);
							}
						}

						if (sortType == "ASCE") {
							$(this).removeClass("asce");
						} else {
							$(this).removeClass("desc");
						}
					}

					/*跟新结果*/
					query_get_result(0);
				});
			}
		});

		var tmp = parseInt(d.total / param.pageSize ) + 1;
		$(".query .result .ztl .totalPage").text(tmp);
		$(".query .result .ztl .totalCount").text(d.total);
		$(".query .result .ztl .pageIndex").text(page+1);
	});
}

