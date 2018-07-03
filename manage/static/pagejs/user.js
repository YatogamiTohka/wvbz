layui.use(['form', 'layer', 'table'], function() {
    var form = layui.form,
        layer = layui.layer,
        table = layui.table,
        $ = layui.jquery;

    //初始化数据
    setTableList({});

    //搜索
    form.on('submit(search)', function(data) {
        var saveField = data.field;
        if (!saveField.status) saveField.status = null;
        setTableList(saveField);
    });

    //表格数据
    function setTableList(saveField) {
        //初始化表格分页和高度
        var pageSize = 20,
            tableHeight = 'full-151';

        var tableOptions = setTableOptions({
            url: path + '/user/page',
            where: saveField,
            limit: pageSize,
            height: tableHeight,
            cols: [
                [{
                    checkbox: true,
                    width: 40,
                    fixed: true
                }, {
                    field: 'id',
                    title: 'ID',
                    width: 60,
                    align: 'center',
                    fixed: true
                }, {
                    field: 'userId',
                    title: '用户名',
                    width: 100,
                    fixed: true
                }, {
                    field: 'mobile',
                    title: '手机',
                    width: 110,
                    align: 'center',
                    fixed: true
                }, {
                    field: 'shippingAddress',
                    title: '收货地址',
                    width: '20%',
                    minWidth: 200,
                    templet: function(d) {
                        var address = d.shippingAddress,
                            addressText = [];

                        if (address && address.length) {
                            $.each(address, function(key, item) {
                                var itemText = '地址' + (key + 1) + '（' + (item.receiver || '--') + '，' + (item.receiverMobile || '--') + '，' + (item.receiverAddress || '--') + '）<br>';
                                addressText.push(itemText);
                            });
                            return addressText.join('');
                        } else {
                            return '';
                        }
                    }
                }, {
                    field: 'userName',
                    title: '真实姓名',
                    width: 80
                }, {
                    field: 'sex',
                    title: '性别',
                    width: 50,
                    align: 'center',
                    templet: function(d) {
                        var sex = d.sex,
                            sexText = (sex == 1) ? '男' : '女';
                        return sexText;
                    }
                }, {
                    field: 'city',
                    title: '城市',
                    minWidth: 80
                }, {
                    field: 'companyName',
                    title: '公司信息',
                    minWidth: 150,
                    templet: function(d) {
                        var companyName = d.companyName || null,
                            companyTel = d.companyTel || null;

                        var itemText = '';
                        if (companyName && companyTel) {
                            itemText = companyName + '（' + companyTel + '）';
                        } else if (companyName && !companyTel) {
                            itemText = companyName;
                        } else if (!companyName && companyTel) {
                            itemText = companyTel;
                        }
                        return itemText;
                    }
                }, {
                    field: 'orderCount',
                    title: '订单量',
                    width: 60,
                    align: 'center',
                    templet: function(d) {
                        if (d.orderCount) {
                            return '<a title="查看该用户订单" href="propertyCategory.html" target="_self" class="text-orange">' + d.orderCount + '</a>';
                        } else {
                            return '0';
                        }
                    }
                }, {
                    field: 'status',
                    title: '状态',
                    width: 60,
                    align: 'center',
                    templet: function(d) {
                        if (d.status == 1) {
                            return '<a title="点击禁用" lay-event="updateStatus" class="text-orange">启用</a>';
                        } else {
                            return '<a title="点击启用" lay-event="updateStatus" class="text-gray">禁用</a>';
                        }
                    }
                }, {
                    field: 'createDate',
                    title: '创建时间',
                    minWidth: 150,
                    align: 'center',
                    templet: function(d) {
                        return new Date(d.createDate).format('yyyy-MM-dd hh:mm:ss');
                    }
                }, {
                    field: 'handle',
                    title: '操作',
                    minWidth: 180,
                    fixed: 'right',
                    align: 'center',
                    toolbar: '#tableHandleBar'
                }]
            ]
        });

        table.render(tableOptions);
    }

    //公共工具条事件
    var active = {
        //新增
        addData: function() {
            parent.layer.open({
                type: 2,
                title: '新增用户',
                shadeClose: true,
                shade: 0.3,
                area: ['600px', '550px'],
                content: 'userModify.html?do=add'
            });
        },
        //重置密码
        resetPassword: function() {
            var checkStatus = table.checkStatus('dataList'),
                data = checkStatus.data;

            var len = data.length;
            if (!len) {
                layer.msg('请选择用户');
            } else {
                var ids = [];
                $.each(data, function(key, item) {
                    ids.push(item.id);
                });

                parent.layer.confirm('确定要重置选中的用户密码吗？<br>重置后密码为888888', function(index) {
                    parent.layer.closeAll();

                    //TODO
                    var saveField = {
                        ids: ids
                    }
                    $.ajax({
                        type: 'post',
                        url: path + '/user/resetPwd',
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(saveField),
                        success: function(d) {
                            var code = d.code,
                                msg = d.msg,
                                objects = d.objects;

                            if (code === 'SUCCESS') {
                                refreshTableList();
                            } else {
                                return false;
                            }
                        }
                    });
                    return false;
                });
            }
        },
        //删除
        delData: function() {
            var checkStatus = table.checkStatus('dataList'),
                data = checkStatus.data;

            var len = data.length;
            if (!len) {
                layer.msg('请选择用户');
            } else {
                var ids = [];
                $.each(data, function(key, item) {
                    ids.push(item.id);
                });

                parent.layer.confirm('确定要删除选中的用户吗？', function(index) {
                    parent.layer.closeAll();

                    //TODO
                    var saveField = {
                        ids: ids
                    }
                    $.ajax({
                        type: 'post',
                        url: path + '/user/delete',
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(saveField),
                        success: function(d) {
                            var code = d.code,
                                msg = d.msg,
                                objects = d.objects;

                            if (code === 'SUCCESS') {
                                refreshTableList();
                            } else {
                                return false;
                            }
                        }
                    });
                    return false;
                });
            }
        }
    }

    $('.sys-handle-button-bar .layui-btn').on('click', function() {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    //单元格工具条事件
    table.on('tool(dataList)', function(obj) {
        var data = obj.data;

        //基本参数
        var id = data.id,
            userId = data.userId;

        //启用/禁用
        if (obj.event === 'updateStatus') {
            var status = data.status,
                statusText = (status) ? '禁用' : '启用';

            parent.layer.confirm('确定要' + statusText + '（' + userId + '）吗？', function(index) {
                parent.layer.closeAll();

                //TODO
                var saveField = {
                    id: id
                }
                $.ajax({
                    type: 'get',
                    url: path + '/user/use',
                    dataType: "json",
                    contentType: "application/json",
                    data: saveField,
                    success: function(d) {
                        var code = d.code,
                            msg = d.msg,
                            objects = d.objects;

                        if (code === 'SUCCESS') {
                            refreshTableList();
                        } else {
                            return false;
                        }
                    }
                });
                return false;
            });
        }
        //修改
        else if (obj.event === 'edit') {
            parent.layer.open({
                type: 2,
                title: '修改用户（' + userId + '）',
                shadeClose: true,
                shade: 0.3,
                area: ['600px', '550px'],
                content: 'userModify.html?do=edit&id=' + id
            });
        }
        //重置密码
        else if (obj.event === 'reset') {
            parent.layer.confirm('确定要重置（' + userId + '）的密码吗？<br>重置后密码为888888', function(index) {
                parent.layer.closeAll();

                //TODO
                var saveField = {
                    ids: [id]
                }
                $.ajax({
                    type: 'post',
                    url: path + '/user/resetPwd',
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(saveField),
                    success: function(d) {
                        var code = d.code,
                            msg = d.msg,
                            objects = d.objects;

                        if (code === 'SUCCESS') {
                            refreshTableList();
                        } else {
                            return false;
                        }
                    }
                });
                return false;
            });
        }
        //删除
        else if (obj.event === 'del') {
            parent.layer.confirm('确定要删除（' + userId + '）吗？', function(index) {
                parent.layer.closeAll();

                //TODO
                var saveField = {
                    ids: [id]
                }
                $.ajax({
                    type: 'post',
                    url: path + '/user/delete',
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(saveField),
                    success: function(d) {
                        var code = d.code,
                            msg = d.msg,
                            objects = d.objects;

                        if (code === 'SUCCESS') {
                            refreshTableList();
                        } else {
                            return false;
                        }
                    }
                });
                return false;
            });
        }
    });

    //表格刷新
    window.refreshTableList = function() {
        $('button[lay-filter="search"]').click();
    }
});