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
	$(".tab-bar button").click(function() {
		var sel = "selected";
		if ($(this).hasClass(sel)) {
			return;
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
			var id = tbody.children().length + 1;
			var html = '<tr><td align="center">' + id + '</td> \
						<td class="field-name"></td> \
						<td class="field-type"></td> \
						<td class="field-length"></td> \
						<td class="is-null" align="center"><button class="radio selected"></button></td> \
						<td class="primary-key" align="center"><button class="radio"></button></td>\
						<td class="field-default">\'\'</td>	\
						<td class="field-note"></td>	\
						</tr>';
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
				} else {
					$(this).addClass(sel);
					if ($(this).parent().hasClass("primary-key")) {
						$(this).parent().parent().find(".is-null button").addClass('selected');
					}
				}
			});

			tbody.find("td").unbind("click");
			tbody.find("td").click(function(event) {
				if ($(this).hasClass("field-name") ||
					$(this).hasClass("field-length") ||
					$(this).hasClass("field-default") ||
					$(this).hasClass("field-note")
				) {
					var twidth = $(this).width();
					var theight = $(this).height();
					var txt = $(this).text();
					$(this).html('<input type="text" name="" class="tunit">');
					$(this).find("input").val(txt);
					$(this).find("input").css({
						"border": "none",
						"width": (twidth) + "px",
						"height": (theight) + "px"
					});
					$(this).find("input").focus();


					$(this).find("input").blur(function() {
						var tmp = $(this).val();
						console.info(tmp);
						$(this).parent().append(tmp);
						$(this).remove();
					});
				} else if ($(this).hasClass("field-type")) {
					var twidth = $(this).width();
					var theight = $(this).height();
					var ttop = $(this).offset().top + theight + 1;
					var tleft = $(this).offset().left;
					var html = '<input type="text" name="" class="tunit">';
					$(this).addClass(gCLASSID1);
					$(this).html(html);
					$(this).find("input").css({
						"border": "none",
						"width": (twidth) + "px",
						"height": (theight) + "px"
					});
					html = '<div class="hyl-global-box-1"> \
								<div class="hyl-global-unit">CHAR</div>\
								<div class="hyl-global-unit">DECIMAL</div> \
								<div class="hyl-global-unit">INTEGER</div> \
								<div class="hyl-global-unit">VARCHAR</div> \
							</div>';
					$("body").append(html);
					$(".hyl-global-box-1").css({
						"border": "1px solid #15D7F3",
						"width": twidth + "px",
						"position": "absolute",
						"top": ttop + "px",
						"left": tleft + "px",
						"background-color": "white",
						"z-index": "999"
					});

					$(".hyl-global-box-1 .hyl-global-unit").click(function() {
						console.info($(this).text());
						$("." + gCLASSID1).html($(this).text());
						$("." + gCLASSID1).removeClass(gCLASSID1);
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

		if ($(this).attr("name") != ".presql" && $(this).attr("name") != ".cstruct")
			return;
		var Table = new Object();
		Table.TableName = $(".table-name input").val();
		Table.Cols = new Array();
		var arr = $(".show-area .field tbody").children();
		for (var i = 0; i < arr.length; i++) {
			var element = arr[i];
			var obj = new Object();
			obj.name = $(element).find(".field-name").text();
			obj.type = $(element).find(".field-type").text();
			obj.len = $(element).find(".field-length").text();
			if ($(element).find(".is-null .radio").hasClass("selected")) {
				obj.isNull = true;
			} else {
				obj.isNull = false;
			}
			if ($(element).find(".primary-key .radio").hasClass("selected")) {
				obj.isPrimary = true;
			} else {
				obj.isPrimary = false;
			}
			obj.default = $(element).find(".field-default").text();
			obj.note = $(element).find(".field-note").text();
			Table.Cols.push(obj);
		}

		var sql = "";
		var primaryKey = "";
		var comments = "";
		var sStruct = "struct st_" + Table.TableName.toLowerCase() + "\n{\n";
		sql = "CREATE TABLE " + Table.TableName + "(\n";
		for (var i = 0; i < Table.Cols.length; i++) {
			var row = Table.Cols[i];
			if (row.len.length > 0) {
				sql += "\t" + row.name + "  " + row.type + "(" + row.len + ")";
			} else {
				sql += "\t" + row.name + "  " + row.type;
			}
			if (row.isNull) {
				sql += " NOT NULL";
			}
			if (row.default.length != 0) {
				sql += " WITH DEFAULT " + row.default;
			}

			sql += ",\n";
			if (row.isPrimary) {
				primaryKey += row.name + ",";
			}
			/*--------------×¢ÊÍ------------------*/
			comments += " comment on column " + Table.TableName + "." + row.name + " is '" + row.note + "';\n";
			/*--------------C½á¹¹Ìå------------------*/
			sStruct += "\t";
			var ty = row.type.toLowerCase();
			if (ty == "char" || ty == "varchar") {
				sStruct += "char\ts" + row.name.toLowerCase() + "[" + row.len + "];";
			} else if (ty == "int" || ty == "integer") {
				sStruct += "int\ti" + row.name.toLowerCase() + ";";
			} else if (ty == "decimal" || ty == "float" || ty == "double") {
				sStruct += "double\td" + row.name.toLowerCase() + ";";
			}
			sStruct += "\n";
		}
		if (primaryKey.length == 0) {
			sql = sql.substring(0, sql.length - 2) + "\n";
		} else {
			primaryKey = primaryKey.substring(0, primaryKey.length - 1);
			primaryKey = '\tCONSTRAINT "P_Key_1" PRIMARY KEY (' + primaryKey + ')\n';
			sql = sql + primaryKey;
		}
		sql += ");";
		sql += "\n\n" + comments;

		sStruct += "};\n";
		$(".show-area .presql textarea").val(sql);
		$(".show-area .cstruct textarea").val(sStruct);
	});
}