
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