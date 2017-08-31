window.onload = main;


function main() {

	$('.yj').children('li').each(function(index, el) {
		$(el).children('div').css({
			'background': "black",
			'color': 'white'
		});	

		$(el).children('.ej').children('li').each(function(id, ele){
			$(ele).children('div').css({
				'background': "gray",
				'color': 'white'
			});
		});
	});

	$('.sidebar li div').click(function(){
		console.log($(this).attr('class'));
		if( $(this).attr('class') == 'inactive' ) {
			$(this).removeClass('inactive');
			$(this).addClass('inactives');
			$(this).siblings().css("display", "block");
		}
		else if ( $(this).attr('class') == 'inactives' ) {
			$(this).attr("class", 'inactive');
			$(this).siblings().css("display", "none");
		}
	});

	var headers = new Array();
	var i = 0;
	headers[i++] = "ID";
	headers[i++] = "系统模块";
	headers[i++] = "类型";
	headers[i++] = "跟踪号";
	headers[i++] = "工作内容";
	headers[i++] = "性质";
	headers[i++] = "人员";
	headers[i++] = "进度";
	headers[i++] = "开始日期";
	headers[i++] = "后续人日";
	headers[i++] = "备注";

	var datas = $.parseJSON(TDatas);

	draw_table($(".main"), headers, datas);

}