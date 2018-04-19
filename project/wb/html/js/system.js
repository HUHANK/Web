window.onload = main;
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
	var h = $(parent.document.body).find(".sjwh").height();
	$(".wrap").height(h);
	parent.window.onload = function(){
		var height = $($(this)[0].document.body).find(".sjwh").height();
		$(".wrap").height(height);
	}
}

function SidebarEventInit(){
	$(".wrap .wrap1").children('div').css("display", "none");
	/*-----------------------------------------------*/
	NowSelItem = $.cookie('SystemSidebarSelItem')
	if (NowSelItem.length != 0){
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
			$(".wrap .wrap1 ."+NowSelItem).hide(100, function() {});
			// $(".wrap .sidebar .leaf."+NowSelItem).removeClass('selected');
			// $(".wrap .sidebar .leaf."+sel).addClass('selected');
		}
		$(tmp).show(100, function() {});
		NowSelItem = sel;
		$.cookie('SystemSidebarSelItem', NowSelItem);
	});
}