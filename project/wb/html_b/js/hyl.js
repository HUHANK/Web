
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

	/*添加下拉框*/
	var _dropbox = $("<div></div>")
					.attr("class", "hyl-drop-down")
					.css("display", "none")
					.css("position", "fixed")
					.css({
						'font-size': '14px',
						"background-color": "white"
					});
	_input.after(_dropbox);
	_dropbox = _input.next(".hyl-drop-down");

	/*添加下拉框里面的元素*/
	$(data).each(function(index, el) {
		if (0 == index) {
			_dropbox.append($("<div></div>").css('height', '24px'));	
		}
		var tmp = $("<div></div>").text(el).attr("title", el);
		tmp.css({
			'white-space': 'nowrap',
			'overflow': 'hidden',
			'text-overflow': 'ellipsis'
		});
		_dropbox.append(tmp);
	});

	/*显示下拉框事件*/
	_input.focus(function(event) {
		/* Act on the event */
		setTimeout(function(){
			$(_input).next(".hyl-drop-down").css({
				width: $(_input).outerWidth()+"px",
				top: $(_input).outerHeight()+($(_input).offset().top-$(document).scrollTop())+"px",
				left: $(_input).offset().left+"px"
			});

			if ($(_input).val().length < 1) {
				$(_input).parent().find("div.selected").removeClass('selected');
			} else {
				var val1 = $(_input).val();
				$(_input).parent().find(".hyl-drop-down").children().each(function(index, el) {
					el = $(el);
					if ( el.text() == val1 ){
						el.addClass('selected');
					}
				});
			}
			$(_input).next(".hyl-drop-down").slideDown(200, function() {
			});

		}, 150);
	});


	/*下拉框元素被选中事件*/
	_dropbox.children().click({func: selFunc}, function(event) {
		/* Act on the event */
		//console.info(event);
		$(this).parent().find('.selected').removeClass('selected');
        $(this).addClass('selected');
        $(this).parent().slideUp(10);
        $(this).parent().prev('input').val($(this).text());
        if (typeof event.data.func !== "undefined")
        	event.data.func($(this));
	});

	// $(document).on("scroll", function(ev) {
	// 	//console.info(ev);
	// 	setTimeout(function(){
	// 		$(".hyl-drop-down").slideUp(10);
	// 	}, 1);
	// });

	// _input.blur(function(event) {
	// 	/* Act on the event */
	// 	setTimeout(function(){
	// 		$(".hyl-drop-down").slideUp(10);
	// 	}, 100);
	// });

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
	var _renderer = [];
	var _tr = $("<tr></tr>");
	var _colg = $("<colgroup></colgroup>");
	var _colg1 = $("<colgroup></colgroup>");
	$(conf.columns).each(function(index, el) {
		_fields.push(el.field);
		_widths.push(el.width);
		_aligns.push(el.align);
		_renderer.push(el.renderer);
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
			var element = el[ell];
			if (typeof _renderer[index] !== "undefined") {
				element = _renderer[index](element);
			}
			var _td = $("<td></td>").append($("<div></div>").css("width", (_widths[index]-1)+"px").html(element))
					.attr("align", _aligns[index])
					.attr("width", _widths[index]);
			_tr.append(_td);
		});		
		_tbody.append(_tr);
	});

	 // console.info(_obj.height());
	 // console.info( _obj.find(".hyl-grid-thead").outerHeight())

	_obj.find(".hyl-grid-tbody").css("height", (_obj.height()-_obj.find(".hyl-grid-thead").outerHeight())+"px");

}


function hyl_select2(obj, data) {
	var id = UUID(16);

	console.info($(obj));
	var obj_top  = $(obj).offset().top;
	var obj_left = $(obj).offset().left;
	var obj_oheight = $(obj).outerHeight();
	var obj_owidth = $(obj).outerWidth();
	var h_interval = 2;

	$("body").append($("<div></div>").attr("id", id+""));
	var dom = $("body").children('#'+id);
	console.info(dom);
	dom.css({
		'cursor': 'default',
		'position': "fixed",
		'top': (obj_top+obj_oheight+h_interval)+"px",
		'left': obj_left + "px",
		'width': obj_owidth+'px',
		'max-height': '180px',
		'border': '1px solid #D9D9D9',
		'border-radius': '3px',
		'overflow': 'auto',
		'font-size': '14px',
		'background-color':'white'
	}); 

	var key = $(obj).attr("key");
	$(data).each(function(index, el) {
		if (typeof key != 'undefined' && key == el.id){
			dom.append(
				$("<div></div>").addClass('row').addClass('selected').text(el.name).attr("key", el.id)
			);
		}else {
			dom.append(
				$("<div></div>").addClass('row').text(el.name).attr("key", el.id)
			);
		}
	});
	$("#"+id +" .row").css({
		'line-height': '14px',
		'padding': '3px'
	});

	$("#"+id +" .row").click(function(event) {
		$(this).addClass('selected');
		$(obj).val($(this).text());
		$(obj).attr("key", $(this).attr("key"));
		$("#"+id).remove();
	});
	
	
	$("#"+id + " .selected").css({
		'background-color': '#429742',
		'color': 'white'
	});

	/*焦点失去事件*/
	// $(obj).blur(function(event) {
	// 	$("#"+id).remove();
	// });
}


function hyl_table2(obj, conf) {
	obj = $(obj);
	obj.html('');
	_div = "<div></div>";
	table = $(_div).addClass('table');
	thead = $(_div).addClass('thead');
	tbody = $(_div).addClass('tbody');
	scrollw = getScrollWidth();

	tr = $(_div).addClass('tr');
	all_width = 0;
	$(conf.columns).each(function(index, el) {
		th = $(_div).addClass('th').text(el.name);
		th.css({
			'width': el.width+'px',
			'text-align': ''+el.align
		});
		tr.append(th);
		all_width = all_width + parseInt(el.width);
	});
	// th = $(_div).addClass('th').css('width', (scrollw-1)+'px');
	// tr.append(th);
	thead.append(tr);
	table.css('width', (all_width+1+scrollw)+'px');

	$(conf.datas).each(function(index, el) {
		row = el;
		tr = $(_div).addClass('tr');
		tr.attr('row', row['ID']);
		
		var status = row['STATUS'];
		var bkc = '';
		if (status == '已分配'){
			bkc = "";
		}else if (status == '已合并'){
			bkc = "color1";
		}else if (status == '已升级') {
			bkc = "color2";
		}else if (status == '已失效') {
			bkc = "color3";
		}else if (status == '基线问题') {
			bkc = "color4";
		}else{
			bkc = "color5";
		}
		bkc.length > 0 && tr.addClass(bkc);
		//tr.css('background-color', bkc);
		$(conf.columns).each(function(index, ell) {
			ele = row[ell.field];
			tb = $(_div).addClass('tb').text(ele);
			tb.css({
				'width': ell.width+"px",
				'text-align': ''+ell.align
			});
			tr.append(tb)
		});
		tbody.append(tr)		
	});

	table.append(thead);
	table.append(tbody);
	obj.append(table);
}