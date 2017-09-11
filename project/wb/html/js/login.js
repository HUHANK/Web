window.onload = main;


function main() {

	$(".log-box-c button").click(function(){
		var data = new Object();
		data.UserName = $("#username").val();
		data.PassWord = $("input[type=password]").val();
		data = JSON.stringify(data);

		post_data("/login/", data, function(d){
			ret = $.parseJSON(d);
			console.info(ret);
			if (ret.result == "OK") {
				$.cookie("htzq_SessionID", ret.sessionid);
				window.location.href = "zbxt.html";
			}
			else
			{
				$("#tishi").text(ret.note);
				alert(ret.note);
			}
		});
	});
}