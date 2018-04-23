// window.onload = main;
jQuery(document).ready(function($) {
	main();
});
NowSelItem = '';


function main(){
	SidebarEventInit();
	SidebarSizeInit();
	window.onrezie = function() {
		SidebarSizeInit();
	}

}

function SidebarSizeInit() {
	//console.info($(parent.document.body).find(".sjwh"));
	// var h = $(parent.document.body).find(".sjwh").innerHeight() - 4;
	// var w = $(parent.document.body).find(".sjwh").innerWidth();
	//console.info(w);
	// $(".wrap").height(h);
	// $(".wrap .wrap1").height(h);
	// $(".wrap .wrap1").width(w - $(".wrap .sidebar").outerWidth());
	// parent.window.onload = function(){
	// 	var height = $($(this)[0].document.body).find(".sjwh").height();
	// 	$(".wrap").height(height);
	// 	$(".wrap .wrap1").height(height);
	// }
}

function SidebarEventInit(){
	//$(".wrap .wrap1").children('div').css("display", "none");
	/*-----------------------------------------------*/
	NowSelItem = $.cookie('SystemSidebarSelItem')
	if (typeof NowSelItem != 'undefined' && NowSelItem != ''){
		$(".wrap .sidebar .leaf."+NowSelItem).addClass('selected');
		$(".wrap .wrap1 ."+NowSelItem).show(100);
	}
	
	/*-----------------------------------------------*/
	$(".sidebar .title").click(function(event) {
		var _speed = 300;
		$(this).next().slideToggle(_speed);
	});

	$(".sidebar .leaf").click(function(event) {
		var sel = $(this).attr("class").split(' ')[1];
		var tmp = ".wrap .wrap1 ."+sel;
		$(".wrap .sidebar .leaf.selected").removeClass('selected');
		$(this).addClass('selected');
		if (NowSelItem == sel || NowSelItem == ''){}
		else{
			$(".wrap .wrap1 ."+NowSelItem).hide(10, function() {});
			// $(".wrap .sidebar .leaf."+NowSelItem).removeClass('selected');
			// $(".wrap .sidebar .leaf."+sel).addClass('selected');
		}
		$(tmp).show(1, function() {});
		NowSelItem = sel;
		$.cookie('SystemSidebarSelItem', NowSelItem);
	});
}