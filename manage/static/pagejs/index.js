layui.use(['form', 'layer'], function() {
    var form = layui.form,
        layer = layui.layer;

    //字段容器
    var username = $('input[name=username]'),
        password = $('input[name=password]'),
        vercode = $('input[name=vercode]'),
        remember = $('input[name=remember]');

    //初始化
    if ($.cookie('remember') > 0) {
        username.val($.cookie('username'));
        remember.prop('checked', true);
        form.render('checkbox');
    }

    //表单提交
    form.on('submit(login)', function(data) {
        console.log(data.field);

        //记住用户名
        if (remember.is(':checked')) {
            $.cookie('username', username.val(), { expires: 30 });
            $.cookie('remember', 1, { expires: 30 });
        } else {
            $.cookie('username', '');
            $.cookie('remember', 0);
        }

        var saveField = data.field;

        //通过接口保存数据 TODO

        //登录成功后跳转
        window.location.href = 'main.html';

    });

});