//进度条
//关闭进度环
NProgress.configure({ showSpinner: false });

$(document).ajaxStart(function () {
    NProgress.start();
});

$(document).ajaxStop(function () {
    NProgress.done();
});

$('.child').prev().on('click',function () {
    $(this).next().slideToggle();
});

$(".icon_menu").on("click", function () {
    $(".lt_aside").toggleClass("now");
    $(".main").toggleClass("now");
});

$(".icon_logout").on("click", function () {
    $("#loginoutModal").modal("show");


    //给退出按钮注册事件, off:解绑所有的事件
    $(".btn_logout").off().on("click", function () {
        //console.log("Hehe");
        //发送ajax请求，退出系统
        $.ajax({
            type:"get",
            url:"/employee/employeeLogout",
            success:function (data) {
                if(data.success){
                    //退出成功
                    location.href = "login.html";
                }
            }
        });
    });
});

