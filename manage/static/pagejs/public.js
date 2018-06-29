layui.use(['form', 'layer'], function() {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery;

    //字段容器
    var webName = $('input[name=webName]'),
        webLogo = $('input[name=webLogo]'),
        copyRight = $('input[name=copyRight]'),
        contactName = $('input[name=contactName]'),
        contactMobile = $('input[name=contactMobile]'),
        exchangeRate = $('input[name=exchangeRate]');

    //初始化 TODO

    //通过接口获取数据 TODO
    //例子
    webName.val('深圳宝尚峰珠宝');
    webLogo.val('123456');
    copyRight.val('&copy; 2018 - 2020 无V不至 粤ICP备123456号 深圳宝尚峰珠宝');
    contactName.val('汤帅');
    contactMobile.val('13600000000');
    exchangeRate.val('7.65');

    //表单提交
    form.on('submit(submit)', function(data) {
        console.log(data.field);

        var saveField = data.field;

        //通过接口保存数据 TODO

    });

});