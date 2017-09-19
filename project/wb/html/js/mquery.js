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

function query_sidebar_init() {
	console.info("------", g_QUERY_TREE, g_QUERY_TREE.length);
	for(var ii=0; ii<g_QUERY_TREE.length; ii++) {
		//console.info(g_QUERY_TREE[i]);
		var tmp = g_QUERY_TREE[ii];
		console.info(tmp);
		if (tmp.name == "开发部门") {
			var shtml = "";
			var data = tmp.data;
			for (var i=0; i<data.length; i++) {
				var s = "<div>" + data[i].name + "</div>";
				s += "<div class='ej'>"
				for (var j=0; j<data[i].data.length; j++) {
					var d = data[i].data[j];
					s += "<div name='" +d.id+ "'>" + d.name + "</div>";
					s += "<div class='sj'>";
					for (var k=0; k<d.data.length; k++) {
						var dd = d.data[k];
						s += "<button name='" + dd.id + "'>" + dd.name + "</button>";
					}
					s += "</div>";
				}
				s += "</div>";
				shtml += s;
				//console.info(data[i]);
			}
			//console.info(shtml);
			$(".query .sidebar .yj-content.depart").html(shtml);
		}else if (tmp.name == "系统"){
			// console.info("System", tmp);
			var d = tmp.data;
			var s = "";
			for (var i=0; i<d.length; i++){
				s += "<div>" + d[i].name + "</div>";
				s += "<div class='ej'>";

				for(var j=0; j<d[i].data.length; j++){
					var dd = d[i].data[j];
					s += "<div>" + dd.name + "</div>";
					s += "<div class='sj'>";

					for(var k=0; k<dd.data.length; k++){
						var ddd = dd.data[k];
						s += "<button>" + dd.name + "</button>"
					}
					s += "</div>";
				}
				s += "</div>";
			}
			// console.info(s);
			$(".query .sidebar .yj-content.system").html(s);
		}else if (tmp.name == "类型") {
			var d = tmp.data;
			var s = "";
			for (var i=0; i<d.length; i++) {
				
			}
		}else if (tmp.name == "性质") {

		}
	}
}

