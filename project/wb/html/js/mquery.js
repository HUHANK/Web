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
	//sidebar();
}

function query_sidebar_add_list(obj, data) {
	var aicon =  "<i class='je-icon'>&#xe66e;</i>";	/*加图标*/
	var bicon =  "<i class='je-icon'>&#xe712;</i>"; /*减图标*/
	var cicon =  "<i class='je-icon'>&#xe641;</i>"; /*头像*/ 
	var dicon =  "<i class='je-icon'>&#xe949;</i>"; /*指向图标*/

	var span = "<span></span>";
	var li = "<li></li>";
	var ul = "<ul></ul>";
	var display_none = {"display": "none"};
	var display_block = {"display": "block"};

	function add_leaf_node(obj, data) {
		$(obj).append(
			$(li).append(
				$(span).append($(dicon), data.name)
			).addClass("leaf")
		);
	}
	function add_not_leaf_node(obj, ulobj, data, cla) {
		$(obj).append(
			$(li).append(
				$(span).append($(aicon), data.name), $(ulobj)
			).addClass(cla)
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
								add_leaf_node(sjul, ddd);
							}
						}
						add_not_leaf_node(ejul, sjul, dd, "layer3");
					} else {
						add_leaf_node(ejul, dd);
					}
				}
				add_not_leaf_node(yjul, ejul, d, "layer2");
			} else {
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
			query_sidebar_add_list($(".query .sidebar .kfbm"), tmp);
			
		}else if (tmp.name == "系统"){
			query_sidebar_add_list($(".query .sidebar .xt"), tmp);
			
		}else if (tmp.name == "类型") {
			query_sidebar_add_list($(".query .sidebar .lx"), tmp);

		}else if (tmp.name == "性质") {
			query_sidebar_add_list($(".query .sidebar .xz"), tmp);
		}
	}

	$(".body .query .sidebar span").click(function() {
		var aicon =  "<i class='je-icon'>&#xe66e;</i>";	/*加图标*/
		var bicon =  "<i class='je-icon'>&#xe712;</i>"; /*减图标*/
		var display_none = {"display": "none"};

		if ($(this).hasClass("selected")) {
			$(this).removeClass("selected");
		} else {
			$(this).addClass('selected');
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
		}
	});

	query_sidebar_css_init();
}

function query_sidebar_css_init() {
}
