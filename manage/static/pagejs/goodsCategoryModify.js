layui.use(['form', 'layer', 'upload'], function() {
    var form = layui.form,
        layer = layui.layer,
        upload = layui.upload,
        $ = layui.jquery;

    var doType = $.trim(getUrlParam('do'));

    //字段容器
    var category = $('input[name=category]'),
        property = $('input[name=property]'),
        image = $('input[name=image]'),
        sort = $('input[name=sort]'),
        status = $('input[name=status]');

    //初始化 TODO
    uploadImages(layer, upload, $, $('.sys-upload'), {
        url: '/upload/',
        // multiple: false  //多选为true，默认单选false
    });

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
        // userName.val('hanmeimei').prop('disabled', true);
        // password.val('123456789').attr('type', 'password').prop('disabled', true);
        // mobile.val('13612345678');
        // trueName.val('韩妹妹');
        // sex.val('女').prop('checked', true);
        // form.render('radio');
    }

    //表单提交
    form.on('submit(submit)', function(data) {
        console.log(data.field);

        var saveField = data.field;

        //通过接口保存数据 TODO

    });

});