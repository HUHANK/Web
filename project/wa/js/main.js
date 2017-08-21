window.onload = main;

function main() {
	//resize
	resize();
	window.onresize = resize;
	//init
	initTitle();



}

function resize() {
	var bodyWidth = document.body.clientWidth;
	var leftWidth = 80;
	var leftHeight = 700;
	var topHeight = 40;
	var rightHeight = leftHeight - topHeight;

	$("#iframe_left").css({
		width: leftWidth,
		height: leftHeight
	});

	$("#iframe_top").css({
		width: (bodyWidth - leftWidth),
		height: topHeight
	});

	$("#iframe_right").css({

		width: (bodyWidth - leftWidth),
		height: rightHeight
	});

}

function initTitle() {
	var ifr_left_div_bcolor = '#FFFFFF';
	var mouse_over_color = '#A8B3FC';

	$("#iframe_left_div").css({
		'background-color': ifr_left_div_bcolor
	});
	$("#iframe_left div").mouseover(function(event) {
		/* Act on the event */
		$(this).css({
			'background-color': mouse_over_color
		});
	});
	$("#iframe_left div").mouseout(function(event) {
		/* Act on the event */
		$(this).css({
			'background-color': ifr_left_div_bcolor	
		});
	});
}

function grid() {

}

function getConfig(Key1, Key2) {

}




































