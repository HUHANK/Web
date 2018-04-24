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
		switch(NowSelItem){
			case 'xzb':
			xzb_init();
			break;
		}
	});
}

function xzb_init() {
	var param = new Object();
	param.method = "GET_ALL_DICT"

	sync_post_data("/system_set/", JSON.stringify(param), function(d) {
		console.info(d);
		if (d.ErrCode != 0) {
			alert(d.msg);
		}
		var data = d.data;
		var propertys = data['性质'];
		var types = data['类型'];
		var systems = data['系统'];
		/*类型*/
		var dom = $(".wrap1 .xzb .type .body");
		dom.html('');
		$(types).each(function(index, el) {
			var tmp = $("<p></p>").text(el['name']).addClass('row').attr("key", el['id']);
			dom.append(tmp);
		});
	 	$(".wrap1 .xzb .type .option button").click(function(event) {
			if ($(this).attr("class") == 'add'){
				/*添加*/
				
			}else if ($(this).attr("class") == 'upt'){
				/*跟新*/
				
			}else if ($(this).attr("class") == 'del'){
				/*删除*/

			}
	 	});
		/*性质*/
		var dom = $(".wrap1 .xzb .property .body");
		dom.html('');
		$(propertys).each(function(index, el) {
			var tmp = $("<p></p>").text(el['name']).addClass('row').attr("key", el['id']);
			dom.append(tmp);
		});

		/*系统*/
		var dom = $(".wrap1 .xzb .system .body");
		dom.html('');
		$(systems).each(function(index, el) {
			var tmp = $("<p></p>").text(el['name']).addClass('row').attr("key", el['id']);
			dom.append(tmp);
		});

		/*单击事件*/
		var dom = $(".wrap1 .xzb .type .body .row");
		dom.click(function(event) {
			$(this).parent().find(".selected").removeClass('selected');
			$(this).addClass('selected');
		});
		var dom = $(".wrap1 .xzb .property .body .row");
		dom.click(function(event) {
			$(this).parent().find(".selected").removeClass('selected');
			$(this).addClass('selected');
		});
		var dom = $(".wrap1 .xzb .system .body .row");
		dom.click(function(event) {
			$(this).parent().find(".selected").removeClass('selected');
			$(this).addClass('selected');
			var id = $(this).attr("key");

			//$(".wrap1 .xzb .module").hide(1);
			$(".wrap1 .xzb .module .head").text('');
			$(".wrap1 .xzb .module .body").html('');
			$(systems).each(function(index, el) {
				if (el['id'] == id) {
					var dd = el['data']
					$(".wrap1 .xzb .module .head").text(el['name']);
					if (dd.length > 0){
						//$(".wrap1 .xzb .module").show(1);
						$(dd).each(function(index, ell) {
							var tmp = $("<p></p>").text(ell['name']).addClass('row').attr("key", ell['id']);
							$(".wrap1 .xzb .module .body").append(tmp);
						});
						$(".wrap1 .xzb .module").ready(function() {
							$(".wrap1 .xzb .module .body .row").click(function(event) {
								$(this).parent().find(".selected").removeClass('selected');
								$(this).addClass('selected');
							});
						});
					}
				}
			});
		});

	});
}