layui.use(['form', 'layer'], function() {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery;

    var doType = $.trim(getUrlParam('do'));

    //字段容器
    var userId = $('input[name=userId]'),
        userPwd = $('input[name=userPwd]'),
        mobile = $('input[name=mobile]'),
        userName = $('input[name=userName]'),
        sex = function(val){
            return $('input[name=sex][value='+ val +']');
        },
        city = $('input[name=city]'),
        companyName = $('input[name=companyName]'),
        companyTel = $('input[name=companyTel]');

    //修改
    if (doType === 'edit') {
        var id = Number($.trim(getUrlParam('id')));

        userId.prop('disabled', true);
        userPwd.prop('disabled', true).attr('type', 'password');

        //通过接口获取数据 TODO
        $.ajax({
            type: 'get',
            url: path + '/user/' + id,
            dataType: "json",
            contentType: "application/json",
            data: {},
            success: function(d) {
                var code = d.code,
                    msg = d.msg,
                    objects = d.objects;

                if (code === 'SUCCESS') {
                    userId.val(objects.userId || '');
                    userPwd.val(objects.userPwd || '');
                    mobile.val(objects.mobile || '');
                    userName.val(objects.userName || '');
                    sex(objects.sex || 1).prop('checked', true);
                    city.val(objects.city || '');
                    companyName.val(objects.companyName || '');
                    companyTel.val(objects.companyTel || '');
                    form.render('radio');
                }
            }
        });
    }

    //表单提交
    form.on('submit(submit)', function(data) {
        var saveField = data.field;
        if (!saveField.userPwd) saveField.userPwd = '888888';

        var url = '/user/add',
            method = 'post';

        saveField = JSON.stringify(saveField);

        if (doType === 'edit') {
            url = '/user/' + id;
            method = 'put';
        }

        //通过接口保存数据 TODO
        $.ajax({
            type: method,
            url: path + url,
            dataType: "json",
            contentType: "application/json",
            data: saveField,
            success: function(d) {
                var code = d.code,
                    msg = d.msg,
                    objects = d.objects;

                if (code === 'SUCCESS') {
                    parent.layer.alert('保存成功', {
                        yes: function() {
                            parent.layer.closeAll();
                            iframeId.refreshTableList();
                        }
                    });
                } else {
                    layer.msg('保存失败');
                    return false;
                }
            }
        });
        return false;
    });

});