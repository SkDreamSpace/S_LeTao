$(function () {
    //使用表单校验插件
    var $form = $('#login');
    $form.bootstrapValidator({

        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        fields: {
            //校验用户名，对应name表单的name属性
            username: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '用户名不能为空'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: '密码长度6-12位'
                    }
                }
            }
        }

    });

    //给表单注册校验成功事件
    $form.on('success.form.bv', function (e) {
        //阻止默认事件
        e.preventDefault();
        //使用ajax提交逻辑
        $.ajax({
            type:'post',
            url:'/employee/employeeLogin',
            data: $form.serialize(),
            success: function(info){
                if(info.success){
                    location.href = 'index.html';
                }
                if(info.error === 1000){
                    $form.data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
                }
                if(info.error === 1001){
                    $form.data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
                }
            }
        });
    });

    //重置样式
    $("[type='reset']").on("click", function () {

        //重置样式
        $form.data("bootstrapValidator").resetForm();

    });
});