var MONTH_REPORT_ALL_INIT=false;

function MonthReportMain() {
    if (MONTH_REPORT_ALL_INIT) return;
    MonthReportInit();
    MonthReportEventInit();
}

function MonthReportChangeDaySelect() {
    var year = $(".body .monthly-report .container .overtime .col-edit-query .query1 .date .year").val();
    var month = $(".body .monthly-report .container .overtime .col-edit-query .query1 .date .month").val();
    var day = $(".body .monthly-report .container .overtime .col-edit-query .query1 .date .day");
    var days = getMonthDays(year, month);
    var i = 1;
    day.html("");
    for (i=1; i<=days; i++) {
        var opt = $("<option></option>").text(i+"");
        day.append(opt);
    }
}

function MonthReportInit() {
    $(".body .monthly-report .container .overtime .col-edit-query .query1 .date .year").val(getCurrentYear());
    $(".body .monthly-report .container .overtime .col-edit-query .query1 .date .month").val(getCurrentMonth());

    var i,j;
    $(".body .monthly-report .container .overtime .col-edit-query .query1 .group select").html("");
    $(".body .monthly-report .container .overtime .col-edit-query .query1 .user select").html("");
    $(".body .monthly-report .container .overtime .col-edit-query .query1 .group select").append($("<option></option>"));
    $(".body .monthly-report .container .overtime .col-edit-query .query1 .user select").append($("<option></option>"));
    for(i=0; i<g_ALL_GROUP.length; i++) {
        if (g_ALL_GROUP[i].depart_id != 1) continue;
        var opt = $("<option></option>").text(g_ALL_GROUP[i].name);
        $(".body .monthly-report .container .overtime .col-edit-query .query1 .group select").append(opt);
        var optgroup = $("<optgroup></optgroup>").attr("label", g_ALL_GROUP[i].name);
        for(j=0; j<g_ALL_USER.length; j++) {
            if (g_ALL_USER[j].group_id == g_ALL_GROUP[i].id) {
                optgroup.append($("<option></option>").text(g_ALL_USER[j].cname));
            }
        }
        $(".body .monthly-report .container .overtime .col-edit-query .query1 .user select").append(optgroup);
    }

    $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .date").datepicker({
        showButtonPanel: true,
        changeMonth: true,
        changeYear: true,
        showWeek: true,
        firstDay: 1,
        dateFormat: "yy-mm-dd"
    });
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

    $(".body .monthly-report .container .overtime .col-edit-query .query1 .date .year").change(function(event) {
        MonthReportChangeDaySelect();
    });
    $(".body .monthly-report .container .overtime .col-edit-query .query1 .date .month").change(function(event) {
        MonthReportChangeDaySelect();
    });

    $(".body .monthly-report .container .overtime .col-edit-query .edit1 .opt button").click(function(event) {
        if ($(this).hasClass('selected')) return;
        $(this).parent().find(".selected").removeClass('selected');
        $(this).addClass('selected');

        $(this).parent().next().show();
    });

    $(".body .monthly-report .container .overtime .col-edit-query .edit1 .edit-box .foot button").click(function(event) {
        $(this).parent().parent().hide();
        $(".body .monthly-report .container .overtime .col-edit-query .edit1 .opt button.selected").removeClass('selected');
    });
}