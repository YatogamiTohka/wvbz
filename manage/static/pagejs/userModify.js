layui.use(['form', 'layer'], function() {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery;

    var doType = $.trim(getUrlParam('do'));

    //字段容器
    var userName = $('input[name=userName]'),
        password = $('input[name=password]'),
        mobile = $('input[name=mobile]'),
        trueName = $('input[name=trueName]'),
        sex = $('input[name=sex]'),
        companyName = $('input[name=companyName]'),
        companyTel = $('input[name=companyTel]');

    //初始化 TODO

    //新增
    if (doType === 'add') {

    }
    //修改
    else
    if (doType === 'edit') {
        var id = Number($.trim(getUrlParam('id')));

        console.log(id);

        //通过接口获取数据 TODO
        //例子
        userName.val('hanmeimei').prop('disabled', true);
        password.val('123456789').attr('type', 'password').prop('disabled', true);
        mobile.val('13612345678');
        trueName.val('韩妹妹');
        sex.val('女').prop('checked', true);
        form.render('radio');
    }

    //表单提交
    form.on('submit(submit)', function(data) {
        console.log(data.field);

        var saveField = data.field;

        //通过接口保存数据 TODO

    });

});