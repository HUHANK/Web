$(document).ready(function() {
    NavbarInit();
    hanqInit();
    
});



/*导航栏条的初始化*/
function NavbarInit() {
    $(".head > nav > a").click(function(event) {
        $(".head > nav > a.active").removeClass('active');
        $(this).addClass('active');
    });
}

/*行情界面初始化*/
function hanqInit() {
    var param = new Object();
    param.method = "get_stock_basics";
    res = sync_post_data(param);
    console.info(res);
}







/*#################################基础的共用函数######################################*/
function post_data(data, func, path="stock.py") {
    $.post(path, data, func);
}
function sync_post_data(data, path="stock.py") {
    var ret = false;
    $.ajax({
        url: path,
        async: false,
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(data),
    })
    .done(function(d) {
        console.log("success");
        ret = d;
    })
    .fail(function(data, type, err) {
        console.error("ajax错误类型: "+type);
        console.error(err);
    })
    .always(function() {
        console.log("complete");
    });
    return ret;
}