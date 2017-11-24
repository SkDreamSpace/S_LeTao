$(function(){
    var currentPage = 1;
    var pageSzie = 5;

    function rander(){
        $.ajax({
            type:'get',
            url:'/category/querySecondCategoryPaging',
            data:{
                page:currentPage,
                pageSize:pageSzie
            },
            success:function(info){
                console.log(info)
                $('tbody').html(template('tmp',info));

                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    currentPage:currentPage,
                    totalPages:Math.ceil(info.total/info.size),
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
            url:'/category/queryTopCategoryPaging',
            data:{
                page:1,
                pageSize:100
            },
            success:function(info){
                console.log(info)
                $('.dropdown-menu').html(template('tmp1',info));
            }
        });
    });

    var $form = $("#form");
    $('.dropdown-menu').on('click','a',function(){
        $('#dropdownMenu1').text($(this).text());

        $("[name='categoryId']").val( $(this).data("id") );
        $form.data("bootstrapValidator").updateStatus("categoryId", "VALID");
    });

    $("#fileupload").fileupload({
        dataType:"json",//指定响应的格式
        done:function (e, data) {//图片上传成功之后的回调函数
          //通过data.result.picAddr可以获取到图片上传后的路径
          console.log(data);
          console.log(data.result.picAddr);
    
          //设置给img_box中img的src属性
          $(".img_box img").attr("src", data.result.picAddr);
    
          //把图片的地址赋值给brandLogo
          $("[name='brandLogo']").val( data.result.picAddr );
    
          //把brandLogo改成成功
          $form.data("bootstrapValidator").updateStatus("brandLogo", "VALID");
        }
      });

      $form.bootstrapValidator({
        excluded:[],//不校验的内容
        feedbackIcons:{
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
        },
        //校验规则
        fields:{
          categoryId:{
            validators:{
              notEmpty:{
                message:"请选择一级分类"
              }
            }
          },
          brandName:{
            validators:{
              notEmpty:{
                message:"请输入二级分类的名称"
              }
            }
          },
          brandLogo:{
            validators:{
              notEmpty:{
                message:"请上传品牌图片"
              }
            }
          }
        }
      });
    
    
      //给表单注册校验成功事件
      $form.on("success.form.bv", function (e) {
        e.preventDefault();
    
        //发送ajax
        $.ajax({
          type:"post",
          url:"/category/addSecondCategory",
          data:$form.serialize(),
          success:function (info) {
            if(info.success){
              //成功了
              //1. 关闭模态框
              $("#addModal").modal("hide");
              //2. 重新渲染第一页
              currentPage = 1;
              rander();
    
    
              //3. 重置内容和样式
              $form[0].reset();
              $form.data("bootstrapValidator").resetForm();
    
              //4. 重置下拉框组件和图片
              $(".dropdown-text").text("请选择一级分类");
              $("[name='categoryId']").val('');
              $(".img_box img").attr("src", "img/none.png");
              $("[name='brandLogo']").val('');
          }
          }
        });
    
      })
});