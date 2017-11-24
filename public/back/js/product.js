$(function(){
    var currentPage = 1;
    var pageSize = 5;
    var imgs = [];
    
    function rander(){
        $.ajax({
            type:'get',
            url:'/product/queryProductDetailList',
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            success:function(info){
                // console.log(info)
                $('tbody').html(template('tmp',info));

                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    currentPage:currentPage,
                    totalPages:Math.ceil(info.total/pageSize),
                    onPageClicked:function(a,b,c,page){
                        currentPage = page;
                        rander();
                    }
                });
            }
        });
    }

    rander();

    $('.btn_add').on('click',function(){
        $('#addModal').modal('show');

        $.ajax({
            type:'get',
            url:'/category/querySecondCategoryPaging',
            data:{
                page:1,
                pageSize:100
            },
            success:function(info){
                // console.log(info);
                $('.dropdown-menu').html( template('tmp1',info) );
            }
        });
    });

    var $form = $('#form');
    // 设置下拉框显示
    $('.dropdown-menu').on('click','a',function(){
        $('#dropdownMenu1').text($(this).text());

        $('[name="brandId"]').val( $(this).data('id') );
        //手动设置状态
        $form.data("bootstrapValidator").updateStatus("brandId", "VALID");
    });

    $('#fileupload').fileupload({
        // 指定响应格式
        dataType:'json',
        // 图片上传成功后的回调函数
        done:function(e,data){
            // console.log(data);
            // console.log(data.result);
            if(imgs.length >= 3){
                return false;
            }

            $('.img_box').append('<img src="'+data.result.picAddr+'" width="100" height="100" alt="">');

            imgs.push(data.result);

            if(imgs.length === 3){
                $form.data('bootstrapValidator').updateStatus('productImg','VALID');
            }else{
                $form.data('bootstrapValidator').updateStatus('productImg','INVALID');
            }
        }
    });

    //表单校验
    $form.bootstrapValidator({
        excluded:[],//不校验的内容
        feedbackIcons:{
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        // 校验规则
        fields:{
            brandId:{
                validators:{
                    notEmpty:{
                        message:'请选择二级分类'
                    }
                }
            },
            proName:{
                validators:{
                    notEmpty:{
                        message:'请输入商品名称'
                    }
                }
            },
            proDesc:{
                validators:{
                    notEmpty:{
                        message:'请输入商品描述'
                    }
                }
            },
            num:{
                validators:{
                    notEmpty:{
                        message:'商品库存不能为空'
                    },
                    // 正则校验
                    regexp:{
                        regexp:/^[1-9]\d*$/,
                        message:'请输入合法的库存'
                    }
                }
            },
            size:{
                validators:{
                    notEmpty:{
                        message:'请输入商品尺码'
                    },
                    // 正则校验
                    regexp:{
                        regexp:/^\d{2}-\d{2}$/,
                        message:'请输入合法的尺码'
                    }
                }
            },
            oldPrice:{
                validators:{
                    notEmpty:{
                        message:'请输入原始价格'
                    }
                }
            },
            price:{
                validators:{
                    notEmpty:{
                        message:'请输入商品价格'
                    }
                }
            },
            productImg:{
                validators:{
                    notEmpty:{
                        message:'请选择上传三张照片'
                    }
                }
            }
        }
    });

    //表单校验成功事件
    $form.on('success.form.bv',function(e){
        e.preventDefault();
        var param = $form.serialize();
        param += '&picName1=' + imgs[0].picName + '&picAddr1=' + imgs[0].picAddr;
        param += '&picName1=' + imgs[1].picName + '&picAddr1=' + imgs[1].picAddr;
        param += '&picName1=' + imgs[2].picName + '&picAddr1=' + imgs[2].picAddr;

        $.ajax({
            type:'post',
            url:'/product/addProduct',
            data:param,
            success:function(info){
                // console.log(info);
                if(info.success){
                    $('#addModal').modal('hide');
                    currentPage = 1;
                    rander();

                    // console.log($form);
                    $form[0].reset();
                    $form.data('bootstrapValidator').resetForm();

                    $('.dropdown-text').text('二级分类');
                    $('[name="brandId"]').val('');
                    $('.img_box img').remove();
                    imgs = [];
                }
            }
        });
    });
});