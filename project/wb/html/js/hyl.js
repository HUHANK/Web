
/*
	obj：需要添加元素
	data：一个数组
*/
function hyl_select( obj, data, selFunc ) {
	$(obj).html("");
	/*添加输入框*/
	var _input = $("<input type='text' name=''>")
				.attr("class", "hyl-select-input")
				.attr("readonly","readonly");
	$(obj).append(_input);
	_input = $(obj).children("input");

	console.info($(obj).outerWidth());
	/*添加下拉框*/
	var _dropbox = $("<div></div>")
					.attr("class", "hyl-drop-down")
					.css("display", "none")
					.css("position", "fixed")
					//.css("width", _input.outerWidth()+"px")
					.css("background-color", "white");
	_input.after(_dropbox);
	_dropbox = _input.next(".hyl-drop-down");

	/*添加下拉框里面的元素*/
	$(data).each(function(index, el) {
		var tmp = $("<div></div>").text(el);
		_dropbox.append(tmp);
	});

	/*显示下拉框事件*/
	_input.focus(function(event) {
		/* Act on the event */
		$(this).next(".hyl-drop-down").css({
			width: $(this).outerWidth()+"px",
			top: $(this).outerHeight()+($(this).offset().top-$(document).scrollTop())+"px",
			left: $(this).offset().left+"px"
		});

		if ($(this).val().length < 1) {
			$(this).parent().find("div.selected").removeClass('selected');
		} else {
			var val1 = $(this).val();
			$(this).parent().find(".hyl-drop-down").children().each(function(index, el) {
				el = $(el);
				if ( el.text() == val1 ){
					el.addClass('selected');
				}
			});
		}
		$(this).next(".hyl-drop-down").slideDown(100, function() {
		});
	});


	/*下拉框元素被选中事件*/
	_dropbox.children().click({func: selFunc}, function(event) {
		/* Act on the event */
		//console.info(event);
		$(this).parent().find('.selected').removeClass('selected');
        $(this).addClass('selected');
        $(this).parent().slideUp(100);
        $(this).parent().prev('input').val($(this).text());
        if (typeof event.data.func !== "undefined")
        	event.data.func($(this));
	});

	$(document).on("scroll", function(ev) {
		//console.info(ev);
		setTimeout(function(){
			$(".hyl-drop-down").slideUp(100);
		}, 1);
	});

	_input.blur(function(event) {
		/* Act on the event */
		setTimeout(function(){
			$(".hyl-drop-down").slideUp(100);
		}, 100);
	});

	
}


function hyl_table(obj, conf) {
	var _obj = $(obj);

	//init
	_obj.html("");

	_obj.append($("<div></div>")
		.addClass('hyl-grid-thead')
	);
	_obj.append($("<div></div>")
		.addClass('hyl-grid-tbody')
	);

	_obj.find(".hyl-grid-thead").append($("<table></table>").append($("<thead></thead>")));
	_obj.find(".hyl-grid-tbody").append($("<table></table>").append($("<tbody></tbody>")));

	//_obj.find(".hyl-grid-thead table").append(_colg);
	//_obj.find(".hyl-grid-tbody table").append(_colg);
	var _thead = _obj.find(".hyl-grid-thead thead");
	var _tbody = _obj.find(".hyl-grid-tbody tbody");

	/*add Head*/
	var _fields = [];
	var _widths = [];
	var _aligns = [];
	var _tr = $("<tr></tr>");
	var _colg = $("<colgroup></colgroup>");
	var _colg1 = $("<colgroup></colgroup>");
	$(conf.columns).each(function(index, el) {
		_fields.push(el.field);
		_widths.push(el.width);
		_aligns.push(el.align);
		_tr.append($("<th></th>").append(
			$("<div></div>").text(el.name).css("width", (el.width-1) + "px"))
			.attr("align", "center").attr("width", el.width));
		_colg.append( $("<col></col>").css("width", el.width) );
		_colg1.append( $("<col></col>").css("width", el.width) );	
	});
	_thead.append(_tr);
	_thead.before(_colg);
	_tbody.before(_colg1);

	/*add body*/
	$(conf.datas).each(function(index, el) {
		_tr = $("<tr></tr>").attr("row", el["ID"]);
		$(_fields).each(function(index, ell) {
			var _td = $("<td></td>").append($("<div></div>").css("width", (_widths[index]-1)+"px").text(el[ell]))
					.attr("align", _aligns[index])
					.attr("width", _widths[index]);
			_tr.append(_td);
		});		
		_tbody.append(_tr);
	});

	 console.info(_obj.height());
	 console.info( _obj.find(".hyl-grid-thead").outerHeight())

	_obj.find(".hyl-grid-tbody").css("height", (_obj.height()-_obj.find(".hyl-grid-thead").outerHeight())+"px");

}