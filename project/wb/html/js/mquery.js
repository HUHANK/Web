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
			var btn = $("<button></button>").text("取消全部").addClass("je-btn je-btn-mini cancle").css("margin-left", "2px");
			$(obj).append(
				$(li).append(
					$(span).append($("<button></button>").text(data.name).addClass("je-btn je-btn-mini all"), btn)
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
			console.info(tmp);
			query_sidebar_add_list($(".query .sidebar .kfbm"), tmp);
			
		}else if (tmp.name == "系统"){
			console.info(tmp);
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

		if ($(this).parent().hasClass('week')){
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

	query_get_result(0);

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

	console.info(g_CURRENT_WEEK);
	$(".query .sidebar .week .content input").val(g_CURRENT_WEEK);
	$(".query .sidebar .week .content input").change(function(e){
		console.info($(this));
		var start = 0;
		var end = 0;
		if ($(this).hasClass("start")) {
			start = parseInt($(this).val());
			end = parseInt($(this).siblings().val());
			if (start > end ){
				$(this).siblings().val(start);
			}
		}
		if ($(this).hasClass("end")) {
			end = parseInt($(this).val());
			start = parseInt($(this).siblings().val());
			if (end < start) {
				alert("结束周期不能小于开始周期，请检查！");
				$(this).val(start);
			}
		}
	});

}

function query_get_result(page) {
	var param = new Object();
	param.method = "QUERY";
	param.condition = QueryCondi;
	param.page = page;
	param.pageSize = 15;
	console.info(g_ALL_USER);
	post_data("/query/", JSON.stringify(param), function(d){
		d = $.parseJSON(d);
		if (d.ErrCode != 0) {
			alert("数据库查询出错！");
			return;
		}

		for( var i=0; i<d.data.length; i++) {

			for (var j=0; j<g_ALL_USER.length; j++) {
				if (d.data[i].UID == g_ALL_USER[j].id) {
					//console.info(g_ALL_USER[j]);
					d.data[i].UNAME = g_ALL_USER[j].cname;
				}
			}
		}
		console.info(d.data);
		$(".query .result .box").html("");
		je_table($(".query .result .box"), {
			height: "740",
			isPage: false,
			datas: d.data,
			columnSort:[],
			columns:[
			{name: "系统", field:"System", 	width:"80", align:"center"},
			{name: "模块", field:"Module", 	width:"80", align:"center"},
			{name: "类型", field:"Type", 	width:"80", align:"center"},
			{name: "跟踪号", field:"TraceNo", 	width:"100", align:"center"},
			{name: "工作内容", field:"Detail", 	width:"360", align:"center"},
			{name: "性质", field:"Property", 	width:"80", align:"center"},
			{name: "人员", field:"UNAME", 	width:"60", align:"center"},
			{name: "进度", field:"ProgressRate", 	width:"40", align:"center"},
			{name: "开始日期", field:"StartDate", 	width:"100", align:"center"},
			{name: "后续人日", field:"NeedDays", 	width:"60", align:"center"},
			{name: "周期", field:"WEEK", 	width:"100", align:"center"}
			],
			itemfun: function(elem, data){}
		});

		var tmp = parseInt(d.total / param.pageSize ) + 1;
		$(".query .result .ztl .totalPage").text(tmp);
		$(".query .result .ztl .totalCount").text(d.total);
		$(".query .result .ztl .pageIndex").text(page+1);
	});
}

