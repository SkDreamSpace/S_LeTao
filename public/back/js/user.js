$(function(){
    var currentPage = 1;
    var pageSize = 5;

    function render(){
        $.ajax({
            type:'get',
            url:'/user/queryUser',
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            success:function(info){
                // console.log(info);
                $('tbody').html(template('tmp',info));

                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    currentPage:currentPage,
                    totalPages:Math.ceil(info.total/pageSize),
                    onPageClicked:function(a,b,c,page){
                        currentPage = page;
                        render();
                    }
                });
            }
        });
    }
    render();

    // 事件委托
    $('tbody').on('click','.btn',function(){
        $('#userModal').modal('show');

        var id = $(this).parent().data('id');
        var isDelete = $(this).hasClass("btn-danger")?0:1;

        $('.btn_confirm').on('click',function(){
            $.ajax({
                type:'post',
                url:'/user/updateUser',
                data:{
                    id:id,
                    isDelete:isDelete
                },
                success:function(info){
                    // console.log(info)
                    if(info.success){
                        $('#userModal').modal('hide');

                        render();
                    }
                }
            });
        });
    });
});