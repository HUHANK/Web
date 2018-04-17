window.onload = main;

function main(){
	SidebarEventInit();
	SidebarSizeInit();
	window.onrezie = function() {
		SidebarSizeInit();
	}
}

function SidebarSizeInit() {
	$("body .sidebar").css("height", $(window).height()+"px");
}

function SidebarEventInit(){
	$(".sidebar .title").click(function(event) {
		var _speed = 300;
		$(this).next().slideToggle(_speed);
	});

	$(".sidebar .leaf").click(function(event) {
		$(".sidebar .leaf.selected").removeClass('selected');
		$(this).addClass('selected');
	});
}