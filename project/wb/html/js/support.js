
function Support ( ) {
	
}

function InitSupport ( ) {
	SuportRepaint();
	init_add_record();
	$(".support").bind("contextmenu",function(e){
   		return false;
 	});
 	$("body .mouse-right-down").bind("contextmenu",function(e){
   		return false;
 	});
}

function SuportRepaint () {
	wheight = $(window).height();
	wwidth = $(window).width();

	qheight = wheight - $("body .wrapper-top").height();

	$(".support .wrap").css("height", qheight+"px");
	$(".support .wrap .show").css("height", ($(".support .wrap").height() 
		- $(".support .wrap .option").outerHeight()) + "px");
}

function SupportMouseRightDown(e) {
	var dropbox = $("body .mouse-right-down");

	// console.info(e);
	// console.info(e.clientX, e.clientY);
	dropbox.css("top", e.clientY+"px")
			.css("left", e.clientX+"px");
	dropbox.slideDown(200, function() {
		
	});

	dropbox.focus();

	$("body").click(function(event) {
		/* Act on the event */
		setTimeout(function(){
			$("body .mouse-right-down").slideUp(100);
			$("body").unbind('click');
		}, 100);
	});

	$(document).on("scroll", function(ev) {
		//console.info(ev);
		setTimeout(function(){
			$("body .mouse-right-down").slideUp(100);
			$(document).unbind('scroll');
		}, 1);
	});

	return false;
}

function init_add_record ( ) {
	
	var system = g_ALL_SYSTEM.data;
	var data = [];
	$(system).each(function(index, el) {
		data.push(el.name);		
	});
	
	hyl_select($(".support .add-record .system"), data, system_selected);

	$(".support .add-record .module").append($("<input type='text' name='' readonly='readonly'>"));

	function system_selected( ele ){
		$(system).each(function(index, el) {
			if (el.name === $(ele).text()) {
				
				if (el.data.length >= 1){
					var d = [];
					$(el.data).each(function(index, ell) {
						d.push(ell.name);
					});
					hyl_select($(".support .add-record .module"), d); 
				}else{
					$(".support .add-record .module").html($("<input type='text' name='' readonly='readonly'>"));
				}
			}
		});
	}

	$('.support .wrap .show').mousedown(function(e){
		//console.info(e.which); // 1 = 鼠标左键 left; 2 = 鼠标中键; 3 = 鼠标右键
		if (e.which == 3) {
			SupportMouseRightDown(e);
		}
		return false;//阻止链接跳转
	});

	$('.support .wrap .option button.add').click(function(event) {
		/* Act on the event */
		var tb = $("body").children(".hyl-bokeh");
		tb.addClass("hyl-show");

		$(".support .add-record").find("legend").text('添加Support包记录');
		$(".support .add-record").addClass('show');
	});

	$('.support .wrap .option button.upt').click(function(event) {
		/* Act on the event */
		var tb = $("body").children(".hyl-bokeh");
		tb.addClass("hyl-show");

		$(".support .add-record").find("legend").text('更新Support包记录');
		$(".support .add-record").addClass('show');
	});
	

}