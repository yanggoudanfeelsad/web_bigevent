$(function(){
    var form = layui.form
    var layer = layui.layer

    form.verify({
        nickname: function (val) {
            if (val.length > 6) {
                return '名称长度必须在1到6个字符之间'
            }
        }
    })
    initUserInfo()

    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                console.log(res);
                // 调用form.val可以快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    
    // 重置表单的数据
    $('#btnReset').on('click', function (e) {
        e.preventDefault()

        initUserInfo()
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit',function(e){
        e.preventDefault()

        $.ajax({
            method:"POST",
            url:"my/userinfo",
            data:$(this).serialize(),
            success:function (res) {
                if(res.status !== 0){
                    return layer.msg('修改用户信息失败')
                }
                layer.msg('修改用户信息成功')
                // 调用父页面的方法，重新渲染用户的头像信息
                window.parent.getUserInfo()
            }
        })
    })  
})






