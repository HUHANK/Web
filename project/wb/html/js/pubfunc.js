
function draw_table(obj, headers, datas) {
	
	var cols = headers.length;
	var rows = datas.length;
	var i = 0;
	var k = 0;

	/*thead*/
	var thead = "<thead><tr>";
	for (i=0; i<cols; i++) {
		thead = thead + "<th>" + headers[i] + "</th>";
	}
	thead = thead + "</tr></thead>";
	/*tbody*/
	var tbody = "<tbody>"
	for (i=0; i<rows; i++) {
		tbody = tbody +"<tr>";
		for (k=0; k<cols; k++) {
			tbody = tbody + "<td>" + datas[i][k] + "</td>";
		}
		tbody = tbody + "</tr>";
	}
	tbody = tbody + "</tbody>";

	var html = "<table>" + thead + tbody + "</table>";
	$(obj).html(html);
}

