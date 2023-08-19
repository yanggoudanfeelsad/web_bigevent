$(function () {
    var layer = layui.layer
    var form = layui.form
    initEditor()
    initCate()
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: 'my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // 调用模板引擎渲染下来菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用form.rendar方法
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    $('#btnChooseImage').on('click', function (res) {
        $('#coverFile').click()
    })
    // 监听coverFile 的Change事件，获取用户的文件
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        // 根据文件创建对应的url地址
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })
    var art_state = '已发布'
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    $('#form-pub').on('submit', function (e) {
        // 1.阻止表单的默认提交行为
        e.preventDefault()
        // 2.基于form表单快速创立一个FormData对象
        var fd = new FormData($(this)[0])
        fd.append('state', art_state)
        // 4.将封面裁剪之后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img',blob)
                // 6.发起ajax请求
                publishArticle(fd)
            })

    })

    function publishArticle(fd) {
        $.ajax({
            method:'POST',
            url:'/my/article/add',
            data:fd,
            // 如果想服务器提交的是formdata格式的数据，必须添加两个配置项
            contentType:false,
            processData:false,
            success:function(res){
                if(res.status !==0){
                    return layer.msg('发布文章失败')

                }
                layer.msg('发布文章成功')
                location.href = '/aticle/art_list.html'
            }
        })
        
    }
})