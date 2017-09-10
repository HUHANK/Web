window.onload = function(){
	var date = new Date();
	date.setDate(1);
	date.setMonth(8);
	console.info(date);

	date=new Date();
 	var currentMonth=date.getMonth();
 	var nextMonth=++currentMonth;
 	var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
 	var oneDay=1000*60*60*24;
 	console.info( new Date(nextMonthFirstDay-oneDay) );
}