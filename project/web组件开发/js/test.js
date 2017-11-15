window.onload = main;

function main() {
	console.log('AAAAAAAAAA');

	DropDownBox($("#select1"));

}

function uuid(num) {
    var len = num || 10, str = "", arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    for (var i = 0; i < len; i++) str += arr[Math.round(Math.random() * (arr.length - 1))];
    return str;
};

var g_SELECT_DROP_BOX_ID = "hylseldropbox" + uuid(18);

function DropDownBox(obj) {
	var html = '<input class="hyl-select" type="text">';
	$(obj).hide();
	$(obj).after(html);
	var sel = $(obj).next();

	sel.focus(function(event) {
		var top  = $(this).offset().top + $(this).outerHeight()+2;
		var left = $(this).offset().left;

		var DropBox = $("body").find("#"+g_SELECT_DROP_BOX_ID);

		if (DropBox.length <= 0) {
			DropBox = $("<div id='"+ g_SELECT_DROP_BOX_ID +"'></div>");
			DropBox.addClass("hyl-select-box");
			$("body").append(DropBox);
		}
		DropBox.html("");
		$(this).prev().children().each(function(index, val) {
			var unit = $('<div class="hyl-select-unit">'+ $(val).val() +'</div>');
			DropBox.append(unit);
		});
		console.info($(this));
		var padding = DropBox.innerWidth() - DropBox.width();
		console.info(padding);
		DropBox.css({
			"width": ($(this).innerWidth()-padding)+"px",
			"top": top+"px",
			"left": left + "px"
		});
		DropBox.children('.hyl-select-unit').click(function(event) {
			$(this).addClass("selected");
			$(this).parent().prev().val($(this).text());
			console.info($(this).text());
			console.info($(this).parent().prev());
		});
		DropBox.slideDown("fast");
	});

	sel.blur(function(event){
		var DropBox = $("#"+g_SELECT_DROP_BOX_ID);
		DropBox.slideUp("fast");
	});
}