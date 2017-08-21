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
	// var iframe_left = $("#iframe_left");
	// iframe_left.append('<div><h2>自选</h2></div>');
	// iframe_left.append('<div><h2>个股</h2></div>');

	// $("#iframe_left div h2").css({
	// 	margin: '0',
	// 	padding: '10px 2px'
	// });
}

function mouseOnTitle() {
	
}




































