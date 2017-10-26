window.onload = main;


function main() {

	if (!Support_for_browser_validation()){
		alert("本版本暂不支持该浏览器，请换成谷歌，火狐或者Safari浏览器使用！");
		return ;
	}

	$(".log-box-c button").click(function(){
		var data = new Object();
		data.UserName = $("#username").val();
		data.PassWord = $("input[type=password]").val();
		data = JSON.stringify(data);

		post_data("/login/", data, function(d){
			ret = $.parseJSON(d);
			console.info(ret);
			if (ret.result == "OK") {
				$.cookie("htzq_SessionID", ret.sessionid, { expires: 1 });
				window.location.href = "zbxt.html";
			}
			else
			{
				$("#tishi").text(ret.note);
				alert(ret.note);
			}
		});
	});

	initLoginBox();

	$(window).resize(function(event) {
		initLoginBox();
	});

}

function initLoginBox() {

	wheight = $(window).height();
	wwidth = $(window).width();

	hheight = $(".wrap .header").height();
	$(".wrap .body").width(wwidth);
	$(".wrap .body").height(wheight-hheight - 60);

	bheight = $(".wrap .body").height();
	bwidth = $(".wrap .body").width();

	lwidth = $(".wrap .body .log-box").width();
	lheight = $(".wrap .body .log-box").height();

	left = (bwidth - lwidth)/2;
	stop = (bheight - lheight)/2;

	$(".wrap .body .log-box").css({
		"top": stop,
		"left": left
	});
}