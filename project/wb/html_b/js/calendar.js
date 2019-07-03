var CalendarHasInit = false;

function CalendarMain() {
    if (CalendarHasInit) return;
    CalendarWinResize();
    CalendarInit();

    CalendarHasInit = true;
}


function CalendarInit() {
    
}

function CalendarWinResize() {
    wheight = $(window).height();
    var h1 = $("body .wrapper-top").height();
    //console.info(h1);
    $("body .body .calendar").height(wheight-h1);
}
