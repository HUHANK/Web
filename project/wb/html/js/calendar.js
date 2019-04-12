var CalendarHasInit = false;

function CalendarMain() {
    if (CalendarHasInit) return;
    CalendarInit();

    CalendarHasInit = true;
}

function CalendarInit() {
    CalendarAddEvent();
}

function CalendarAddEvent() {
    $(".ul-level-1 .li-level-1 label").click(function(event) {
        $(this).parent().next().slideToggle(400);

    });
}