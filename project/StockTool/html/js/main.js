$(document).ready(function() {
    NavbarInit();
});

/*导航栏条的初始化*/
function NavbarInit() {
    $(".head > nav > a").click(function(event) {
        $(".head > nav > a.active").removeClass('active');
        $(this).addClass('active');
    });
}