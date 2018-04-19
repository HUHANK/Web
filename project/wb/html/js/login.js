window.onload = main;


function main() {

	if (!Support_for_browser_validation()){
		alert("本版本暂不支持该浏览器，请换成谷歌，火狐或者Safari浏览器使用！");
		return ;
	}

	$(".logbtn").click(function(){
		var data = new Object();
		data.UserName = $("#username").val();
		data.PassWord = $("input[type=password]").val();

		if (data.UserName.length < 1) {
			alert("用户名为空！")
			return;
		}

		if (data.PassWord.length < 1) {
			alert("用户密码为空！")
			return;
		}

		post_data("/login/", JSON.stringify(data), function(d){
			ret = $.parseJSON(d);
			if (ret.result == "OK") {
				$.cookie("htzq_SessionID", ret.sessionid, { expires: 1 });
				window.location = "zbxt.html";
			}
			else
			{
				$("#tishi").text(ret.note);
				alert(ret.note);
			}
		});
	});

	$("input#username").keydown(function(event) {
		/* Act on the event */
		if (event.keyCode == 13) {
			UserName = $("#username").val();
			PassWord = $("input[type=password]").val();
			if (UserName.length == 0) {
				$("#username").focus();
				return ;
			}
			if (PassWord.length == 0) {
				$("#passwd").focus();
				return ;
			}

			/*登陆相关*/
			var data = new Object();
			data.UserName = $("#username").val();
			data.PassWord = $("input[type=password]").val();

			post_data("/login/", JSON.stringify(data), function(d){
				ret = $.parseJSON(d);
				if (ret.result == "OK") {
					$.cookie("htzq_SessionID", ret.sessionid, { expires: 1 });
					window.location = "zbxt.html";
				}
				else
				{
					$("#tishi").text(ret.note);
					alert(ret.note);
				}
			});
		}
	});
	$("input#passwd").keydown(function(event) {
		/* Act on the event */
		if (event.keyCode == 13) {
			UserName = $("#username").val();
			PassWord = $("input[type=password]").val();
			if (UserName.length == 0) {
				$("#username").focus();
				return ;
			}
			if (PassWord.length == 0) {
				$("#passwd").focus();
				return ;
			}

			/*登陆相关*/
			var data = new Object();
			data.UserName = $("#username").val();
			data.PassWord = $("input[type=password]").val();

			post_data("/login/", JSON.stringify(data), function(d){
				ret = $.parseJSON(d);
				if (ret.result == "OK") {
					$.cookie("htzq_SessionID", ret.sessionid, { expires: 1 });
					window.location = "zbxt.html";
				}
				else
				{
					$("#tishi").text(ret.note);
					alert(ret.note);
				}
			});
		}
	});

	initLoginBox();

	$(window).resize(function(event) {
		initLoginBox();
	});

}

function initLoginBox() {

	wheight = $(window).height();
	wwidth = $(window).width();

	$("body").height(wheight);

}