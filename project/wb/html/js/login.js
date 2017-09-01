window.onload = main;


function main() {

	$(".log-box-c button").click(function(){
		console.info($(this));
		console.info($("input[type=password]").val());
		//console.info(ar);
		console.info($("#username").val());
		
		window.location.href = "zbxt.html";
	});
}