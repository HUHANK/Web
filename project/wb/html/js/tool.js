window.onload = main;

var gCLASSID1 = "aab77b28cb346e8aaab8854f7e56cac";

function main() {
	InitWindow();
	InitTabBar();
	InitTitleBar();
	genPreSQL();
}

function InitWindow() {
	var wheight = $(window).height();
	var wwidth = $(window).width();

	$("body .wrap").height(wheight);
}

function InitTabBar() {
	$(".tab-bar button").click(function(){
		var sel = "selected";
		if ($(this).hasClass(sel)) {
			return ;
		}
		$(this).siblings().removeClass(sel);
		$(this).addClass(sel);

		var se = $(this).attr("name");
		se = ".show-area " + se;
		$(se).siblings().css({
			display: 'none'
		});
		$(se).css({
			display: 'block'
		});
		$(se).siblings().removeClass(sel);
		$(se).addClass(sel);
	});
}

function InitTitleBar() {
	$("#add-field").click(function() {
		//console.log($(".show-area thead").find("th").length);
		var seld = $(".show-area .selected");
		//console.info(seld);
		if (seld.hasClass("field")) {
			var tbody = seld.find("tbody");
			var id = tbody.children().length+1;
			var html = '<tr><td align="center">'+id+'</td> \
						<td class="field-name"></td> \
						<td class="field-type"></td> \
						<td class="field-length"></td> \
						<td class="is-null" align="center"><button class="radio"></button></td> \
						<td class="primary-key" align="center"><button class="radio"></button></td></tr>';
			tbody.append(html);
			
			tbody.find('tr').unbind("click");
			tbody.find('tr').click(function(event) {
				$(this).siblings().removeClass("selected");
				$(this).addClass("selected");
			});

			tbody.find('td .radio').unbind("click");
			tbody.find('td .radio').click(function(event) {
				console.info($(this).val());
				var sel = "selected";
				if ($(this).hasClass(sel)) {
					$(this).removeClass(sel);
				}else{
					$(this).addClass(sel);
				}
			});

			tbody.find("td").unbind("click");
			tbody.find("td").click(function(event) {
				if ($(this).hasClass("field-name") || 
					$(this).hasClass("field-length")) {
					var twidth = $(this).width();
					var theight = $(this).height();
					var txt = $(this).text();
					$(this).html('<input type="text" name="" class="tunit">');
					$(this).find("input").val(txt);
					$(this).find("input").css({
						"border": "none",
						"width": (twidth)+"px",
						"height": (theight)+"px"
					});
					$(this).find("input").focus();
					

					$(this).find("input").blur(function(){
						var tmp = $(this).val();
						console.info(tmp);
						$(this).parent().append(tmp);
						$(this).remove();
					});
				}
				else if ($(this).hasClass("field-type")) {
					var twidth = $(this).width();
					var theight = $(this).height();
					var ttop = $(this).offset().top+theight+1;
					var tleft = $(this).offset().left;
					var html = '<input type="text" name="" class="tunit">';
					$(this).addClass(gCLASSID1);
					$(this).html(html);
					$(this).find("input").css({
						"border": "none",
						"width": (twidth)+"px",
						"height": (theight)+"px"
					});
					html = '<div class="hyl-global-box-1"> \
								<div class="hyl-global-unit">CHAR</div>\
								<div class="hyl-global-unit">DECIMAL</div> \
								<div class="hyl-global-unit">VARCHAR</div> \
							</div>';
					$("body").append(html);
					$(".hyl-global-box-1").css({
						"border": "1px solid #15D7F3",
						"width" : twidth+"px",
						"position": "absolute",
						"top": ttop+"px",
						"left": tleft + "px",
						"background-color": "white",
						"z-index": "999"
					});

					$(".hyl-global-box-1 .hyl-global-unit").click(function(){
						console.info($(this).text());
						$("."+gCLASSID1).html($(this).text());
						$("."+gCLASSID1).removeClass(gCLASSID1);
						$(this).parent().remove();

					});

					$(this).find("input").focus();
				}
			});
		}
	});
}

function genPreSQL() {

	$(".tab-bar button").click(function() {

		if ($(this).attr("name") != ".presql")
			return;
		var Table = new Object();
		Table.TableName = $(".table-name input").val();
		Table.Cols = new Array();
		var arr = $(".show-area .field tbody").children();
		for (var i=0; i<arr.length; i++) {
			var element = arr[i];
			var obj = new Object();
			obj.name = $(element).find(".field-name").text();
			obj.type = $(element).find(".field-type").text();
			obj.len = $(element).find(".field-length").text();
			if ($(element).find(".is-null .radio").hasClass("selected")) {
				obj.isNull = true;
			}else {
				obj.isNull = false;
			}
			if ($(element).find(".primary-key .radio").hasClass("selected")) {	
				obj.isPrimary = true;
			}else{
				obj.isPrimary = false;
			}
			Table.Cols.push(obj);
		}

		var sql = "";
		sql = "CREATE TABLE " + Table.TableName + "(\n";
		for (var i=0; i<Table.Cols.length; i++) {
			var row = Table.Cols[i];
			sql += row.name + "  " + row.type + "(" + row.len + ")";

			sql += ",\n";
		}
		sql += ");";

		$(".show-area .presql textarea").val(sql);
	});
}

