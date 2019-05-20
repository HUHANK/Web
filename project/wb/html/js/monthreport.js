var MONTH_REPORT_ALL_INIT=false;

function MonthReportMain() {
    if (MONTH_REPORT_ALL_INIT) return;
    MonthReportEventInit();
}

function MonthReportEventInit() {
    $(".body .monthly-report .sidebar .unit").click(function(event) {
        event.stopPropagation();//阻止事件冒泡即可
        if ($(this).hasClass('sel')) return;
        $(this).parent().find(".sel").removeClass('sel');
        $(this).addClass('sel');
        var cls = $(this).attr("name");
        $(".body .monthly-report .container .sel").removeClass('sel');
        $(".body .monthly-report .container").find("."+cls).addClass('sel');
    });
}