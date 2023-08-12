$.ajaxPrefilter(function (options) {
    // console.log(options.url);
    options.url = 'http://www.liulongbin.top:3007' + options.url

    // 统一为有权限接口，设置token请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }

    }

    options.complete = function (res) {

        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份验证失败！') {
            // 1.强制清空token
            localStorage.removeItem('token')
            // 2.强制跳转到登录页面
            location.href('/login.html')
        }

    }

})